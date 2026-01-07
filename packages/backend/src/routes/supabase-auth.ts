import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { createClient } from '@supabase/supabase-js'
import { authenticate, authorize, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL environment variable is required')
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Base route for auth status
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Supabase Auth service is running',
    endpoints: {
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      logout: 'POST /api/auth/logout',
      refresh: 'POST /api/auth/refresh',
      me: 'GET /api/auth/me'
    }
  })
})

// Admin: create a user so other people can log in (bypasses email confirmation)
router.post(
  '/admin/create-user',
  authenticate,
  authorize('admin'),
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').optional().isLength({ min: 2 }).trim()
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        })
      }

      const { email, password, name } = req.body as { email: string; password: string; name?: string }

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          ...(name ? { name } : {}),
          role: 'admin'
        }
      })

      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      return res.json({
        success: true,
        data: {
          user: data.user
            ? {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || data.user.email,
                role: data.user.user_metadata?.role || 'admin'
              }
            : null
        }
      })
    } catch (error) {
      console.error('Admin create user error:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  }
)

// Login with Supabase Auth
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      })
    }

    if (!data.user || !data.session) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed'
      })
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          role: data.user.user_metadata?.role || 'admin'
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Register with Supabase Auth
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 2 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { email, password, name } = req.body

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'admin' // Default role for portfolio admin
        }
      }
    })

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }

    return res.json({
      success: true,
      data: {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name,
          role: data.user.user_metadata?.role
        } : null,
        message: 'Registration successful. Please check your email for verification.'
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    const token = authHeader.substring(7)

    // Sign out with Supabase
    const { error } = await supabase.auth.signOut()

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }

    return res.json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Refresh token
router.post('/refresh', [
  body('refresh_token').notEmpty()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { refresh_token } = req.body

    // Refresh session with Supabase
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token
    })

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      })
    }

    if (!data.session) {
      return res.status(401).json({
        success: false,
        error: 'Failed to refresh session'
      })
    }

    return res.json({
      success: true,
      data: {
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      }
    })
  } catch (error) {
    console.error('Refresh token error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update user profile
router.put('/profile', [
  body('name').optional().isLength({ min: 2 }).trim(),
  body('email').optional().isEmail().normalizeEmail()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    const token = authHeader.substring(7)
    const { name, email } = req.body

    // Get current user
    const { data: userData, error: getUserError } = await supabase.auth.getUser(token)
    if (getUserError || !userData.user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }

    // Prepare update data
    const updateData: any = {}
    if (name) {
      updateData.data = {
        ...userData.user.user_metadata,
        name
      }
    }
    if (email && email !== userData.user.email) {
      updateData.email = email
    }

    // Update user
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      userData.user.id,
      updateData
    )

    if (updateError) {
      return res.status(400).json({
        success: false,
        error: updateError.message
      })
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: updatedUser.user.id,
          email: updatedUser.user.email,
          name: updatedUser.user.user_metadata?.name || updatedUser.user.email,
          role: updatedUser.user.user_metadata?.role || 'admin'
        }
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Change password
router.put('/change-password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    const token = authHeader.substring(7)
    const { currentPassword, newPassword } = req.body

    // Get current user
    const { data: userData, error: getUserError } = await supabase.auth.getUser(token)
    if (getUserError || !userData.user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      })
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.user.email!,
      password: currentPassword
    })

    if (signInError) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      })
    }

    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userData.user.id,
      { password: newPassword }
    )

    if (updateError) {
      return res.status(400).json({
        success: false,
        error: updateError.message
      })
    }

    return res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    const token = authHeader.substring(7)

    // Get user with Supabase
    const { data, error } = await supabase.auth.getUser(token)

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message
      })
    }

    if (!data.user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      })
    }

    return res.json({
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          role: data.user.user_metadata?.role || 'admin'
        }
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router
