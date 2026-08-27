(function () {
  const match = location.pathname.match(/\/ass(0[1-5])-[^/]+\.html$/);
  const page = document.querySelector('.page');
  const assignment = match && window.CS336AssignmentBank?.[match[1]];
  if (!page || !assignment || page.dataset.workbookReady) return;

  page.dataset.workbookReady = 'true';
  document.body.classList.add('assignment-workbook-page');

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const list = (items, className) => {
    const ul = el('ul', className);
    items.forEach((item) => ul.appendChild(el('li', '', item)));
    return ul;
  };

  const banner = page.querySelector(':scope > .guide-banner');
  const source = page.querySelector(':scope > .source-note');
  if (!banner || !source) return;

  banner.classList.add('workbook-banner');
  const eyebrow = banner.querySelector('.guide-eyebrow');
  if (eyebrow) eyebrow.textContent = eyebrow.textContent.replace('导读', 'Engineering Workbook');
  const lede = banner.querySelector('.guide-lede');
  if (lede) lede.textContent = assignment.mission;
  banner.querySelectorAll('.meta-icon').forEach((icon) => icon.remove());

  source.classList.add('workbook-version');
  const versionGrid = el('div', 'workbook-version-grid');
  [
    ['Official version', assignment.version],
    ['Workbook based on', assignment.basis],
    ['Legacy / optional boundary', assignment.legacy]
  ].forEach(([label, value]) => {
    const item = el('div', 'workbook-version-item');
    if (label.startsWith('Legacy')) item.classList.add('workbook-version-boundary');
    item.append(el('span', 'workbook-kicker', label), el('p', '', value));
    versionGrid.appendChild(item);
  });
  const officialLinks = el('div', 'workbook-version-item workbook-version-links');
  officialLinks.appendChild(el('span', 'workbook-kicker', 'Official sources'));
  const linkRow = el('div', 'workbook-version-link-row');
  source.querySelectorAll(':scope > p a').forEach((link) => linkRow.appendChild(link.cloneNode(true)));
  officialLinks.appendChild(linkRow);
  versionGrid.appendChild(officialLinks);
  source.prepend(versionGrid);

  const keepOutside = new Set(['FOOTER']);
  const oldNodes = [];
  let cursor = source.nextElementSibling;
  while (cursor) {
    const next = cursor.nextElementSibling;
    const keep = keepOutside.has(cursor.tagName) || cursor.classList.contains('pb-pager') || cursor.id === 'pb-page-end';
    if (!keep) oldNodes.push(cursor);
    cursor = next;
  }
  page.querySelectorAll(':scope > .quiz, :scope > #quiz').forEach((node) => node.remove());
  if (['01', '03', '04'].includes(match[1])) {
    page.querySelectorAll('.source-outline').forEach((outline) => {
      outline.classList.add('legacy-source-outline');
      const label = el('p', 'legacy-reference-label', 'Legacy Reference · Spring 2025 localized handout');
      outline.prepend(label);
    });
  }

  const intro = el('section', 'workbook-intro');
  intro.id = 'workbook-overview';
  const introCopy = el('div', 'workbook-intro-copy');
  introCopy.append(el('p', 'workbook-kicker', 'Mission'), el('h2', '', assignment.mission));
  introCopy.appendChild(el('p', '', '先确认 prerequisite 与 contract，再用 tiny sanity check 缩小问题；official tests 只是 Correct 证据，实验与解释决定你是否真正通过 Gate。'));
  const capability = el('div', 'workbook-capability-summary');
  capability.append(el('p', 'workbook-kicker', 'Capability summary'), el('p', 'workbook-progress-copy', `本作业能力已验证 0 / ${assignment.stages.length}`));
  const capabilityList = el('ul', 'workbook-capability-list');
  assignment.capabilities.forEach((name) => {
    const item = el('li', '');
    item.dataset.capability = name;
    item.innerHTML = `<span aria-hidden="true">□</span><span>${name}</span>`;
    capabilityList.appendChild(item);
  });
  capability.appendChild(capabilityList);
  intro.append(introCopy, capability);

  const stageMap = el('nav', 'workbook-stage-map');
  stageMap.setAttribute('aria-label', 'Assignment stages');
  assignment.stages.forEach((stage, index) => {
    const link = el('a', '', `${String(index + 1).padStart(2, '0')} ${stage.title}`);
    link.href = `#workbook-stage-${stage.id}`;
    stageMap.appendChild(link);
  });

  const main = el('main', 'workbook-main');
  main.append(intro, stageMap);

  const renderContract = (contract) => {
    const section = el('section', 'workbook-contract');
    section.appendChild(el('h3', '', 'Contract'));
    const grid = el('div', 'workbook-contract-grid');
    [
      ['Input', contract.input],
      ['Output', contract.output],
      ['Shape / dtype', contract.shape],
      ['Invariants', contract.invariants],
      ['Forbidden assumptions', contract.forbidden]
    ].forEach(([label, items]) => {
      const block = el('div', 'workbook-contract-item');
      block.append(el('p', 'workbook-kicker', label), list(items));
      grid.appendChild(block);
    });
    section.appendChild(grid);
    return section;
  };

  const renderDefinition = (done) => {
    const section = el('section', 'workbook-definition');
    section.appendChild(el('h3', '', 'Definition of Done'));
    const grid = el('div', 'workbook-done-grid');
    [['Correct', done.correct], ['Understand', done.understand], ['Evidence', done.evidence]].forEach(([label, items]) => {
      const block = el('div', 'workbook-done-item');
      block.append(el('p', 'workbook-kicker', label), list(items));
      grid.appendChild(block);
    });
    section.appendChild(grid);
    return section;
  };

  const renderStage = (stage, index) => {
    const section = el('section', 'workbook-stage');
    section.id = `workbook-stage-${stage.id}`;
    section.dataset.stage = stage.id;

    const header = el('header', 'workbook-stage-header');
    const number = el('span', 'workbook-stage-number', `Stage ${String(index + 1).padStart(2, '0')}`);
    header.append(number, el('h2', '', stage.title));
    const build = el('div', 'workbook-build');
    const buildCopy = el('div', '');
    buildCopy.append(el('p', 'workbook-kicker', 'What you are building'), el('p', 'workbook-build-title', stage.build));
    const whyCopy = el('div', '');
    whyCopy.append(el('p', 'workbook-kicker', 'Why this exists'), el('p', '', stage.why));
    build.append(buildCopy, whyCopy);
    header.appendChild(build);
    section.appendChild(header);

    const depends = el('div', 'workbook-depends');
    depends.appendChild(el('p', 'workbook-kicker', 'Depends on · 快速复习'));
    const lessonLinks = el('div', 'workbook-lesson-links');
    stage.lessons.forEach(({ href, label }) => {
      const link = el('a', '', label);
      link.href = href;
      lessonLinks.appendChild(link);
    });
    depends.appendChild(lessonLinks);
    section.appendChild(depends);

    const readiness = el('details', 'workbook-readiness');
    const readinessSummary = el('summary', '', '开始前应该已经会回答');
    readiness.append(readinessSummary, list(stage.readiness, 'workbook-checklist'));
    section.appendChild(readiness);

    section.append(renderContract(stage.contract), renderDefinition(stage.done));

    const sanity = el('section', 'workbook-sanity');
    sanity.append(el('p', 'workbook-kicker', 'Tiny sanity check'), el('h3', '', stage.sanity.title));
    sanity.append(list(stage.sanity.body));
    const expect = el('p', 'workbook-expect');
    expect.append(el('strong', '', '运行前预期：'), document.createTextNode(stage.sanity.expect));
    sanity.appendChild(expect);
    section.appendChild(sanity);

    const failures = el('section', 'workbook-failures');
    failures.appendChild(el('h3', '', '如果你看到……'));
    stage.failures.forEach((failure) => {
      const details = el('details', 'workbook-failure');
      details.append(el('summary', '', failure.signature), list(failure.checks));
      failures.appendChild(details);
    });
    section.appendChild(failures);

    const experiment = el('section', 'workbook-experiment');
    experiment.appendChild(el('h3', '', 'Prediction → Experiment → Explanation'));
    const experimentGrid = el('div', 'workbook-experiment-grid');
    [
      ['Hypothesis', stage.experiment.hypothesis],
      ['Prediction', stage.experiment.prediction],
      ['Controlled experiment', stage.experiment.experiment],
      ['Observation', stage.experiment.observation],
      ['Explanation', stage.experiment.explanation]
    ].forEach(([label, value]) => {
      const block = el('div', 'workbook-experiment-step');
      block.append(el('p', 'workbook-kicker', label), el('p', '', value));
      experimentGrid.appendChild(block);
    });
    experiment.appendChild(experimentGrid);
    section.appendChild(experiment);

    const hints = el('section', 'workbook-hints');
    hints.append(el('h3', '', '渐进式 Hints'), el('p', 'small', '先独立尝试 10–15 分钟；只展开解除当前卡点所需的一层。'));
    ['Hint 1 · Concept', 'Hint 2 · Invariant / Structure', 'Hint 3 · Debug Strategy'].forEach((label, hintIndex) => {
      const details = el('details', 'workbook-hint');
      details.append(el('summary', '', label), el('p', '', stage.hints[hintIndex]));
      hints.appendChild(details);
    });
    section.appendChild(hints);

    const official = el('section', 'workbook-official');
    official.appendChild(el('p', 'workbook-kicker', 'Official problems'));
    const officialList = el('div', 'workbook-problem-ids');
    stage.official.forEach((problem) => officialList.appendChild(el('code', '', problem)));
    official.appendChild(officialList);
    section.appendChild(official);

    const gate = el('section', 'workbook-gate');
    const gateHeader = el('div', 'workbook-gate-header');
    gateHeader.append(el('p', 'workbook-kicker', `Gate · ${stage.title}`), el('span', 'workbook-gate-progress', '0 / 5'));
    gate.appendChild(gateHeader);
    const gateList = el('div', 'workbook-gate-list');
    const criteria = [
      stage.done.correct[0],
      stage.done.correct[1] || stage.done.correct[0],
      stage.done.understand[0],
      stage.done.understand[1] || stage.done.understand[0],
      stage.done.evidence[0]
    ];
    criteria.forEach((criterion) => {
      const label = el('label', 'workbook-gate-item');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.dataset.stage = stage.id;
      label.append(input, el('span', '', criterion));
      gateList.appendChild(label);
    });
    gate.appendChild(gateList);
    section.appendChild(gate);
    return section;
  };

  assignment.stages.forEach((stage, index) => main.appendChild(renderStage(stage, index)));

  const retrospective = el('section', 'workbook-retrospective');
  retrospective.id = 'workbook-retrospective';
  retrospective.append(el('p', 'workbook-kicker', 'Retrospective'), el('h2', '', '你实际学到了什么？'));
  retrospective.appendChild(list([
    '最难 debug 的问题是什么？',
    '原来的 mental model 哪一点是错的？',
    '哪个实验结果最出乎预期？',
    '哪项优化是用一种资源换另一种资源？',
    '如果重新做一次，你会先验证什么？'
  ], 'workbook-retrospective-prompts'));
  main.appendChild(retrospective);

  const reference = el('details', 'workbook-reference-library');
  reference.id = 'workbook-reference';
  reference.appendChild(el('summary', '', 'Deep Reference · 原有中文导读、知识树、Cheatsheet、官方题面与 Legacy Supplement'));
  const referenceNote = el('div', 'workbook-reference-note');
  referenceNote.innerHTML = '<p><strong>Workbook</strong> 提供 stages、contracts、gates、debugging 与 experiments。</p><p><strong>Official handout</strong> 决定题号、接口、约束与 deliverables；下方 legacy 内容只用于补充理解，不能覆盖 2026 要求。</p>';
  reference.appendChild(referenceNote);
  oldNodes.forEach((node) => {
    if (node.isConnected) reference.appendChild(node);
  });
  main.appendChild(reference);

  const aside = el('aside', 'workbook-stage-nav');
  const navLabel = el('p', 'workbook-stage-nav-label', 'Stages');
  const navProgress = el('span', 'workbook-stage-nav-progress', `0 / ${assignment.stages.length}`);
  navLabel.appendChild(navProgress);
  const nav = el('nav', '');
  assignment.stages.forEach((stage, index) => {
    const link = el('a', index === 0 ? 'is-active' : '', `${String(index + 1).padStart(2, '0')} ${stage.title}`);
    link.href = `#workbook-stage-${stage.id}`;
    link.dataset.stage = stage.id;
    nav.appendChild(link);
  });
  const referenceLink = el('a', 'workbook-reference-link', 'Official / Deep Reference');
  referenceLink.href = '#workbook-reference';
  nav.appendChild(referenceLink);
  aside.append(navLabel, nav);

  const shell = el('div', 'workbook-shell');
  shell.append(main, aside);
  source.insertAdjacentElement('afterend', shell);

  const updateProgress = () => {
    let complete = 0;
    assignment.stages.forEach((stage) => {
      const section = main.querySelector(`[data-stage="${stage.id}"]`);
      const inputs = [...section.querySelectorAll('.workbook-gate-item input')];
      const count = inputs.filter((input) => input.checked).length;
      section.querySelector('.workbook-gate-progress').textContent = `${count} / ${inputs.length}`;
      const isComplete = count === inputs.length;
      section.classList.toggle('is-gate-complete', isComplete);
      if (isComplete) complete += 1;
      const capabilityItem = capabilityList.querySelector(`[data-capability="${stage.capability}"]`);
      if (capabilityItem) {
        capabilityItem.classList.toggle('is-complete', isComplete);
        capabilityItem.firstElementChild.textContent = isComplete ? '✓' : '□';
      }
    });
    capability.querySelector('.workbook-progress-copy').textContent = `本作业能力已验证 ${complete} / ${assignment.stages.length}`;
    navProgress.textContent = `${complete} / ${assignment.stages.length}`;
  };
  main.querySelectorAll('.workbook-gate-item input').forEach((input) => input.addEventListener('change', updateProgress));

  if ('IntersectionObserver' in window) {
    const links = [...nav.querySelectorAll('a[data-stage]')];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible[0]) return;
      links.forEach((link) => link.classList.toggle('is-active', link.dataset.stage === visible[0].target.dataset.stage));
    }, { rootMargin: '-12% 0px -72% 0px' });
    main.querySelectorAll('.workbook-stage').forEach((stage) => observer.observe(stage));
  }

  window.renderCourseMath?.(shell);
})();
