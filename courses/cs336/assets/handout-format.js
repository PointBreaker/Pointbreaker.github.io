(function () {
  const problemBodies = document.querySelectorAll('.source-outline .problem-body');
  if (!problemBodies.length) return;

  const textOf = (node) => node.textContent.replace(/\s+/g, ' ').trim();

  const headingKind = (heading) => {
    const text = textOf(heading);
    if (/背景|动机|概述/.test(text)) return 'context';
    if (/^[（(]?[a-zA-Z][）)]|^\d+[.、]/.test(text)) return 'subtask';
    if (/交付|提交|验收|检查/.test(text)) return 'delivery';
    if (/资源|预算|限制|约束/.test(text)) return 'constraint';
    return 'section';
  };

  const replaceDirectTextHeadings = (subsection) => {
    [...subsection.childNodes].forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
      const heading = document.createElement('h3');
      heading.className = 'handout-generated-heading';
      heading.textContent = node.textContent.replace(/\s+/g, ' ').trim();
      node.replaceWith(heading);
    });
  };

  const wrapTables = (subsection) => {
    subsection.querySelectorAll('table').forEach((table) => {
      const existingWrapper = table.closest('.handout-table-scroll, .pb-table-scroll');
      if (existingWrapper) {
        existingWrapper.classList.add('handout-table-scroll');
        return;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'handout-table-scroll';
      table.before(wrapper);
      wrapper.appendChild(table);
    });
  };

  const classifyCallout = (element) => {
    const text = textOf(element);
    if (/^(交付物|需要提交|提交内容|提交要求)|^交付物[：:]/.test(text)) {
      element.classList.add('handout-callout', 'handout-deliverable');
    } else if (/^(资源需求|计算资源|资源限制|时间预算|资源预算)/.test(text)) {
      element.classList.add('handout-callout', 'handout-resource');
    } else if (/^(自检|验收|检查方法|测试命令)/.test(text)) {
      element.classList.add('handout-callout', 'handout-check');
    } else if (/^(注意|提示)[：:]/.test(text)) {
      element.classList.add('handout-callout', 'handout-note');
    }
  };

  const groupSections = (subsection) => {
    const title = subsection.querySelector(':scope > h4');
    const content = [...subsection.children].filter((child) => child !== title);
    const headingSelector = 'H2,H3,H5,H6';
    const groups = [];
    let current = null;

    content.forEach((child) => {
      const isHeading = child.matches(headingSelector);
      if (isHeading || !current) {
        current = document.createElement('section');
        current.className = 'handout-block';
        groups.push(current);
      }
      current.appendChild(child);
      if (isHeading) current.dataset.kind = headingKind(child);
    });

    if (!groups.length) return;
    groups.forEach((group) => {
      if (!group.dataset.kind) group.dataset.kind = 'section';
      if (group.children.length === 1 && group.firstElementChild?.matches(headingSelector)) {
        group.classList.add('handout-block-label');
      }
      subsection.appendChild(group);
    });
  };

  const addReadingStrip = (body) => {
    const badges = body.querySelector(':scope > .problem-badges');
    if (!badges || body.querySelector(':scope > .handout-reading-strip')) return;
    const strip = document.createElement('div');
    strip.className = 'handout-reading-strip';
    strip.setAttribute('aria-label', 'Handout 题目阅读顺序');
    strip.innerHTML = [
      '<span><b>01</b> 题面与约束</span>',
      '<span><b>02</b> 提示按需展开</span>',
      '<span><b>03</b> 验收与来源</span>'
    ].join('');
    badges.after(strip);
  };

  problemBodies.forEach((body) => {
    if (body.dataset.handoutFormatReady === 'true') return;
    body.dataset.handoutFormatReady = 'true';
    addReadingStrip(body);

    body.querySelectorAll(':scope > .problem-subsection').forEach((subsection) => {
      replaceDirectTextHeadings(subsection);
      wrapTables(subsection);
      subsection.querySelectorAll('p, blockquote').forEach(classifyCallout);
      groupSections(subsection);
    });
  });

  window.PointBreakerHandoutFormat = { ready: true };
})();
