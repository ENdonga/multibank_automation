# MultiBank QA Automation Framework

Production-grade Playwright + TypeScript automation framework for [trade.multibank.io](https://trade.multibank.io), covering Task 1 (Web UI Automation) and Task 2 (String Character Frequency) from the QA coding challenge.

---

## 📁 Project Structure

```
multibank-automation/
├── src/
│   ├── pages/                   # Page Object Model classes
│   │   ├── BasePage.ts          # Abstract base — shared helpers, smart waits
│   │   ├── HomePage.ts          # Landing page: nav, banners, download links
│   │   ├── TradingPage.ts       # Spot trading section & pair data
│   │   ├── WhyMultibankPage.ts  # About Us → Why MultiBank? page
│   │   └── index.ts             # Barrel export
│   ├── tests/                   # Test specifications
│   │   ├── navigation.spec.ts   # @navigation — nav bar, About Us, Why MultiBank
│   │   ├── trading.spec.ts      # @trading — trading pairs, categories
│   │   └── content.spec.ts      # @content — banners, App Store / Google Play links
│   ├── data/                    # External test data (no hard-coded assertions)
│   │   ├── navigationData.ts    # Expected nav items & component names
│   │   ├── tradingData.ts       # Trading categories & expected pairs
│   │   └── contentData.ts       # Banner counts, App Store URLs
│   ├── reporters/
│   │   └── customReporter.ts    # Markdown summary + coloured console output
│   └── utils/
│       └── stringFrequency.ts   # Task 2 — character frequency implementation
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions pipeline (multi-browser matrix)
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone <your-repo-url>
cd multibank-automation
npm install
npx playwright install --with-deps
```

### Run All Tests (Chromium by default)

```bash
npm test
```

### Run on a Specific Browser

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run All Browsers in Parallel

```bash
npm run test:all-browsers
```

### Run by Tag / Feature Area

```bash
npm run test:navigation   # @navigation tests only
npm run test:trading      # @trading tests only
npm run test:content      # @content tests only
```

### View HTML Report

```bash
npm run test:report
```

### Debug Mode (headed, step-by-step)

```bash
npm run test:debug
```

---

## 🧩 Architecture Decisions

### Page Object Model (POM)

Each page/feature area has its own class extending `BasePage`. This means:

- **Single responsibility** — each class owns one page's selectors and interactions
- **Reusability** — shared helpers live in `BasePage` (consent dismissal, smart waits, screenshots)
- **Maintainability** — selector changes are isolated to one file

### Smart Wait Strategy

All waits are event-driven — no `page.waitForTimeout()` is used in tests:

- `waitForLoadState('domcontentloaded')` + `document.readyState === 'complete'`
- `expect(locator).toBeVisible({ timeout })` for element waits
- `waitForResponse()` for API-triggered category switches
- Brief `300ms` settle wait only used after category tab clicks (dynamic list swap)

### External Test Data

All assertions reference `src/data/*.ts` files. When the site changes (e.g. a new nav item is added) you update a single data file, not every test.

### Resilient Selectors

Selectors use multiple fallback strategies (`[class*="..."]` + role-based + text-based) to reduce brittleness to minor DOM changes. The strictest match is tried first.

### Retry Strategy

- CI: 2 retries per test (catches transient flakiness)
- Local: 1 retry

---

## 🌐 Cross-Browser Testing

Five browser/device profiles are configured out-of-the-box:

| Project | Engine | Viewport |
|---------|--------|----------|
| chromium | Chrome | 1440×900 |
| firefox | Firefox | 1440×900 |
| webkit | Safari | 1440×900 |
| mobile-chrome | Chrome (Pixel 7) | 412×915 |
| mobile-safari | Safari (iPhone 14) | 390×844 |

---

## ♻️ CI/CD Pipeline

GitHub Actions runs a matrix build across Chromium, Firefox, and WebKit on every push and PR. A nightly cron job (`02:00 UTC`) catches regressions. Artifacts (HTML reports, failure screenshots) are uploaded and retained for 14 days.

---

## 📋 Task 2 — String Character Frequency

### Usage

```bash
# Run with default input "hello world"
npm run string-frequency

# Run with custom input
npx ts-node src/utils/stringFrequency.ts "your input here"

# Run built-in self-tests
RUN_TESTS=true npx ts-node src/utils/stringFrequency.ts
```

### Example

```
Input  : "hello world"
Output : h:1, e:1, l:3, o:2,  :1, w:1, r:1, d:1
```

### Assumptions

| Decision | Choice |
|----------|--------|
| Case sensitivity | Yes — `'a'` and `'A'` are separate characters |
| Whitespace | Counted — space/tab appear in output |
| Special characters | Counted — all Unicode is supported |
| Empty input | Returns `''` |

### Complexity

- **Time:** O(n) — single pass over the string
- **Space:** O(k) — where k is the number of unique characters

---

## 🛠 Extending the Framework

### Add a new page object

1. Create `src/pages/MyNewPage.ts` extending `BasePage`
2. Export it from `src/pages/index.ts`
3. Add test data to `src/data/` if needed
4. Write tests in `src/tests/myNewPage.spec.ts`

### Add a new test data set

Create a new file in `src/data/` and import it in the relevant test file. Never hard-code expected values inside test files.

---

## ⚠️ Known Trade-offs

- **Selector resilience vs. specificity** — broad `[class*="..."]` selectors are more resilient to CSS changes but may match unintended elements; `BasePage` uses `.first()` to mitigate this
- **Cookie consent** — dismissed generically; site-specific selectors would be more reliable but require updates if the consent library changes
- **Category API responses** — waited on optimistically; some category switches may be client-side only and won't fire a network event
