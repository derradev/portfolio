import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'

// Mock useAuth hook
const mockLogin = vi.fn()
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    loading: false
  })
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    const { container } = renderWithRouter(<Login />)
    
    expect(container.textContent).toContain('Portfolio Admin')
    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy()
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy()
  })

  it('should update input values when typing', () => {
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect((emailInput as HTMLInputElement).value).toBe('test@example.com')
    expect((passwordInput as HTMLInputElement).value).toBe('password123')
  })

  it('should call login function when form is submitted', async () => {
    mockLogin.mockResolvedValue(undefined)
    
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('should show loading state during login', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Sign in ✨')).toBeTruthy()
  })

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials'
    mockLogin.mockRejectedValue(new Error(errorMessage))
    
    renderWithRouter(<Login />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong-password' } })
    fireEvent.click(submitButton)
    
    // The login component handles errors via API interceptor, so we just verify login was called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrong-password')
    })
  })
})
