# MultiBank Automation — QA Coding Challenge

Playwright-based end-to-end test automation framework for [mb.io](https://mb.io/en), plus a standalone string algorithm solution (Task 2).

---

## Project Structure

```
multibank-automation/
├── src/
│   ├── pages/                  # Page Object Models
│   │   ├── BasePage.ts         # Shared navigation, consent handling
│   │   ├── HomePage.ts         # mb.io/en home page
│   │   ├── TradingPage.ts      # mb.io/en/explore — spot market
│   │   └── WhyMultibankPage.ts # mb.io/en/company
│   ├── tests/                  # All spec files
│   │   ├── navigation.spec.ts  # Header, nav links, hero (@navigation)
│   │   ├── trading.spec.ts     # Explore page, price table (@trading)
│   │   ├── content.spec.ts     # Company page content (@content)
│   │   └── stringFrequency.spec.ts  # Task 2 unit tests (@task2)
│   ├── data/                   # Test data
│   │   ├── navigationData.ts
│   │   ├── tradingData.ts
│   │   └── companyData.ts
│   └── reporters/
│       └── customReporter.ts
├── task2/
│   ├── stringFrequency.ts      # Task 2 implementation
│   └── README.md               # Task 2 documentation
├── reports/                    # Generated test output (gitignored)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9

---

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

---

## Running Tests

### All tests (Chromium)
```bash
# npm
npm test

# npx
npx playwright test --project=chromium
```

### All browsers
```bash
# npm
npm run test:all-browsers

# npx
npx playwright test
```

### By browser
```bash
# npm
npm run test:chromium
npm run test:firefox
npm run test:webkit

# npx
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### By tag
```bash
# npm
npm run test:navigation   # Header, nav links, hero section
npm run test:trading      # Explore page, spot market, price table
npm run test:content      # Company page content
npm run task2:test        # Task 2 — string frequency unit tests

# npx
npx playwright test --grep @navigation --project=chromium
npx playwright test --grep @trading --project=chromium
npx playwright test --grep @content --project=chromium
npx playwright test --grep @task2 --project=chromium
```

### Headed (visible browser)
```bash
# npm
npm run test:headed

# npx
npx playwright test --headed --project=chromium
```

### Debug mode
```bash
# npm
npm run test:debug

# npx
npx playwright test --debug --project=chromium
```

### Interactive UI mode
```bash
# npm
npm run test:ui

# npx
npx playwright test --ui
```

---

## Test Reports

Reports are generated automatically after each run.

```bash
# Open the HTML report
npx playwright show-report reports/html
```

Reports are written to:
- `reports/html/` — interactive HTML report
- `reports/results.json` — machine-readable JSON
- `reports/artifacts/` — screenshots and traces on failure

---

## Test Evidence

Screenshots from a full test run are available in [`test-artifacts/`](./test-artifacts/).

| File | Description |
|---|---|
| `terminal.png` | Terminal output showing all tests passing across browsers |
| `html.png` | Playwright HTML report showing test names, durations, and pass/fail status |

To regenerate the report locally:

```bash
# Run all browsers
npx playwright test

# Open the HTML report
npx playwright show-report reports/html
```

```bash
# Run with the default example ("hello world")
npx ts-node task2/stringFrequency.ts

# Run with a custom string
npx ts-node task2/stringFrequency.ts "your input here"

# Run Task 2 unit tests
npx playwright test --grep @task2 --project=chromium
```

---

## Architecture

### Page Object Model

Every page under test has a corresponding class in `src/pages/` that extends `BasePage`. All locators are defined as `readonly` class properties in the constructor. Test files contain only assertions and orchestration — no `page.locator()` calls.

### Test Data

Static test data lives in `src/data/`. Data files export typed constants (strings, arrays, regex patterns). Tests import data by name — no magic strings in spec files.

### Cross-browser

The Playwright config defines 5 browser profiles: Chromium, Firefox, WebKit, Pixel 5 (mobile Chrome), and iPhone 13 (mobile Safari). `npm run test:all-browsers` runs the full suite across all three desktop browsers.

### CI/CD

`.github/workflows/ci.yml` runs the full matrix on push to `main`/`develop` and on pull requests. HTML reports and failure screenshots are uploaded as artifacts (retained 14 days).

---

## Assumptions & Trade-offs

- **Base URL**: `https://mb.io/en` — the trading platform, not `trade.multibank.io`
- **No authentication**: All tests run against public pages only
- **Live data**: Price and percentage values are not asserted against fixed numbers — only format (regex) is validated
- **Retries**: 1 retry locally, 2 on CI to handle transient network flakiness
- **Recharts lazy rendering**: The chart test scrolls all rows into view before asserting, as Recharts only mounts SVGs when the container enters the viewport

---

## Extending the Framework

**Add a new page:**
1. Create `src/pages/NewPage.ts` extending `BasePage`
2. Export it from `src/pages/index.ts`
3. Add test data to `src/data/newPageData.ts`
4. Create `src/tests/newPage.spec.ts`

**Add a new test to an existing page:**
1. Add any new locators to the relevant page class
2. Add test data constants to the relevant data file
3. Add the `test()` block to the spec file