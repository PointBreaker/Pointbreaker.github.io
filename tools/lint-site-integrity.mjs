#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const failures = [];
const ok = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(file, 'utf8');

function walk(directory, suffix) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...walk(file, suffix));
    else if (entry.name.endsWith(suffix)) result.push(file);
  }
  return result;
}

function localTarget(page, reference) {
  if (!reference || /^(?:#|https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(reference)) return null;
  let pathname;
  try { pathname = decodeURIComponent(reference.split(/[?#]/)[0]); }
  catch { pathname = reference.split(/[?#]/)[0]; }
  if (!pathname || /[{}$]/.test(pathname)) return null;
  return pathname.startsWith('/') ? path.join(root, pathname.slice(1)) : path.resolve(path.dirname(page), pathname);
}

const catalog = JSON.parse(read(path.join(root, 'courses.json')));
const courseIds = new Set();
const coursePaths = new Set();
for (const course of catalog.courses || []) {
  ok(course.id && !courseIds.has(course.id), `duplicate or empty course id: ${course.id || '(empty)'}`);
  ok(course.path && !coursePaths.has(course.path), `duplicate or empty course path: ${course.path || '(empty)'}`);
  courseIds.add(course.id);
  coursePaths.add(course.path);
  ok(course.path === `courses/${course.id}/`, `${course.id}: catalog path must be courses/${course.id}/`);
  ok(fs.existsSync(path.join(root, course.path, 'index.html')), `${course.id}: course entry index.html is missing`);
}
ok(courseIds.size === 12, `expected 12 registered courses, found ${courseIds.size}`);

const pages = [path.join(root, 'index.html'), path.join(root, '404.html'), ...walk(path.join(root, 'courses'), '.html')];
const idCache = new Map();
const ids = (file) => {
  if (!idCache.has(file)) idCache.set(file, new Set([...read(file).matchAll(/\s(?:id|name)=["']([^"']+)["']/gi)].map((match) => match[1])));
  return idCache.get(file);
};

let checkedReferences = 0;
for (const page of pages) {
  const source = read(page);
  const relative = path.relative(root, page);
  ok(/^\s*<!doctype html>/i.test(source), `${relative}: missing HTML5 doctype`);
  ok(/<html\b[^>]*\blang=["'][^"']+["']/i.test(source), `${relative}: <html> needs a language`);
  ok(/<title>[^<]+<\/title>/i.test(source), `${relative}: missing non-empty title`);
  ok(/<meta\b[^>]*\bname=["']viewport["'][^>]*>/i.test(source), `${relative}: missing viewport meta`);

  const pageIds = [...source.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const duplicates = pageIds.filter((id, index) => pageIds.indexOf(id) !== index);
  ok(duplicates.length === 0, `${relative}: duplicate id(s): ${[...new Set(duplicates)].join(', ')}`);

  const staticTocs = (source.match(/class=["'][^"']*\b(?:reading-toc|pb-toc)\b[^"']*["']/gi) || []).length;
  ok(staticTocs <= 1, `${relative}: multiple static lesson TOCs found`);

  for (const match of source.matchAll(/<(?:a|link|script|img|source)\b[^>]*\b(?:href|src)=["']([^"']+)["'][^>]*>/gi)) {
    const reference = match[1];
    const target = localTarget(page, reference);
    if (!target) continue;
    checkedReferences += 1;
    let resolved = target;
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) resolved = path.join(resolved, 'index.html');
    ok(fs.existsSync(resolved), `${relative}: broken local reference ${reference}`);
  }

  for (const match of source.matchAll(/<a\b[^>]*href=["']([^"']*)["'][^>]*>/gi)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(href)) continue;
    const fragment = href.includes('#') ? href.slice(href.indexOf('#') + 1) : '';
    if (!fragment || /[{}$]/.test(fragment)) continue;
    const target = localTarget(page, href) || page;
    let resolved = target;
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) resolved = path.join(resolved, 'index.html');
    if (fs.existsSync(resolved) && resolved.endsWith('.html')) ok(ids(resolved).has(fragment), `${relative}: broken anchor ${href}`);
  }

  for (const tag of source.matchAll(/<img\b[^>]*>/gi)) ok(/\balt=["'][^"']*["']/i.test(tag[0]), `${relative}: image is missing alt`);
  for (const tag of source.matchAll(/<a\b[^>]*\btarget=["']_blank["'][^>]*>/gi)) ok(/\brel=["'][^"']*(?:noopener|noreferrer)[^"']*["']/i.test(tag[0]), `${relative}: target=_blank needs rel=noopener or noreferrer`);
}

const quizRuntime = read(path.join(root, 'assets/course/quiz.js'));
ok(quizRuntime.includes('aria-live'), 'shared quiz feedback must announce state changes');
ok(quizRuntime.includes('setAttribute("role", "status")'), 'shared quiz feedback must use role=status');
const eecsRuntime = read(path.join(root, 'courses/eecs498/assets/eecs498.js'));
ok(eecsRuntime.includes('aria-live'), 'EECS498 depth feedback must announce state changes');

if (failures.length) {
  console.error(`Site integrity lint failed (${failures.length})`);
  for (const failure of failures.slice(0, 200)) console.error(`- ${failure}`);
  if (failures.length > 200) console.error(`- ... ${failures.length - 200} more`);
  process.exit(1);
}
console.log(`SITE_INTEGRITY_OK courses=${courseIds.size} html=${pages.length} localRefs=${checkedReferences}`);
