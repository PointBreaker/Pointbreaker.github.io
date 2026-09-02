#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const course = path.join(repo, 'courses/cs168');
const info = JSON.parse(fs.readFileSync(path.join(course, 'course-info.json'), 'utf8'));
const gold = new Set(info.qualityContract?.goldLessons ?? []);
const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

assert(info.courseTypeProfiles?.[0] === 'networking-distributed-systems', 'CS168 must declare the networking/distributed-systems profile');
assert(JSON.stringify([...gold]) === JSON.stringify([3, 6, 8, 9, 11, 12, 13, 15, 17]), 'CS168 Gold lesson declaration drifted');
assert(/under construction/i.test(info.sourceStatus), 'Fall 2026 under-construction source status must remain visible');
assert(/Project 3 尚未发布/.test(info.sourceStatus), 'unpublished Fall 2026 Project 3 status must remain explicit');

const lessonFiles = fs.readdirSync(path.join(course, 'lessons')).filter((file) => /^\d{4}-.*\.html$/.test(file)).sort();
assert(lessonFiles.length === 26, `expected 26 CS168 lessons, found ${lessonFiles.length}`);

for (const file of lessonFiles) {
  const number = Number(file.slice(0, 4));
  const html = fs.readFileSync(path.join(course, 'lessons', file), 'utf8');
  const quizzes = [...html.matchAll(/data-quiz="([^"]+)"/g)].map((match) => match[1]);
  const status = gold.has(number) ? 'GOLD' : 'GOOD';
  assert(html.includes(`data-course-profile="networking-distributed-systems"`), `L${number}: profile marker missing`);
  assert(html.includes(`data-depth-status="${status}"`), `L${number}: expected ${status} status`);
  assert(new Set(quizzes).size === quizzes.length, `L${number}: quiz IDs are not unique`);
  assert(html.includes('class="worked-trace"'), `L${number}: worked trace missing`);
  assert(html.includes('class="counterfactual"'), `L${number}: counterfactual missing`);
  assert(html.includes('class="explain-yourself"'), `L${number}: Explain It Yourself missing`);
  assert(quizzes.length >= (gold.has(number) ? 5 : 2), `L${number}: insufficient diagnostic checks (${quizzes.length})`);
  assert(!/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(html), `L${number}: non-printing control character in HTML`);
  assert(!/SND\.UNAle|SRTTleftarrow|throughputpropto|\[d_\{link\}=/.test(html), `L${number}: known malformed-math signature returned`);
  assert(html.includes('assets/course/math-render.js?v=20260814f'), `L${number}: math renderer is not cache-versioned`);
  if (gold.has(number)) {
    for (const className of ['misconception-analysis', 'deep-checks', 'implementation-map']) {
      assert(html.includes(`class="${className}"`), `L${number}: Gold evidence ${className} missing`);
    }
  }
}

const coreSteppers = {
  'encapsulation-stepper.json': 7,
  'distance-vector-convergence.json': 6,
  'router-pipeline-stepper.json': 6,
  'tcp-sequence-space.json': 7,
};
for (const [file, minimum] of Object.entries(coreSteppers)) {
  const spec = JSON.parse(fs.readFileSync(path.join(course, 'interactives', file), 'utf8'));
  assert(spec.kind === 'stepper', `${file}: expected stepper`);
  assert(spec.steps?.length >= minimum, `${file}: expected at least ${minimum} concrete steps`);
  const traceText = spec.steps?.map((step) => `${step.title} ${step.body}`).join(' ') ?? '';
  assert(spec.steps?.every((step) => step.body?.length >= 28), `${file}: step bodies must state concrete transitions`);
  assert(/state|table|history|TTL|FIB|ACK|UNA|NXT|MAC|IP|状态|队列|通告/.test(traceText), `${file}: trace lacks concrete state/table evidence`);
  const fallback = path.join(course, 'figures', file.replace('.json', '-fallback.svg'));
  assert(fs.existsSync(fallback) && fs.statSync(fallback).size > 500, `${file}: meaningful fallback missing`);
}

const throughput = JSON.parse(fs.readFileSync(path.join(course, 'interactives/tcp-throughput-model.json'), 'utf8'));
assert(throughput.kind === 'function-plot' && throughput.parameters?.length === 2, 'TCP throughput model must expose RTT and MSS controls');

for (const required of ['CS168-QUALITY-REFACTOR-REPORT.md']) {
  assert(fs.existsSync(path.join(course, required)), `${required} is missing`);
}
const workbookContract = {
  'ass14-project-1a-traceroute.html': ['engineering-workbook', 'GOLD'],
  'ass15-project-1b-traceroute-errors.html': ['engineering-workbook', 'GOLD'],
  'ass16-project-2-routing.html': ['historical-implementation-recap', 'GOLD'],
  'ass17-project-3-transport-history.html': ['historical-implementation-recap', 'BLOCKED_BY_SOURCE'],
};
for (const [file, [profile, status]] of Object.entries(workbookContract)) {
  const html = fs.readFileSync(path.join(course, 'lessons/assignments', file), 'utf8');
  assert(html.includes(`data-workbook-profile="${profile}"`), `${file}: workbook profile drifted`);
  assert(html.includes(`data-workbook-status="${status}"`), `${file}: workbook status drifted`);
  assert(html.includes('class="closed-book-reconstruction"'), `${file}: closed-book reconstruction missing`);
  assert(html.includes('class="lesson-links"'), `${file}: contextual lesson links missing`);
  if (profile === 'historical-implementation-recap') {
    for (const marker of ['YOUR CODE · Historical Implementation', 'Framework Context', 'class="attribution-map"', 'class="state-map"', 'class="execution-trace"', 'class="code-prediction"', 'class="bug-reconstruction"']) {
      assert(html.includes(marker), `${file}: recap evidence missing ${marker}`);
    }
  }
}
assert(fs.existsSync(path.join(course, 'CS168-PROJECT-RECAP-REPORT.md')), 'CS168-PROJECT-RECAP-REPORT.md is missing');
assert(fs.existsSync(path.join(repo, 'COURSE-AUTHORING-SKILL-CHANGELOG.md')), 'Course Authoring Skill changelog is missing');

if (failures.length) {
  console.error(`CS168_CONTENT_FAILED (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`CS168_CONTENT_OK lessons=${lessonFiles.length} gold=${gold.size} interactives=${Object.keys(coreSteppers).length + 1}`);
