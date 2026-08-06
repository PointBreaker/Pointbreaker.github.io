# CourseStack v3 course-site contract

## Platform contract

- Repository: `PointBreaker/Pointbreaker.github.io`
- Base branch: `main`
- Required platform file: `site-platform.json`, version 3 or newer
- Course catalog: `courses.json`
- Course root: `courses/`
- Shared design assets: `assets/course/`
- Shared KaTeX and Prism assets: `assets/vendor/`
- Shared interactive runtime: `assets/course/interactive.css` and `assets/course/interactive.js`

Do not copy an existing course directory or duplicate vendor assets. New courses use the shared platform files.

The shared lesson shell also mounts the repository's Giscus discussion drawer from `site-comments.json`. On desktop the drawer reserves a right-side reading column instead of covering lesson content; on narrow screens it becomes a dedicated full-screen panel. The shared configuration places the comment composer below the discussion thread. Course generators must not embed a second comment provider or create per-course comment configuration.

## Course plan schema

```json
{
  "courseCode": "CS101",
  "course": "CS101: Example Course",
  "shortTitle": "Example Course",
  "titleZh": "示例课程",
  "slug": "cs101",
  "university": "Example University",
  "instructors": ["Ada Example"],
  "term": "Spring 2026",
  "homepage": "https://example.edu/cs101/",
  "sourceLabel": "CS101 official homepage",
  "domain": "Computer systems",
  "domainKey": "computer-systems",
  "summary": "A concise catalog description grounded in the course scope.",
  "tags": ["Systems", "C", "Concurrency"],
  "accent": "#1677a6",
  "workItemLabel": "Labs",
  "language": "中文深度讲义",
  "lectures": [
    {
      "number": 1,
      "date": "2026-01-12",
      "title": "Introduction",
      "instructor": "Ada Example",
      "slug": "introduction",
      "sourceFiles": ["slides/lecture01.pdf"],
      "visuals": [
        {
          "id": "gradient-descent-curve",
          "kind": "function-plot",
          "learningGoal": "Understand how learning rate changes the update trajectory.",
          "sourceFiles": ["slides/lecture01.pdf"],
          "reason": "The source compares the same loss under multiple parameter values."
        }
      ]
    }
  ],
  "workItems": [
    {
      "number": 1,
      "kind": "Lab",
      "title": "Warm-up",
      "released": "2026-01-12",
      "due": "2026-01-19",
      "description": "Set up the environment and complete the warm-up.",
      "dependsOn": [1],
      "slug": "warm-up",
      "sourceFiles": ["labs/lab1.pdf"]
    }
  ]
}
```

Rules:

- Use positive integer lecture and work-item numbers.
- Use ISO dates when known and empty strings when unknown.
- Keep every `sourceFiles` path relative to the source-resource folder.
- Use unique numbers and valid `dependsOn` targets.
- Use `kind` such as `Assignment`, `Homework`, `Lab`, `Project`, `Exam`, or `Module`.
- If no graded work exists, create meaningful `Module` groups.
- Keep the catalog summary concise and factual. Use 3–6 tags.
- Choose an accessible accent color that remains legible on light and dark surfaces.
- Use `visuals` only for source-backed learning needs. Use a lowercase hyphenated `id` and a supported kind from `interactive-content.md`; omit unjustified visuals.

## Generated tree

```text
courses/<slug>/
├── index.html
├── course-info.json
├── api/status.json
├── figures/
│   └── <visual-id>-fallback.svg
├── interactives/
│   └── <visual-id>.json
└── lessons/
    ├── 0001-<slug>.html
    └── assignments/
        └── ass01-<slug>.html
```

The Dashboard reads `course-info.json` and `api/status.json`. The homepage reads `courses.json`. Content pages load shared assets from the repository root.

## Content page contract

Each lecture and work-item page must:

- Declare Chinese language, UTF-8, viewport, a descriptive title, and exactly one `h1`.
- Load shared base, lesson, interactive, KaTeX, Prism, math-render, quiz, and lesson-UI assets using correct relative paths.
- Use semantic headings with stable IDs.
- Use only `\(...\)` and `\[...\]` for math.
- Put code inside escaped `<pre><code class="language-...">` blocks.
- Give each quiz a unique `data-quiz` and a valid container `data-answer`.
- Give every interactive a course-local JSON spec and exactly one static fallback image with meaningful alt text. Use only Interactive v1 kinds documented in `references/interactive-content.md`.
- Include a primary-source reference section.
- Contain no placeholder, Drive/Docs URL, remote font dependency, or unsupported dollar math.

## Catalog contract

Append exactly one object to `courses.json` with `path` set to `courses/<slug>/`. Do not edit root `index.html`; it renders the catalog from JSON. Keep course IDs and paths unique, and never create a root-level `<slug>/` course directory.
