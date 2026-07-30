"use client"

import * as React from "react"
import { useState, useCallback, ChangeEvent, FormEvent } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Upload,
  Plus,
  Trash2,
  Film,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Tag,
  Code2,
  FileText,
  Layers,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"
import { supabase } from "@/lib/supabase"

// Strict TypeScript Interfaces
export interface TechSpecItem {
  id: string
  key: string
  value: string
}

export interface MediaFileItem {
  id: string
  file: File
  type: "image" | "video"
  previewUrl: string
  caption: string
  duration?: number
  error?: string
}

export interface ProjectFormData {
  category: string
  title: string
  slug: string
  tech_stack: string
  description: string
  technical_specs: TechSpecItem[]
  media_files: MediaFileItem[]
}

// Zod Validation Schema
const projectFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  tech_stack: z.string().min(1, "At least one technology is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
})

/**
 * Sanitize a filename by replacing whitespace and special characters
 * with underscores, preserving only alphanumerics, dots, hyphens, and underscores.
 */
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

/**
 * Slug generator: Converts text to lowercase, hyphenated slug format
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function AdminPortfolioUploadPage() {
  // Form input states
  const [category, setCategory] = useState<string>("")
  const [title, setTitle] = useState<string>("")
  const [slug, setSlug] = useState<string>("")
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState<boolean>(false)
  const [techStack, setTechStack] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  
  // Dynamic technical specifications state
  const [technicalSpecs, setTechnicalSpecs] = useState<TechSpecItem[]>([
    { id: "spec-1", key: "Microcontroller", value: "ESP32-WROOM-32D" },
    { id: "spec-2", key: "Operating Voltage", value: "3.3V / 5V DC" }
  ])

  // Media files state
  const [mediaFiles, setMediaFiles] = useState<MediaFileItem[]>([])

  // Submission status states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Handle Title change & automatic slug formatting
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val))
    }
  }

  // Handle Slug change manually
  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true)
    setSlug(generateSlug(e.target.value))
  }

  // Dynamic Tech Specs Handlers
  const handleAddSpecRow = () => {
    const newSpec: TechSpecItem = {
      id: `spec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      key: "",
      value: ""
    }
    setTechnicalSpecs((prev) => [...prev, newSpec])
  }

  const handleRemoveSpecRow = (id: string) => {
    setTechnicalSpecs((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSpecChange = (id: string, field: "key" | "value", value: string) => {
    setTechnicalSpecs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  // Media Files Handlers & Validation
  const processFiles = useCallback((files: FileList | File[]) => {
    const filesArray = Array.from(files)
    
    // Validate Max 5 media files limit
    if (mediaFiles.length + filesArray.length > 5) {
      toast.error("Maximum limit reached: You can upload up to 5 media files total.")
      return
    }

    filesArray.forEach((file) => {
      const isVideo = file.type.startsWith("video/")
      const isImage = file.type.startsWith("image/")

      if (!isImage && !isVideo) {
        toast.error(`Invalid file format: ${file.name}. Only images and videos are allowed.`)
        return
      }

      const previewUrl = URL.createObjectURL(file)
      const newItem: MediaFileItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        file,
        type: isVideo ? "video" : "image",
        previewUrl,
        caption: ""
      }

      if (isVideo) {
        // Validate video duration (Max 30 seconds)
        const video = document.createElement("video")
        video.preload = "metadata"
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src)
          const duration = video.duration
          newItem.duration = duration
          if (duration > 30) {
            newItem.error = `Video duration (${Math.round(duration)}s) exceeds 30 seconds limit.`
            toast.warning(`Warning: ${file.name} is longer than 30 seconds.`)
          }
          setMediaFiles((prev) => [...prev, newItem])
        }
        video.src = previewUrl
      } else {
        setMediaFiles((prev) => [...prev, newItem])
      }
    })
  }, [mediaFiles.length])

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      e.target.value = "" // Reset input
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleRemoveMedia = (id: string) => {
    setMediaFiles((prev) => {
      const itemToRemove = prev.find((m) => m.id === id)
      if (itemToRemove?.previewUrl) {
        URL.revokeObjectURL(itemToRemove.previewUrl)
      }
      return prev.filter((m) => m.id !== id)
    })
  }

  const handleCaptionChange = (id: string, caption: string) => {
    setMediaFiles((prev) =>
      prev.map((m) => (m.id === id ? { ...m, caption } : m))
    )
  }

  // Parse tech stack items for live preview badges
  const parsedTechStack = techStack
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  /** Reset all form fields to their initial state */
  const resetForm = () => {
    setCategory("")
    setTitle("")
    setSlug("")
    setIsSlugManuallyEdited(false)
    setTechStack("")
    setDescription("")
    setTechnicalSpecs([])
    mediaFiles.forEach((m) => URL.revokeObjectURL(m.previewUrl))
    setMediaFiles([])
    setValidationErrors({})
  }

  // Form Submission Handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setValidationErrors({})
    setSubmitSuccess(false)

    // Zod validation check
    const validationResult = projectFormSchema.safeParse({
      category,
      title,
      slug,
      tech_stack: techStack,
      description,
    })

    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message
        }
      })
      setValidationErrors(errors)
      toast.error("Please fill in all required fields correctly.")
      return
    }

    // Video duration check before submission
    const invalidVideo = mediaFiles.find((m) => m.type === "video" && (m.duration ?? 0) > 30)
    if (invalidVideo) {
      toast.error(`Cannot submit: ${invalidVideo.file.name} exceeds the 30-second video duration limit.`)
      return
    }

    setIsSubmitting(true)

    try {
      // ── Step 1: Format technical specs as JSONB object ──
      const formattedSpecs: Record<string, string> = {}
      technicalSpecs.forEach((spec) => {
        if (spec.key.trim()) {
          formattedSpecs[spec.key.trim()] = spec.value.trim()
        }
      })

      // ── Step 2: Insert project row into `projects` table ──
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .insert({
          category: category.trim(),
          title: title.trim(),
          slug: slug.trim(),
          description: description.trim(),
          tech_stack: parsedTechStack,
          technical_specs: formattedSpecs,
        })
        .select("id")
        .single()

      if (projectError) {
        // Handle duplicate slug (PostgreSQL unique violation code)
        if (projectError.code === "23505") {
          setValidationErrors({ slug: "This slug is already in use. Please choose a different one." })
          throw new Error(`A project with the slug "${slug}" already exists.`)
        }
        throw new Error(projectError.message)
      }

      const projectId = projectData.id as string

      // ── Step 3: Upload each media file to `portfolio-media` bucket ──
      interface UploadedMediaRecord {
        project_id: string
        media_url: string
        media_type: string
        caption: string
        sort_order: number
      }

      const mediaRecords: UploadedMediaRecord[] = []

      for (let i = 0; i < mediaFiles.length; i++) {
        const item = mediaFiles[i]
        const sanitizedName = sanitizeFileName(item.file.name)
        const storagePath = `${projectId}/${Date.now()}-${sanitizedName}`

        const { error: uploadError } = await supabase.storage
          .from("portfolio-media")
          .upload(storagePath, item.file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          throw new Error(`Failed to upload "${item.file.name}": ${uploadError.message}`)
        }

        // Get public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from("portfolio-media")
          .getPublicUrl(storagePath)

        mediaRecords.push({
          project_id: projectId,
          media_url: urlData.publicUrl,
          media_type: item.type,
          caption: item.caption,
          sort_order: i,
        })
      }

      // ── Step 4: Insert media records into `project_media` table ──
      if (mediaRecords.length > 0) {
        const { error: mediaInsertError } = await supabase
          .from("project_media")
          .insert(mediaRecords)

        if (mediaInsertError) {
          throw new Error(`Failed to save media records: ${mediaInsertError.message}`)
        }
      }

      // ── Success ──
      setIsSubmitting(false)
      setSubmitSuccess(true)
      toast.success("Portfolio project created successfully!")
      resetForm()
    } catch (err: unknown) {
      setIsSubmitting(false)
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred."
      toast.error(`Submission failed: ${errorMessage}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
      {/* Header / Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <header className="mb-10 space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans">
            Upload Portfolio Project
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Configure project specifications, hardware telemetry parameters, and media assets for publication to the portfolio catalog.
          </p>
        </header>

        {/* Success Alert Banner */}
        {submitSuccess && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Project Successfully Created</h4>
              <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                The payload has been formatted and logged. Ready for live database sync.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* SECTION 1: BASIC INFO */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  1. Basic Information
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Core metadata stored in the <code className="text-emerald-600 dark:text-emerald-400 font-mono">projects</code> table.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Category <span className="text-emerald-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="category"
                    type="text"
                    placeholder="e.g., REPTILE IOT, FIRMWARE, ROBOTICS"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-lg border bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none ${
                      validationErrors.category ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  />
                </div>
                {validationErrors.category && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {validationErrors.category}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Project Title <span className="text-emerald-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g., Smart Reptile Terrarium Controller"
                  value={title}
                  onChange={handleTitleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none ${
                    validationErrors.title ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                />
                {validationErrors.title && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {validationErrors.title}
                  </p>
                )}
              </div>

              {/* Slug (Auto-generated) */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="slug" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    URL Slug <span className="text-emerald-500">*</span>
                  </label>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                    Auto-formatted lowercase & hyphenated
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    /projects/
                  </span>
                  <input
                    id="slug"
                    type="text"
                    placeholder="smart-reptile-terrarium-controller"
                    value={slug}
                    onChange={handleSlugChange}
                    className={`w-full pl-24 pr-4 py-2.5 rounded-lg border bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-mono text-sm transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none ${
                      validationErrors.slug ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  />
                </div>
                {validationErrors.slug && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {validationErrors.slug}
                  </p>
                )}
              </div>

              {/* Tech Stack */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="tech_stack" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Tech Stack (Comma Separated) <span className="text-emerald-500">*</span>
                </label>
                <div className="relative">
                  <Code2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="tech_stack"
                    type="text"
                    placeholder="ESP32, C++, FreeRTOS, MQTT, Next.js, Tailwind CSS"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-lg border bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none ${
                      validationErrors.tech_stack ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  />
                </div>

                {/* Tech Badges Preview */}
                {parsedTechStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <span className="text-xs text-zinc-500 self-center mr-1">Preview:</span>
                    {parsedTechStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {validationErrors.tech_stack && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {validationErrors.tech_stack}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="description" className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Description <span className="text-emerald-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Provide a comprehensive breakdown of the hardware architecture, firmware capabilities, sensors integrated, and overall system workflow..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none resize-y ${
                    validationErrors.description ? "border-red-500" : "border-zinc-200 dark:border-zinc-800"
                  }`}
                />
                {validationErrors.description && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {validationErrors.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 2: TECHNICAL SPECS */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    2. Technical Specifications
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Dynamic key-value pairs stored in the <code className="text-emerald-600 dark:text-emerald-400 font-mono">technical_specs</code> JSONB column.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddSpecRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Specification
              </button>
            </div>

            <div className="space-y-3">
              {technicalSpecs.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl text-zinc-500 text-xs">
                  No technical specifications added yet. Click &quot;+ Add Specification&quot; above to begin.
                </div>
              ) : (
                technicalSpecs.map((spec, index) => (
                  <div
                    key={spec.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                  >
                    <span className="text-xs font-mono text-zinc-400 shrink-0 w-6">
                      #{index + 1}
                    </span>
                    
                    {/* Key Input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Spec Key (e.g. Microcontroller)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(spec.id, "key", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <ArrowRight className="w-4 h-4 text-zinc-400 hidden sm:block shrink-0" />

                    {/* Value Input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Spec Value (e.g. ESP32 Dual Core 240MHz)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(spec.id, "value", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecRow(spec.id)}
                      aria-label="Remove specification row"
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 self-end sm:self-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION 3: MEDIA UPLOAD INFO */}
          <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    3. Media Upload Info
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Images and videos registered in the <code className="text-emerald-600 dark:text-emerald-400 font-mono">project_media</code> table.
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                {mediaFiles.length} / 5 Selected
              </span>
            </div>

            {/* Validation & Warning Text Banner */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 space-y-1">
              <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Upload Constraints & Requirements</span>
              </div>
              <ul className="text-xs text-amber-700 dark:text-amber-300 list-disc list-inside space-y-0.5 pt-1">
                <li><strong className="font-semibold">Maximum 5 media files</strong> per project submission.</li>
                <li><strong className="font-semibold">Video duration max 30 seconds</strong>. Longer videos will trigger validation warnings.</li>
                <li>Supported media formats: PNG, JPG, WEBP, MP4, WEBM.</li>
              </ul>
            </div>

            {/* Dropzone Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`relative group border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                mediaFiles.length >= 5
                  ? "border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/40 cursor-not-allowed"
                  : "border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-zinc-50/50 dark:bg-zinc-950/30"
              }`}
            >
              <input
                id="media-input"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInputChange}
                disabled={mediaFiles.length >= 5}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {mediaFiles.length >= 5
                      ? "Maximum limit reached (5 files)"
                      : "Drag and drop files here, or click to browse"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Select high-definition images or videos (max 30s)
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Media Files Grid */}
            {mediaFiles.length > 0 && (
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Selected Files &amp; Captions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediaFiles.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-3 relative group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Type Icon Badge */}
                        <div className="p-2.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                          {item.type === "video" ? (
                            <Film className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-blue-500" />
                          )}
                        </div>

                        {/* File Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                            {idx + 1}. {item.file.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                            {(item.file.size / (1024 * 1024)).toFixed(2)} MB • {item.type.toUpperCase()}
                            {item.duration !== undefined && ` • ${Math.round(item.duration)}s`}
                          </p>
                          {item.error && (
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                              ⚠️ {item.error}
                            </p>
                          )}
                        </div>

                        {/* Remove File Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(item.id)}
                          aria-label={`Remove media file ${item.file.name}`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Caption Input */}
                      <div className="space-y-1">
                        <label
                          htmlFor={`caption-${item.id}`}
                          className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider"
                        >
                          File Caption
                        </label>
                        <input
                          id={`caption-${item.id}`}
                          type="text"
                          placeholder="e.g., PCB board assembly step 1"
                          value={item.caption}
                          onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* SUBMIT BUTTON SECTION */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
              Ensure all telemetry parameters &amp; media limits comply with catalog guidelines.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Upload...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish Portfolio Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
