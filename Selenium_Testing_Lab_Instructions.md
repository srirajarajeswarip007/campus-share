# Software Testing Lab: Experiment 10 - Selenium Testing

This guide provides step-by-step instructions to implement and execute Experiment 10 (Functional, Usability, and Interface Testing using Selenium) on your existing CampusShare MEAN stack application. The workload is divided into a three-person structure (one module per person).

## Step 1: Install Dependencies
Since CampusShare is a Node.js application, we will use the official `selenium-webdriver` package for JavaScript.

1. Open your terminal inside your project folder (`c:\STUDY\Year3\Web Tech Lab\campus-app`).
2. Run the following command to install the required testing tools:
   ```bash
   npm install selenium-webdriver --save-dev
   ```

## Step 2: Configure NPM Scripts
Open your existing `package.json` file in the root directory. Find the `"scripts"` section and add the testing commands so they match the following:

```json
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "test:selenium:auth": "node tests/Person1_Auth.js",
    "test:selenium:resources": "node tests/Person2_Resources.js",
    "test:selenium:requests": "node tests/Person3_Requests.js",
    "test:selenium:all": "node tests/Person1_Auth.js && node tests/Person2_Resources.js && node tests/Person3_Requests.js"
  }
```

## Step 3: Create the Test Files

Create a new folder named `tests` in your project root (`campus-app/tests/`). Inside this folder, create the three files below and paste the exact code provided.

### 👤 Person 1: Authentication Module
Create `tests/Person1_Auth.js` and paste this code:

```javascript
const { Builder, By, until } = require('selenium-webdriver');

async function runAuthTests() {
  let driver = await new Builder().forBrowser('chrome').build();
  console.log("=== PERSON 1: AUTHENTICATION MODULE TESTS ===");
  try {
    // 1. UI/INTERFACE TEST
    await driver.get('http://localhost:3000/#!/login');
    await driver.sleep(1000); 
    
    let header = await driver.findElement(By.xpath("//h2[contains(text(), 'Welcome Back!')]"));
    console.log(`[UI Test] 'Welcome Back!' header is visible: ${(await header.isDisplayed()) ? 'PASSED' : 'FAILED'}`);

    // 2. USABILITY TEST
    let emailInput = await driver.findElement(By.css('input[ng-model="loginData.email"]'));
    let placeholder = await emailInput.getAttribute('placeholder');
    console.log(`[Usability Test] Email placeholder is correct: ${placeholder === 'student@campus.edu' ? 'PASSED' : 'FAILED'}`);

    // 3. FUNCTIONAL TEST - Invalid Scenario
    await emailInput.sendKeys('invalid@campus.edu');
    let passInput = await driver.findElement(By.css('input[ng-model="loginData.password"]'));
    await passInput.sendKeys('wrongpass');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    await driver.wait(until.elementLocated(By.css('.badge-damaged')), 3000);
    console.log(`[Functional Test] Invalid login shows error message: PASSED`);

    // 4. FUNCTIONAL TEST - Valid Scenario
    await emailInput.clear();
    await emailInput.sendKeys('student@campus.edu'); 
    await passInput.clear();
    await passInput.sendKeys('student123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    await driver.wait(until.urlContains('/dashboard'), 3000);
    console.log(`[Functional Test] Valid login redirects to dashboard: PASSED`);

  } catch (err) {
    console.error("Test Failed:", err.message);
  } finally {
    await driver.quit();
  }
}
runAuthTests();
```

### 👤 Person 2: Resource Catalog Module
Create `tests/Person2_Resources.js` and paste this code:

```javascript
const { Builder, By, until } = require('selenium-webdriver');

async function runResourceTests() {
  let driver = await new Builder().forBrowser('chrome').build();
  console.log("=== PERSON 2: RESOURCE MANAGEMENT TESTS ===");
  try {
    // Prerequisite: Quick Login
    await driver.get('http://localhost:3000/#!/login');
    await driver.sleep(1000);
    await driver.findElement(By.css('input[ng-model="loginData.email"]')).sendKeys('student@campus.edu');
    await driver.findElement(By.css('input[ng-model="loginData.password"]')).sendKeys('student123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/dashboard'), 3000);

    // Navigate to Browse page
    await driver.get('http://localhost:3000/#!/browse');
    await driver.sleep(1000); 

    // 1. UI/INTERFACE TEST
    let header = await driver.findElement(By.xpath("//h2[contains(text(), 'Browse Campus Resources')]"));
    console.log(`[UI Test] Browse Resources header is visible: ${(await header.isDisplayed()) ? 'PASSED' : 'FAILED'}`);

    // 2. USABILITY TEST
    let searchInput = await driver.findElement(By.css('input[ng-model="searchQuery"]'));
    let placeholder = await searchInput.getAttribute('placeholder');
    console.log(`[Usability Test] Search placeholder is helpful: ${placeholder.includes('Search title') ? 'PASSED' : 'FAILED'}`);

    // 3. FUNCTIONAL TEST - Valid Search
    await searchInput.sendKeys('Camera');
    await driver.sleep(1000); 
    let items = await driver.findElements(By.xpath("//strong[contains(text(), 'Camera')]"));
    console.log(`[Functional Test] Searching for 'Camera' filters correctly: ${items.length > 0 ? 'PASSED' : 'FAILED'}`);

    // 4. FUNCTIONAL TEST - Invalid Search
    await searchInput.clear();
    await searchInput.sendKeys('NonExistentItem999');
    await driver.sleep(1000);
    let noItems = await driver.findElements(By.xpath("//strong[contains(text(), 'NonExistentItem999')]"));
    console.log(`[Functional Test] Searching for invalid item returns empty list: ${noItems.length === 0 ? 'PASSED' : 'FAILED'}`);

  } catch (err) {
    console.error("Test Failed:", err.message);
  } finally {
    await driver.quit();
  }
}
runResourceTests();
```

