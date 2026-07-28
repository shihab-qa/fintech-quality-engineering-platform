# Quality engineering working agreement

This repository is a public, production-grade quality engineering portfolio. Its visible code and documentation must demonstrate mature engineering judgment, not tutorial-style implementation.

## Engineering rules

- Use TypeScript and Playwright Test for browser and API automation.
- Preserve clear boundaries between tests, fixtures, page models, API clients, contracts, data factories, and configuration.
- Design every automated check around an explicit product risk or contract.
- Prefer deterministic, isolated tests with owned setup and cleanup.
- Do not create dependencies between test cases or rely on execution order.
- Prefer accessible roles, labels, and stable test IDs. Never use brittle selectors when a stable semantic locator is available.
- Never add fixed sleeps. Use observable application state, network responses, or Playwright auto-waiting.
- Validate response status, business behavior, and runtime contract for critical APIs.
- Attach useful diagnostics for failures while avoiding secrets and personal data.
- Keep all data synthetic. Never add employer URLs, credentials, tokens, customer records, screenshots, or proprietary business rules.
- Update architecture, traceability, and decision records when behavior or structure changes.
- A change is incomplete until formatting, linting, typecheck, and the smallest relevant test suite pass.

## Codex execution protocol

1. Read the relevant source, tests, architecture, and traceability before editing.
2. State the risk being addressed and the intended verification layer.
3. Make the smallest coherent change that solves the task.
4. Run focused validation first, then broader validation when architecture or shared fixtures changed.
5. Summarize files changed, design decisions, commands executed, results, and remaining risks.
6. Do not describe the repository author as a beginner or add tutorial language to public files.
