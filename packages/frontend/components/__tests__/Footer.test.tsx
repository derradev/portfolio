import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders footer with correct links', () => {
    const { container } = render(<Footer />)
    
    // Check for GitHub link by href
    const githubLink = container.querySelector('a[href="https://github.com/DemiInfinity"]')
    expect(githubLink).toBeTruthy()
    
    // Check for LinkedIn link by href
    const linkedinLink = container.querySelector('a[href="https://www.linkedin.com/in/demi-taylor-nimmo-bb320b40"]')
    expect(linkedinLink).toBeTruthy()
    
    // Check for email link
    const emailLink = container.querySelector('a[href="mailto:demi.21@outlook.com"]')
    expect(emailLink).toBeTruthy()
  })

  it('displays copyright information', () => {
    const { container } = render(<Footer />)
    
    const currentYear = new Date().getFullYear()
    expect(container.textContent).toContain(currentYear.toString())
    expect(container.textContent).toContain('Demi Taylor Nimmo')
  })
})

