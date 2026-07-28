# Fintech Quality Engineering Platform

A production-grade quality engineering portfolio built around a synthetic digital lending platform. The repository demonstrates how an experienced SQA engineer approaches product risk, automation architecture, API contracts, cross-browser behavior, accessibility, diagnostics, CI quality gates, and release evidence.

## Engineering outcomes

- Risk-based coverage of authentication and loan lifecycle controls
- Independent API tests with typed clients, deterministic data factories, and cleanup
- Runtime API contract validation with JSON Schema
- Browser automation using semantic locators and reusable fixtures
- Cross-browser and mobile execution with Playwright
- Automated accessibility analysis with retained evidence
- CI separation between static analysis, API contracts, and browser smoke tests
- Scheduled regression execution and failure artifact retention
- OpenAPI documentation, traceability, architecture decisions, and release gates
- A self-contained synthetic system under test with no employer or customer data

## Reference architecture

```text
Tests
├── API lifecycle and business-rule checks
├── End-to-end customer and operations workflows
└── Accessibility checks
        │
Fixtures and orchestration
├── Playwright fixtures
├── Environment controls
└── Evidence and reporting
        │
Domain automation layer
├── Typed API clients
├── Runtime contracts
├── Page models
└── Deterministic data factories
        │
Synthetic lending platform
├── Authentication
├── Loan application API
├── State-transition controls
└── Responsive operations UI
```

Detailed rationale is documented in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Quality model

| Risk                                  | Verification                                | Gate         |
| ------------------------------------- | ------------------------------------------- | ------------ |
| Unauthorized access to loan data      | API and UI authentication tests             | Pull request |
| Invalid financial input accepted      | API validation tests                        | Pull request |
| Incorrect loan-state progression      | API lifecycle and negative transition tests | Pull request |
| Critical workflow broken in a browser | Cross-browser smoke tests                   | Pull request |
| Regression in broader workflows       | Tagged regression suite                     | Nightly      |
| Serious accessibility barrier         | axe scan with retained JSON evidence        | Regression   |
| Source-level vulnerability            | CodeQL and dependency updates               | Continuous   |

## Local execution

Requirements: Git and Node.js 20 or newer.

```bash
npm install
npx playwright install
npm run quality
```

The Playwright configuration automatically starts the synthetic lending platform at `http://127.0.0.1:4173`.

Useful commands:

```bash
npm run test:api            # API lifecycle, contracts, and risk rules
npm run test:e2e            # Chromium end-to-end suite
npm run test:cross-browser  # Chromium, Firefox, and WebKit
npm run test:mobile         # Mobile viewport execution
npm run test:a11y           # Accessibility analysis
npm run test:headed         # Visible browser execution
npm run test:debug          # Playwright Inspector
npm run report              # Open the HTML report
```

## Repository map

```text
.github/                 CI quality gates, nightly regression, CodeQL, templates
contracts/               OpenAPI contract
performance/             k6 performance smoke model
src/api/                 Typed service clients
src/contracts/           Runtime schemas and domain types
src/fixtures/            Test orchestration and dependency injection
src/pages/               Browser page models
src/test-data/           Deterministic synthetic data factories
sut/                     Self-contained synthetic lending application
 tests/                   API, end-to-end, and accessibility suites
 docs/                    Strategy, architecture, traceability, and evidence
```

## Public portfolio integrity

This repository uses an intentionally synthetic product and synthetic identities. It does not reproduce proprietary source code, endpoints, screenshots, customer records, or confidential business rules. Portfolio claims should describe only functionality that is committed and passing in CI.
