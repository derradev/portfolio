import express from 'express'
import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { getServices } from '../services'

const router = express.Router()

// Get all work history (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    
    const { data: workHistory, error } = await supabaseService.getClient()
      .from('work_history')
      .select('id, company, position, location, start_date, end_date, description, achievements, technologies, company_url')
      .order('start_date', { ascending: false })
    
    if (error) throw error

    const parsedWorkHistory = workHistory.map((job: any) => ({
      ...job,
      achievements: job.achievements ? (
        typeof job.achievements === 'string' ? 
          (job.achievements.startsWith('[') ? JSON.parse(job.achievements) : [job.achievements]) :
          job.achievements
      ) : [],
      technologies: job.technologies ? (
        typeof job.technologies === 'string' ? 
          (job.technologies.startsWith('[') ? JSON.parse(job.technologies) : [job.technologies]) :
          job.technologies
      ) : []
    }))

    return res.json({
      success: true,
      data: parsedWorkHistory
    })
  } catch (error) {
    console.error('Get work history error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get education entries
router.get('/education', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    
    const { data: education, error } = await supabaseService.getClient()
      .from('education')
      .select('id, institution, degree, field_of_study, location, start_date, end_date, gpa, description, achievements')
      .order('start_date', { ascending: false })
    
    if (error) throw error

    const parsedEducation = education.map((edu: any) => ({
      ...edu,
      achievements: (() => {
        try {
          return JSON.parse(edu.achievements || '[]')
        } catch {
          return []
        }
      })()
    }))

    return res.json({
      success: true,
      data: parsedEducation
    })
  } catch (error) {
    console.error('Get education error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get work history entries with certifications
router.get('/certifications', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    
    const { data: workHistory, error } = await supabaseService.getClient()
      .from('work_history')
      .select('id, company, position, location, start_date, end_date, description, achievements, technologies, company_url')
      .or('position.ilike.%certification%,position.ilike.%certificate%,description.ilike.%certified%')
      .order('start_date', { ascending: false })
    
    if (error) throw error

    const parsedWorkHistory = workHistory.map((job: any) => ({
      ...job,
      achievements: job.achievements ? JSON.parse(job.achievements) : [],
      technologies: job.technologies ? JSON.parse(job.technologies) : []
    }))

    return res.json({
      success: true,
      data: parsedWorkHistory
    })
  } catch (error) {
    console.error('Get certifications error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get single work history item by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Validate that id is a number
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      })
    }
    
    const { supabaseService } = getServices()
    const job = await supabaseService.selectOne(
      'work_history',
      id,
      'id, company, position, location, start_date, end_date, description, achievements, technologies, company_url'
    )

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Work history item not found'
      })
    }

    const parsedJob = {
      ...job,
      achievements: job.achievements ? JSON.parse(job.achievements) : [],
      technologies: job.technologies ? JSON.parse(job.technologies) : []
    }

    return res.json({
      success: true,
      data: parsedJob
    })
  } catch (error) {
    console.error('Get work history item error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Create work history item (admin only)
router.post('/', [
  authenticate,
  authorize('admin'),
  body('company').isLength({ min: 1 }).trim(),
  body('position').isLength({ min: 1 }).trim(),
  body('location').isLength({ min: 1 }).trim(),
  body('start_date').isISO8601(),
  body('end_date').optional({ nullable: true, checkFalsy: true }).isISO8601(),
  body('description').isLength({ min: 1 }).trim(),
  body('achievements').optional().isArray(),
  body('technologies').optional().isArray(),
  body('company_url').optional().isURL()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.error('Work history validation errors:', errors.array())
      console.error('Request body:', req.body)
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: errors.array()
      })
    }

    const {
      company,
      position,
      location,
      start_date,
      end_date,
      description,
      achievements = [],
      technologies = [],
      company_url
    } = req.body

    const { supabaseService } = getServices()
    // Handle empty end_date
    const endDate = end_date && end_date.trim() !== '' ? end_date : null
    
    // Insert new work history entry
    const newItem = await supabaseService.insert('work_history', {
      company,
      position,
      location,
      start_date,
      end_date: endDate,
      description,
      achievements,
      technologies,
      company_url
    })

    return res.status(201).json({
      success: true,
      data: {
        ...newItem,
        achievements: (() => {
          try {
            return JSON.parse(newItem.achievements || '[]')
          } catch {
            return []
          }
        })(),
        technologies: (() => {
          try {
            return JSON.parse(newItem.technologies || '[]')
          } catch {
            return []
          }
        })()
      }
    })
  } catch (error) {
    console.error('Create work history item error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update work history item (admin only)
router.put('/:id', [
  authenticate,
  authorize('admin'),
  body('company').optional().isLength({ min: 1 }).trim(),
  body('position').optional().isLength({ min: 1 }).trim(),
  body('location').optional().isLength({ min: 1 }).trim(),
  body('start_date').optional().isISO8601(),
  body('end_date').optional({ nullable: true, checkFalsy: true }).isISO8601(),
  body('description').optional().isLength({ min: 1 }).trim(),
  body('achievements').optional().isArray(),
  body('technologies').optional().isArray(),
  body('company_url').optional().isURL()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.error('Work history update validation errors:', errors.array())
      console.error('Request body:', req.body)
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: errors.array()
      })
    }

    const { id } = req.params
    const updateData = req.body
    const { supabaseService } = getServices()

    // Check if work history entry exists
    const { data: existingJob, error: checkError } = await supabaseService.getClient()
      .from('work_history')
      .select('id')
      .eq('id', id)
      .single()

    if (checkError || !existingJob) {
      return res.status(404).json({
        success: false,
        error: 'Work history item not found'
      })
    }

    // Prepare update payload
    const updatePayload: any = {}
    
    Object.keys(updateData).forEach(key => {
      if (key === 'achievements' || key === 'technologies') {
        // Ensure arrays are stored as JSON strings
        updatePayload[key] = JSON.stringify(updateData[key])
      } else if (key === 'end_date') {
        // Handle empty end_date
        const endDate = updateData[key] && updateData[key].trim() !== '' ? updateData[key] : null
        updatePayload[key] = endDate
      } else if (key !== 'id') {
        // Include all other fields except id
        updatePayload[key] = updateData[key]
      }
    })

    // Always update updated_at
    updatePayload.updated_at = new Date().toISOString()

    // Use Supabase client update method
    const updatedItem = await supabaseService.update('work_history', id, updatePayload)

    return res.json({
      success: true,
      data: {
        ...updatedItem,
        achievements: (() => {
          try {
            return JSON.parse(updatedItem.achievements || '[]')
          } catch {
            return []
          }
        })(),
        technologies: (() => {
          try {
            return JSON.parse(updatedItem.technologies || '[]')
          } catch {
            return []
          }
        })()
      }
    })
  } catch (error) {
    console.error('Update work history item error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Delete work history item (admin only)
router.delete('/:id', [authenticate, authorize('admin')], async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { supabaseService } = getServices()

    // Check if work history entry exists and delete it
    const { data: deletedJob, error } = await supabaseService.getClient()
      .from('work_history')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error || !deletedJob) {
      return res.status(404).json({
        success: false,
        error: 'Work history item not found'
      })
    }

    return res.json({
      success: true,
      message: 'Work history item deleted successfully'
    })
  } catch (error) {
    console.error('Delete work history item error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
