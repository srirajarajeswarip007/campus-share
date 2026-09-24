const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

async function runAuthTests() {
  let driver = await new Builder().forBrowser('chrome').build();
  console.log("=== PERSON 1: AUTHENTICATION MODULE TESTS ===");
  try {
    // Navigate to Login
    await driver.get('http://localhost:3000/#!/login');
    await driver.sleep(1000); // Wait for Angular to load
    
    // 1. UI/INTERFACE TEST
    let header = await driver.findElement(By.xpath("//h2[contains(text(), 'Welcome Back!')]"));
    assert.ok(await header.isDisplayed(), "Header should be visible");
    console.log("[UI Test] 'Welcome Back!' header is visible: PASSED");

    // 2. USABILITY TEST
    let emailInput = await driver.findElement(By.css('input[ng-model="loginData.email"]'));
    let placeholder = await emailInput.getAttribute('placeholder');
    assert.strictEqual(placeholder, 'student@campus.edu', "Email placeholder is incorrect");
    console.log("[Usability Test] Email placeholder is correct: PASSED");

    // 3. FUNCTIONAL TEST - Invalid Scenario (Verify Error Logic)
    await emailInput.sendKeys('invalid@campus.edu');
    let passInput = await driver.findElement(By.css('input[ng-model="loginData.password"]'));
    await passInput.sendKeys('wrongpass');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Assert error badge appears
    let errorBadge = await driver.wait(until.elementLocated(By.css('.badge-damaged')), 3000);
    let errorText = await errorBadge.getText();
    assert.ok(errorText.length > 0, "Error message should be displayed for invalid login");
    console.log("[Functional Test] Invalid login rejected correctly: PASSED");

    // 4. FUNCTIONAL TEST - Valid Scenario (Verify Successful Login Flow)
    await emailInput.clear();
    await emailInput.sendKeys('student@campus.edu');
    await passInput.clear();
    await passInput.sendKeys('student123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    // Assert redirection to dashboard
    await driver.wait(until.urlContains('/dashboard'), 3000);
    let currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes('/dashboard'), "Should redirect to dashboard on successful login");
    console.log("[Functional Test] Valid login successful and redirects: PASSED");

  } catch (err) {
    console.error("Test Failed due to Assertion Error:", err.message);
  } finally {
    await driver.quit();
  }
}
runAuthTests();