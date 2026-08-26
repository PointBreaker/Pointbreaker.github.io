(function () {
  const page = document.querySelector('.page');
  const match = location.pathname.match(/\/(00(?:0[1-9]|1[0-9]))-[^/]+\.html$/);
  if (!page || !match || page.dataset.layoutReady) return;

  page.dataset.layoutReady = 'true';
  document.body.classList.add('cs336-lesson');

  const map = page.querySelector(':scope > .learning-map');
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
  const sourceNote = hero.querySelector('.source-note');
  if (sourceNote) {
    const sourceDetails = document.createElement('details');
    sourceDetails.className = 'lesson-source-details';
    const sourceSummary = document.createElement('summary');
    sourceSummary.textContent = '官方材料与版本说明';
    sourceNote.insertAdjacentElement('beforebegin', sourceDetails);
    sourceDetails.append(sourceSummary, sourceNote);
  }

  const heroGrid = document.createElement('div');
  heroGrid.className = 'lesson-hero-grid';
  map.remove();
  heroGrid.appendChild(map);

  const outcomes = document.createElement('section');
  outcomes.className = 'lesson-outcomes';
  outcomes.innerHTML = '<strong>学完你应该能解释</strong>';
  const outcomesList = document.createElement('ul');
  [...checklist.querySelectorAll('li')].slice(0, 4).forEach((item) => {
    const clone = document.createElement('li');
    clone.innerHTML = item.innerHTML;
    outcomesList.appendChild(clone);
  });
  outcomes.appendChild(outcomesList);
  heroGrid.appendChild(outcomes);
  hero.appendChild(heroGrid);

  const main = document.createElement('main');
  main.className = 'lesson-main';
  while (page.firstChild) main.appendChild(page.firstChild);

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

  checklist.classList.add('closed-book');
  const checklistHeading = checklist.querySelector('h2');
  if (checklistHeading) checklistHeading.textContent = '不看上文，你能解释吗？';
  checklist.querySelectorAll('li').forEach((item) => {
    item.innerHTML = '<span aria-hidden="true">□</span><span>' + item.innerHTML + '</span>';
  });

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
