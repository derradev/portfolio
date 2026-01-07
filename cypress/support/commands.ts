/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login to admin panel
       * @example cy.login('admin@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to wait for API response
       * @example cy.waitForAPI('GET', '/api/projects')
       */
      waitForAPI(method: string, url: string, alias?: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/admin')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/admin/dashboard')
})

Cypress.Commands.add('waitForAPI', (method: string, url: string, alias?: string) => {
  const apiAlias = alias || `api${method}${url.replace(/\//g, '_')}`
  cy.intercept(method, url).as(apiAlias)
  cy.wait(`@${apiAlias}`)
  return cy.get(`@${apiAlias}`)
})

export {}

