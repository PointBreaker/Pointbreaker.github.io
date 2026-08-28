#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const specs = [
  ['18-01-single-variable-calculus', 38],
  ['18-02-multivariable-calculus', 36],
  ['18-06-linear-algebra', 34],
];
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
let diagrams = 0;
let checks = 0;

for (const [course, expected] of specs) {
  const lessonDir = path.join(root, 'courses', course, 'lessons');
  const files = fs.readdirSync(lessonDir).filter((name) => /^\d{4}-.+\.html$/.test(name)).sort();
  const bankPath = path.join(root, 'courses', course, 'assets', 'math-bank.js');
  const source = fs.readFileSync(bankPath, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: bankPath });
  const entries = context.window.MathReasoningBank?.entries || {};

  assert(files.length === expected, `${course}: expected ${expected} lessons, found ${files.length}`);
  assert(Object.keys(entries).length === expected, `${course}: expected ${expected} bank entries, found ${Object.keys(entries).length}`);
  for (const file of files) {
    const html = fs.readFileSync(path.join(lessonDir, file), 'utf8');
    const key = file.slice(0, 4);
    const entry = entries[key];
    assert(html.includes('math-reasoning.css'), `${course}/${file}: missing reasoning CSS`);
    assert(html.includes('../assets/math-bank.js'), `${course}/${file}: missing course math bank`);
    assert(html.includes('math-reasoning.js'), `${course}/${file}: missing reasoning renderer`);
    assert(Boolean(entry), `${course}/${file}: missing lesson reasoning entry`);
    if (!entry) continue;
    assert(entry.nodes?.length >= 4, `${course}/${file}: visual derivation needs at least 4 nodes`);
    assert(entry.check?.choices?.length >= 3, `${course}/${file}: active check needs plausible alternatives`);
    assert(Number.isInteger(entry.check?.answer) && entry.check.answer < entry.check.choices.length, `${course}/${file}: invalid answer index`);
    assert(entry.check?.diagnosis?.length >= 20, `${course}/${file}: diagnosis too shallow`);
    assert(entry.transfer?.length >= 20, `${course}/${file}: missing closed-book transfer`);
    diagrams += 1;
    checks += 1;
  }
}

const renderer = fs.readFileSync(path.join(root, 'assets/course/math-reasoning.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/course/math-reasoning.css'), 'utf8');
assert(renderer.includes('data-math-diagram') && renderer.includes('role="img"'), 'math map must expose an accessible diagram boundary');
assert(renderer.includes('role="status"') && renderer.includes('aria-live="polite"'), 'math feedback must be announced');
assert(renderer.includes('renderMathInElement'), 'injected formulas must be rendered after insertion');
assert(css.includes('overflow-x:auto'), 'mobile derivation maps need local overflow containment');
assert(css.includes('@media(max-width:780px)'), 'math reasoning needs a mobile layout');

for (const interactive of ['elimination-3x3-stepper','four-subspaces-map','eigenvalue-diagonalization','svd-image-compression']) {
  assert(fs.existsSync(path.join(root, 'courses/18-06-linear-algebra/interactives', `${interactive}.json`)), `18.06 interactive missing: ${interactive}`);
  assert(fs.existsSync(path.join(root, 'courses/18-06-linear-algebra/figures', `${interactive}-fallback.svg`)), `18.06 fallback missing: ${interactive}`);
}

if (errors.length) {
  console.error(`MATH_REASONING_LINT_FAILED errors=${errors.length}`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`MATH_REASONING_LINT_OK courses=${specs.length} lessons=${diagrams} diagrams=${diagrams} activeChecks=${checks} preservedInteractives=4`);
