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

const courseInfo = JSON.parse(fs.readFileSync(path.join(root, 'courses/cs336/course-info.json'), 'utf8'));
const courseStatus = JSON.parse(fs.readFileSync(path.join(root, 'courses/cs336/api/status.json'), 'utf8'));
const expectedSchedule = [
  'Overview, tokenization',
  'PyTorch (einops), resource accounting (FLOPs, memory, arithmetic intensity)',
  'Architectures, hyperparameters',
  'Attention alternatives and mixture of experts',
  'GPUs, TPUs',
  'Kernels, Triton',
  'Parallelism',
  'Parallelism',
  'Scaling laws',
  'Inference',
  'Scaling laws',
  'Evaluation',
  'Data (sources, datasets)',
  'Data (filtering, deduplication, mixing, synthetic data)',
  'Mid/post-training (SFT/RLHF)',
  'Post-training - RLVR',
  'Alignment - multimodality',
  'Guest lecture: Daniel Selsam',
  'Guest lecture: Dan Fu'
];
const expectedAssignments = {
  '01': { version: '26.0.3', commit: 'a158843b20107949f1a8d7df1b05cd33b9166712' },
  '02': { version: '26.1.4', commit: 'ca8bc81a59b70516f7ebb2da4808daade877c736' },
  '03': { version: '26.0.5', commit: '03e9372992e913061b9e78b5cfcb62ad8a87de35' },
  '04': { version: '26.0.1', commit: '0555bea66369872d912652debf10b115ca0688c8' },
  '05': { version: '2.0.1', commit: 'c2734a26308710949fe13226960a1e8cece94b7e' }
};

if (courseInfo.term !== 'Spring 2026') failures.push(`course term must be Spring 2026, got ${courseInfo.term}`);
if (courseInfo.homepage !== 'https://cs336.stanford.edu/') failures.push('course homepage must point to the Spring 2026 official site');
if (courseInfo.lectures.length !== 19 || courseStatus.lectures.length !== 19) failures.push('expected 19 lectures in course-info and status');
expectedSchedule.forEach((title, index) => {
  if (courseInfo.lectures[index]?.title !== title) failures.push(`course-info Lecture ${index + 1}: expected official title ${title}`);
  if (courseStatus.lectures[index]?.title !== title) failures.push(`status Lecture ${index + 1}: expected official title ${title}`);
  if (courseInfo.lectures[index]?.lessonFile !== courseStatus.lectures[index]?.lessonFile) failures.push(`Lecture ${index + 1}: course-info/status lesson route mismatch`);
  const target = path.join(root, 'courses/cs336', courseInfo.lectures[index]?.lessonFile || '');
  if (!fs.existsSync(target)) failures.push(`Lecture ${index + 1}: missing lesson file ${courseInfo.lectures[index]?.lessonFile}`);
});
if (courseInfo.sourceSnapshot?.lecturesCommit !== '8b59b50730766695c2ffedd1a79c50cd09b9eb91') failures.push('lecture source snapshot commit drifted');

const l1 = lesson('0001-intro-tokenization.html');
requireText(l1, 'bytes/token', 'Lesson 1 uses bytes/token');
requireText(l1, '任何 merge 都不能跨 pre-token boundary', 'Lesson 1 states the pre-token boundary invariant');
forbid(l1, /压缩比[^。\n]{0,80}(?:1\s*character\/token|1\s*字符\/token)/i, 'Lesson 1 must not define compression ratio in characters/token');
forbid(l1, /["“]cat["”]\s*\+\s*["“]erpillar["”]/i, 'Lesson 1 must not use the misleading cat + erpillar boundary example');

const l4 = lesson('0004-attention-alternatives-moe.html');
requireText(l4, 'Attention intermediate memory（不含 KV cache）', 'Lesson 4 scopes quadratic intermediate memory');
requireText(l4, '历史 K/V storage 则随已缓存 context length 线性增长', 'Lesson 4 separates decode KV cache growth');
forbid(l4, /<th>推理内存<\/th>/, 'Lesson 4 must not label quadratic intermediates as generic inference memory');
requireText(l4, 'attention sparsity ≠ MoE parameter sparsity', 'Lesson 4 separates attention sparsity from MoE sparsity');
requireText(l4, 'DeepSeek Sparse Attention', 'Lesson 4 covers the Spring 2026 learned sparse retrieval delta');

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

const l14 = lesson('0014-data-filtering-dedup.html');
for (const phrase of ['mixture / epoch cap', 'UniMax', 'small-scale 最优配比不一定能直接放大', '合成数据：生成什么，谁来验证', 'Contamination 是 pipeline invariant']) {
  requireText(l14, phrase, `Lesson 14 Spring 2026 delta: ${phrase}`);
}

