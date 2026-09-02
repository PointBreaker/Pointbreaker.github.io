# CourseStack Interactive v1

## Contents

1. Selection rules
2. Asset and markup contract
3. Function plot schema
4. Matrix heatmap schema
5. Stepper schema
6. Static diagrams
7. Safety, accessibility, and performance
8. Validation checklist

## Selection rules

Create a visual only when it materially reduces the effort required to understand a relationship, state change, geometry, or comparison. Do not add decorative charts, generic AI art, or an interactive control that merely repeats prose.

Prefer these forms:

- Use semantic HTML/CSS for responsive object maps, ownership trees, paired comparisons, stage flows, and architecture diagrams that fit the site's visual language.
- Use a source-backed static SVG for architecture, topology, dataflow, tensor shape, or a fixed derivation map.
- Use `function-plot` when one or more parameters change a curve, optimum, boundary, loss surface slice, probability density, scaling law, or resource estimate.
- Use `matrix-heatmap` for attention, confusion matrices, cache states, adjacency, correlation, transition weights, or other two-dimensional values. Use frames when the matrix changes across heads, layers, time, or algorithm steps.
- Use `stepper` when a learner benefits from advancing through an algorithm, proof, pipeline, state machine, schedule, or formula derivation one stage at a time.
- Keep executable code examples as code. Do not turn every algorithm into a simulator.
- Use ASCII only for compact inline pipelines, transcripts, or terminal-like examples. Replace large ASCII framework diagrams when spatial relationships are part of the lesson.

Choose candidates while building the course plan. Record an optional `visuals` array on each lecture or work item with `id`, `kind`, `learningGoal`, `sourceFiles`, and `reason`. Omit the array when no visualization is justified.

## Asset and markup contract

Store course-owned assets under:

```text
courses/<slug>/
├── figures/
│   └── <visual-id>-fallback.svg
└── interactives/
    └── <visual-id>.json
```

Embed an interactive using a relative JSON path and exactly one visible static fallback:

```html
<figure class="course-interactive"
        data-interactive-src="../interactives/quadratic-loss.json"
        aria-busy="true">
  <img class="course-interactive-fallback"
       src="../figures/quadratic-loss-fallback.svg"
       alt="不同学习率下二次损失函数的静态曲线">
</figure>
```

Rules:

- Keep specs, images, and step images inside the same course directory.
- Use only the shared `assets/course/interactive.css` and `interactive.js` runtime.
- Never add inline JavaScript, external chart libraries, remote iframes, or CDN dependencies.
- Preserve the static fallback when JavaScript, JSON loading, or rendering fails.
- Cite the official source in the surrounding prose and in the spec `source` object.
- Give every spec a non-empty source label and an `http`, `https`, or course-local relative source URL. Other URL schemes are rejected.
- Use SVG for generated diagrams and fallbacks whenever practical. Optimize raster images before committing them.

## Function plot schema

Supported expression syntax:

- Variables: `x` and declared parameter IDs.
- Constants: `pi`, `e`.
- Operators: `+`, `-`, `*`, `/`, `^`, parentheses, and commas.
- Functions: `abs`, `acos`, `asin`, `atan`, `ceil`, `cos`, `exp`, `floor`, `log`, `log10`, `max`, `min`, `pow`, `round`, `sin`, `sqrt`, `tan`.

Do not use JavaScript expressions, property access, arrays, assignments, or function definitions.

```json
{
  "version": 1,
  "kind": "function-plot",
  "title": "学习率如何改变梯度下降",
  "description": "拖动学习率，观察一步更新后的损失曲线位置。",
  "xDomain": [-4, 4],
  "yDomain": [0, 18],
  "xLabel": "parameter θ",
  "yLabel": "loss",
  "samples": 240,
  "parameters": [
    {"id": "a", "label": "曲率 a", "min": 0.5, "max": 3, "value": 1, "step": 0.1}
  ],
  "series": [
    {"label": "L(θ) = aθ²", "expression": "a*x^2", "color": "#166534"}
  ],
  "caption": "曲率越大，相同学习率对应的稳定区间越窄。",
  "source": {"label": "Lecture 4 slides", "url": "https://example.edu/course/lecture4"}
}
```

Use one to six series and no more than eight parameters. Keep sample counts between 64 and 600. Provide a fixed `yDomain` when comparing states; allow automatic scaling only when changing scale is itself harmless.

## Matrix heatmap schema

Use `values` for a single matrix or `frames` for multiple matrices. All frames must have the same shape.

