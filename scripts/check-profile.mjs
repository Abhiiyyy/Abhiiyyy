import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const offline = process.argv.includes('--offline');
const failures = [];
const destinations = new Set();
const markdown = [];
const markdownCache = new Map();

async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    const file = path.join(dir, item.name);
    if (item.isDirectory()) await walk(file);
    else if (item.name.endsWith('.md')) markdown.push(file);
  }
}

function body(text) { return text.replace(/```[^\n]*\n[\s\S]*?```/g, ''); }
function anchors(text) {
  const counts = new Map();
  const result = new Set();
  for (const match of body(text).matchAll(/^#{1,6}\s+(.+)$/gm)) {
    const slug = match[1].trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-');
    const index = counts.get(slug) || 0;
    counts.set(slug, index + 1);
    result.add(index ? `${slug}-${index}` : slug);
  }
  return result;
}

async function textFor(file) {
  if (!markdownCache.has(file)) markdownCache.set(file, await readFile(file, 'utf8'));
  return markdownCache.get(file);
}

await walk(root);
for (const file of markdown) {
  const text = await textFor(file);
  const label = path.relative(root, file);
  const reviewed = text.match(/Last reviewed:\s*(\d{4}-\d{2}-\d{2})/);
  if (file.includes(`${path.sep}docs${path.sep}`) && path.basename(file) !== 'maintenance.md' && !reviewed) {
    failures.push(`${label}: missing Last reviewed date`);
  }
  if (reviewed) {
    const date = new Date(`${reviewed[1]}T00:00:00Z`);
    const age = (Date.now() - date.getTime()) / 86400000;
    if (!Number.isFinite(age) || age > 90 || age < -2) failures.push(`${label}: review date is invalid, future-dated, or over 90 days old`);
  }
  for (const match of body(text).matchAll(/!?\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const target = match[1];
    if (/^https:\/\//.test(target)) { destinations.add(target); continue; }
    if (/^mailto:/i.test(target)) {
      if (!/^mailto:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(target)) failures.push(`${label}: invalid email link: ${target}`);
      continue;
    }
    if (/^[a-z][a-z0-9+.-]*:/i.test(target)) { failures.push(`${label}: unsupported link scheme`); continue; }
    const [relative, fragment] = target.split('#');
    const resolved = relative ? path.resolve(path.dirname(file), decodeURIComponent(relative)) : file;
    const inside = path.relative(root, resolved);
    if (inside.startsWith(`..${path.sep}`) || inside === '..' || path.isAbsolute(inside)) {
      failures.push(`${label}: link escapes repository: ${target}`); continue;
    }
    try {
      await access(resolved);
      if (fragment && resolved.endsWith('.md') && !anchors(await textFor(resolved)).has(decodeURIComponent(fragment))) {
        failures.push(`${label}: missing heading: ${target}`);
      }
    } catch { failures.push(`${label}: missing file: ${target}`); }
  }
}

for (const url of offline ? [] : destinations) {
  let ok = false;
  let last = 'network error';
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'Abhiiyyy-profile-health' }, signal: AbortSignal.timeout(15000), redirect: 'follow' });
      last = `HTTP ${response.status}`;
      await response.body?.cancel();
      if (response.ok && !new URL(response.url).pathname.startsWith('/login')) { ok = true; break; }
      if (![429, 500, 502, 503, 504].includes(response.status)) break;
    } catch (error) { last = error.name; }
    if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
  }
  if (!ok) failures.push(`Public destination unavailable: ${url} (${last})`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`PASS: ${markdown.length} Markdown files; local links, anchors and dates${offline ? '; network skipped' : `; ${destinations.size} public destinations`}.`);
}
