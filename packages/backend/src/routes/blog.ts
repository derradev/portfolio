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

    const { supabaseService } = getServices()
    
    let query = supabaseService.getClient()
      .from('blog_posts')
      .select('id, title, slug, excerpt, created_at, category, tags, featured, author, read_time')
      .eq('published', true)

    // Add category filter
    if (category) {
      query = query.eq('category', category as string)
    }

    // Add search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
    }

    // Add ordering and pagination
    query = query
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1)

    const { data: posts, error } = await query
    if (error) throw error

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
    const { supabaseService } = getServices()
    const post = await supabaseService.queryOne(`
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
    const { supabaseService } = getServices()
    const posts = await supabaseService.query(`
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

    const { supabaseService } = getServices()
    // Create slug from title
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    // Check if slug already exists    // Generate unique slug
    let uniqueSlug = slug
    let counter = 1
    while (true) {
      try {
        await supabaseService.selectOne('blog_posts', uniqueSlug, 'id')
        // If we get here, slug exists, try next one
        uniqueSlug = `${slug}-${counter}`
        counter++
      } catch (error) {
        // Slug doesn't exist, we can use it
        break
      }
    }

    // Insert new blog post
    const newPost = await supabaseService.insert('blog_posts', {
      title,
      slug: uniqueSlug,
      excerpt,
      content,
      category,
      tags,
      featured,
      published,
      author,
      read_time,
      created_at: publish_date
    })

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
    const { supabaseService } = getServices()

    // Check if post exists
    const existingPost = await supabaseService.queryOne('SELECT * FROM blog_posts WHERE id = $1', [id])

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

    const updatedPost = await supabaseService.queryOne(updateQuery, updateValues)

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
    const { supabaseService } = getServices()

    // Check if post exists
    const existingPost = await supabaseService.queryOne('SELECT id FROM blog_posts WHERE slug = $1', [slug])

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        error: 'Blog post not found'
      })
    }

    // Delete the post
    await supabaseService.query('DELETE FROM blog_posts WHERE slug = $1', [slug])

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
