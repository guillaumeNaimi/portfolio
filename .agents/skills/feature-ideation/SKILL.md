---
name: feature-ideation
description: Brainstorm and prioritize new portfolio features with high recruiter ROI. Use when the user says "feature ideas", "what should I build next", "recruiter features", "what would impress recruiters", or wants to plan new portfolio work from a business-value angle.
---

# Feature Ideation — Recruiter ROI

Structured brainstorm: generate candidate features → grill each one → score by recruiter impact vs effort → create Linear issues for the winners.

## Context

This portfolio targets technical recruiters and hiring managers evaluating senior frontend candidates. High-ROI features are those that:

- **Reduce friction** — the recruiter understands the candidate's value faster
- **Create memorable moments** — something that sticks after closing the tab
- **Signal technical depth** — things only a strong frontend engineer would build
- **Drive action** — contact, CV download, scheduling an interview

Low-ROI features are: things every portfolio has, micro-polish the recruiter won't notice, or technically complex with no visible payoff.

## Step 1 — Scan current state

Briefly read the key feature areas of the codebase to understand what's already built:

```bash
find src/features -maxdepth 2 -name "*.tsx" | head -30
```

Use this to avoid suggesting features that already exist.

## Step 2 — Generate candidates

Propose a list of **8–12 candidate features** — a mix of small wins (< 1 day) and bigger bets. Think across these categories:

- **Credibility signals** (testimonials, open-source contributions, certifications, stats)
- **Engagement hooks** (interactive demos, live code snippets, before/after comparisons)
- **Recruiter convenience** (one-click CV download, calendar booking, availability indicator)
- **Technical showcase** (performance metrics, accessibility score, lighthouse badge)
- **Personalization** (locale-aware content, dark/light persistence, returning visitor greeting)
- **Discoverability** (SEO improvements, OG images, structured data)

Present them as a numbered list with a one-liner each. Ask:

> "Want to add any ideas before we evaluate them, or shall we start grilling?"

## Step 3 — Grill each feature

Go through each feature one by one. For each one, ask targeted questions to sharpen the idea and assess ROI. Cover these angles — **one question at a time**, provide your recommended answer before asking:

1. **Recruiter impact**: What specifically does the recruiter see or feel? Does it reduce friction, create a memorable moment, or signal depth?
2. **Effort**: Hours, days, or a week to build well? Any backend/DB/infra changes?
3. **Uniqueness**: Is this on every portfolio, or does it stand out?
4. **Dependency on external data**: Does it need a third-party API, account, or ongoing maintenance?

After 3–4 exchanges per feature, move on. If the user dismisses a feature quickly ("skip", "no", "not interesting"), note it as **Dropped** and continue without grilling it.

## Step 4 — Score and prioritize

After all features are evaluated, build a scoring table:

| # | Feature | Recruiter impact | Effort | Score |
|---|---------|-----------------|--------|-------|
| 1 | ... | High / Med / Low | S / M / L / XL | 🔴 Must / 🟠 High / 🟡 Med / 🟢 Nice |

**Scoring guide:**
- 🔴 **Must** — High impact + Small/Medium effort. Ship this immediately.
- 🟠 **High** — High impact + Large effort, OR Medium impact + Small effort.
- 🟡 **Med** — Medium impact + Medium/Large effort.
- 🟢 **Nice** — Low impact or XL effort. Backlog only.

Drop anything scored 🟢 unless the user explicitly wants to keep it.

Present the table and ask:
> "Does this priority order feel right? Any changes before I create the issues?"

Wait for confirmation before proceeding.

## Step 5 — Create Linear issues

For each confirmed feature (not Dropped, not 🟢 unless kept), create a Linear issue using `mcp__linear-server__save_issue`:

- **team**: fetch from `mcp__linear-server__list_teams` if not already known
- **title**: short, action-oriented verb phrase (e.g. "Add open-to-work availability banner to hero")
- **description**: structured markdown with:
  - **Why** — the recruiter use case in one sentence
  - **Acceptance criteria** — 2–4 checkboxes covering the happy path
  - **Effort estimate** — S / M / L / XL with a brief rationale
  - **Claude Design** — `**Required**` if the feature involves new or modified UI visible on the site (with a one-line note on what needs speccing); `**Not required**` if it's a README, config, or pure backend change
- **priority**: mapped from the score:
  - 🔴 Must → `2` (High)
  - 🟠 High → `2` (High)
  - 🟡 Med → `3` (Medium)
  - 🟢 Nice (kept) → `4` (Low)

After creating all issues, list them as:

```
✅ GUI-XX — [Title] (Priority: High) → <url>
✅ GUI-XX — [Title] (Priority: Medium) → <url>
...
```
