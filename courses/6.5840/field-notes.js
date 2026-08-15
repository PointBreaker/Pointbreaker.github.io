(() => {
  const rows = [...document.querySelectorAll('.lecture-row')];
  const search = document.querySelector('[data-lecture-search]');
  const filters = [...document.querySelectorAll('[data-phase-filter]')];
  let activePhase = 'all';
  const applyFilter = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    rows.forEach((row) => {
      const show = (activePhase === 'all' || row.dataset.phase === activePhase) && (!query || row.dataset.search.includes(query));
      row.hidden = !show;
      if (show) visible += 1;
    });
    const empty = document.querySelector('.empty-state');
    if (empty) empty.hidden = visible !== 0;
  };
  filters.forEach((button) => button.addEventListener('click', () => {
    activePhase = button.dataset.phaseFilter;
    filters.forEach((item) => item.classList.toggle('active', item === button));
    applyFilter();
  }));
  search?.addEventListener('input', applyFilter);
  rows.forEach((row) => {
    const button = row.querySelector('.lecture-summary');
    const detail = row.querySelector('.lecture-detail');
    const toggle = row.querySelector('.lecture-toggle');
    button?.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      rows.forEach((other) => {
        other.classList.remove('open');
        other.querySelector('.lecture-summary')?.setAttribute('aria-expanded', 'false');
        const otherDetail = other.querySelector('.lecture-detail');
        if (otherDetail) otherDetail.hidden = true;
        const otherToggle = other.querySelector('.lecture-toggle');
        if (otherToggle) otherToggle.textContent = '+';
      });
      if (!open) { row.classList.add('open'); button.setAttribute('aria-expanded', 'true'); detail.hidden = false; toggle.textContent = '−'; }
    });
  });
  document.querySelectorAll('.quiz').forEach((quiz) => {
    quiz.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
      quiz.querySelectorAll('[data-choice]').forEach((item) => { item.classList.remove('correct', 'incorrect'); item.setAttribute('aria-pressed', 'false'); });
      const correct = button.dataset.choice === quiz.dataset.answer;
      button.classList.add(correct ? 'correct' : 'incorrect');
      button.setAttribute('aria-pressed', 'true');
      quiz.querySelector('.quiz-feedback').textContent = correct ? quiz.dataset.correct : quiz.dataset.incorrect;
    }));
  });
  document.querySelectorAll('[data-copy-source]').forEach((button) => button.addEventListener('click', async () => {
    const text = button.closest('.archive')?.querySelector('pre')?.textContent || '';
    try { await navigator.clipboard.writeText(text); button.textContent = '已复制'; } catch { button.textContent = '复制失败'; }
  }));
  document.querySelectorAll('[data-source-search]').forEach((input) => input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    input.closest('.source-vault')?.querySelectorAll('[data-source-record]').forEach((record) => { record.hidden = !!query && !record.dataset.source.includes(query); });
  }));
  const progress = document.querySelector('.reading-progress span');
  if (progress) {
    const update = () => { const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`; };
    addEventListener('scroll', update, { passive: true }); update();
  }
  const toc = [...document.querySelectorAll('.reading-toc a[href^="#"]')];
  if (toc.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { toc.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)); }
    }), { rootMargin: '-20% 0px -70% 0px' });
    toc.forEach((a) => { const target = document.querySelector(a.getAttribute('href')); if (target) observer.observe(target); });
  }
})();
