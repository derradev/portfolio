import express from 'express'
import { body, validationResult } from 'express-validator'
import { Request, Response } from 'express'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'
import { getServices } from '../services'

const router = express.Router()

// Get all published blog posts (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, limit = 10, offset = 0 } = req.query

    const { dbService } = getServices()
    let query = `
      SELECT id, title, slug, excerpt, created_at as publish_date, category, tags, featured, author, read_time
      FROM blog_posts
      WHERE published = true
    `
    const params = []
    let paramIndex = 1

    // Add category filter
    if (category) {
      query += ` AND category = $${paramIndex++}`
      params.push(category)
    }

    // Add search filter
    if (search) {
      query += ` AND (title ILIKE $${paramIndex++} OR excerpt ILIKE $${paramIndex++})`
      params.push(`%${search}%`, `%${search}%`)
    }

    query += ` ORDER BY publish_date DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(limit, offset)

    const posts = await dbService.query(query, params)

    const parsedPosts = posts.map((post: any) => {
      let tags = []
      try {
        if (post.tags) {
          // Try to parse as JSON first
          tags = JSON.parse(post.tags)
        }
      } catch (error) {
        // If JSON parsing fails, treat as comma-separated string
        if (typeof post.tags === 'string') {
          tags = post.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
        }
      }
      
      return {
        ...post,
        tags,
        featured: Boolean(post.featured)
      }
    })

    return res.json({
      success: true,
      data: parsedPosts
    })
  } catch (error) {
    console.error('Get blog posts error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get single blog post by slug (public)
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const { dbService } = getServices()
    const post = await dbService.queryOne(`
      SELECT id, title, slug, excerpt, content, created_at as publish_date, category, tags, featured, author, read_time
      FROM blog_posts
      WHERE slug = $1 AND published = true
    `, [slug])

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      })
    }

    let tags = []
    try {
      if (post.tags) {
        // Try to parse as JSON first
        tags = JSON.parse(post.tags)
      }
    } catch (error) {
      // If JSON parsing fails, treat as comma-separated string
      if (typeof post.tags === 'string') {
        tags = post.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      }
    }

    const parsedPost = {
      ...post,
      tags,
      featured: Boolean(post.featured)
    }

    return res.json({
      success: true,
      data: parsedPost
    })
  } catch (error) {
    console.error('Get blog post error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get all blog posts including drafts (admin only)
router.get('/admin/all', [authenticate, authorize('admin')], async (req: AuthRequest, res: Response) => {
  try {
    const { dbService } = getServices()
    const posts = await dbService.query(`
      SELECT id, title, slug, excerpt, created_at as publish_date, category, tags, featured, published, author, read_time
      FROM blog_posts
      ORDER BY created_at DESC
    `)

    const parsedPosts = posts.map((post: any) => {
      let tags = []
      try {
        if (post.tags) {
          // Try to parse as JSON first
          tags = JSON.parse(post.tags)
        }
      } catch (error) {
        // If JSON parsing fails, treat as comma-separated string
        if (typeof post.tags === 'string') {
          tags = post.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
        }
      }
      
      return {
        ...post,
        tags,
        featured: Boolean(post.featured),
        published: Boolean(post.published)
      }
    })

    return res.json({
      success: true,
      data: parsedPosts
    })
  } catch (error) {
    console.error('Get all blog posts error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Create blog post (admin only)
router.post('/', [
  authenticate,
  authorize('admin'),
  body('title').isLength({ min: 1 }).trim(),
  body('excerpt').isLength({ min: 1 }).trim(),
  body('content').isLength({ min: 1 }).trim(),
  body('category').isLength({ min: 1 }).trim(),
  body('tags').isArray({ min: 1 }),
  body('featured').optional().isBoolean(),
  body('published').optional().isBoolean()
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

    const { title, excerpt, content, category, tags, featured = false, published = false, author, read_time, publish_date } = req.body

    const { dbService } = getServices()
    // Create slug from title
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    // Check if slug already exists and make it unique
    let uniqueSlug = slug
    let counter = 1
    while (true) {
      const existingPost = await dbService.queryOne('SELECT id FROM blog_posts WHERE slug = $1', [uniqueSlug])
      if (!existingPost) {
        break
      }
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    // Insert new blog post
    const result = await dbService.query(`
      INSERT INTO blog_posts (title, slug, excerpt, content, category, tags, featured, published, author, read_time, publish_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [title, uniqueSlug, excerpt, content, category, JSON.stringify(tags), featured, published, author, read_time, publish_date])

    const newPost = await dbService.queryOne('SELECT * FROM blog_posts WHERE id = $1', [result[0].id])

    return res.status(201).json({
      success: true,
      data: {
        ...newPost,
        tags: (() => {
          try {
            if (newPost.tags) {
              return JSON.parse(newPost.tags)
            }
            return []
          } catch (error) {
            if (typeof newPost.tags === 'string') {
              return newPost.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
            }
            return []
          }
        })(),
        featured: Boolean(newPost.featured),
        published: Boolean(newPost.published)
      }
    })
  } catch (error) {
    console.error('Create blog post error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update blog post by ID (admin only)
router.put('/:id', [
  authenticate,
  authorize('admin'),
  body('title').optional().isLength({ min: 1 }).trim(),
  body('excerpt').optional().isLength({ min: 1 }).trim(),
  body('content').optional().isLength({ min: 1 }).trim(),
  body('category').optional().isLength({ min: 1 }).trim(),
  body('tags').optional().isArray({ min: 1 }),
  body('featured').optional().isBoolean(),
  body('published').optional().isBoolean()
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

    // Check if post exists
    const existingPost = await dbService.queryOne('SELECT * FROM blog_posts WHERE id = $1', [id])

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      })
    }

    // Build update query dynamically
    const updateFields = []
    const updateValues = []
    let paramIndex = 1

    Object.keys(updateData).forEach(key => {
      if (key === 'tags') {
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
      UPDATE blog_posts 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const updatedPost = await dbService.queryOne(updateQuery, updateValues)

    return res.json({
      success: true,
      data: {
        ...updatedPost,
        tags: (() => {
          try {
            if (updatedPost.tags) {
              return JSON.parse(updatedPost.tags)
            }
            return []
          } catch (error) {
            if (typeof updatedPost.tags === 'string') {
              return updatedPost.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
            }
            return []
          }
        })(),
        featured: Boolean(updatedPost.featured),
        published: Boolean(updatedPost.published)
      }
    })
  } catch (error) {
    console.error('Update blog post error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Delete blog post (admin only)
router.delete('/:slug', [authenticate, authorize('admin')], async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params
    const { dbService } = getServices()

    // Check if post exists
    const existingPost = await dbService.queryOne('SELECT id FROM blog_posts WHERE slug = $1', [slug])

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      })
    }

    // Delete the post
    await dbService.query('DELETE FROM blog_posts WHERE slug = $1', [slug])

    return res.json({
      success: true,
      message: 'Blog post deleted successfully'
    })
  } catch (error) {
    console.error('Delete blog post error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
