"use client"

import * as React from "react"
import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { Plus, X, Play, Upload, Trash2, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AdminFloatingBar } from "./admin-floating-bar"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { supabase } from "@/lib/supabase"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ProjectMediaRow } from "@/lib/data/projects"

// ── Serializable project data passed from the server component ──

export interface AdminProjectData {
  id: string
  title: string
  slug: string
  description: string | null
  category: string | null
  tech_stack: string[] | null
  technical_specs: Record<string, string> | null
  project_media: ProjectMediaRow[]
}

// ── Internal state for tracking added media ──

interface AddedMediaItem {
  tempId: string
  file: File
  previewUrl: string
  mediaType: "image" | "video"
  caption: string
  uploadedUrl: string | null
}

// ── Helper: sanitize filename for storage ──

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export function AdminProjectWrapper({ project }: { project: AdminProjectData }) {
  const router = useRouter()

  // ── Edit Mode State ──
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // ── Editable fields ──
  const [editTitle, setEditTitle] = useState(project.title)
  const [editDescription, setEditDescription] = useState(project.description ?? "")
  const [editCategory, setEditCategory] = useState(project.category ?? "")
  const [editTechStack, setEditTechStack] = useState(
    (project.tech_stack ?? []).join(", ")
  )
  const [editSpecs, setEditSpecs] = useState<Record<string, string>>(
    project.technical_specs ?? {}
  )

  // ── Editable captions for existing media ──
  // Keyed by media row ID → caption string
  const [editCaptions, setEditCaptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const m of project.project_media ?? []) {
      initial[m.id] = m.caption ?? ""
    }
    return initial
  })

  // ── Media State ──
  const [existingMedia, setExistingMedia] = useState<ProjectMediaRow[]>(
    project.project_media ?? []
  )
  const [removedMediaIds, setRemovedMediaIds] = useState<string[]>([])
  const [addedMedia, setAddedMedia] = useState<AddedMediaItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Delete State ──
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // ── Original values for diffing ──
  const originalTitle = project.title
  const originalDescription = project.description ?? ""
  const originalCategory = project.category ?? ""
  const originalTechStack = (project.tech_stack ?? []).join(", ")
  const originalSpecs = project.technical_specs ?? {}

  // ── Original captions for diffing ──
  const originalCaptions: Record<string, string> = React.useMemo(() => {
    const map: Record<string, string> = {}
    for (const m of project.project_media ?? []) {
      map[m.id] = m.caption ?? ""
    }
    return map
  }, [project.project_media])

  // ── Cancel edit: reset all changes ──
  const handleCancelEdit = useCallback(() => {
    setIsEditMode(false)
    setEditTitle(originalTitle)
    setEditDescription(originalDescription)
    setEditCategory(originalCategory)
    setEditTechStack(originalTechStack)
    setEditSpecs(originalSpecs)
    setRemovedMediaIds([])
    setEditCaptions(originalCaptions)
    // Reset existing media to original list
    setExistingMedia(project.project_media ?? [])
    // Revoke preview URLs for added media
    addedMedia.forEach((m) => URL.revokeObjectURL(m.previewUrl))
    setAddedMedia([])
  }, [originalTitle, originalDescription, originalCategory, originalTechStack, originalSpecs, originalCaptions, addedMedia, project.project_media])

  // ── Toggle edit mode ──
  const handleToggleEdit = useCallback(() => {
    if (isEditMode) {
      handleCancelEdit()
    } else {
      setIsEditMode(true)
    }
  }, [isEditMode, handleCancelEdit])

  // ── Mark media for removal ──
  const handleRemoveMedia = useCallback((mediaId: string) => {
    setRemovedMediaIds((prev) => [...prev, mediaId])
    setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId))
  }, [])

  // ── Remove a newly added media (before save) ──
  const handleRemoveAddedMedia = useCallback((tempId: string) => {
    setAddedMedia((prev) => {
      const item = prev.find((m) => m.tempId === tempId)
      if (item) {
        URL.revokeObjectURL(item.previewUrl)
      }
      return prev.filter((m) => m.tempId !== tempId)
    })
  }, [])

  // ── Add new media files ──
  const handleAddMediaFiles = useCallback((files: FileList) => {
    const totalMediaCount = existingMedia.length + addedMedia.length
    const filesArray = Array.from(files)

    if (totalMediaCount + filesArray.length > 5) {
      toast.error("Maximum 5 media files per project.")
      return
    }

    const newItems: AddedMediaItem[] = filesArray
      .filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/"))
      .map((file) => ({
        tempId: `new-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        mediaType: file.type.startsWith("video/") ? "video" as const : "image" as const,
        caption: "",
        uploadedUrl: null,
      }))

    setAddedMedia((prev) => [...prev, ...newItems])
  }, [existingMedia.length, addedMedia.length])

  // ── Existing media caption editing ──
  const handleCaptionChange = useCallback((mediaId: string, caption: string) => {
    setEditCaptions((prev) => ({ ...prev, [mediaId]: caption }))
  }, [])

  // ── Caption for newly added media ──
  const handleAddedMediaCaptionChange = useCallback((tempId: string, caption: string) => {
    setAddedMedia((prev) =>
      prev.map((m) => (m.tempId === tempId ? { ...m, caption } : m))
    )
  }, [])

  // ── Spec editing ──
  const handleSpecChange = useCallback((key: string, newValue: string) => {
    setEditSpecs((prev) => ({ ...prev, [key]: newValue }))
  }, [])

  /** Rename a spec key while preserving insertion order */
  const handleSpecKeyRename = useCallback((oldKey: string, newKey: string) => {
    setEditSpecs((prev) => {
      const entries = Object.entries(prev)
      const updated: Record<string, string> = {}
      for (const [k, v] of entries) {
        updated[k === oldKey ? newKey : k] = v
      }
      return updated
    })
  }, [])

  /** Add a new empty specification */
  const handleAddSpec = useCallback(() => {
    // Generate a unique placeholder key to avoid collisions
    const placeholderKey = `New Spec ${Date.now().toString(36)}`
    setEditSpecs((prev) => ({ ...prev, [placeholderKey]: "" }))
  }, [])

  /** Remove a specification by key */
  const handleRemoveSpec = useCallback((key: string) => {
    setEditSpecs((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  // ── Save changes ──
  const handleSave = useCallback(async () => {
    setIsSaving(true)

    try {
      // Upload new media files to storage first
      const uploadedMediaEntries: Array<{
        media_url: string
        media_type: "image" | "video"
        caption: string
        sort_order: number
      }> = []

      for (let i = 0; i < addedMedia.length; i++) {
        const item = addedMedia[i]
        const sanitizedName = sanitizeFileName(item.file.name)
        const storagePath = `${project.id}/${Date.now()}-${sanitizedName}`

        const { error: uploadError } = await supabase.storage
          .from("portfolio-media")
          .upload(storagePath, item.file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Upload failed for "${item.file.name}": ${uploadError.message}`)
        }

        const { data: urlData } = supabase.storage
          .from("portfolio-media")
          .getPublicUrl(storagePath)

        uploadedMediaEntries.push({
          media_url: urlData.publicUrl,
          media_type: item.mediaType,
          caption: item.caption,
          sort_order: existingMedia.length + i,
        })
      }

      // Build PATCH body — only include changed fields
      const patchBody: Record<string, unknown> = {}

      if (editTitle !== originalTitle) patchBody.title = editTitle
      if (editDescription !== originalDescription) patchBody.description = editDescription
      if (editCategory !== originalCategory) patchBody.category = editCategory

      const newTechStack = editTechStack
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
      if (editTechStack !== originalTechStack) patchBody.tech_stack = newTechStack

      if (JSON.stringify(editSpecs) !== JSON.stringify(originalSpecs)) {
        patchBody.technical_specs = editSpecs
      }

      // Diff captions: only send captions that actually changed
      const updatedCaptions: Array<{ id: string; caption: string }> = []
      for (const [mediaId, newCaption] of Object.entries(editCaptions)) {
        const original = originalCaptions[mediaId] ?? ""
        if (newCaption !== original) {
          updatedCaptions.push({ id: mediaId, caption: newCaption })
        }
      }
      if (updatedCaptions.length > 0) patchBody.updated_captions = updatedCaptions

      if (removedMediaIds.length > 0) patchBody.removed_media_ids = removedMediaIds
      if (uploadedMediaEntries.length > 0) patchBody.added_media = uploadedMediaEntries

      // Send PATCH to API route
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error((errorData as { error: string }).error ?? "Update failed")
      }

      toast.success("Project updated successfully!")
      setIsEditMode(false)

      // Clean up preview URLs
      addedMedia.forEach((m) => URL.revokeObjectURL(m.previewUrl))
      setAddedMedia([])
      setRemovedMediaIds([])

      // Refresh the page data
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      toast.error(`Save failed: ${message}`)
    } finally {
      setIsSaving(false)
    }
  }, [
    addedMedia,
    editTitle,
    editDescription,
    editCategory,
    editTechStack,
    editSpecs,
    editCaptions,
    existingMedia.length,
    originalTitle,
    originalDescription,
    originalCategory,
    originalTechStack,
    originalSpecs,
    originalCaptions,
    project.id,
    removedMediaIds,
    router,
  ])

  // ── Delete project ──
  const handleDelete = useCallback(async () => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error((errorData as { error: string }).error ?? "Delete failed")
      }

      toast.success("Project deleted successfully!")
      setIsDeleteDialogOpen(false)
      router.push("/")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred"
      toast.error(`Delete failed: ${message}`)
    } finally {
      setIsDeleting(false)
    }
  }, [project.id, router])

  // ── Computed values ──
  const parsedTechStack = editTechStack
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  const specsEntries: [string, string][] = Object.entries(editSpecs)

  // All visible media = existing (not removed) + newly added
  const allMedia = [
    ...existingMedia.map((m) => ({
      id: m.id,
      type: (m.media_type === "video" ? "video" : "image") as "image" | "video",
      url: m.media_url,
      caption: editCaptions[m.id] ?? m.caption ?? "",
      alt: (editCaptions[m.id] ?? m.caption) || undefined,
      isNew: false as const,
      tempId: undefined as string | undefined,
    })),
    ...addedMedia.map((m) => ({
      id: m.tempId,
      type: m.mediaType,
      url: m.previewUrl,
      caption: m.caption,
      alt: m.caption || undefined,
      isNew: true as const,
      tempId: m.tempId,
    })),
  ]

  return (
    <>
      <main className="flex-1 container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12 pt-8 pb-24">
        {/* Hero Header */}
        <section className="block w-full max-w-4xl space-y-6 mt-20">
          {/* Category */}
          {isEditMode ? (
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              placeholder="Category"
              className="w-fit px-3 py-1 rounded-md text-xs font-mono tracking-widest uppercase bg-transparent border border-dashed border-amber-500/50 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          ) : (
            editCategory && (
              <Badge
                variant="outline"
                className="w-fit font-jetbrains text-xs tracking-widest uppercase bg-surface-variant/20 text-muted-foreground border-surface-variant"
              >
                {editCategory}
              </Badge>
            )
          )}

          {/* Title */}
          {isEditMode ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-4xl md:text-6xl font-bold font-sans tracking-tight text-foreground bg-transparent border-b-2 border-dashed border-amber-500/50 focus:outline-none focus:border-amber-500 pb-2"
            />
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight text-foreground">
              {editTitle}
            </h1>
          )}

          {/* Description */}
          {isEditMode ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full text-xl md:text-2xl font-sans text-muted-foreground leading-relaxed bg-transparent border border-dashed border-amber-500/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-y"
            />
          ) : (
            editDescription && (
              <p className="block w-full max-w-4xl text-xl md:text-2xl font-sans text-muted-foreground leading-relaxed">
                {editDescription}
              </p>
            )
          )}

          {/* Tech Stack */}
          {isEditMode ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={editTechStack}
                onChange={(e) => setEditTechStack(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm font-mono bg-transparent border border-dashed border-amber-500/50 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
              {parsedTechStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {parsedTechStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="font-jetbrains text-sm bg-surface-variant/40 text-foreground">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            parsedTechStack.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {parsedTechStack.map((tech) => (
                  <Badge key={tech} variant="secondary" className="font-jetbrains text-sm bg-surface-variant/40 text-foreground">
                    {tech}
                  </Badge>
                ))}
              </div>
            )
          )}
        </section>

        {/* Media Carousel with Edit Overlays */}
        {(allMedia.length > 0 || isEditMode) && (
          <section className="w-full max-w-5xl mx-auto">
            <Carousel className="relative w-full">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-surface-variant bg-surface-container-low">
                <CarouselContent>
                  {allMedia.map((item) => (
                    <CarouselItem key={item.id}>
                      <div className="relative w-full aspect-video">
                        {item.type === "video" ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div
                                role="button"
                                aria-label={`Play ${item.alt ?? "video clip"}`}
                                className="relative w-full h-full cursor-pointer overflow-hidden rounded-xl bg-surface-container-low"
                              >
                                <video
                                  src={item.url}
                                  className="w-full h-full object-cover"
                                  controls={false}
                                  muted
                                  playsInline
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="w-7 h-7 text-emerald-400 fill-emerald-400 ml-0.5" />
                                  </div>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-7xl w-full p-1 border-none bg-transparent shadow-none" aria-describedby={undefined}>
                              <div className="relative w-full h-[80vh] flex items-center justify-center bg-black/95 rounded-2xl overflow-hidden">
                                <video src={item.url} controls autoPlay className="w-full h-full object-contain" playsInline />
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <div
                                role="button"
                                aria-label={`View ${item.alt ?? "image"}`}
                                className="relative w-full h-full cursor-pointer overflow-hidden"
                              >
                                <Image
                                  src={item.url}
                                  alt={item.alt ?? "Media"}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 100vw, 1024px"
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-7xl w-full p-1 border-none bg-transparent shadow-none" aria-describedby={undefined}>
                              <div className="relative w-full h-[80vh] bg-black/95 rounded-2xl overflow-hidden flex items-center justify-center">
                                <Image src={item.url} alt={item.alt ?? "Media Expanded"} fill className="object-contain" sizes="100vw" priority />
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {/* Edit mode: Remove overlay */}
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (item.isNew && item.tempId) {
                                handleRemoveAddedMedia(item.tempId)
                              } else {
                                handleRemoveMedia(item.id)
                              }
                            }}
                            aria-label="Remove this media"
                            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-red-600/90 text-white hover:bg-red-500 transition-colors cursor-pointer shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}

                        {/* New badge for newly added media */}
                        {item.isNew && (
                          <span className="absolute top-3 left-3 z-20 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold uppercase tracking-wider">
                            New
                          </span>
                        )}

                        {/* Edit mode: Caption input (always visible) */}
                        {isEditMode ? (
                          <div className="absolute bottom-0 left-0 right-0 z-20 p-3 bg-linear-to-t from-black/80 via-black/50 to-transparent">
                            <input
                              type="text"
                              value={item.caption}
                              onChange={(e) => {
                                e.stopPropagation()
                                if (item.isNew && item.tempId) {
                                  handleAddedMediaCaptionChange(item.tempId, e.target.value)
                                } else {
                                  handleCaptionChange(item.id, e.target.value)
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Add a caption..."
                              className="w-full px-3 py-1.5 rounded-lg border border-zinc-600 bg-zinc-900/80 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 backdrop-blur-sm"
                            />
                          </div>
                        ) : (
                          /* Read-only mode: Caption display */
                          item.caption && (
                            <div className="absolute bottom-0 left-0 right-0 z-10 p-3 bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                              <p className="text-xs sm:text-sm font-jetbrains text-white/90 text-center drop-shadow">
                                {item.caption}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>

              {allMedia.length > 1 && (
                <>
                  <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm border-0 text-white/80 hover:bg-black/70 hover:text-white max-sm:hidden" />
                  <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm border-0 text-white/80 hover:bg-black/70 hover:text-white max-sm:hidden" />
                </>
              )}
            </Carousel>

            {/* Upload More Zone (edit mode only) */}
            {isEditMode && (
              <div className="mt-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleAddMediaFiles(e.target.files)
                      e.target.value = ""
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={allMedia.length >= 5}
                  className="w-full p-6 rounded-xl border-2 border-dashed border-zinc-600 hover:border-emerald-500 bg-zinc-900/30 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                  <div className="p-2 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                    <Plus className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-zinc-400 group-hover:text-emerald-300 transition-colors">
                    {allMedia.length >= 5 ? "Maximum 5 media files" : "Upload More Media"}
                  </span>
                  <Upload className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            )}
          </section>
        )}

        {/* Technical Specifications */}
        {(specsEntries.length > 0 || isEditMode) && (
          <section className="flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-sans tracking-tight text-foreground">
                Technical Specifications
              </h2>
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Specification
                </button>
              )}
            </div>

            {isEditMode ? (
              /* ── Edit Mode: Key-Value rows with rename + delete ── */
              <div className="space-y-3">
                {specsEntries.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-zinc-700 rounded-xl text-muted-foreground text-xs">
                    No technical specifications yet. Click &quot;+ Add Specification&quot; above to begin.
                  </div>
                ) : (
                  specsEntries.map(([label, value], index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-variant transition-all hover:border-zinc-600"
                    >
                      <span className="text-xs font-mono text-muted-foreground shrink-0 w-6">
                        #{index + 1}
                      </span>

                      {/* Key Input */}
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Spec Key (e.g. Microcontroller)"
                          value={label}
                          onChange={(e) => handleSpecKeyRename(label, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-dashed border-amber-500/50 bg-transparent text-foreground text-xs transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-none font-mono"
                        />
                      </div>

                      <ArrowRight className="w-4 h-4 text-muted-foreground hidden sm:block shrink-0" />

                      {/* Value Input */}
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Spec Value (e.g. ESP32 Dual Core 240MHz)"
                          value={value}
                          onChange={(e) => handleSpecChange(label, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-dashed border-amber-500/50 bg-transparent text-foreground text-xs transition-colors focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(label)}
                        aria-label={`Remove specification: ${label}`}
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 self-end sm:self-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* ── View Mode: Card grid ── */
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {specsEntries.map(([label, value], index) => (
                  <Card key={`${label}-${index}`} className="p-6 bg-surface-container-low border-surface-variant w-full">
                    <p className="font-jetbrains text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      {label}
                    </p>
                    <p className="font-sans font-medium text-foreground">
                      {value}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Admin Floating Bar */}
      <AdminFloatingBar
        isEditMode={isEditMode}
        isSaving={isSaving}
        onToggleEdit={handleToggleEdit}
        onDelete={() => setIsDeleteDialogOpen(true)}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        projectTitle={project.title}
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </>
  )
}
