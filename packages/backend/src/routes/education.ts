import { Router, Request, Response } from 'express'
import { getServices } from '../services'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all education (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    
    const { data: education, error } = await supabaseService.getClient()
      .from('education')
      .select('id, institution, degree, field_of_study, location, start_date, end_date, gpa, description, achievements')
      .order('start_date', { ascending: false })
    
    if (error) throw error

    const parsedEducation = education.map((edu: any) => ({
      ...edu,
      grade: edu.gpa, // Include grade for frontend compatibility
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

    const education = await supabaseService.selectOne(
      'education',
      id,
      'id, institution, degree, field_of_study, location, start_date, end_date, gpa, description, achievements'
    )

    if (!education) {
      return res.status(404).json({
        success: false,
        error: 'Education not found'
      })
    }

    const parsedEducation = {
      ...education,
      grade: education.gpa, // Include grade for frontend compatibility
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

    const result = await supabaseService.insert('education', {
      institution, 
      degree, 
      field_of_study, 
      location, 
      start_date, 
      end_date, 
      gpa: grade, 
      description, 
      achievements: achievements || []
    })

    const parsedResult = {
      ...result,
      grade: result.gpa, // Include grade for frontend compatibility
      achievements: result.achievements ? (
        typeof result.achievements === 'string' 
          ? (result.achievements.startsWith('[') ? JSON.parse(result.achievements) : [result.achievements])
          : result.achievements
      ) : []
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

    const result = await supabaseService.update('education', id, {
      institution, 
      degree, 
      field_of_study, 
      location, 
      start_date, 
      end_date, 
      gpa: grade, 
      description, 
      achievements: achievements || [],
      updated_at: new Date().toISOString()
    })

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Education not found'
      })
    }

    const parsedResult = {
      ...result,
      grade: result.gpa, // Include grade for frontend compatibility
      achievements: result.achievements ? (
        typeof result.achievements === 'string' 
          ? (result.achievements.startsWith('[') ? JSON.parse(result.achievements) : [result.achievements])
          : result.achievements
      ) : []
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
router.delete('/:id', [authenticate, authorize('admin')], async (req: AuthRequest, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { id } = req.params

    // Check if education exists and delete it
    const { data: deletedEducation, error } = await supabaseService.getClient()
      .from('education')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error || !deletedEducation) {
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
