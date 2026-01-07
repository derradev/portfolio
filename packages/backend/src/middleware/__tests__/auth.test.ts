import { Request, Response, NextFunction } from 'express'
import { authenticate, authorize } from '../auth'
import { getServices } from '../../services'

// Mock services
jest.mock('../../services', () => ({
  getServices: jest.fn(),
}))

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      headers: {},
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }
    nextFunction = jest.fn()
  })

  describe('authenticate', () => {
    it('should return 401 if no token provided', async () => {
      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(nextFunction).not.toHaveBeenCalled()
    })

    it('should return 401 if token is invalid', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      }

      ;(getServices as jest.Mock).mockReturnValue({
        supabaseService: {
          getClient: jest.fn().mockReturnValue({
            auth: {
              getUser: jest.fn().mockResolvedValue({
                data: { user: null },
                error: { message: 'Invalid token' },
              }),
            },
          }),
        },
      })

      await authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })

  describe('authorize', () => {
    it('should call next if user has required role', () => {
      mockRequest.user = {
        id: '1',
        email: 'admin@example.com',
        role: 'admin',
      } as any

      authorize('admin')(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(nextFunction).toHaveBeenCalled()
    })

    it('should return 403 if user does not have required role', () => {
      mockRequest.user = {
        id: '1',
        email: 'user@example.com',
        role: 'user',
      } as any

      authorize('admin')(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      )

      expect(mockResponse.status).toHaveBeenCalledWith(403)
      expect(nextFunction).not.toHaveBeenCalled()
    })
  })
})

