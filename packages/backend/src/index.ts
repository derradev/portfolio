import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import path from 'path'

// Load env: optional `.env`, then mode-specific file wins (override) so one project isn’t stuck from an old `.env`
const backendEnvDir = path.join(__dirname, '..')
dotenv.config({ path: path.join(backendEnvDir, '.env') })

console.log('🔍 Environment Check:')
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
console.log('NODE_ENV:', process.env.NODE_ENV)

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
import keepAliveRoutes from './routes/keepalive'
// import uploadRoutes from './routes/upload'

const envFileName =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: path.join(backendEnvDir, envFileName), override: true })
dotenv.config({ override: true })

const app = express()
const PORT = process.env.PORT || 3001

// Trust proxy for Vercel deployment
app.set('trust proxy', 1)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// Dynamic CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      process.env.ADMIN_URL || 'http://localhost:3002',
      'https://william-malone.com',
      'https://www.william-malone.com',
      'https://admin.william-malone.com',
      'https://api.william-malone.com'
    ]
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Check Vercel preview URLs
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true)
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'), false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(morgan('combined'))
// Handle favicon.ico requests very early (before body parsing)
app.use('/favicon.ico', (req, res) => {
  res.status(204).end()
})

app.use(limiter)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Also handle as a GET route
app.get('/favicon.ico', (req, res) => {
  res.status(204).end()
})

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API Server',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      keepalive: '/api/keepalive',
      api: '/api/*'
    }
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
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
app.use('/api/keepalive', keepAliveRoutes)
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
