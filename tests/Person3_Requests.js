const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

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
    
    // 1. UI/INTERFACE TEST
    assert.ok(await borrowBtn.isDisplayed(), "Borrow Item button should be visible on the page");
    console.log("[UI Test] Borrow Item button is visible: PASSED");
    
    await borrowBtn.click();
    await driver.sleep(1000);

    // 2. USABILITY TEST
    let submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    let isDisabled = await submitBtn.getAttribute('disabled');
    assert.ok(isDisabled, "Submit button should be strictly disabled until agreement is checked");
    console.log("[Usability Test] Submit button disabled until agreement checked: PASSED");

    // 3. FUNCTIONAL TEST - Valid Form Submission
    await driver.findElement(By.css('input[ng-model="borrowForm.purpose"]')).sendKeys('Selenium Automated Test Purpose');
    let checkbox = await driver.findElement(By.css('input[ng-model="borrowForm.agreementAccepted"]'));
    await checkbox.click(); 
    
    await submitBtn.click();
    
    // Wait for redirect to my-requests
    await driver.wait(until.urlContains('/my-requests'), 4000);
    let currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/my-requests'), "Functional form submission should route user to my-requests tracker");
    console.log("[Functional Test] Borrow request submitted successfully & redirected: PASSED");

  } catch (err) {
    console.error("Test Failed due to Assertion Error:", err.message);
  } finally {
    await driver.quit();
  }
}
runRequestTests();