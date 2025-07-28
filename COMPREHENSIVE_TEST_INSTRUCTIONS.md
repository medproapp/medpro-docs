# MedPro Comprehensive Test Instructions & Best Practices

## Table of Contents
1. [Critical Testing Rules](#critical-testing-rules)
2. [Test Planning Guidelines](#test-planning-guidelines)
3. [Test Implementation Standards](#test-implementation-standards)
4. [Common Mistakes & Solutions](#common-mistakes--solutions)
5. [Test Framework Setup](#test-framework-setup)
6. [Writing Effective Tests](#writing-effective-tests)
7. [Test Data Management](#test-data-management)
8. [API Testing Best Practices](#api-testing-best-practices)
9. [UI Testing Patterns](#ui-testing-patterns)
10. [Debugging Failed Tests](#debugging-failed-tests)
11. [Performance & Optimization](#performance--optimization)
12. [Test Execution & Reporting](#test-execution--reporting)

---

## 🚨 Critical Testing Rules

### 🔥 RULE #0: ALWAYS USE EXISTING TESTS AS BASE - NEVER START FROM SCRATCH!
**MANDATORY FIRST STEP**: Before creating any new test, you MUST examine existing tests in the codebase to follow established patterns, configurations, and structures.

**REQUIRED STEPS BEFORE WRITING NEW TESTS:**
1. **Search for existing test files** using patterns like `**/*test*`, `**/*spec*`, `**/playwright*`
2. **Examine existing test structure** - Look at page objects, test data files, configurations
3. **Follow established patterns** - Use same naming conventions, directory structure, and testing approaches
4. **Reuse existing configurations** - playwright.config.js, test data structures, helper utilities
5. **Extend existing page objects** - Don't recreate what already exists
6. **Use established test data** - Follow existing JSON structures and data patterns

```bash
# ✅ CORRECT - Always search first
find . -name "*test*" -o -name "*spec*" -o -name "playwright*"
# Then examine files like:
# - /tests/playwright.config.js
# - /tests/page-objects/
# - /tests/test-data/
# - /tests/specs/
```

```javascript
// ❌ WRONG - Creating new test structure from scratch
// Creating new page objects, configs, and patterns without checking existing ones

// ✅ CORRECT - Extending existing patterns
// Found existing LoginPage.js, extending it for new functionality
import { LoginPage } from '../page-objects/LoginPage.js';
import { testUsers } from '../test-data/users.json';
```

**Why this is CRITICAL:**
- Maintains consistency across the entire test suite
- Prevents duplicating existing functionality and utilities
- Ensures compatibility with established CI/CD pipelines
- Saves significant development time and reduces maintenance overhead
- Prevents conflicts between different testing approaches

### 🔥 RULE #1: NEVER DECLARE APPLICATION BUGS WITHOUT VERIFYING TEST SCRIPT CORRECTNESS FIRST!
**THIS IS THE MOST CRITICAL RULE**: Before declaring ANY application bug or failing a test, you MUST verify that your test script is correct. Most "bugs" are actually test script errors!

**MANDATORY VERIFICATION STEPS BEFORE DECLARING A BUG:**
1. **Double-check ALL selectors** against the actual HTML source code
2. **Verify element IDs and classes** match exactly what's in the DOM
3. **Test selectors manually** in browser dev tools first
4. **Check if elements exist but are not visible** vs truly missing
5. **Verify correct timing** - elements might load after your wait
6. **Ensure proper navigation flow** - are you on the right page/step?

```javascript
// ❌ WRONG - Blaming application when selector is wrong
await page.locator('#who-patient').textContent(); // Element doesn't exist!
// Then declaring: "BUG: Missing accordion summary elements"

// ✅ CORRECT - Verify actual HTML structure first
// Check HTML: <span id="who-name" class="accordion-summary"></span>
await page.locator('#who-name').textContent(); // Correct selector!

// ✅ CORRECT - Debug selector issues before blaming app
const elements = await page.locator('#who-name').count();
console.log(`Found ${elements} elements with #who-name`);
if (elements === 0) {
  console.log('Element not found - check HTML structure');
  // NOW investigate if it's a test or app issue
}
```

**Why this is CRITICAL:**
- False bug reports waste development time and lose credibility
- Test scripts must be 100% correct before questioning the application
- Most "application bugs" are actually incorrect test implementations
- Proper verification saves hours of debugging wrong issues

### 🔥 RULE #2: UI TESTS MUST VALIDATE UI, NOT API RESPONSES!
**This is the THIRD MOST CRITICAL RULE**: UI tests exist to verify what users SEE, not what APIs return. **NEVER** validate API responses as proof that the UI works correctly.

```javascript
// ❌ WRONG - Validating API response in a UI test
const response = await page.waitForResponse('/api/patient/search');
const data = await response.json();
expect(data.patients.length).toBeGreaterThan(0); // NO! This proves API works, NOT the UI!

// ✅ CORRECT - Validate what the user actually sees on screen
await page.click('#search-button');
await page.waitForSelector('.patient-card', { state: 'visible' }); // Wait for UI to render
const visiblePatients = await page.locator('.patient-card').count();
expect(visiblePatients).toBeGreaterThan(0); // YES! This proves UI displays results!

// ✅ CORRECT - Validate specific UI content
const firstPatientName = await page.locator('.patient-card .patient-name').first().textContent();
expect(firstPatientName).toBe('Maria Silva Santos'); // Validates actual displayed text

// ✅ CORRECT - Validate UI state changes
await expect(page.locator('.loading-spinner')).toBeVisible(); // Loading state shown
await expect(page.locator('.loading-spinner')).toBeHidden();  // Loading complete
await expect(page.locator('.search-results')).toBeVisible();  // Results displayed
await expect(page.locator('.no-results-message')).toBeHidden(); // No error shown
```

**Why this matters**: The API might return perfect data, but if the UI doesn't display it correctly, the user experience is broken. UI tests must validate the UI!

### RULE #3: Always Read Test Data Files First
**NEVER** guess test data or hardcode values. **ALWAYS** check the actual test data files before writing tests.

```javascript
// ❌ WRONG - Guessing service names
await servicesStep.addService('Consulta'); // Service doesn't exist!

// ✅ CORRECT - Using actual test data
const testData = require('./test-data/services.json');
await servicesStep.addService(testData.services[0].name); // "Pacote Exames Básicos"
```

### RULE #4: Never Trust "Always Returns True" Methods
Test methods must verify actual functionality, not just return success.

```javascript
// ❌ WRONG - False positive
async addService(serviceName) {
  await searchResultItem.first().click();
  return true;  // Always returns true regardless of outcome!
}

// ✅ CORRECT - Real verification
async addService(serviceName) {
  const beforeCount = await this.getSelectedServicesCount();
  await this.clickService(serviceName);
  const afterCount = await this.getSelectedServicesCount();
  const serviceAdded = await this.isServiceInList(serviceName);
  return afterCount > beforeCount && serviceAdded;
}
```

### RULE #5: Test One Thing at a Time
Use browser-specific testing during development to avoid overwhelming test runs.

```bash
# ❌ WRONG - Running all browsers when debugging one issue
npm test

# ✅ CORRECT - Test specific browser first
npm test -- --project="Desktop Chrome"
```

### RULE #6: Always Check Backend Before Testing Frontend
Many "frontend bugs" are actually backend issues. Always verify API endpoints exist and work.

```bash
# Check backend health
curl http://localhost:3333/health

# Test specific API endpoint
TOKEN=$(curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"user@demo.app","password":"senha2"}' \
  "http://localhost:3333/login" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

curl -H "Authorization: Bearer $TOKEN" "http://localhost:3333/api/endpoint"
```

### RULE #7: Read the Logs First
When tests fail, **ALWAYS** check server logs before debugging code.

```bash
# Check backend logs for SQL errors, auth issues, etc.
tail -50 /path/to/server/logs/combined-YYYY-MM-DD.log | grep -E "(error|ERROR|failed)"
```

---

## 📋 Test Planning Guidelines

### 1. Before Writing Any Test

#### Checklist:
- [ ] **Environment Ready**: Backend (3333), Frontend (8080), Database running
- [ ] **Test User Exists**: Verify login credentials work manually
- [ ] **API Endpoints Work**: Test each endpoint with curl/Postman
- [ ] **Test Data Verified**: Check test data matches actual database
- [ ] **DOM Structure Analyzed**: Inspect page elements before writing selectors

### 2. Test Plan Structure

```markdown
# [Feature] Test Plan

## Test Scope
- What functionality is being tested
- What is explicitly NOT being tested
- Dependencies and prerequisites

## Test Categories
1. **UI Tests** - Element visibility, user interactions
2. **Functional Tests** - Business logic, workflows
3. **Integration Tests** - API calls, data flow
4. **Edge Cases** - Error handling, validation
5. **Performance Tests** - Load times, responsiveness

## Test Data Requirements
- User accounts needed
- Database records required
- External service dependencies

## Success Criteria
- All critical paths covered
- No false positives
- Tests run in < 30 seconds per suite
```

### 3. Prioritization Matrix

| Priority | Type | When to Test |
|----------|------|--------------|
| **P0 - Critical** | Login, Core Features | Before any deployment |
| **P1 - High** | Main User Flows | Daily regression |
| **P2 - Medium** | Secondary Features | Weekly |
| **P3 - Low** | Edge Cases | Monthly |

---

## 🏗️ Test Implementation Standards

### Directory Structure

```
tests/
├── playwright.config.js      # Framework configuration
├── package.json             # Dependencies and scripts
├── test-data/              # Test data files
│   ├── users.json          # User credentials
│   ├── patients.json       # Patient records
│   └── services.json       # Service/product data
├── helpers/                # Utility functions
│   ├── TestHelpers.js      # Common test utilities
│   ├── ApiHelpers.js       # API interaction helpers
│   └── WaitStrategies.js   # Smart wait functions
├── page-objects/           # Page Object Models
│   └── [Feature]Page.js    # One per major page/feature
└── specs/                  # Test specifications
    └── [feature].spec.js   # Test files

```

### Naming Conventions

```javascript
// Test files
appointment-create.spec.js    // Feature-based naming
patient-search.spec.js       // Specific functionality

// Page Objects
PatientSearchPage.js         // PascalCase for classes
AppointmentCreatePage.js     // Clear feature identification

// Test descriptions
test.describe('Patient Search Functionality', () => {
  test('should find patient by CPF', async () => {
    // Clear, specific test names
  });
});
```

---

## 🚫 Common Mistakes & Solutions

### Mistake #1: Hardcoding Test Data

```javascript
// ❌ WRONG - Hardcoded values
await page.click('text=Maria Silva Santos');
await page.fill('#cpf', '12345678901');

// ✅ CORRECT - Data-driven approach
const testData = require('./test-data/patients.json');
const patient = testData.patients.patient1;
await page.click(`text=${patient.name}`);
await page.fill('#cpf', patient.cpf);
```

### Mistake #2: Not Waiting Properly

```javascript
// ❌ WRONG - Fixed timeout
await page.waitForTimeout(5000); // Arbitrary wait

// ✅ CORRECT - Wait for specific conditions
await page.waitForSelector('#search-results', { state: 'visible' });
await page.waitForResponse(response => 
  response.url().includes('/api/search') && response.status() === 200
);
```

### Mistake #3: Over-Engineering Simple Tasks

```javascript
// ❌ WRONG - Complex solution for simple problem
async setupComplexTestEnvironment() {
  // 100 lines of unnecessary setup code
}

// ✅ CORRECT - Keep it simple
async login(userType = 'practitioner') {
  const user = testUsers[userType];
  await this.page.goto('/login');
  await this.page.fill('#username', user.email);
  await this.page.fill('#password', user.password);
  await this.page.click('#btn-submit');
  await this.page.waitForURL('**/dashboard');
}
```

### Mistake #4: Ignoring Test Isolation

```javascript
// ❌ WRONG - Tests depend on each other
test('create patient', async () => {
  // Creates patient that next test depends on
});

test('search patient', async () => {
  // Fails if previous test didn't run
});

// ✅ CORRECT - Independent tests
test.beforeEach(async ({ page }) => {
  // Fresh setup for each test
  await setupCleanTestEnvironment();
});
```

### Mistake #5: Not Verifying Actions

```javascript
// ❌ WRONG - Click and hope
await page.click('#submit-button');
// No verification of what happened

// ✅ CORRECT - Verify every action
await page.click('#submit-button');
await expect(page.locator('.success-message')).toBeVisible();
await expect(page).toHaveURL(/\/success/);
```

---

## 🛠️ Test Framework Setup

### Playwright Configuration

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['line']
  ],
  
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 15000,
    
    // Brazilian locale settings
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:single": "playwright test --project='Desktop Chrome'",
    "test:mobile": "playwright test --project='Mobile Chrome'",
    "test:report": "playwright show-report",
    "test:trace": "playwright show-trace"
  }
}
```

---

## ✍️ Writing Effective Tests

### Test Structure Template

```javascript
const { test, expect } = require('@playwright/test');
const { TestHelpers } = require('../helpers/TestHelpers');
const { PatientSearchPage } = require('../page-objects/PatientSearchPage');

test.describe('Feature: Patient Search', () => {
  let helpers;
  let patientSearch;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    patientSearch = new PatientSearchPage(page);
    
    // Login and navigate to feature
    await helpers.login('practitioner');
    await page.goto('/patient/search');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Capture screenshot on failure
    if (testInfo.status !== 'passed') {
      await page.screenshot({ 
        path: `screenshots/${testInfo.title}-failure.png`,
        fullPage: true 
      });
    }
  });

  test('should search patient by CPF', async ({ page }) => {
    // Arrange
    const testPatient = helpers.getTestPatient('patient1');
    
    // Act
    await patientSearch.searchByCPF(testPatient.cpf);
    
    // Assert
    await expect(patientSearch.searchResults).toBeVisible();
    await expect(patientSearch.getResultCount()).toBeGreaterThan(0);
    await expect(page.locator(`text=${testPatient.name}`)).toBeVisible();
  });
});
```

### Page Object Pattern - Data-Driven Methods

```javascript
class PatientSearchPage {
  constructor(page) {
    this.page = page;
    
    // ✅ CORRECT - Element selectors configurable, not hardcoded
    this.selectors = {
      searchInput: '#patient-search',
      searchButton: '#btn-search',
      searchResults: '#search-results',
      loadingSpinner: '.spinner',
      resultItem: '.search-result-item',
      noResults: '.no-results-message',
      patientCard: '.patient-card',
      patientName: '.patient-name',
      patientCPF: '.patient-cpf'
    };
  }

  // ✅ CORRECT - Generic search method works with ANY search term
  async search(searchTerm) {
    await this.page.fill(this.selectors.searchInput, searchTerm);
    await this.page.click(this.selectors.searchButton);
    await this.waitForSearchComplete();
  }

  // ✅ CORRECT - Validate UI based on expected data
  async validateSearchResults(expectedData) {
    // Wait for UI to display results
    await this.page.waitForSelector(this.selectors.searchResults, { state: 'visible' });
    
    // Count visible results in UI
    const visibleResults = await this.page.locator(this.selectors.resultItem).count();
    
    // Validate count matches expectation
    if (expectedData.resultCount !== undefined) {
      expect(visibleResults).toBe(expectedData.resultCount);
    }
    
    // Validate specific content if provided
    if (expectedData.firstResult) {
      const firstCard = this.page.locator(this.selectors.patientCard).first();
      
      if (expectedData.firstResult.name) {
        await expect(firstCard.locator(this.selectors.patientName))
          .toContainText(expectedData.firstResult.name);
      }
      
      if (expectedData.firstResult.cpf) {
        await expect(firstCard.locator(this.selectors.patientCPF))
          .toContainText(expectedData.firstResult.cpf);
      }
    }
    
    // Validate no results message if expected
    if (expectedData.resultCount === 0) {
      await expect(this.page.locator(this.selectors.noResults)).toBeVisible();
    }
  }

  // ✅ CORRECT - Generic selection method
  async selectResult(selectionCriteria) {
    const selector = selectionCriteria.byIndex 
      ? `${this.selectors.resultItem}:nth-child(${selectionCriteria.byIndex})`
      : `${this.selectors.resultItem}:has-text("${selectionCriteria.byText}")`;
    
    await this.page.click(selector);
    
    // Validate selection was made in UI
    await expect(this.page.locator(selector)).toHaveClass(/selected|active/);
  }
}
```

---

## 📊 Test Data Management

### 🎯 CRITICAL: Full Data-Driven Testing

**Test scripts should NEVER need modification when test data changes!**

### Proper Data-Driven Test Structure

```javascript
// ❌ WRONG - Hardcoded test that needs changes when data changes
test('should search for Maria Silva', async ({ page }) => {
  await page.fill('#search', 'Maria Silva'); // Hardcoded name
  await page.click('#search-btn');
  await expect(page.locator('text=Maria Silva')).toBeVisible(); // Hardcoded expectation
});

// ✅ CORRECT - Data-driven test that works with ANY data
const testData = require('./test-data/search-scenarios.json');

// Run the SAME test with DIFFERENT data sets
testData.searchScenarios.forEach((scenario) => {
  test(`should search for ${scenario.description}`, async ({ page }) => {
    // Test logic never changes, only data changes
    await page.fill('#search', scenario.searchTerm);
    await page.click('#search-btn');
    
    // Validate based on expected results from data file
    if (scenario.expectedResults > 0) {
      await expect(page.locator(scenario.resultSelector)).toHaveCount(scenario.expectedResults);
      await expect(page.locator(scenario.firstResultSelector)).toContainText(scenario.expectedText);
    } else {
      await expect(page.locator('.no-results')).toBeVisible();
    }
  });
});
```

### Test Data File Structure

```json
// test-data/search-scenarios.json
{
  "searchScenarios": [
    {
      "description": "patient by full name",
      "searchTerm": "Maria Silva Santos",
      "expectedResults": 1,
      "resultSelector": ".patient-card",
      "firstResultSelector": ".patient-card:first-child .patient-name",
      "expectedText": "Maria Silva Santos"
    },
    {
      "description": "patient by CPF",
      "searchTerm": "123.456.789-00",
      "expectedResults": 1,
      "resultSelector": ".patient-card",
      "firstResultSelector": ".patient-card:first-child .patient-cpf",
      "expectedText": "123.456.789-00"
    },
    {
      "description": "non-existent patient",
      "searchTerm": "ZZZ999XXX",
      "expectedResults": 0,
      "resultSelector": ".patient-card",
      "noResultsSelector": ".no-results-message"
    }
  ]
}
```

### Complete Data-Driven Test Example

```javascript
// appointment-creation-data-driven.spec.js
const { test } = require('@playwright/test');
const testCases = require('./test-data/appointment-scenarios.json');

// Single test function that handles ALL appointment scenarios
async function createAppointment(page, scenario) {
  // Navigate and login (data-driven)
  await page.goto('/login');
  await page.fill('#email', scenario.user.email);
  await page.fill('#password', scenario.user.password);
  await page.click('#login-btn');
  
  // Select patient (data-driven)
  await page.goto('/appointment/create');
  await page.fill('#patient-search', scenario.patient.searchTerm);
  await page.click('#search-btn');
  await page.click(`text=${scenario.patient.expectedName}`);
  
  // Select services (data-driven)
  for (const service of scenario.services) {
    await page.fill('#service-search', service.name);
    await page.click(`text=${service.name}`);
  }
  
  // Validate UI shows correct total (data-driven)
  await expect(page.locator('#total-price')).toContainText(scenario.expectedTotal);
  
  // Complete appointment with expected outcome
  await page.click('#confirm-appointment');
  
  if (scenario.expectedOutcome === 'success') {
    await expect(page.locator('.success-message')).toContainText(scenario.successMessage);
  } else {
    await expect(page.locator('.error-message')).toContainText(scenario.errorMessage);
  }
}

// Generate tests from data file - NO CODE CHANGES NEEDED when data changes!
testCases.scenarios.forEach((scenario) => {
  test(scenario.testName, async ({ page }) => {
    await createAppointment(page, scenario);
  });
});
```

### Test Data Files Organization

```
test-data/
├── users.json                 # User credentials for different roles
├── patients.json              # Patient test data
├── services.json              # Available services/products
├── appointment-scenarios.json # Complete appointment workflows
├── search-scenarios.json      # Search test cases
├── validation-rules.json      # Field validation expectations
└── error-messages.json        # Expected error messages by scenario
```

### Benefits of True Data-Driven Testing

1. **No Code Changes**: Add new test cases by adding data only
2. **Easy Maintenance**: Update test data without touching test code
3. **Better Coverage**: Easy to add edge cases and variations
4. **Clear Separation**: Test logic vs test data are separate
5. **Reusable**: Same test function works for many scenarios

---

## 🌐 API Testing Best Practices

### ⚠️ IMPORTANT: API Monitoring vs UI Validation

**API monitoring should be used for debugging, NOT for validating UI test success!**

```javascript
// ✅ CORRECT - Monitor API for debugging purposes only
page.on('response', response => {
  if (response.url().includes('/api/patient/search')) {
    console.log('API called:', response.status()); // For debugging only
  }
});

// ❌ WRONG - Using API response to validate UI test
const response = await page.waitForResponse('/api/patient/search');
const data = await response.json();
expect(data.patients.length).toBeGreaterThan(0); // NO! This doesn't prove UI works!

// ✅ CORRECT - Validate the actual UI after API completes
await page.click('#search-button');
// Wait for UI to update after API call
await page.waitForSelector('.search-results', { state: 'visible' });
// Validate what user sees
const patientCards = await page.locator('.patient-card').count();
expect(patientCards).toBeGreaterThan(0); // YES! UI shows results!

// Validate specific displayed data
const displayedNames = await page.locator('.patient-name').allTextContents();
expect(displayedNames).toContain('Maria Silva Santos');
```

### When to Use API Monitoring

```javascript
// ✅ GOOD USE: Debugging why UI isn't updating
const responsePromise = page.waitForResponse('/api/patient/search');
await page.click('#search-button');
const response = await responsePromise;

if (response.status() !== 200) {
  console.error('API failed:', response.status());
  // Now check how UI handles the error
  await expect(page.locator('.error-message')).toBeVisible();
  await expect(page.locator('.error-message')).toContainText('Erro ao buscar');
}
```

### Mock API Responses (When Needed)

```javascript
// Mock failing API for error testing
await page.route('**/api/patient/search', route => {
  route.fulfill({
    status: 500,
    body: JSON.stringify({ error: 'Internal Server Error' })
  });
});

// Test error handling
await patientSearch.search('test');
await expect(page.locator('.error-message')).toContainText('Erro ao buscar pacientes');
```

---

## 🖥️ UI Testing Patterns

### 🎯 CORE PRINCIPLE: Validate What Users See

**Every UI test must validate the actual user interface, not backend data or API responses.**

### Element Visibility and Content Validation

```javascript
// ✅ CORRECT - Validate actual UI elements and their content
// After performing an action, always validate the UI response

// Example: After searching for a patient
await page.fill('#search-input', 'Maria Silva');
await page.click('#search-button');

// 1. Validate loading states
await expect(page.locator('.loading-spinner')).toBeVisible();
await expect(page.locator('.loading-spinner')).toBeHidden();

// 2. Validate results are displayed
await expect(page.locator('.search-results')).toBeVisible();
const resultCount = await page.locator('.patient-card').count();
expect(resultCount).toBeGreaterThan(0);

// 3. Validate specific content
const firstResult = page.locator('.patient-card').first();
await expect(firstResult.locator('.patient-name')).toContainText('Maria Silva');
await expect(firstResult.locator('.patient-cpf')).toContainText('123.456.789-00');

// 4. Validate UI state indicators
await expect(page.locator('.results-counter')).toContainText(`${resultCount} pacientes encontrados`);

// ❌ WRONG - Don't just check if elements exist
await page.waitForSelector('#element'); // This only proves element exists, not that it's correct
```

### Form Submission and UI Feedback

```javascript
// ✅ CORRECT - Validate complete UI flow
async function testFormSubmission() {
  // Fill form
  await page.fill('#patient-name', 'João Silva');
  await page.fill('#patient-cpf', '123.456.789-00');
  
  // Submit
  await page.click('#submit-button');
  
  // Validate UI feedback - NOT API response!
  // 1. Check loading state
  await expect(page.locator('#submit-button')).toBeDisabled();
  await expect(page.locator('#submit-button .spinner')).toBeVisible();
  
  // 2. Check success state
  await expect(page.locator('.success-toast')).toBeVisible();
  await expect(page.locator('.success-toast')).toContainText('Paciente cadastrado com sucesso');
  
  // 3. Check form cleared or redirected
  await expect(page).toHaveURL('/patients/list');
  // OR
  await expect(page.locator('#patient-name')).toHaveValue('');
  
  // 4. Verify new patient appears in list
  await expect(page.locator(`text=João Silva`)).toBeVisible();
}
```

### Form Testing

```javascript
async fillAndValidateForm(formData) {
  // Fill form fields
  for (const [field, value] of Object.entries(formData)) {
    await this.page.fill(`#${field}`, value);
  }

  // Trigger validation
  await this.page.click('#submit');

  // Check validation messages
  if (formData.expectedErrors) {
    for (const error of formData.expectedErrors) {
      await expect(this.page.locator(error.selector)).toContainText(error.message);
    }
  }
}
```

### Dynamic Content

```javascript
// Wait for dynamic content to load
await page.waitForFunction(() => {
  const items = document.querySelectorAll('.list-item');
  return items.length > 0;
});

// Wait for specific text
await page.waitForSelector('text=Carregamento concluído');
```

---

## 🐛 Debugging Failed Tests

### Debug Strategies

1. **Use Debug Mode**
   ```bash
   npx playwright test --debug
   ```

2. **Add Console Logs**
   ```javascript
   page.on('console', msg => console.log('Browser log:', msg.text()));
   ```

3. **Capture Screenshots**
   ```javascript
   await page.screenshot({ path: 'debug.png', fullPage: true });
   ```

4. **Use Page Pause**
   ```javascript
   await page.pause(); // Pauses execution for debugging
   ```

5. **Check Network Activity**
   ```javascript
   page.on('request', request => console.log('>>', request.method(), request.url()));
   page.on('response', response => console.log('<<', response.status(), response.url()));
   ```

### Common Debug Scenarios

#### Scenario 1: Element Not Found
```javascript
// Debug why element isn't found
const elements = await page.locator('.my-selector').count();
console.log(`Found ${elements} elements with selector .my-selector`);

// Try different selectors
const alternativeSelectors = [
  '#id-selector',
  '[data-testid="my-element"]',
  'text=My Text'
];

for (const selector of alternativeSelectors) {
  const found = await page.locator(selector).count();
  console.log(`Selector "${selector}" found: ${found} elements`);
}
```

#### Scenario 2: Timing Issues
```javascript
// Add explicit waits for debugging
await page.waitForTimeout(1000); // Temporary for debugging
console.log('After 1s wait, checking element...');

// Check element state over time
for (let i = 0; i < 5; i++) {
  const isVisible = await element.isVisible();
  console.log(`Attempt ${i + 1}: Element visible = ${isVisible}`);
  await page.waitForTimeout(1000);
}
```

---

## ⚡ Performance & Optimization

### Test Performance Tips

1. **Parallel Execution**
   ```javascript
   // Run independent tests in parallel
   test.describe.parallel('Independent Tests', () => {
     test('test 1', async ({ page }) => { /* ... */ });
     test('test 2', async ({ page }) => { /* ... */ });
   });
   ```

2. **Reuse Authentication**
   ```javascript
   // Save auth state once, reuse in tests
   const authFile = 'playwright/.auth/user.json';
   
   // Setup auth once
   await page.context().storageState({ path: authFile });
   
   // Reuse in other tests
   const context = await browser.newContext({
     storageState: authFile
   });
   ```

3. **Optimize Waits**
   ```javascript
   // ❌ Bad - Fixed waits
   await page.waitForTimeout(5000);
   
   // ✅ Good - Conditional waits
   await page.waitForLoadState('networkidle');
   await page.waitForSelector('.content-loaded');
   ```

4. **Reduce Test Scope**
   ```javascript
   // Test only what's necessary
   test.skip(({ browserName }) => browserName !== 'chromium', 
     'Test only needed for Chromium');
   ```

---

## 📈 Test Execution & Reporting

### Execution Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test patient-search.spec.js

# Run tests matching pattern
npm test -- --grep "should search"

# Run with specific configuration
npm test -- --project="Desktop Chrome" --headed

# Run with retries
npm test -- --retries=2

# Generate and open HTML report
npm run test:report
```

### CI/CD Integration

```yaml
# .github/workflows/tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright
        run: npx playwright install --with-deps
        
      - name: Run tests
        run: npm test
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: |
            reports/
            screenshots/
            videos/
```

### Test Reports

1. **HTML Report**
   - Visual test results
   - Screenshots and videos
   - Detailed error traces

2. **JSON Report**
   - Machine-readable results
   - Integration with other tools
   - Metrics and statistics

3. **JUnit XML**
   - CI/CD integration
   - Test result tracking
   - Historical analysis

---

## 📋 Quick Reference Checklist

### Before Running Tests
- [ ] Backend running on port 3333
- [ ] Frontend running on port 8080
- [ ] Database accessible
- [ ] Test users exist in database
- [ ] Test data verified

### Writing New Tests
- [ ] Use Page Object pattern
- [ ] No hardcoded values
- [ ] Proper wait strategies
- [ ] Error handling included
- [ ] Screenshots on failure

### Test Review
- [ ] Tests are independent
- [ ] No false positives
- [ ] Reasonable execution time
- [ ] Clear failure messages
- [ ] Follows naming conventions

### Debugging Failed Tests
- [ ] Check server logs first
- [ ] Verify API endpoints work
- [ ] Test manually to confirm bug
- [ ] Use debug mode if needed
- [ ] Document findings

---

## 🚀 Conclusion

Following these comprehensive test instructions will help ensure:
- **Reliable Tests**: No false positives or flaky tests
- **Maintainable Code**: Easy to update and extend
- **Fast Feedback**: Quick test execution and clear reports
- **High Quality**: Catch bugs before production

Remember: Good tests are an investment in code quality and team productivity. Take the time to write them well!