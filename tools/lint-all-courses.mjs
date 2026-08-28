#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const checks = [
  ['Site links, anchors, accessibility, and catalog', 'node', ['tools/lint-site-integrity.mjs']],
  ['Code block markup', 'node', ['tools/check-code-block-formatting.mjs']],
  ['Semantic framework diagrams', 'node', ['tools/lint-course-framework-diagrams.mjs']],
  ['CS336 textbook and workbooks', 'node', ['tools/lint-cs336-content.mjs']],
  ['CS267 textbook and workbooks', 'node', ['tools/lint-cs267-content.mjs']],
  ['MIT 6.102 authored guides', 'node', ['tools/lint-mit6102-content.mjs']],
  ['MIT 6.1810 textbook and labs', 'node', ['tools/lint-mit61810-content.mjs']],
  ['MIT 6.5840 textbook and labs', 'node', ['tools/lint-mit65840-content.mjs']],
  ['EECS498 teaching-depth contract', 'node', ['tools/check-eecs498-depth.mjs']],
];

let failed = 0;
for (const [label, command, args] of checks) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, { stdio: 'inherit', cwd: process.cwd() });
  if (result.status !== 0) failed += 1;
}

if (failed) {
  console.error(`\nCOURSE_CI_FAILED checks=${failed}/${checks.length}`);
  process.exit(1);
}
console.log(`\nCOURSE_CI_OK checks=${checks.length}`);
