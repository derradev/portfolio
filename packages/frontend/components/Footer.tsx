'use client'

import React from 'react'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold gradient-text" style={{ fontFamily: 'Poppins, sans-serif' }}>
              William Malone
            </h3>
            <p className="text-gray-400 text-sm font-medium">
              IT Support Engineer with aspirations to transition into cybersecurity.
              Passionate about system security and learning new technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Quick Links
            </h3>
            <div className="space-y-2">
              <a href="#skills" className="block text-gray-400 hover:text-cyan-400 text-sm transition-colors font-medium">
                Skills
              </a>
              <a href="#experience" className="block text-gray-400 hover:text-cyan-400 text-sm transition-colors font-medium">
                Experience
              </a>
              <a href="#certifications" className="block text-gray-400 hover:text-cyan-400 text-sm transition-colors font-medium">
                Certifications
              </a>
              <a href="#contact" className="block text-gray-400 hover:text-cyan-400 text-sm transition-colors font-medium">
                Contact
              </a>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Connect
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/william-malone-1902b279"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-110 transition-transform"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:william.malone80@gmail.com"
                className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-110 transition-transform"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-medium">
              © {currentYear} William Malone. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0 font-medium">
              Built with passion for cybersecurity and system administration
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
