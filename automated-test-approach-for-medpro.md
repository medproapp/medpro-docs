# Automated Test Approach for MedPro

## Overview

This document defines the standardized approach for automated testing across all MedPro application modules, based on the successful implementation patterns discovered in the patient registration test suite.

## Framework & Tools

### Primary Framework: Playwright
- **End-to-End Testing**: Full user journey automation
- **Cross-Browser Support**: Chrome, Firefox, Safari, Mobile browsers
- **Multi-Platform**: Desktop, tablet, mobile viewports
- **Rich Debugging**: Screenshots, videos, traces on failures

### Core Dependencies
```json
{
  "@playwright/test": "^1.x.x"
}
```

## Project Structure Standard

### Directory Layout
```
/module-name/tests/
├── playwright.config.js              # Playwright configuration
├── module-name.spec.js               # Main test suite
├── test-data.json                    # Test data fixtures
├── README.md                         # Setup and execution guide
├── additional-feature.spec.js        # Feature-specific tests
└── setup-test-data.sql              # Database fixtures (if needed)
```

### File Naming Conventions
- **Test Files**: `{module-name}.spec.js` or `{feature-name}.spec.js`
- **Config Files**: `playwright.config.js`
- **Data Files**: `test-data.json`, `new-patients-data.json`
- **Documentation**: `README.md`, `RELATORIO_TESTES_{MODULE}.md`

## Configuration Standards

### playwright.config.js Template
```javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'line',
  
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'echo "Assuming frontend server is running on port 8080"',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Organization Patterns

### Test Suite Structure
```javascript
const { test, expect } = require('@playwright/test');
const testData = require('./test-data.json');

// Constants
const BASE_URL = 'http://localhost:8080';
const MODULE_PAGE_URL = '/module/page.html';
const BACKEND_URL = 'http://localhost:3333';

