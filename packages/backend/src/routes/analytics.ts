import express from 'express'
import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { getServices } from '../services'

const router = express.Router()

// Track page visit (public)
router.post('/track', [
  body('page_path').isLength({ min: 1 }).trim(),
  body('page_title').optional().isLength({ min: 1 }).trim(),
  body('session_id').isLength({ min: 1 }).trim(),
  body('referrer').optional().custom((value) => {
    if (value === null || value === '' || value === undefined) return true
    return /^https?:\/\/.+/.test(value) || /^[a-zA-Z0-9.-]+/.test(value)
  }),
  body('visit_duration').optional().isInt({ min: 0 })
], async (req: Request, res: Response) => {
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
      page_path,
      page_title,
      session_id,
      referrer,
      visit_duration = 0
    } = req.body

    const user_agent = req.headers['user-agent'] || ''
    const ip_address = req.ip || req.connection.remoteAddress || '127.0.0.1'

    const { supabaseService } = getServices()
    
    // Check if this is an update to existing session visit
    const { data: existingVisit, error: visitError } = await supabaseService.getClient()
      .from('analytics')
      .select('id')
      .eq('session_id', session_id)
      .eq('page_path', page_path)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    // Handle case where no existing visit is found (not an error)
    const hasExistingVisit = !visitError && existingVisit

    if (hasExistingVisit && visit_duration > 0) {
      // Update existing visit with duration
      await supabaseService.update('analytics', existingVisit.id, {
        visit_duration,
        updated_at: new Date().toISOString()
      })
    } else {
      // Insert new visit (temporarily remove page_title until column is added)
      await supabaseService.insert('analytics', {
        session_id,
        page_path,
        user_agent,
        ip_address,
        referrer,
        visit_duration
      })
    }

    return res.json({
      success: true,
      message: 'Visit tracked successfully'
    })
  } catch (error) {
    console.error('Track analytics error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get analytics overview (admin only)
router.get('/overview', [authenticate, authorize('admin')], async (req: AuthRequest, res: Response) => {
  try {
    const { supabaseService } = getServices()
    
    // Get total visits
    const totalVisits = await supabaseService.queryOne('SELECT COUNT(*) as count FROM analytics')
    
    // Get unique visitors (by session_id)
    const uniqueVisitors = await supabaseService.queryOne('SELECT COUNT(DISTINCT session_id) as count FROM analytics')
    
    // Get page views by path
    const pageViews = await supabaseService.query(`
      SELECT page_path, COUNT(*) as views, AVG(visit_duration) as avg_duration
      FROM analytics 
      GROUP BY page_path 
      ORDER BY views DESC
    `)
    
    // Get daily visits for last 30 days
    const dailyVisits = await supabaseService.query(`
      SELECT DATE(created_at) as date, COUNT(*) as visits
      FROM analytics 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `)
    
    // Get top referrers
    const topReferrers = await supabaseService.query(`
      SELECT referrer, COUNT(*) as visits
      FROM analytics 
      WHERE referrer IS NOT NULL AND referrer != ''
      GROUP BY referrer 
      ORDER BY visits DESC 
      LIMIT 10
    `)

    return res.json({
      success: true,
      data: {
        totalVisits: parseInt(totalVisits.count),
        uniqueVisitors: parseInt(uniqueVisitors.count),
        pageViews: pageViews.map((pv: any) => ({
          ...pv,
          views: parseInt(pv.views),
          avg_duration: pv.avg_duration ? Math.round(parseFloat(pv.avg_duration)) : 0
        })),
        dailyVisits: dailyVisits.map((dv: any) => ({
          ...dv,
          visits: parseInt(dv.visits)
        })),
        topReferrers: topReferrers.map((tr: any) => ({
          ...tr,
          visits: parseInt(tr.visits)
        }))
      }
    })
  } catch (error) {
    console.error('Get analytics overview error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get detailed analytics (admin only)
router.get('/detailed', [authenticate, authorize('admin')], async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit = 50, page_path, date_from, date_to } = req.query
    const offset = page ? (parseInt(page as string) - 1) * parseInt(limit as string) : 0

    let whereClause = 'WHERE 1=1'
    const queryParams: any[] = []
    let paramIndex = 1

    if (page_path) {
      whereClause += ` AND page_path = $${paramIndex++}`
      queryParams.push(page_path)
    }

    if (date_from) {
      whereClause += ` AND created_at >= $${paramIndex++}`
      queryParams.push(date_from)
    }

    if (date_to) {
      whereClause += ` AND created_at <= $${paramIndex++}`
      queryParams.push(date_to)
    }

    const { supabaseService } = getServices()
    
    const analytics = await supabaseService.query(`
      SELECT id, page_path, page_title, user_agent, ip_address, referrer, session_id, visit_duration, created_at
      FROM analytics 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, [...queryParams, limit, offset])

    const totalCount = await supabaseService.queryOne(`
      SELECT COUNT(*) as count FROM analytics ${whereClause}
    `, queryParams)

    return res.json({
      success: true,
      data: {
        analytics: analytics,
        pagination: {
          total: parseInt(totalCount.count),
          page: page ? parseInt(page as string) : 1,
          limit: parseInt(limit as string),
          totalPages: Math.ceil(parseInt(totalCount.count) / parseInt(limit as string))
        }
      }
    })
  } catch (error) {
    console.error('Get detailed analytics error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
