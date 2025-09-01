const { Pool } = require('pg');

// Simple check script
async function checkAnalytics() {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio',
    password: 'your_password', // Update this
    port: 5432,
  });

  try {
    // Check if analytics table exists
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'analytics'
    `);
    
    console.log('Analytics table exists:', tableCheck.rows.length > 0);
    
    if (tableCheck.rows.length > 0) {
      // Check table structure
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'analytics'
        ORDER BY ordinal_position
      `);
      console.log('Table columns:', columns.rows);
    }
    
    // Check migrations table
    const migrations = await pool.query('SELECT * FROM migrations ORDER BY id');
    console.log('Executed migrations:', migrations.rows);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAnalytics();
