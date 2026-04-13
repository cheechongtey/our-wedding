---
name: project-cli-workflow
description: Executes and manages project CLI commands safely in this repository. Use when the user asks to run scripts, start dev servers, inspect command output, or validate changes from the terminal.
---

# Project CLI Workflow

## Purpose

Use this skill for terminal-driven tasks in this repository, especially with Bun and Next.js commands.

## Command strategy

1. Inspect current terminal state before starting long-running commands.
2. Reuse existing dev servers when possible.
3. Run commands in the correct working directory.
4. Report meaningful output, errors, and next actions.

## Common commands

```bash
# Dependency install
bun install

# Local development
bun run dev

# Production build
bun run build

# Start production server
bun run start
```

## Long-running process rules

- Use background execution for `dev` and watch commands.
- Monitor output until startup is confirmed or a clear failure appears.
- Do not spawn duplicate servers if one is already healthy.

## Troubleshooting flow

1. Reproduce with the smallest command possible.
2. Read the first actionable error line.
3. Fix root cause, then rerun the same command.
4. Confirm the fix with one successful run.

## Reporting format

When sharing results, include:

- command executed
- pass/fail outcome
- key logs or error summary
- concrete next step (if needed)
