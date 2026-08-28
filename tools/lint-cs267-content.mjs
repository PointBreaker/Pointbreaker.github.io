#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(process.argv[2] || '.');
const course = path.join(root, 'courses/cs267');
const failures = [];
const ok = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(path.join(course, file), 'utf8');
const htmlFiles = (dir) => fs.readdirSync(path.join(course, dir)).filter((file) => file.endsWith('.html')).sort();

const lessonFiles = htmlFiles('lessons');
ok(lessonFiles.length === 27, `expected 27 lessons, found ${lessonFiles.length}`);
const lessonSandbox = { window: {} };
vm.createContext(lessonSandbox);
for (const source of ['assets/practice-bank-core.js', 'assets/practice-bank-applications.js', 'assets/practice-bank-depth.js']) {
  vm.runInContext(read(source), lessonSandbox, { filename: source });
}
const practice = lessonSandbox.window.CS267PracticeBank || {};
for (const file of lessonFiles) {
  const id = file.replace(/\.html$/, '');
  const html = read(`lessons/${file}`);
  ok(practice[id], `${file}: missing practice-bank entry`);
  ok(html.includes('learning-system.css?v=20260828d'), `${file}: missing learning-system.css`);
  ok(html.includes('lesson-experience.js?v=20260828d'), `${file}: missing lesson-experience.js`);
  ok(html.includes('framework-diagrams.css?v=20260827c'), `${file}: missing framework diagram styles`);
  ok(html.includes('framework-diagrams.js?v=20260827c'), `${file}: missing framework diagram renderer`);
  ok(html.includes('practice-bank-core.js?v=20260827a'), `${file}: missing core practice bank`);
  ok(html.includes('practice-bank-applications.js?v=20260827a'), `${file}: missing applications practice bank`);
  ok(html.includes('practice-bank-depth.js?v=20260828d'), `${file}: missing depth practice bank`);
}
ok(Object.keys(practice).length === lessonFiles.length, `practice bank has ${Object.keys(practice).length} entries for ${lessonFiles.length} lessons`);
for (const [id, lesson] of Object.entries(practice)) {
  ok(Array.isArray(lesson.before) && lesson.before.length >= 2, `${id}: needs >=2 Before We Start prompts`);
  ok(lesson.check?.question?.[4], `${id}: inline check needs follow-up`);
  ok(Array.isArray(lesson.deep) && lesson.deep.length >= 2, `${id}: needs >=2 Deep Quiz items`);
  ok(Array.isArray(lesson.open) && lesson.open.length >= 2, `${id}: needs >=2 closed-book prompts`);
  ok(Array.isArray(lesson.explain) && lesson.explain.length >= 4, `${id}: needs >=4 explain outcomes`);
  ok(lesson.reasoning?.toy && lesson.reasoning?.whyNot, `${id}: needs toy derivation and why-not counterfactual`);
}

const lesson03 = read('lessons/03-matmul-roofline.html');
for (const forbidden of ['i = 0; i & N', 'GPU (典型)', '算法达到最佳效率']) {
  ok(!lesson03.includes(forbidden), `Lesson 03 forbidden wording: ${forbidden}`);
}
for (const required of ['不表示实现已经达到最佳效率', 'Hardware-specific', 'Napkin-math approximation', 'i &lt; N']) {
  ok(lesson03.includes(required), `Lesson 03 missing accuracy marker: ${required}`);
}
const lessonRenderer = read('assets/lesson-experience.js');
ok(lessonRenderer.includes("correct ? 'details' : 'div'"), 'adaptive follow-up: correct path must be optional details');
ok(lessonRenderer.includes('follow-up--required'), 'adaptive follow-up: wrong path must auto-open');
const quiz = read('assets/quiz.js');
ok(quiz.includes('compactCorrect'), 'legacy quiz handler must normalize data-correct="a-d"');
ok(read('assets/learning-system.css').includes('body.cs267-textbook > .pb-toc'), 'lesson CSS must suppress the redundant shared TOC');

