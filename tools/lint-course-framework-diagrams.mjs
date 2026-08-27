#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const failures = [];
const requireCondition = (condition, message) => { if (!condition) failures.push(message); };
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

const assetCss = 'framework-diagrams.css?v=20260827c';
const assetJs = 'framework-diagrams.js?v=20260827c';
const lessonGroups = [
  ['courses/cs336/lessons', 19],
  ['courses/cs267/lessons', 27]
];

for (const [directory, expectedCount] of lessonGroups) {
  const files = fs.readdirSync(path.join(root, directory)).filter((file) => file.endsWith('.html'));
  requireCondition(files.length === expectedCount, `${directory}: expected ${expectedCount} lesson pages, found ${files.length}`);
  for (const file of files) {
    const html = read(`${directory}/${file}`);
    requireCondition(html.includes(assetCss), `${directory}/${file}: diagram CSS is not loaded`);
    requireCondition(html.includes(assetJs), `${directory}/${file}: diagram renderer is not loaded`);
  }
}

const renderer = read('assets/course/framework-diagrams.js');
const styles = read('assets/course/framework-diagrams.css');
const expectedDefinitions = [
  ['cs336', '0001-intro-tokenization.html', 'Tokenizer pipeline'],
  ['cs336', '0002-pytorch-resource-accounting.html', 'Resource accounting'],
  ['cs336', '0003-architectures-hyperparameters.html', 'Transformer block'],
  ['cs336', '0004-attention-alternatives-moe.html', 'Three different reductions'],
  ['cs336', '0005-gpus.html', 'GPU memory hierarchy'],
  ['cs336', '0006-kernels-triton.html', 'Kernel optimization loop'],
  ['cs336', '0007-parallelism.html', 'Parallelism object map'],
  ['cs336', '0008-parallelism-2.html', 'ZeRO state map'],
  ['cs336', '0009-scaling-laws.html', 'Scaling experiment'],
  ['cs336', '0010-inference.html', 'Training vs inference'],
  ['cs336', '0011-scaling-laws-details.html', 'Evidence chain'],
  ['cs336', '0012-evaluation.html', 'Evaluation pipeline'],
  ['cs336', '0013-data-sources.html', 'Data provenance'],
  ['cs336', '0014-data-filtering-dedup.html', 'Data selection pipeline'],
  ['cs336', '0015-alignment-sft-rlhf.html', 'Alignment signals'],
  ['cs336', '0016-alignment-rlvr.html', 'RLVR loop'],
  ['cs336', '0017-alignment-rl.html', 'Multimodal routes'],
  ['cs336', '0018-guest-daniel-selsam.html', 'Generate–verify loop'],
  ['cs336', '0019-guest-dan-fu.html', 'Systems optimization'],
  ['cs267', '01-introduction.html', 'Reduction'],
  ['cs267', '03-matmul-roofline.html', 'Roofline model'],
  ['cs267', '08-advanced-mpi.html', 'Ring collective'],
  ['cs267', '08-advanced-mpi.html', 'Recursive doubling'],
  ['cs267', '15-parallel-matmul.html', 'SUMMA iteration'],
  ['cs267', '16-dense-la.html', 'Blocked GEPP'],
  ['cs267', '16-dense-la.html', 'TSQR reduction tree'],
  ['cs267', '16-dense-la.html', 'Task dependency DAG'],
  ['cs267', '20-fft.html', 'Distributed 3D FFT'],
  ['cs267', '25-graph-partitioning.html', 'Graph vs hypergraph model']
];

for (const [course, file, label] of expectedDefinitions) {
  requireCondition(renderer.includes(`/${course}/lessons/${file}`), `${course}/${file}: missing diagram definition`);
  requireCondition(renderer.includes(`kicker: '${label}'`), `${course}/${file}: missing diagram label ${label}`);
}

for (const selector of ['.framework-diagram', '.fd-flow', '.fd-lanes', '.fd-tree', '.fd-roofline']) {
  requireCondition(styles.includes(selector), `diagram CSS missing ${selector}`);
}
requireCondition(renderer.includes("pre.replaceWith(figure)"), 'renderer must replace the ASCII block with the semantic figure');
requireCondition(renderer.includes('查看文本版 / 精确符号'), 'renderer must preserve the source text as a collapsible fallback');

if (failures.length) {
  console.error(`Course framework diagram lint failed (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Course framework diagram lint passed: ${expectedDefinitions.length} semantic diagrams across 46 lesson pages.`);
