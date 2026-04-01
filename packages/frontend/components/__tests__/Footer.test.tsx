import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders footer with correct links', () => {
    const { container } = render(<Footer />)

    const linkedinLink = container.querySelector(
      'a[href="https://www.linkedin.com/in/william-malone-1902b279"]'
    )
    expect(linkedinLink).toBeTruthy()

    const emailLink = container.querySelector('a[href="mailto:william.malone80@gmail.com"]')
    expect(emailLink).toBeTruthy()
  })

  it('displays copyright information', () => {
    const { container } = render(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(container.textContent).toContain(currentYear.toString())
    expect(container.textContent).toContain('William Malone')
  })
})
