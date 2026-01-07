'use client'

import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, Clock, Target, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

interface LearningItem {
  id: number
  title: string
  description: string
  progress?: number
  category: string
  startDate?: string
  estimatedCompletion?: string
  completedDate?: string
  level?: string
  resources?: string[]
}

export default function Learning() {
  const [currentLearning, setCurrentLearning] = useState<LearningItem[]>([])
  const [completedSkills, setCompletedSkills] = useState<LearningItem[]>([])
  const [learningGoals, setLearningGoals] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLearningData = async () => {
      try {
        // Fetch learning items from API
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
          : 'https://api.william-malone.com/api'
        
        const learningResponse = await fetch(`${API_BASE_URL}/learning`)
        const skillsResponse = await fetch(`${API_BASE_URL}/skills`)
        
        if (learningResponse.ok) {
          const learningData = await learningResponse.json()
          if (learningData.success) {
            // Map backend data to frontend interface
            const mappedLearning = learningData.data.map((item: any) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              progress: item.progress,
              category: item.category,
              startDate: item.start_date,
              estimatedCompletion: item.estimated_completion,
              resources: item.resources || []
            }))
            setCurrentLearning(mappedLearning)
          }
        }
        
        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json()
          if (skillsData.success) {
            // Map backend data to frontend interface
            // Backend returns 'name' but frontend expects 'title'
            const mappedSkills = skillsData.data.map((skill: any) => ({
              id: skill.id,
              title: skill.name, // Map 'name' to 'title'
              description: skill.description || '',
              category: skill.category,
              level: skill.level,
              completedDate: skill.completed_date || null
            }))
            setCompletedSkills(mappedSkills)
          }
        }
        
        // Set cybersecurity-focused learning goals
        setLearningGoals([
          'Complete CompTIA Security+ Certification',
          'Master Python for Security Automation',
          'Build Home Lab for Penetration Testing',
          'Learn Network Security Fundamentals',
          'Develop Security Analysis Skills',
          'Create Security Tools and Scripts'
        ])
      } catch (error) {
        console.error('Failed to load learning data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLearningData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
        <div className="text-lg font-medium text-gray-300">Loading learning journey...</div>
      </div>
    )
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  return (
    <div className="min-h-screen py-20" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
      {/* Tech-focused decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 text-4xl opacity-15 text-cyan-500 terminal-cursor">&gt;</div>
        <div className="absolute top-40 right-20 text-3xl opacity-20 text-blue-500 terminal-cursor">#</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-10 text-green-500 terminal-cursor">$</div>
        <div className="absolute bottom-20 right-10 text-3xl opacity-15 text-cyan-400 terminal-cursor">/</div>
        <div className="absolute top-1/2 left-1/4 text-3xl opacity-10 text-blue-400">[ ]</div>
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
            Learning Journey
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Building cybersecurity expertise through hands-on learning and certification preparation
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="p-3 rounded-lg float-animation" style={{ background: 'var(--gradient-tech)' }}>
                <BookOpen className="w-6 h-6 text-gray-900" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{currentLearning.length}</p>
                <p className="text-gray-400 font-medium">Currently Learning</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="p-3 rounded-lg float-animation" style={{ background: 'var(--gradient-tech)' }}>
                <CheckCircle className="w-6 h-6 text-gray-900" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{completedSkills.length}</p>
                <p className="text-gray-400 font-medium">Skills Mastered</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center">
              <div className="p-3 rounded-lg float-animation" style={{ background: 'var(--gradient-tech)' }}>
                <Target className="w-6 h-6 text-gray-900" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>{learningGoals.length}</p>
                <p className="text-gray-400 font-medium">Future Goals</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Currently Learning */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold gradient-text mb-8 flex items-center" style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <Clock className="w-8 h-8 mr-3 text-cyan-400" />
            Currently Learning
          </motion.h2>
          
          <div className="space-y-6">
            {currentLearning.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 hover:scale-105 transition-transform"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {item.title}
                    </h3>
                    <span className="tech-tag">
                      {item.category}
                    </span>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:text-right">
                    <p className="text-sm text-cyan-400 font-medium">
                      Started: {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="text-sm text-cyan-400 font-medium">
                      Target: {item.estimatedCompletion ? new Date(item.estimatedCompletion).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-4 font-medium">
                  {item.description}
                </p>
                
                {item.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-white">Progress</span>
                      <span className="text-sm font-semibold text-cyan-400">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {item.resources && item.resources.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-white mb-2">Resources: 📖</p>
                    <div className="flex flex-wrap gap-2">
                      {item.resources.map((resource) => (
                        <span
                          key={resource}
                          className="px-3 py-1 bg-blue-900/50 text-blue-400 border border-blue-700 rounded-full text-sm font-medium"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Completed Skills - Only show if there are completed skills */}
        {completedSkills.length > 0 && (
          <section className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-bold gradient-text mb-8 flex items-center" style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              <CheckCircle className="w-8 h-8 mr-3 text-cyan-400" />
              Completed Skills
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6 hover:scale-105 transition-transform"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {skill.title}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                      {skill.level}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 mb-3 font-medium">
                    {skill.description}
                  </p>
                  
                  <div className="flex items-center">
                    <span className="tech-tag">
                      {skill.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Learning Goals */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold gradient-text mb-8 flex items-center" style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            <TrendingUp className="w-8 h-8 mr-3 text-cyan-400" />
            Learning Goals
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="card p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningGoals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:scale-105 transition-transform"
                >
                  <Target className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
                  <span className="text-gray-300 font-medium">{goal}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
