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

  const getOfficialProblemId = (entry) => {
    const candidate = String(entry).split(' · ')[0].trim();
    return /^[a-z0-9_]+$/.test(candidate) ? candidate : '';
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
  source.id = 'assignment-version-notice';
  const existingSourceLinks = [...source.querySelectorAll(':scope > p a')].map((link) => link.cloneNode(true));
  source.replaceChildren();
  const sourceLine = el('p', 'workbook-source-line');
  sourceLine.append(el('strong', '', 'Source: '), document.createTextNode(`Stanford CS336 Spring 2026 · ${assignment.version}`));
  const provenance = el('details', 'workbook-provenance');
  provenance.appendChild(el('summary', '', 'Version & provenance'));
  const provenanceBody = el('div', 'workbook-provenance-body');
  provenanceBody.append(
    el('p', '', `Checked ${assignment.checkedAt} · source commit ${assignment.sourceCommit}`),
    el('p', '', assignment.basis)
  );
  const linkRow = el('div', 'workbook-version-link-row');
  const repositoryLink = existingSourceLinks.find((link) => /github\.com\/stanford-cs336\/assignment/.test(link.href) && !/\/blob\//.test(link.href));
  if (repositoryLink && !existingSourceLinks.some((link) => /README/i.test(link.textContent))) {
    const readme = el('a', '', 'README');
    readme.href = repositoryLink.href.replace(/\/$/, '') + '/blob/main/README.md';
    existingSourceLinks.splice(1, 0, readme);
  }
  existingSourceLinks.forEach((link) => linkRow.appendChild(link));
  provenanceBody.appendChild(linkRow);
  provenance.appendChild(provenanceBody);
  source.append(sourceLine, provenance);

  const keepOutside = new Set(['FOOTER']);
  let cursor = source.nextElementSibling;
  while (cursor) {
    const next = cursor.nextElementSibling;
    const keep = keepOutside.has(cursor.tagName) || cursor.tagName === 'SCRIPT' || cursor.classList.contains('pb-pager') || cursor.id === 'pb-page-end';
    if (!keep && cursor.matches('.assignment-jump-links, .quiz, #quiz')) {
      cursor.remove();
    } else if (!keep) {
      cursor.remove();
    }
    cursor = next;
  }

  const primaryNav = el('nav', 'workbook-primary-nav');
  primaryNav.setAttribute('aria-label', 'Assignment primary resources');
  [
    ['Task path', '#workbook-overview'],
    ['Problem guide', `#workbook-stage-${assignment.stages[0].id}`],
    ['Official sources', '#official-sources']
  ].forEach(([label, href]) => {
    const link = el('a', '', label);
    link.href = href;
    primaryNav.appendChild(link);
  });
  source.insertAdjacentElement('afterend', primaryNav);

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
    official.appendChild(el('p', 'workbook-kicker', 'Problem guide · Official IDs'));
    const officialList = el('div', 'workbook-problem-ids');
    stage.official.forEach((entry) => {
      const officialId = getOfficialProblemId(entry);
      const item = el('span', 'workbook-problem-reference');
      item.append(el('code', '', officialId || entry));
      const qualifier = String(entry).includes(' · ') ? String(entry).split(' · ').slice(1).join(' · ') : '';
      if (qualifier) item.appendChild(el('small', 'workbook-problem-qualifier', qualifier));
      officialList.appendChild(item);
    });
    official.appendChild(officialList);
    const handoutLink = existingSourceLinks.find((link) => /作业说明|PDF|handout/i.test(link.textContent));
    if (handoutLink) {
      const currentHandout = handoutLink.cloneNode(true);
      currentHandout.className = 'workbook-current-handout';
      currentHandout.textContent = '在当前官方题面中查看完整要求 →';
      official.appendChild(currentHandout);
    }
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

  const officialSources = el('section', 'assignment-official-sources');
  officialSources.id = 'official-sources';
  const officialHeader = el('header', 'assignment-resource-header');
  officialHeader.append(
    el('p', 'workbook-kicker', 'Authority'),
    el('h2', '', 'Official sources'),
    el('p', '', 'Repository、PDF、README 与 tests 决定最终题号、接口、约束和 deliverables；Workbook 负责工程路径，不覆盖官方要求。')
  );
  const officialResourceLinks = el('div', 'official-resource-links');
  [...linkRow.querySelectorAll('a')].forEach((link) => officialResourceLinks.appendChild(link.cloneNode(true)));
  officialHeader.appendChild(officialResourceLinks);
  officialSources.appendChild(officialHeader);
  main.appendChild(officialSources);

  const history = el('details', 'assignment-history-note');
  history.id = 'assignment-history';
  history.appendChild(el('summary', '', 'Historical note · 2025 → 2026'));
  const historyBody = el('div', 'assignment-history-body');
  historyBody.appendChild(list(assignment.changes));
  const archiveLink = el('a', 'assignment-archive-link', '查看 Spring 2025 页面存档 →');
  archiveLink.href = assignment.archiveHref;
  historyBody.appendChild(archiveLink);
  history.appendChild(historyBody);
  main.appendChild(history);

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
  [
    ['Official sources', '#official-sources', 'workbook-official-link'],
    ['Historical note', '#assignment-history', 'workbook-reference-link']
  ].forEach(([label, href, className]) => {
    const link = el('a', className, label);
    link.href = href;
    nav.appendChild(link);
  });
  aside.append(navLabel, nav);

  const shell = el('div', 'workbook-shell');
  shell.append(main, aside);
  primaryNav.insertAdjacentElement('afterend', shell);

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

  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const navTargets = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
  let navFrame = 0;
  const updateActiveNav = () => {
    navFrame = 0;
    const threshold = innerWidth <= 1000 ? Math.min(innerHeight * 0.45, 300) : 140;
    let active = navTargets[0];
    navTargets.forEach((target) => {
      if (target.getBoundingClientRect().top <= threshold) active = target;
    });
    navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${active.id}`));
  };
  const queueActiveNavUpdate = () => {
    if (!navFrame) navFrame = requestAnimationFrame(updateActiveNav);
  };
  addEventListener('scroll', queueActiveNavUpdate, { passive: true });
  addEventListener('resize', queueActiveNavUpdate);
  updateActiveNav();

  window.renderCourseMath?.(shell);
})();
