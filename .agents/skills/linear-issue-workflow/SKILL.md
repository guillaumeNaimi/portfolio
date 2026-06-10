---
name: linear-issue-workflow
description: Full issue development cycle driven by Linear. Use when the user says "pick an issue", "work on a linear issue", "implement a linear ticket", "ship a feature from linear", or any variant of wanting to start work from a Linear issue. Handles issue selection, optional grilling, planning, implementation, and runs lint + tests at the end.
---

# Linear Issue Workflow

End-to-end development cycle: pick a Linear issue → clarify requirements → plan → implement → verify.

## Step 1 — Pick an issue

Use `mcp__linear-server__list_issues` to fetch open issues. Show a numbered list with ID, title, and priority. Ask the user which one to work on, or let them pass an issue ID directly.

Once selected, use `mcp__linear-server__get_issue` to load full details: description, acceptance criteria, labels, current status, and any linked comments.

## Step 1b — Move to In Progress

Check the issue's current status. If it is not already "In Progress" (or equivalent), use `mcp__linear-server__list_issue_statuses` to find the correct "In Progress" state ID for the team, then update the issue with `mcp__linear-server__save_issue` to set that state. Do this silently — no need to prompt the user, just confirm in one line that the card was moved.

## Step 1c — Create a git branch

Use the `gitBranchName` field from the issue (Linear pre-generates it). Check out a new branch with that name:

```bash
git checkout -b <gitBranchName>
```

If the branch already exists locally, switch to it instead (`git checkout <gitBranchName>`). Confirm the active branch in one line before moving on.

## Step 1d — Fetch design spec (UI issues only)

Look at the issue title, description, and labels. If the issue involves any UI, visual, frontend, or component work, ask the user:

> "This looks like a UI change — the Claude Design URL changes with each version. Please share the current URL so I can fetch the latest spec."

Wait for the user to provide the URL. Once provided, fetch it and use the returned content as design context throughout planning and implementation — it is the source of truth for layout, spacing, tokens, and component behaviour. Update the Claude Design URL in memory with the URL the user provides.

If the issue clearly has no visual scope (e.g. a pure backend/data fix), skip this step silently.

## Step 2 — Assess clarity

Read the issue carefully. Ask yourself: are the requirements specific enough to write an implementation plan without guessing?

**If yes** — proceed to Step 3 directly.

**If no** — invoke `/grill-me` with a brief framing of what's ambiguous. The grilling session will surface hidden constraints and edge cases before you commit to a direction. Don't skip this step when requirements are genuinely underspecified; discovering ambiguity during implementation wastes far more time than clarifying upfront.

## Step 3 — Plan

Enter plan mode (`EnterPlanMode`) and produce a concrete implementation plan:

- Which files change and why
- The sequence of changes (order matters when there are dependencies)
- Any risky or irreversible decisions that need explicit user sign-off
- How to verify the change is correct (test coverage, manual steps)

Present the plan and wait for approval before writing any code. If the user requests changes to the plan, revise and re-present before proceeding.

## Step 4 — Implement

Exit plan mode and implement the approved plan. Follow the project's conventions exactly (see CLAUDE.md). Commit changes only if the user explicitly asks.

Work methodically through each step in the plan. If you discover something unexpected that would change the approach, pause and explain the situation rather than improvising silently.

## Step 5 — Write tests

After implementation, write tests for any new behaviour introduced. Use the conventions from CLAUDE.md:

- **Unit tests** (`*.unit.spec.tsx`) — pure logic with no DOM dependency (utility functions, data transforms, parsers). Run in Node.
- **Browser/component tests** (`*.browser.spec.tsx`) — components that need rendering (interactions, visual states). Run in Chromium via Playwright + vitest-browser-react.
- **E2E tests** (`e2e/*.spec.ts`) — user-visible flows (button present, navigation, form submission). Use `data-testid` selectors and Playwright.

Decide per-feature which types apply:
- New pure utility → unit test
- New UI component or significant interaction → browser test
- New visible feature (CTA, page, route) → E2E test
- New API route → E2E or integration test against the running server

Write the minimum tests that give real coverage of the happy path and one or two edge cases. Don't write tests for internal implementation details.

## Step 6 — Verify

Run linting and tests once implementation and tests are complete:

```bash
bun run lint
bun run test
```

Report results clearly:
- If both pass: summarise what was implemented and what the tests cover.
- If lint fails: fix the issues (they are usually trivial formatting or import order) and re-run.
- If tests fail: diagnose whether the failure is in new code or a pre-existing regression, and fix accordingly before reporting done.

Do not declare the task complete while lint or tests are failing.
