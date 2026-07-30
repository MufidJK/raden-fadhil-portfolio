"use client"

import * as React from "react"
import { useState, useCallback, ChangeEvent, DragEvent } from "react"
import { Upload, X, Film, Image as ImageIcon, AlertCircle, Info } from "lucide-react"
import { toast } from "sonner"

// Constants
export const MAX_FILES = 5
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50MB
export const MAX_VIDEO_DURATION_SECONDS = 30
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
] as const

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

export interface ValidatedMediaFile {
  id: string
  file: File
  type: "image" | "video"
  previewUrl: string
  duration?: number
  caption: string
}

export interface MediaDropzoneProps {
  mediaFiles: ValidatedMediaFile[]
  setMediaFiles: React.Dispatch<React.SetStateAction<ValidatedMediaFile[]>>
  onFilesChange?: (files: ValidatedMediaFile[]) => void
}

/**
 * Asynchronously calculates video duration using an in-memory HTML5 video element.
 */
export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "metadata"
    const objectUrl = URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(video.duration)
    }

    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Failed to read metadata for video file: ${file.name}`))
    }

    video.src = objectUrl
  })
}

export function MediaDropzone({
  mediaFiles,
  setMediaFiles,
  onFilesChange,
}: MediaDropzoneProps) {
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  /**
   * Main file processing & validation handler
   */
  const processAndValidateFiles = useCallback(
    async (incomingFiles: File[]) => {
      if (incomingFiles.length === 0) return

      const currentCount = mediaFiles.length

      // Rule 1: Max 5 files total check
      if (currentCount >= MAX_FILES) {
        toast.error(`Maximum limit of ${MAX_FILES} media files already reached.`)
        return
      }

      let availableSlots = MAX_FILES - currentCount
      if (incomingFiles.length > availableSlots) {
        toast.warning(
          `Only the first ${availableSlots} file(s) will be processed because the maximum limit is ${MAX_FILES} files.`
        )
      }

      const filesToProcess = incomingFiles.slice(0, availableSlots)
      setIsProcessing(true)

      const newlyValidatedFiles: ValidatedMediaFile[] = []

      for (const file of filesToProcess) {
        // Rule 3: MIME type validation
        if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedMimeType)) {
          toast.error(
            `Rejected "${file.name}": Unsupported format. Allowed: JPG, PNG, WEBP, MP4, WEBM.`
          )
          continue
        }

        // Rule 2: Max file size check (50MB)
        if (file.size > MAX_FILE_SIZE_BYTES) {
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
          toast.error(
            `Rejected "${file.name}": Size (${fileSizeMB}MB) exceeds the 50MB limit.`
          )
          continue
        }

        const isVideo = file.type.startsWith("video/")
        let duration: number | undefined = undefined

        // Rule 4: Video duration validation (STRICTLY max 30 seconds)
        if (isVideo) {
          try {
            duration = await getVideoDuration(file)
            if (duration > MAX_VIDEO_DURATION_SECONDS) {
              const roundedDuration = Math.round(duration)
              toast.error(
                `Rejected "${file.name}": Video duration (${roundedDuration}s) exceeds the strict 30-second limit.`
              )
              continue
            }
          } catch (err: unknown) {
            const errorMsg =
              err instanceof Error ? err.message : "Unable to verify video duration."
            toast.error(`Rejected "${file.name}": ${errorMsg}`)
            continue
          }
        }

        // Successfully passed all validation rules
        const previewUrl = URL.createObjectURL(file)
        newlyValidatedFiles.push({
          id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          type: isVideo ? "video" : "image",
          previewUrl,
          duration,
          caption: "",
        })
      }

      setIsProcessing(false)

      if (newlyValidatedFiles.length > 0) {
        setMediaFiles((prev) => {
          const updated = [...prev, ...newlyValidatedFiles]
          if (onFilesChange) onFilesChange(updated)
          return updated
        })
        toast.success(`Successfully added ${newlyValidatedFiles.length} file(s).`)
      }
    },
    [mediaFiles.length, setMediaFiles, onFilesChange]
  )

  // Event Handlers for Dropzone
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArr = Array.from(e.target.files)
      processAndValidateFiles(filesArr)
      e.target.value = "" // Reset input value so re-selecting same file triggers onChange
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArr = Array.from(e.dataTransfer.files)
      processAndValidateFiles(filesArr)
    }
  }

  // Remove File Handler
  const handleRemoveFile = (id: string) => {
    setMediaFiles((prev) => {
      const target = prev.find((m) => m.id === id)
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl)
      }
      const updated = prev.filter((m) => m.id !== id)
      if (onFilesChange) onFilesChange(updated)
      return updated
    })
  }

  // Update Caption Handler
  const handleCaptionChange = (id: string, caption: string) => {
    setMediaFiles((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, caption } : m))
      if (onFilesChange) onFilesChange(updated)
      return updated
    })
  }

  return (
    <div className="space-y-6">
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
            : mediaFiles.length >= MAX_FILES
            ? "border-zinc-300 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/40 cursor-not-allowed"
            : "border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-400 bg-zinc-50/50 dark:bg-zinc-950/30"
        }`}
      >
        <input
          id="media-dropzone-input"
          aria-label="Upload media files"
          type="file"
          multiple
          accept={ALLOWED_MIME_TYPES.join(",")}
          onChange={handleFileInputChange}
          disabled={mediaFiles.length >= MAX_FILES || isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {isProcessing ? (
              <span className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin block" />
            ) : (
              <Upload className="w-7 h-7" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              {isProcessing
                ? "Validating media files & video duration..."
                : mediaFiles.length >= MAX_FILES
                ? `Maximum limit reached (${MAX_FILES} files)`
                : "Drag & drop media files here, or click to browse"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Supports JPG, PNG, WEBP, MP4, WEBM (Max 50MB per file, Max 30s for videos)
            </p>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
          <Info className="w-4 h-4 text-emerald-500" />
          <span>Active Validation Rules:</span>
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-[11px] pl-1">
          <li><strong>Max Files:</strong> Up to {MAX_FILES} total files.</li>
          <li><strong>Max File Size:</strong> 50MB per file.</li>
          <li><strong>Allowed MIME Types:</strong> JPG, PNG, WEBP, MP4, WEBM.</li>
          <li><strong>Video Duration Limit:</strong> Max 30 seconds (validated via HTML5 metadata).</li>
        </ul>
      </div>

      {/* Validated Files Grid */}
      {mediaFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Validated Media Files ({mediaFiles.length}/{MAX_FILES})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaFiles.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
                    {item.type === "video" ? (
                      <Film className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {index + 1}. {item.file.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                      {(item.file.size / (1024 * 1024)).toFixed(2)} MB • {item.type.toUpperCase()}
                      {item.duration !== undefined && ` • ${Math.round(item.duration)}s`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFile(item.id)}
                    aria-label={`Remove file ${item.file.name}`}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor={`caption-${item.id}`}
                    className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Caption
                  </label>
                  <input
                    id={`caption-${item.id}`}
                    type="text"
                    placeholder="Enter file caption..."
                    value={item.caption}
                    onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs transition-colors focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
