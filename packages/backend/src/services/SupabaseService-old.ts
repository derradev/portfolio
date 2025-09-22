import { createClient, SupabaseClient } from '@supabase/supabase-js'

export class SupabaseService {
  private client: SupabaseClient
  private initialized: boolean = false

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
    }

    this.client = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    this.initialized = true
  }

  async initialize(): Promise<void> {
    if (!this.initialized) {
      throw new Error('SupabaseService not properly initialized')
    }
    console.log('✅ Supabase service initialized successfully')
  }

  getClient(): SupabaseClient {
    if (!this.initialized) {
      throw new Error('SupabaseService not initialized. Call initialize() first.')
    }
    return this.client
  }

  // Deprecated: Use Supabase client methods instead
  async query(sql: string, params?: any[]): Promise<any[]> {
    throw new Error('Raw SQL queries deprecated. Use Supabase client methods: select(), insert(), update(), delete()')
  }

  // Deprecated: Use Supabase client methods instead  
  async queryOne(sql: string, params?: any[]): Promise<any> {
    throw new Error('Raw SQL queries deprecated. Use Supabase client methods: select(), insert(), update(), delete()')
  }

  // Table-specific methods using Supabase client
  async select(table: string, columns = '*', conditions?: any): Promise<any[]> {
    try {
      let query = this.client.from(table).select(columns)
      
      if (conditions) {
        Object.entries(conditions).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }
      
      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error(`Supabase select error for table ${table}:`, error)
      throw error
    }
  }

  // Get single record by ID
  async selectOne(table: string, id: number | string, columns = '*'): Promise<any> {
    try {
      const { data, error } = await this.client
        .from(table)
        .select(columns)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error(`Supabase selectOne error for table ${table}:`, error)
      throw error
    }
  }

  // Insert new record
  async insert(table: string, data: any): Promise<any> {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select()
        .single()
      
      if (error) throw error
      return result
    } catch (error) {
      console.error(`Supabase insert error for table ${table}:`, error)
      throw error
    }
  }

  // Update record by ID
  async update(table: string, id: number | string, data: any): Promise<any> {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return result
    } catch (error) {
      console.error(`Supabase update error for table ${table}:`, error)
      throw error
    }
  }

  // Delete record by ID
  async delete(table: string, id: number | string): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error(`Supabase delete error for table ${table}:`, error)
      throw error
    }
  }

  async selectOne(table: string, columns = '*', conditions?: any): Promise<any> {
    const results = await this.select(table, columns, conditions)
    return results[0] || null
  }

  async insert(table: string, data: any): Promise<any> {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select()
        .single()
      
      if (error) throw error
      return result
    } catch (error) {
      console.error(`Supabase insert error for table ${table}:`, error)
      throw error
    }
  }

  async update(table: string, data: any, conditions: any): Promise<any> {
    try {
      let query = this.client.from(table).update(data)
      
      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { data: result, error } = await query.select().single()
      if (error) throw error
      return result
    } catch (error) {
      console.error(`Supabase update error for table ${table}:`, error)
      throw error
    }
  }

  async delete(table: string, conditions: any): Promise<void> {
    try {
      let query = this.client.from(table).delete()
      
      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { error } = await query
      if (error) throw error
    } catch (error) {
      console.error(`Supabase delete error for table ${table}:`, error)
      throw error
    }
  }

  // Auth methods
  async getUserById(userId: string): Promise<any> {
    try {
      const { data, error } = await this.client.auth.admin.getUserById(userId)
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('Supabase getUserById error:', error)
      throw error
    }
  }

  async createUser(email: string, password: string, userData?: any): Promise<any> {
    try {
      const { data, error } = await this.client.auth.admin.createUser({
        email,
        password,
        user_metadata: userData || {}
      })
      if (error) throw error
      return data.user
    } catch (error) {
      console.error('Supabase createUser error:', error)
      throw error
    }
  }

  async close(): Promise<void> {
    // Supabase client doesn't need explicit closing
    console.log('✅ Supabase service connection closed')
  }
}
