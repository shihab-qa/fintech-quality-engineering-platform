# Automation Architecture

## Objective

Provide a maintainable verification platform where tests communicate business risk and orchestration while reusable implementation details remain in typed domain layers.

## Layer responsibilities

### Test specifications

Tests own scenario intent, risk, expected behavior, and evidence. They do not contain repeated authentication, raw selectors, or low-level request construction.

### Fixtures

Fixtures provide page models and API clients through Playwright dependency injection. They keep setup explicit and allow shared behavior to evolve without coupling test cases.

### API clients

Clients centralize routes, authentication headers, request methods, and response handling. They deliberately do not hide status assertions for negative testing.

### Runtime contracts

TypeScript protects compile-time consumers; JSON Schema validation verifies that runtime payloads still satisfy the expected contract.

### Page models

Page models represent stable user capabilities and page state. Assertions remain close to the behavior they verify without creating large all-purpose objects.

### Data factories

Factories create unique, synthetic domain data and support targeted overrides. Tests do not share persistent records.

## Key design constraints

- Test cases remain independently executable.
- No fixed delays or order dependence.
- Every created API record is removed in a `finally` block.
- Critical failures retain trace, screenshot, video, JUnit, HTML, and request-correlation evidence where applicable.
- Public test data cannot resemble real customer data.
