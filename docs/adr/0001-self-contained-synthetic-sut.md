# ADR 0001: Use a Self-Contained Synthetic System Under Test

## Status
Accepted

## Context
A public QA portfolio must be reproducible and safe. External practice sites can change without notice, while employer systems and data cannot be published.

## Decision
Include a small synthetic digital lending platform in the repository and start it automatically through Playwright `webServer`.

## Consequences
- CI is deterministic and does not depend on third-party availability.
- Domain scenarios can demonstrate financial validation and workflow controls.
- The SUT is intentionally limited and must not be represented as a production lending product.
- Automation architecture remains portable to a real environment through base URL and environment configuration.