const assignmentFiles = [...htmlFiles('homeworks').map((file) => `homeworks/${file}`), 'projects/index.html'];
ok(assignmentFiles.length === 7, `expected 7 work items, found ${assignmentFiles.length}`);
const assignmentSandbox = { window: {} };
vm.createContext(assignmentSandbox);
vm.runInContext(read('assets/assignment-bank.js'), assignmentSandbox, { filename: 'assignment-bank.js' });
const assignments = assignmentSandbox.window.CS267AssignmentBank || {};
for (const relative of assignmentFiles) {
  const id = relative === 'projects/index.html' ? 'project' : path.basename(relative, '.html');
  const html = read(relative);
  ok(assignments[id], `${relative}: missing assignment-bank entry`);
  ok(html.includes('workbook.css?v=20260827b'), `${relative}: missing workbook.css`);
  ok(html.includes('assignment-workbook.js?v=20260827a'), `${relative}: missing assignment renderer`);
  ok((html.match(/class="quiz/g) || []).length > 0 || id === 'project', `${relative}: original Chinese guide/self-check appears missing`);
}
ok(Object.keys(assignments).length === assignmentFiles.length, `assignment bank has ${Object.keys(assignments).length} entries`);
for (const [id, assignment] of Object.entries(assignments)) {
  ok(assignment.version === 'Spring 2025', `${id}: version must be Spring 2025`);
  ok(/^https:\/\/sites\.google\.com\/lbl\.gov\/cs267-spr2025\//.test(assignment.source), `${id}: official source missing/invalid`);
  ok(Array.isArray(assignment.stages) && assignment.stages.length >= 4, `${id}: needs >=4 stages`);
  const ids = new Set();
  for (const stage of assignment.stages || []) {
    ok(!ids.has(stage.id), `${id}: duplicate stage id ${stage.id}`);
    ids.add(stage.id);
    ok(stage.contract?.invariants?.length >= 2, `${id}/${stage.id}: contract invariants missing`);
    ok(stage.contract?.forbidden?.length >= 1, `${id}/${stage.id}: forbidden assumptions missing`);
    ok(stage.done?.length >= 3, `${id}/${stage.id}: Definition of Done needs Correct/Understand/Evidence`);
    ok(stage.failures?.length >= 3, `${id}/${stage.id}: failure signatures missing`);
    ok(stage.hints?.length === 3, `${id}/${stage.id}: exactly three progressive hints required`);
    ok(stage.experiment?.length === 3, `${id}/${stage.id}: prediction/experiment/explanation missing`);
    ok(stage.lessons?.length >= 1, `${id}/${stage.id}: lesson cross-link missing`);
  }
}
for (const [lessonId, lesson] of Object.entries(practice)) {
  const href = lesson.bridge?.[1] || '';
  const match = href.match(/(?:homeworks\/([^/#]+)\.html|\.\.\/projects\/index\.html)#workbook-stage-([\w-]+)/);
  ok(match, `${lessonId}: assignment bridge is not a stage anchor: ${href}`);
  if (!match) continue;
  const assignmentId = match[1] || 'project';
  ok(assignments[assignmentId]?.stages.some((stage) => stage.id === match[2]), `${lessonId}: broken assignment stage bridge ${href}`);
}
const assignmentRenderer = read('assets/assignment-workbook.js');
ok(read('assets/workbook.css').includes('body.cs267-workbook > .pb-toc'), 'workbook CSS must suppress the redundant shared TOC');
for (const marker of ['Engineering Workbook', '中文完整任务说明', 'Official Sources', 'Failure signatures', 'Tiny sanity check', 'Prediction → Experiment → Explanation', 'Retrospective']) {
  ok(assignmentRenderer.includes(marker), `assignment renderer missing: ${marker}`);
}

if (failures.length) {
  console.error(`CS267 content lint failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`CS267 content lint passed: ${lessonFiles.length} lessons, ${assignmentFiles.length} work items, ${Object.keys(practice).length} practice entries.`);
