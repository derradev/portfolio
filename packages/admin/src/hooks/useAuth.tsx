import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        // Set token for API calls
        api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`
        
        // Get user info from our API
        const response = await api.get('/auth/me')
        if (response.data?.data?.user) {
          setUser(response.data.data.user)
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('supabase.auth.token')
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        api.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`
        const response = await api.get('/auth/me')
        if (response.data?.data?.user) {
          setUser(response.data.data.user)
        }
      } else if (event === 'SIGNED_OUT') {
        delete api.defaults.headers.common['Authorization']
        setUser(null)
      }
      setLoading(false)
    })

    // Initial session check
    fetchUser()

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Use our backend API which handles Supabase auth
      const response = await api.post('/auth/login', { email, password })
      const data = response.data?.data
      
      if (!data?.session || !data?.user) {
        throw new Error('Invalid response format')
      }
      
      // Set the session in Supabase client
      const { error } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      })
      
      if (error) throw error
      
      // Set token for API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${data.session.access_token}`
      setUser(data.user)
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Call our backend logout endpoint
      await api.post('/auth/logout')
      
      // Clear local state
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Clear local state even if API call fails
      delete api.defaults.headers.common['Authorization']
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
