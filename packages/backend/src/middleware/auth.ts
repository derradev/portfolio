import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getServices } from '../services'

export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    name: string
    role: string
  }
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      })
    }

    const { supabaseService } = getServices()
    
    // Verify token with Supabase Auth
    const { data, error } = await supabaseService.getClient().auth.getUser(token)
    
    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token.'
      })
    }
    
    const user = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.email,
      role: data.user.user_metadata?.role || 'admin'
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token.'
      })
    }

    req.user = user as any
    return next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token.'
    })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Please authenticate.'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.'
      })
    }

    return next()
  }
}
