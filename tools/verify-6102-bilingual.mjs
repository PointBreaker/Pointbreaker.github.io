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

function localResources(file, html) {
  const baseHref = (html.match(/<base[^>]*href=["']([^"']*)/i) || [])[1] || '';
  const baseDirectory = baseHref
    ? path.resolve(path.dirname(file), baseHref)
    : path.dirname(file);
  const resources = [];
  for (const tagMatch of html.matchAll(/<[^>]+>/gi)) {
    const tag = tagMatch[0];
    for (const match of tag.matchAll(/\b(src|data)=["']([^"']*)/gi)) {
      const value = match[2];
      const resourcePath = value.split(/[?#]/)[0];
      if (!resourcePath || /^(?:https?:|data:|#|\/\/|\/)/i.test(resourcePath)) continue;
      resources.push({
        attribute: match[1],
        href: value,
        file: path.resolve(baseDirectory, resourcePath),
      });
    }
  }
  return resources;
}

function externalUrls(html) {
  return [...html.matchAll(/(?:href|src|data-[\w-]+)=["'](https?:[^"']+)/gi)]
    .map(match => match[1]);
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

  const missingResources = localResources(file, html).filter(resource => !fs.existsSync(resource.file));
  if (missingResources.length) {
    failures.push(`${file}: missing local resource(s): ${missingResources.map(resource => `${resource.attribute}=${resource.href}`).join(', ')}`);
  }

  if (!/<script\b[^>]*src=["'][^"']*i18n\.js/i.test(html)) {
    failures.push(`${file}: missing i18n.js entry point`);
  }

  const source = sourcePage(file);
  if (!fs.existsSync(source)) {
    failures.push(`${file}: cannot map to its English source page`);
    continue;
  }

  // Root mirrors are legacy redirect targets. Their markup predates the
  // canonical nested pages, so compare external resources on canonical
  // Chinese pages only; those URLs must remain byte-for-byte identical to
  // the English source so embedded exercises and external docs keep working.
  const rootMirror = `${courseRoot}${path.sep}zh${path.sep}`;
  if (!file.startsWith(rootMirror)) {
    const sourceUrls = externalUrls(fs.readFileSync(source, 'utf8'));
    const chineseUrls = externalUrls(html);
    if (sourceUrls.length !== chineseUrls.length) {
      failures.push(`${file}: external URL count differs from English source (${chineseUrls.length} vs ${sourceUrls.length})`);
    } else {
      const mismatches = chineseUrls
        .map((url, index) => url === sourceUrls[index] ? null : `${index}: ${url} != ${sourceUrls[index]}`)
        .filter(Boolean);
      if (mismatches.length) {
        failures.push(`${file}: external URL mismatch (${mismatches.slice(0, 3).join('; ')})`);
      }
    }
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
