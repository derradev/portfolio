import { Router, Request, Response } from 'express'
import { getServices } from '../services'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Get all education (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const education = await supabaseService.query(`
      SELECT id, institution, degree, field_of_study, location, start_date, end_date, grade, description, achievements
      FROM education
      ORDER BY start_date DESC
    `)

    const parsedEducation = education.map((edu: any) => ({
      ...edu,
      achievements: edu.achievements ? (
        typeof edu.achievements === 'string' ? 
          (edu.achievements.startsWith('[') ? JSON.parse(edu.achievements) : [edu.achievements]) :
          edu.achievements
      ) : []
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

// Get single education by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { id } = req.params

    const education = await supabaseService.queryOne(`
      SELECT id, institution, degree, field_of_study, location, start_date, end_date, grade, description, achievements
      FROM education
      WHERE id = $1
    `, [id])

    if (!education) {
      return res.status(404).json({
        success: false,
        error: 'Education not found'
      })
    }

    const parsedEducation = {
      ...education,
      achievements: education.achievements ? (
        typeof education.achievements === 'string' ? 
          (education.achievements.startsWith('[') ? JSON.parse(education.achievements) : [education.achievements]) :
          education.achievements
      ) : []
    }

    return res.json({
      success: true,
      data: parsedEducation
    })
  } catch (error) {
    console.error('Get education by ID error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Create new education (admin only)
router.post('/', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { 
      institution, 
      degree, 
      field_of_study, 
      location, 
      start_date, 
      end_date, 
      grade, 
      description, 
      achievements 
    } = req.body

    // Validate required fields
    if (!institution || !degree || !start_date) {
      return res.status(400).json({
        success: false,
        error: 'Institution, degree, and start_date are required'
      })
    }

    const result = await supabaseService.queryOne(`
      INSERT INTO education (institution, degree, field_of_study, location, start_date, end_date, grade, description, achievements)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      institution, 
      degree, 
      field_of_study, 
      location, 
      start_date, 
      end_date, 
      grade, 
      description, 
      JSON.stringify(achievements || [])
    ])

    const parsedResult = {
      ...result,
      achievements: result.achievements ? JSON.parse(result.achievements) : []
    }

    return res.status(201).json({
      success: true,
      data: parsedResult
    })
  } catch (error) {
    console.error('Create education error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update education (admin only)
router.put('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { id } = req.params
    const { 
      institution, 
      degree, 
      field_of_study, 
      location, 
      start_date, 
      end_date, 
      grade, 
      description, 
      achievements 
    } = req.body

    // Validate required fields
    if (!institution || !degree || !start_date) {
      return res.status(400).json({
        success: false,
        error: 'Institution, degree, and start_date are required'
      })
    }

    const result = await supabaseService.queryOne(`
      UPDATE education 
      SET institution = $1, degree = $2, field_of_study = $3, location = $4, start_date = $5, 
          end_date = $6, grade = $7, description = $8, achievements = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `, [
      institution, 
      degree, 
      field_of_study, 
      location, 
      start_date, 
      end_date, 
      grade, 
      description, 
      JSON.stringify(achievements || []), 
      id
    ])

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Education not found'
      })
    }

    const parsedResult = {
      ...result,
      achievements: result.achievements ? JSON.parse(result.achievements) : []
    }

    return res.json({
      success: true,
      data: parsedResult
    })
  } catch (error) {
    console.error('Update education error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Delete education (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { id } = req.params

    const result = await supabaseService.queryOne(`
      DELETE FROM education 
      WHERE id = $1 
      RETURNING id
    `, [id])

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Education not found'
      })
    }

    return res.json({
      success: true,
      message: 'Education deleted successfully'
    })
  } catch (error) {
    console.error('Delete education error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
