#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const lessonDir = path.join(root, 'courses/cs152/lessons');
const assignmentDir = path.join(lessonDir, 'assignments');
const lessonFiles = fs.readdirSync(lessonDir).filter((name) => /^\d{4}-.+\.html$/.test(name)).sort();
const assignmentFiles = fs.readdirSync(assignmentDir).filter((name) => /^ass\d{2}-.+\.html$/.test(name)).sort();
const bank = fs.readFileSync(path.join(root, 'courses/cs152/assets/architecture-bank.js'), 'utf8');
const workbookBank = fs.readFileSync(path.join(root, 'courses/cs152/assets/architecture-workbook-bank.js'), 'utf8');
const renderer = fs.readFileSync(path.join(root, 'courses/cs152/assets/architecture-experience.js'), 'utf8');
const workbookRenderer = fs.readFileSync(path.join(root, 'courses/cs152/assets/architecture-workbook.js'), 'utf8');
const errors = [];

const assert = (condition, message) => { if (!condition) errors.push(message); };
assert(lessonFiles.length === 26, `expected 26 lessons, found ${lessonFiles.length}`);
assert(assignmentFiles.length === 11, `expected 11 assignment guides, found ${assignmentFiles.length}`);

for (const file of lessonFiles) {
  const html = fs.readFileSync(path.join(lessonDir, file), 'utf8');
  const key = file.slice(0, 4);
  assert(html.includes('architecture-system.css'), `${file}: missing architecture stylesheet`);
  assert(html.includes('architecture-bank.js'), `${file}: missing architecture bank`);
  assert(html.includes('architecture-experience.js'), `${file}: missing architecture renderer`);
  assert(bank.includes(`'${key}': lesson(`), `${file}: missing lesson-specific reasoning data`);
}

for (const file of assignmentFiles) {
  const html = fs.readFileSync(path.join(assignmentDir, file), 'utf8');
  const key = file.slice(0, 5);
  assert(html.includes('architecture-system.css'), `${file}: missing workbook stylesheet`);
  assert(html.includes('architecture-workbook-bank.js'), `${file}: missing workbook bank`);
  assert(html.includes('architecture-workbook.js'), `${file}: missing workbook renderer`);
  assert(workbookBank.includes(`'${key}': workbook(`), `${file}: missing workbook stages`);
}

const lessonEntries = [...bank.matchAll(/^\s+'\d{4}': lesson\(/gm)].length;
const workbookEntries = [...workbookBank.matchAll(/^\s+'ass\d{2}': workbook\(/gm)].length;
const stageEntries = [...workbookBank.matchAll(/\bstage\('/g)].length;
assert(lessonEntries === 26, `architecture bank entries=${lessonEntries}, expected 26`);
assert(workbookEntries === 11, `workbook entries=${workbookEntries}, expected 11`);
assert(stageEntries === 33, `workbook stage entries=${stageEntries}, expected 33`);
assert(renderer.includes('role="status"') && renderer.includes('aria-live="polite"'), 'lesson feedback must be announced');
assert(renderer.includes('data-arch-diagram') && renderer.includes('role="img"'), 'semantic diagrams need an accessible boundary');
assert(workbookRenderer.includes('Contract / invariant'), 'workbook must expose contracts/invariants');
assert(workbookRenderer.includes('Tiny sanity check'), 'workbook must expose tiny sanity checks');
assert(workbookRenderer.includes('Prediction') && workbookRenderer.includes('Evidence'), 'workbook must close prediction/evidence loop');
assert(workbookRenderer.includes('Hint 1') && workbookRenderer.includes('Hint 3'), 'workbook must provide progressive hints');
assert(workbookRenderer.includes('Gate'), 'workbook must provide stage gates');

for (const match of bank.matchAll(/'((?:ass\d{2})-[^']+\.html)'/g)) {
  assert(fs.existsSync(path.join(assignmentDir, match[1])), `lesson bridge target missing: ${match[1]}`);
}

if (errors.length) {
  console.error(`CS152_CONTENT_LINT_FAILED errors=${errors.length}`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`CS152_CONTENT_LINT_OK lessons=${lessonFiles.length} workbooks=${assignmentFiles.length} stages=${stageEntries} diagrams=${lessonEntries}`);
