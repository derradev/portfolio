'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react'
import { fetchEducation } from '@/lib/api'

interface Education {
  id: number
  institution: string
  degree: string
  field_of_study: string
  location: string
  start_date: string
  end_date: string
  description?: string
  grade?: string
  achievements?: string[]
}

export default function Education() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEducation = async () => {
      try {
        const data = await fetchEducation()
        setEducation(data)
      } catch (error) {
        console.error('Failed to load education:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEducation()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
        <div className="text-lg font-medium text-gray-300">Loading education...</div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="min-h-screen py-20" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
      {/* Tech-focused decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl opacity-15 text-cyan-500 terminal-cursor">&gt;</div>
        <div className="absolute top-40 right-20 text-3xl opacity-20 text-blue-500 terminal-cursor">#</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10 text-green-500 terminal-cursor">$</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-15 text-cyan-400 terminal-cursor">/</div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold gradient-text mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Education
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            My educational background and certifications that form the foundation of my IT expertise
          </p>
        </motion.div>

        {/* Education Timeline */}
        <div className="space-y-8">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-8 hover:scale-105 transition-transform"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <GraduationCap className="w-6 h-6 mr-3 text-cyan-400" />
                    <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {edu.degree}
                    </h2>
                  </div>
                  
                  <h3 className="text-xl text-cyan-400 mb-2 font-medium">
                    {edu.institution}
                  </h3>
                  
                  <p className="text-lg text-gray-300 mb-1">
                    {edu.field_of_study}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm font-medium">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
                      {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-cyan-400" />
                      {edu.location}
                    </div>
                  </div>
                  
                  {edu.grade && (
                    <div className="flex items-center mt-2">
                      <Award className="w-4 h-4 mr-2 text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">{edu.grade}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {edu.description && (
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {edu.description}
                </p>
              )}
              
              {edu.achievements && edu.achievements.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Key Achievements
                  </h4>
                  <ul className="space-y-2">
                    {edu.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start">
                        <span className="text-cyan-400 mr-2">▸</span>
                        <span className="text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {education.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-400 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Education details coming soon
            </h3>
            <p className="text-gray-500">
              I'm currently updating my education information. Please check back later!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
