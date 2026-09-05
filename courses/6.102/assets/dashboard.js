(function () {
  const list = document.querySelector('#lecture-list');
  const workbookList = document.querySelector('#workbook-list');
  if (!list || !workbookList) return;

  const escapeText = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const lectureSlug = (lessonFile) => lessonFile.split('/').pop().replace(/\.html$/, '');

  fetch('api/status.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`status ${response.status}`);
      return response.json();
    })
    .then((status) => {
      const lectures = status.lectures || [];
      const record = (() => { try { return JSON.parse(localStorage.getItem('coursestack.learning.v1') || '{}') || {}; } catch (_) { return {}; } })();
      const learning = record['6.102'] || {};
      const completed = new Set(learning.completed || []);
      const done = lectures.filter((lecture) => completed.has(`/courses/6.102/${lecture.lessonFile}`)).length;
      const last = learning.last && lectures.some((lecture) => `/courses/6.102/${lecture.lessonFile}` === learning.last.path) ? learning.last : null;
      const first = lectures[0];
      const resumeTitle = document.querySelector('#mit-resume-title');
      const resumeCopy = document.querySelector('#mit-resume-copy');
      const resumeStatus = document.querySelector('#mit-resume-status');
      const resumeProgress = document.querySelector('#mit-resume-progress');
      const resumeAction = document.querySelector('#mit-resume-action');
      if (resumeTitle) resumeTitle.textContent = last ? '继续学习' : '从这里开始';
      if (resumeCopy) resumeCopy.textContent = last?.title || first?.titleZh || '从第一讲开始，先建立这门课的工程坐标系。';
      if (resumeStatus) resumeStatus.textContent = `已完成 ${done} / ${lectures.length} 讲 · 记录保存在当前浏览器`;
      if (resumeProgress) { resumeProgress.max = Math.max(1, lectures.length); resumeProgress.value = done; }
      if (resumeAction) { resumeAction.href = last?.path || first?.lessonFile || 'lectures/01-static-checking.html'; resumeAction.textContent = last ? '继续学习' : '开始学习'; }
      list.innerHTML = status.lectures.map((lecture) => {
        const slug = lectureSlug(lecture.lessonFile);
        const officialSlug = slug === '05-designing-specifications' ? '05-designing-specs' : slug;
        const official = `https://web.mit.edu/6.102/www/sp26/classes/${officialSlug}/`;
        return `<article class="mit-lecture-row">
          <div class="mit-lecture-id"><span>${String(lecture.number).padStart(2, '0')}</span><div><strong>${escapeText(lecture.titleZh)}</strong><small>${escapeText(lecture.title)}</small></div></div>
          <a class="mit-source-link mit-digest" href="${escapeText(lecture.lessonFile)}">进入中文精读<small>CourseStack · 约 15–25 分钟</small></a>
          <a class="mit-source-link mit-official" href="${official}" target="_blank" rel="noreferrer">打开 MIT 官方原文 ↗<small>source of truth · English</small></a>
          <span class="mit-status">✓ 已映射</span>
        </article>`;
      }).join('');
      list.dataset.view = 'both';

      workbookList.innerHTML = status.assignments.map((assignment) => {
        const target = assignment.contentFile || assignment.assGuideFile;
        return `<a class="mit-workbook-card" href="${escapeText(target)}"><span>WORKBOOK ${String(assignment.number).padStart(2, '0')}</span><h3>${escapeText(assignment.titleZh)}</h3><p>${escapeText(assignment.title)} · 从工程约束、测试与 invariant 重新建立实现思路。</p><b>开始复盘 →</b></a>`;
      }).join('');
    })
    .catch(() => {
      list.innerHTML = '<p class="mit-loading">课程结构暂时无法载入，请刷新页面或直接打开 MIT 官方课程。</p>';
      workbookList.innerHTML = '<p class="mit-loading">实践索引暂时无法载入。</p>';
    });

  document.querySelectorAll('[data-source-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-source-view]').forEach((item) => item.classList.toggle('is-active', item === button));
      list.dataset.view = button.dataset.sourceView;
    });
  });
  document.querySelectorAll('[data-mit-panel]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-mit-panel]').forEach((item) => item.classList.toggle('is-active', item === button));
      document.querySelectorAll('[data-mit-inspector]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.mitInspector === button.dataset.mitPanel));
    });
  });
}());
