(function () {
  const grid = document.querySelector('#course-grid');
  const filtersRoot = document.querySelector('#course-filters');
  const search = document.querySelector('#course-search');
  const results = document.querySelector('#results-note');
  if (!grid || !filtersRoot || !search || !results) return;

  let courses = [];
  let activeDomain = 'all';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  })[char]);

  function renderFilters() {
    const domains = [...new Map(courses.map((course) => [course.domainKey, course.domain])).entries()];
    const options = [['all', '全部'], ...domains];
    filtersRoot.innerHTML = options.map(([key, label]) => (
      `<button class="filter-button" type="button" data-domain="${escapeHtml(key)}" aria-pressed="${key === activeDomain}">${escapeHtml(label)}</button>`
    )).join('');
  }

  function renderCourses() {
    const query = search.value.trim().toLocaleLowerCase('zh-CN');
    const visible = courses.filter((course) => {
      const matchesDomain = activeDomain === 'all' || course.domainKey === activeDomain;
      const haystack = [course.code, course.title, course.titleZh, course.university, course.domain, ...(course.tags || [])].join(' ').toLocaleLowerCase('zh-CN');
      return matchesDomain && (!query || haystack.includes(query));
    });

    results.textContent = `显示 ${visible.length} / ${courses.length} 门课程`;
    if (!visible.length) {
      grid.innerHTML = '<div class="empty-state">没有找到匹配的课程。换一个关键词，或清除当前筛选。</div>';
      return;
    }

    grid.innerHTML = visible.map((course, index) => `
      <a class="course-card" href="${escapeHtml(course.path)}" style="--course-accent:${escapeHtml(course.accent || '#63e68c')}">
        <div class="course-card-top">
          <span class="course-code">${escapeHtml(course.code)}</span>
          <span class="course-index">Course ${String(index + 1).padStart(2, '0')}</span>
        </div>
        <p class="course-domain">${escapeHtml(course.domain)}</p>
        <h3 class="course-title">${escapeHtml(course.title)}<span class="course-title-zh">${escapeHtml(course.titleZh)}</span></h3>
        <p class="course-summary">${escapeHtml(course.summary)}</p>
        <div class="course-meta">
          <span><strong>${escapeHtml(course.lectures)}</strong> 讲义</span>
          <span><strong>${escapeHtml(course.workItems)}</strong> ${escapeHtml(course.workLabel)}</span>
          <span>${escapeHtml(course.university)}</span>
          <span>${escapeHtml(course.term)}</span>
        </div>
        <div class="course-tags">${(course.tags || []).map((tag) => `<span class="course-tag">${escapeHtml(tag)}</span>`).join('')}</div>
      </a>
    `).join('');
  }

  filtersRoot.addEventListener('click', (event) => {
    const button = event.target.closest('[data-domain]');
    if (!button) return;
    activeDomain = button.dataset.domain;
    renderFilters();
    renderCourses();
  });
  search.addEventListener('input', renderCourses);

  fetch('courses.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      courses = data.courses || [];
      document.querySelector('#course-count').textContent = String(courses.length).padStart(2, '0');
      document.querySelector('#lecture-count').textContent = courses.reduce((sum, course) => sum + Number(course.lectures || 0), 0);
      document.querySelector('#work-count').textContent = courses.reduce((sum, course) => sum + Number(course.workItems || 0), 0);
      renderFilters();
      renderCourses();
    })
    .catch(() => {
      results.textContent = '课程目录载入失败';
      grid.innerHTML = '<div class="load-error">课程数据暂时无法读取，请刷新页面后重试。</div>';
    });
})();
