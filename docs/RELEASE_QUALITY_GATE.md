# Release Quality Gate

## Required signals

- Formatting, linting, and TypeScript compilation pass.
- API lifecycle, contract, validation, and state-transition tests pass.
- Chromium, Firefox, and WebKit critical smoke tests pass.
- Nightly regression has no unexplained failure.
- No unresolved Critical or High severity defect without documented risk acceptance.
- HTML/JUnit reports and failure diagnostics are available from CI.
- Traceability reflects new or changed product risk.

## Failure policy

A failed test blocks the gate until one of the following is demonstrated:
- a reproducible product defect is recorded;
- an automation defect is fixed and validated;
- an environmental incident is evidenced and the test is rerun successfully;
- an approved, time-bounded quarantine is documented with ownership and removal criteria.
