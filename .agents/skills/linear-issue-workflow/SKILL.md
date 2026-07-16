---
name: linear-issue-workflow
description: Full issue development cycle driven by Linear. Use when the user says "pick an issue", "work on a linear issue", "implement a linear ticket", "ship a feature from linear", or any variant of wanting to start work from a Linear issue. Handles issue selection, optional grilling, planning, implementation, simplification, lint + tests, and opens the PR at the end.
---

# Linear Issue Workflow

End-to-end development cycle: pick a Linear issue → clarify requirements → plan → implement → verify → ship.

## Step 1 — Pick an issue

Use `mcp__linear-server__list_issues` to fetch open issues. Show a numbered list with ID, title, and priority. Ask the user which one to work on, or let them pass an issue ID directly.

Once selected, use `mcp__linear-server__get_issue` to load full details: description, acceptance criteria, labels, current status, and any linked comments.

## Step 1b — Move to In Progress

Check the issue's current status. If it is not already "In Progress" (or equivalent), use `mcp__linear-server__list_issue_statuses` to find the correct "In Progress" state ID for the team, then update the issue with `mcp__linear-server__save_issue` to set that state. Do this silently — no need to prompt the user, just confirm in one line that the card was moved.

## Step 1c — Create a git branch

Before branching, sync with the remote main branch so the new branch starts from up-to-date history — this avoids the branch silently carrying stale local commits that later collide with what actually lands on `main` (e.g. a previously unmerged stacked branch that gets merged via squash/rebase while you're still working, producing duplicate-content commits with different hashes and a conflicted PR down the line):

```bash
git fetch origin main
git checkout main
git rebase origin/main
```

If `git checkout main` reports local commits ahead of `origin/main` that don't belong to a merged PR, stop and ask the user before rebasing — don't silently drop work.

Then use the `gitBranchName` field from the issue (Linear pre-generates it) to check out a new branch from the now up-to-date `main`:

```bash
git checkout -b <gitBranchName> main
```

If the branch already exists locally, switch to it instead (`git checkout <gitBranchName>`) — but still fetch and rebase it onto `origin/main` first if it's based on an older commit, using the same reasoning: better to resolve drift early than to discover a conflicted PR at ship time. Confirm the active branch in one line before moving on.

## Step 1d — Fetch design spec (UI issues only)

Look at the issue title, description, and labels. If the issue involves any UI, visual, frontend, or component work, pull the current design spec directly from the project's Claude Design workspace — no need to ask the user for a URL:

1. Use `DesignSync` with `method: get_project` and `projectId: 18919df1-2f18-47c5-b3e3-3ced7de655a2` (the "Guillaume Naimi Portfolio Design System" Claude Design project) to confirm access is live.
2. Use `method: list_files` on that project ID to see what's available — components under `ui_kits/portfolio/` (`PageHome.jsx`, `PageCV.jsx`, `TopNav.jsx`, `ExperienceTimeline.jsx`, `EducationSection.jsx`, `ProjectShowcase.jsx`, `SkillsRadar.jsx`, `Primitives.jsx`, `Icons.jsx`, `data.js`, `styles.css`), design tokens (`colors_and_type.css`), and rendered reference views under `preview/` (colors, type, spacing, radii, shadows, components, iconography, brand).
3. Use `method: get_file` to pull only the files relevant to the issue's scope — don't dump the whole project into context, just the component(s) and token files that cover the area being changed.

Use the returned content as design context throughout planning and implementation — it is the source of truth for layout, spacing, tokens, and component behaviour.

If `DesignSync` isn't available in the current session (e.g. `ToolSearch` with `select:DesignSync` returns nothing), or if `get_project` fails (access revoked, project deleted or renamed), fall back to asking the user for the current Claude Design URL and fetching it with `WebFetch`.

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

## Step 6 — Simplify

Invoke `/simplify` to review the changed code (implementation + new tests) for reuse, simplification, efficiency, and convention cleanups, and apply the fixes it finds. This runs after tests exist so simplification can't accidentally drop coverage, and before the final verify pass so its fixes get checked by lint and tests too.

`/simplify` applies its fixes directly — it doesn't ask before editing. If it changes something non-trivial, mention it briefly in the final summary so the user isn't surprised by a diff they didn't review line-by-line.

## Step 7 — Verify

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

## Step 8 — Commit, push, and open the PR

Once lint and tests pass, ship it:

```bash
git add <changed files>
git commit -m "<type>(<scope>): <summary> (<ISSUE-ID>)"
git push -u origin <gitBranchName>
gh pr create --title "<type>(<scope>): <summary> (<ISSUE-ID>)" --body "..."
```

- Match the commit/PR title style of recent commits on the repo (check `git log --oneline -5` if unsure) — typically `type(scope): summary (ISSUE-ID)`.
- Stage only files relevant to this issue. If unrelated changes exist in the working tree (e.g. files dropped in by the user for another purpose), leave them untracked rather than sweeping them in.
- Write the PR body with a brief Summary and a Test plan checklist (lint/tests run, manual checks performed), following the repo's existing PR conventions.
- Report the PR URL back to the user as the final output of the workflow.
