"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

/**
 * Extracts the storage path from a Supabase public URL.
 */
function extractStoragePath(publicUrl: string): string | null {
  const marker = "/storage/v1/object/public/portfolio-media/"
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return decodeURIComponent(publicUrl.substring(idx + marker.length))
}

export async function deleteProjectAction(projectId: string) {
  try {
    if (!projectId) {
      return { error: "Invalid project ID" }
    }

    // Step 1: Fetch all media URLs associated with this project
    const { data: mediaRows, error: mediaFetchError } = await supabaseAdmin
      .from("project_media")
      .select("id, media_url")
      .eq("project_id", projectId)

    if (mediaFetchError) {
      return { error: `Failed to fetch project media: ${mediaFetchError.message}` }
    }

    // Step 2: Delete storage files from portfolio-media bucket
    const storagePaths = (mediaRows ?? [])
      .map((row) => extractStoragePath(row.media_url))
      .filter((path): path is string => path !== null)

    if (storagePaths.length > 0) {
      const { error: storageDeleteError } = await supabaseAdmin.storage
        .from("portfolio-media")
        .remove(storagePaths)

      if (storageDeleteError) {
        console.error(
          "[deleteProjectAction] Storage cleanup failed (non-blocking):",
          storageDeleteError.message
        )
      }
    }

    // Step 3: Delete project_media rows manually to be safe (if no CASCADE)
    const { error: mediaDeleteError } = await supabaseAdmin
      .from("project_media")
      .delete()
      .eq("project_id", projectId)
      
    if (mediaDeleteError) {
       console.error("[deleteProjectAction] Failed to delete media rows", mediaDeleteError.message)
       // Let it continue as it might cascade anyway
    }

    // Step 4: Delete the project row
    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", projectId)

    if (deleteError) {
      return { error: `Failed to delete project: ${deleteError.message}` }
    }

    revalidatePath("/admin/projects")
    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred"
    console.error("[deleteProjectAction] Unhandled error:", message)
    return { error: message }
  }
}
