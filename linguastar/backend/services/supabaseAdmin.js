/**
 * Supabase Admin Client (Service Role)
 * Used by backend API routes — bypasses Row Level Security
 * NEVER expose this on the frontend
 */
import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)
