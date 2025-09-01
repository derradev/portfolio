import dotenv from 'dotenv';
import { initializeServices, getServices } from '../services'
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

interface Migration {
  id: number;
  name: string;
  up: () => Promise<void>;
}

const migrations: Migration[] = [
  {
    id: 1,
    name: 'create_initial_tables',
    up: async () => {
      const { dbService } = await initializeServices()
      // Users table
      await dbService.query(`
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
      await dbService.query(`
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
      await dbService.query(`
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
      await dbService.query(`
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
      await dbService.query(`
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
      await dbService.query(`
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

      // Education table
      await dbService.query(`
        CREATE TABLE IF NOT EXISTS education (
          id SERIAL PRIMARY KEY,
          institution VARCHAR(255) NOT NULL,
          degree VARCHAR(255) NOT NULL,
          field_of_study VARCHAR(255),
          location VARCHAR(255),
          start_date DATE NOT NULL,
          end_date DATE,
          grade VARCHAR(50),
          description TEXT,
          achievements JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Certifications table
      await dbService.query(`
        CREATE TABLE IF NOT EXISTS certifications (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          issuer VARCHAR(255) NOT NULL,
          issue_date DATE NOT NULL,
          expiry_date DATE,
          credential_id VARCHAR(255),
          credential_url VARCHAR(500),
          description TEXT,
          skills JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);


      // Migrations tracking table
      await dbService.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ Created all PostgreSQL database tables');
    }
  },
  {
    id: 2,
    name: 'add_analytics_table',
    up: async () => {
      try {
        await initializeServices()
        const { dbService } = getServices()
        
        console.log('Running migration: Add analytics table')
        
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

        // Create indexes for better query performance
        await dbService.query(`
          CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics(page_path)
        `)
        
        await dbService.query(`
          CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id)
        `)
        
        await dbService.query(`
          CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at)
        `)
        
        await dbService.query(`
          CREATE INDEX IF NOT EXISTS idx_analytics_page_path_created_at ON analytics(page_path, created_at)
        `)

        console.log('✅ Analytics table and indexes created successfully')
      } catch (error) {
        console.error('❌ Error creating analytics table:', error)
        throw error
      }
    }
  },
  {
    id: 3,
    name: 'seed_initial_data',
    up: async () => {
      try {
        await initializeServices()
        const { dbService } = getServices()
        
        // Check if migration has already been run
        const migrationExists = await dbService.queryOne(`
          SELECT 1 FROM migrations WHERE name = $1
        `, ['initial_migration'])
        
        if (migrationExists) {
          console.log('Migration already exists, skipping...')
          return
        }

        // Run the migration
        const { vaultService } = getServices();
        const adminCredentials = await vaultService.getAdminCredentials();
        const existingUser = await dbService.queryOne('SELECT id FROM users WHERE email = $1', [adminCredentials.email]);
        
        if (!existingUser) {
          const hashedPassword = await bcrypt.hash(adminCredentials.password, 10);
          await dbService.query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
            [adminCredentials.email, hashedPassword, 'Admin User', 'admin']
          );
          console.log('✅ Created admin user');
        }

        // Check if projects exist
        const projectExists = await dbService.queryOne('SELECT id FROM projects LIMIT 1');
        if (!projectExists) {
        const sampleProjects = [
          {
            title: 'LunaLore Platform',
            description: 'Building a platform for VTubers to manage character lore and community engagement using Electron, Next.JS, Supabase and Vercel',
            content: 'A comprehensive platform designed for VTubers to create, manage, and share their character lore while fostering community engagement. Built with modern technologies for cross-platform compatibility.',
            technologies: ['Electron', 'Next.js', 'Supabase', 'Vercel', 'TypeScript', 'React'],
            github_url: 'https://github.com/demitaylor/lunalore',
            live_url: 'https://lunalore.vercel.app',
            featured: true
          },
          {
            title: 'FamilyNova Social Network',
            description: 'A social networking app for kids featured in ExpoTees, focusing on safe digital interaction',
            content: 'A safe and engaging social networking platform designed specifically for children, with robust safety features and parental controls. Featured in ExpoTees for its innovative approach to child-friendly social media.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io', 'AWS'],
            github_url: 'https://github.com/demitaylor/familynova',
            featured: true
          },
          {
            title: '3TX Digital Logistics Platform',
            description: 'Micro-frontend architecture implementation reducing build times by 50% and improving scalability',
            content: 'A comprehensive digital logistics platform built with micro-frontend architecture. Implemented event-driven AWS Lambda functions and reusable UI component library.',
            technologies: ['StencilJS', 'AngularJS', 'Node.js', 'AWS Lambda', 'DynamoDB', 'TypeScript'],
            github_url: null,
            live_url: null,
            featured: false
          }
        ];

        for (const project of sampleProjects) {
          await dbService.query(
            'INSERT INTO projects (title, description, content, technologies, github_url, live_url, featured) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [project.title, project.description, project.content, JSON.stringify(project.technologies), project.github_url, project.live_url, project.featured]
          );
        }
        console.log('✅ Seeded sample projects');
        }

        // Seed work history data
        const workHistoryExists = await dbService.queryOne('SELECT id FROM work_history LIMIT 1');
        if (!workHistoryExists) {
          const workHistory = [
            {
              company: 'PASS LTD',
              position: 'Mid-Level Software Developer',
              location: 'Stockton-on-Tees, UK',
              start_date: '2024-06-01',
              end_date: '2024-08-31',
              description: 'Optimized system update processes and redesigned user interfaces to improve accessibility and user experience.',
              achievements: ['Optimized system update processes, reducing manual intervention by 80%', 'Redesigned the user interface improving accessibility and usability for 100% of users'],
              technologies: ['Git', 'GitLab', 'C#', 'Avalonia', 'WPF', 'Microsoft SQL', 'MVVM'],
              company_url: null
            },
            {
              company: '3T Global',
              position: 'Mid-Level Software Developer',
              location: 'Newcastle-upon-Tyne, UK (Remote)',
              start_date: '2022-07-01',
              end_date: '2024-06-30',
              description: 'Implemented micro-frontend architectures, designed AWS Lambda functions, and mentored junior developers in an Agile environment.',
              achievements: ['Implemented micro-frontend architectures, reducing frontend build times by 50%', 'Designed and optimized event-driven AWS Lambda functions, reducing data processing time by 60%', 'Built and documented a reusable UI component library, improving development efficiency by 40%', 'Led a data migration process ensuring 99.9% uptime', 'Mentored junior developers, improving team productivity by 25%'],
              technologies: ['Git', 'C#', 'JavaScript', 'TypeScript', 'StencilJS', 'AngularJS', 'Node.js', 'DynamoDB', 'Microsoft SQL', 'Aurora Serverless', 'Next.js', 'OpenSearch', 'Storybook', 'AWS', 'Webpack', 'Babel', 'ESLint', 'Prettier'],
              company_url: null
            },
            {
              company: '3T Global',
              position: 'Junior Software Developer',
              location: 'Newcastle-upon-Tyne, UK (Remote)',
              start_date: '2021-02-01',
              end_date: '2022-07-31',
              description: 'Maintained and optimized legacy systems while collaborating with cross-functional teams to deliver features efficiently.',
              achievements: ['Maintained and optimized legacy systems, reducing system downtime by 35%', 'Collaborated with cross-functional teams, delivering features 20% faster'],
              technologies: ['Git', 'C#', 'JavaScript', 'TypeScript', 'AngularJS', 'Microsoft SQL', 'CSS', 'HTML', '.NET MVC'],
              company_url: null
            }
          ];

          for (const work of workHistory) {
            await dbService.query(
              'INSERT INTO work_history (company, position, location, start_date, end_date, description, achievements, technologies, company_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
              [work.company, work.position, work.location, work.start_date, work.end_date, work.description, JSON.stringify(work.achievements), JSON.stringify(work.technologies), work.company_url]
            );
          }
          console.log('✅ Seeded work history data');
        }

        // Seed learning data
        const learningExists = await dbService.queryOne('SELECT id FROM learning LIMIT 1');
        if (!learningExists) {
          const learningItems = [
            {
              title: 'Quantum Computing Fundamentals',
              description: 'Exploring quantum computing principles, quantum algorithms, and their practical applications in modern computing.',
              progress: 45,
              category: 'Emerging Technology',
              start_date: '2024-01-15',
              estimated_completion: '2024-06-30',
              resources: ['IBM Qiskit Documentation', 'Quantum Computing Course', 'Research Papers'],
              status: 'in_progress'
            },
            {
              title: 'Advanced AWS Serverless Architecture',
              description: 'Deep diving into serverless patterns, Lambda optimization, and event-driven architectures on AWS.',
              progress: 75,
              category: 'Cloud Computing',
              start_date: '2023-11-01',
              estimated_completion: '2024-03-15',
              resources: ['AWS Documentation', 'Serverless Framework', 'AWS Well-Architected Framework'],
              status: 'in_progress'
            },
            {
              title: 'VR Development with Unity',
              description: 'Learning VR development for immersive experiences and interactive digital environments.',
              progress: 30,
              category: 'Game Development',
              start_date: '2024-02-01',
              estimated_completion: '2024-08-30',
              resources: ['Unity VR Documentation', 'VRChat SDK', 'Oculus Development Guide'],
              status: 'in_progress'
            }
          ];

          for (const learning of learningItems) {
            await dbService.query(
              'INSERT INTO learning (title, description, progress, category, start_date, estimated_completion, resources, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
              [learning.title, learning.description, learning.progress, learning.category, learning.start_date, learning.estimated_completion, JSON.stringify(learning.resources), learning.status]
            );
          }
          console.log('✅ Seeded learning data');
        }

        // Seed skills data
        const skillsExist = await dbService.queryOne('SELECT id FROM skills LIMIT 1');
        if (!skillsExist) {
          const skills = [
            { name: 'JavaScript', category: 'Programming Languages', level: 'Advanced', description: 'Expert in modern JavaScript, ES6+, and TypeScript' },
            { name: 'TypeScript', category: 'Programming Languages', level: 'Advanced', description: 'Strong typing and advanced TypeScript patterns' },
            { name: 'C#', category: 'Programming Languages', level: 'Advanced', description: '.NET development and enterprise applications' },
            { name: 'React', category: 'Frontend Frameworks', level: 'Advanced', description: 'Modern React with hooks, context, and performance optimization' },
            { name: 'Next.js', category: 'Frontend Frameworks', level: 'Advanced', description: 'Full-stack React framework with SSR and API routes' },
            { name: 'AngularJS', category: 'Frontend Frameworks', level: 'Intermediate', description: 'Legacy AngularJS maintenance and development' },
            { name: 'StencilJS', category: 'Frontend Frameworks', level: 'Intermediate', description: 'Web component development and micro-frontends' },
            { name: 'Node.js', category: 'Backend Technologies', level: 'Advanced', description: 'Server-side JavaScript and API development' },
            { name: 'AWS', category: 'Cloud Platforms', level: 'Advanced', description: 'Lambda, DynamoDB, Aurora, and serverless architectures' },
            { name: 'PostgreSQL', category: 'Databases', level: 'Intermediate', description: 'Relational database design and optimization' },
            { name: 'Microsoft SQL', category: 'Databases', level: 'Intermediate', description: 'Enterprise database development and management' },
            { name: 'DynamoDB', category: 'Databases', level: 'Intermediate', description: 'NoSQL database design and optimization' },
            { name: 'Git', category: 'Development Tools', level: 'Advanced', description: 'Version control and collaborative development workflows' },
            { name: 'Docker', category: 'DevOps', level: 'Intermediate', description: 'Containerization and deployment strategies' },
            { name: 'Microservices', category: 'Architecture', level: 'Advanced', description: 'Event-driven architecture and distributed systems' },
            { name: 'Micro-Frontends', category: 'Architecture', level: 'Advanced', description: 'Scalable frontend architecture patterns' }
          ];

          for (const skill of skills) {
            await dbService.query(
              'INSERT INTO skills (name, category, level, description) VALUES ($1, $2, $3, $4)',
              [skill.name, skill.category, skill.level, skill.description]
            );
          }
          console.log('✅ Seeded skills data');
        }

        // Seed education data
        const educationExists = await dbService.queryOne('SELECT id FROM education LIMIT 1');
        if (!educationExists) {
          const educationItems = [
            {
              institution: 'Teesside University',
              degree: 'Bachelor of Science',
              field_of_study: 'Computer Science',
              location: 'Middlesbrough, UK',
              start_date: '2017-09-01',
              end_date: '2021-06-30',
              grade: 'First Class Honours',
              description: 'Comprehensive computer science program covering software engineering, algorithms, databases, and system design.',
              achievements: ['First Class Honours degree', 'Dean\'s List for academic excellence', 'Final year project on distributed systems']
            }
          ];

          for (const education of educationItems) {
            await dbService.query(
              'INSERT INTO education (institution, degree, field_of_study, location, start_date, end_date, grade, description, achievements) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
              [education.institution, education.degree, education.field_of_study, education.location, education.start_date, education.end_date, education.grade, education.description, JSON.stringify(education.achievements)]
            );
          }
          console.log('✅ Seeded education data');
        }

        // Seed certifications data
        const certificationsExist = await dbService.queryOne('SELECT id FROM certifications LIMIT 1');
        if (!certificationsExist) {
          const certifications = [
            {
              name: 'AWS Certified Solutions Architect - Associate',
              issuer: 'Amazon Web Services',
              issue_date: '2023-03-15',
              expiry_date: '2026-03-15',
              credential_id: 'AWS-SAA-2023-001',
              credential_url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
              description: 'Validates expertise in designing distributed systems on AWS with focus on scalability, security, and cost optimization.',
              skills: ['AWS Lambda', 'EC2', 'S3', 'RDS', 'DynamoDB', 'CloudFormation', 'IAM']
            },
            {
              name: 'Microsoft Certified: Azure Developer Associate',
              issuer: 'Microsoft',
              issue_date: '2022-11-20',
              expiry_date: '2024-11-20',
              credential_id: 'MS-AZ-204-2022',
              credential_url: 'https://docs.microsoft.com/en-us/learn/certifications/azure-developer/',
              description: 'Demonstrates skills in developing cloud solutions on Microsoft Azure platform.',
              skills: ['Azure Functions', 'Azure App Service', 'Azure Storage', 'Azure SQL', 'ARM Templates']
            }
          ];

          for (const cert of certifications) {
            await dbService.query(`
              INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, credential_url, description, skills)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
              cert.name,
              cert.issuer,
              cert.issue_date,
              cert.expiry_date,
              cert.credential_id,
              cert.credential_url,
              cert.description,
              JSON.stringify(cert.skills)
            ]);
          }

          console.log('✅ Seeded certifications data');
        }
      } catch (error) {
        console.error('❌ Error seeding initial data:', error);
        throw error;
      }
    }
  }
];

async function runMigrations() {
  try {
    console.log('🚀 Starting PostgreSQL database migrations...');
    
    // Initialize services
    await initializeServices();
    const { dbService } = getServices();

    // Check migrations table status
    console.log('📋 Checking migrations table...');
    const migrationsTableExists = await dbService.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'migrations'
    `);
    
    if (migrationsTableExists.length === 0) {
      console.log('⚠️  Migrations table does not exist - will be created by first migration');
    } else {
      console.log('✅ Migrations table exists');
      
      // Show current migration status
      const currentMigrations = await dbService.query('SELECT * FROM migrations ORDER BY id');
      console.log('📊 Current migration status:');
      if (currentMigrations.length === 0) {
        console.log('   No migrations executed yet');
      } else {
        currentMigrations.forEach((m: any) => {
          console.log(`   ✓ ID ${m.id}: ${m.name} (executed: ${m.executed_at})`);
        });
      }
    }

    // Get executed migrations
    const executedMigrations = await getExecutedMigrations();
    console.log(`📈 Found ${executedMigrations.length} executed migrations: [${executedMigrations.join(', ')}]`);
    
    // Run pending migrations
    let pendingCount = 0;
    for (const migration of migrations) {
      if (!executedMigrations.includes(migration.id)) {
        pendingCount++;
        console.log(`⏳ Running migration ${migration.id}: ${migration.name}`);
        await migration.up();
        await markMigrationAsExecuted(migration.id, migration.name);
        console.log(`✅ Completed migration ${migration.id}: ${migration.name}`);
      } else {
        console.log(`⏭️  Skipping migration ${migration.id}: ${migration.name} (already executed)`);
      }
    }

    if (pendingCount === 0) {
      console.log('🎯 No pending migrations - database is up to date!');
    } else {
      console.log(`🎉 Successfully executed ${pendingCount} migrations!`);
    }
    
    console.log('🎉 All PostgreSQL migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

async function getExecutedMigrations(): Promise<number[]> {
  try {
    const { dbService } = getServices();
    const result = await dbService.query('SELECT id FROM migrations');
    return result.map((row: any) => row.id);
  } catch (error) {
    // Migrations table doesn't exist yet, return empty array
    return [];
  }
}

async function markMigrationAsExecuted(id: number, name: string) {
  const { dbService } = getServices();
  await dbService.query('INSERT INTO migrations (id, name) VALUES ($1, $2)', [id, name]);
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations };
