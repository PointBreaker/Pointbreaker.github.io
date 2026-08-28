#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(process.argv[2] || '.');
const course = path.join(root, 'courses/6.5840');
const failures = [];
const ok = (condition, message) => { if (!condition) failures.push(message); };
const read = (relative) => fs.readFileSync(path.join(course, relative), 'utf8');
const files = (relative, pattern) => fs.readdirSync(path.join(course, relative)).filter((file) => pattern.test(file)).sort();
const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

const lessonFiles = files('lessons', /^\d{4}-.+\.html$/);
ok(lessonFiles.length === 21, `expected 21 lessons, found ${lessonFiles.length}`);
const lessonContext = { window: {} };
vm.createContext(lessonContext);
for (const file of ['practice-bank-core.js', 'practice-bank-systems.js']) vm.runInContext(read(file), lessonContext, { filename: file });
const practice = lessonContext.window.MIT65840PracticeBank || {};
ok(Object.keys(practice).length === 21, `expected 21 practice entries, found ${Object.keys(practice).length}`);

for (const file of lessonFiles) {
  const slug = file.replace(/\.html$/, '');
  const html = read(`lessons/${file}`);
  const lesson = practice[slug];
  ok(lesson, `${file}: missing practice entry`);
  for (const asset of ['learning-system.css?v=20260828a', 'practice-bank-core.js?v=20260828a', 'practice-bank-systems.js?v=20260828a', 'learning-experience.js?v=20260828a']) ok(html.includes(asset), `${file}: missing ${asset}`);
  ok((html.match(/class="quiz"/g) || []).length === 3, `${file}: expected 3 existing Deep Quiz questions`);
  if (!lesson) continue;
  ok(lesson.before?.length >= 3, `${slug}: needs >=3 prerequisite prompts`);
  ok(lesson.map?.length >= 4, `${slug}: object map is incomplete`);
  ok(lesson.checks?.length >= 2, `${slug}: needs >=2 inline concept checks`);
  for (const [target, , question] of lesson.checks || []) {
    ok(ids(html).has(target), `${slug}: check target missing #${target}`);
    ok(question?.followUp, `${slug}: inline check at #${target} needs adaptive follow-up`);
    ok(question?.options?.filter(Boolean).length >= 2, `${slug}: malformed question at #${target}`);
  }
  ok(lesson.transfer?.prompt, `${slug}: transfer check missing`);
  ok(lesson.open?.length >= 2, `${slug}: closed-book prompts missing`);
  ok(lesson.explain?.length >= 5, `${slug}: explain checklist too short`);
  ok(/lessons\/assignments\/ass\d{2}-.+#workbook-stage-/.test(lesson.bridge?.[1] || ''), `${slug}: malformed Assignment bridge`);
}

const renderer = read('learning-experience.js');
ok(renderer.includes("if (!correct)"), 'wrong answer must auto-open follow-up');
ok(renderer.includes("follow.classList.add('is-optional')"), 'correct answer must make follow-up optional');
ok(read('learning-system.css').includes('.lesson-page > .pb-toc'), 'course CSS must suppress the shared duplicate TOC');

const assignmentFiles = files('lessons/assignments', /^ass\d{2}-.+\.html$/);
ok(assignmentFiles.length === 5, `expected 5 assignments, found ${assignmentFiles.length}`);
const assignmentContext = { window: {} };
vm.createContext(assignmentContext);
vm.runInContext(read('assignment-bank.js'), assignmentContext, { filename: 'assignment-bank.js' });
const assignments = assignmentContext.window.MIT65840AssignmentBank || {};
ok(Object.keys(assignments).length === 5, `expected 5 assignment entries, found ${Object.keys(assignments).length}`);
let problemRows = 0;
let stageCount = 0;
for (const file of assignmentFiles) {
  const slug = file.replace(/\.html$/, '');
  const html = read(`lessons/assignments/${file}`);
  const assignment = assignments[slug];
  const pageIds = ids(html);
  ok(assignment, `${file}: missing assignment bank entry`);
  for (const asset of ['learning-system.css?v=20260828a', 'assignment-workbook.css?v=20260828a', 'assignment-bank.js?v=20260828a', 'assignment-workbook.js?v=20260828a']) ok(html.includes(asset), `${file}: missing ${asset}`);
  const rowCount = (html.match(/class="problem-row"/g) || []).length;
  problemRows += rowCount;
  ok(rowCount > 0, `${file}: localized handout problem rows missing`);
  ok(html.includes('Handout 完整本土化'), `${file}: localized handout marker missing`);
  ok(html.includes('Spring 2026'), `${file}: Spring 2026 source/version missing`);
  if (!assignment) continue;
  ok(assignment.source?.label === 'Spring 2026', `${slug}: official version must be Spring 2026`);
  ok(assignment.stages?.length >= 4, `${slug}: workbook needs >=4 engineering stages`);
  const seen = new Set();
  for (const stage of assignment.stages || []) {
    stageCount += 1;
    ok(!seen.has(stage.id), `${slug}: duplicate stage ${stage.id}`); seen.add(stage.id);
    ok(stage.lessons?.length >= 1, `${slug}/${stage.id}: lesson cross-link missing`);
    for (const lesson of stage.lessons || []) {
      const match = lesson.href.match(/^\.\.\/(\d{4}-.+\.html)#(.+)$/);
      ok(match, `${slug}/${stage.id}: malformed lesson link ${lesson.href}`);
      if (match) ok(ids(read(`lessons/${match[1]}`)).has(match[2]), `${slug}/${stage.id}: missing lesson anchor ${lesson.href}`);
    }
    ok(stage.official?.length >= 1, `${slug}/${stage.id}: official problem mapping missing`);
    for (const target of stage.official || []) ok(pageIds.has(target), `${slug}/${stage.id}: missing translated problem #${target}`);
    ok(stage.contract?.invariants?.length >= 2, `${slug}/${stage.id}: contract invariants missing`);
    ok(stage.contract?.forbidden?.length >= 2, `${slug}/${stage.id}: forbidden assumptions missing`);
    ok(stage.sanity, `${slug}/${stage.id}: tiny sanity check missing`);
    ok(stage.failures?.length >= 2, `${slug}/${stage.id}: failure signatures missing`);
    ok(stage.hints?.length === 3, `${slug}/${stage.id}: exactly three progressive hints required`);
    ok(stage.experiment?.prediction && stage.experiment?.run && stage.experiment?.observe, `${slug}/${stage.id}: experiment loop incomplete`);
  }
}
ok(problemRows === 46, `expected 46 localized handout rows, found ${problemRows}`);

for (const [slug, lesson] of Object.entries(practice)) {
  const match = lesson.bridge?.[1]?.match(/lessons\/assignments\/(ass\d{2}-[^#]+)\.html#workbook-stage-(.+)$/);
  ok(match, `${slug}: malformed Assignment stage bridge`);
  if (match) ok(assignments[match[1]]?.stages.some((stage) => stage.id === match[2]), `${slug}: missing target ${lesson.bridge[1]}`);
}

const assignmentRenderer = read('assignment-workbook.js');
for (const marker of ['Engineering Workbook', '中文完整题面', 'Official Handout', 'Definition of Done', 'TINY SANITY CHECK', 'Progressive Hints', 'Prediction → Experiment → Explanation', 'Retrospective']) ok(assignmentRenderer.includes(marker), `assignment renderer missing ${marker}`);

if (failures.length) {
  console.error(`MIT 6.5840 content lint failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`MIT 6.5840 content lint passed: ${lessonFiles.length} lessons, ${assignmentFiles.length} assignments, ${stageCount} workbook stages, ${problemRows} localized handout rows.`);
