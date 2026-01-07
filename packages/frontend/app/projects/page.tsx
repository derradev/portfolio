'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Calendar, Tag } from 'lucide-react'
import { fetchProjects } from '@/lib/api'

interface Project {
  id: number
  title: string
  description: string
  image?: string
  technologies: string[]
  github_url?: string
  live_url?: string
  date: string
  featured: boolean
  status?: 'active' | 'on_hold' | 'completed'
  company?: string
  start_date?: string
  end_date?: string
}

// Format project date from YYYY-MM-DD to Month Day, Year
const formatProjectDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const calculateDuration = (start_date?: string, end_date?: string | null) => {
  if (!start_date) return 'N/A'
  const start = new Date(start_date)
  const end = end_date ? new Date(end_date) : new Date()
  
  // Calculate difference in months properly
  let diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  
  // If end day is before the start day, subtract one month
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

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects()
        setProjects(data)
      } catch (error) {
        console.error('Failed to load projects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
        <div className="text-lg font-medium text-gray-300">Loading projects...</div>
      </div>
    )
  }

  // Show empty state if no projects
  if (projects.length === 0) {
    return (
      <div className="min-h-screen py-20" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #f8f4ff 50%, #fff8f0 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold gradient-text mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Projects
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium mb-12">
              Building portfolio of security projects and Python scripts
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  const featuredProjects = projects.filter(project => project.featured)
  const otherProjects = projects.filter(project => !project.featured)

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
          <h1 className="text-5xl sm:text-6xl font-bold gradient-text mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            ✨ My Projects
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            A beautiful collection of projects showcasing my skills in full-stack development,
            from concept to deployment. 💖
          </p>
        </motion.div>

        {/* Featured Projects */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold gradient-text mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            💎 Featured Projects
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:scale-105 transition-transform"
              >
                <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-700"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {project.title}
                    </h3>
                    {project.status === 'on_hold' && (
                      <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-xs font-semibold">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-4 font-medium">
                    {project.description || 'No description available'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="tech-tag"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-400 text-sm space-y-1 sm:space-y-0 sm:space-x-4 font-medium">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
                        {formatProjectDate(project.date)}
                      </div>
                      <div className="text-blue-400">
                        {calculateDuration(project.start_date, project.end_date || null)}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 hover:bg-cyan-100 rounded-full transition-colors"
                        >
                          <Github className="w-5 h-5 text-gray-600 hover:text-cyan-400" />
                          Code 💻
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-xs px-3 py-1 font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Other Projects */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold gradient-text mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            🌟 Other Projects
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:scale-105 transition-transform"
              >
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-700"></div>
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {project.title}
                      </h3>
                      {project.status === 'on_hold' && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          On Hold
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
                      {formatProjectDate(project.date)}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm font-medium">
                    {project.description || 'No description available'}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 bg-blue-700 text-blue-300 rounded text-xs font-medium">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs px-3 py-1"
                    >
                      <Github className="w-3 h-3 mr-1" />
                      Code 💻
                    </a>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs px-3 py-1"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Demo ✨
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
