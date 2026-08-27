(function () {
  const page = document.querySelector('.page');
  const file = /\/projects\/index\.html$/.test(location.pathname)
    ? 'project'
    : location.pathname.split('/').pop().replace(/\.html$/, '');
  const data = window.CS267AssignmentBank?.[file];
  if (!page || !data || page.dataset.workbookReady) return;
  page.dataset.workbookReady = 'true';
  document.body.classList.add('cs267-workbook');

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const addList = (items, className = '') => {
    const list = el('ul', className);
    items.forEach((item) => {
      const li = el('li');
      li.innerHTML = item;
      list.appendChild(li);
    });
    return list;
  };
  const banner = page.querySelector(':scope > .guide-banner');
  const meta = page.querySelector(':scope > .meta');
  const heroEnd = banner || meta || page.querySelector(':scope > .lede') || page.querySelector(':scope > h1');

  const notice = el('aside', 'assignment-source-notice');
  notice.id = 'source-version';
  notice.innerHTML = `<div><p class="assignment-kicker">Source / Version</p><p><strong>Official version:</strong> Berkeley CS267 ${data.version}</p><p>${data.authority}</p></div><div class="assignment-source-actions"><a href="${data.source}" target="_blank" rel="noopener">Official handout ↗</a><a href="${data.repo}" target="_blank" rel="noopener">${file === 'project' ? 'Official project source' : 'Starter repository'} ↗</a></div>`;
  heroEnd.insertAdjacentElement('afterend', notice);

  const primaryNav = el('nav', 'assignment-primary-nav');
  primaryNav.setAttribute('aria-label', '作业资源');
  primaryNav.innerHTML = '<a href="#workbook">Engineering Workbook</a><a href="#chinese-task">中文完整任务说明</a><a href="#official-sources">Official Sources</a>';
  notice.insertAdjacentElement('afterend', primaryNav);

  const firstOriginalHeading = page.querySelector(':scope > h2');
  const workbook = el('section', 'assignment-workbook');
  workbook.id = 'workbook';
  workbook.innerHTML = `<header class="workbook-header"><p class="assignment-kicker">Engineering Workbook</p><h2>${data.label} · 从理解到证据</h2><p>${data.mission}</p></header>`;
  const mission = el('aside', 'workbook-mission');
  mission.innerHTML = `<strong>Mission</strong><p>${data.mission}</p>`;
  if (data.facts?.length) mission.appendChild(addList(data.facts, 'workbook-facts'));
  workbook.appendChild(mission);

  const stageStrip = el('nav', 'stage-strip');
  stageStrip.setAttribute('aria-label', 'Engineering stages');
  data.stages.forEach((stage, index) => {
    const link = el('a', index === 0 ? 'is-active' : '');
    link.href = `#workbook-stage-${stage.id}`;
    link.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span>${stage.title}`;
    stageStrip.appendChild(link);
  });
  workbook.appendChild(stageStrip);

  const shell = el('div', 'workbook-shell');
  const stages = el('div', 'workbook-stages');
  const side = el('aside', 'workbook-side');
  side.innerHTML = '<p class="assignment-kicker">Stage map</p>';
  const sideNav = document.createElement('nav');
  data.stages.forEach((stage, index) => {
    const link = el('a', index === 0 ? 'is-active' : '', `${String(index + 1).padStart(2, '0')} · ${stage.title}`);
    link.href = `#workbook-stage-${stage.id}`;
    sideNav.appendChild(link);
  });
  side.appendChild(sideNav);
  const stateKey = `cs267-workbook-${file}`;
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch (_) { saved = {}; }

  data.stages.forEach((stage, index) => {
    const article = el('article', 'workbook-stage');
    article.id = `workbook-stage-${stage.id}`;
    article.innerHTML = `<header><p class="stage-number">Stage ${String(index + 1).padStart(2, '0')}</p><h3>${stage.title}</h3><p class="stage-build"><strong>What you are building:</strong> ${stage.build}</p></header>`;

    const depends = el('div', 'stage-depends');
    depends.innerHTML = '<h4>Depends on · 快速复习</h4>';
    const depLinks = el('div', 'stage-dep-links');
    stage.lessons.forEach(([number, title, href]) => {
      const a = el('a', '', `Lesson ${number} · ${title} →`);
      a.href = href;
      depLinks.appendChild(a);
    });
    depends.appendChild(depLinks);
    article.appendChild(depends);

    const readiness = el('details', 'stage-readiness');
    readiness.innerHTML = `<summary>开始前应该已经会回答</summary><ul><li>这一 Stage 的输入、输出和 owner 分别是谁？</li><li>最小例子怎样手算？</li><li>哪个性能数字必须绑定测试条件？</li></ul>`;
    article.appendChild(readiness);

    const contract = el('section', 'stage-contract');
    contract.innerHTML = `<p class="stage-label">Contract</p><div class="contract-grid"><div><strong>Input</strong><p>${stage.contract.input}</p></div><div><strong>Output</strong><p>${stage.contract.output}</p></div><div><strong>Invariants</strong></div><div><strong>Forbidden assumptions</strong></div></div>`;
    const contractCells = contract.querySelectorAll('.contract-grid > div');
    contractCells[2].appendChild(addList(stage.contract.invariants));
    contractCells[3].appendChild(addList(stage.contract.forbidden));
    article.appendChild(contract);

    const sanity = el('aside', 'stage-sanity');
    sanity.innerHTML = `<p class="stage-label">Tiny sanity check</p><p>${stage.sanity}</p>`;
    article.appendChild(sanity);

    const failures = el('section', 'stage-failures');
    failures.innerHTML = '<p class="stage-label">如果你看到…… · Failure signatures</p>';
    const failureGrid = el('div', 'failure-grid');
    stage.failures.forEach(([symptom, check]) => failureGrid.appendChild(Object.assign(el('div'), { innerHTML: `<strong>${symptom}</strong><p>优先检查：${check}</p>` })));
    failures.appendChild(failureGrid);
    article.appendChild(failures);

    const hints = el('div', 'stage-hints');
    const hintLabels = ['Hint 1 · Concept', 'Hint 2 · Invariant / Structure', 'Hint 3 · Debug Strategy'];
    stage.hints.forEach((hint, hintIndex) => {
      const details = el('details');
      details.innerHTML = `<summary>${hintLabels[hintIndex]}</summary><p>${hint}</p>`;
      hints.appendChild(details);
    });
    article.appendChild(hints);

    const experiment = el('section', 'stage-experiment');
    experiment.innerHTML = `<p class="stage-label">Prediction → Experiment → Explanation</p><ol><li><strong>Hypothesis / Prediction</strong><p>${stage.experiment[0]}</p></li><li><strong>Controlled experiment</strong><p>${stage.experiment[1]}</p></li><li><strong>Observation & explanation</strong><p>${stage.experiment[2]}</p></li></ol>`;
    article.appendChild(experiment);

    const gate = el('section', 'stage-gate');
    gate.innerHTML = `<div><p class="stage-label">Gate · ${stage.title}</p><p>tests pass ≠ understanding complete。满足 Correct、Understand、Evidence 后再继续。</p></div>`;
    const checklist = el('ul', 'gate-checklist');
    stage.done.forEach((item, gateIndex) => {
      const li = el('li');
      const label = el('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = Boolean(saved[`${stage.id}-${gateIndex}`]);
      input.addEventListener('change', () => {
        saved[`${stage.id}-${gateIndex}`] = input.checked;
        localStorage.setItem(stateKey, JSON.stringify(saved));
        updateCapability();
      });
      label.append(input, document.createTextNode(item));
      li.appendChild(label);
      checklist.appendChild(li);
    });
    gate.appendChild(checklist);
    const problemLink = el('a', 'stage-problem-link', `查看中文任务映射 · ${stage.title} ↓`);
    problemLink.href = `#problem-${stage.id}`;
    gate.appendChild(problemLink);
    article.appendChild(gate);
    stages.appendChild(article);
  });

  const capability = el('section', 'capability-summary');
  capability.id = 'capability-summary';
  capability.innerHTML = '<p class="assignment-kicker">Capability summary</p><h3>你获得的不是题号，而是一组可证明的能力</h3><div class="capability-grid"></div>';
  stages.appendChild(capability);
  function updateCapability() {
    const grid = capability.querySelector('.capability-grid');
    grid.replaceChildren();
    data.stages.forEach((stage) => {
      const total = stage.done.length;
      const checked = stage.done.filter((_, index) => saved[`${stage.id}-${index}`]).length;
      const item = el('div', checked === total ? 'is-complete' : '');
      item.innerHTML = `<span>${checked === total ? '✓' : '○'}</span><strong>${stage.title}</strong><small>${checked} / ${total}</small>`;
      grid.appendChild(item);
    });
  }
  updateCapability();

  const retro = el('section', 'assignment-retrospective');
  retro.innerHTML = '<p class="assignment-kicker">Retrospective</p><h3>你实际学到了什么？</h3><ol><li>最难 debug 的问题是什么？</li><li>原来的 mental model 哪一点是错的？</li><li>哪个实验结果最出乎预期？</li><li>哪项优化是用一种资源换另一种资源？</li><li>如果重新做一次，你会先验证什么？</li></ol>';
  stages.appendChild(retro);
  shell.append(stages, side);
  workbook.appendChild(shell);
  firstOriginalHeading.insertAdjacentElement('beforebegin', workbook);

  const chinese = el('section', 'chinese-task-intro');
  chinese.id = 'chinese-task';
  chinese.innerHTML = `<p class="assignment-kicker">中文完整任务说明</p><h2>${data.label} · 任务、约束与验收</h2><p>下面先按 Engineering Stage 给出官方任务映射，随后完整保留原有中文导读、实现路线、约束、报告要求与自测。它是 CourseStack 中文学习资源；最终要求仍以 ${data.version} 官方来源为准。</p>`;
  const index = el('nav', 'problem-index');
  index.setAttribute('aria-label', '中文任务目录');
  data.stages.forEach((stage, stageIndex) => {
    const a = el('a');
    a.href = `#problem-${stage.id}`;
    a.innerHTML = `<span>${String(stageIndex + 1).padStart(2, '0')}</span>${stage.title}`;
    index.appendChild(a);
  });
  chinese.appendChild(index);
  const problems = el('div', 'translated-problems');
  data.stages.forEach((stage, stageIndex) => {
    const details = el('details', 'problem-row');
    details.id = `problem-${stage.id}`;
    details.innerHTML = `<summary><span class="problem-number">Stage ${String(stageIndex + 1).padStart(2, '0')}</span><strong>${stage.title}</strong><span>${stage.build}</span></summary><div class="problem-body"><a class="problem-back" href="#workbook-stage-${stage.id}">← 返回 Workbook Stage</a><h3>完整任务</h3><p>${stage.build}。输入：${stage.contract.input}；输出：${stage.contract.output}。</p><h3>约束与 invariants</h3><div class="problem-invariants"></div><h3>交付与验收</h3><div class="problem-done"></div><p class="problem-source"><strong>Source：</strong><a href="${data.source}" target="_blank" rel="noopener">Berkeley CS267 ${data.version} official handout ↗</a>。若接口、测试或提交细节冲突，以官方来源为准。</p></div>`;
    details.querySelector('.problem-invariants').appendChild(addList([...stage.contract.invariants, ...stage.contract.forbidden.map((item) => `不得假设：${item}`)]));
    details.querySelector('.problem-done').appendChild(addList(stage.done));
    problems.appendChild(details);
  });
  chinese.appendChild(problems);
  workbook.insertAdjacentElement('afterend', chinese);

  const originalMarker = el('div', 'original-guide-marker');
  originalMarker.innerHTML = '<p class="assignment-kicker">CourseStack Guide · 原有中文导读完整保留</p>';
  firstOriginalHeading.insertAdjacentElement('beforebegin', originalMarker);

  const originalNav = page.querySelector(':scope > .nav');
  const official = el('section', 'official-sources');
  official.id = 'official-sources';
  official.innerHTML = `<p class="assignment-kicker">Official Sources</p><h2>最终权威来源</h2><div class="official-source-grid"><a href="${data.source}" target="_blank" rel="noopener"><strong>Official handout</strong><span>任务、截止、提交与课程约束 ↗</span></a><a href="${data.repo}" target="_blank" rel="noopener"><strong>${file === 'project' ? 'Project / pre-proposal source' : 'Starter repository'}</strong><span>代码、tests 与最新接口 ↗</span></a></div>`;
  (originalNav || page.querySelector(':scope > footer'))?.insertAdjacentElement('beforebegin', official);

  page.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#problem-"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (target?.tagName === 'DETAILS') {
      target.open = true;
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    }
  });

  const navLinks = [...sideNav.querySelectorAll('a'), ...stageStrip.querySelectorAll('a')];
  const stageNodes = [...stages.querySelectorAll('.workbook-stage')];
  let frame = 0;
  const updateStage = () => {
    frame = 0;
    let active = stageNodes[0];
    stageNodes.forEach((node) => { if (node.getBoundingClientRect().top < 180) active = node; });
    navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${active?.id}`));
  };
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateStage); }, { passive: true });
  updateStage();
  window.renderCourseMath?.(page);
})();
