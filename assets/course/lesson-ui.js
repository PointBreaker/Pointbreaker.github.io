(function () {
  const page = document.querySelector('.page');
  if (!page) return;

  const scriptUrl = new URL(document.currentScript.src, location.href);
  const assetsMarker = '/assets/course/lesson-ui.js';
  const markerIndex = scriptUrl.pathname.lastIndexOf(assetsMarker);
  const siteBase = markerIndex >= 0 ? `${scriptUrl.pathname.slice(0, markerIndex)}/` : '/';
  const relativePagePath = location.pathname.startsWith(siteBase) ? location.pathname.slice(siteBase.length) : location.pathname.replace(/^\//, '');
  const segments = relativePagePath.split('/').filter(Boolean);
  const courseId = segments[0];
  if (!courseId) return;
  const courseBase = `${siteBase}${courseId}/`;
  const homeBase = siteBase;
  const currentRelative = decodeURIComponent(location.pathname.slice(courseBase.length));

  document.body.classList.add('pb-ready');
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="pb-reading-progress" aria-hidden="true"><span></span></div>
    <header class="pb-coursebar">
      <div class="pb-coursebar-inner">
        <div class="pb-crumb">
          <a class="pb-brand" href="${homeBase}">PointBreaker</a>
          <span aria-hidden="true">/</span>
          <a class="pb-crumb-course" href="${courseBase}" id="pb-course-name">课程 Dashboard</a>
        </div>
        <nav class="pb-coursebar-actions" aria-label="阅读导航">
          <a href="${courseBase}">课程目录</a>
          <a href="#pb-page-end">跳到页尾</a>
        </nav>
      </div>
    </header>`);

  const progress = document.querySelector('.pb-reading-progress span');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const percent = max > 0 ? Math.min(100, Math.max(0, scrollY / max * 100)) : 0;
    progress.style.width = `${percent}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();

  const slugify = (text, index) => {
    const slug = text.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
    return slug || `section-${index + 1}`;
  };
  const headings = [...page.querySelectorAll('h2, h3')];
  const usedIds = new Set([...document.querySelectorAll('[id]')].map((element) => element.id));
  headings.forEach((heading, index) => {
    if (heading.id) return;
    let id = slugify(heading.textContent, index);
    let suffix = 2;
    while (usedIds.has(id)) id = `${id}-${suffix++}`;
    heading.id = id;
    usedIds.add(id);
  });

  if (headings.filter((heading) => heading.tagName === 'H2').length >= 3) {
    const toc = document.createElement('aside');
    toc.className = 'pb-toc';
    toc.setAttribute('aria-label', '本页目录');
    toc.innerHTML = `<p class="pb-toc-label">On this page</p>${headings.slice(0, 14).map((heading) => `<a href="#${heading.id}" data-level="${heading.tagName === 'H2' ? 2 : 3}">${heading.textContent.trim()}</a>`).join('')}`;
    document.body.appendChild(toc);

    const tocLinks = [...toc.querySelectorAll('a')];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-18% 0px -72% 0px' });
    headings.forEach((heading) => observer.observe(heading));
  }

  page.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.pb-copy-code')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pb-copy-code';
    button.textContent = '复制';
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      try {
        await navigator.clipboard.writeText((code || pre).innerText);
        button.textContent = '已复制';
        setTimeout(() => { button.textContent = '复制'; }, 1400);
      } catch (_) {
        button.textContent = '复制失败';
      }
    });
    pre.appendChild(button);
  });

  const endMarker = document.createElement('div');
  endMarker.id = 'pb-page-end';
  endMarker.setAttribute('aria-hidden', 'true');
  page.appendChild(endMarker);

  Promise.all([
    fetch(`${courseBase}course-info.json`, { cache: 'no-store' }).then((response) => response.json()),
    fetch(`${courseBase}api/status.json`, { cache: 'no-store' }).then((response) => response.json())
  ]).then(([info, status]) => {
    const courseName = document.querySelector('#pb-course-name');
    courseName.textContent = info.code || info.courseCode || courseId;
    document.documentElement.style.setProperty('--pb-accent', info.accent || '#166534');

    const lectures = (status.lectures || []).map((item) => ({ ...item, type: 'lecture', file: item.lessonFile }));
    const work = (status.assignments || []).filter((item) => item.assGuideFile).map((item) => ({ ...item, type: 'work', file: item.assGuideFile }));
    const collection = currentRelative.includes('/assignments/') || currentRelative.startsWith('homeworks/') || currentRelative.startsWith('labs/') || currentRelative.startsWith('projects/')
      ? work : lectures;
    const current = collection.findIndex((item) => item.file === currentRelative);
    if (current < 0) return;

    const previous = collection[current - 1];
    const next = collection[current + 1];
    const label = collection[current].type === 'lecture' ? '讲义' : '实践';
    const titleFor = (item) => item ? `${item.number ? `${item.kind || label} ${item.number} · ` : ''}${item.title}` : '';
    const pager = document.createElement('nav');
    pager.className = 'pb-pager';
    pager.setAttribute('aria-label', '前后内容');
    pager.innerHTML = previous
      ? `<a class="pb-pager-link" href="${courseBase}${previous.file}"><span class="pb-pager-label">上一篇</span><span class="pb-pager-title">${titleFor(previous)}</span></a>`
      : '<span class="pb-pager-spacer"></span>';
    pager.innerHTML += next
      ? `<a class="pb-pager-link" href="${courseBase}${next.file}"><span class="pb-pager-label">下一篇</span><span class="pb-pager-title">${titleFor(next)}</span></a>`
      : `<a class="pb-pager-link" href="${courseBase}"><span class="pb-pager-label">完成本组内容</span><span class="pb-pager-title">返回课程 Dashboard</span></a>`;
    page.insertBefore(pager, endMarker);
  }).catch(() => {
    document.querySelector('#pb-course-name').textContent = courseId.toUpperCase();
  });
})();
