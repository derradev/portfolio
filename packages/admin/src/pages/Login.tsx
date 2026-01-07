import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '@/assets/logo.svg'
import toast from 'react-hot-toast'

interface LoginForm {
  email: string
  password: string
}

const Login = () => {
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Login successful!')
    } catch (error) {
      const message =
        (error as any)?.response?.data?.error ||
        (error as any)?.message ||
        'Login failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
         style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-20">�️</div>
        <div className="absolute top-32 right-20 text-4xl opacity-15">🔐</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10">💻</div>
        <div className="absolute bottom-32 right-10 text-3xl opacity-20">⚡</div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="card-tech text-center p-8">
          <div className="mx-auto h-24 w-24 mb-4">
            <img 
              src={Logo} 
              alt="Admin Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <h2 className="mt-6 text-center text-4xl font-bold gradient-text" style={{ fontFamily: 'Dancing Script, cursive' }}>
            🛡️ Security Admin
          </h2>
          <p className="mt-3 text-center text-sm text-gray-400">
            Sign in to manage your cybersecurity portfolio content �
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-tech p-6 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                📧 Email address
              </label>
              <input
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                autoComplete="email"
                className="input-tech"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-cyan-400 font-medium">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                🔐 Password
              </label>
              <div className="relative">
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input-tech pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-cyan-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-cyan-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-tech w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-400 mr-2"></div>
                  Signing in...
                </span>
              ) : (
                'Sign in 🔐'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Login
