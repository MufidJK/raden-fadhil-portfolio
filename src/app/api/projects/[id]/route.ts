import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { z } from "zod"

// ── Types ──

interface ProjectMediaRow {
  id: string
  media_url: string
  media_type: string | null
}

// ── Helpers ──

/**
 * Extracts the storage path from a Supabase public URL.
 * E.g. "https://xxx.supabase.co/storage/v1/object/public/portfolio-media/uuid/file.png"
 *   → "uuid/file.png"
 */
function extractStoragePath(publicUrl: string): string | null {
  const marker = "/storage/v1/object/public/portfolio-media/"
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return decodeURIComponent(publicUrl.substring(idx + marker.length))
}

// ── Route Params ──

interface RouteContext {
  params: Promise<{ id: string }>
}

// ── DELETE: Safe project deletion ──
// Order: 1) Fetch media URLs → 2) Delete storage files → 3) Delete DB row (cascades to project_media)

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      )
    }

    // Step 1: Fetch all media URLs associated with this project
    const { data: mediaRows, error: mediaFetchError } = await supabaseAdmin
      .from("project_media")
      .select("id, media_url, media_type")
      .eq("project_id", id)

    if (mediaFetchError) {
      return NextResponse.json(
        { error: `Failed to fetch project media: ${mediaFetchError.message}` },
        { status: 500 }
      )
    }

    // Step 2: Delete storage files from portfolio-media bucket
    const typedMediaRows = (mediaRows ?? []) as ProjectMediaRow[]
    const storagePaths = typedMediaRows
      .map((row) => extractStoragePath(row.media_url))
      .filter((path): path is string => path !== null)

    if (storagePaths.length > 0) {
      const { error: storageDeleteError } = await supabaseAdmin.storage
        .from("portfolio-media")
        .remove(storagePaths)

      if (storageDeleteError) {
        console.error(
          "[API DELETE] Storage cleanup failed (non-blocking):",
          storageDeleteError.message
        )
        // Continue with DB delete even if storage cleanup fails — prevent orphaned DB rows
      }
    }

    // Step 3: Delete the project row (FK cascade handles project_media rows)
    const { error: deleteError } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id)

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete project: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, deletedMediaFiles: storagePaths.length },
      { status: 200 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred"
    console.error("[API DELETE] Unhandled error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── PATCH: Smart project update ──

const patchBodySchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  category: z.string().min(1).optional(),
  tech_stack: z.array(z.string()).optional(),
  technical_specs: z.record(z.string(), z.string()).optional(),
  removed_media_ids: z.array(z.string()).optional(),
  updated_captions: z
    .array(
      z.object({
        id: z.string(),
        caption: z.string(),
      })
    )
    .optional(),
  added_media: z
    .array(
      z.object({
        media_url: z.string().url(),
        media_type: z.enum(["image", "video"]),
        caption: z.string().optional(),
        sort_order: z.number().optional(),
      })
    )
    .optional(),
})

type PatchBody = z.infer<typeof patchBodySchema>

export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      )
    }

    // Parse & validate request body
    let body: PatchBody
    try {
      const rawBody: unknown = await request.json()
      const parsed = patchBodySchema.safeParse(rawBody)
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid request body", details: parsed.error.flatten() },
          { status: 400 }
        )
      }
      body = parsed.data
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      )
    }

    const { removed_media_ids, added_media, updated_captions, ...projectFields } = body

    // ── Step A: Handle removed media ──
    if (removed_media_ids && removed_media_ids.length > 0) {
      // Fetch URLs of media to remove
      const { data: removedRows, error: fetchErr } = await supabaseAdmin
        .from("project_media")
        .select("id, media_url")
        .in("id", removed_media_ids)

      if (!fetchErr && removedRows) {
        // Delete from storage
        const pathsToRemove = (removedRows as ProjectMediaRow[])
          .map((row) => extractStoragePath(row.media_url))
          .filter((p): p is string => p !== null)

        if (pathsToRemove.length > 0) {
          const { error: storageErr } = await supabaseAdmin.storage
            .from("portfolio-media")
            .remove(pathsToRemove)

          if (storageErr) {
            console.error("[API PATCH] Storage cleanup failed:", storageErr.message)
          }
        }
      }

      // Delete rows from project_media
      const { error: deleteMediaErr } = await supabaseAdmin
        .from("project_media")
        .delete()
        .in("id", removed_media_ids)

      if (deleteMediaErr) {
        return NextResponse.json(
          { error: `Failed to delete media rows: ${deleteMediaErr.message}` },
          { status: 500 }
        )
      }
    }

    // ── Step B: Handle added media ──
    if (added_media && added_media.length > 0) {
      const newMediaRecords = added_media.map((m, idx) => ({
        project_id: id,
        media_url: m.media_url,
        media_type: m.media_type,
        caption: m.caption ?? "",
        sort_order: m.sort_order ?? idx + 100, // High sort_order to append at end
      }))

      const { error: insertMediaErr } = await supabaseAdmin
        .from("project_media")
        .insert(newMediaRecords)

      if (insertMediaErr) {
        return NextResponse.json(
          { error: `Failed to insert new media: ${insertMediaErr.message}` },
          { status: 500 }
        )
      }
    }

    // ── Step C: Update project text/JSONB fields ──
    const hasFieldUpdates = Object.keys(projectFields).length > 0
    if (hasFieldUpdates) {
      const updatePayload: Record<string, unknown> = { ...projectFields }
      updatePayload.updated_at = new Date().toISOString()

      const { error: updateErr } = await supabaseAdmin
        .from("projects")
        .update(updatePayload)
        .eq("id", id)

      if (updateErr) {
        return NextResponse.json(
          { error: `Failed to update project: ${updateErr.message}` },
          { status: 500 }
        )
      }
    }

    // ── Step D: Update existing media captions ──
    if (updated_captions && updated_captions.length > 0) {
      for (const captionUpdate of updated_captions) {
        const { error: captionErr } = await supabaseAdmin
          .from("project_media")
          .update({ caption: captionUpdate.caption })
          .eq("id", captionUpdate.id)

        if (captionErr) {
          console.error(
            `[API PATCH] Failed to update caption for media ${captionUpdate.id}:`,
            captionErr.message
          )
          // Non-blocking: continue updating other captions
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred"
    console.error("[API PATCH] Unhandled error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// ── Reject unsupported methods ──

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use DELETE or PATCH." },
    { status: 405 }
  )
}

export async function POST() {
  return NextResponse.json(
    { error: "Method not allowed. Use DELETE or PATCH." },
    { status: 405 }
  )
}
