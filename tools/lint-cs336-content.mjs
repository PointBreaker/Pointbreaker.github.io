import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const lesson = (name) => fs.readFileSync(path.join(root, 'courses/cs336/lessons', name), 'utf8');
const failures = [];

function requireText(file, text, label) {
  if (!file.includes(text)) failures.push(`missing: ${label}`);
}

function forbid(file, pattern, label) {
  if (pattern.test(file)) failures.push(`forbidden: ${label}`);
}

const l1 = lesson('0001-intro-tokenization.html');
requireText(l1, 'bytes/token', 'Lesson 1 uses bytes/token');
requireText(l1, '任何 merge 都不能跨 pre-token boundary', 'Lesson 1 states the pre-token boundary invariant');
forbid(l1, /压缩比[^。\n]{0,80}(?:1\s*character\/token|1\s*字符\/token)/i, 'Lesson 1 must not define compression ratio in characters/token');
forbid(l1, /["“]cat["”]\s*\+\s*["“]erpillar["”]/i, 'Lesson 1 must not use the misleading cat + erpillar boundary example');

const l4 = lesson('0004-attention-alternatives-moe.html');
requireText(l4, 'Attention intermediate memory（不含 KV cache）', 'Lesson 4 scopes quadratic intermediate memory');
requireText(l4, '历史 K/V storage 则随已缓存 context length 线性增长', 'Lesson 4 separates decode KV cache growth');
forbid(l4, /<th>推理内存<\/th>/, 'Lesson 4 must not label quadratic intermediates as generic inference memory');

const l8 = lesson('0008-parallelism-2.html');
requireText(l8, '状态分片行为与 ZeRO Stage 3 的核心思想高度类似', 'Lesson 8 states the FSDP/ZeRO relationship precisely');
forbid(l8, /FSDP[^。\n]{0,80}(?:是|=)[^。\n]{0,40}ZeRO Stage 3[^。\n]{0,20}实现/i, 'Lesson 8 must not equate FSDP with a ZeRO-3 implementation');

const l10 = lesson('0010-inference.html');
requireText(l10, '被 attention window size 上界约束', 'Lesson 10 bounds local KV cache by window size');
requireText(l10, 'u\\le \\min(1,p(d_i)/q(d_i))', 'Lesson 10 keeps the speculative acceptance probability');
requireText(l10, 'activation-aware 的通道缩放', 'Lesson 10 preserves the AWQ mechanism');
requireText(l10, 'Paper-specific result', 'Lesson 10 labels the Orca result as paper-specific');
requireText(l10, 'Benchmark-specific', 'Lesson 10 labels speculative speedups as benchmark-specific');
forbid(l10, /KV cache 不依赖序列长度/, 'Lesson 10 must not claim local KV cache is sequence-length independent');
forbid(l10, /实际加速\s*[:：]\s*\d+(?:\s*[-–]\s*\d+)?×/, 'Lesson 10 must not state an unscoped universal speedup');

const auditPath = path.join(root, 'courses/cs336/TEACHING-EXPERIENCE-AUDIT.md');
const audit = fs.readFileSync(auditPath, 'utf8');
for (const phrase of [
  'Lesson 1 的 tokenizer efficiency 统一使用 bytes/token',
  'Lesson 4 将 `O(n²)` 精确限定为 naive attention intermediate',
  'Lesson 8 将 FSDP 表述为 PyTorch 原生 fully sharded data parallelism',
  'Lesson 10 将 local-attention KV cache 表述为受 window size 上界约束'
]) requireText(audit, phrase, `audit claim exists: ${phrase}`);

