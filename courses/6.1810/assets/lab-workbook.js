(function () {
  const page = document.querySelector('.page');
  const match = location.pathname.match(/\/labs\/([^/]+)\.html$/);
  const bank = window.MIT61810LabBank;
  if (!page || !match || !bank?.[match[1]] || page.dataset.workbookReady) return;
  const data = bank[match[1]];
  page.dataset.workbookReady = 'true';
  document.body.classList.add('mit61810-workbook');
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  const slugify = (value) => String(value).trim().toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/g, '-').replace(/^-+|-+$/g, '') || 'problem';
  const originalHeadings = [...page.querySelectorAll(':scope > h2, :scope > h3')];
  const originalProblemNodes = [...page.querySelectorAll(':scope > h2, :scope > h3, :scope > p, :scope > ul > li, :scope > .lab-required')];
  const used = new Set([...page.querySelectorAll('[id]')].map((node) => node.id));
  originalHeadings.forEach((heading, index) => { if (heading.id) return; const base = `lab-problem-${slugify(heading.textContent.replace(/简单|中等|困难/g, ''))}`; let id = base; let n = 2; while (used.has(id)) id = `${base}-${n++}`; heading.id = id; used.add(id); });
  const findProblem = (label) => {
    const target = originalProblemNodes.find((node) => node.textContent.toLowerCase().includes(label.toLowerCase()));
    if (target && !target.id) {
      let id = `lab-problem-${slugify(label)}`; let n = 2;
      while (used.has(id)) id = `lab-problem-${slugify(label)}-${n++}`;
      target.id = id; used.add(id);
    }
    return target;
  };

  const meta = page.querySelector(':scope > .meta');
  const version = el('aside', 'workbook-version');
  version.innerHTML = `<p><strong>版本与权威来源</strong></p><p>${data.version}</p>`;
  meta?.insertAdjacentElement('afterend', version);
  const primary = el('nav', 'assignment-primary-nav'); primary.setAttribute('aria-label', 'Lab 页面资源');
  primary.innerHTML = `<a href="#engineering-workbook">Engineering Workbook</a><a href="#chinese-task">中文完整题面</a><a href="${data.officialBase}${match[1]}.html" target="_blank" rel="noopener">Official Lab ↗</a>`;
  version.insertAdjacentElement('afterend', primary);

  const workbook = el('section', 'engineering-workbook'); workbook.id = 'engineering-workbook';
  const header = el('header', 'workbook-header'); header.append(el('p', 'workbook-kicker', 'Engineering Workbook'), el('h2', '', '先理解工程目标，再进入完整题面'));
  const mission = el('p', 'workbook-mission', data.mission); header.appendChild(mission);
  const caps = el('div', 'capability-row'); data.capabilities.forEach((item) => caps.append(el('span', '', item))); header.appendChild(caps); workbook.appendChild(header);
  const map = el('nav', 'stage-map'); map.setAttribute('aria-label', '实验阶段');
  data.stages.forEach((stage, index) => { const link = el('a', '', String(index + 1).padStart(2, '0')); link.href = `#workbook-stage-${stage.id}`; link.title = stage.title; const label = el('span', '', stage.title.replace(/^Stage \d+ · /, '')); link.appendChild(label); map.appendChild(link); }); workbook.appendChild(map);

  data.stages.forEach((stage, index) => {
    const section = el('section', 'workbook-stage'); section.id = `workbook-stage-${stage.id}`;
    const stageHeader = el('header', 'stage-header'); stageHeader.append(el('p', 'stage-number', `Stage ${String(index + 1).padStart(2, '0')}`), el('h2', '', stage.title.replace(/^Stage \d+ · /, '')), el('p', 'stage-build', stage.build)); section.appendChild(stageHeader);
    const overview = el('div', 'stage-overview');
    const depends = el('section', 'stage-depends'); depends.innerHTML = '<h3>Depends On · 快速复习</h3>';
    const depList = el('ul'); stage.lessons.forEach(([href, label]) => { const li = el('li'); li.innerHTML = `<a href="${href}">${label} →</a>`; depList.appendChild(li); }); depends.appendChild(depList);
    const readiness = el('details', 'stage-readiness'); readiness.appendChild(el('summary', '', '开始前应该已经会回答'));
    const readyList = el('ul'); readyList.innerHTML = `<li>这一阶段操作的核心对象分别是什么？</li><li>哪个不变量一旦破坏会产生最危险的失败？</li><li>你能先手推 tiny sanity check，而不是直接运行整套 tests 吗？</li>`; readiness.appendChild(readyList); depends.appendChild(readiness);
    const problemBox = el('section', 'stage-problems'); problemBox.innerHTML = '<h3>中文题面对应部分</h3>';
    const problemList = el('ul'); stage.problems.forEach((label) => { const heading = findProblem(label); const li = el('li'); li.innerHTML = heading ? `<a href="#${heading.id}">${label} · 跳到完整题面 ↓</a>` : `<span>${label} · 请在下方完整题面核对</span>`; problemList.appendChild(li); }); problemBox.appendChild(problemList);
    overview.append(depends, problemBox); section.appendChild(overview);

    const contract = el('section', 'stage-contract'); contract.innerHTML = `<p class="workbook-label">Contract</p><div class="contract-grid"><article><h3>Input</h3><p>${stage.contract.input}</p></article><article><h3>Output</h3><p>${stage.contract.output}</p></article><article><h3>Invariants</h3><ul>${stage.contract.invariants.map((item) => `<li>${item}</li>`).join('')}</ul></article><article><h3>Forbidden assumptions</h3><ul>${stage.contract.forbidden.map((item) => `<li>${item}</li>`).join('')}</ul></article></div>`; section.appendChild(contract);
    const done = el('section', 'stage-done'); done.innerHTML = `<p class="workbook-label">Definition of Done</p><div class="done-grid"><article><h3>Correct</h3><p>官方对应测试通过；边界输入、错误路径与资源清理行为正确。</p></article><article><h3>Understand</h3><p>能解释关键对象、状态转换、不变量，以及一个看似更简单方案为何失败。</p></article><article><h3>Evidence</h3><p>保存 tiny trace、测试输出；性能型阶段还要记录 baseline、配置、测量与解释。</p></article></div>`; section.appendChild(done);
    const sanity = el('section', 'stage-sanity'); sanity.innerHTML = `<p class="workbook-label">Tiny Sanity Check</p><p>${stage.sanity}</p><p class="sanity-note">先手推预期，再运行；若 tiny case 不成立，不要继续 full suite。</p>`; section.appendChild(sanity);
    const failures = el('section', 'stage-failures'); failures.innerHTML = '<p class="workbook-label">Failure Signatures · 如果你看到……</p>';
    stage.failures.forEach(([symptom, direction]) => { const details = el('details'); details.append(el('summary', '', symptom), el('p', '', direction)); failures.appendChild(details); }); section.appendChild(failures);
    const hints = el('section', 'stage-hints'); hints.innerHTML = '<p class="workbook-label">Progressive Hints</p><p class="hint-note">先独立尝试 10–15 分钟；Hint 用于缩小问题，不提供完整实现。</p>';
    stage.hints.forEach((hint, hintIndex) => { const details = el('details'); details.append(el('summary', '', `Hint ${hintIndex + 1} · ${['Concept', 'Invariant / Structure', 'Debug Strategy'][hintIndex]}`), el('p', '', hint)); hints.appendChild(details); }); section.appendChild(hints);
    const experiment = el('section', 'stage-experiment'); experiment.innerHTML = `<p class="workbook-label">Prediction → Experiment → Explanation</p><div class="experiment-flow"><article><h3>Hypothesis</h3><p>${stage.experiment.hypothesis}</p></article><article><h3>Prediction</h3><p>${stage.experiment.prediction}</p></article><article><h3>Controlled Experiment</h3><p>${stage.experiment.run}</p></article><article><h3>Explanation</h3><p>${stage.experiment.explain}</p></article></div>`; section.appendChild(experiment);
    const gate = el('section', 'stage-gate'); gate.innerHTML = `<p class="workbook-label">Gate · 进入下一阶段前</p><ul><li>□ 官方对应要求与测试通过</li><li>□ Tiny sanity check 的实际行为与预测一致</li><li>□ 能解释一个 failure signature 的根因</li><li>□ 有一份可复查的证据，而不只是“跑绿了”</li></ul>`; section.appendChild(gate);
    workbook.appendChild(section);
  });

  const finish = el('section', 'workbook-finish'); finish.innerHTML = `<p class="workbook-label">Capability Summary</p><h2>完成的是能力，不只是题号</h2><ul>${data.capabilities.map((item) => `<li>□ ${item}</li>`).join('')}</ul><details><summary>Retrospective · 你实际学到了什么？</summary><ol><li>最难 debug 的问题是什么？</li><li>原来的 mental model 哪一点是错的？</li><li>哪个实验结果最出乎预期？</li><li>哪项设计用一种资源换了另一种资源？</li><li>如果重做，你会先验证什么？</li></ol></details>`; workbook.appendChild(finish);

  const firstRule = page.querySelector(':scope > .rule, :scope > hr.rule');
  (firstRule || primary).insertAdjacentElement('afterend', workbook);
  const chinese = el('header', 'chinese-task-header'); chinese.id = 'chinese-task'; chinese.innerHTML = `<p class="workbook-kicker">Complete Chinese Task</p><h2>中文完整题面</h2><p>以下保留任务、约束、提示、交付物与测试说明。Workbook 负责工程路线；若版本冲突，以 <a href="${data.officialBase}${match[1]}.html" target="_blank" rel="noopener">MIT Fall 2026 官方题面</a>为准。</p>`;
  workbook.insertAdjacentElement('afterend', chinese);
  originalHeadings.forEach((heading) => {
    const stage = data.stages.find((candidate) => candidate.problems.some((problem) => heading.textContent.toLowerCase().includes(problem.toLowerCase())));
    if (!stage) return;
    const back = el('a', 'problem-stage-back', `← ${stage.title}`); back.href = `#workbook-stage-${stage.id}`; heading.insertAdjacentElement('afterend', back);
  });

  const side = el('aside', 'workbook-side-nav'); side.setAttribute('aria-label', 'Lab Workbook 目录');
  side.innerHTML = `<p>Workbook</p><a href="#engineering-workbook">Overview</a>${data.stages.map((stage, index) => `<a href="#workbook-stage-${stage.id}">${String(index + 1).padStart(2, '0')} ${stage.title.replace(/^Stage \d+ · /, '')}</a>`).join('')}<a href="#chinese-task">中文题面</a>`;
  document.body.appendChild(side);
  window.renderCourseMath?.(page);
})();
