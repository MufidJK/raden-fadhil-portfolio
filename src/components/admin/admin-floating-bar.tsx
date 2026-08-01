"use client"

import * as React from "react"
import { Pencil, Trash2, Save, X } from "lucide-react"

interface AdminFloatingBarProps {
  isEditMode: boolean
  isSaving: boolean
  onToggleEdit: () => void
  onDelete: () => void
  onSave: () => void
}

export function AdminFloatingBar({
  isEditMode,
  isSaving,
  onToggleEdit,
  onDelete,
  onSave,
}: AdminFloatingBarProps) {
  return (
    <div className="fixed bottom-6 left-0 right-0 mx-auto w-max z-[99999] pointer-events-none">
      <aside
        role="toolbar"
        aria-label="Admin actions"
        className="pointer-events-auto flex flex-row flex-nowrap items-center justify-center gap-2 p-2 rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/95 backdrop-blur-xl border border-zinc-700/50 shadow-2xl shadow-black/40 animate-in slide-in-from-bottom-4 fade-in duration-300"
      >
        {/* Edit Mode Toggle */}
        <button
          type="button"
          onClick={onToggleEdit}
          disabled={isSaving}
          aria-label={isEditMode ? "Disable edit mode" : "Enable edit mode"}
          className={`inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            isEditMode
              ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/50"
          }`}
        >
          {isEditMode ? (
            <>
              <X className="w-4 h-4" />
              <span>Cancel Edit</span>
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              <span>Enable Edit Mode</span>
            </>
          )}
        </button>

        {/* Save Button (visible only in edit mode) */}
        {isEditMode && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            aria-label="Save changes"
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-500/30"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        )}

        {/* Divider */}
        <div className="w-px h-8 bg-zinc-700/50 hidden sm:block" aria-hidden="true" />

        {/* Delete Button */}
        <button
          type="button"
          onClick={onDelete}
          disabled={isSaving}
          aria-label="Delete project"
          className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap bg-red-500/15 text-red-400 hover:bg-red-500/25 hover:text-red-300 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Project</span>
        </button>
      </aside>
    </div>
  )
}
