(function () {
  const scriptUrl = new URL(document.currentScript.src, location.href);
  const assetsMarker = '/assets/course/dashboard.js';
  const markerIndex = scriptUrl.pathname.lastIndexOf(assetsMarker);
  const siteBase = markerIndex >= 0 ? `${scriptUrl.pathname.slice(0, markerIndex)}/` : '/';
  const mount = document.querySelector('#course-app');
  if (mount) {
    mount.outerHTML = `
      <a class="skip-link" href="#learning-path">跳到学习路径</a>
      <header class="course-bar">
        <div class="shell course-bar-inner">
          <a class="wordmark" href="${siteBase}">CourseStack</a>
          <nav class="course-bar-links" aria-label="课程导航">
            <a href="#learning-path">学习路径</a>
            <a id="course-source" href="#" target="_blank" rel="noopener">官方课程主页</a>
            <a href="${siteBase}docs/course-generator.html">贡献课程</a>
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
            <p id="path-description">先建立概念，再用实践检验理解。每节讲义只在所属阶段出现一次。</p>
          </div>
          <div class="dashboard-tools">
            <label class="dashboard-search"><span class="visually-hidden">搜索课程内容</span><input id="dashboard-search" type="search" placeholder="搜索讲义、作业、考试或概念" autocomplete="off"></label>
            <div class="view-filters" id="view-filters" aria-label="内容类型">
              <button class="view-filter" type="button" data-view="all" aria-pressed="true">全部</button>
              <button class="view-filter" type="button" data-view="lectures" aria-pressed="false">讲义</button>
              <button class="view-filter" type="button" data-view="homework" aria-pressed="false">实践</button>
              <button class="view-filter" type="button" data-view="exams" aria-pressed="false">Exam</button>
            </div>
          </div>
          <p class="result-status" id="result-status" aria-live="polite">正在载入课程…</p>
          <div class="path-list" id="path-list"></div>
        </section>
      </main>
      <footer class="course-footer"><div class="shell course-footer-inner"><span>CourseStack 课栈 · 基于一手课程资料整理</span><a href="${siteBase}">返回课程目录</a></div></footer>`;
  }

  const root = document.documentElement;
  const pathList = document.querySelector('#path-list');
  const search = document.querySelector('#dashboard-search');
  const resultStatus = document.querySelector('#result-status');
  const filters = document.querySelector('#view-filters');
  if (!pathList || !search || !resultStatus || !filters) return;

  let info;
  let status;
  let stages = [];
  let activeView = 'all';
  let hasExams = false;

  const EXAM_PATTERN = /\b(exam|quiz|midterm|final)\b|考试|测验|期中|期末/i;
  const FINAL_PATTERN = /\bfinal\b|期末/i;
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  })[char]);

  const lectureNumber = (lecture) => Number(lecture.number) || 0;
  const dependencyNumbers = (item) => (item.dependsOn || []).map(Number).filter(Number.isFinite);
  const dependencyBoundary = (item) => Math.max(0, ...dependencyNumbers(item));
  const itemLabel = (item) => [item.kind, item.type, item.title, item.titleZh].filter(Boolean).join(' ');
  const isExam = (item) => EXAM_PATTERN.test(itemLabel(item));
  const isFinalExam = (item) => FINAL_PATTERN.test(itemLabel(item));

  function normalizePath(value, workItem = false) {
    const path = String(value || '').replace(/^\.\//, '');
    if (!path || /^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('/') || path.startsWith('lessons/')) return path;
    if (workItem && /^(?:work-items|assignments)\//.test(path)) return `lessons/${path}`;
    return path;
  }

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.textContent = value ?? '';
  }

  function getAssignments() {
    return info.assignments || status.assignments || [];
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
    const assignments = getAssignments();
    const homework = assignments.filter((item) => !isExam(item));
    const exams = assignments.filter(isExam);
    const completed = lectures.filter((lecture) => lecture.status === 'completed').length;
    const percent = lectures.length ? Math.round(completed / lectures.length * 100) : 0;
    const homeworkLabel = hasExams ? 'HW' : (info.workItemLabel || status.workItemLabel || '实践');

    setText('#metric-lectures', lectures.length);
    setText('#metric-work', hasExams ? `${homework.length} / ${exams.length}` : assignments.length);
    setText('#metric-completed', `${completed}/${lectures.length}`);
    setText('#metric-progress', `${percent}%`);
    document.querySelector('#progress-fill').style.width = `${percent}%`;
    setText('#work-label', hasExams ? 'HW / Exam' : homeworkLabel);
    setText('#path-title', hasExams ? '讲义、作业与考试，按阶段衔接。' : '从讲义走向实践。');
    setText('#path-description', hasExams
      ? '从左到右阅读：先掌握本阶段讲义，再完成 HW，最后用 Exam 检验整组知识。累计考试不会重复铺开之前的讲义。'
      : '先建立概念，再用实践检验理解。每节讲义只在所属阶段出现一次。');

    const homeworkFilter = filters.querySelector('[data-view="homework"]');
    const examFilter = filters.querySelector('[data-view="exams"]');
    if (homeworkFilter) homeworkFilter.textContent = homeworkLabel;
    if (examFilter) examFilter.hidden = !hasExams;
  }

  function buildStages() {
    const lectures = [...(status.lectures || [])].sort((a, b) => lectureNumber(a) - lectureNumber(b));
    const assignments = getAssignments();
    const homework = assignments.filter((item) => !isExam(item));
    const exams = assignments.filter(isExam);
    const lastLecture = lectures.length ? lectureNumber(lectures[lectures.length - 1]) : 0;

    if (!exams.length) {
      const orderedHomework = [...homework].sort((a, b) => dependencyBoundary(a) - dependencyBoundary(b) || Number(a.number) - Number(b.number));
      const result = [];
      let previousBoundary = 0;
      orderedHomework.forEach((item) => {
        const boundary = Math.max(previousBoundary, dependencyBoundary(item));
        const previous = result[result.length - 1];
        if (previous && boundary === previous.boundary) {
          previous.homework.push(item);
          return;
        }
        result.push({ boundary, lectures: [], homework: [item], exams: [] });
        previousBoundary = boundary;
      });
      if (!result.length || previousBoundary < lastLecture) {
        result.push({ boundary: lastLecture, lectures: [], homework: [], exams: [] });
      }
      let lectureStart = 0;
      result.forEach((stage) => {
        stage.lectures = lectures.filter((lecture) => lectureNumber(lecture) > lectureStart && lectureNumber(lecture) <= stage.boundary);
        lectureStart = stage.boundary;
      });
      return result;
    }

    const orderedExams = [...exams].sort((a, b) => {
      if (isFinalExam(a) !== isFinalExam(b)) return isFinalExam(a) ? 1 : -1;
      return dependencyBoundary(a) - dependencyBoundary(b) || Number(a.number) - Number(b.number);
    });
    const result = [];
    let previousBoundary = 0;
    orderedExams.forEach((exam) => {
      const requestedBoundary = isFinalExam(exam) ? lastLecture : dependencyBoundary(exam);
      const boundary = Math.max(previousBoundary, requestedBoundary);
      const previous = result[result.length - 1];
      if (previous && boundary === previous.boundary) {
        previous.exams.push(exam);
        return;
      }
      result.push({ boundary, lectures: [], homework: [], exams: [exam] });
      previousBoundary = boundary;
    });
    if (previousBoundary < lastLecture) {
      result.push({ boundary: lastLecture, lectures: [], homework: [], exams: [] });
    }

    let lectureStart = 0;
    result.forEach((stage) => {
      stage.lectures = lectures.filter((lecture) => lectureNumber(lecture) > lectureStart && lectureNumber(lecture) <= stage.boundary);
      lectureStart = stage.boundary;
    });
    homework.forEach((item) => {
      const boundary = dependencyBoundary(item);
      const target = result.find((stage) => stage.boundary >= boundary) || result[result.length - 1];
      if (target) target.homework.push(item);
    });
    return result;
  }

  function lessonMarkup(lecture) {
    const detail = [lecture.instructor, lecture.date].filter(Boolean).join(' · ');
    const state = lecture.status || 'upcoming';
    const stateLabel = state === 'completed' ? '已完成' : state === 'current' ? '进行中' : '待学习';
    const searchText = [lecture.number, lecture.title, detail].join(' ').toLowerCase();
    return `<a class="lesson-link" data-card data-type="lectures" data-search="${escapeHtml(searchText)}" href="${escapeHtml(normalizePath(lecture.lessonFile))}">
      <span class="lesson-number">L${escapeHtml(lecture.number)}</span>
      <span class="lesson-title">${escapeHtml(lecture.title)}<span class="lesson-detail">${escapeHtml(detail)}</span></span>
      <span class="lesson-status ${escapeHtml(state)}">${stateLabel}</span>
    </a>`;
  }

  function workMarkup(item, type) {
    const kind = item.kind || item.type || (type === 'exams' ? 'Exam' : info.workItemLabel || status.workItemLabel || 'Assignment');
    const file = item.assGuideFile || item.contentFile;
    const href = file ? normalizePath(file, true) : '';
    const tag = href ? 'a' : 'article';
    const linkAttribute = href ? ` href="${escapeHtml(href)}"` : '';
    const due = item.due ? `截止 ${item.due}` : '';
    const searchText = [kind, item.number, item.title, item.titleZh, item.description].join(' ').toLowerCase();
    const sequenceLabel = hasExams
      ? `${type === 'exams' ? 'Exam' : 'HW'} ${String(item.courseStackDisplayNumber).padStart(2, '0')}`
      : `${kind} ${item.number}`;
    return `<${tag} class="flow-card ${type === 'exams' ? 'exam-card' : 'homework-card'}" data-card data-type="${type}" data-search="${escapeHtml(searchText)}"${linkAttribute}>
      <p class="card-kicker">${escapeHtml(sequenceLabel)}</p>
      <h4>${escapeHtml(item.titleZh || item.title)}</h4>
      ${item.description ? `<p class="card-description">${escapeHtml(item.description)}</p>` : ''}
      <div class="card-meta">${item.released ? `<span>发布 ${escapeHtml(item.released)}</span>` : ''}${due ? `<span>${escapeHtml(due)}</span>` : ''}</div>
      <span class="card-action">${href ? '打开导读' : '导读制作中'}</span>
    </${tag}>`;
  }

  function rangeLabel(stage) {
    if (!stage.lectures.length) return '补充阶段';
    const first = stage.lectures[0].number;
    const last = stage.lectures[stage.lectures.length - 1].number;
    return String(first) === String(last) ? `L${first}` : `L${first}–L${last}`;
  }

  function laneMarkup(type, title, items, emptyText) {
    return `<div class="flow-lane ${type}-lane" data-lane="${type}">
      <div class="lane-heading"><span>${escapeHtml(title)}</span><strong>${items.length}</strong></div>
      <div class="lane-content">${items.join('') || `<div class="lane-empty">${escapeHtml(emptyText)}</div>`}</div>
    </div>`;
  }

  function renderPaths() {
    stages = buildStages();
    let homeworkNumber = 0;
    let examNumber = 0;
    getAssignments().forEach((item) => {
      item.courseStackDisplayNumber = isExam(item) ? ++examNumber : ++homeworkNumber;
    });
    const homeworkTitle = hasExams ? 'HW' : (info.workItemLabel || status.workItemLabel || '实践');
    pathList.innerHTML = stages.map((stage, index) => {
      const lectureCards = stage.lectures.map(lessonMarkup);
      const homeworkCards = stage.homework.map((item) => workMarkup(item, 'homework'));
      const examCards = stage.exams.map((item) => workMarkup(item, 'exams'));
      return `<section class="flow-stage${hasExams ? '' : ' two-lane'}" data-stage>
        <header class="stage-heading">
          <p>Stage ${String(index + 1).padStart(2, '0')}</p>
          <h3>${escapeHtml(rangeLabel(stage))}</h3>
          <span>${stage.lectures.length} 节讲义</span>
        </header>
        <div class="flow-grid">
          ${laneMarkup('lectures', '讲义', lectureCards, '本阶段暂无讲义')}
          <div class="flow-arrow" data-arrow data-from="lectures" data-to="homework" aria-hidden="true"><span>→</span></div>
          ${laneMarkup('homework', homeworkTitle, homeworkCards, `本阶段暂无 ${homeworkTitle}`)}
          ${hasExams ? `<div class="flow-arrow" data-arrow data-from="homework" data-to="exams" aria-hidden="true"><span>→</span></div>${laneMarkup('exams', 'Exam', examCards, '本阶段暂无 Exam')}` : ''}
        </div>
      </section>`;
    }).join('') || '<div class="empty-state">课程内容正在整理中。</div>';
    applyFilters();
  }

  function applyFilters() {
    const query = search.value.trim().toLocaleLowerCase('zh-CN');
    const visibleCounts = { lectures: 0, homework: 0, exams: 0, stages: 0 };

    document.querySelectorAll('[data-stage]').forEach((stage) => {
      stage.querySelectorAll('[data-card]').forEach((card) => {
        const matchesType = activeView === 'all' || card.dataset.type === activeView;
        const matchesSearch = !query || (card.dataset.search || '').includes(query);
        const visible = matchesType && matchesSearch;
        card.classList.toggle('is-hidden', !visible);
        if (visible) visibleCounts[card.dataset.type] += 1;
      });

      stage.querySelectorAll('[data-lane]').forEach((lane) => {
        const laneWanted = activeView === 'all' || lane.dataset.lane === activeView;
        const visibleCards = lane.querySelectorAll('[data-card]:not(.is-hidden)').length;
        lane.hidden = !laneWanted || (Boolean(query) && visibleCards === 0);
      });

      stage.querySelectorAll('[data-arrow]').forEach((arrow) => {
        const from = stage.querySelector(`[data-lane="${arrow.dataset.from}"]`);
        const to = stage.querySelector(`[data-lane="${arrow.dataset.to}"]`);
        arrow.hidden = !from || !to || from.hidden || to.hidden;
      });

      const visible = Boolean(stage.querySelector('[data-lane]:not([hidden])'));
      stage.classList.toggle('is-hidden', !visible);
      if (visible) visibleCounts.stages += 1;
    });

    const parts = [`${visibleCounts.lectures} 节讲义`, `${visibleCounts.homework} 个 ${hasExams ? 'HW' : (info.workItemLabel || status.workItemLabel || '实践')}`];
    if (hasExams) parts.push(`${visibleCounts.exams} 个 Exam`);
    parts.push(`${visibleCounts.stages} 个阶段`);
    resultStatus.textContent = `${query || activeView !== 'all' ? '显示 ' : ''}${parts.join(' · ')}`;
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
    hasExams = getAssignments().some(isExam);
    hydrateHeader();
    hydrateStats();
    renderPaths();
  }).catch(() => {
    pathList.innerHTML = '<div class="load-error">课程数据暂时无法读取，请刷新页面后重试。</div>';
    resultStatus.textContent = '课程载入失败';
  });
})();
