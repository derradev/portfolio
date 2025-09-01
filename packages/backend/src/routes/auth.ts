import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { getServices } from '../services'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = express.Router()

// Base route for auth status
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Auth service is running',
    endpoints: {
      login: 'POST /api/auth/login',
      register: 'POST /api/auth/register',
      me: 'GET /api/auth/me',
      changePassword: 'PUT /api/auth/change-password',
      updateProfile: 'PUT /api/auth/profile'
    }
  })
})

// Login
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
    const { dbService } = getServices()

    // Find user
    const user = await dbService.queryOne('SELECT * FROM users WHERE email = $1', [email])

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Generate JWT token
    const { vaultService } = getServices()
    const jwtSecret = await vaultService.getJWTSecret()
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      jwtSecret,
      { expiresIn: '24h' }
    )

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
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

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 2 })
], authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { email, password, name, role = 'user' } = req.body
    const { dbService } = getServices()

    // Check if user already exists
    const existingUser = await dbService.queryOne('SELECT id FROM users WHERE email = $1', [email])

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email is already taken'
      })
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await dbService.queryOne('INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *', [email, hashedPassword, name, role])

    return res.json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        }
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

// Get current user
router.get('/me', authenticate, (req: AuthRequest, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  })
})

// Change password
router.put('/change-password', [
  authenticate,
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 })
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

    const { currentPassword, newPassword } = req.body
    const { dbService } = getServices()

    // Get user with password
    const user = await dbService.queryOne('SELECT * FROM users WHERE id = $1', [req.user!.id])

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await dbService.query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedNewPassword, req.user!.id])

    return res.json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Update profile
router.put('/profile', [
  authenticate,
  body('name').isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail()
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

    const { name, email } = req.body
    const { dbService } = getServices()

    // Check if email is already taken by another user
    const existingUser = await dbService.queryOne('SELECT id FROM users WHERE email = $1 AND id != $2', [email, req.user!.id])

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email is already taken'
      })
    }

    // Update user
    await dbService.query('UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3', [name, email, req.user!.id])

    // Get updated user
    const updatedUser = await dbService.queryOne('SELECT id, email, name, role FROM users WHERE id = $1', [req.user!.id])

    return res.json({
      success: true,
      data: {
        user: updatedUser
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

export default router
