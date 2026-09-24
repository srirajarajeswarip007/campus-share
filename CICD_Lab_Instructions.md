# Experiment 11 – CI/CD Pipeline with GitHub Actions
## CampusShare MEAN Stack Application

> **Aim:** Set up an automated CI/CD pipeline using GitHub Actions that runs tests on every push and deploys the application automatically.

---

## What Has Already Been Done For You

These files have been created in your project automatically — you do not need to write them:

| File | Purpose |
|---|---|
| `tests/api.test.js` | Zero-dependency API test suite that `npm test` runs |
| `.github/workflows/ci.yml` | The GitHub Actions pipeline definition |
| `package.json` | Already updated with the `"test"` script |

---

## Step-by-Step Instructions

### PHASE 1 — Initial Setup on Your Machine

#### Step 1: Install Git (if not already installed)
1. Open your browser and go to: **https://git-scm.com/download/win**
2. Download and run the installer with all default settings.
3. Open a **new** terminal and verify:
   ```
   git --version
   ```

#### Step 2: Verify Your Project Works Locally
1. Open a terminal in `c:\STUDY\Year3\Web Tech Lab\campus-app`
2. Start your server:
   ```
   npm start
   ```
3. In a second terminal, run the new API tests to confirm they pass locally:
   ```
   npm test
   ```
4. You should see output like:
   ```
   CampusShare – API Test Suite
   ==============================
     ✓  GET /api/resources returns 200 and non-empty array
     ✓  POST /api/auth/login with valid credentials returns token
     ✓  POST /api/auth/login with invalid credentials returns 401
     ✓  POST /api/auth/register with missing fields returns error
     ✓  POST /api/auth/login as admin returns Admin role

   Results: 5 passed, 0 failed
   ```
5. Stop the server with `Ctrl + C`.

---

### PHASE 2 — Create a GitHub Repository

#### Step 3: Create a New Repository on GitHub
1. Open your browser and go to **https://github.com**
2. Log in to your account.
3. Click the **green "New"** button (top-left, next to your avatar).
4. Fill in the form:
   - **Repository name:** `campus-share`
   - **Visibility:** Public *(required for the Actions tab to show pipeline results)*
   - **Do NOT** tick "Add a README file" (you already have your project files)
5. Click **"Create repository"**
6. Copy the repository URL shown on the next page (it looks like `https://github.com/YOUR_USERNAME/campus-share.git`)

---

### PHASE 3 — Push Your Project to GitHub

#### Step 4: Initialize Git in Your Project
1. Open a terminal in `c:\STUDY\Year3\Web Tech Lab\campus-app`
2. Run each of these commands one at a time:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CampusShare MEAN stack app with CI/CD"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/campus-share.git
   git push -u origin main
   ```
   > **Replace** `YOUR_USERNAME` with your actual GitHub username.

3. GitHub will ask for your username and password (use a Personal Access Token as the password — see Step 4a below if you don't have one).

#### Step 4a: Get a GitHub Personal Access Token (if asked for password)
1. Go to **GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give it a name, set expiry to **90 days**, and tick the **"repo"** checkbox.
4. Click **Generate** and **copy the token immediately** (it is shown only once).
5. Use this token as your password when Git asks.

---

### PHASE 4 — Watch the CI Pipeline Run

#### Step 5: View the Automated Pipeline
1. Go to your GitHub repository in the browser.
2. Click the **"Actions"** tab at the top.
3. You will see a workflow run titled **"CI/CD Pipeline – CampusShare"** already running (triggered by your push).
4. Click on it to see the live progress of each step:
   - ✅ Checkout repository
   - ✅ Set up Node.js 20
   - ✅ Install dependencies
   - ✅ Start server in background
   - ✅ Run API Test Suite
5. When all steps go **green**, your CI pipeline is passing. 🎉

---

### PHASE 5 — Demonstrate a Failing Test (Required by the Lab)

#### Step 6: Introduce a Deliberate Failing Test
The lab instructions require you to show that a broken test correctly **blocks** the deploy job.

1. Open `tests/api.test.js` in your text editor.
2. Find this line inside `testValidLogin`:
   ```javascript
   assert.strictEqual(res.status, 200, 'Valid login should return HTTP 200');
   ```
3. Change `200` to `999` to force it to fail:
   ```javascript
   assert.strictEqual(res.status, 999, 'INTENTIONAL FAIL - for lab demo');
   ```
4. Save the file.
5. Push this broken version to GitHub:
   ```bash
   git add tests/api.test.js
   git commit -m "Experiment 11: Introduce failing test to demonstrate CI blocking"
   git push
   ```
6. Go to the **Actions** tab on GitHub.
7. You will see a **red ✗** on the new run. The **Deploy job will be skipped** because the test job failed.

---

### PHASE 6 — Fix the Test and Enable Deployment

#### Step 7: Fix the Broken Test
1. Open `tests/api.test.js` again.
2. Change `999` back to `200`:
   ```javascript
   assert.strictEqual(res.status, 200, 'Valid login should return HTTP 200');
   ```
3. Save the file and push:
   ```bash
   git add tests/api.test.js
   git commit -m "Experiment 11: Fix failing test - CI should go green again"
   git push
   ```
4. Go to the **Actions** tab on GitHub.
5. The pipeline turns **green ✅** again, and the **Deploy job now runs**.

---

### PHASE 7 — Result Summary for Lab Record

The complete workflow is defined in `.github/workflows/ci.yml`. It contains two jobs:

```
PUSH to main
    │
    ▼
┌─────────────────────┐
│   build-and-test    │  ← Runs on EVERY push to main
│  ─────────────────  │
│  1. Checkout code   │
│  2. Setup Node 20   │
│  3. npm install     │
│  4. Start server    │
│  5. npm test        │
└──────────┬──────────┘
           │ Only if ALL tests PASS
           ▼
┌─────────────────────┐
│       deploy        │  ← Runs only on main branch, after tests pass
│  ─────────────────  │
│  Trigger deploy     │
│  to hosting         │
└─────────────────────┘
```

---

### Test Result Table for Lab Record

| Test Case ID | Test Name | Type | Expected HTTP Status | Actual Result | CI Status |
|---|---|---|---|---|---|
| TC-01 | GET /api/resources | Functional | 200 + Array body | Returns 200 with 5 resources | ✅ PASSED |
| TC-02 | POST /api/auth/login (valid) | Functional | 200 + JWT token | Returns token and user object | ✅ PASSED |
| TC-03 | POST /api/auth/login (invalid) | Functional | 401 error | Returns 401 with message | ✅ PASSED |
| TC-04 | POST /api/auth/register (incomplete) | Functional | 400 error | Returns 4xx with message | ✅ PASSED |
| TC-05 | POST /api/auth/login as Admin | Functional | 200 + Admin role | Returns token, role = Admin | ✅ PASSED |
| TC-06 | Deliberately broken test | Negative | Should fail pipeline | Pipeline shows red ✗, deploy skipped | ✅ DEMONSTRATED |

---

### Files Created for This Experiment

| File | Description |
|---|---|
| [`tests/api.test.js`](tests/api.test.js) | CI-compatible API test suite (5 test cases) |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | GitHub Actions pipeline with MongoDB service, test, and deploy jobs |
| [`package.json`](package.json) | Updated with `"test": "node tests/api.test.js"` script |

---

> **Result:** A CI/CD pipeline that automatically tests and deploys the CampusShare application on every push to the main branch was successfully configured using GitHub Actions.
