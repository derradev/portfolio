import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Trash2, Edit, Plus, Flag, ToggleLeft, ToggleRight } from 'lucide-react'

interface FeatureFlag {
  id: number
  name: string
  description: string
  enabled: boolean
  created_at: string
  updated_at: string
}

interface FeatureFlagFormData {
  name: string
  description: string
  enabled: boolean
}

const FeatureFlags: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null)
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FeatureFlagFormData>()

  // Fetch feature flags
  const fetchFeatureFlags = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/feature-flags', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to fetch feature flags')
      const data = await response.json()
      setFeatureFlags(data.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatureFlags()
  }, [])

  // Create feature flag
  const createFeatureFlag = async (flagData: FeatureFlagFormData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/api/feature-flags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(flagData)
      })
      if (!response.ok) throw new Error('Failed to create feature flag')
      await fetchFeatureFlags()
      setIsModalOpen(false)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create feature flag')
    }
  }

  // Update feature flag
  const updateFeatureFlag = async (id: number, flagData: FeatureFlagFormData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/feature-flags/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(flagData)
      })
      if (!response.ok) throw new Error('Failed to update feature flag')
      await fetchFeatureFlags()
      setIsModalOpen(false)
      setEditingFlag(null)
      reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update feature flag')
    }
  }

  // Delete feature flag
  const deleteFeatureFlag = async (id: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/feature-flags/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete feature flag')
      await fetchFeatureFlags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete feature flag')
    }
  }

  // Toggle feature flag
  const toggleFeatureFlag = async (id: number, enabled: boolean) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3001/api/feature-flags/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ enabled })
      })
      if (!response.ok) throw new Error('Failed to toggle feature flag')
      await fetchFeatureFlags()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle feature flag')
    }
  }

  const onSubmit = (data: FeatureFlagFormData) => {
    if (editingFlag) {
      updateFeatureFlag(editingFlag.id, data)
    } else {
      createFeatureFlag(data)
    }
  }

  const openModal = (flag?: FeatureFlag) => {
    if (flag) {
      setEditingFlag(flag)
      reset({
        name: flag.name,
        description: flag.description,
        enabled: flag.enabled
      })
    } else {
      setEditingFlag(null)
      reset({
        name: '',
        description: '',
        enabled: false
      })
    }
    setIsModalOpen(true)
  }

  const handleToggle = (flag: FeatureFlag) => {
    toggleFeatureFlag(flag.id, !flag.enabled)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this feature flag?')) {
      deleteFeatureFlag(id)
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  )
  if (error) return (
    <div className="card p-6 border-l-4 border-red-400 bg-red-50">
      <div className="flex items-center">
        <div className="text-red-600 font-medium">Error loading feature flags: {error}</div>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text flex items-center gap-3 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Flag className="w-10 h-10 text-pink-500" />
            ✨ Feature Flags
          </h1>
          <p className="text-gray-600 text-lg font-medium">Manage application feature toggles with style! 💖</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          Add Feature Flag ✨
        </button>
      </div>

      <div className="card overflow-hidden shadow-xl">
        <table className="min-w-full divide-y divide-pink-100">
          <thead className="bg-gradient-to-r from-pink-50 to-purple-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                🏷️ Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                📝 Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                ⚡ Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                📅 Updated
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                🔧 Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-pink-100">
            {featureFlags.map((flag: FeatureFlag) => (
              <tr key={flag.id} className="hover:bg-gradient-to-r hover:from-pink-25 hover:to-purple-25 transition-all duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{flag.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate font-medium">{flag.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggle(flag)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${
                      flag.enabled
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600'
                        : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 hover:from-gray-400 hover:to-gray-500'
                    }`}
                  >
                    {flag.enabled ? (
                      <>
                        <ToggleRight className="w-4 h-4" />
                        ✨ Enabled
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" />
                        💤 Disabled
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {new Date(flag.updated_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => openModal(flag)}
                      className="text-pink-500 hover:text-pink-700 p-2 rounded-full hover:bg-pink-50 transition-all duration-200 transform hover:scale-110"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(flag.id)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {featureFlags.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <Flag className="w-16 h-16 text-pink-300 mx-auto mb-4" />
              <div className="text-6xl mb-4">🎀</div>
            </div>
            <h3 className="text-2xl font-bold gradient-text mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>No feature flags yet</h3>
            <p className="text-gray-600 mb-6 text-lg font-medium">Create your first feature flag to get started! ✨</p>
            <button
              onClick={() => openModal()}
              className="btn-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Add Feature Flag 💖
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-pink-600 bg-opacity-30 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-8 w-[500px] bg-white rounded-3xl shadow-2xl border border-pink-200">
            <div className="mb-6">
              <h3 className="text-2xl font-bold gradient-text mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {editingFlag ? '✨ Edit Feature Flag' : '🎀 Add New Feature Flag'}
              </h3>
              <p className="text-gray-600 font-medium">Configure your feature toggle with style! 💖</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">🏷️ Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="input-girly w-full"
                  placeholder="feature_name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">💔 {errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">📝 Description</label>
                <textarea
                  {...register('description')}
                  className="input-girly w-full resize-none"
                  rows={4}
                  placeholder="Description of what this feature flag controls..."
                />
              </div>

              <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('enabled')}
                    className="w-5 h-5 rounded border-2 border-pink-300 text-pink-500 focus:ring-pink-200 focus:ring-2"
                  />
                  <span className="ml-3 text-sm font-bold text-gray-700">⚡ Enable this feature flag</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-pink-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {editingFlag ? '💖 Update Flag' : '✨ Create Flag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeatureFlags
