import { createClient } from "@supabase/supabase-js"

/**
 * Server-only Supabase client using the Service Role Key.
 * NEVER import this in client components or files with "use client".
 * Used exclusively in API routes (src/app/api/) for privileged operations
 * like deleting storage files and cascading row deletes.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase server environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  )
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