test.describe('Module Name - Main Functionality', () => {
  
  // Authentication setup before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login/index.html');
    await page.fill('#username', testData.testUser.email);
    await page.fill('#password', testData.testUser.password);
    await page.click('#btn-submit');
    await page.waitForTimeout(2000);
  });

  test.describe('Page Loading and Basic Functionality', () => {
    // Basic UI tests
  });

  test.describe('Form Validation', () => {
    // Validation tests
  });

  test.describe('API Integration', () => {
    // Backend communication tests
  });

  test.describe('Responsive Design', () => {
    // Mobile/tablet tests
  });

});
```

### Test Grouping Categories
1. **Page Loading and Basic Functionality**
2. **Form Validation**
3. **API Integration**
4. **File Upload/Photo Handling**
5. **State Management**
6. **Responsive Design**
7. **Keyboard Shortcuts and Accessibility**

## Data Management Standards

### test-data.json Structure
```json
{
  "testUser": {
    "email": "test@medpro.app",
    "password": "TestPassword123!"
  },
  
  "validData": {
    "field1": "valid value",
    "field2": "valid value"
  },
  
  "invalidDataScenarios": {
    "emptyField": {
      "field1": "",
      "error": "Field is required"
    },
    "invalidFormat": {
      "field1": "invalid format",
      "error": "Invalid format"
    }
  },
  
  "operationModes": {
    "create": { /* data */ },
    "edit": { /* data */ },
    "convert": { /* data */ }
  },

  "brazilianData": {
    "cpf": "12345678901",
    "state": "SP",
    "city": "São Paulo",
    "phone": "(11) 99999-9999"
  }
}
```

### Brazilian-Specific Data Requirements
- **CPF**: Valid format with 11 digits
- **States**: Use Brazilian state codes (SP, RJ, MG, etc.)
- **Cities**: Real Brazilian municipality names
- **Phone**: Brazilian format with area codes
- **CEP**: Brazilian postal code format

## Common Test Scenarios

### 1. Form Validation Testing
```javascript
test('should validate required fields', async ({ page }) => {
  await page.goto(MODULE_PAGE_URL);
  
  // Try to submit empty form
  await page.click('#submit-btn');
  
  // Check validation messages
  await expect(page.locator('.validation-error')).toBeVisible();
  await expect(page.locator('#submit-btn')).toBeDisabled();
});
```

### 2. API Integration Testing
```javascript
test('should create record successfully', async ({ page }) => {
  await page.goto(MODULE_PAGE_URL);
  
  // Fill form with valid data
  await page.fill('#field1', testData.validData.field1);
  
  // Wait for API response
  const responsePromise = page.waitForResponse(response => 
    response.url().includes('/api/endpoint') && 
    response.request().method() === 'POST'
  );
  
  await page.click('#submit-btn');
  const response = await responsePromise;
  
  expect(response.status()).toBe(201);
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### 3. File Upload Testing
```javascript
async function simulateFileUpload(page, fileName) {
  const fileBuffer = Buffer.from([/* test file data */]);
  
  await page.setInputFiles('#file-input', {
    name: fileName,
    mimeType: 'image/png',
    buffer: fileBuffer
  });
  
  await page.waitForTimeout(1000);
}
```

### 4. State/City Dropdown Testing (Brazilian IBGE API)
```javascript
test('should load cities when state is selected', async ({ page }) => {
  await page.goto(MODULE_PAGE_URL);
  
  // Select state
  await page.selectOption('#state', 'SP');
  
  // Wait for IBGE API response
  await page.waitForResponse(response => 
    response.url().includes('servicodados.ibge.gov.br') && 
    response.url().includes('municipios')
  );
  
  // Verify cities are loaded
  const cityOptions = await page.locator('#city option').count();
  expect(cityOptions).toBeGreaterThan(1);
});
```

### 5. Responsive Design Testing
```javascript
test('should work on mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(MODULE_PAGE_URL);
  
  await expect(page.locator('#main-content')).toBeVisible();
  await expect(page.locator('#submit-btn')).toBeVisible();
});
```

## Authentication Patterns

### Standard Login Setup
```javascript
test.beforeEach(async ({ page }) => {
  // Navigate to login
  await page.goto('/login/index.html');
  
  // Login with test credentials
  await page.fill('#username', testData.testUser.email);
  await page.fill('#password', testData.testUser.password);
  await page.click('#btn-submit');
  
  // Wait for login completion
  await page.waitForTimeout(2000);
  
  // Verify login success (optional)
  await expect(page.locator('#user-menu')).toBeVisible();
});
```

### Role-Based Testing
```javascript
const testRoles = [
  { role: 'practitioner', email: 'pract@test.com' },
  { role: 'patient', email: 'patient@test.com' },
  { role: 'admin', email: 'admin@test.com' }
];

testRoles.forEach(userRole => {
  test(`should work for ${userRole.role}`, async ({ page }) => {
    await loginAs(page, userRole.email);
    // Test functionality
  });
});
```

## Error Handling & Validation

### Expected Error Scenarios
```javascript
test.describe('Error Handling', () => {
  
  test('should handle server errors gracefully', async ({ page }) => {
    // Mock server error response
    await page.route('/api/endpoint', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    
    await page.goto(MODULE_PAGE_URL);
    await page.click('#submit-btn');
    
    await expect(page.locator('.error-message')).toContainText('Erro interno');
  });
  
  test('should handle network failures', async ({ page }) => {
    // Simulate network failure
    await page.route('/api/endpoint', route => route.abort());
    
    await page.goto(MODULE_PAGE_URL);
    await page.click('#submit-btn');
    
    await expect(page.locator('.error-message')).toContainText('Erro de conexão');
  });
  
});
```

## Best Practices

### 1. Wait Strategies
```javascript
// ✅ Good - Wait for specific condition
await page.waitForSelector('#element');
await page.waitForLoadState('networkidle');
await page.waitForResponse(response => response.url().includes('/api'));

// ❌ Avoid - Fixed timeouts unless necessary
await page.waitForTimeout(5000);
```

### 2. Assertions
```javascript
// ✅ Good - Specific expectations
await expect(page.locator('#element')).toBeVisible();
await expect(page.locator('#input')).toHaveValue('expected');
await expect(response.status()).toBe(201);

// ❌ Avoid - Generic assertions
expect(element).toBeTruthy();
```

### 3. Element Selection
```javascript
// ✅ Good - Stable selectors
page.locator('#unique-id')
page.locator('[data-testid="element"]')
page.getByRole('button', { name: 'Submit' })

// ❌ Avoid - Fragile selectors
page.locator('.btn.btn-primary.mt-3')
page.locator('div > div > button:nth-child(3)')
```

### 4. Test Data Management
```javascript
// ✅ Good - Use fixtures
const testData = require('./test-data.json');
await page.fill('#email', testData.validUser.email);

// ❌ Avoid - Hardcoded data
await page.fill('#email', 'test@example.com');
```

## Execution Commands

### Local Development
```bash
# Install dependencies
npm install
npx playwright install

# Run all tests
npx playwright test --reporter=line

# Run specific test file
npx playwright test module-name.spec.js

# Run with debugging
npx playwright test --debug

# Run specific browser
npx playwright test --project=chromium

# Run mobile tests
npx playwright test --project="Mobile Chrome"
```

### CI/CD Integration
```bash
# CI environment
CI=true npx playwright test --reporter=html

# With retries and parallel execution
npx playwright test --workers=1 --retries=2
```

## Debugging & Troubleshooting

### Debug Mode
```bash
# Visual debugging
npx playwright test --debug

# Generate trace files
npx playwright test --trace=on

# Generate test report
npx playwright show-report
```

### Common Issues
1. **Element not found**: Check selectors and wait conditions
2. **Flaky tests**: Add proper wait strategies
3. **API timeouts**: Increase timeout values or mock responses
4. **File upload failures**: Verify file paths and permissions

## Test Data Requirements

### Authentication Data
- Test user credentials for each role
- Valid session tokens
- Organization/clinic associations

### Form Data
- Valid data sets for all form fields
- Invalid data scenarios for validation testing
- Edge cases (empty, special characters, long strings)

### Brazilian-Specific Data
- Valid CPF numbers (use test CPFs like 11111111111)
- Real state and city combinations
- Proper phone number formats
- Valid postal codes (CEP)

### File Upload Data
- Sample image files (PNG, JPG)
- Invalid file types for error testing
- Large files for size validation

## Reporting & Documentation

### Test Results Documentation
Create `RELATORIO_TESTES_{MODULE}.md` for each test suite:
- Test execution summary
- Coverage analysis
- Known issues and limitations
- Performance metrics

### README.md Template
```markdown
# Module Name - Automated Tests

## Overview
Brief description of test coverage

## Setup
Prerequisites and installation steps

## Running Tests
Command examples

## Test Data
Description of test fixtures

## Known Issues
Current limitations
```

## Integration with MedPro Architecture

### Backend Dependencies
- MedPro backend running on localhost:3333
- Database with test data
- IBGE API access for address validation
- Email service for notifications

### Frontend Dependencies
- MedPro frontend on localhost:8080
- Bootstrap CSS framework
- FontAwesome icons
- jQuery for legacy components

### External Services
- Stripe for payment testing
- SendGrid for email testing
- Google Analytics for tracking
- WhatsApp integration

## Maintenance Guidelines

### Regular Updates
1. Update Playwright version quarterly
2. Review and update test data monthly
3. Add tests for new features
4. Remove obsolete test cases

### Test Health Monitoring
- Track test execution times
- Monitor flaky test patterns
- Review failure rates
- Update selectors as UI changes

### Documentation Updates
- Keep this document current with changes
- Update module-specific README files
- Document new testing patterns
- Share best practices across team

---

## Quick Reference

### Essential Commands
```bash
# Setup
npm install && npx playwright install

# Run tests
npx playwright test --reporter=line --project=chromium

# Debug
npx playwright test --debug module-name.spec.js

# Mobile testing
npx playwright test --project="Mobile Chrome"
```

### Key File Locations
- Config: `playwright.config.js`
- Tests: `*.spec.js`
- Data: `test-data.json`
- Docs: `README.md`

### Test Categories
1. Page Loading & Basic UI
2. Form Validation
3. API Integration
4. File Upload
5. Responsive Design
6. Accessibility

This document serves as the definitive guide for all automated testing in the MedPro application ecosystem. Refer to it when creating new test suites or maintaining existing ones.