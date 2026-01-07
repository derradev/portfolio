import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../Layout'

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'admin' },
    logout: vi.fn()
  })
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/dashboard' })
  }
})

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the layout component', () => {
    const { container } = renderWithRouter(<Layout><div>Test Content</div></Layout>)
    
    expect(container.textContent).toContain('Admin Panel')
    expect(container.textContent).toContain('Test User')
  })

  it('should render navigation menu', () => {
    const { container } = renderWithRouter(<Layout><div>Test Content</div></Layout>)
    
    expect(container.textContent).toContain('Dashboard')
    expect(container.textContent).toContain('Projects')
    expect(container.textContent).toContain('Blog')
    expect(container.textContent).toContain('Education')
    expect(container.textContent).toContain('Certifications')
    expect(container.textContent).toContain('Work History')
    expect(container.textContent).toContain('Learning')
    expect(container.textContent).toContain('Analytics')
    expect(container.textContent).toContain('Settings')
  })

  it('should render logout button', () => {
    const { container } = renderWithRouter(<Layout><div>Test Content</div></Layout>)
    
    expect(container.textContent).toContain('Sign out')
  })

  it('should have correct navigation links', () => {
    const { container } = renderWithRouter(<Layout><div>Test Content</div></Layout>)
    
    expect(container.textContent).toContain('Dashboard')
    expect(container.querySelector('a[href="/"]')).toBeTruthy()
    
    expect(container.textContent).toContain('Projects')
    expect(container.querySelector('a[href="/projects"]')).toBeTruthy()
  })
})
