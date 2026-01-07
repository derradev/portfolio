import request from 'supertest'
import express from 'express'
import projectsRouter from '../projects'
import { getServices } from '../../services'

// Mock services
jest.mock('../../services', () => ({
  getServices: jest.fn(),
}))

describe('Projects API', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/api/projects', projectsRouter)
  })

  describe('GET /api/projects', () => {
    it('should return list of projects', async () => {
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          technologies: ['React', 'TypeScript'],
        },
      ]

      ;(getServices as jest.Mock).mockReturnValue({
        supabaseService: {
          getClient: jest.fn().mockReturnValue({
            from: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                order: jest.fn().mockReturnValue({
                  data: mockProjects,
                  error: null,
                }),
              }),
            }),
          }),
        },
      })

      const response = await request(app).get('/api/projects')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
    })

    it('should handle errors gracefully', async () => {
      ;(getServices as jest.Mock).mockReturnValue({
        supabaseService: {
          getClient: jest.fn().mockReturnValue({
            from: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                order: jest.fn().mockReturnValue({
                  data: null,
                  error: { message: 'Database error' },
                }),
              }),
            }),
          }),
        },
      })

      const response = await request(app).get('/api/projects')

      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
    })
  })
})