const l16 = lesson('0016-alignment-rlvr.html');
for (const phrase of ['verifiable outcome ≠ verified reasoning path', 'z-score 不是“免费的无偏 baseline”', 'On-policy 与 off-policy：rollout 来自谁', 'verifier 仍是有覆盖边界、可被利用的 proxy']) {
  requireText(l16, phrase, `Lesson 16 estimator/verifier boundary: ${phrase}`);
}
forbid(l16, /reward hacking[^<。\n]{0,40}几乎不存在/i, 'Lesson 16 must not claim RLVR nearly eliminates reward hacking');
forbid(l16, /组内均值[^<。\n]{0,50}(?:V\(s\)|value)[^<。\n]{0,30}无偏/i, 'Lesson 16 must not call the group mean an unbiased value estimate');
forbid(l16, /CoT[^<。\n]{0,30}(?:不是|无需)[^<。\n]{0,20}SFT/i, 'Lesson 16 must not claim CoT has an exclusive non-SFT origin');

const l17 = lesson('0017-alignment-rl.html');
requireText(l17, '讲次主线以 Stanford Lecture 17 trace 为准', 'Lesson 17 separates official provenance from CourseStack paper expansions');

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
  const expectedAssignment = expectedAssignments[id];
  if (!assignment.version.includes(expectedAssignment.version)) failures.push(`Assignment ${id}: workbook version mismatch`);
  if (assignment.checkedAt !== '2026-08-30') failures.push(`Assignment ${id}: missing checkedAt snapshot`);
  if (assignment.sourceCommit !== expectedAssignment.commit) failures.push(`Assignment ${id}: workbook source commit mismatch`);
  const metadata = courseInfo.assignments.find((item) => item.number === Number(id));
  if (metadata?.version !== expectedAssignment.version || metadata?.sourceCommit !== expectedAssignment.commit || metadata?.checkedAt !== '2026-08-30') failures.push(`Assignment ${id}: course-info version snapshot mismatch`);
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
  requireText(html, expectedAssignment.version, `Assignment ${id} exposes the active version`);
  requireText(html, expectedAssignment.commit.slice(0, 7), `Assignment ${id} exposes the source commit`);
  forbid(html, /problem-row|Handout 完整本土化|legacy supplement|Legacy Reference|Spring 2025 Qwen|下方旧版/, `Assignment ${id} active page must not carry Spring 2025 problem DOM`);
  if (!assignment.archiveHref) failures.push(`Assignment ${id}: missing archiveHref`);
  const archivePath = path.join(root, 'courses/cs336/lessons/assignments', assignment.archiveHref || 'missing');
  if (!fs.existsSync(archivePath)) {
    failures.push(`Assignment ${id}: missing historical archive ${assignment.archiveHref}`);
    continue;
  }
  const archive = fs.readFileSync(archivePath, 'utf8');
  requireText(archive, 'Historical archive · not part of the active Spring 2026 curriculum', `Assignment ${id} archive boundary`);
  requireText(archive, 'Handout 完整本土化', `Assignment ${id} archive retains localized handout markers`);
  requireText(archive, '完整任务', `Assignment ${id} archive retains full-task copy`);

  const translatedIds = [...archive.matchAll(/<span class="problem-number">([^<]+)<\/span>/g)].map((match) => match[1].trim());
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
for (const phrase of ['lesson-opening', '30-second mental model', 'Source · Stanford CS336 Spring 2026', 'firstMechanismHeading', "heading.textContent = 'Next'"]) {
  requireText(lessonLayout, phrase, `Lesson reading-flow renderer: ${phrase}`);
}
forbid(lessonLayout, /className = 'lesson-outcomes'/, 'Lesson opening must not add a second outcomes card');
const buildLinks = [...lessonLayout.matchAll(/'assignments\/ass(0[1-5])-[^']+\.html#workbook-stage-([\w-]+)'/g)];
if (buildLinks.length !== 16) failures.push(`expected 16 Lesson → Assignment build links, got ${buildLinks.length}`);
buildLinks.forEach(([, assignmentId, stageId]) => {
  const targetExists = assignmentBank?.[assignmentId]?.stages.some((stage) => stage.id === stageId);
  if (!targetExists) failures.push(`Lesson build link targets missing Assignment ${assignmentId} stage ${stageId}`);
});

const workbookRenderer = fs.readFileSync(path.join(root, 'courses/cs336/assets/assignment-workbook.js'), 'utf8');
for (const phrase of ['workbook-source-line', 'Version & provenance', 'Problem guide · Official IDs', 'Official sources', 'Historical note · 2025 → 2026', 'assignment.archiveHref']) {
  requireText(workbookRenderer, phrase, `Assignment renderer reading-flow architecture: ${phrase}`);
}
forbid(workbookRenderer, /translatedProblems|localized-problems|data-problem-target|activateProblem|2025 题面参考|2026 ID Matched/, 'Active Workbook renderer must not rebuild the Spring 2025 problem archive');

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

console.log('Assignment archive regression:');
localizationAudit.forEach((row) => console.log(`- A${row.assignment}: archived=${row.translated}, matched=${row.matched}, official-only=${row.officialOnly}, archive-only=${row.legacyOnly}`));
console.log('CS336 content lint passed (Lesson accuracy + active Workbook flow + archive regression).');
