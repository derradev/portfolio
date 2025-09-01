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

    const { vaultService, dbService } = getServices()
    const jwtSecret = await vaultService.getJWTSecret()
    const decoded = jwt.verify(token, jwtSecret) as any
    
    const user = await dbService.queryOne('SELECT id, email, name, role FROM users WHERE id = $1', [decoded.userId])
    
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
