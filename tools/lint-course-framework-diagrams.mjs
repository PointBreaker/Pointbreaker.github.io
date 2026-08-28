#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const failures = [];
const requireCondition = (condition, message) => { if (!condition) failures.push(message); };
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

const assetCss = 'framework-diagrams.css?v=';
const assetJs = 'framework-diagrams.js?v=';
const lessonGroups = [
  ['courses/cs336/lessons', 19],
  ['courses/cs267/lessons', 27],
  ['courses/6.1810/lessons', 23]
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
  ['cs267', '25-graph-partitioning.html', 'Graph vs hypergraph model'],
  ['6.1810', '01-introduction.html', 'Operating-system stack'],
  ['6.1810', '02-c-in-xv6.html', 'Process address space'],
  ['6.1810', '03-os-design.html', 'Protected kernel path'],
  ['6.1810', '04-organization.html', 'Microkernel service path'],
  ['6.1810', '05-page-tables.html', 'Address translation'],
  ['6.1810', '05-page-tables.html', 'Sv39 page-table walk'],
  ['6.1810', '06-syscall-entry.html', 'System-call round trip'],
  ['6.1810', '07-interposition.html', 'Interposition boundary'],
  ['6.1810', '08-page-faults.html', 'Lazy allocation'],
  ['6.1810', '08-page-faults.html', 'Copy-on-write fork'],
  ['6.1810', '09-superpages.html', 'TLB reach'],
  ['6.1810', '10-uservm.html', 'User-level VM control'],
  ['6.1810', '11-interrupts.html', 'Device interrupt path'],
  ['6.1810', '12-locking.html', 'Lock acquisition'],
  ['6.1810', '13-threads.html', 'Context-switch state'],
  ['6.1810', '14-coordination.html', 'Lost-wakeup race'],
  ['6.1810', '15-networking.html', 'Kernel network datapath'],
  ['6.1810', '16-shenango.html', 'Conventional Linux path'],
  ['6.1810', '16-shenango.html', 'Kernel bypass'],
  ['6.1810', '17-fs.html', 'xv6 file-system layers'],
  ['6.1810', '18-crash.html', 'Three storage states'],
  ['6.1810', '18-crash.html', 'Write-ahead logging'],
  ['6.1810', '19-journal.html', 'ext3 journal record'],
  ['6.1810', '19-journal.html', 'Journal recovery'],
  ['6.1810', '20-rcu.html', 'RCU update lifecycle'],
  ['6.1810', '21-isolation.html', 'Two-dimensional translation'],
  ['6.1810', '22-bpf.html', 'Safe in-kernel extension'],
  ['6.1810', '23-meltdown.html', 'Transient-execution side channel']
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

console.log(`Course framework diagram lint passed: ${expectedDefinitions.length} semantic diagrams across ${lessonGroups.reduce((sum, [, count]) => sum + count, 0)} lesson pages.`);
