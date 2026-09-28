// Simple API test for CI/CD pipeline
// Tests core API endpoints without needing a running MongoDB or browser
// Uses Node's built-in assert module - no extra dependencies required

const assert = require('assert');
const http = require('http');

// ─── Helper: make an HTTP request ─────────────────────────────────────────
function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─── Shared test state ──────────────────────────────────────────────────────
const HOST = 'localhost';
const PORT = process.env.PORT || 3000;
let passed = 0;
let failed = 0;

function pass(name) { console.log(`  ✓  ${name}`); passed++; }
function fail(name, err) { console.error(`  ✗  ${name}: ${err.message}`); failed++; }

// ─── FUNCTIONAL TESTS ───────────────────────────────────────────────────────
async function testApiReturnsResources() {
  const res = await request({ host: HOST, port: PORT, path: '/api/resources', method: 'GET' });
  assert.strictEqual(res.status, 200, 'GET /api/resources should return HTTP 200');
  assert.ok(Array.isArray(res.body), 'Response body should be an array');
  assert.ok(res.body.length > 0, 'Should return at least one seeded resource');
  pass('GET /api/resources returns 200 and non-empty array');
}

async function testValidLogin() {
  const res = await request(
    { host: HOST, port: PORT, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'student@campus.edu', password: 'student123' }
  );
  assert.strictEqual(res.status, 999, 'INTENTIONAL FAIL - for lab demo');
  assert.ok(res.body.token, 'Login response should contain a JWT token');
  assert.ok(res.body.user, 'Login response should contain a user object');
  assert.strictEqual(res.body.user.role, 'Student', 'Logged in user role should be Student');
  pass('POST /api/auth/login with valid credentials returns token');
}

async function testInvalidLogin() {
  const res = await request(
    { host: HOST, port: PORT, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'invalid@campus.edu', password: 'wrongpassword' }
  );
  assert.strictEqual(res.status, 400, 'Invalid login should return HTTP 400');
  assert.ok(res.body.message, 'Error response should contain a message field');
  pass('POST /api/auth/login with invalid credentials returns 400');
}

async function testRegisterWithMissingFields() {
  const res = await request(
    { host: HOST, port: PORT, path: '/api/auth/register', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'incomplete@campus.edu' }
  );
  assert.ok(res.status >= 400, 'Register with missing fields should return a 4xx error');
  pass('POST /api/auth/register with missing fields returns error');
}

async function testAdminLogin() {
  const res = await request(
    { host: HOST, port: PORT, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'admin@campus.edu', password: 'admin123' }
  );
  assert.strictEqual(res.status, 200, 'Admin login should return HTTP 200');
  assert.strictEqual(res.body.user.role, 'Admin', 'Logged in user role should be Admin');
  pass('POST /api/auth/login as admin returns Admin role');
}

// ─── Run all tests ──────────────────────────────────────────────────────────
(async () => {
  console.log('\nCampusShare – API Test Suite');
  console.log('==============================');
  const tests = [
    testApiReturnsResources,
    testValidLogin,
    testInvalidLogin,
    testRegisterWithMissingFields,
    testAdminLogin,
  ];

  for (const t of tests) {
    try { await t(); }
    catch (err) { fail(t.name, err); }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0); // Exit code 1 = CI fails, 0 = CI passes
})();
