import { SupabaseService } from './SupabaseService'

// Singleton instances
let supabaseService: SupabaseService | null = null

export async function initializeServices(): Promise<{ supabaseService: SupabaseService }> {
  try {
    if (!supabaseService) {
      console.log('🔄 Initializing SupabaseService...')
      supabaseService = new SupabaseService()
      await supabaseService.initialize()
      console.log('✅ SupabaseService initialized successfully')
    }
    
    return { supabaseService }
  } catch (error) {
    console.error('❌ SupabaseService initialization failed:', error)
    throw error
  }
}

export function getServices(): { supabaseService: SupabaseService } {
  if (!supabaseService) {
    // Initialize services synchronously if not already done
    supabaseService = new SupabaseService()
    // Note: Supabase connection will be attempted on first query
  }
  return { supabaseService }
}

// Legacy compatibility - map old service names to new ones
export function getSupabaseService(): SupabaseService {
  return getServices().supabaseService
}

// For backward compatibility with existing code
export function getDbService(): SupabaseService {
  return getServices().supabaseService
}
