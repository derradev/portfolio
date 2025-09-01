import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, GraduationCap, Calendar, MapPin } from 'lucide-react'

interface Education {
  id?: number
  institution: string
  degree: string
  field_of_study: string
  location: string
  start_date: string
  end_date: string | null
  grade: string
  description: string
  achievements: string[]
}

const API_BASE_URL = 'http://localhost:3001/api'

export default function Education() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Education>({
    institution: '',
    degree: '',
    field_of_study: '',
    location: '',
    start_date: '',
    end_date: null,
    grade: '',
    description: '',
    achievements: []
  })

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/work-history/education`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setEducation(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching education:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      const url = editingId 
        ? `${API_BASE_URL}/education/${editingId}`
        : `${API_BASE_URL}/education`
      
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
        await fetchEducation()
        resetForm()
      } else {
        console.error('Error saving education')
      }
    } catch (error) {
      console.error('Error saving education:', error)
    }
  }

  const handleEdit = (edu: Education) => {
    setFormData(edu)
    setEditingId(edu.id || null)
    setShowAddForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return
    
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_BASE_URL}/education/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchEducation()
      }
    } catch (error) {
      console.error('Error deleting education:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field_of_study: '',
      location: '',
      start_date: '',
      end_date: null,
      grade: '',
      description: '',
      achievements: []
    })
    setEditingId(null)
    setShowAddForm(false)
  }

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...formData.achievements]
    newAchievements[index] = value
    setFormData({ ...formData, achievements: newAchievements })
  }

  const addAchievement = () => {
    setFormData({ ...formData, achievements: [...formData.achievements, ''] })
  }

  const removeAchievement = (index: number) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index)
    setFormData({ ...formData, achievements: newAchievements })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your education journey... 📚</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text" style={{ fontFamily: 'Playfair Display, serif' }}>🎓 Education Management</h1>
          <p className="mt-2 text-gray-600 font-medium">
            Manage your educational background and achievements ✨
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary floating-hearts"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {showAddForm && (
        <div className="modal-overlay fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="modal-overlay fixed inset-0" onClick={resetForm}></div>
            <div className="modal-content inline-block align-bottom text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="modal-header">
                <h2 className="text-xl font-bold">
                  {editingId ? '✨ Edit Education' : '🎓 Add New Education'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="modal-body">

                <form id="education-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-group">
                      <label className="form-label">🏢 Institution *</label>
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        className="form-input"
                        placeholder="University of Excellence"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">🎓 Degree *</label>
                      <input
                        type="text"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="form-input"
                        placeholder="Bachelor of Science"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">📚 Field of Study</label>
                      <input
                        type="text"
                        value={formData.field_of_study}
                        onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                        className="form-input"
                        placeholder="Computer Science"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">📍 Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="form-input"
                        placeholder="New York, NY"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">📅 Start Date *</label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">🏁 End Date</label>
                      <input
                        type="date"
                        value={formData.end_date || ''}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value || null })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">🏆 Grade</label>
                      <input
                        type="text"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="form-input"
                        placeholder="3.8 GPA, First Class Honours"
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
                      placeholder="Describe your educational experience, coursework, or highlights..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">🏆 Achievements</label>
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex gap-3 mb-3">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => handleAchievementChange(index, e.target.value)}
                          className="form-input flex-1"
                          placeholder="Dean's List, Summa Cum Laude, etc."
                        />
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                    >
                      ✨ Add Achievement
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
                  form="education-form"
                  className="btn-success"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? '✨ Update' : '🎓 Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {education.map((edu) => (
          <div key={edu.id} className="card p-6 hover:scale-105 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {edu.degree}
                    {edu.field_of_study && ` in ${edu.field_of_study}`}
                  </h3>
                  <p className="text-pink-600 font-semibold text-lg">{edu.institution}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(edu)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(edu.id!)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-pink-600 mb-4">
              {edu.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{edu.location}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{new Date(edu.start_date).toLocaleDateString()} - {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : 'Present'}</span>
              </div>
              {edu.grade && (
                <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold">
                  🏆 {edu.grade}
                </div>
              )}
            </div>

            {edu.description && (
              <p className="text-gray-600 mb-4 font-medium">{edu.description}</p>
            )}

            {edu.achievements && edu.achievements.length > 0 && (
              <div>
                <h4 className="font-bold text-gray-800 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  ✨ Achievements:
                </h4>
                <ul className="space-y-2">
                  {edu.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1">•</span>
                      <span className="text-gray-600 font-medium">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {education.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-pink-400" />
          </div>
          <p className="text-gray-500 text-xl font-semibold mb-2">No education entries found</p>
          <p className="text-gray-400 font-medium">Click "Add Education" to create your first entry 🎓</p>
        </div>
      )}
    </div>
  )
}
