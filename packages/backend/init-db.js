const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_CONNECTION_STRING || 'postgresql://postgres:password@localhost:5432/portfolio'
});

async function initDatabase() {
  try {
    console.log('🚀 Initializing database tables...');
    
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        technologies JSONB,
        github_url VARCHAR(500),
        live_url VARCHAR(500),
        image_url VARCHAR(500),
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Blog posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        category VARCHAR(100) NOT NULL,
        tags JSONB,
        featured BOOLEAN DEFAULT false,
        published BOOLEAN DEFAULT false,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Work history table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS work_history (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        description TEXT NOT NULL,
        achievements JSONB,
        technologies JSONB,
        company_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Learning table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS learning (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        category VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        estimated_completion DATE,
        resources JSONB,
        status VARCHAR(50) DEFAULT 'in_progress',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Skills table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        level VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully');

    // Create admin user
    const bcrypt = require('bcryptjs');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    
    if (existingUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
        [adminEmail, hashedPassword, 'Admin User', 'admin']
      );
      console.log('✅ Created admin user:', adminEmail);
    } else {
      console.log('⏭️  Admin user already exists');
    }

    // Add sample project
    const existingProject = await pool.query('SELECT id FROM projects LIMIT 1');
    if (existingProject.rows.length === 0) {
      await pool.query(
        'INSERT INTO projects (title, description, content, technologies, github_url, featured) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          'Portfolio Website',
          'A modern portfolio website built with Next.js and TypeScript',
          'This portfolio website showcases my projects, skills, and experience.',
          JSON.stringify(['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL']),
          'https://github.com/username/portfolio',
          true
        ]
      );
      console.log('✅ Added sample project');
    }

    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
