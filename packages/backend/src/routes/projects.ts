import express from 'express'
import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { getServices } from '../services'

const router = express.Router()

// Get all projects (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { dbService } = getServices()
    const projects = await dbService.query(`
      SELECT 
        id, 
        title, 
        description, 
        image_url, 
        technologies, 
        github_url, 
        live_url, 
        date,
        featured
      FROM projects
      ORDER BY date DESC
    `)

    // Parse JSON fields
    const parsedProjects = projects.map((project: any) => ({
      ...project,
      technologies: typeof project.technologies === 'string' 
        ? (project.technologies.startsWith('[') ? JSON.parse(project.technologies) : project.technologies.split(',').map((t: string) => t.trim()))
        : project.technologies || [],
      featured: Boolean(project.featured),
      // Format date as YYYY-MM-DD
      date: project.date.toISOString().split('T')[0]
    }))

    return res.json({
      success: true,
      data: parsedProjects
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get single project by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { dbService } = getServices()
    const project = await dbService.queryOne(`
      SELECT 
        id, 
        title, 
        description, 
        image_url, 
        technologies, 
        github_url, 
        live_url, 
        date,
        featured
      FROM projects
      WHERE id = $1
    `, [id])

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
router.post('/', [
  authenticate,
  authorize('admin'),
  body('title').isLength({ min: 1 }).trim(),
  body('description').isLength({ min: 1 }).trim(),
  body('image_url').optional().isURL(),
  body('technologies').isArray({ min: 1 }),
  body('github_url').optional().isURL(),
  body('live_url').optional().isURL(),
  body('featured').optional().isBoolean()
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: errors.array()
      })
    }

    const {
      title,
      description,
      image_url,
      technologies,
      github_url,
      live_url,
      featured = false
    } = req.body

    const { dbService } = getServices()
    // Insert new project
    const result = await dbService.query(`
      INSERT INTO projects (title, description, image_url, technologies, github_url, live_url, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [title, description, image_url, JSON.stringify(technologies), github_url, live_url, featured])

    const newProject = await dbService.queryOne('SELECT * FROM projects WHERE id = $1', [result[0].id])

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
    const { dbService } = getServices()

    // Check if project exists
    const existingProject = await dbService.queryOne('SELECT * FROM projects WHERE id = $1', [id])

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

    const updatedProject = await dbService.queryOne(updateQuery, updateValues)

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
    const { dbService } = getServices()

    // Check if project exists
    const existingProject = await dbService.queryOne('SELECT id FROM projects WHERE id = $1', [id])

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    // Delete the project
    await dbService.query('DELETE FROM projects WHERE id = $1', [id])

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
