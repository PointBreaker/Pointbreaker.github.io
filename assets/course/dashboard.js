(function () {
  const mount = document.querySelector('#course-app');
  if (mount) {
    mount.outerHTML = `
      <a class="skip-link" href="#learning-path">跳到学习路径</a>
      <header class="course-bar">
        <div class="shell course-bar-inner">
          <a class="wordmark" href="../">CourseStack</a>
          <nav class="course-bar-links" aria-label="课程导航">
            <a href="#learning-path">学习路径</a>
            <a id="course-source" href="#" target="_blank" rel="noopener">官方课程主页</a>
            <a href="../docs/course-generator.html">贡献课程</a>
          </nav>
        </div>
      </header>
      <main>
        <section class="course-hero">
          <div class="shell course-hero-grid">
            <div>
              <p class="course-kicker" id="course-code">载入课程…</p>
              <h1 id="course-title">Course</h1>
              <p class="course-title-zh" id="course-title-zh"></p>
              <p class="course-summary" id="course-summary"></p>
              <div class="course-tags" id="course-tags"></div>
            </div>
            <dl class="course-facts">
              <div><dt>学校</dt><dd id="course-university">—</dd></div>
              <div><dt>学期</dt><dd id="course-term">—</dd></div>
              <div><dt>教师</dt><dd id="course-instructors">—</dd></div>
              <div><dt>语言</dt><dd id="course-language">中文讲义</dd></div>
            </dl>
          </div>
        </section>
        <section class="course-stats" aria-label="课程统计">
          <div class="shell stats-grid">
            <div class="metric"><strong class="metric-value" id="metric-lectures">—</strong><span class="metric-label">讲义</span></div>
            <div class="metric"><strong class="metric-value" id="metric-work">—</strong><span class="metric-label" id="work-label">实践任务</span></div>
            <div class="metric"><strong class="metric-value" id="metric-completed">—</strong><span class="metric-label">已完成</span></div>
            <div class="metric"><strong class="metric-value" id="metric-progress">—</strong><span class="metric-label">课程进度</span><div class="progress-track"><div class="progress-fill" id="progress-fill"></div></div></div>
          </div>
        </section>
        <section class="dashboard shell" id="learning-path" aria-labelledby="path-title">
          <div class="dashboard-heading">
            <div><p class="section-kicker">Learning path</p><h2 id="path-title">从讲义走向实践。</h2></div>
            <p>每个学习单元把前置讲义和对应作业或实验放在一起。先建立概念，再用实践检验理解。</p>
          </div>
          <div class="dashboard-tools">
            <label class="dashboard-search"><span class="visually-hidden">搜索课程内容</span><input id="dashboard-search" type="search" placeholder="搜索讲义、作业或概念" autocomplete="off"></label>
            <div class="view-filters" id="view-filters" aria-label="内容类型">
              <button class="view-filter" type="button" data-view="all" aria-pressed="true">全部</button>
              <button class="view-filter" type="button" data-view="lectures" aria-pressed="false">讲义</button>
              <button class="view-filter" type="button" data-view="work" aria-pressed="false">实践</button>
            </div>
          </div>
          <p class="result-status" id="result-status" aria-live="polite">正在载入课程…</p>
          <div class="path-list" id="path-list"></div>
        </section>
      </main>
      <footer class="course-footer"><div class="shell course-footer-inner"><span>CourseStack 课栈 · 基于一手课程资料整理</span><a href="../">返回课程目录</a></div></footer>`;
  }

  const root = document.documentElement;
  const pathList = document.querySelector('#path-list');
  const search = document.querySelector('#dashboard-search');
  const resultStatus = document.querySelector('#result-status');
  const filters = document.querySelector('#view-filters');
  if (!pathList || !search || !resultStatus || !filters) return;

  let info;
  let status;
  let activeView = 'all';

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  })[char]);

  const normalizePath = (value) => String(value || '').replace(/^\.\//, '');

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value ?? '';
  }

  function hydrateHeader() {
    root.style.setProperty('--course-accent', info.accent || '#63e68c');
    document.title = `${info.code} · ${info.title} — CourseStack 课栈`;
    setText('#course-code', `${info.code} · ${info.domain}`);
    setText('#course-title', info.title);
    setText('#course-title-zh', info.titleZh || '');
    setText('#course-summary', info.summary || '');
    setText('#course-university', info.university || '');
    setText('#course-term', info.term || '');
    setText('#course-instructors', (info.instructors || []).join(' · '));
    setText('#course-language', info.language || '中文讲义');
    document.querySelector('#course-tags').innerHTML = (info.tags || []).map((tag) => `<span class="course-tag">${escapeHtml(tag)}</span>`).join('');

    const source = document.querySelector('#course-source');
    if (source) {
      source.href = info.sourceUrl || '#';
      source.textContent = info.sourceLabel || '官方课程主页';
      source.hidden = !info.sourceUrl;
    }
  }

  function hydrateStats() {
    const lectures = status.lectures || [];
    const workItems = status.assignments || [];
    const completed = lectures.filter((lecture) => lecture.status === 'completed').length;
    const percent = lectures.length ? Math.round(completed / lectures.length * 100) : 0;
    setText('#metric-lectures', lectures.length);
    setText('#metric-work', workItems.length);
    setText('#metric-completed', `${completed}/${lectures.length}`);
    setText('#metric-progress', `${percent}%`);
    document.querySelector('#progress-fill').style.width = `${percent}%`;
    setText('#work-label', info.workItemLabel || status.workItemLabel || '实践任务');
  }

  function lessonMarkup(lecture) {
    const detail = [lecture.instructor, lecture.date].filter(Boolean).join(' · ');
    const state = lecture.status || 'upcoming';
    const stateLabel = state === 'completed' ? '已完成' : state === 'current' ? '进行中' : '待学习';
    return `<a class="lesson-link" data-type="lecture" data-search="${escapeHtml([lecture.number, lecture.title, detail].join(' ').toLowerCase())}" href="${escapeHtml(normalizePath(lecture.lessonFile))}">
      <span class="lesson-number">L${escapeHtml(lecture.number)}</span>
      <span class="lesson-title">${escapeHtml(lecture.title)}<span class="lesson-detail">${escapeHtml(detail)}</span></span>
      <span class="lesson-status ${escapeHtml(state)}">${stateLabel}</span>
    </a>`;
  }

  function renderPaths() {
    const lectures = status.lectures || [];
    const assignments = status.assignments || [];
    const assigned = new Set();
    const units = assignments.map((item, index) => {
      const dependencies = (item.dependsOn || []).map((number) => lectures.find((lecture) => String(lecture.number) === String(number))).filter(Boolean);
      dependencies.forEach((lecture) => assigned.add(String(lecture.number)));
      const kind = item.kind || info.workItemLabel || status.workItemLabel || 'Assignment';
      const due = item.due ? `截止 ${item.due}` : '';
      const action = item.assGuideFile ? '打开实践导读' : '导读制作中';
      const href = item.assGuideFile ? `href="${escapeHtml(normalizePath(item.assGuideFile))}"` : '';
      return `<section class="path-unit" data-unit data-search="${escapeHtml([kind, item.number, item.title, item.description, ...dependencies.map((lecture) => lecture.title)].join(' ').toLowerCase())}">
        <a class="work-card" data-type="work" ${href}>
          <p class="unit-number">Unit ${String(index + 1).padStart(2, '0')} · ${escapeHtml(kind)} ${escapeHtml(item.number)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p class="work-description">${escapeHtml(item.description || '')}</p>
          <div class="work-meta">${item.released ? `<span>发布 ${escapeHtml(item.released)}</span>` : ''}${due ? `<span>${escapeHtml(due)}</span>` : ''}</div>
          <span class="work-action">${action}</span>
        </a>
        <div class="lesson-list">${dependencies.map(lessonMarkup).join('') || '<div class="empty-state">这项实践暂未登记前置讲义。</div>'}</div>
      </section>`;
    });

    const remaining = lectures.filter((lecture) => !assigned.has(String(lecture.number)));
    if (remaining.length) {
      units.push(`<section class="path-unit" data-unit data-search="${escapeHtml(remaining.map((lecture) => lecture.title).join(' ').toLowerCase())}">
        <div class="work-card" data-type="work">
          <p class="unit-number">Further study</p>
          <h3>补充与进阶主题</h3>
          <p class="work-description">不直接对应当前作业或实验，但构成课程知识地图的重要部分。</p>
        </div>
        <div class="lesson-list">${remaining.map(lessonMarkup).join('')}</div>
      </section>`);
    }

    pathList.innerHTML = units.join('') || '<div class="empty-state">课程内容正在整理中。</div>';
    applyFilters();
  }

  function applyFilters() {
    const query = search.value.trim().toLocaleLowerCase('zh-CN');
    const visibleLessonFiles = new Set();
    let visibleUnits = 0;
    document.querySelectorAll('[data-unit]').forEach((unit) => {
      const work = unit.querySelector('[data-type="work"]');
      const lessons = [...unit.querySelectorAll('[data-type="lecture"]')];
      const unitMatches = !query || (unit.dataset.search || '').includes(query);
      let unitHasVisibleLesson = false;

      lessons.forEach((lesson) => {
        const matchesType = activeView !== 'work';
        const matchesSearch = !query || (lesson.dataset.search || '').includes(query) || unitMatches;
        const visible = matchesType && matchesSearch;
        lesson.classList.toggle('is-hidden', !visible);
        if (visible) { visibleLessonFiles.add(lesson.getAttribute('href')); unitHasVisibleLesson = true; }
      });

      const workVisible = activeView !== 'lectures' && unitMatches;
      if (work) work.hidden = !workVisible;
      const visible = workVisible || unitHasVisibleLesson;
      unit.classList.toggle('is-hidden', !visible);
      if (visible) visibleUnits += 1;
    });
    resultStatus.textContent = `显示 ${visibleLessonFiles.size} 节讲义 · ${visibleUnits} 个学习单元`;
  }

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-view]');
    if (!button) return;
    activeView = button.dataset.view;
    filters.querySelectorAll('[data-view]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    applyFilters();
  });
  search.addEventListener('input', applyFilters);

  Promise.all([
    fetch('course-info.json', { cache: 'no-store' }).then((response) => response.json()),
    fetch('api/status.json', { cache: 'no-store' }).then((response) => response.json())
  ]).then(([courseInfo, courseStatus]) => {
    info = courseInfo;
    status = courseStatus;
    hydrateHeader();
    hydrateStats();
    renderPaths();
  }).catch(() => {
    pathList.innerHTML = '<div class="load-error">课程数据暂时无法读取，请刷新页面后重试。</div>';
    resultStatus.textContent = '课程载入失败';
  });
})();
