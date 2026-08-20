import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(new URL('.', import.meta.url).pathname, '..');
const courseRoot = path.join(repoRoot, 'courses/6.102/offline/sp26');
const i18nSource = fs.readFileSync(path.join(courseRoot, 'i18n.js'), 'utf8');
const failures = [];
const pages = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html') && file.includes(`${path.sep}zh${path.sep}`)) pages.push(file);
  }
}

function attr(tag, name) {
  return (tag.match(new RegExp(`${name}=["']([^"']*)`, 'i')) || [])[1] || '';
}

function sourcePage(file) {
  const rootMirror = `${courseRoot}${path.sep}zh${path.sep}`;
  if (file.startsWith(rootMirror)) {
    return path.join(courseRoot, file.slice(rootMirror.length));
  }
  return file.replace(`${path.sep}zh${path.sep}`, path.sep);
}

function localStyles(file, html) {
  const baseHref = (html.match(/<base[^>]*href=["']([^"']*)/i) || [])[1] || '';
  const baseDirectory = baseHref
    ? path.resolve(path.dirname(file), baseHref)
    : path.dirname(file);
  const styles = [];
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    if (!/rel=["'][^"']*stylesheet/i.test(tag)) continue;
    const href = attr(tag, 'href');
    if (!href || /^(?:https?:|data:|\/\/)/i.test(href)) continue;
    styles.push({ href, file: path.resolve(baseDirectory, href) });
  }
  return styles;
}

walk(courseRoot);

if (!i18nSource.includes('i18n-switch')) {
  failures.push('i18n.js does not define the shared segmented language switch');
}

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const styles = localStyles(file, html);
  const missingStyles = styles.filter(style => !fs.existsSync(style.file));
  if (missingStyles.length) {
    failures.push(`${file}: missing stylesheet(s): ${missingStyles.map(style => style.href).join(', ')}`);
  }

  if (!/<script\b[^>]*src=["'][^"']*i18n\.js/i.test(html)) {
    failures.push(`${file}: missing i18n.js entry point`);
  }

  const source = sourcePage(file);
  if (!fs.existsSync(source)) {
    failures.push(`${file}: cannot map to its English source page`);
  }
}

console.log(`Checked ${pages.length} Chinese HTML pages.`);
if (failures.length) {
  console.error(`FAIL: ${failures.length} issue(s)`);
  for (const failure of failures.slice(0, 40)) console.error(`- ${failure}`);
  if (failures.length > 40) console.error(`- ... ${failures.length - 40} more`);
  process.exitCode = 1;
} else {
  console.log('PASS: Chinese pages have resolvable local stylesheets and shared language controls.');
}
