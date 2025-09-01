'use client'

import { motion } from 'framer-motion'
import { Briefcase, Calendar, MapPin, ExternalLink, Award } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fetchWorkHistory, fetchEducation, fetchCertifications } from '@/lib/api'

interface WorkExperience {
  id: number
  company: string
  position: string
  location: string
  start_date: string
  end_date: string | null
  description: string
  achievements: string[]
  technologies: string[]
  company_url?: string
}

interface Education {
  id: number
  institution: string
  degree: string
  field_of_study?: string
  location: string
  start_date: string
  end_date: string | null
  grade?: string
  description: string
  achievements: string[]
}

interface Certification {
  id: number
  name: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  credential_id?: string
  credential_url?: string
  description: string
  skills: string[]
}

export default function WorkHistory() {
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWorkHistoryData = async () => {
      try {
        const [workData, educationData, certificationsData] = await Promise.all([
          fetchWorkHistory(),
          fetchEducation(),
          fetchCertifications()
        ])
        console.log('Work data:', workData)
        console.log('Education data:', educationData)
        console.log('Certifications data:', certificationsData)
        setWorkExperience(workData)
        setEducation(educationData)
        setCertifications(certificationsData)
      } catch (error) {
        console.error('Failed to load work history data:', error)
        setWorkExperience([])
        setEducation([])
        setCertifications([])
      } finally {
        setLoading(false)
      }
    }

    loadWorkHistoryData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #f8f4ff 50%, #fff8f0 100%)' }}>
        <div className="text-lg font-medium text-gray-700">Loading work history... ✨</div>
      </div>
    )
  }

  const calculateDuration = (start_date: string, end_date: string | null) => {
    const start = new Date(start_date)
    const end = end_date ? new Date(end_date) : new Date()
    
    // Calculate the difference in months properly
    let diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    
    // If the end day is before the start day, subtract one month
    if (end.getDate() < start.getDate()) {
      diffMonths--
    }
    
    // Ensure minimum of 1 month if there's any time difference
    if (diffMonths <= 0 && end > start) {
      diffMonths = 1
    }
    
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`
    } else {
      const years = Math.floor(diffMonths / 12)
      const months = diffMonths % 12
      return `${years} year${years !== 1 ? 's' : ''}${months > 0 ? ` ${months} month${months !== 1 ? 's' : ''}` : ''}`
    }
  }

  return (
    <div className="min-h-screen py-20" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #f8f4ff 50%, #fff8f0 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl opacity-15 float-animation">💼</div>
        <div className="absolute top-40 right-20 text-3xl opacity-20 sparkle-animation">✨</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10 float-animation">🏆</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-15 sparkle-animation">💫</div>
        <div className="absolute top-1/2 left-1/4 text-3xl opacity-10">🌟</div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-bold gradient-text mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            💼 Experience
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            My professional journey as a software engineer, showcasing growth,
            achievements, and the technologies I've mastered along the way! ✨
          </p>
        </motion.div>

        {/* Work Experience */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold gradient-text mb-8 flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}
          >
            <Briefcase className="w-8 h-8 mr-3 text-pink-600" />
            💼 Professional Experience
          </motion.h2>

          <div className="space-y-8">
            {workExperience.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 border-l-4 border-pink-400 hover:scale-105 transition-transform"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-800 mr-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {job.position}
                      </h3>
                      {!job.end_date && (
                        <span className="px-3 py-1 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full text-xs font-semibold">
                          Current ✨
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-pink-600 mb-2">
                      <a
                        href={job.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:underline flex items-center"
                      >
                        {job.company}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-sm space-y-1 sm:space-y-0 sm:space-x-4 font-medium">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-pink-500" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-pink-500" />
                        {new Date(job.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {job.end_date ? new Date(job.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </div>
                      <div className="text-purple-600">
                        ({calculateDuration(job.start_date, job.end_date)})
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 font-medium">
                  {job.description}
                </p>

                {job.achievements && job.achievements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>🏆 Key Achievements:</h4>
                    <ul className="space-y-2">
                      {job.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start">
                          <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-600 text-sm font-medium">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.technologies && job.technologies.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>💻 Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="tech-tag"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-bold gradient-text mb-8 flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <Award className="w-8 h-8 mr-3 text-pink-600" />
              🎓 Education
            </motion.h2>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 hover:scale-105 transition-transform"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {edu.degree}
                      {edu.field_of_study && ` in ${edu.field_of_study}`}
                    </h3>
                    <p className="text-pink-600 font-semibold mb-2">
                      {edu.institution}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-sm space-y-1 sm:space-y-0 sm:space-x-4 font-medium">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-pink-500" />
                        {edu.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-pink-500" />
                        {new Date(edu.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {edu.end_date ? new Date(edu.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                      </div>
                    </div>
                  </div>
                  {edu.grade && (
                    <div className="mt-4 lg:mt-0">
                      <span className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full text-sm font-semibold">
                        ✨ {edu.grade}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 font-medium">
                  {edu.description}
                </p>
              </motion.div>
            ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-bold gradient-text mb-8 flex items-center" style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <Award className="w-8 h-8 mr-3 text-pink-600" />
              🏆 Certifications
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6 text-center hover:scale-105 transition-transform"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {cert.name}
                  </h3>
                  <p className="text-pink-600 font-semibold mb-2">
                    {cert.issuer}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 font-medium">
                    Issued: {new Date(cert.issue_date).toLocaleDateString()}
                  </p>
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-pink-600 hover:text-purple-600 hover:underline text-sm font-semibold transition-colors"
                  >
                    View Credential ✨
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
