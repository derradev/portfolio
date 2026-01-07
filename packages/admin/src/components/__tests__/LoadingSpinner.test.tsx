import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    render(<LoadingSpinner />)
    
    // Check if loading text exists
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('displays loading text', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})

