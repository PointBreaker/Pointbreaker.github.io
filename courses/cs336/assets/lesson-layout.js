(function () {
  const page = document.querySelector('.page');
  const match = location.pathname.match(/\/(00(?:0[1-9]|1[0-9]))-[^/]+\.html$/);
  if (!page || !match || page.dataset.layoutReady) return;

  page.dataset.layoutReady = 'true';
  document.body.classList.add('cs336-lesson');

  const map = page.querySelector(':scope > .learning-map');
  const contract = page.querySelector(':scope > .lesson-contract');
  const checklist = page.querySelector('.explain-checklist');
  const bottomNav = page.querySelector('.nav');
  if (!map || !checklist) return;

  const hero = document.createElement('header');
  hero.className = 'lesson-hero';
  hero.id = 'lesson-top';
  while (page.firstChild) {
    const child = page.firstChild;
    hero.appendChild(child);
    if (child === map) break;
  }

  const pager = document.createElement('nav');
  pager.className = 'lesson-pager';
  pager.setAttribute('aria-label', '相邻课程');
  if (bottomNav) {
    bottomNav.querySelectorAll('a').forEach((link) => pager.appendChild(link.cloneNode(true)));
  }
  const eyebrow = hero.querySelector('.eyebrow');
  (eyebrow || hero.firstElementChild)?.insertAdjacentElement('afterend', pager);

  const lede = hero.querySelector('.lede');
  if (lede) lede.classList.add('lesson-secondary-summary');
  const sourceNotes = [...hero.querySelectorAll(':scope > .source-note')];
  const sourceNote = sourceNotes.shift();
  if (sourceNote) {
    sourceNotes.forEach((extraNote) => {
      [...extraNote.children].forEach((child) => sourceNote.appendChild(child));
      extraNote.remove();
    });
    const sourceDetails = document.createElement('details');
    sourceDetails.className = 'lesson-source-details';
    const sourceSummary = document.createElement('summary');
    sourceSummary.textContent = `Source · Stanford CS336 Spring 2026 · Lecture ${Number(match[1])}`;
    sourceNote.insertAdjacentElement('beforebegin', sourceDetails);
    sourceDetails.append(sourceSummary, sourceNote);
  }

  const opening = document.createElement('section');
  opening.className = 'lesson-opening';
  opening.setAttribute('aria-label', '本课核心问题与先修知识');
  const question = hero.querySelector(':scope > .bridge');
  const duplicatedQuestionHeading = question?.previousElementSibling;
  if (duplicatedQuestionHeading?.tagName === 'H2' && /这一讲到底解决什么问题/.test(duplicatedQuestionHeading.textContent)) {
    duplicatedQuestionHeading.remove();
  }
  if (question) {
    question.classList.add('lesson-question');
    opening.appendChild(question);
  }
  map.remove();
  const mapLabel = map.querySelector('strong');
  if (mapLabel) mapLabel.textContent = '30-second mental model';
  opening.appendChild(map);
  if (contract) {
    contract.remove();
    contract.classList.add('lesson-prerequisite');
    const contractHeading = contract.querySelector('h3');
    if (contractHeading) contractHeading.textContent = 'Before you start';
    opening.appendChild(contract);
  }
  hero.appendChild(opening);

  const main = document.createElement('main');
  main.className = 'lesson-main';
  while (page.firstChild) main.appendChild(page.firstChild);

  const openingExample = main.querySelector(':scope > .worked-example');
  const openingMisconception = main.querySelector(':scope > .misconception');
  const firstMechanismHeading = [...main.querySelectorAll(':scope > h2')].find((heading) =>
    !['objectives', 'learning-objectives', 'learning-goals', 'quiz', 'takeaways', 'reading'].includes(heading.id)
  );
  if (firstMechanismHeading && (openingExample || openingMisconception)) {
    let boundary = firstMechanismHeading.nextElementSibling;
    while (boundary && !boundary.matches('hr.rule')) boundary = boundary.nextElementSibling;
    if (boundary) {
      if (openingExample) boundary.insertAdjacentElement('beforebegin', openingExample);
      if (openingMisconception) boundary.insertAdjacentElement('beforebegin', openingMisconception);
    }
  }

  const lesson = window.CS336PracticeBank?.[match[1]];
  const tocIds = [
    'before-start-heading',
    ...(lesson?.sections || []).map((item) => item.before),
    'deep-quiz-heading',
    'open-practice-heading',
    'can-explain'
  ];
  const seenTocIds = new Set();
  const sectionHeadings = tocIds.map((id) => main.querySelector('#' + id)).filter((heading) => {
    if (!heading || seenTocIds.has(heading.id)) return false;
    seenTocIds.add(heading.id);
    return true;
  });
  const makeTocLinks = () => sectionHeadings.map((heading, index) => {
    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent.trim();
    if (index === 0) link.classList.add('is-active');
    return link;
  });

  const toc = document.createElement('aside');
  toc.className = 'lesson-toc';
  toc.setAttribute('aria-label', '本课目录');
  const tocLabel = document.createElement('p');
  tocLabel.className = 'lesson-toc-label';
  tocLabel.textContent = 'On this page';
  const tocProgress = document.createElement('span');
  tocProgress.className = 'lesson-toc-progress';
  tocProgress.textContent = '0%';
  tocLabel.appendChild(tocProgress);
  const tocNav = document.createElement('nav');
  makeTocLinks().forEach((link) => tocNav.appendChild(link));
  toc.append(tocLabel, tocNav);

  const mobileToc = document.createElement('details');
  mobileToc.className = 'lesson-toc-mobile';
  const mobileSummary = document.createElement('summary');
  mobileSummary.textContent = '本课目录';
  const mobileNav = document.createElement('nav');
  makeTocLinks().forEach((link) => {
    link.addEventListener('click', () => mobileToc.removeAttribute('open'));
    mobileNav.appendChild(link);
  });
  mobileToc.append(mobileSummary, mobileNav);
  hero.appendChild(mobileToc);

  const shell = document.createElement('div');
  shell.className = 'lesson-shell';
  shell.append(main, toc);
  page.append(hero, shell);

  const labelBlocks = (selector, className, label) => {
    main.querySelectorAll(selector).forEach((node) => {
      node.classList.add('teaching-block', className);
      node.dataset.blockLabel = label;
    });
  };
  labelBlocks('.card.idea', 'mental-model', 'Mental Model');
  labelBlocks('.worked-example', 'derivation-block', 'Derivation');
  labelBlocks('.misconception', 'misconception-block', 'Misconception');
  labelBlocks('.concept-lab', 'concept-check-block', 'Concept Check');
  main.querySelectorAll('details.deep-dive').forEach((details) => {
    details.classList.add('teaching-deep-dive');
    details.removeAttribute('open');
  });

  main.querySelectorAll('.lesson-connection h3').forEach((heading) => {
    heading.textContent = 'Next';
  });

  checklist.classList.add('closed-book');
  const checklistHeading = checklist.querySelector('h2');
  if (checklistHeading) checklistHeading.textContent = '不看上文，你能解释吗？';
  checklist.querySelectorAll('li').forEach((item) => {
    item.innerHTML = '<span aria-hidden="true">□</span><span>' + item.innerHTML + '</span>';
  });

  const buildTargets = {
    '0001': ['Assignment 1 · Tokenizer', 'assignments/ass01-basics.html#workbook-stage-tokenizer', '亲手实现 BPE trainer、encoder / decoder，并用 tiny corpus 证明 rank 与 segmentation 正确。'],
    '0002': ['Assignment 1 · Optimization', 'assignments/ass01-basics.html#workbook-stage-optimization', '把 shape、backward 与资源账本变成稳定 loss、AdamW 和完整 train step。'],
    '0003': ['Assignment 1 · Transformer Forward', 'assignments/ass01-basics.html#workbook-stage-model', '将 RMSNorm、RoPE、attention、SwiGLU 与 residual stream 组合成可验证 forward。'],
    '0004': ['Assignment 1 · Transformer Forward', 'assignments/ass01-basics.html#workbook-stage-model', '在真实 tensor shape 中验证 causal attention 与架构组件的 contract。'],
    '0005': ['Assignment 2 · Measure', 'assignments/ass02-systems.html#workbook-stage-measure', '用同步 benchmark、profiler 与 Roofline 证据定位真实瓶颈。'],
    '0006': ['Assignment 2 · Move Less Data', 'assignments/ass02-systems.html#workbook-stage-kernels', '实现并测量 Triton / FlashAttention kernel，而不只比较 FLOPs。'],
    '0007': ['Assignment 2 · Overlap Communication', 'assignments/ass02-systems.html#workbook-stage-communication', '逐 rank 验证 collective 语义，再用 timeline 解释 overlap。'],
    '0008': ['Assignment 2 · Shard Model State', 'assignments/ass02-systems.html#workbook-stage-sharding', '画出 FSDP lifecycle，区分 persistent shard 与 peak materialization。'],
    '0009': ['Assignment 3 · Controlled Experiments', 'assignments/ass03-scaling.html#workbook-stage-experiments', '从 run ledger 与 IsoFLOPs 设计开始，而不是先套一条幂律。'],
    '0010': ['Assignment 3 · Compute-aware Decisions', 'assignments/ass03-scaling.html#workbook-stage-isoflops', '把 compute、model size 与 token budget 放进同一决策账本。'],
    '0011': ['Assignment 3 · Extrapolate Carefully', 'assignments/ass03-scaling.html#workbook-stage-extrapolate', '用 residual、holdout 与 sensitivity 证明预测边界。'],
    '0012': ['Assignment 3 · Validate Fit Quality', 'assignments/ass03-scaling.html#workbook-stage-validate', '把 metric、holdout 与 claim scope 写成可审计证据。'],
    '0013': ['Assignment 4 · Extract', 'assignments/ass04-data.html#workbook-stage-extract', '把 source、snapshot、record、document 与 token 串成可追踪 pipeline。'],
    '0014': ['Assignment 4 · Filter & Deduplicate', 'assignments/ass04-data.html#workbook-stage-filter', '记录 population、filter errors、bias risk 与 exact/near dedup 边界。'],
    '0015': ['Assignment 5 · Safety & Preference Evaluation', 'assignments/ass05-alignment.html#workbook-stage-safety-eval', '在可选 2026 supplement 中区分 objective、proxy、desired behavior 与 evidence。'],
    '0016': ['Assignment 5 · On-policy GRPO', 'assignments/ass05-alignment.html#workbook-stage-on-policy', '从 group advantages、rollout contract 与 verifier risk 推导实际 update。']
  };
  const buildTarget = buildTargets[match[1]];
  if (buildTarget) {
    const bridge = document.createElement('aside');
    bridge.className = 'lesson-build-bridge';
    bridge.innerHTML = '<p class="lesson-build-kicker">Learn → Build → Return</p><h3>' + buildTarget[0] + '</h3><p>' + buildTarget[2] + '</p><a href="' + buildTarget[1] + '">进入对应 Engineering Stage →</a>';
    checklist.insertAdjacentElement('afterend', bridge);
  }

  const desktopLinks = [...tocNav.querySelectorAll('a')];
  const mobileLinks = [...mobileNav.querySelectorAll('a')];
  const updateActive = (id) => {
    [...desktopLinks, ...mobileLinks].forEach((link) =>
      link.classList.toggle('is-active', link.hash === '#' + id)
    );
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) updateActive(visible[0].target.id);
    }, { rootMargin: '-16% 0px -74% 0px' });
    sectionHeadings.forEach((heading) => observer.observe(heading));
  }

  const updateProgress = () => {
    const start = main.offsetTop;
    const total = Math.max(1, main.offsetHeight - innerHeight);
    const value = Math.max(0, Math.min(100, (scrollY - start) / total * 100));
    tocProgress.textContent = Math.round(value) + '%';
  };
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();
})();