const bankSource = fs.readFileSync(path.join(root, 'courses/cs336/assets/assignment-bank.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(bankSource, context, { filename: 'assignment-bank.js' });
const assignmentBank = context.window.CS336AssignmentBank;
const expectedStages = { '01': 4, '02': 6, '03': 5, '04': 6, '05': 6 };
const expectedLocalization = {
  '01': { translated: 39, matched: 38, officialOnly: 0, legacyOnly: 1 },
  '02': { translated: 22, matched: 18, officialOnly: 9, legacyOnly: 4 },
  '03': { translated: 3, matched: 2, officialOnly: 0, legacyOnly: 1 },
  '04': { translated: 14, matched: 13, officialOnly: 0, legacyOnly: 1 },
  '05': { translated: 43, matched: 21, officialOnly: 23, legacyOnly: 22 }
};
const localizationAudit = [];
const officialProblemId = (entry) => {
  const candidate = String(entry).split(' · ')[0].trim();
  return /^[a-z0-9_]+$/.test(candidate) ? candidate : '';
};
const normalizedProblemId = (id) => String(id).toLowerCase().replace(/[^a-z0-9]/g, '');
let assignmentLessonLinkCount = 0;
for (const [id, stageCount] of Object.entries(expectedStages)) {
  const assignment = assignmentBank?.[id];
  if (!assignment) {
    failures.push(`missing assignment workbook ${id}`);
    continue;
  }
  if (assignment.stages.length !== stageCount) failures.push(`Assignment ${id}: expected ${stageCount} stages, got ${assignment.stages.length}`);
  assignment.stages.forEach((stage) => {
    for (const field of ['build', 'why', 'readiness', 'official', 'contract', 'done', 'sanity', 'failures', 'hints', 'experiment', 'lessons']) {
      if (!stage[field] || (Array.isArray(stage[field]) && stage[field].length === 0)) failures.push(`Assignment ${id}/${stage.id}: missing ${field}`);
    }
    if (stage.hints?.length !== 3) failures.push(`Assignment ${id}/${stage.id}: expected 3 hints`);
    if (stage.failures?.length < 2) failures.push(`Assignment ${id}/${stage.id}: expected at least 2 failure signatures`);
    for (const field of ['input', 'output', 'shape', 'invariants', 'forbidden']) {
      if (!stage.contract?.[field]?.length) failures.push(`Assignment ${id}/${stage.id}: contract missing ${field}`);
    }
    for (const field of ['hypothesis', 'prediction', 'experiment', 'observation', 'explanation']) {
      if (!stage.experiment?.[field]) failures.push(`Assignment ${id}/${stage.id}: experiment loop missing ${field}`);
    }
    stage.lessons?.forEach(({ href }) => {
      assignmentLessonLinkCount += 1;
      const match = href.match(/^\.\.\/([^#]+\.html)#([\w-]+)$/);
      if (!match) {
        failures.push(`Assignment ${id}/${stage.id}: malformed Lesson cross-link ${href}`);
        return;
      }
      const target = lesson(match[1]);
      if (!target.includes(`id="${match[2]}"`)) failures.push(`Assignment ${id}/${stage.id}: missing Lesson target ${href}`);
    });
  });
  const html = fs.readFileSync(path.join(root, `courses/cs336/lessons/assignments/ass${id}-${['basics', 'systems', 'scaling', 'data', 'alignment'][Number(id) - 1]}.html`), 'utf8');
  requireText(html, 'assignment-bank.js', `Assignment ${id} loads the workbook bank`);
  requireText(html, 'assignment-workbook.js', `Assignment ${id} loads the workbook renderer`);
  requireText(html, 'Handout 完整本土化', `Assignment ${id} retains localized handout markers`);
  requireText(html, '完整任务', `Assignment ${id} retains full-task copy`);

  const translatedIds = [...html.matchAll(/<span class="problem-number">([^<]+)<\/span>/g)].map((match) => match[1].trim());
  const uniqueTranslatedIds = new Set(translatedIds);
  if (translatedIds.length !== uniqueTranslatedIds.size) failures.push(`Assignment ${id}: duplicate localized problem IDs`);
  const officialIds = new Set(assignment.stages.flatMap((stage) => stage.official.map(officialProblemId)).filter(Boolean));
  const normalizedTranslatedIds = new Set(translatedIds.map(normalizedProblemId));
  const matched = [...officialIds].filter((problemId) => normalizedTranslatedIds.has(normalizedProblemId(problemId)));
  const officialOnly = [...officialIds].filter((problemId) => !normalizedTranslatedIds.has(normalizedProblemId(problemId)));
  const legacyOnly = translatedIds.filter((problemId) => ![...officialIds].some((officialId) => normalizedProblemId(officialId) === normalizedProblemId(problemId)));
  const actualLocalization = { translated: translatedIds.length, matched: matched.length, officialOnly: officialOnly.length, legacyOnly: legacyOnly.length };
  localizationAudit.push({ assignment: id, ...actualLocalization });
  Object.entries(expectedLocalization[id]).forEach(([field, expected]) => {
    if (actualLocalization[field] !== expected) failures.push(`Assignment ${id}: expected localization ${field}=${expected}, got ${actualLocalization[field]}`);
  });
}

if (assignmentLessonLinkCount !== 52) failures.push(`expected 52 Assignment → Lesson links, got ${assignmentLessonLinkCount}`);

const lessonLayout = fs.readFileSync(path.join(root, 'courses/cs336/assets/lesson-layout.js'), 'utf8');
const buildLinks = [...lessonLayout.matchAll(/'assignments\/ass(0[1-5])-[^']+\.html#workbook-stage-([\w-]+)'/g)];
if (buildLinks.length !== 16) failures.push(`expected 16 Lesson → Assignment build links, got ${buildLinks.length}`);
buildLinks.forEach(([, assignmentId, stageId]) => {
  const targetExists = assignmentBank?.[assignmentId]?.stages.some((stage) => stage.id === stageId);
  if (!targetExists) failures.push(`Lesson build link targets missing Assignment ${assignmentId} stage ${stageId}`);
});

const workbookRenderer = fs.readFileSync(path.join(root, 'courses/cs336/assets/assignment-workbook.js'), 'utf8');
for (const phrase of ['semanticContent', 'translatedProblems', 'officialSourceContent', 'legacyGuide', 'legacySupplement', 'miscReference', 'problemAnchor', 'data-problem-target', 'activateProblem', '完整中文题面', '2026 ID Matched · Needs Review']) {
  requireText(workbookRenderer, phrase, `Assignment renderer localization architecture: ${phrase}`);
}
forbid(workbookRenderer, /\bconst\s+oldNodes\b|oldNodes\.push/, 'Assignment renderer must not collect all old nodes indiscriminately');

const recoveryReport = fs.readFileSync(path.join(root, 'courses/cs336/ASSIGNMENT-LOCALIZATION-RECOVERY-REPORT.md'), 'utf8');
for (const phrase of [
  '39 / 39',
  '22 / 22',
  '3 / 3',
  '14 / 14',
  '43 / 43',
  'Current-version verified',
  '从 Git 历史恢复的译文数量为 **0**'
]) requireText(recoveryReport, phrase, `localization recovery report claim: ${phrase}`);

if (failures.length) {
  console.error('CS336 content lint failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Assignment localization audit:');
localizationAudit.forEach((row) => console.log(`- A${row.assignment}: translated=${row.translated}, matched=${row.matched}, official-only=${row.officialOnly}, legacy-only=${row.legacyOnly}`));
console.log('CS336 content lint passed (Lesson accuracy + Workbook structure + localization regression).');
