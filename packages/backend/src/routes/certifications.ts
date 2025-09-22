import { Router, Request, Response } from 'express'
import { getServices } from '../services'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Get all certifications (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    
    const { data: certifications, error } = await supabaseService.getClient()
      .from('certifications')
      .select('id, name, issuer, issue_date, expiry_date, credential_id, credential_url, description, skills')
      .order('issue_date', { ascending: false })
    
    if (error) throw error

    const parsedCertifications = certifications.map((cert: any) => ({
      ...cert,
      skills: cert.skills ? (
        typeof cert.skills === 'string' ? 
          (cert.skills.startsWith('[') ? JSON.parse(cert.skills) : [cert.skills]) :
          cert.skills
      ) : []
    }))

    return res.json({
      success: true,
      data: parsedCertifications
    })
  } catch (error) {
    console.error('Get certifications error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get single certification by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { id } = req.params

    const certification = await supabaseService.queryOne(`
      SELECT id, name, issuer, issue_date, expiry_date, credential_id, credential_url, description, skills
      FROM certifications
      WHERE id = $1
    `, [id])

    if (!certification) {
      return res.status(404).json({
        success: false,
        error: 'Certification not found'
      })
    }

    const parsedCertification = {
      ...certification,
      skills: certification.skills ? (
        typeof certification.skills === 'string' ? 
          (certification.skills.startsWith('[') ? JSON.parse(certification.skills) : [certification.skills]) :
          certification.skills
      ) : []
    }

    return res.json({
      success: true,
      data: parsedCertification
    })
  } catch (error) {
    console.error('Get certification by ID error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Create new certification (admin only)
router.post('/', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { 
      name, 
      issuer, 
      issue_date, 
      expiry_date, 
      credential_id, 
      credential_url, 
      description, 
      skills 
    } = req.body

    // Validate required fields
    if (!name || !issuer || !issue_date) {
      return res.status(400).json({
        success: false,
        error: 'Name, issuer, and issue_date are required'
      })
    }

    const result = await supabaseService.queryOne(`
      INSERT INTO certifications (name, issuer, issue_date, expiry_date, credential_id, credential_url, description, skills)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      name, 
      issuer, 
      issue_date, 
      expiry_date, 
      credential_id, 
      credential_url, 
      description, 
      JSON.stringify(skills || [])
    ])

    const parsedResult = {
      ...result,
      skills: (() => {
        try {
          return JSON.parse(result.skills || '[]')
        } catch {
          return []
        }
      })()
    }

    return res.status(201).json({
      success: true,
      data: parsedResult
    })
  } catch (error) {
    console.error('Create certification error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update certification (admin only)
router.put('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { id } = req.params
    const { 
      name, 
      issuer, 
      issue_date, 
      expiry_date, 
      credential_id, 
      credential_url, 
      description, 
      skills 
    } = req.body

    // Validate required fields
    if (!name || !issuer || !issue_date) {
      return res.status(400).json({
        success: false,
        error: 'Name, issuer, and issue_date are required'
      })
    }

    const result = await supabaseService.queryOne(`
      UPDATE certifications 
      SET name = $1, issuer = $2, issue_date = $3, expiry_date = $4, credential_id = $5, 
          credential_url = $6, description = $7, skills = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [
      name, 
      issuer, 
      issue_date, 
      expiry_date, 
      credential_id, 
      credential_url, 
      description, 
      JSON.stringify(skills || []), 
      id
    ])

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Certification not found'
      })
    }

    const parsedResult = {
      ...result,
      skills: (() => {
        try {
          return JSON.parse(result.skills || '[]')
        } catch {
          return []
        }
      })()
    }

    return res.json({
      success: true,
      data: parsedResult
    })
  } catch (error) {
    console.error('Update certification error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Delete certification (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { supabaseService } = getServices()
    const { id } = req.params

    const result = await supabaseService.queryOne(`
      DELETE FROM certifications 
      WHERE id = $1 
      RETURNING id
    `, [id])

    if (!result) {
      return res.status(404).json({
        success: false,
        error: 'Certification not found'
      })
    }

    return res.json({
      success: true,
      message: 'Certification deleted successfully'
    })
  } catch (error) {
    console.error('Delete certification error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
