#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const specs = [
  { course: 'cs70', assignments: 41, lessons: 14, interactives: 6, label: 'PROOF & PROBABILITY' },
  { course: 'cs170', assignments: 27, lessons: 10, interactives: 7, label: 'ALGORITHM DESIGN' },
];
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
let workbookCount = 0;
let bridgeCount = 0;

for (const spec of specs) {
  const courseRoot = path.join(root, 'courses', spec.course);
  const lessonDir = path.join(courseRoot, 'lessons');
  const assignmentDir = path.join(lessonDir, 'assignments');
  const assignments = fs.readdirSync(assignmentDir).filter((file) => /^ass\d{2}-.+\.html$/.test(file)).sort();
  const lessons = fs.readdirSync(lessonDir).filter((file) => /^\d{4}-.+\.html$/.test(file)).sort();
  const bankPath = path.join(courseRoot, 'assets/reasoning-workbook-bank.js');
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(bankPath, 'utf8'), context, { filename: bankPath });
  const bank = context.window.ReasoningWorkbookBank;

  assert(assignments.length === spec.assignments, spec.course + ': assignments=' + assignments.length + ', expected ' + spec.assignments);
  assert(lessons.length === spec.lessons, spec.course + ': lessons=' + lessons.length + ', expected ' + spec.lessons);
  assert(Object.keys(bank.entries).length === spec.assignments, spec.course + ': workbook entries incomplete');
  assert(Object.keys(bank.lessonBridges).length === spec.lessons, spec.course + ': lesson bridges incomplete');
  assert(bank.label.includes(spec.label), spec.course + ': wrong discipline label');

  for (const file of assignments) {
    const html = fs.readFileSync(path.join(assignmentDir, file), 'utf8');
    const key = file.slice(0, 5);
    const entry = bank.entries[key];
    assert(html.includes('reasoning-workbook.css'), spec.course + '/' + file + ': missing workbook CSS');
    assert(html.includes('reasoning-workbook-bank.js'), spec.course + '/' + file + ': missing bank');
    assert(html.includes('reasoning-workbook.js'), spec.course + '/' + file + ': missing renderer');
    assert(Boolean(entry), spec.course + '/' + file + ': missing workbook data');
    if (!entry) continue;
    assert(entry.stages?.length === 4, spec.course + '/' + file + ': expected 4 reasoning stages');
    assert(entry.contract?.length >= 3, spec.course + '/' + file + ': contract too shallow');
    assert(entry.failures?.length >= 2, spec.course + '/' + file + ': failure signatures missing');
    assert(entry.hints?.length === 3, spec.course + '/' + file + ': progressive hints must have 3 levels');
    assert(entry.gate?.length >= 3, spec.course + '/' + file + ': gate incomplete');
    assert(entry.check?.choices?.length >= 3 && Number.isInteger(entry.check.answer), spec.course + '/' + file + ': readiness check invalid');
    assert(fs.existsSync(path.resolve(assignmentDir, entry.lesson[0])), spec.course + '/' + file + ': lesson link missing ' + entry.lesson[0]);
    workbookCount += 1;
  }

  for (const file of lessons) {
    const html = fs.readFileSync(path.join(lessonDir, file), 'utf8');
    const key = file.slice(0, 4);
    const bridge = bank.lessonBridges[key];
    assert(html.includes('reasoning-workbook.css'), spec.course + '/' + file + ': missing bridge CSS');
    assert(html.includes('reasoning-workbook-bank.js'), spec.course + '/' + file + ': missing bridge bank');
    assert(html.includes('reasoning-workbook-bridge.js'), spec.course + '/' + file + ': missing bridge renderer');
    assert(Boolean(bridge), spec.course + '/' + file + ': missing bridge data');
    if (bridge) assert(fs.existsSync(path.join(assignmentDir, bridge[0])), spec.course + '/' + file + ': bridge target missing ' + bridge[0]);
    bridgeCount += 1;
  }

  const interactiveFiles = fs.readdirSync(path.join(courseRoot, 'interactives')).filter((file) => file.endsWith('.json'));
  const fallbackFiles = fs.readdirSync(path.join(courseRoot, 'figures')).filter((file) => file.endsWith('-fallback.svg'));
  assert(interactiveFiles.length === spec.interactives, spec.course + ': interactive count regressed');
  assert(fallbackFiles.length === spec.interactives, spec.course + ': fallback count regressed');
}

const renderer = fs.readFileSync(path.join(root, 'assets/course/reasoning-workbook.js'), 'utf8');
const bridgeRenderer = fs.readFileSync(path.join(root, 'assets/course/reasoning-workbook-bridge.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/course/reasoning-workbook.css'), 'utf8');
assert(renderer.includes('Contract / proof obligation'), 'renderer must expose proof/algorithm contract');
assert(renderer.includes('Tiny sanity / counterexample'), 'renderer must expose tiny counterexample');
assert(renderer.includes('Failure signatures'), 'renderer must expose failure signatures');
assert(renderer.includes('role="status"') && renderer.includes('aria-live="polite"'), 'readiness feedback must be announced');
assert(bridgeRenderer.includes('insertAdjacentElement') && !bridgeRenderer.includes('<h2'), 'lesson bridge must not create a second TOC section');
assert(css.includes('overflow-x:auto') && css.includes('@media(max-width:720px)'), 'workbook must contain mobile overflow');

if (errors.length) {
  console.error('REASONING_WORKBOOK_LINT_FAILED errors=' + errors.length);
  errors.forEach((error) => console.error('- ' + error));
  process.exit(1);
}
console.log('REASONING_WORKBOOK_LINT_OK courses=' + specs.length + ' workbooks=' + workbookCount + ' lessonBridges=' + bridgeCount + ' preservedInteractives=13');
