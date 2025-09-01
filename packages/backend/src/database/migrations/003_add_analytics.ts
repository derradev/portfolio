import { DatabaseService } from '../../services/DatabaseService'

export async function up(db: DatabaseService): Promise<void> {
  console.log('Running migration: Add analytics table')
  
  // Create analytics table
  await db.query(`
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

  // Create indexes for better query performance
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics(page_path)
  `)
  
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id)
  `)
  
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)
  `)
  
  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_analytics_page_path_created_at ON analytics(page_path, created_at)
  `)

  console.log('Analytics table and indexes created successfully')
}

export async function down(db: DatabaseService): Promise<void> {
  console.log('Rolling back migration: Add analytics table')
  
  // Drop indexes first
  await db.query('DROP INDEX IF EXISTS idx_analytics_page_path_created_at')
  await db.query('DROP INDEX IF EXISTS idx_analytics_created_at')
  await db.query('DROP INDEX IF EXISTS idx_analytics_session_id')
  await db.query('DROP INDEX IF EXISTS idx_analytics_page_path')
  
  // Drop table
  await db.query('DROP TABLE IF EXISTS analytics')
  
  console.log('Analytics table and indexes dropped successfully')
}
