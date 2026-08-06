# Safe pull-request workflow

## Repository checks

Run these before editing:

```bash
git remote get-url origin
git status --short --branch
git fetch origin main
```

Require an origin matching `PointBreaker/Pointbreaker.github.io`, a clean worktree, and an up-to-date `main`. If the user's main clone is dirty, create a separate git worktree rather than altering or stashing their changes without permission.

Create a branch before generation:

```bash
git switch main
git pull --ff-only origin main
git switch -c course/<slug>
```

Never use `reset --hard`, `clean`, force push, direct main push, or automatic merge.

## Allowed diff

The normal PR may change only:

- `<slug>/**`
- `courses.json`, only to add the new course record

Stop and review any other path. Keep `.course-build/`, original course resources, temporary extraction, screenshots, and local server artifacts out of the commit.

## Required validation

Run:

```bash
git diff --check
python <skill-root>/scripts/refresh_status.py --repo <repo> --slug <slug>
python <skill-root>/scripts/validate_course.py --repo <repo> --slug <slug> --plan <plan> --inventory <inventory> --strict-resources
```

Then test the static site in a browser. Check dashboard navigation, all page types, representative math/code, quizzes, console errors, and mobile layout.

## Commit and PR

Stage only the allowed paths:

```bash
git add -- courses.json <slug>
git diff --cached --check
git diff --cached --stat
git commit -m "Add <courseCode> course guide"
git push -u origin course/<slug>
```

Create a PR with a body similar to:

```markdown
## Course

- Course: ...
- Official homepage: ...
- Term/instructors: ...

## Generated content

- Lectures: N/N
- Homework/labs/projects: N/N
- Local source files inventoried: N
- Local source files mapped: N

## Source notes

- Primary sources used: ...
- Missing or ambiguous materials: ...
- Google Drive/Docs links skipped: ...

## Validation

- `validate_course.py`: pass
- `git diff --check`: pass
- Browser QA: dashboard, lecture, work item, mobile, quizzes, math
```

Use `gh pr create --base main --head course/<slug> --title "Add <courseCode> course guide" --body-file <file>`.

Return the PR URL. Do not merge it.
