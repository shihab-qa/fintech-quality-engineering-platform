# Risk-to-Test Traceability

| ID      | Product risk / requirement                                              | Automated evidence                                 | Priority | Pipeline           |
| ------- | ----------------------------------------------------------------------- | -------------------------------------------------- | -------- | ------------------ |
| AUTH-01 | Authorized operations user can access the dashboard                     | `tests/e2e/authentication.spec.ts`                 | Critical | PR smoke           |
| AUTH-02 | Invalid credentials do not reveal account existence                     | `tests/e2e/authentication.spec.ts`                 | High     | Nightly regression |
| API-01  | Login response satisfies the published runtime contract                 | `tests/api/loan.lifecycle.spec.ts`                 | Critical | PR API             |
| LOAN-01 | Valid application is created as Draft                                   | `tests/api/loan.lifecycle.spec.ts`                 | Critical | PR API             |
| LOAN-02 | Non-positive amount is rejected                                         | `tests/api/loan.risk.spec.ts`                      | Critical | PR API             |
| FLOW-01 | Draft must be Submitted before Approved                                 | `tests/api/loan.risk.spec.ts`                      | Critical | PR API             |
| FLOW-02 | Operator creates and submits an application                             | `tests/e2e/loan.application.spec.ts`               | Critical | PR smoke           |
| A11Y-01 | Authenticated workspace has no serious or critical automated violations | `tests/accessibility/portal.accessibility.spec.ts` | High     | Nightly regression |
| PERF-01 | Health endpoint remains below defined p95 latency threshold             | `performance/loan-api-smoke.js`                    | Medium   | On demand          |