```json
{
  "version": 1,
  "kind": "matrix-heatmap",
  "title": "Attention head comparison",
  "description": "切换 head，比较 token 之间的注意力分配。",
  "frameLabel": "Attention head",
  "controlLabel": "切换 head",
  "rowLabels": ["A", "B", "C"],
  "columnLabels": ["A", "B", "C"],
  "valueDomain": [0, 1],
  "colorScale": "sequential",
  "frames": [
    {"label": "Head 1", "values": [[0.8, 0.1, 0.1], [0.2, 0.6, 0.2], [0.1, 0.2, 0.7]]},
    {"label": "Head 2", "values": [[0.2, 0.7, 0.1], [0.1, 0.2, 0.7], [0.6, 0.2, 0.2]]}
  ],
  "caption": "每行表示一个 query token。",
  "source": {"label": "Official notebook output", "url": "https://example.edu/course/notebook"}
}
```

Use `colorScale: "diverging"` only when zero is a meaningful midpoint. Keep each frame at or below 4096 cells and use at most 32 frames. Round displayed teaching values to a sensible precision before writing JSON.

## Stepper schema

Use plain text, optional KaTeX formulas, and optional local images. Do not put HTML in JSON fields.

```json
{
  "version": 1,
  "kind": "stepper",
  "title": "反向传播的三个阶段",
  "description": "逐步跟踪线性层的梯度流。",
  "steps": [
    {
      "title": "前向计算",
      "body": "先计算输出并保留反向传播需要的输入。",
      "formula": "Y = XW"
    },
    {
      "title": "输入梯度",
      "body": "上游梯度与转置权重相乘。",
      "formula": "\\frac{\\partial L}{\\partial X} = \\frac{\\partial L}{\\partial Y}W^T"
    },
    {
      "title": "权重梯度",
      "body": "输入转置与上游梯度相乘。",
      "formula": "\\frac{\\partial L}{\\partial W} = X^T\\frac{\\partial L}{\\partial Y}"
    }
  ],
  "caption": "三个矩阵乘法解释了训练约为前向计算三倍的直觉。",
  "source": {"label": "Official lecture slides", "url": "https://example.edu/course/slides"}
}
```

Use two to twenty-four steps. Keep each step focused on one state transition. When a step uses an image, provide `image` as a relative course-local path and a specific `imageAlt`.

## Static diagrams

Generate a static SVG when interaction would not change the explanation. Use semantic groups, readable labels, explicit arrows, and a viewBox. Avoid embedding fonts, scripts, foreign objects, or base64 raster data in SVG.

Prefer HTML/CSS over SVG when the diagram is mostly labeled boxes and connections, needs to wrap into a clear mobile sequence, or should inherit the course's typography and theme. In both forms, keep nodes and relationships semantic enough for surrounding text and accessible labels to explain the same structure without relying on color.

For a source figure:

- Verify that redistribution is permitted or redraw only the factual structure needed for explanation.
- Do not remove attribution, alter quantitative values, or imply that a redrawn figure is the official original.
- Add a caption describing what to notice rather than restating the title.
- Store the source filename or URL in the course plan and surrounding references.

## Safety, accessibility, and performance

- Never evaluate arbitrary JavaScript. Function plots use the runtime's restricted expression grammar.
- Never fetch interactive data from third-party origins.
- Require meaningful titles, descriptions, captions, fallback alt text, and source labels.
- Ensure every control has a label and works with a keyboard.
- Do not encode meaning using color alone. Add labels, values, series names, or explanatory text.
- Keep each JSON spec below 256 KB, each fallback or step image below 2 MB, and the number of controls small enough to understand at a glance.
- Test at desktop and mobile widths. Interactive content must not create page-level horizontal overflow or conflict with the Discussion drawer.
- Respect reduced-motion preferences and avoid autoplay.

## Validation checklist

Run:

```bash
python3 <skill-root>/scripts/validate_interactive.py --repo /path/to/repo --slug <slug>
```

Then verify in a browser:

- The static fallback appears before the runtime loads and remains on renderer failure.
- Every slider or step button changes the intended state and updates its visible value.
- Function curves remain finite over the chosen domain and do not jump because of accidental auto-scaling.
- Matrix labels match row and column semantics, and frames retain a consistent scale.
- Step formulas render correctly and images have useful alt text.
- Keyboard focus is visible; narrow layouts remain readable; no console error or page-level overflow appears.
- The visual teaches a source-backed relationship and is referenced from the surrounding explanation.
