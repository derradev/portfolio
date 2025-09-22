import express from 'express'
import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { getServices } from '../services'

const router = express.Router()

// Get all skills (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const skills = await supabaseService.query(`
      SELECT id, name, category, level, description
      FROM skills
      ORDER BY category, name
    `)

    return res.json({
      success: true,
      data: skills
    })
  } catch (error) {
    console.error('Get skills error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get skills by category (public)
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params
    const { supabaseService } = getServices()
    const skills = await supabaseService.query(`
      SELECT id, name, category, level, description
      FROM skills
      WHERE category = $1
      ORDER BY name
    `, [category])

    return res.json({
      success: true,
      data: skills
    })
  } catch (error) {
    console.error('Get skills by category error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Create skill (admin only)
router.post('/', [
  authenticate,
  authorize('admin'),
  body('name').isLength({ min: 1 }).trim(),
  body('category').isLength({ min: 1 }).trim(),
  body('level').isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  body('description').optional().isLength({ min: 1 }).trim()
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

    const { name, category, level, description } = req.body
    const { supabaseService } = getServices()

    const result = await supabaseService.query(`
      INSERT INTO skills (name, category, level, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `, [name, category, level, description])

    const newSkill = await supabaseService.queryOne('SELECT * FROM skills WHERE id = $1', [result[0].id])

    return res.status(201).json({
      success: true,
      data: newSkill
    })
  } catch (error) {
    console.error('Create skill error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update skill (admin only)
router.put('/:id', [
  authenticate,
  authorize('admin'),
  body('name').optional().isLength({ min: 1 }).trim(),
  body('category').optional().isLength({ min: 1 }).trim(),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  body('description').optional().isLength({ min: 1 }).trim()
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
    const { supabaseService } = getServices()

    const existingSkill = await supabaseService.queryOne('SELECT * FROM skills WHERE id = $1', [id])
    if (!existingSkill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      })
    }

    const updateFields = []
    const updateValues = []
    let paramIndex = 1

    Object.keys(updateData).forEach(key => {
      updateFields.push(`${key} = $${paramIndex++}`)
      updateValues.push(updateData[key])
    })

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    updateValues.push(id)

    const updateQuery = `
      UPDATE skills 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const updatedSkill = await supabaseService.queryOne(updateQuery, updateValues)

    return res.json({
      success: true,
      data: updatedSkill
    })
  } catch (error) {
    console.error('Update skill error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Delete skill (admin only)
router.delete('/:id', [authenticate, authorize('admin')], async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { supabaseService } = getServices()

    const existingSkill = await supabaseService.queryOne('SELECT id FROM skills WHERE id = $1', [id])
    if (!existingSkill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      })
    }

    await supabaseService.query('DELETE FROM skills WHERE id = $1', [id])

    return res.json({
      success: true,
      message: 'Skill deleted successfully'
    })
  } catch (error) {
    console.error('Delete skill error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
