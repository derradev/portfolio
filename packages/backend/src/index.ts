import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import path from 'path'

import { initializeServices } from './services'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

// Routes
import projectsRouter from './routes/projects'
import blogRouter from './routes/blog'
import learningRouter from './routes/learning'
import workHistoryRouter from './routes/workHistory'
import authRouter from './routes/supabase-auth'
import skillsRouter from './routes/skills'
import educationRoutes from './routes/education'
import certificationsRoutes from './routes/certifications'
import analyticsRoutes from './routes/analytics'
import featureFlagsRoutes from './routes/featureFlags'
// import uploadRoutes from './routes/upload'

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })
// Fallback to default .env if specific env file doesn't exist
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3002',
    // Add your custom domains
    'https://demitaylornimmo.com',
    'https://www.demitaylornimmo.com',
    'https://admin.demitaylornimmo.com',
    'https://api.demitaylornimmo.com',
    // Add Vercel preview URLs
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true
}))
app.use(morgan('combined'))
app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Handle favicon.ico requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end()
})

// API Routes
app.use('/api/auth', authRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/learning', learningRouter)
app.use('/api/work-history', workHistoryRouter)
app.use('/api/blog', blogRouter)
app.use('/api/skills', skillsRouter)
app.use('/api/education', educationRoutes)
app.use('/api/certifications', certificationsRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/feature-flags', featureFlagsRoutes)
// app.use('/api/upload', uploadRoutes)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start server first, then initialize database
async function startServer() {
  // Start the HTTP server first
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api`)
  })

  // Initialize Supabase services in background
  try {
    await initializeServices()
    console.log('✅ Supabase services initialized successfully')
  } catch (error) {
    console.error('❌ Supabase service initialization failed:', error)
    console.log('⚠️  Server running without Supabase connection')
  }
}

startServer()

export default app
