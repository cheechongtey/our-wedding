---
name: playwright-testing
description: Runs and maintains Playwright end-to-end tests for this project. Use when the user asks to add browser tests, debug flaky UI tests, verify user flows, or run Playwright from the CLI.
---

# Playwright Testing

## When to use

Use this skill when the task includes:

- adding Playwright tests
- running browser E2E checks
- debugging failing UI flows
- capturing traces, screenshots, or videos from tests

## Setup checklist

1. Install dependencies:
   - `bun add -d @playwright/test`
2. Install browsers:
   - `bunx playwright install`
3. Initialize config if missing:
   - `bunx playwright init`

## Standard workflow

1. Start or build the app based on test mode.
2. Write tests in `tests/e2e/` using `*.spec.ts`.
3. Prefer stable selectors:
   - `getByRole`
   - `getByLabel`
   - `getByTestId` for dynamic UI
4. Run tests:
   - `bunx playwright test`
5. Debug failures:
   - `bunx playwright test --ui`
   - `bunx playwright test --headed`
   - `bunx playwright show-report`

## Reliability rules

- Avoid brittle CSS or nth-child selectors.
- Wait on user-visible states, not fixed sleeps.
- Keep each test independent and idempotent.
- Store shared helpers in `tests/e2e/helpers/`.
- Use `test.step()` for multi-stage journeys.

## Useful commands

```bash
# Run all tests
bunx playwright test

# Run one file
bunx playwright test tests/e2e/home.spec.ts

# Run one test by title
bunx playwright test -g "hero image rotates"

# Open interactive mode
bunx playwright test --ui

# Record trace on retry for debugging
bunx playwright test --trace on-first-retry
```

## Completion checks

Before finishing:

1. Confirm changed tests pass locally.
2. Verify no focused tests (`test.only`) remain.
3. Confirm snapshots/traces are intentional before committing.
