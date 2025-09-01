import express from 'express'
import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { getServices } from '../services'

const router = express.Router()

// Get all learning items (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { dbService } = getServices()
    const learning = await dbService.query(`
      SELECT id, title, description, progress, category, start_date, estimated_completion, resources, status
      FROM learning
      ORDER BY start_date DESC
    `)

    const parsedLearning = learning.map((item: any) => ({
      ...item,
      resources: item.resources ? (
        typeof item.resources === 'string' ? 
          (item.resources.startsWith('[') ? JSON.parse(item.resources) : [item.resources]) :
          item.resources
      ) : []
    }))

    return res.json({
      success: true,
      data: parsedLearning
    })
  } catch (error) {
    console.error('Get learning error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get learning items by skills category (public)
router.get('/skills', async (req: Request, res: Response) => {
  try {
    const { dbService } = getServices()
    const learning = await dbService.query(`
      SELECT id, title, description, progress, category, start_date, estimated_completion, resources, status
      FROM learning
      WHERE category = 'skills'
      ORDER BY start_date DESC
    `)

    const parsedLearning = learning.map((item: any) => ({
      ...item,
      resources: item.resources ? (
        typeof item.resources === 'string' ? 
          (item.resources.startsWith('[') ? JSON.parse(item.resources) : [item.resources]) :
          item.resources
      ) : []
    }))

    return res.json({
      success: true,
      data: parsedLearning
    })
  } catch (error) {
    console.error('Get learning skills error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get learning items by category (public)
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params
    const { dbService } = getServices()
    const learning = await dbService.query(`
      SELECT id, title, description, progress, category, start_date, estimated_completion, resources, status
      FROM learning
      WHERE category = $1
      ORDER BY start_date DESC
    `, [category])

    const parsedLearning = learning.map((item: any) => ({
      ...item,
      resources: item.resources ? (
        typeof item.resources === 'string' ? 
          (item.resources.startsWith('[') ? JSON.parse(item.resources) : [item.resources]) :
          item.resources
      ) : []
    }))

    return res.json({
      success: true,
      data: parsedLearning
    })
  } catch (error) {
    console.error('Get learning by category error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get single learning item by ID (public)
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
    
    const { dbService } = getServices()
    const learningItem = await dbService.queryOne(`
      SELECT id, title, description, progress, category, start_date, estimated_completion, resources, status
      FROM learning
      WHERE id = $1
    `, [id])

    if (!learningItem) {
      return res.status(404).json({
        success: false,
        error: 'Learning item not found'
      })
    }

    const parsedItem = {
      ...learningItem,
      resources: learningItem.resources ? (
        typeof learningItem.resources === 'string' ? 
          (learningItem.resources.startsWith('[') ? JSON.parse(learningItem.resources) : [learningItem.resources]) :
          learningItem.resources
      ) : []
    }

    return res.json({
      success: true,
      data: parsedItem
    })
  } catch (error) {
    console.error('Get learning item error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Create learning item (admin only)
router.post('/', [
  authenticate,
  authorize('admin'),
  body('title').isLength({ min: 1 }).trim(),
  body('description').isLength({ min: 1 }).trim(),
  body('progress').isNumeric().toFloat(),
  body('category').isLength({ min: 1 }).trim(),
  body('start_date').isISO8601(),
  body('estimated_completion').optional({ nullable: true, checkFalsy: true }).isISO8601(),
  body('resources').optional().isArray(),
  body('status').isIn(['not_started', 'in_progress', 'completed', 'paused'])
], async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.error('Learning validation errors:', errors.array())
      console.error('Request body:', req.body)
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: errors.array()
      })
    }

    const {
      title,
      description,
      progress,
      category,
      start_date,
      estimated_completion,
      resources = [],
      status
    } = req.body

    const { dbService } = getServices()
    // Handle empty estimated_completion date
    const completionDate = estimated_completion && estimated_completion.trim() !== '' ? estimated_completion : null
    
    // Insert new learning item
    const result = await dbService.query(`
      INSERT INTO learning (title, description, progress, category, start_date, estimated_completion, resources, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [title, description, progress, category, start_date, completionDate, JSON.stringify(resources), status])

    const newItem = await dbService.queryOne('SELECT * FROM learning WHERE id = $1', [result[0].id])

    return res.status(201).json({
      success: true,
      data: {
        ...newItem,
        resources: (() => {
          try {
            return JSON.parse(newItem.resources || '[]')
          } catch {
            return []
          }
        })()
      }
    })
  } catch (error) {
    console.error('Create learning item error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update learning item (admin only)
router.put('/:id', [
  authenticate,
  authorize('admin'),
  body('title').optional().isLength({ min: 1 }).trim(),
  body('description').optional().isLength({ min: 1 }).trim(),
  body('progress').optional().isNumeric().toFloat(),
  body('category').optional().isLength({ min: 1 }).trim(),
  body('start_date').optional().isISO8601(),
  body('estimated_completion').optional({ nullable: true, checkFalsy: true }).isISO8601(),
  body('resources').optional().isArray(),
  body('status').optional().isIn(['not_started', 'in_progress', 'completed', 'paused'])
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

    const { id } = req.params
    const updateData = req.body
    const { dbService } = getServices()

    // Check if learning item exists
    const existingItem = await dbService.queryOne('SELECT * FROM learning WHERE id = $1', [id])

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Learning item not found'
      })
    }

    // Build update query dynamically
    const updateFields = []
    const updateValues = []
    let paramIndex = 1

    Object.keys(updateData).forEach(key => {
      if (key === 'resources') {
        updateFields.push(`${key} = $${paramIndex++}`)
        updateValues.push(JSON.stringify(updateData[key]))
      } else if (key === 'estimated_completion') {
        // Handle empty estimated_completion date
        const completionDate = updateData[key] && updateData[key].trim() !== '' ? updateData[key] : null
        updateFields.push(`${key} = $${paramIndex++}`)
        updateValues.push(completionDate)
      } else {
        updateFields.push(`${key} = $${paramIndex++}`)
        updateValues.push(updateData[key])
      }
    })

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    updateValues.push(id)

    const updateQuery = `
      UPDATE learning 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const updatedItem = await dbService.queryOne(updateQuery, updateValues)

    return res.json({
      success: true,
      data: {
        ...updatedItem,
        resources: (() => {
          try {
            return JSON.parse(updatedItem.resources || '[]')
          } catch {
            return []
          }
        })()
      }
    })
  } catch (error) {
    console.error('Update learning item error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Delete learning item (admin only)
router.delete('/:id', [authenticate, authorize('admin')], async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { dbService } = getServices()

    // Check if learning item exists
    const existingItem = await dbService.queryOne('SELECT id FROM learning WHERE id = $1', [id])

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Learning item not found'
      })
    }

    // Delete the learning item
    await dbService.query('DELETE FROM learning WHERE id = $1', [id])

    return res.json({
      success: true,
      message: 'Learning item deleted successfully'
    })
  } catch (error) {
    console.error('Delete learning item error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
