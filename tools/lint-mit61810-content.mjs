#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(process.argv[2] || '.');
const course = path.join(root, 'courses/6.1810');
const failures = [];
const ok = (condition, message) => { if (!condition) failures.push(message); };
const read = (relative) => fs.readFileSync(path.join(course, relative), 'utf8');
const htmlFiles = (dir) => fs.readdirSync(path.join(course, dir)).filter((file) => file.endsWith('.html')).sort();
const headingText = (html) => [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map((match) => match[1].replace(/<[^>]+>/g, '').trim());
const slugify = (value) => value.trim().toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/g, '-').replace(/^-+|-+$/g, '');

const lessons = htmlFiles('lessons');
ok(lessons.length === 23, `expected 23 lessons, found ${lessons.length}`);
const lessonContext = { window: {} };
vm.createContext(lessonContext);
for (const file of ['assets/practice-bank-core.js', 'assets/practice-bank-systems.js']) vm.runInContext(read(file), lessonContext, { filename: file });
const practice = lessonContext.window.MIT61810PracticeBank || {};
ok(Object.keys(practice).length === 23, `expected 23 practice entries, found ${Object.keys(practice).length}`);
for (const file of lessons) {
  const id = file.replace(/\.html$/, '');
  const html = read(`lessons/${file}`);
  const lesson = practice[id];
  ok(lesson, `${file}: missing practice entry`);
  ok(html.includes('learning-system.css?v=20260828d'), `${file}: missing learning-system.css`);
  ok(html.includes('practice-bank-core.js?v=20260828d'), `${file}: missing core bank`);
  ok(html.includes('practice-bank-systems.js?v=20260828d'), `${file}: missing systems bank`);
  ok(html.includes('lesson-experience.js?v=20260828d'), `${file}: missing renderer`);
  ok((html.match(/class="quiz"/g) || []).length >= 3, `${file}: localized legacy quiz bank appears missing`);
  if (!lesson) continue;
  ok(lesson.before?.length >= 3, `${id}: needs >=3 prerequisite prompts`);
  ok(lesson.reasoning?.length === 4, `${id}: needs objects/toy/mechanism/why-not`);
  ok(lesson.checks?.length >= 2, `${id}: needs >=2 inline checks`);
  lesson.checks?.forEach((entry, index) => {
    ok(entry[2]?.followUp, `${id}: check ${index + 1} needs adaptive follow-up`);
    ok(headingText(html).some((heading) => heading.includes(entry[0])), `${id}: check ${index + 1} target heading missing: ${entry[0]}`);
  });
  ok(lesson.transfer?.prompt, `${id}: transfer question missing`);
  ok(lesson.open?.length >= 2, `${id}: closed-book prompts missing`);
  ok(lesson.explain?.length >= 5, `${id}: explain checklist too short`);
  ok(/^\.\.\/labs\/.+#workbook-stage-/.test(lesson.bridge?.[1] || ''), `${id}: broken Lab stage bridge`);
}
const lessonRenderer = read('assets/lesson-experience.js');
ok(lessonRenderer.includes("correct ? 'details' : 'div'"), 'correct follow-up must be optional');
ok(lessonRenderer.includes('follow-up--required'), 'wrong follow-up must auto-open');
ok(read('assets/learning-system.css').includes('body.mit61810-textbook>.pb-toc'), 'textbook CSS must suppress shared duplicate TOC');

const labs = htmlFiles('labs');
ok(labs.length === 9, `expected 9 labs, found ${labs.length}`);
const labContext = { window: {} };
vm.createContext(labContext);
vm.runInContext(read('assets/lab-bank.js'), labContext, { filename: 'assets/lab-bank.js' });
const labBank = labContext.window.MIT61810LabBank || {};
ok(Object.keys(labBank).length === 9, `expected 9 lab entries, found ${Object.keys(labBank).length}`);
for (const file of labs) {
  const id = file.replace(/\.html$/, '');
  const html = read(`labs/${file}`);
  const lab = labBank[id];
  ok(lab, `${file}: missing lab bank entry`);
  ok(html.includes('workbook.css?v=20260828d'), `${file}: missing workbook.css`);
  ok(html.includes('lab-bank.js?v=20260828d'), `${file}: missing lab bank asset`);
  ok(html.includes('lab-workbook.js?v=20260828d'), `${file}: missing workbook renderer`);
  ok((html.match(/<h2>/g) || []).length > 0, `${file}: original Chinese task headings missing`);
  if (!lab) continue;
  const taskText = [...html.matchAll(/<(?:h2|h3|p|li)[^>]*>([\s\S]*?)<\/(?:h2|h3|p|li)>/g)].map((match) => match[1].replace(/<[^>]+>/g, '').trim().toLowerCase());
  ok(lab.version.includes('Fall 2026'), `${id}: version notice missing`);
  ok(lab.stages?.length >= 2, `${id}: needs staged workbook`);
  const ids = new Set();
  for (const stage of lab.stages || []) {
    ok(!ids.has(stage.id), `${id}: duplicate stage id ${stage.id}`); ids.add(stage.id);
    ok(stage.lessons?.length >= 1, `${id}/${stage.id}: lesson cross-link missing`);
    for (const [href] of stage.lessons || []) {
      const target = href.match(/^\.\.\/lessons\/([^#]+)#(.+)$/);
      ok(target, `${id}/${stage.id}: malformed lesson link ${href}`);
      if (!target) continue;
      const targetHtml = read(`lessons/${target[1]}`);
      ok(headingText(targetHtml).map(slugify).includes(target[2]), `${id}/${stage.id}: missing lesson anchor ${href}`);
    }
    ok(stage.contract?.invariants?.length >= 2, `${id}/${stage.id}: contract invariants missing`);
    ok(stage.contract?.forbidden?.length >= 1, `${id}/${stage.id}: forbidden assumptions missing`);
    ok(stage.sanity, `${id}/${stage.id}: tiny sanity missing`);
    ok(stage.failures?.length >= 2, `${id}/${stage.id}: failure signatures missing`);
    ok(stage.hints?.length === 3, `${id}/${stage.id}: exactly 3 hints required`);
    ok(stage.experiment?.prediction && stage.experiment?.run && stage.experiment?.explain, `${id}/${stage.id}: experiment loop incomplete`);
    for (const problem of stage.problems || []) ok(taskText.some((text) => text.includes(problem.toLowerCase())), `${id}/${stage.id}: Chinese task target missing: ${problem}`);
  }
}
for (const [id, lesson] of Object.entries(practice)) {
  const bridge = lesson.bridge[1].match(/^\.\.\/labs\/([^#]+)\.html#workbook-stage-(.+)$/);
  ok(bridge, `${id}: malformed lab bridge`);
  if (bridge) ok(labBank[bridge[1]]?.stages.some((stage) => stage.id === bridge[2]), `${id}: missing target ${lesson.bridge[1]}`);
}
const labRenderer = read('assets/lab-workbook.js');
for (const marker of ['Engineering Workbook', '中文完整题面', 'Definition of Done', 'Tiny Sanity Check', 'Failure Signatures', 'Prediction → Experiment → Explanation', 'Retrospective']) ok(labRenderer.includes(marker), `lab renderer missing ${marker}`);
ok(read('assets/workbook.css').includes('body.mit61810-workbook>.pb-toc'), 'workbook CSS must suppress shared duplicate TOC');

if (failures.length) {
  console.error(`MIT 6.1810 content lint failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`MIT 6.1810 content lint passed: ${lessons.length} lessons, ${labs.length} labs, ${Object.values(labBank).reduce((sum, lab) => sum + lab.stages.length, 0)} workbook stages.`);
