import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

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

// Load environment variables
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })
// Fallback to default .env if specific env file doesn't exist
dotenv.config()

const app = express()

// Rate limiting (more lenient for serverless)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for serverless
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
    // Add Vercel preview URLs
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true
}))

// Only use morgan in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('combined'))
}

app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    api_url: process.env.API_URL || 'localhost'
  })
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

// Error handling
app.use(notFound)
app.use(errorHandler)

// Initialize services for serverless
let servicesInitialized = false

async function ensureServicesInitialized() {
  if (!servicesInitialized) {
    try {
      await initializeServices()
      servicesInitialized = true
      console.log('✅ Services initialized for serverless function')
    } catch (error) {
      console.error('❌ Service initialization failed:', error)
      throw error
    }
  }
}

// Middleware to ensure services are initialized
app.use(async (req, res, next) => {
  try {
    await ensureServicesInitialized()
    next()
  } catch (error) {
    console.error('Service initialization error:', error)
    res.status(500).json({ error: 'Service initialization failed' })
  }
})

export default app
