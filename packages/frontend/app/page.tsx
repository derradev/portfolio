'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Code, Database, Globe, Smartphone } from 'lucide-react'
import Link from 'next/link'
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
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects()
        setProjects(data.slice(0, 3)) // Only show first 3 projects
      } catch (error) {
        console.error('Failed to load projects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])
  const skills = [
    { icon: Globe, name: 'Frontend Development', description: 'React, Next.js, TypeScript' },
    { icon: Database, name: 'Backend Development', description: 'Node.js, Express, PostgreSQL' },
    { icon: Code, name: 'Full Stack', description: 'End-to-end application development' },
    { icon: Smartphone, name: 'Mobile Development', description: 'React Native, Progressive Web Apps' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section pt-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-6xl opacity-20 float-animation">💖</div>
          <div className="absolute top-32 right-20 text-4xl opacity-15 sparkle-animation">✨</div>
          <div className="absolute bottom-20 left-20 text-5xl opacity-10 float-animation">🌸</div>
          <div className="absolute bottom-32 right-10 text-3xl opacity-20 sparkle-animation">💫</div>
          <div className="absolute top-1/2 left-1/4 text-3xl opacity-10">🦋</div>
          <div className="absolute top-1/3 right-1/3 text-2xl opacity-15">🌺</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl sm:text-7xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Hi, I'm{' '}
                <span className="gradient-text block mt-2" style={{ fontFamily: 'Dancing Script, cursive' }}>
                  ✨ Demi Taylor Nimmo
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium">
                Full Stack Software Engineer passionate about creating beautiful, innovative solutions
                and building exceptional user experiences 💖
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/projects"
                  className="btn-primary"
                >
                  View My Work ✨
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="/experience"
                  className="btn-secondary"
                >
                  Experience 💼
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #fff8f0 0%, #f8f4ff 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              ✨ About Me
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto font-medium">
              I'm a passionate full-stack software engineer with expertise in modern web technologies.
              I love solving complex problems and creating beautiful, seamless user experiences through clean,
              efficient code and thoughtful design. 💖
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => {
              const Icon = skill.icon
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card text-center p-6 hover:scale-105 transition-transform"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 float-animation"
                       style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' }}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {skill.name}
                  </h3>
                  <p className="text-gray-600 text-sm font-medium">
                    {skill.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Work Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              💼 Recent Work
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
              Here are some of my latest projects showcasing my skills in full-stack development ✨
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading placeholder
              [1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="project-card"
                >
                  <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-pink-100 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-pink-100 rounded mb-4 animate-pulse"></div>
                    <div className="flex flex-wrap gap-2">
                      <div className="h-6 w-16 bg-purple-100 rounded-full animate-pulse"></div>
                      <div className="h-6 w-20 bg-purple-100 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : projects.length > 0 ? (
              // Real project data
              projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="project-card"
                >
                  <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 font-medium">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 2 && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                          +{project.technologies.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Fallback placeholder
              [1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="project-card"
                >
                  <div className="h-48 bg-gradient-to-br from-pink-200 to-purple-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Project {i}
                    </h3>
                    <p className="text-gray-600 mb-4 font-medium">
                      A brief description of this amazing project and the technologies used to build it.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="tech-tag">
                        React
                      </span>
                      <span className="tech-tag">
                        TypeScript
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="btn-primary"
            >
              View All Projects ✨
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Dancing Script, cursive' }}>
              💖 Let's Work Together
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-medium">
              I'm always interested in new opportunities and exciting projects.
              Let's discuss how we can bring your beautiful ideas to life! ✨
            </p>
            <a
              href="mailto:demi@example.com"
              className="btn-secondary bg-white text-pink-600 hover:bg-pink-50 font-semibold"
            >
              Get In Touch 💌
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
