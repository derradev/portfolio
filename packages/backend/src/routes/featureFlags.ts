import express from 'express'
import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { getServices } from '../services'

const router = express.Router()

// Get all feature flags (admin only)
router.get('/', [
  authenticate,
  authorize('admin')
], async (req: AuthRequest, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { data: featureFlags, error } = await supabaseService.getClient()
      .from('feature_flags')
      .select('id, name, description, enabled, created_at, updated_at')
      .order('name', { ascending: true })
    
    if (error) throw error

    return res.json({
      success: true,
      data: featureFlags
    })
  } catch (error) {
    console.error('Get feature flags error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get single feature flag (admin only)
router.get('/:id', [
  authenticate,
  authorize('admin')
], async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { supabaseService } = getServices()
    
    const featureFlag = await supabaseService.queryOne(`
      SELECT id, name, description, enabled, created_at, updated_at
      FROM feature_flags
      WHERE id = $1
    `, [id])

    if (!featureFlag) {
      return res.status(404).json({
        success: false,
        error: 'Feature flag not found'
      })
    }

    return res.json({
      success: true,
      data: featureFlag
    })
  } catch (error) {
    console.error('Get feature flag error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Create feature flag (admin only)
router.post('/', [
  authenticate,
  authorize('admin'),
  body('name').isLength({ min: 1 }).trim(),
  body('description').optional().isLength({ min: 1 }).trim(),
  body('enabled').optional().isBoolean()
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
      name,
      description,
      enabled = false
    } = req.body

    const { supabaseService } = getServices()
    
    const result = await supabaseService.query(`
      INSERT INTO feature_flags (name, description, enabled)
      VALUES ($1, $2, $3)
      RETURNING id, name, description, enabled, created_at, updated_at
    `, [name, description, enabled])

    return res.status(201).json({
      success: true,
      data: result[0]
    })
  } catch (error) {
    console.error('Create feature flag error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update feature flag (admin only)
router.put('/:id', [
  authenticate,
  authorize('admin'),
  body('name').optional().isLength({ min: 1 }).trim(),
  body('description').optional().isLength({ min: 1 }).trim(),
  body('enabled').optional().isBoolean()
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

    // Check if feature flag exists
    const existingFlag = await supabaseService.queryOne('SELECT * FROM feature_flags WHERE id = $1', [id])

    if (!existingFlag) {
      return res.status(404).json({
        success: false,
        error: 'Feature flag not found'
      })
    }

    // Build update query dynamically
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
      UPDATE feature_flags 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, description, enabled, created_at, updated_at
    `

    const updatedFlag = await supabaseService.queryOne(updateQuery, updateValues)

    return res.json({
      success: true,
      data: updatedFlag
    })
  } catch (error) {
    console.error('Update feature flag error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Delete feature flag (admin only)
router.delete('/:id', [
  authenticate,
  authorize('admin')
], async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { supabaseService } = getServices()

    const { data: deletedFlag, error } = await supabaseService.getClient()
      .from('feature_flags')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error || !deletedFlag) {
      return res.status(404).json({
        success: false,
        error: 'Feature flag not found'
      })
    }

    return res.json({
      success: true,
      message: 'Feature flag deleted successfully'
    })
  } catch (error) {
    console.error('Delete feature flag error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
