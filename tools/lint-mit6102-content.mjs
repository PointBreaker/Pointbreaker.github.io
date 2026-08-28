#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const course = path.join(root, 'courses/6.102');
const failures = [];
const ok = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(file, 'utf8');

const rootPage = path.join(course, 'index.html');
const lectureDirectory = path.join(course, 'lectures');
const studyDirectory = path.join(course, 'self-study');
const lectureFiles = fs.readdirSync(lectureDirectory).filter((file) => file.endsWith('.html')).sort();
const studyFiles = fs.readdirSync(studyDirectory).filter((file) => file.endsWith('.html')).sort();

ok(lectureFiles.length === 19, `expected 19 authored lessons, found ${lectureFiles.length}`);
ok(studyFiles.length === 6, `expected self-study index + 5 workbooks, found ${studyFiles.length}`);
ok(!fs.existsSync(path.join(course, 'offline')), 'the personal offline mirror must not be published');

const home = read(rootPage);
ok(!/<iframe\b/i.test(home), 'course entry must not be an iframe wrapper');
ok(!/offline\/sp26/i.test(home), 'course entry still links the removed offline mirror');
ok(home.includes('CourseStack 学习层与官方题面分开'), 'course entry needs a clear source boundary');
ok(home.includes('https://web.mit.edu/6.102/www/sp26/'), 'official Spring 2026 source is missing');
ok(home.includes('self-study/ps0.html'), 'clean-room self-study route is missing');
ok(home.includes('lectures/05-designing-specifications.html'), 'lesson 05 route is stale');

for (const file of lectureFiles) {
  const html = read(path.join(lectureDirectory, file));
  ok(/<html\s+lang="zh-CN">/.test(html), `${file}: language must be zh-CN`);
  ok((html.match(/<h2\b/g) || []).length >= 3, `${file}: authored lesson is unexpectedly shallow`);
  ok(html.includes('href="../index.html'), `${file}: missing working course-home link`);
  ok(!/<iframe\b/i.test(html), `${file}: authored lesson must not embed the mirror`);
}

const studyIndex = read(path.join(studyDirectory, 'index.html'));
ok(studyIndex.includes('干净室重建'), 'self-study source boundary is missing');
ok(studyIndex.includes('不包含'), 'self-study page must state what it does not reproduce');
for (const file of studyFiles.filter((file) => file !== 'index.html')) {
  const html = read(path.join(studyDirectory, file));
  ok(html.includes('https://web.mit.edu/6.102/www/sp26/'), `${file}: official handout link missing`);
  ok(!/href="\.\.\/index\.html#offline"/.test(html), `${file}: stale offline navigation remains`);
}

const htmlFiles = [rootPage, ...lectureFiles.map((file) => path.join(lectureDirectory, file)), ...studyFiles.map((file) => path.join(studyDirectory, file))];
const idCache = new Map();
const ids = (file) => {
  if (!idCache.has(file)) idCache.set(file, new Set([...read(file).matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])));
  return idCache.get(file);
};
for (const file of htmlFiles) {
  const html = read(file);
  for (const tag of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/gi)) {
    const href = tag[1];
    if (/^(?:https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
    const [pathname, fragment] = href.split('#');
    if (!pathname) {
      if (fragment) ok(ids(file).has(fragment), `${path.relative(root, file)}: missing #${fragment}`);
      continue;
    }
    let target = path.resolve(path.dirname(file), pathname);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    ok(fs.existsSync(target), `${path.relative(root, file)}: broken local link ${href}`);
    if (fragment && fs.existsSync(target) && target.endsWith('.html')) ok(ids(target).has(fragment), `${path.relative(root, file)}: missing target ${href}`);
  }
  for (const tag of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    ok(/rel="[^"]*(?:noopener|noreferrer)/i.test(tag[0]), `${path.relative(root, file)}: target=_blank missing safe rel`);
  }
}

const registry = JSON.parse(read(path.join(root, 'courses.json')));
const entry = registry.courses.find((item) => item.id === '6.102');
ok(entry?.lectures === 19, 'courses.json lecture count must remain 19');
ok(entry?.workItems === 5, 'courses.json work item count must remain 5');
ok(!/离线镜像/.test(entry?.summary || ''), 'courses.json still advertises the removed mirror');

if (failures.length) {
  console.error(`MIT 6.102 content lint failed (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`MIT 6.102 content lint passed: ${lectureFiles.length} authored lessons, ${studyFiles.length - 1} clean-room workbooks, no republished mirror.`);
