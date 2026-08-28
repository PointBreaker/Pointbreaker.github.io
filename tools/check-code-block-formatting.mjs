#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const roots = process.argv.slice(2);
if (!roots.length) roots.push('courses');

const walk = (target) => {
  const stat = fs.statSync(target);
  if (stat.isFile()) return target.endsWith('.html') ? [target] : [];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(target, entry.name);
    return entry.isDirectory() ? walk(child) : child.endsWith('.html') ? [child] : [];
  });
};

const failures = [];
for (const file of roots.flatMap(walk)) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/<code\b(?:[^>"']|"[^"]*"|'[^']*')*>[^<]*<\/(?:em|strong|span)>/gi)) {
    const line = html.slice(0, match.index).split('\n').length;
    failures.push(`${file}:${line}: <code> is closed by a different inline tag`);
  }
  for (const match of html.matchAll(/<(?:em|strong|span)\b(?:[^>"']|"[^"]*"|'[^']*')*>[^<]*<\/code>/gi)) {
    const line = html.slice(0, match.index).split('\n').length;
    failures.push(`${file}:${line}: </code> closes a different inline tag`);
  }
  for (const match of html.matchAll(/<code\b[^>]*>([\s\S]*?)<\/code>/gi)) {
    const lastPreOpen = html.lastIndexOf('<pre', match.index);
    const lastPreClose = html.lastIndexOf('</pre>', match.index);
    if (lastPreOpen > lastPreClose) continue;
    if (!/[\r\n]/.test(match[1])) continue;
    const line = html.slice(0, match.index).split('\n').length;
    failures.push(`${file}:${line}: multiline code must use <pre><code> so browsers preserve indentation`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  console.error(`\n${failures.length} malformed code tag or multiline code block(s) found.`);
  process.exit(1);
}

console.log(`Code block formatting OK (${roots.join(', ')})`);
