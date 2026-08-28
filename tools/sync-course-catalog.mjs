#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const checkOnly = process.argv.includes('--check');
const catalogFile = path.join(root, 'courses.json');
const homeFile = path.join(root, 'index.html');
const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
const failures = [];
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

for (const course of catalog.courses) {
  const courseRoot = path.join(root, course.path);
  const statusFile = path.join(courseRoot, 'api/status.json');
  if (!fs.existsSync(statusFile)) {
    failures.push(`${course.id}: api/status.json is missing`);
    continue;
  }
  const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
  const lectures = status.lectures || [];
  const assignments = status.assignments || [];
  for (const lecture of lectures) {
    if (!lecture.lessonFile || !fs.existsSync(path.join(courseRoot, lecture.lessonFile))) failures.push(`${course.id}: missing lesson ${lecture.lessonFile || '(unset)'}`);
  }
  for (const assignment of assignments) {
    const file = assignment.assGuideFile || assignment.contentFile;
    if (file && !fs.existsSync(path.join(courseRoot, file))) failures.push(`${course.id}: missing work item ${file}`);
  }
  if (course.lectures !== lectures.length) {
    if (checkOnly) failures.push(`${course.id}: courses.json lectures=${course.lectures}, status=${lectures.length}`);
    else course.lectures = lectures.length;
  }
  if (course.workItems !== assignments.length) {
    if (checkOnly) failures.push(`${course.id}: courses.json workItems=${course.workItems}, status=${assignments.length}`);
    else course.workItems = assignments.length;
  }
}

const cards = catalog.courses.map((course, index) => `      <a class="course-card" href="${escapeHtml(course.path)}" style="--course-accent:${escapeHtml(course.accent || '#63e68c')}">
        <div class="course-card-top"><span class="course-code">${escapeHtml(course.code)}</span><span class="course-index">Course ${String(index + 1).padStart(2, '0')}</span></div>
        <p class="course-domain">${escapeHtml(course.domain)}</p>
        <h3 class="course-title">${escapeHtml(course.title)}<span class="course-title-zh">${escapeHtml(course.titleZh)}</span></h3>
        <p class="course-summary">${escapeHtml(course.summary)}</p>
        <div class="course-meta"><span><strong>${course.lectures}</strong> 讲义</span><span><strong>${course.workItems}</strong> ${escapeHtml(course.workLabel)}</span><span>${escapeHtml(course.university)}</span><span>${escapeHtml(course.term)}</span></div>
        <div class="course-tags">${(course.tags || []).map((tag) => `<span class="course-tag">${escapeHtml(tag)}</span>`).join('')}</div>
      </a>`).join('\n');
const totalLectures = catalog.courses.reduce((sum, course) => sum + course.lectures, 0);
const totalWork = catalog.courses.reduce((sum, course) => sum + course.workItems, 0);
let home = fs.readFileSync(homeFile, 'utf8');
home = home.replace(/<dt id="course-count">[^<]*<\/dt>/, `<dt id="course-count">${String(catalog.courses.length).padStart(2, '0')}</dt>`);
home = home.replace(/<dt id="lecture-count">[^<]*<\/dt>/, `<dt id="lecture-count">${totalLectures}</dt>`);
home = home.replace(/<dt id="work-count">[^<]*<\/dt>/, `<dt id="work-count">${totalWork}</dt>`);
home = home.replace(/<p class="results-note" id="results-note"[^>]*>.*?<\/p>/s, `<p class="results-note" id="results-note" aria-live="polite">显示 ${catalog.courses.length} / ${catalog.courses.length} 门课程</p>`);
const generatedGrid = `<div class="course-grid" id="course-grid">\n<!-- GENERATED:COURSE_CARDS -->\n${cards}\n<!-- /GENERATED:COURSE_CARDS -->\n      </div>`;
if (home.includes('<!-- GENERATED:COURSE_CARDS -->')) {
  home = home.replace(/<!-- GENERATED:COURSE_CARDS -->(?:.|\n)*?<!-- \/GENERATED:COURSE_CARDS -->/, `<!-- GENERATED:COURSE_CARDS -->\n${cards}\n<!-- /GENERATED:COURSE_CARDS -->`);
} else {
  home = home.replace(/<div class="course-grid" id="course-grid">\s*<\/div>/, generatedGrid);
}
home = home.replace(/<noscript>(?:.|\n)*?<\/noscript>/, `<noscript>\n        <p class="load-error">当前显示完整静态课程目录；启用 JavaScript 后可以使用主题筛选与搜索。</p>\n      </noscript>`);

if (checkOnly) {
  const committedCatalog = fs.readFileSync(catalogFile, 'utf8');
  const expectedCatalog = `${JSON.stringify(catalog, null, 2)}\n`;
  if (committedCatalog !== expectedCatalog) failures.push('courses.json is not normalized; run node tools/sync-course-catalog.mjs');
  if (fs.readFileSync(homeFile, 'utf8') !== home) failures.push('index.html static catalog is stale; run node tools/sync-course-catalog.mjs');
} else {
  fs.writeFileSync(catalogFile, `${JSON.stringify(catalog, null, 2)}\n`);
  fs.writeFileSync(homeFile, home);
}

if (failures.length) {
  console.error(`Course catalog sync failed (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`${checkOnly ? 'COURSE_CATALOG_SYNCED' : 'COURSE_CATALOG_UPDATED'} courses=${catalog.courses.length} lectures=${totalLectures} workItems=${totalWork}`);
