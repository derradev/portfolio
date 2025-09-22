import express from 'express'
import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { getServices } from '../services'

const router = express.Router()

// Get all projects (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const projects = await supabaseService.select(
      'projects', 
      'id, title, description, image, technologies, github_url, live_url, featured, date, created_at, updated_at'
    )

    // Sort by featured first, then by created_at desc
    projects.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    res.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    })
  }
})

// Get single project by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { supabaseService } = getServices()
    
    const project = await supabaseService.selectOne(
      'projects', 
      id, 
      'id, title, description, content, image, technologies, github_url, live_url, featured, date, created_at, updated_at'
    )

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    const parsedProject = {
      ...project,
      technologies: typeof project.technologies === 'string' 
        ? (project.technologies.startsWith('[') ? JSON.parse(project.technologies) : project.technologies.split(',').map((t: string) => t.trim()))
        : project.technologies || [],
      featured: Boolean(project.featured)
    }

    return res.json({
      success: true,
      data: parsedProject
    })
  } catch (error) {
    console.error('Get project error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Create project (admin only)
router.post('/', authenticate, authorize('admin'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required')
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { title, description, content, technologies, github_url, live_url, image, featured, date } = req.body
    const { supabaseService } = getServices()

    const newProject = await supabaseService.insert('projects', {
      title,
      description,
      content,
      technologies: technologies || [],
      github_url,
      live_url,
      image,
      featured: featured || false,
      date
    })

    return res.status(201).json({
      success: true,
      data: {
        ...newProject,
        technologies: typeof newProject.technologies === 'string' 
          ? (newProject.technologies.startsWith('[') ? JSON.parse(newProject.technologies) : newProject.technologies.split(',').map((t: string) => t.trim()))
          : newProject.technologies || [],
        featured: Boolean(newProject.featured)
      }
    })
  } catch (error) {
    console.error('Create project error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update project (admin only)
router.put('/:id', [
  authenticate,
  authorize('admin'),
  body('title').optional().isLength({ min: 1 }).trim(),
  body('description').optional().isLength({ min: 1 }).trim(),
  body('image_url').optional().isURL({ require_protocol: false }),
  body('technologies').optional().isArray({ min: 1 }),
  body('github_url').optional().custom((value) => {
    if (value === null || value === '') return true
    return /^https?:\/\/.+/.test(value) || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(value)
  }),
  body('live_url').optional().custom((value) => {
    if (value === null || value === '') return true
    return /^https?:\/\/.+/.test(value) || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(value)
  }),
  body('featured').optional().isBoolean()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.error('Project update validation errors:', errors.array())
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: errors.array()
      })
    }

    const { id } = req.params
    const updateData = req.body
    const { supabaseService } = getServices()

    // Check if project exists
    const existingProject = await supabaseService.selectOne('projects', id)

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    // Build update query dynamically
    const updateFields = []
    const updateValues = []
    let paramIndex = 1

    Object.keys(updateData).forEach(key => {
      if (key === 'technologies') {
        updateFields.push(`${key} = $${paramIndex++}`)
        updateValues.push(JSON.stringify(updateData[key]))
      } else {
        updateFields.push(`${key} = $${paramIndex++}`)
        updateValues.push(updateData[key])
      }
    })

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    updateValues.push(id)

    const updateQuery = `
      UPDATE projects 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const updatedProject = await supabaseService.update('projects', id, updateData)

    return res.json({
      success: true,
      data: {
        ...updatedProject,
        technologies: (() => {
          try {
            return JSON.parse(updatedProject.technologies || '[]')
          } catch {
            return []
          }
        })(),
        featured: Boolean(updatedProject.featured)
      }
    })
  } catch (error) {
    console.error('Update project error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Delete project (admin only)
router.delete('/:id', [authenticate, authorize('admin')], async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { supabaseService } = getServices()

    // Check if project exists and delete it
    const { data: deletedProject, error } = await supabaseService.getClient()
      .from('projects')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error || !deletedProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    return res.json({
      success: true,
      message: 'Project deleted successfully'
    })
  } catch (error) {
    console.error('Delete project error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
