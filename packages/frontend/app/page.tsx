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
    { icon: Globe, name: 'IT Infrastructure', description: 'Active Directory, Windows Server, Hardware'},
    { icon: Database, name: 'Security Fundamentals', description: 'Access Control, Threat Analysis, Network Security' },
    { icon: Code, name: 'Python Development', description: 'Automation, Scripting, Security Tools' },
    { icon: Smartphone, name: 'System Administration', description: 'PDQ Deploy, Helpdesk, User Support' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section pt-32">
        {/* Tech-focused decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 text-2xl text-cyan-500 opacity-20 terminal-cursor">&gt;</div>
          <div className="absolute top-32 right-20 text-lg text-blue-500 opacity-15 terminal-cursor">#</div>
          <div className="absolute bottom-20 left-20 text-xl text-green-500 opacity-10 terminal-cursor">$</div>
          <div className="absolute bottom-32 right-10 text-sm text-cyan-400 opacity-20 terminal-cursor">/</div>
          <div className="absolute top-1/2 left-1/4 text-lg text-blue-400 opacity-10">[ ]</div>
          <div className="absolute top-1/3 right-1/3 text-base text-green-400 opacity-15">{ }</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl sm:text-7xl font-bold mb-6 text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Securing Systems.<br/>
                <span className="gradient-text">Solving Problems.</span><br/>
                <span className="gradient-text">Building Expertise.</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-medium">
                IT Technician with strong aspirations to break into Cybersecurity
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/learning"
                  className="btn-primary"
                >
                  View Learning Journey
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="/experience"
                  className="btn-secondary"
                >
                  View Experience
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              About Me
            </h2>
            <div className="text-lg text-gray-300 max-w-4xl mx-auto font-medium text-left space-y-4">
              <p>
                I'm Will, an IT Technician with hands-on experience across the full spectrum of technical support—from Active Directory and user/group management to hardware setup, maintenance, and software deployment via PDQ. I handle helpdesk tickets with a practical, solution-focused approach, understanding that end users need clear communication as much as they need technical fixes.
              </p>
              <p>
                What sets me apart is my commitment to actually understanding how things work rather than just following procedures. I don't settle for surface-level fixes—I want to know why something broke and how to prevent it next time. This curiosity extends to my development work in Python, where I prioritize learning concepts that stick over quick copy-paste solutions.
              </p>
              <p>
                My current role isn't just about maintaining systems—it's building the foundation for my ultimate goal of transitioning into cybersecurity. I understand that effective security professionals need to know systems inside out: how users interact with them, where vulnerabilities emerge in daily operations, and how seemingly small misconfigurations can create exploitable weaknesses.
              </p>
              <p>
                I bring a direct, no-nonsense approach to problem-solving while maintaining the patience needed for effective user support. I understand that technical work isn't just about systems—it's about the people using them, and in cybersecurity, that human element is often the most critical vulnerability to address.
              </p>
            </div>
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
                       style={{ background: 'var(--gradient-tech)' }}>
                    <Icon className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {skill.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium">
                    {skill.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Projects Section - Placeholder */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Projects Portfolio
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium">
              I'm currently building my portfolio of security projects and Python scripts. 
              Check back soon for updates on my cybersecurity journey!
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="project-card animate-pulse">
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-700"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-700 rounded w-20"></div>
                      <div className="h-6 bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="project-card"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2 text-cyan-400">
                        {project.technologies.includes('Python') ? '🐍' : 
                         project.technologies.includes('Security') ? '🔒' : '🛡️'}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 font-medium">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span key={tech} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium">
                I'm currently building my portfolio of security projects and Python scripts. 
                Check back soon for updates on my cybersecurity journey!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Technical Expertise
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium mb-8">
              IT infrastructure professional with growing cybersecurity expertise
            </p>
            <Link
              href="/experience"
              className="btn-primary"
            >
              View Full Experience
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
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
                       style={{ background: 'var(--gradient-tech)' }}>
                    <Icon className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {skill.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium">
                    {skill.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Learning Preview */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Continuous Learning
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto font-medium mb-8">
              Actively building cybersecurity skills through hands-on learning and certification preparation
            </p>
            <Link
              href="/learning"
              className="btn-primary"
            >
              View Learning Journey
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Python Programming', desc: 'Security automation and scripting', status: 'In Progress' },
              { title: 'Security Fundamentals', desc: 'Core cybersecurity concepts', status: 'In Progress' },
              { title: 'Network Security', desc: 'Practical security skills', status: 'Planning' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3">{item.desc}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'In Progress' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700' :
                  'bg-blue-900/50 text-blue-400 border border-blue-700'
                }`}>
                  {item.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold gradient-text mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Let's Connect
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium">
              I'm always interested in connecting with fellow IT professionals and security enthusiasts.
              Let's discuss opportunities, collaborations, or share knowledge about cybersecurity!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:william.malone80@gmail.com"
                className="btn-primary"
              >
                Email Me
              </a>
              <a
                href="https://www.linkedin.com/in/william-malone-1902b279"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                LinkedIn Profile
              </a>
            </div>
            <div className="mt-8 text-gray-400">
              <p className="mb-2">📍 Middlesbrough, England</p>
              <p>🔧 IT Support Engineer | Aspiring Cybersecurity Professional</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
