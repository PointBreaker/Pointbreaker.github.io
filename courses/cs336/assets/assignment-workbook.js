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

  const normalizeProblemId = (id) => String(id).toLowerCase().replace(/[^a-z0-9]/g, '');
  const problemAnchor = (id) => `problem-${String(id).trim().replace(/[^A-Za-z0-9_-]+/g, '-')}`;

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
  const versionGrid = el('div', 'workbook-version-grid');
  [
    ['Official version', assignment.version],
    ['Workbook based on', assignment.basis],
    ['中文题面版本', assignment.localization]
  ].forEach(([label, value]) => {
    const item = el('div', 'workbook-version-item');
    if (label === '中文题面版本') item.classList.add('workbook-version-boundary');
    item.append(el('span', 'workbook-kicker', label), el('p', '', value));
    versionGrid.appendChild(item);
  });
  const officialLinks = el('div', 'workbook-version-item workbook-version-links');
  officialLinks.appendChild(el('span', 'workbook-kicker', 'Official sources'));
  const linkRow = el('div', 'workbook-version-link-row');
  const sourceLinks = [...source.querySelectorAll(':scope > p a')].map((link) => link.cloneNode(true));
  const repositoryLink = sourceLinks.find((link) => /github\.com\/stanford-cs336\/assignment/.test(link.href) && !/\/blob\//.test(link.href));
  if (repositoryLink && !sourceLinks.some((link) => /README/i.test(link.textContent))) {
    const readme = el('a', '', 'README');
    readme.href = repositoryLink.href.replace(/\/$/, '') + '/blob/main/README.md';
    sourceLinks.splice(1, 0, readme);
  }
  sourceLinks.forEach((link) => linkRow.appendChild(link));
  officialLinks.appendChild(linkRow);
  versionGrid.appendChild(officialLinks);
  source.prepend(versionGrid);

  const translatedOutline = page.querySelector('#complete-source-outline');
  const officialSourceContent = page.querySelector('#spring-2026-delta');
  if (!translatedOutline) return;

  const translatedProblems = [...translatedOutline.querySelectorAll('.problem-row')].map((row) => {
    const number = row.querySelector('.problem-number')?.textContent.trim();
    if (!number) return null;
    row.id = problemAnchor(number);
    row.dataset.problemId = number;
    row.open = false;
    return { id: number, normalized: normalizeProblemId(number), row, stages: [] };
  }).filter(Boolean);
  const translatedByExactId = new Map(translatedProblems.map((problem) => [problem.id, problem]));
  const translatedByNormalizedId = new Map(translatedProblems.map((problem) => [problem.normalized, problem]));
  const findTranslatedProblem = (officialId) => translatedByExactId.get(officialId) || translatedByNormalizedId.get(normalizeProblemId(officialId));

  const officialProblemIds = new Map();
  assignment.stages.forEach((stage, stageIndex) => {
    stage.official.forEach((entry) => {
      const officialId = getOfficialProblemId(entry);
      if (!officialId) return;
      if (!officialProblemIds.has(officialId)) officialProblemIds.set(officialId, []);
      officialProblemIds.get(officialId).push({ stage, stageIndex, entry });
      const translated = findTranslatedProblem(officialId);
      if (translated && !translated.stages.some((item) => item.stage.id === stage.id)) {
        translated.stages.push({ stage, stageIndex, officialId });
      }
    });
  });

  const semanticContent = {
    translatedProblems: [translatedOutline],
    officialSourceContent: officialSourceContent ? [officialSourceContent] : [],
    legacyGuide: [],
    legacySupplement: [],
    miscReference: []
  };
  const translatedWrapper = translatedOutline.closest('.legacy-supplement');
  translatedOutline.remove();
  officialSourceContent?.remove();
  if (translatedWrapper) translatedWrapper.remove();

  const keepOutside = new Set(['FOOTER']);
  let cursor = source.nextElementSibling;
  while (cursor) {
    const next = cursor.nextElementSibling;
    const keep = keepOutside.has(cursor.tagName) || cursor.tagName === 'SCRIPT' || cursor.classList.contains('pb-pager') || cursor.id === 'pb-page-end';
    if (!keep && cursor.matches('.assignment-jump-links, .quiz, #quiz')) {
      cursor.remove();
    } else if (!keep && cursor.classList.contains('legacy-supplement')) {
      semanticContent.legacySupplement.push(cursor);
    } else if (!keep) {
      semanticContent.legacyGuide.push(cursor);
    }
    cursor = next;
  }

  const primaryNav = el('nav', 'workbook-primary-nav');
  primaryNav.setAttribute('aria-label', 'Assignment primary resources');
  [
    ['Engineering Workbook', '#workbook-overview'],
    ['中文完整题面', '#localized-problems'],
    ['Official Handout', '#official-sources']
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
    official.appendChild(el('p', 'workbook-kicker', 'Official problems'));
    const officialList = el('div', 'workbook-problem-ids');
    stage.official.forEach((entry) => {
      const officialId = getOfficialProblemId(entry);
      const translated = officialId && findTranslatedProblem(officialId);
      const item = el(translated ? 'a' : 'span', 'workbook-problem-reference' + (translated ? ' has-translation' : ' is-official-only'));
      if (translated) {
        item.href = `#${translated.row.id}`;
        item.dataset.problemTarget = translated.row.id;
      }
      item.append(el('code', '', officialId || entry));
      const qualifier = String(entry).includes(' · ') ? String(entry).split(' · ').slice(1).join(' · ') : '';
      if (qualifier) item.appendChild(el('small', 'workbook-problem-qualifier', qualifier));
      item.appendChild(el('span', 'workbook-problem-link-state', translated ? '中文题面 →' : 'Official only · 待中文覆盖'));
      officialList.appendChild(item);
    });
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

  const matchedOfficialIds = [...officialProblemIds.keys()].filter((id) => findTranslatedProblem(id));
  const officialOnlyIds = [...officialProblemIds.keys()].filter((id) => !findTranslatedProblem(id));
  const legacyOnlyProblems = translatedProblems.filter((problem) => problem.stages.length === 0);

  const localization = el('section', 'assignment-localization');
  localization.id = 'localized-problems';
  const localizationHeader = el('header', 'assignment-resource-header');
  localizationHeader.append(
    el('p', 'workbook-kicker', 'Core Resource · 中文完整题面'),
    el('h2', '', '完整中文题面'),
    el('p', '', '按原 problem ID 保留任务、约束、交付物和验收要求。先从 Stage 进入对应题目；版本、接口与测试仍以 Spring 2026 official source 为准。')
  );
  const versionNotice = el('aside', 'localization-version-notice');
  versionNotice.append(el('p', 'workbook-kicker', 'Version notice'), el('p', '', assignment.localization));
  const coverage = el('div', 'localization-coverage');
  [
    ['中文题面', translatedProblems.length],
    ['2026 ID matched', matchedOfficialIds.length],
    ['Official-only', officialOnlyIds.length],
    ['2025-only / unmapped', legacyOnlyProblems.length]
  ].forEach(([label, value]) => {
    const item = el('div', 'localization-coverage-item');
    item.append(el('strong', '', String(value)), el('span', '', label));
    coverage.appendChild(item);
  });
  versionNotice.appendChild(coverage);
  localizationHeader.appendChild(versionNotice);
  localization.appendChild(localizationHeader);

  const problemIndex = el('nav', 'localized-problem-index');
  problemIndex.setAttribute('aria-label', '中文题面 Problem Index');
  problemIndex.append(el('p', 'workbook-kicker', 'Problem Index'), el('h3', '', '按 Engineering Stage 查题'));
  const problemIndexGrid = el('div', 'localized-problem-index-grid');
  assignment.stages.forEach((stage, stageIndex) => {
    const group = el('section', 'localized-problem-index-group');
    group.appendChild(el('h4', '', `Stage ${String(stageIndex + 1).padStart(2, '0')} · ${stage.title}`));
    const entries = el('ul', 'localized-problem-index-list');
    const seen = new Set();
    stage.official.forEach((entry) => {
      const officialId = getOfficialProblemId(entry);
      if (!officialId || seen.has(officialId)) return;
      seen.add(officialId);
      const translated = findTranslatedProblem(officialId);
      const item = el('li', translated ? 'is-matched' : 'is-official-only');
      const target = el(translated ? 'a' : 'span', 'localized-problem-index-link');
      if (translated) {
        target.href = `#${translated.row.id}`;
        target.dataset.problemTarget = translated.row.id;
      }
      target.append(el('code', '', officialId), el('small', '', translated ? '中文题面 →' : 'Official only · 待中文覆盖'));
      item.appendChild(target);
      entries.appendChild(item);
    });
    group.appendChild(entries);
    problemIndexGrid.appendChild(group);
  });
  if (legacyOnlyProblems.length) {
    const group = el('section', 'localized-problem-index-group localized-problem-index-legacy');
    group.appendChild(el('h4', '', '2025 Legacy · 未映射到 2026 Stage'));
    const entries = el('ul', 'localized-problem-index-list');
    legacyOnlyProblems.forEach((problem) => {
      const item = el('li', 'is-legacy-only');
      const target = el('a', 'localized-problem-index-link');
      target.href = `#${problem.row.id}`;
      target.dataset.problemTarget = problem.row.id;
      target.append(el('code', '', problem.id), el('small', '', '2025 Legacy →'));
      item.appendChild(target);
      entries.appendChild(item);
    });
    group.appendChild(entries);
    problemIndexGrid.appendChild(group);
  }
  problemIndex.appendChild(problemIndexGrid);
  localization.appendChild(problemIndex);

  translatedOutline.classList.remove('legacy-source-outline');
  translatedOutline.classList.add('localized-source-outline');
  translatedOutline.querySelector('.legacy-reference-label')?.remove();
  const localizedEyebrow = translatedOutline.querySelector(':scope > .eyebrow');
  if (localizedEyebrow) localizedEyebrow.textContent = 'Spring 2025 本土化题面 · 逐题展开';
  const localizedHeading = translatedOutline.querySelector(':scope > h2');
  if (localizedHeading) localizedHeading.textContent = '逐题展开完整任务';
  translatedProblems.forEach((problem) => {
    const summary = problem.row.querySelector(':scope > summary');
    const status = el('span', 'problem-version-status ' + (problem.stages.length ? 'is-id-matched' : 'is-legacy-only'), problem.stages.length ? '2026 ID Matched · Needs Review' : '2025 Legacy');
    summary?.appendChild(status);
    const body = problem.row.querySelector(':scope > .problem-body');
    if (!body) return;
    const backlinks = el('nav', 'problem-workbook-backlinks');
    backlinks.setAttribute('aria-label', '返回 Engineering Workbook Stage');
    if (problem.stages.length) {
      backlinks.appendChild(el('span', 'workbook-kicker', 'Workbook Stage'));
      problem.stages.forEach(({ stage, stageIndex }) => {
        const link = el('a', '', `← Stage ${String(stageIndex + 1).padStart(2, '0')} · ${stage.title}`);
        link.href = `#workbook-stage-${stage.id}`;
        backlinks.appendChild(link);
      });
    } else {
      backlinks.append(el('span', 'workbook-kicker', 'Version status'), el('span', 'problem-unmapped-copy', 'Spring 2025-only / 尚未映射到 2026 Workbook Stage'));
    }
    body.prepend(backlinks);
  });
  localization.appendChild(translatedOutline);
  main.appendChild(localization);

  const officialSources = el('section', 'assignment-official-sources');
  officialSources.id = 'official-sources';
  const officialHeader = el('header', 'assignment-resource-header');
  officialHeader.append(
    el('p', 'workbook-kicker', 'Authority · Stanford Spring 2026'),
    el('h2', '', 'Official Handout & Repository'),
    el('p', '', 'Repository、PDF、README 与 tests 决定最终题号、接口、约束和 deliverables；中文题面与 Workbook 都不能覆盖官方要求。')
  );
  const officialResourceLinks = el('div', 'official-resource-links');
  [...linkRow.querySelectorAll('a')].forEach((link) => officialResourceLinks.appendChild(link.cloneNode(true)));
  officialHeader.appendChild(officialResourceLinks);
  officialSources.appendChild(officialHeader);
  semanticContent.officialSourceContent.forEach((node) => {
    node.classList.add('official-current-map');
    officialSources.appendChild(node);
  });
  main.appendChild(officialSources);

  const reference = el('details', 'workbook-reference-library');
  reference.id = 'workbook-reference';
  reference.appendChild(el('summary', '', 'Deep Reference · 旧版导读、知识树、Cheatsheet 与历史说明'));
  const referenceNote = el('div', 'workbook-reference-note');
  referenceNote.innerHTML = '<p><strong>这里不再包含中文完整题面。</strong>下方只保留旧版课程导读、重复知识树、Cheatsheet、历史接口说明与其他 secondary material。</p>';
  reference.appendChild(referenceNote);
  [...semanticContent.legacyGuide, ...semanticContent.legacySupplement, ...semanticContent.miscReference].forEach((node) => reference.appendChild(node));
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
  [
    ['中文完整题面', '#localized-problems', 'workbook-localization-link'],
    ['Official Handout', '#official-sources', 'workbook-official-link'],
    ['Deep Reference', '#workbook-reference', 'workbook-reference-link']
  ].forEach(([label, href, className]) => {
    const link = el('a', className, label);
    link.href = href;
    nav.appendChild(link);
  });
  aside.append(navLabel, nav);

  const shell = el('div', 'workbook-shell');
  shell.append(main, aside);
  primaryNav.insertAdjacentElement('afterend', shell);

  const activateProblem = (targetId, updateHash = true) => {
    const problem = document.getElementById(targetId);
    if (!problem?.classList.contains('problem-row')) return false;
    problem.open = true;
    problem.classList.remove('is-problem-target');
    requestAnimationFrame(() => {
      problem.classList.add('is-problem-target');
      const summary = problem.querySelector(':scope > summary');
      summary?.setAttribute('tabindex', '-1');
      summary?.focus({ preventScroll: true });
      problem.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
    if (updateHash && location.hash !== `#${targetId}`) history.pushState(null, '', `#${targetId}`);
    window.setTimeout(() => problem.classList.remove('is-problem-target'), 2200);
    return true;
  };

  shell.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-problem-target]');
    if (!link) return;
    event.preventDefault();
    activateProblem(link.dataset.problemTarget);
  });
  window.addEventListener('hashchange', () => activateProblem(location.hash.slice(1), false));
  if (location.hash.startsWith('#problem-')) requestAnimationFrame(() => activateProblem(location.hash.slice(1), false));

  page.dataset.localizedProblemCount = String(translatedProblems.length);
  page.dataset.localizationMatchedCount = String(matchedOfficialIds.length);
  page.dataset.localizationMissingCount = String(officialOnlyIds.length);
  page.dataset.localizationLegacyCount = String(legacyOnlyProblems.length);

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
