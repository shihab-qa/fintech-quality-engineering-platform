# Flaky Test Policy

Retries provide diagnostics; they do not convert instability into success.

A test is considered flaky when identical code and environment produce inconsistent outcomes without a confirmed product change. A flaky test must be classified, assigned, and either fixed or quarantined with:

- the suspected failure mode;
- evidence from trace, logs, screenshots, and request IDs;
- an owner;
- an expiry date;
- a linked remediation issue.

Forbidden responses include increasing arbitrary timeouts, adding fixed sleeps, or leaving unexplained retries in the main quality gate.
