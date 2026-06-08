---
name: pr-review-loop
description: Review a pull request end-to-end and fix accepted issues in a loop until the user is satisfied. Use when the user says "review the PR", "review PR #N", "do a PR review", "review my changes", or any variant of wanting a thorough review of a pull request before merging.
---

# PR Review Loop

Iterative PR review cycle: review → show issues → user accepts/rejects → fix accepted → repeat.

## Step 1 — Identify the PR

If the user passed a PR number, use it. Otherwise infer from the current branch:

```bash
gh pr view --json number,title,url
```

Confirm the PR title and URL to the user in one line before proceeding.

## Step 1b — Fetch Linear issue context (optional)

Try to extract a Linear issue ID from the current branch name:

```bash
git branch --show-current
```

Look for a pattern like `gui-13`, `abc-42`, etc. (team prefix + dash + number). If found, use `mcp__linear-server__get_issue` to fetch the full issue: title, description, and any comments.

If no issue ID is found in the branch name, skip silently and proceed without Linear context.

## Step 1c — Fetch Vercel preview URL (optional)

Try to extract the Vercel preview URL from the PR's bot comments:

```bash
gh pr view <number> --json comments \
  --jq '.comments[] | select(.author.login == "vercel") | .body' \
  | grep -oP '\[Preview\]\(\K[^)]+' | head -1
```

If a URL is found, store it for Step 2b. If not, skip silently.

## Step 2 — Run the review

Spawn a `pr-reviewer` subagent to do a thorough review of the entire diff. Include the Linear issue context in the prompt if available:

```
Review PR #<N> at <url>. Examine the full diff — look for:
- Correctness bugs (logic errors, edge cases, broken invariants)
- Reuse/simplification opportunities (duplication, unnecessary complexity)
- Efficiency issues (wasteful patterns, missed built-ins)
- Convention violations (naming, structure, patterns used elsewhere in the codebase)

[If Linear context is available, add:]
This PR implements Linear issue <ID>: "<title>"
Issue description: <description>
Also verify: does the implementation fully satisfy what the issue asked for?
Flag any requirement from the issue that appears missing or only partially addressed.

Return a structured list of findings. For each finding include:
- severity: "bug" | "improvement" | "nit"
- file and line range (if applicable)
- a concise title (one line)
- explanation (2–4 sentences max)
- suggested fix (code snippet or description)
```

Wait for the subagent to finish before continuing.

## Step 2b — Visual verification (optional)

If a Vercel preview URL was found in Step 1c, invoke the `verify` skill to do a live smoke-test of the deployment. Pass the preview URL as context so the skill knows where to look.

The verify step should check:
- The feature the PR implements actually works as expected on the preview
- No obvious visual regressions on the affected pages (light **and** dark mode)
- No runtime errors in the console

Add any findings from the visual check to the overall findings list, tagged with severity `bug` or `improvement` as appropriate. Skip this step if no preview URL is available.

## Step 3 — Present findings

If the subagent found **no issues**, skip to Step 5.

Otherwise, display findings grouped by severity in this format:

```
### Bugs (must fix)
[1] file.ts:42 — Title of the issue
    Explanation of what's wrong and why it matters.
    Fix: what to do.

### Improvements
[2] file.ts:10 — Title
    ...

### Nits
[3] file.ts:88 — Title
    ...
```

Then ask: **"Which issues do you want me to fix? (e.g. '1 3', 'all', 'none', 'skip nits')"**

Wait for the user's answer before doing anything.

## Step 4 — Fix accepted issues

For each accepted issue, apply the fix directly in the working tree following the project's conventions (see CLAUDE.md). Do not commit unless the user asks.

After all fixes are applied, run:

```bash
bun run lint
bun run test
```

Fix any lint or test failures before continuing. Report what was fixed in a short summary.

## Step 5 — Loop or finish

After fixes (or if there were no issues), ask: **"Want me to run another review pass?"**

- If yes: go back to Step 2. Accumulate all findings across passes in memory.
- If no: go to Step 6.

## Step 6 — Post summary comment

Once the user is done, post a single summary comment on the PR using `gh pr comment`:

```bash
gh pr comment <number> --body "..."
```

The comment should follow this structure:

```markdown
## Review summary

### Issues found

| # | Severity | Location | Title | Outcome |
|---|----------|----------|-------|---------|
| 1 | Bug | file.ts:42 | Title | Fixed |
| 2 | Improvement | file.ts:10 | Title | Skipped |
| 3 | Nit | file.ts:88 | Title | Fixed |

### Changes applied
- Short description of each fix that was actually made.

_Reviewed by Claude Code — [pr-review-loop]_
```

If no issues were found across all passes, post: `"No issues found. ✓"`

After posting, remind the user to commit any fixes and push if they haven't already.
