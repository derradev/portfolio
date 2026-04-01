import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import { User, Lock, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProfileForm {
  name: string
  email: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const Settings = () => {
  const { user, refreshUser, loading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors } } = useForm<ProfileForm>({
    defaultValues: {
      name: '',
      email: ''
    }
  })

  // Reset form when user changes (e.g., after logout/login)
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        email: user.email || ''
      })
    } else {
      resetProfile({
        name: '',
        email: ''
      })
    }
  }, [user, resetProfile])

  // Don't render if not authenticated
  if (loading || !user) {
    return null
  }

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, watch, formState: { errors: passwordErrors } } = useForm<PasswordForm>()

  const updateProfileMutation = useMutation(
    (data: ProfileForm) => api.put('/auth/profile', data),
    {
      onSuccess: async () => {
        toast.success('Profile updated successfully')
        // Refresh user data
        await refreshUser()
      },
      onError: (error: any) => {
        const message = error.response?.data?.error || 'Failed to update profile'
        toast.error(message)
      }
    }
  )

  const changePasswordMutation = useMutation(
    (data: { currentPassword: string, newPassword: string }) => api.put('/auth/change-password', data),
    {
      onSuccess: () => {
        toast.success('Password changed successfully')
        resetPassword()
      },
      onError: (error: any) => {
        const message = error.response?.data?.error || 'Failed to change password'
        toast.error(message)
      }
    }
  )

  const onProfileSubmit = (data: ProfileForm) => {
    updateProfileMutation.mutate(data)
  }

  const onPasswordSubmit = (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    })
  }

  const watchNewPassword = watch('newPassword')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">⚙️ Settings</h1>
        <p className="mt-2 text-gray-400 font-medium">
          Manage your account settings and preferences ✨
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-gradient-to-r from-cyan-600 to-blue-600">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 font-bold text-sm rounded-t-lg transition-all duration-300 ${
              activeTab === 'profile'
                ? 'border-cyan-500 text-cyan-400 bg-gradient-to-r from-cyan-900/20 to-blue-900/20'
                : 'border-transparent text-gray-500 hover:text-cyan-400 hover:border-cyan-600 hover:bg-cyan-900/10'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <User className="w-5 h-5 inline mr-2" />
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-3 px-4 border-b-2 font-bold text-sm rounded-t-lg transition-all duration-300 ${
              activeTab === 'password'
                ? 'border-cyan-500 text-cyan-400 bg-gradient-to-r from-cyan-900/20 to-blue-900/20'
                : 'border-transparent text-gray-500 hover:text-cyan-400 hover:border-cyan-600 hover:bg-cyan-900/10'
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <Lock className="w-5 h-5 inline mr-2" />
            🔒 Password
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card p-6">
          <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
            <div>
              <h3 className="text-xl font-bold gradient-text mb-6">
                👤 Profile Information
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="form-label font-bold">
                    Full name
                  </label>
                  <input
                    {...registerProfile('name', { required: 'Name is required' })}
                    type="text"
                    className="form-input"
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label font-bold">
                    Email
                  </label>
                  <input
                    {...registerProfile('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="form-input"
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 px-6 py-4 rounded-b-xl text-right">
              <button
                type="submit"
                disabled={updateProfileMutation.isLoading}
                className="btn-primary"
              >
                <Save className="w-5 h-5 mr-2" />
                {updateProfileMutation.isLoading ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="card p-6">
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
            <div>
              <h3 className="text-xl font-bold gradient-text mb-6">
                🔒 Change Password
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="form-label font-bold">
                    Current password
                  </label>
                  <input
                    {...registerPassword('currentPassword', { 
                      required: 'Current password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type="password"
                    className="form-input"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label font-bold">
                    New password
                  </label>
                  <input
                    {...registerPassword('newPassword', { 
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    type="password"
                    className="form-input"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <label className="form-label font-bold">
                    Confirm new password
                  </label>
                  <input
                    {...registerPassword('confirmPassword', { 
                      required: 'Please confirm your new password',
                      validate: value => value === watchNewPassword || 'Passwords do not match'
                    })}
                    type="password"
                    className="form-input"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 px-6 py-4 rounded-b-xl text-right">
              <button
                type="submit"
                disabled={changePasswordMutation.isLoading}
                className="btn-primary"
              >
                <Lock className="w-5 h-5 mr-2" />
                {changePasswordMutation.isLoading ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* System Information */}
      <div className="card p-6">
        <h3 className="text-xl font-bold gradient-text mb-6">
          💻 System Information
        </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="p-4 bg-gradient-to-r from-cyan-900/25 to-blue-900/25 rounded-xl border border-[var(--border-color)]">
              <dt className="text-sm font-bold text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>User role</dt>
              <dd className="mt-2 text-sm font-medium text-gray-100">{user?.role}</dd>
            </div>
            <div className="p-4 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 rounded-xl border border-[var(--border-color)]">
              <dt className="text-sm font-bold text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>Account status</dt>
              <dd className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </dd>
            </div>
            <div className="p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl">
              <dt className="text-sm font-bold text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>Frontend URL</dt>
              <dd className="mt-2">
                <a href="https://william-malone.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-medium hover:underline">
                  https://william-malone.com
                </a>
              </dd>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl">
              <dt className="text-sm font-bold text-gray-400" style={{ fontFamily: 'Poppins, sans-serif' }}>API URL</dt>
              <dd className="mt-2">
                <a href={`${(import.meta as any).env.VITE_API_URL || 'https://api.william-malone.com'}/api`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                  {`${(import.meta as any).env.VITE_API_URL || 'https://api.william-malone.com'}/api`}
                </a>
              </dd>
            </div>
          </dl>
      </div>
    </div>
  )
}

export default Settings