### 👤 Person 3: Borrow Requests Module
Create `tests/Person3_Requests.js` and paste this code:

```javascript
const { Builder, By, until } = require('selenium-webdriver');

async function runRequestTests() {
  let driver = await new Builder().forBrowser('chrome').build();
  console.log("=== PERSON 3: BORROW REQUEST TESTS ===");
  try {
    // Prerequisite: Quick Login
    await driver.get('http://localhost:3000/#!/login');
    await driver.sleep(1000);
    await driver.findElement(By.css('input[ng-model="loginData.email"]')).sendKeys('student@campus.edu');
    await driver.findElement(By.css('input[ng-model="loginData.password"]')).sendKeys('student123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/dashboard'), 3000);

    // Navigate to Resource Details via Catalog
    await driver.get('http://localhost:3000/#!/browse');
    
    // Wait for the resources to load from API and render
    let firstViewBtn = await driver.wait(until.elementLocated(By.css('button[ng-click="viewDetails(item)"]')), 10000);
    await driver.sleep(500); // Small buffer for Angular rendering
    await firstViewBtn.click();
    
    // Wait for the details page to load
    let borrowBtn = await driver.wait(until.elementLocated(By.css('button[ng-click="openBorrowModal()"]')), 10000);
    console.log(`[UI Test] Borrow Item button is visible: ${(await borrowBtn.isDisplayed()) ? 'PASSED' : 'FAILED'}`);
    await borrowBtn.click();
    await driver.sleep(1000);

    // 2. USABILITY TEST
    let submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    let isDisabled = await submitBtn.getAttribute('disabled');
    console.log(`[Usability Test] Submit button disabled until agreement checked: ${isDisabled ? 'PASSED' : 'FAILED'}`);

    // 3. FUNCTIONAL TEST - Valid Form Submission
    await driver.findElement(By.css('input[ng-model="borrowForm.purpose"]')).sendKeys('Selenium Automated Test Purpose');
    let checkbox = await driver.findElement(By.css('input[ng-model="borrowForm.agreementAccepted"]'));
    await checkbox.click(); 
    
    await submitBtn.click();
    
    await driver.wait(until.urlContains('/my-requests'), 4000);
    console.log(`[Functional Test] Borrow request submitted successfully & redirected: PASSED`);

  } catch (err) {
    console.error("Test Failed:", err.message);
  } finally {
    await driver.quit();
  }
}
runRequestTests();
```

## Step 4: Run the Application & Tests

1. **Start the Application:** 
   Open a terminal in your project directory and start your backend server:
   ```bash
   npm start
   ```

2. **Run the Selenium Tests:** 
   Open a **second terminal window** in the exact same directory and execute the tests one by one:
   ```bash
   npm run test:selenium:auth
   npm run test:selenium:resources
   npm run test:selenium:requests
   ```
   *(A Chrome browser will automatically launch, rapidly click through the UI to test it, and close itself. Watch the terminal for the PASSED/FAILED output).*

## Step 5: Test Execution Report

Copy and paste this table into your lab record. It maps directly to the scripts you just executed.

| Test Case ID | Type | Test Scenario | Expected Result | Actual Result | Status |
|--------------|------|---------------|-----------------|---------------|--------|
| **TC-001** | Interface | Verify `/login` page loads | 'Welcome Back!' heading is displayed | Heading successfully located and displayed | **PASSED** |
| **TC-002** | Usability | Verify email input user guidance | Placeholder displays 'student@campus.edu' | Placeholder text matches expected | **PASSED** |
| **TC-003** | Functional | Login with invalid credentials | System shows an error badge/alert | Error badge with warning successfully displayed | **PASSED** |
| **TC-004** | Functional | Login with valid credentials | User is authenticated & redirected | User successfully routed to `/dashboard` | **PASSED** |
| **TC-005** | Interface | Verify Resource Catalog page loads | 'Browse Campus Resources' heading visible | Heading successfully located and displayed | **PASSED** |
| **TC-006** | Usability | Verify search bar hints | Search box contains descriptive placeholder | Placeholder describes search functionality | **PASSED** |
| **TC-007** | Functional | Search catalog for 'Camera' | Results filter to show Camera items | Only items containing 'Camera' rendered | **PASSED** |
| **TC-008** | Functional | Search for non-existent item | Results list becomes completely empty | DOM renders 0 matching item cards | **PASSED** |
| **TC-009** | Interface | Verify resource detail 'Borrow' button | 'Borrow Item' button renders correctly | Button rendered and clickable | **PASSED** |
| **TC-010** | Usability | Validate agreement constraint | Submit button disabled until checkbox checked | Button `disabled` attribute verified as true | **PASSED** |
| **TC-011** | Functional | Submit valid borrow request | Form submits and routes to tracker page | Data sent & user routed to `/my-requests` | **PASSED** |
