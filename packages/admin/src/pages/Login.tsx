import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Shield } from 'lucide-react'
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
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary-dark) 50%, #0f0f0f 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(circle at 20% 30%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(0, 102, 255, 0.08) 0%, transparent 45%)',
        }}
      />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-2xl text-cyan-500 opacity-20 font-mono">&gt;</div>
        <div className="absolute top-32 right-20 text-lg text-blue-500 opacity-15 font-mono">#</div>
        <div className="absolute bottom-24 left-20 text-xl text-emerald-500 opacity-10 font-mono">$</div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="card-tech text-center p-8">
          <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-[var(--primary-dark)]" aria-hidden />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Portfolio <span className="gradient-text">Admin</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to manage content for william-malone.com
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="card-tech p-6 space-y-5">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                autoComplete="email"
                className="form-input"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-cyan-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="form-input pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-cyan-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-cyan-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-[var(--primary-dark)] border-t-transparent" />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
