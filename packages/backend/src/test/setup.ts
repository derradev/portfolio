// Global test setup
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Mock Supabase service for tests
jest.mock('../services/SupabaseService', () => ({
  SupabaseService: jest.fn().mockImplementation(() => ({
    getClient: jest.fn(),
    select: jest.fn(),
    selectOne: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
}))

// Set test timeout
jest.setTimeout(10000)

