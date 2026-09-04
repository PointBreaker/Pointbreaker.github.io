(function () {
  const page = document.querySelector('.page, main.review-shell, article.reading-article');
  if (!page) return;

  const scriptUrl = new URL(document.currentScript.src, location.href);
  const assetsMarker = '/assets/course/lesson-ui.js';
  const markerIndex = scriptUrl.pathname.lastIndexOf(assetsMarker);
  const siteBase = markerIndex >= 0 ? `${scriptUrl.pathname.slice(0, markerIndex)}/` : '/';
  const relativePagePath = location.pathname.startsWith(siteBase) ? location.pathname.slice(siteBase.length) : location.pathname.replace(/^\//, '');
  const segments = relativePagePath.split('/').filter(Boolean);
  const courseRootSegment = 'courses';
  const courseIndex = segments[0] === courseRootSegment ? 1 : 0;
  const courseId = segments[courseIndex];
  if (!courseId) return;
  const courseBase = `${siteBase}${courseIndex ? `${courseRootSegment}/` : ''}${courseId}/`;
  const homeBase = siteBase;
  const currentRelative = decodeURIComponent(location.pathname.slice(courseBase.length));

  document.body.classList.add('pb-ready');
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="pb-reading-progress" aria-hidden="true"><span></span></div>
    <header class="pb-coursebar">
      <div class="pb-coursebar-inner">
        <div class="pb-crumb">
          <a class="pb-brand" href="${homeBase}">CourseStack</a>
          <span aria-hidden="true">/</span>
          <a class="pb-crumb-course" href="${courseBase}" id="pb-course-name">课程 Dashboard</a>
        </div>
        <nav class="pb-coursebar-actions" aria-label="阅读导航">
          <a href="${courseBase}">课程目录</a>
          <button class="pb-comments-toggle" type="button" aria-controls="pb-comments" aria-expanded="false">讨论</button>
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

  const h2Headings = headings.filter((heading) => heading.tagName === 'H2');

  page.querySelectorAll('table').forEach((table) => {
    if (table.parentElement?.classList.contains('pb-table-scroll')) return;
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'pb-table-scroll';
    table.parentNode.insertBefore(scrollContainer, table);
    scrollContainer.appendChild(table);
  });

  const grammarAliases = {
    c: 'clike',
    cpp: 'clike',
    matlab: 'clike',
    pseudocode: 'clike',
    json: 'javascript',
    shell: 'bash',
    sh: 'bash'
  };
  const inferCodeLanguage = (source) => {
    const text = source.trim();
    if (!text) return 'plaintext';
    if (/^\s*[\[{][\s\S]*[\]}]\s*$/.test(text)) {
      try { JSON.parse(text); return 'json'; } catch (_) { /* keep looking */ }
    }
    if (/^#!.*\b(?:bash|sh|zsh)\b/m.test(text) || /(?:^|\n)\s*(?:sudo\s+)?(?:apt|brew|cargo|cd|chmod|curl|docker|git|make|mkdir|npm|pip|python\d*|rm|ssh)\b/m.test(text)) return 'bash';
    if (/\b(?:def|elif|import|from|lambda|print|yield)\b/.test(text) || /(?:^|\n)\s*@\w+(?:\.\w+)*(?:\([^\n]*\))?\s*\n\s*(?:class|def)\b/m.test(text)) return 'python';
    if (/^\s*#include\s*[<"]/m.test(text) || /\b(?:int|void|char|double|float|size_t)\s+\w+\s*\([^;]*\)\s*\{/.test(text) || /\b(?:std::|printf\s*\(|malloc\s*\()/m.test(text)) return /\b(?:std::|namespace\b|template\s*<)/.test(text) ? 'cpp' : 'c';
    if (/\b(?:function|procedure|algorithm)\s+\w+|(?:^|\n)\s*(?:for|while)\b.*(?:do|:)|(?:^|\n)\s*(?:return|if)\b.*(?:then|:)/im.test(text)) return 'pseudocode';
    if (/^\s*function\b[^\n=]*=/m.test(text) || /(?:^|\n)\s*(?:end|elseif)\s*$/m.test(text) || /\b(?:zeros|ones|linspace|subplot)\s*\(/.test(text)) return 'matlab';
    return 'plaintext';
  };
  const normalizeCodeBlocks = () => {
    page.querySelectorAll('pre').forEach((pre) => {
      let code = pre.querySelector(':scope > code');
      if (!code) {
        code = document.createElement('code');
        code.textContent = pre.textContent;
        pre.replaceChildren(code);
      }
      const currentLanguage = [...code.classList].find((name) => name.startsWith('language-'))?.slice(9)
        || [...pre.classList].find((name) => name.startsWith('language-'))?.slice(9);
      const language = currentLanguage || inferCodeLanguage(code.textContent);
      pre.classList.add(`language-${language}`);
      code.classList.add(`language-${language}`);
      pre.dataset.language = language === 'plaintext' || language === 'text' ? 'text' : language;

      if (window.Prism) {
        const grammarName = grammarAliases[language] || language;
        if (!window.Prism.languages[language] && window.Prism.languages[grammarName]) {
          window.Prism.languages[language] = window.Prism.languages[grammarName];
        }
        window.Prism.highlightElement(code);
      }
    });
  };
  normalizeCodeBlocks();

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

  const commentsDrawer = document.createElement('aside');
  commentsDrawer.className = 'pb-comments-drawer';
  commentsDrawer.id = 'pb-comments';
  commentsDrawer.setAttribute('aria-label', '课程讨论');
  commentsDrawer.setAttribute('aria-hidden', 'true');
  commentsDrawer.innerHTML = `
    <div class="pb-comments-drawer-header">
      <div>
        <p class="pb-comments-kicker">Course discussion</p>
        <h2>继续讨论这一课</h2>
      </div>
      <button class="pb-comments-close" type="button" aria-label="关闭讨论区">关闭</button>
    </div>
    <div class="pb-comments-drawer-body">
      <p class="pb-comments-intro">使用 GitHub 账号参与讨论。每个讲义与实践页面都有独立话题。</p>
      <div class="pb-comments-status" role="status">正在连接 GitHub Discussions…</div>
      <div class="pb-comments-host"></div>
    </div>`;
  document.body.appendChild(commentsDrawer);

  const commentsToggle = document.querySelector('.pb-comments-toggle');
  const commentsClose = commentsDrawer.querySelector('.pb-comments-close');
  let commentsMounted = false;
  const setCommentsOpen = (open, restoreFocus = false) => {
    document.body.classList.toggle('pb-comments-open', open);
    commentsToggle.setAttribute('aria-expanded', String(open));
    commentsDrawer.setAttribute('aria-hidden', String(!open));
    if (open) {
      mountComments();
      requestAnimationFrame(() => commentsClose.focus({ preventScroll: true }));
    } else if (restoreFocus) {
      commentsToggle.focus({ preventScroll: true });
    }
  };
  commentsToggle.addEventListener('click', () => setCommentsOpen(!document.body.classList.contains('pb-comments-open')));
  commentsClose.addEventListener('click', () => setCommentsOpen(false, true));
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('pb-comments-open')) setCommentsOpen(false, true);
  });
  addEventListener('hashchange', () => {
    if (location.hash === '#pb-comments') setCommentsOpen(true);
  });

  const mountComments = async () => {
    if (commentsMounted) return;
    commentsMounted = true;
    const statusNode = commentsDrawer.querySelector('.pb-comments-status');
    const host = commentsDrawer.querySelector('.pb-comments-host');
    const showUnavailable = () => {
      host.hidden = true;
      statusNode.hidden = false;
      statusNode.innerHTML = '评论功能正在完成 GitHub 授权。你可以先前往 <a href="https://github.com/PointBreaker/Pointbreaker.github.io/discussions">GitHub Discussions</a> 参与讨论。';
    };
    try {
      const response = await fetch(`${siteBase}site-comments.json`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`comments config ${response.status}`);
      const config = await response.json();
      if (!config.enabled || config.provider !== 'giscus') {
        commentsToggle.remove();
        commentsDrawer.remove();
        return;
      }
      if (config.installed === false) {
        showUnavailable();
        return;
      }

      const required = ['repo', 'repoId', 'category', 'categoryId'];
      if (required.some((key) => !config[key])) throw new Error('comments config is incomplete');

      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      addEventListener('message', (event) => {
        if (event.origin !== 'https://giscus.app' || !event.data?.giscus) return;
        const error = event.data.giscus.error;
        if (error && !error.includes('Discussion not found')) showUnavailable();
        if (error?.includes('Discussion not found')) statusNode.hidden = true;
        if (event.data.giscus.discussion) statusNode.hidden = true;
      });
      const attributes = {
        repo: config.repo,
        'repo-id': config.repoId,
        category: config.category,
        'category-id': config.categoryId,
        mapping: config.mapping || 'specific',
        term: config.term || `${courseId}/${currentRelative}`,
        strict: config.strict || '1',
        'reactions-enabled': config.reactionsEnabled || '1',
        'emit-metadata': config.emitMetadata || '0',
        'input-position': config.inputPosition || 'bottom',
        theme: config.theme || 'light',
        lang: config.lang || 'zh-CN',
        loading: config.loading || 'lazy'
      };
      Object.entries(attributes).forEach(([key, value]) => script.setAttribute(`data-${key}`, value));
      script.addEventListener('error', showUnavailable);
      host.appendChild(script);
    } catch (_) {
      statusNode.innerHTML = '评论区配置尚未完成。请前往 <a href="https://github.com/PointBreaker/Pointbreaker.github.io/discussions">GitHub Discussions</a> 查看现有话题。';
    }
  };
  if (location.hash === '#pb-comments') setCommentsOpen(true);

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  const stageProfiles = {
    '18-01-single-variable-calculus': [[7, '导数与极限'], [15, '导数的应用'], [23, '积分模型'], [30, '积分技巧'], [99, '级数与复盘']],
    '18-02-multivariable-calculus': [[7, '空间与向量'], [15, '多元微分'], [23, '多重积分'], [30, '向量分析'], [99, '积分定理与复盘']],
    '18-06-linear-algebra': [[6, '线性方程组'], [12, '子空间与基'], [19, '正交与行列式'], [25, '特征结构'], [99, '变换与应用']],
    '6.102': [[5, '可靠代码基础'], [9, '规格与抽象'], [13, '函数与语言'], [17, '并发与异步'], [99, '网络与小语言']],
    '6.1810': [[4, 'xv6 与系统调用'], [9, '虚拟内存'], [14, '并发与协调'], [19, '存储与崩溃'], [99, '现代系统边界']],
    '6.5840': [[5, '分布式地基'], [10, '复制与一致性'], [15, '事务与验证'], [18, '规模化系统'], [99, '安全与开放网络']],
    cs152: [[5, 'ISA 与流水线'], [10, '存储层次'], [15, '乱序与向量'], [20, '并行处理器'], [99, '一致性与互连']],
    cs168: [[4, '互联网地基'], [10, '路由与转发'], [14, '可靠传输'], [18, '端到端服务'], [22, '数据中心'], [99, '无线与移动']],
    cs170: [[2, '算法工具箱'], [4, '分治与图'], [6, '最短路与贪心'], [8, '动态规划与 LP'], [99, '难解问题']],
    cs267: [[6, '性能与局部性'], [11, '共享与分布内存'], [16, '数值与机器学习'], [21, '结构化计算'], [99, '图与层次算法']],
    cs336: [[4, '模型与表示'], [8, 'GPU 与并行'], [12, '扩展与推理'], [16, '数据与对齐'], [99, '强化学习']],
    cs70: [[3, '证明与稳定性'], [6, '数论与编码'], [9, '计数与概率'], [12, '随机变量'], [99, '连续概率']],
    eecs498: [[3, '函数与优化'], [6, '视觉表示'], [8, '序列记忆'], [12, 'Transformer'], [99, '现代生成模型']]
  };

  const profileForPage = (info) => {
    const declared = document.body.dataset.courseProfile || info.courseTypeProfiles?.[0] || '';
    const signature = `${declared} ${info.domain || ''} ${info.title || ''}`.toLowerCase();
    if (/machine|learning|deep|ai|tensor|模型|机器学习|深度学习/.test(signature)) {
      return { label: 'COMPUTE MODEL', tokens: ['tensor / shape', 'representation', 'data flow', 'gradient / compute'] };
    }
    if (/network|distributed|internet|operating|system|architecture|parallel|网络|系统|体系结构|并行/.test(signature)) {
      return { label: 'SYSTEMS MODEL', tokens: ['object / packet', 'local state', 'event / message', 'table / invariant'] };
    }
    if (/algorithm|complex|算法/.test(signature)) {
      return { label: 'ALGORITHM MODEL', tokens: ['input', 'state / iteration', 'invariant', 'complexity / counterexample'] };
    }
    if (/software|construction|编程|软件/.test(signature)) {
      return { label: 'ENGINEERING MODEL', tokens: ['contract', 'representation', 'invariant', 'failure / evidence'] };
    }
    return { label: 'REASONING MODEL', tokens: ['definition', 'intuition', 'derivation', 'proof / counterexample'] };
  };

  const groupCourseItems = (items, isWork) => {
    if (isWork) {
      const groups = new Map();
      items.forEach((item) => {
        const key = item.kind || 'Practice';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
      });
      return [...groups.entries()].map(([label, entries], index) => ({ label: `${index + 1}. ${label}`, entries }));
    }
    const profile = stageProfiles[courseId] || [[5, '基础'], [10, '核心机制'], [15, '推演'], [20, '工程'], [99, '综合']];
    let start = 0;
    return profile.map(([until, label], index) => {
      const entries = items.slice(start, Math.min(until, items.length));
      start = Math.min(until, items.length);
      return { label: `${index}. ${label}`, entries };
    }).filter((group) => group.entries.length);
  };

  const mountCourseRail = (info, status, collection, current) => {
    if (!Array.isArray(collection) || current < 0) return;
    const isWork = collection[current].type === 'work';
    const groups = groupCourseItems(collection, isWork);
    const completed = (status.lectures || []).filter((item) => item.status === 'completed').length;
    const total = Number(status.totalLectures) || (status.lectures || []).length || 1;
    const percent = Math.round(completed / total * 100);
    const rail = document.createElement('aside');
    rail.className = 'pb-course-rail';
    rail.setAttribute('aria-label', '课程内容');
    rail.innerHTML = `<a class="pb-course-rail-home" href="${courseBase}"><span class="pb-course-rail-code">${escapeHtml(info.code || info.courseCode || courseId.toUpperCase())} 课程地图</span><span aria-hidden="true">⌃</span></a>
      <div class="pb-course-rail-scroll">
        ${groups.map((group) => `<section class="pb-rail-group"><h2>${escapeHtml(group.label)}</h2><nav>${group.entries.map((item) => {
          const absoluteIndex = collection.indexOf(item);
          const rawNumber = item.displayNumber || item.number || absoluteIndex + 1;
          return `<a class="pb-course-rail-link" href="${courseBase}${escapeHtml(item.file)}"${absoluteIndex === current ? ' aria-current="page"' : ''}><span class="pb-course-rail-number">${escapeHtml(String(rawNumber).padStart(2, '0'))}</span><span>${escapeHtml(item.titleZh || item.title)}</span></a>`;
        }).join('')}</nav></section>`).join('')}
      </div>
      <div class="pb-course-rail-progress"><div class="pb-course-rail-progress-row"><span>课程进度</span><strong>${completed} / ${total}</strong></div><div class="pb-course-rail-track"><span style="width:${Math.min(100, Math.max(0, percent))}%"></span></div></div>`;
    document.body.append(rail);
    rail.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'center' });
    document.body.classList.add('pb-has-course-rail');
  };

  const mountStudioChrome = (info, status, currentItem) => {
    document.body.classList.add('pb-studio-shell', 'pb-has-studio-inspector');
    document.querySelectorAll('.reading-toc, .workbook-side-nav, .review-stage-nav').forEach((node) => node.setAttribute('aria-hidden', 'true'));

    const directTitle = page.querySelector(':scope > h1');
    const sourceTitle = directTitle || page.querySelector('.guide-banner h1') || document.querySelector('.lesson-hero h1, .review-hero h1, h1');
    const sourceEyebrow = page.querySelector(':scope > .eyebrow') || document.querySelector('.lesson-hero .eyebrow, .review-hero > * > p:first-child');
    const sourceLede = page.querySelector(':scope > .lede') || document.querySelector('.lesson-hero .hero-lede, .review-hero .review-lede');

    if (!directTitle && sourceTitle) {
      const intro = document.createElement('header');
      intro.className = 'pb-studio-intro';
      intro.innerHTML = `${sourceEyebrow ? `<p class="eyebrow">${escapeHtml(sourceEyebrow.textContent.trim())}</p>` : ''}<h1>${escapeHtml(sourceTitle.textContent.trim())}</h1>${sourceLede ? `<p class="lede">${escapeHtml(sourceLede.textContent.trim())}</p>` : ''}`;
      page.prepend(intro);
      document.body.classList.add('pb-rebuilt-intro');
    }

    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'pb-lesson-breadcrumb';
    breadcrumb.setAttribute('aria-label', '面包屑');
    breadcrumb.innerHTML = `<a href="${courseBase}">${escapeHtml(info.code || courseId)}</a><span>/</span><span>${currentItem.type === 'work' ? '实践工作台' : '课程内容'}</span><span>/</span><strong>${escapeHtml(currentItem.titleZh || currentItem.title)}</strong>`;
    page.prepend(breadcrumb);

    const labTarget = page.querySelector('[data-interactive-src], .interactive-mount, .worked-trace, .execution-trace, .guided-problem');
    const dedicatedInteractive = labTarget?.matches('[data-interactive-src]') && /(?:distance-vector-convergence|router-pipeline-stepper|tcp-sequence-space)\.json/.test(labTarget.dataset.interactiveSrc || '');
    if (dedicatedInteractive) document.body.classList.add('pb-dedicated-interactive');
    const practiceTarget = page.querySelector('.quiz, .deep-checks, .explain-yourself, .closed-book-reconstruction, pre');
    const contentTarget = h2Headings[0] || page;
    const tabs = document.createElement('nav');
    tabs.className = 'pb-studio-tabs';
    tabs.setAttribute('aria-label', '学习模式');
    const tabItems = [
      ['内容', contentTarget],
      ['交互实验', labTarget],
      [currentItem.type === 'work' ? '推演与证据' : '代码与练习', practiceTarget]
    ];
    tabs.innerHTML = tabItems.map(([label, target], index) => `<button type="button" class="${index === 0 ? 'is-active' : ''}"${target ? '' : ' disabled'} data-target="${target?.id || ''}">${label}</button>`).join('');
    const headingAnchor = page.querySelector(':scope > .lede, :scope > .source-note, :scope > .meta, :scope > .guide-banner, :scope > .pb-studio-intro');
    if (headingAnchor) headingAnchor.insertAdjacentElement('afterend', tabs);
    else page.insertBefore(tabs, page.firstChild?.nextSibling || null);
    if (dedicatedInteractive) {
      const interactiveSection = labTarget.closest('section');
      if (interactiveSection) tabs.insertAdjacentElement('afterend', interactiveSection);
    }
    tabs.querySelectorAll('button:not([disabled])').forEach((button) => {
      button.addEventListener('click', () => {
        tabs.querySelectorAll('button').forEach((item) => item.classList.toggle('is-active', item === button));
        const target = button.dataset.target ? document.getElementById(button.dataset.target) : contentTarget;
        target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      });
    });

    const model = profileForPage(info);
    const quizzes = page.querySelectorAll('.quiz').length;
    const traces = page.querySelectorAll('.worked-trace, .execution-trace, .interactive-mount, [data-interactive-src], .guided-problem').length;
    const codeBlocks = page.querySelectorAll('pre').length;
    const externalLinks = [...page.querySelectorAll('a[href^="http"]')].filter((link, index, all) => all.findIndex((candidate) => candidate.href === link.href) === index).slice(0, 6);
    const inspector = document.createElement('aside');
    inspector.className = 'pb-studio-inspector';
    inspector.setAttribute('aria-label', '学习状态检查器');
    inspector.innerHTML = `<header><div><p>${escapeHtml(currentItem.type === 'work' ? 'Reasoning workspace' : 'Learning workspace')}</p><h2>${escapeHtml(model.label)}</h2></div><span><i></i> READY</span></header>
      <div class="pb-inspector-tabs" role="tablist"><button type="button" role="tab" aria-selected="true" data-panel="state">State</button><button type="button" role="tab" aria-selected="false" data-panel="table">Table</button><button type="button" role="tab" aria-selected="false" data-panel="event">Event</button></div>
      <section class="pb-inspector-panel is-active" data-inspector-panel="state"><p class="pb-inspector-label">MENTAL MODEL</p><dl class="pb-model-table">${model.tokens.map((token, index) => `<div><dt>${String(index + 1).padStart(2, '0')}</dt><dd>${escapeHtml(token)}</dd></div>`).join('')}</dl><p class="pb-inspector-label">LEARNING EVIDENCE</p><dl class="pb-evidence-grid"><div><dt>${h2Headings.length}</dt><dd>sections</dd></div><div><dt>${traces}</dt><dd>traces</dd></div><div><dt>${quizzes}</dt><dd>checks</dd></div><div><dt>${codeBlocks}</dt><dd>code blocks</dd></div></dl></section>
      <section class="pb-inspector-panel" data-inspector-panel="table"><p class="pb-inspector-label">ON THIS PAGE</p><nav class="pb-inspector-toc">${h2Headings.slice(0, 16).map((heading, index) => `<a href="#${heading.id}"><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(heading.textContent.trim())}</a>`).join('')}</nav></section>
      <section class="pb-inspector-panel" data-inspector-panel="event"><p class="pb-inspector-label">SOURCE / NEXT ACTION</p>${externalLinks.length ? `<nav class="pb-inspector-sources">${externalLinks.map((link) => `<a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.textContent.trim() || 'Source')} <span>↗</span></a>`).join('')}</nav>` : '<p class="pb-inspector-empty">本页没有外部 source；通过页尾导航继续。</p>'}<a class="pb-inspector-action" href="${practiceTarget?.id ? `#${practiceTarget.id}` : '#pb-page-end'}">进入闭卷检查 →</a></section>`;
    if (!dedicatedInteractive) document.body.append(inspector);
    inspector.querySelectorAll('[role="tab"]').forEach((button) => button.addEventListener('click', () => {
      inspector.querySelectorAll('[role="tab"]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      inspector.querySelectorAll('.pb-inspector-panel').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.inspectorPanel === button.dataset.panel));
    }));

    const tocLinks = [...inspector.querySelectorAll('.pb-inspector-toc a')];
    if (tocLinks.length) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
      }), { rootMargin: '-20% 0px -72% 0px' });
      h2Headings.forEach((heading) => observer.observe(heading));
    }
  };

  Promise.all([
    fetch(`${courseBase}course-info.json`, { cache: 'no-store' }).then((response) => response.json()),
    fetch(`${courseBase}api/status.json`, { cache: 'no-store' }).then((response) => response.json())
  ]).then(([info, status]) => {
    const courseName = document.querySelector('#pb-course-name');
    courseName.textContent = info.code || info.courseCode || courseId;
    document.documentElement.style.setProperty('--pb-accent', info.accent || '#166534');

    const lectures = (status.lectures || []).map((item) => ({ ...item, type: 'lecture', file: item.lessonFile }));
    const work = (status.assignments || []).filter((item) => item.assGuideFile || item.contentFile).map((item) => ({ ...item, type: 'work', file: item.assGuideFile || item.contentFile }));
    const workCurrent = work.findIndex((item) => item.file === currentRelative);
    const lectureCurrent = lectures.findIndex((item) => item.file === currentRelative);
    const collection = workCurrent >= 0 ? work : lectures;
    const current = workCurrent >= 0 ? workCurrent : lectureCurrent;
    if (current < 0) return;

    mountCourseRail(info, status, collection, current);
    mountStudioChrome(info, status, collection[current]);

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
