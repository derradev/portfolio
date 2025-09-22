import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL!
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// API URL for backend calls
export const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001'
