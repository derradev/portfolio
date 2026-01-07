import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchProjects, fetchBlogPosts, fetchLearning } from '../api'

// Mock fetch globally
global.fetch = vi.fn()

describe('API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchProjects', () => {
    it('should fetch projects successfully', async () => {
      const mockProjects = [
        { id: 1, title: 'Project 1', description: 'Description 1' },
        { id: 2, title: 'Project 2', description: 'Description 2' },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockProjects }),
      })

      const result = await fetchProjects()

      expect(result).toEqual(mockProjects)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects')
      )
    })

    it('should return empty array on error', async () => {
      ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchProjects()

      expect(result).toEqual([])
    })

    it('should return empty array when response is not ok', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const result = await fetchProjects()

      expect(result).toEqual([])
    })
  })

  describe('fetchBlogPosts', () => {
    it('should fetch blog posts successfully', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1', slug: 'post-1' },
        { id: 2, title: 'Post 2', slug: 'post-2' },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockPosts }),
      })

      const result = await fetchBlogPosts()

      expect(result).toEqual(mockPosts)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/blog')
      )
    })
  })

  describe('fetchLearning', () => {
    it('should fetch learning items successfully', async () => {
      const mockLearning = [
        { id: 1, title: 'Learning 1', category: 'Frontend' },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockLearning }),
      })

      const result = await fetchLearning()

      expect(result).toEqual(mockLearning)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/learning')
      )
    })
  })
})

