"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DeleteConfirmDialogProps {
  projectTitle: string
  isOpen: boolean
  isDeleting: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteConfirmDialog({
  projectTitle,
  isOpen,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* No trigger — opened programmatically */}
      <DialogTrigger asChild>
        <span className="hidden" />
      </DialogTrigger>
      <DialogContent
        className="max-w-md p-0 border-red-500/30 bg-zinc-950 overflow-hidden"
        aria-describedby="delete-confirm-description"
      >
        {/* Header strip */}
        <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-500/20">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-red-300">
              Hapus Project
            </h2>
            <p className="text-xs text-red-400/80 font-mono">
              DESTRUCTIVE ACTION
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p id="delete-confirm-description" className="text-sm text-zinc-300 leading-relaxed">
            Anda akan menghapus project{" "}
            <strong className="text-white font-semibold">&ldquo;{projectTitle}&rdquo;</strong>.
            Semua media files di storage dan data di database akan dihapus permanen.
          </p>

          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-300 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Aksi ini tidak dapat dibatalkan (irreversible).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <span>Hapus Project</span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
