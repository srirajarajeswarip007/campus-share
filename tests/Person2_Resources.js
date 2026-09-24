const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

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
    assert.ok(await header.isDisplayed(), "Browse Resources header should be visible");
    console.log("[UI Test] Browse Resources header is visible: PASSED");

    // 2. USABILITY TEST
    let searchInput = await driver.findElement(By.css('input[ng-model="searchQuery"]'));
    let placeholder = await searchInput.getAttribute('placeholder');
    assert.ok(placeholder.includes('Search title'), "Search placeholder is missing expected helpful text");
    console.log("[Usability Test] Search placeholder is helpful: PASSED");

    // 3. FUNCTIONAL TEST - Valid Search
    await searchInput.sendKeys('Camera');
    await driver.sleep(1000); // Wait for Angular filter to process
    let items = await driver.findElements(By.xpath("//strong[contains(text(), 'Camera')]"));
    assert.ok(items.length > 0, "Functional search for 'Camera' should return at least 1 item");
    console.log("[Functional Test] Searching for 'Camera' filters correctly: PASSED");

    // 4. FUNCTIONAL TEST - Invalid Search
    await searchInput.clear();
    await searchInput.sendKeys('NonExistentItem999');
    await driver.sleep(1000);
    let noItems = await driver.findElements(By.xpath("//strong[contains(text(), 'NonExistentItem999')]"));
    assert.strictEqual(noItems.length, 0, "Functional search for invalid item should return exactly 0 results");
    console.log("[Functional Test] Searching for invalid item returns empty list: PASSED");

  } catch (err) {
    console.error("Test Failed due to Assertion Error:", err.message);
  } finally {
    await driver.quit();
  }
}
runResourceTests();