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
        <div class="course-bar-inner">
          <div class="dashboard-crumb"><a class="wordmark" href="${siteBase}">CourseStack</a><span class="dashboard-course-context"><strong id="course-bar-code">Course</strong><i id="course-bar-title"></i></span></div>
          <nav class="course-bar-links" aria-label="课程导航"><a href="#learning-path">课程目录</a><a id="course-resources" href="#" hidden>完整资源</a><a id="course-source" href="#" target="_blank" rel="noopener">官方课程主页</a><a href="${siteBase}docs/course-generator.html">贡献课程</a><a class="course-user" href="https://github.com/PointBreaker" target="_blank" rel="noopener" aria-label="PointBreaker 的 GitHub 主页"><img src="https://github.com/PointBreaker.png?size=64" alt=""></a></nav>
        </div>
      </header>
      <main class="dashboard-studio">
        <aside class="dashboard-rail" aria-label="课程地图">
          <a class="dashboard-rail-home" href="#top"><strong id="rail-course-code">Course</strong><span>课程地图</span></a>
          <nav id="dashboard-stage-nav"></nav>
          <div class="dashboard-rail-progress"><span>课程进度</span><strong id="rail-progress">—</strong><div class="progress-track"><div class="progress-fill" id="rail-progress-fill"></div></div></div>
        </aside>
        <div class="dashboard-canvas" id="top">
          <span id="lectures" class="dashboard-anchor" aria-hidden="true"></span><span id="labs" class="dashboard-anchor" aria-hidden="true"></span>
          <section class="course-hero">
            <div class="course-hero-grid">
              <div>
                <p class="course-kicker" id="course-code">载入课程…</p>
                <h1 id="course-title">Course</h1>
                <p class="course-title-zh" id="course-title-zh"></p>
                <p class="course-summary" id="course-summary"></p>
                <div class="course-tags" id="course-tags"></div>
              </div>
            </div>
          </section>
          <nav class="dashboard-mode-tabs" aria-label="课程视图"><a class="is-active" href="#learning-path">内容</a><a href="#learning-path" data-dashboard-view="homework">实践实验</a><a href="#learning-path" data-dashboard-view="exams">考试与复盘</a></nav>
          <section class="course-stats" aria-label="课程统计">
            <div class="stats-grid">
              <div class="metric"><strong class="metric-value" id="metric-lectures">—</strong><span class="metric-label">讲义</span></div>
              <div class="metric"><strong class="metric-value" id="metric-work">—</strong><span class="metric-label" id="work-label">实践任务</span></div>
              <div class="metric"><strong class="metric-value" id="metric-completed">—</strong><span class="metric-label">已完成</span></div>
              <div class="metric"><strong class="metric-value" id="metric-progress">—</strong><span class="metric-label">课程进度</span><div class="progress-track"><div class="progress-fill" id="progress-fill"></div></div></div>
            </div>
          </section>
          <section class="dashboard" id="learning-path" aria-labelledby="path-title">
            <div class="dashboard-heading"><div><p class="section-kicker">Learning path</p><h2 id="path-title">从讲义走向实践。</h2></div><p id="path-description">先建立概念，再用实践检验理解。每节讲义只在所属阶段出现一次。</p></div>
            <div class="dashboard-tools">
              <label class="dashboard-search"><span class="visually-hidden">搜索课程内容</span><input id="dashboard-search" type="search" placeholder="搜索讲义、作业、考试或概念" autocomplete="off"></label>
              <div class="view-filters" id="view-filters" aria-label="内容类型"><button class="view-filter" type="button" data-view="all" aria-pressed="true">全部</button><button class="view-filter" type="button" data-view="lectures" aria-pressed="false">讲义</button><button class="view-filter" type="button" data-view="homework" aria-pressed="false">实践</button><button class="view-filter" type="button" data-view="exams" aria-pressed="false">Exam</button></div>
            </div>
            <p class="result-status" id="result-status" aria-live="polite">正在载入课程…</p>
            <div class="path-list" id="path-list"></div>
          </section>
          <footer class="course-footer"><div class="course-footer-inner"><span>CourseStack 课栈 · 基于一手课程资料整理</span><a href="${siteBase}">返回课程目录</a></div></footer>
        </div>
        <aside class="dashboard-inspector" aria-label="课程状态">
          <header><div><p>COURSE STATUS</p><h2 id="inspector-course-code">Course</h2></div><span class="dashboard-live">READY</span></header>
          <div class="dashboard-inspector-tabs"><button type="button" aria-pressed="true" data-inspector-tab="state">State</button><button type="button" aria-pressed="false" data-inspector-tab="path">Path</button><button type="button" aria-pressed="false" data-inspector-tab="source">Source</button></div>
          <section class="dashboard-inspector-panel is-active" data-inspector-panel="state"><p class="inspector-label">COURSE PROFILE</p><dl class="course-facts"><div><dt>学校</dt><dd id="course-university">—</dd></div><div><dt>学期</dt><dd id="course-term">—</dd></div><div><dt>教师</dt><dd id="course-instructors">—</dd></div><div><dt>语言</dt><dd id="course-language">中文讲义</dd></div></dl><p class="inspector-label">LEARNING CONTRACT</p><div class="dashboard-contract"><p>概念教材</p><p>推演与状态</p><p>实践证据</p><p>闭卷重建</p></div></section>
          <section class="dashboard-inspector-panel" data-inspector-panel="path"><p class="inspector-label">COURSE PATH</p><nav class="dashboard-inspector-path" id="dashboard-inspector-path"></nav></section>
          <section class="dashboard-inspector-panel" data-inspector-panel="source"><p class="inspector-label">SOURCE OF TRUTH</p><p class="dashboard-source-copy" id="dashboard-source-copy">课程内容以一手资料为依据，CourseStack 负责教学化重构。</p><a class="dashboard-source-action" id="dashboard-source-action" href="#" target="_blank" rel="noopener">核对官方课程</a></section>
        </aside>
      </main>`;
  }

  const root = document.documentElement;
  const pathList = document.querySelector('#path-list');
  const search = document.querySelector('#dashboard-search');
  const resultStatus = document.querySelector('#result-status');
  const filters = document.querySelector('#view-filters');
  if (!pathList || !search || !resultStatus || !filters) return;

  document.querySelectorAll('[data-inspector-tab]').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('[data-inspector-tab]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-inspector-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.inspectorPanel === button.dataset.inspectorTab));
  }));

  let info;
  let status;
  let stages = [];
  let activeView = 'all';
  let hasExams = false;
  let hasMultipleWorkKinds = false;

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
    return info.assignments?.length ? info.assignments : (status.assignments || []);
  }

  function hydrateHeader() {
    root.style.setProperty('--course-accent', info.accent || '#63e68c');
    document.title = `${info.code} · ${info.title} — CourseStack 课栈`;
    setText('#course-code', `${info.code} · ${info.domain}`);
    setText('#course-bar-code', info.code);
    setText('#course-bar-title', info.title);
    setText('#rail-course-code', info.code);
    setText('#inspector-course-code', info.code);
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
    const sourceAction = document.querySelector('#dashboard-source-action');
    if (sourceAction) {
      sourceAction.href = info.sourceUrl || info.homepage || '#';
      sourceAction.hidden = !(info.sourceUrl || info.homepage);
    }
    setText('#dashboard-source-copy', info.sourceStatus || '课程内容以一手资料为依据，CourseStack 负责教学化重构。');
    const resources = document.querySelector('#course-resources');
    if (resources) {
      resources.href = info.resourcesUrl || '#';
      resources.hidden = !info.resourcesUrl;
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
    setText('#rail-progress', `${completed} / ${lectures.length}`);
    document.querySelector('#progress-fill').style.width = `${percent}%`;
    document.querySelector('#rail-progress-fill').style.width = `${percent}%`;
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
      <span class="lesson-title">${escapeHtml(lecture.title)}</span>
      <span class="lesson-detail">${escapeHtml(detail)}</span>
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
    const visibleNumber = item.displayNumber ?? item.resourceNumber ?? item.number;
    const searchText = [kind, item.number, visibleNumber, item.title, item.titleZh, item.description].join(' ').toLowerCase();
    const usesSourceFacingNumber = item.displayNumber != null || item.resourceNumber != null || hasMultipleWorkKinds;
    const sequenceLabel = type === 'exams'
      ? `Exam ${String(item.courseStackDisplayNumber).padStart(2, '0')}`
      : hasExams && !usesSourceFacingNumber
        ? `HW ${String(item.courseStackDisplayNumber).padStart(2, '0')}`
        : `${kind} ${visibleNumber}`;
    return `<${tag} class="flow-card ${type === 'exams' ? 'exam-card' : 'homework-card'}" data-card data-type="${type}" data-search="${escapeHtml(searchText)}"${linkAttribute}>
      <p class="card-kicker">${escapeHtml(sequenceLabel)}</p>
      <h4>${escapeHtml(item.titleZh || item.title)}</h4>
      ${item.description ? `<p class="card-description">${escapeHtml(item.description)}</p>` : ''}
      <div class="card-meta">${item.problemCount ? `<span>${escapeHtml(item.problemCount)} 题</span>` : ''}${item.solutionAvailable ? '<span>含答案</span>' : ''}${item.released ? `<span>发布 ${escapeHtml(item.released)}</span>` : ''}${due ? `<span>${escapeHtml(due)}</span>` : ''}</div>
      <span class="card-action">${href ? (item.solutionAvailable ? '打开题目与答案' : '打开练习') : '内容制作中'}</span>
    </${tag}>`;
  }

  function workGroupMarkup(items, type) {
    if (!hasMultipleWorkKinds) return items.map((item) => workMarkup(item, type));
    const kindOrder = { discussion: 0, homework: 1, assignment: 1, lab: 2, project: 3, module: 4 };
    const groups = new Map();
    [...items].sort((a, b) => {
      const aKind = String(a.kind || a.type || 'Assignment');
      const bKind = String(b.kind || b.type || 'Assignment');
      const order = (kindOrder[aKind.toLowerCase()] ?? 9) - (kindOrder[bKind.toLowerCase()] ?? 9);
      if (order) return order;
      return String(a.displayNumber ?? a.resourceNumber ?? a.number).localeCompare(
        String(b.displayNumber ?? b.resourceNumber ?? b.number), undefined, { numeric: true }
      );
    }).forEach((item) => {
      const kind = item.kind || item.type || 'Assignment';
      if (!groups.has(kind)) groups.set(kind, []);
      groups.get(kind).push(item);
    });
    return [...groups.entries()].map(([kind, groupItems]) => `<section class="work-group" data-work-group>
      <header class="work-group-heading"><span>${escapeHtml(kind)}</span><strong>${groupItems.length}</strong></header>
      <div class="work-group-items">${groupItems.map((item) => workMarkup(item, type)).join('')}</div>
    </section>`);
  }

  function rangeLabel(stage) {
    if (!stage.lectures.length) return '补充阶段';
    const first = stage.lectures[0].number;
    const last = stage.lectures[stage.lectures.length - 1].number;
    return String(first) === String(last) ? `L${first}` : `L${first}–L${last}`;
  }

  function stageTopic(stage) {
    const first = stage.lectures[0];
    if (!first) return '综合实践';
    const title = first.titleZh || first.title || rangeLabel(stage);
    return String(title).replace(/^第?\s*\d+\s*(?:课|讲)?[：:\s·-]*/i, '');
  }

  function laneMarkup(type, title, items, emptyText, count = items.length) {
    return `<div class="flow-lane ${type}-lane" data-lane="${type}">
      <div class="lane-heading"><span>${escapeHtml(title)}</span><strong>${count}</strong></div>
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
      const homeworkCards = workGroupMarkup(stage.homework, 'homework');
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
          ${laneMarkup('homework', homeworkTitle, homeworkCards, `本阶段暂无 ${homeworkTitle}`, stage.homework.length)}
          ${hasExams ? `<div class="flow-arrow" data-arrow data-from="homework" data-to="exams" aria-hidden="true"><span>→</span></div>${laneMarkup('exams', 'Exam', examCards, '本阶段暂无 Exam')}` : ''}
        </div>
      </section>`;
    }).join('') || '<div class="empty-state">课程内容正在整理中。</div>';
    const stageNav = document.querySelector('#dashboard-stage-nav');
    if (stageNav) stageNav.innerHTML = stages.map((stage, index) => `<a href="#stage-${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(stageTopic(stage))}</strong><small>${escapeHtml(rangeLabel(stage))} · ${stage.lectures.length} 讲 · ${stage.homework.length + stage.exams.length} 实践</small></a>`).join('');
    const inspectorPath = document.querySelector('#dashboard-inspector-path');
    if (inspectorPath) inspectorPath.innerHTML = stages.map((stage, index) => `<a href="#stage-${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(stageTopic(stage))}</strong><small>${escapeHtml(rangeLabel(stage))} · ${stage.lectures.length} lectures</small></a>`).join('');
    pathList.querySelectorAll('[data-stage]').forEach((stage, index) => { stage.id = `stage-${index + 1}`; });
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

      stage.querySelectorAll('[data-work-group]').forEach((group) => {
        group.hidden = !group.querySelector('[data-card]:not(.is-hidden)');
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
  document.querySelectorAll('[data-dashboard-view]').forEach((link) => link.addEventListener('click', () => {
    const view = link.dataset.dashboardView;
    const filter = filters.querySelector(`[data-view="${view}"]`);
    if (!filter || filter.hidden) return;
    activeView = view;
    filters.querySelectorAll('[data-view]').forEach((item) => item.setAttribute('aria-pressed', String(item === filter)));
    document.querySelectorAll('.dashboard-mode-tabs a').forEach((item) => item.classList.toggle('is-active', item === link));
    applyFilters();
  }));
  search.addEventListener('input', applyFilters);

  Promise.all([
    fetch('course-info.json', { cache: 'no-store' }).then((response) => response.json()),
    fetch('api/status.json', { cache: 'no-store' }).then((response) => response.json())
  ]).then(([courseInfo, courseStatus]) => {
    info = courseInfo;
    status = courseStatus;
    hasExams = getAssignments().some(isExam);
    hasMultipleWorkKinds = new Set(
      getAssignments().filter((item) => !isExam(item)).map((item) => item.kind || item.type || 'Assignment')
    ).size > 1;
    hydrateHeader();
    hydrateStats();
    renderPaths();
  }).catch(() => {
    pathList.innerHTML = '<div class="load-error">课程数据暂时无法读取，请刷新页面后重试。</div>';
    resultStatus.textContent = '课程载入失败';
  });
})();
