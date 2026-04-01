# Testing Guide

This project uses a comprehensive testing setup with:
- **Cypress** with **Cucumber** for E2E testing (BDD style)
- **Vitest** for unit tests in frontend and admin packages
- **Jest** for unit tests in backend package

## Setup

### Install Dependencies

```bash
# Install all dependencies (including test dependencies)
npm install
# or
yarn install
```

### Environment Variables for E2E Tests

Create a `.cypress.env` file in the root directory (copy from `.cypress.env.example`):

```env
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_admin_password
API_URL=http://localhost:5000
```

## Running Tests

### Run All Tests

```bash
# Run all unit tests across all packages
npm run test

# Run E2E tests
npm run test:e2e

# Open Cypress Test Runner (interactive)
npm run test:e2e:open
```

### Run Tests by Package

#### Frontend
```bash
cd packages/frontend
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

#### Admin
```bash
cd packages/admin
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

#### Backend
```bash
cd packages/backend
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Test Structure

### E2E Tests (Cypress + Cucumber)

E2E tests are located in `cypress/e2e/` and use Cucumber's BDD format:

```
cypress/
├── e2e/
│   ├── homepage.feature          # Feature file (Gherkin syntax)
│   ├── admin-login.feature
│   ├── blog.feature
│   └── step_definitions/         # Step definitions (TypeScript)
│       ├── homepage.steps.ts
│       ├── admin-login.steps.ts
│       └── blog.steps.ts
├── support/
│   ├── e2e.ts                     # Support file
│   └── commands.ts                # Custom commands
└── fixtures/
    └── example.json               # Test fixtures
```

#### Writing E2E Tests

1. Create a `.feature` file in `cypress/e2e/` with Gherkin syntax:

```gherkin
Feature: My Feature
  As a user
  I want to do something
  So that I can achieve a goal

  Scenario: User can do something
    Given I am on the homepage
    When I click the button
    Then I should see the result
```

2. Create step definitions in `cypress/e2e/step_definitions/`:

```typescript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('I am on the homepage', () => {
  cy.visit('/')
})

When('I click the button', () => {
  cy.get('button').click()
})

Then('I should see the result', () => {
  cy.get('.result').should('be.visible')
})
```

### Unit Tests

#### Frontend & Admin (Vitest)

Unit tests are located alongside the code they test:

```
packages/frontend/
├── src/
│   ├── components/
│   │   └── __tests__/
│   │       └── Footer.test.tsx
│   └── lib/
│       └── __tests__/
│           └── api.test.ts
└── src/test/
    └── setup.ts                   # Test setup file
```

#### Backend (Jest)

Unit tests are located in `__tests__` directories:

```
packages/backend/
├── src/
│   ├── routes/
│   │   └── __tests__/
│   │       └── projects.test.ts
│   ├── middleware/
│   │   └── __tests__/
│   │       └── auth.test.ts
│   └── test/
│       └── setup.ts               # Test setup file
```

## Writing Unit Tests

### Frontend/Admin Example (Vitest + React Testing Library)

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Backend Example (Jest + Supertest)

```typescript
import request from 'supertest'
import express from 'express'
import myRouter from '../myRouter'

describe('My API', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/api/my', myRouter)
  })

  it('should return data', async () => {
    const response = await request(app).get('/api/my')
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})
```

## Test Coverage

Coverage reports are generated when running tests with coverage:

- Frontend/Admin: Coverage reports in `coverage/` directory
- Backend: Coverage reports in `coverage/` directory

View HTML coverage reports by opening `coverage/index.html` in a browser.

## Best Practices

1. **Write tests first** (TDD) or alongside code
2. **Keep tests isolated** - each test should be independent
3. **Use descriptive test names** - describe what is being tested
4. **Mock external dependencies** - don't make real API calls in unit tests
5. **Test user behavior** - focus on what users see and do
6. **Keep E2E tests minimal** - use for critical user flows only
7. **Use data-testid** attributes for reliable element selection in E2E tests

## Continuous Integration

Tests should run automatically in CI/CD pipelines. Make sure to:

1. Set up environment variables in CI
2. Run tests before deployment
3. Fail builds if tests fail
4. Generate and publish coverage reports

## Troubleshooting

### Cypress Tests Failing

- Ensure the frontend is running on `http://localhost:3000`
- Check that environment variables are set correctly
- Verify API endpoints are accessible

### Unit Tests Failing

- Check that all dependencies are installed
- Verify test setup files are correct
- Ensure mocks are properly configured

### Coverage Not Generating

- Make sure coverage provider is installed
- Check that coverage configuration is correct in test config files

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cucumber for Cypress](https://github.com/badeball/cypress-cucumber-preprocessor)
- [Vitest Documentation](https://vitest.dev/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

