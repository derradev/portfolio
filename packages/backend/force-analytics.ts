import { initializeServices, getServices } from './src/services'

async function forceAnalyticsMigration() {
  try {
    await initializeServices()
    const { dbService } = getServices()
    
    console.log('🔍 Checking current state...')
    
    // Check if analytics table exists
    const tableCheck = await dbService.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'analytics'
    `)
    
    console.log('Analytics table exists:', tableCheck.length > 0)
    
    if (tableCheck.length === 0) {
      console.log('📝 Analytics table missing, removing migration record and re-running...')
      
      // Remove the analytics migration record
      await dbService.query(`DELETE FROM migrations WHERE id = 2 AND name = 'add_analytics_table'`)
      
      console.log('🚀 Creating analytics table...')
      
      // Create analytics table
      await dbService.query(`
        CREATE TABLE IF NOT EXISTS analytics (
          id SERIAL PRIMARY KEY,
          page_path VARCHAR(500) NOT NULL,
          page_title VARCHAR(500),
          user_agent TEXT,
          ip_address INET,
          referrer TEXT,
          session_id VARCHAR(100) NOT NULL,
          visit_duration INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `)

      // Create indexes
      await dbService.query(`CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics(page_path)`)
      await dbService.query(`CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id)`)
      await dbService.query(`CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)`)
      await dbService.query(`CREATE INDEX IF NOT EXISTS idx_analytics_page_path_created_at ON analytics(page_path, created_at)`)

      // Mark migration as executed
      await dbService.query('INSERT INTO migrations (id, name) VALUES ($1, $2)', [2, 'add_analytics_table'])
      
      console.log('✅ Analytics table created successfully!')
    } else {
      console.log('✅ Analytics table already exists')
    }
    
    // Verify table structure
    const columns = await dbService.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'analytics'
      ORDER BY ordinal_position
    `)
    
    console.log('📋 Analytics table columns:')
    columns.forEach((col: any) => console.log(`  - ${col.column_name}: ${col.data_type}`))
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

forceAnalyticsMigration()
