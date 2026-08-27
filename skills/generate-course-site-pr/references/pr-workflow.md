# Safe pull-request workflow

## Repository checks

Run these before editing:

```bash
git remote get-url origin
git status --short --branch
git fetch origin main
```

Require an origin matching `PointBreaker/Pointbreaker.github.io` and inspect the complete worktree before editing. For a new course, require a clean, up-to-date `main`. For an existing-course maintenance task, preserve unrelated changes and use a separate worktree when task ownership is not clear; never stash or rewrite user work without permission.

Create a branch before generation:

```bash
git switch main
git pull --ff-only origin main
git switch -c course/<slug>
```

Never use `reset --hard`, `clean`, force push, or automatic merge. Direct `main` publication is allowed only when the user explicitly requests it for the reviewed maintenance change.

## Allowed diff

The normal PR may change only:

- `courses/<slug>/**`
- `courses.json`, only to add the new course record

Stop and review any other path. Keep `.course-build/`, original course resources, temporary extraction, screenshots, and local server artifacts out of the commit.

For an existing-course refresh, validators, shared course assets, and task-specific audit reports may also change when they are necessary to prevent the demonstrated regression. Review every such path explicitly before staging.

## Required validation

Run:

```bash
git diff --check
python3 <skill-root>/scripts/refresh_status.py --repo <repo> --slug <slug>
python3 <skill-root>/scripts/validate_course.py --repo <repo> --slug <slug> --plan <plan> --inventory <inventory> --strict-resources
python3 <repo>/tools/check-course-layout.py
```

Then test the static site in a browser. Check dashboard navigation, all page types, representative math/code, quizzes, console errors, and mobile layout.

## Commit and PR

Stage only the allowed paths:

```bash
git add -- courses.json courses/<slug>
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
- Network-restricted or inaccessible sources skipped for this build: ...

## Validation

- `validate_course.py`: pass
- `git diff --check`: pass
- Browser QA: dashboard, lecture, work item, mobile, quizzes, math
```

Use `gh pr create --base main --head course/<slug> --title "Add <courseCode> course guide" --body-file <file>`.

Return the PR URL. Do not merge it.

## Explicit direct publication

When the user explicitly asks to publish an existing-course maintenance change:

1. Re-run all relevant content, localization, syntax, layout, and diff checks.
2. Stage only reviewed task files and commit with a scoped message.
3. Push the current live branch without force.
4. Confirm the remote branch resolves to the new commit.
5. Poll a representative public HTML page with a cache-busting query until it references the new asset version.
6. Compare hashes for representative remote JavaScript/CSS assets with local files.
7. Check every changed page family, not only the first page.

Report publication complete only after the public site serves the new version. A successful push while the old page remains live is still an in-progress deployment.
