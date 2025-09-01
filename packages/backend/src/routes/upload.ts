import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || './uploads'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  }
})

// Upload single image (admin only)
router.post('/image', authenticate, authorize('admin'), (req: Request, res: Response, next: NextFunction) => {
  const uploadMiddleware = upload.single('image')
  uploadMiddleware(req as any, res as any, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      })
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        })
      }

      const fileUrl = `/uploads/${req.file.filename}`

      return res.json({
        success: true,
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size,
          url: fileUrl
        }
      })
    } catch (error) {
      console.error('Upload error:', error)
      return res.status(500).json({
        success: false,
        error: 'Upload failed'
      })
    }
  })
})

// Upload multiple images (admin only)
router.post('/images', authenticate, authorize('admin'), (req: Request, res: Response, next: NextFunction) => {
  const uploadMiddleware = upload.array('images', 10)
  uploadMiddleware(req as any, res as any, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      })
    }
    
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded'
        })
      }

      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        url: `/uploads/${file.filename}`
      }))

      return res.json({
        success: true,
        data: uploadedFiles
      })
    } catch (error) {
      console.error('Upload error:', error)
      return res.status(500).json({
        success: false,
        error: 'Upload failed'
      })
    }
  })
})

// Delete uploaded file (admin only)
router.delete('/:filename', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params
    const filePath = path.join(uploadDir, filename)

    // Security check: ensure filename doesn't contain path traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      })
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      })
    }

    // Delete file
    fs.unlinkSync(filePath)

    return res.json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    console.error('Delete file error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to delete file'
    })
  }
})

// Get list of uploaded files (admin only)
router.get('/', authenticate, authorize('admin'), async (req: AuthRequest, res: Response) => {
  try {
    const files = fs.readdirSync(uploadDir).map(filename => {
      const filePath = path.join(uploadDir, filename)
      const stats = fs.statSync(filePath)
      
      return {
        filename,
        size: stats.size,
        uploadDate: stats.birthtime,
        url: `/uploads/${filename}`
      }
    })

    return res.json({
      success: true,
      data: files
    })
  } catch (error) {
    console.error('Get files error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to get files'
    })
  }
})

export default router
