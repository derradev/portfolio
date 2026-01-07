import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, Award, Calendar, ExternalLink } from 'lucide-react'

interface Certification {
  id?: number
  name: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  credential_id: string
  credential_url: string
  description: string
  skills: string[]
}

const API_BASE_URL = (import.meta as any).env.VITE_API_URL 
  ? `${(import.meta as any).env.VITE_API_URL}/api` 
  : 'https://api.william-malone.com/api'

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Certification>({
    name: '',
    issuer: '',
    issue_date: '',
    expiry_date: null,
    credential_id: '',
    credential_url: '',
    description: '',
    skills: []
  })

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${API_BASE_URL}/certifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setCertifications(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching certifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('auth_token')
    
    try {
      const url = editingId 
        ? `${API_BASE_URL}/certifications/${editingId}`
        : `${API_BASE_URL}/certifications`
      
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchCertifications()
        resetForm()
      } else {
        console.error('Error saving certification')
      }
    } catch (error) {
      console.error('Error saving certification:', error)
    }
  }

  const handleEdit = (cert: Certification) => {
    setFormData(cert)
    setEditingId(cert.id || null)
    setShowAddForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certification?')) return
    
    const token = localStorage.getItem('auth_token')
    try {
      const response = await fetch(`${API_BASE_URL}/certifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchCertifications()
      }
    } catch (error) {
      console.error('Error deleting certification:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      issue_date: '',
      expiry_date: null,
      credential_id: '',
      credential_url: '',
      description: '',
      skills: []
    })
    setEditingId(null)
    setShowAddForm(false)
  }

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills]
    newSkills[index] = value
    setFormData({ ...formData, skills: newSkills })
  }

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ''] })
  }

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index)
    setFormData({ ...formData, skills: newSkills })
  }

  const isExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your certifications... 🏆</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>🏆 Certifications Management</h1>
          <p className="mt-2 text-gray-600 font-medium">
            Manage your professional certifications and credentials ✨
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary floating-hearts"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="modal-overlay fixed inset-0" onClick={resetForm}></div>
            <div className="modal-content inline-block align-bottom text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="modal-header">
                <h2 className="text-xl font-bold">
                  {editingId ? '✨ Edit Certification' : '🏆 Add New Certification'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="modal-body">

                <form id="certification-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-group">
                      <label className="form-label">🏆 Certification Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                        placeholder="AWS Certified Solutions Architect"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">🏢 Issuer *</label>
                      <input
                        type="text"
                        value={formData.issuer}
                        onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                        className="form-input"
                        placeholder="Amazon Web Services"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">📅 Issue Date *</label>
                      <input
                        type="date"
                        value={formData.issue_date}
                        onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">⏰ Expiry Date</label>
                      <input
                        type="date"
                        value={formData.expiry_date || ''}
                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value || null })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">🆔 Credential ID</label>
                      <input
                        type="text"
                        value={formData.credential_id}
                        onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                        className="form-input"
                        placeholder="ABC123456789"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">🔗 Credential URL</label>
                      <input
                        type="url"
                        value={formData.credential_url}
                        onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                        className="form-input"
                        placeholder="https://www.credly.com/badges/..."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">📝 Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="form-textarea"
                      placeholder="Describe what this certification covers and its significance..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">💪 Skills</label>
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex gap-3 mb-3">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                          className="form-input flex-1"
                          placeholder="Cloud Architecture, DevOps, etc."
                        />
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSkill}
                      className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                    >
                      ✨ Add Skill
                    </button>
                  </div>

                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="certification-form"
                  className="btn-success"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? '✨ Update' : '🏆 Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>{cert.name}</h3>
                  <p className="text-pink-600 font-semibold text-lg">{cert.issuer}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cert)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id!)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-pink-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
              </div>
              {cert.expiry_date && (
                <div className={`flex items-center gap-2 ${isExpired(cert.expiry_date) ? 'text-red-600' : 'text-pink-600'}`}>
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Expires: {new Date(cert.expiry_date).toLocaleDateString()}</span>
                  {isExpired(cert.expiry_date) && (
                    <span className="ml-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                      ⚠️ Expired
                    </span>
                  )}
                </div>
              )}
              {cert.credential_id && (
                <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-xs font-semibold">
                  🆔 ID: {cert.credential_id}
                </div>
              )}
            </div>

            {cert.description && (
              <p className="text-gray-600 mb-4 font-medium">{cert.description}</p>
            )}

            {cert.skills && cert.skills.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  💪 Skills:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cert.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cert.credential_url && (
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
              >
                🔗 View Credential
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        ))}
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-yellow-500" />
          </div>
          <p className="text-gray-500 text-xl font-semibold mb-2">No certifications found</p>
          <p className="text-gray-400 font-medium">Click "Add Certification" to create your first entry 🏆</p>
        </div>
      )}
    </div>
  )
}
