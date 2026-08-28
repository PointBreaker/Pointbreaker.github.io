(function () {
  const page = document.querySelector('.page');
  const match = location.pathname.match(/\/lessons\/([^/]+)\.html$/);
  const bank = window.CS267PracticeBank;
  if (!page || !match || !bank?.[match[1]] || page.dataset.learningReady) return;

  const lesson = bank[match[1]];
  const letters = ['A', 'B', 'C', 'D'];
  let uid = 0;
  page.dataset.learningReady = 'true';
  document.body.classList.add('cs267-textbook');

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const renderMath = (root) => window.renderCourseMath?.(root);
  const slugify = (value) => String(value).trim().toLowerCase()
    .replace(/[^a-z0-9\u3400-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'section';

  const usedIds = new Set([...page.querySelectorAll('[id]')].map((node) => node.id));
  page.querySelectorAll('h2, h3').forEach((heading, index) => {
    if (heading.id) return;
    const base = `section-${String(index + 1).padStart(2, '0')}-${slugify(heading.textContent).slice(0, 42)}`;
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    heading.id = id;
    usedIds.add(id);
  });

  function createQuestion(question, kind, onResult) {
    const [prompt, options, answer, explanations, followUp] = question;
    const article = el('article', `practice-question practice-question--${kind}`);
    const promptNode = el('p', 'practice-prompt');
    promptNode.innerHTML = prompt;
    article.appendChild(promptNode);

    const fieldset = el('fieldset', 'practice-options');
    fieldset.setAttribute('aria-label', '选择一个答案');
    const name = `cs267-practice-${match[1]}-${++uid}`;
    options.forEach((option, index) => {
      const label = el('label', 'practice-option');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = name;
      input.value = String(index);
      const copy = el('span', 'practice-option-copy');
      copy.innerHTML = `<strong>${letters[index]}.</strong> ${option}`;
      label.append(input, copy);
      fieldset.appendChild(label);
    });
    article.appendChild(fieldset);

    const actions = el('div', 'practice-actions');
    const submit = el('button', 'practice-submit', '提交答案');
    const retry = el('button', 'practice-retry', '重新作答');
    submit.type = retry.type = 'button';
    retry.hidden = true;
    actions.append(submit, retry);
    article.appendChild(actions);

    const feedback = el('div', 'practice-explanation');
    feedback.setAttribute('aria-live', 'polite');
    article.appendChild(feedback);
    let firstSubmission = true;

    submit.addEventListener('click', () => {
      const selected = fieldset.querySelector('input:checked');
      if (!selected) {
        feedback.className = 'practice-explanation is-empty';
        feedback.textContent = '先选择一个答案，再提交。';
        return;
      }
      const choice = Number(selected.value);
      const correct = choice === answer;
      fieldset.querySelectorAll('input').forEach((input) => { input.disabled = true; });
      fieldset.querySelectorAll('.practice-option').forEach((label, index) => {
        label.classList.toggle('is-correct', index === answer);
        label.classList.toggle('is-selected-wrong', index === choice && !correct);
      });
      const reasons = options.map((_, index) =>
        `<li class="${index === answer ? 'is-answer' : ''}"><strong>${letters[index]}.</strong> ${explanations[index]}</li>`
      ).join('');
      feedback.className = `practice-explanation ${correct ? 'is-correct' : 'is-incorrect'}`;
      feedback.innerHTML = `<p class="practice-result">${correct ? '✓ 正确：这条推理链成立。' : `✗ 需要修正：你选择了 ${letters[choice]}。`}</p>` +
        (correct ? '' : `<p><strong>你的 mental model 偏在哪里：</strong>${explanations[choice]}</p>`) +
        `<p><strong>正确答案为什么成立：</strong>${explanations[answer]}</p><ol class="option-reasons">${reasons}</ol>`;
      submit.hidden = true;
      retry.hidden = false;
      if (firstSubmission) {
        firstSubmission = false;
        onResult?.(correct);
      }
      if (followUp) {
        const follow = el(correct ? 'details' : 'div', `follow-up ${correct ? 'follow-up--optional' : 'follow-up--required'}`);
        const label = el(correct ? 'summary' : 'p', 'follow-up-label', correct
          ? '再验证一次'
          : '再验证一次 → 换一个表面形式，确认这个误区已经修正');
        follow.append(label, createQuestion(followUp, 'follow-up'));
        feedback.appendChild(follow);
      }
      renderMath(article);
    });

    retry.addEventListener('click', () => {
      fieldset.querySelectorAll('input').forEach((input) => { input.disabled = false; input.checked = false; });
      fieldset.querySelectorAll('.practice-option').forEach((label) => label.classList.remove('is-correct', 'is-selected-wrong'));
      feedback.className = 'practice-explanation';
      feedback.replaceChildren();
      submit.hidden = false;
      retry.hidden = true;
    });
    return article;
  }

  const meta = page.querySelector(':scope > .meta');
  const map = el('section', 'learning-map');
  map.id = 'learning-map';
  map.append(el('p', 'learning-map-kicker', '30 秒知识地图'), el('h2', '', '本课真正解决什么问题'));
  const problem = el('p', 'learning-problem');
  problem.textContent = lesson.problem;
  map.appendChild(problem);
  const flow = el('div', 'learning-flow');
  lesson.map.forEach((item, index) => {
    flow.appendChild(el('span', 'learning-flow-node', item));
    if (index < lesson.map.length - 1) flow.appendChild(el('span', 'learning-flow-arrow', '→'));
  });
  map.appendChild(flow);
  (meta || page.querySelector(':scope > .lede'))?.insertAdjacentElement('afterend', map);

  const before = el('section', 'before-start');
  before.id = 'before-start';
  before.append(el('h2', '', 'Before We Start · 先把旧知识叫回来'), el('p', 'small', '这不是考试。先在脑中回答，再展开核对；答不上来就先读对应 refresher。'));
  before.querySelector('h2').id = 'before-start-heading';
  const beforeGrid = el('div', 'before-start-grid');
  lesson.before.forEach(([question, answer]) => {
    const details = el('details', 'before-prompt');
    const summary = el('summary', '', question);
    const body = el('p');
    body.innerHTML = answer;
    details.append(summary, body);
    beforeGrid.appendChild(details);
  });
  before.appendChild(beforeGrid);
  const legend = el('p', 'claim-legend');
  legend.innerHTML = '<strong>结论标签：</strong><span>Exact 严格关系</span><span>Approximation 近似</span><span>Asymptotic 渐近量级</span><span>Hardware-specific 实现条件</span>';
  before.appendChild(legend);
  map.insertAdjacentElement('afterend', before);

  const mental = el('aside', 'teaching-block mental-model');
  mental.dataset.blockLabel = 'Mental Model';
  mental.append(el('p', '', lesson.mental));
  before.insertAdjacentElement('afterend', mental);

  if (lesson.reasoning) {
    const reasoning = el('section', 'reasoning-start');
    reasoning.id = 'reasoning-start';
    reasoning.appendChild(el('h2', '', '推导起点 · 从 tiny case 到系统结论'));
    reasoning.querySelector('h2').id = 'reasoning-start-heading';
    const grid = el('div', 'reasoning-grid');
    const objects = el('article');
    objects.append(el('p', 'reasoning-label', 'Objects'), el('p', '', `先区分对象：${lesson.map.join('、')}。这些词属于同一条因果链，但不是同一份状态。`));
    const toy = el('article');
    toy.append(el('p', 'reasoning-label', 'Toy Example'), el('p', '', lesson.reasoning.toy));
    const mechanism = el('article');
    mechanism.append(el('p', 'reasoning-label', 'Mechanism'), el('p', '', `从 ${lesson.map[0]} 出发，逐步经过 ${lesson.map.slice(1).join(' → ')}；每一步都要说明改变了哪个对象、付出了什么成本。`));
    const whyNot = el('article');
    whyNot.append(el('p', 'reasoning-label', 'Why not?'), el('p', '', lesson.reasoning.whyNot));
    grid.append(objects, toy, mechanism, whyNot);
    reasoning.appendChild(grid);
    mental.insertAdjacentElement('afterend', reasoning);
  }

  const contentHeadings = [...page.querySelectorAll(':scope > h2')].filter((node) =>
    !/测验|知识检查|要点总结|本课要点|延伸阅读/.test(node.textContent)
  );
  const inlineChecks = [lesson.check];
  if (lesson.reasoning && lesson.deep[0]) {
    inlineChecks.push({
      after: contentHeadings[Math.max(0, Math.floor(contentHeadings.length * 0.62))]?.textContent || lesson.check.after,
      label: '换一个系统状态再推一次',
      question: lesson.deep[0]
    });
  }
  inlineChecks.forEach((check, index) => {
    const heading = contentHeadings.find((node) => node.textContent.includes(check.after)) || contentHeadings[index];
    if (!heading) return;
    const lab = el('aside', 'concept-lab teaching-block concept-check-block');
    lab.id = `inline-concept-check-${index + 1}`;
    lab.dataset.blockLabel = 'Concept Check';
    lab.append(el('p', 'concept-lab-eyebrow', `理解检查 ${index + 1}/${inlineChecks.length} · ${check.label}`), createQuestion(check.question, 'section'));
    let boundary = heading.nextElementSibling;
    while (boundary && boundary.tagName !== 'H2') boundary = boundary.nextElementSibling;
    (boundary || heading).insertAdjacentElement(boundary ? 'beforebegin' : 'afterend', lab);
  });

  const legacyQuizzes = [...page.querySelectorAll(':scope > .quiz')];
  const legacyHeading = [...page.querySelectorAll(':scope > h2')].find((node) => /测验|知识检查/.test(node.textContent));
  let legacyBank = null;
  if (legacyQuizzes.length) {
    legacyBank = el('details', 'legacy-quiz-bank');
    legacyBank.id = 'quick-review';
    legacyBank.appendChild(el('summary', '', `快速复习题 · ${legacyQuizzes.length} 道`));
    legacyQuizzes.forEach((quiz) => legacyBank.appendChild(quiz));
    if (legacyHeading) {
      legacyHeading.replaceWith(legacyBank);
    } else {
      legacyQuizzes[0].insertAdjacentElement('beforebegin', legacyBank);
    }
  }

  const recapHeading = [...page.querySelectorAll(':scope > h2')].find((node) => /要点总结|本课要点/.test(node.textContent));
  const practiceAnchor = recapHeading || legacyBank || page.querySelector(':scope > .nav');
  const deep = el('section', 'deep-quiz');
  deep.id = 'deep-quiz';
  deep.append(el('h2', '', '综合理解验证 · Deep Quiz'), el('p', '', '这些题不按正文顺序复述术语，而是要求区分、推导或迁移。可以跳过，不影响继续阅读。'));
  deep.querySelector('h2').id = 'deep-quiz-heading';
  const deepQuestions = lesson.reasoning ? lesson.deep.slice(1) : lesson.deep;
  const progress = el('p', 'deep-quiz-progress', `已完成 0 / ${deepQuestions.length} · 首次答对 0`);
  deep.appendChild(progress);
  let completed = 0;
  let correctCount = 0;
  const levels = [['Level 1', 'Distinguish'], ['Level 2', 'Derive'], ['Level 3', 'Transfer']];
  deepQuestions.forEach((question, index) => {
    const details = el('details', 'deep-quiz-item');
    if (index === 0) details.open = true;
    const summary = el('summary');
    summary.innerHTML = `<span class="deep-quiz-level">${levels[index]?.[0] || 'Level 3'} · ${levels[index]?.[1] || 'Transfer'}</span>题目 ${index + 1}`;
    details.append(summary, createQuestion(question, 'deep', (correct) => {
      completed += 1;
      if (correct) correctCount += 1;
      progress.textContent = `已完成 ${completed} / ${deepQuestions.length} · 首次答对 ${correctCount}`;
    }));
    deep.appendChild(details);
  });
  practiceAnchor?.insertAdjacentElement('beforebegin', deep);

  const open = el('section', 'open-practice');
  open.id = 'explain-yourself';
  open.appendChild(el('h2', '', '闭卷自测 · Explain It Yourself'));
  open.querySelector('h2').id = 'explain-yourself-heading';
  lesson.open.forEach(([prompt, guide]) => {
    const details = el('details', 'open-prompt');
    const answer = el('div', 'open-guide');
    answer.innerHTML = `<p><strong>参考思路，不是标准措辞：</strong>${guide}</p>`;
    details.append(el('summary', '', prompt), answer);
    open.appendChild(details);
  });
  deep.insertAdjacentElement('afterend', open);

  const explain = el('section', 'explain-checklist closed-book');
  explain.id = 'can-explain';
  explain.appendChild(el('h2', '', '不看上文，你能解释吗？'));
  explain.querySelector('h2').id = 'can-explain-heading';
  const explainList = el('ul');
  lesson.explain.forEach((item) => {
    const li = el('li');
    li.innerHTML = `<span aria-hidden="true">□</span><span>${item}</span>`;
    explainList.appendChild(li);
  });
  explain.appendChild(explainList);
  open.insertAdjacentElement('afterend', explain);

  if (lesson.bridge) {
    const bridge = el('aside', 'lesson-build-bridge');
    bridge.innerHTML = `<p class="lesson-build-kicker">Learn → Build → Return</p><h3>${lesson.bridge[0]}</h3><p>${lesson.bridge[2]}</p><a href="${lesson.bridge[1]}">进入对应 Engineering Stage →</a>`;
    explain.insertAdjacentElement('afterend', bridge);
  }

  page.querySelectorAll('.card.idea').forEach((node) => {
    node.classList.add('teaching-block', 'mental-model');
    node.dataset.blockLabel = 'Mental Model / Key Result';
  });
  page.querySelectorAll('.card.warning, .pitfall').forEach((node) => {
    node.classList.add('teaching-block', 'misconception-block');
    node.dataset.blockLabel = 'Boundary / Common Pitfall';
  });

  const hero = el('header', 'lesson-hero');
  hero.id = 'lesson-top';
  while (page.firstChild) {
    const child = page.firstChild;
    hero.appendChild(child);
    if (child === map) break;
  }
  const bottomNav = page.querySelector(':scope > .nav');
  const pager = el('nav', 'lesson-pager');
  pager.setAttribute('aria-label', '相邻课程');
  bottomNav?.querySelectorAll('a').forEach((link) => pager.appendChild(link.cloneNode(true)));
  (hero.querySelector('.eyebrow') || hero.firstElementChild)?.insertAdjacentElement('afterend', pager);

  const main = el('main', 'lesson-main');
  while (page.firstChild) main.appendChild(page.firstChild);
  const tocHeadings = [before.querySelector('h2'), ...[...main.querySelectorAll(':scope > h2')].filter((node) =>
    !/延伸阅读|要点总结|本课要点|测验|知识检查/.test(node.textContent)
  ).slice(0, 7), deep.querySelector('h2'), open.querySelector('h2'), explain.querySelector('h2')].filter(Boolean);
  const uniqueHeadings = tocHeadings.filter((node, index, all) => all.indexOf(node) === index);

  const toc = el('aside', 'lesson-toc');
  toc.setAttribute('aria-label', '本课目录');
  const tocLabel = el('p', 'lesson-toc-label', 'On this page');
  const tocProgress = el('span', 'lesson-toc-progress', '0%');
  tocLabel.appendChild(tocProgress);
  const tocNav = document.createElement('nav');
  const makeLinks = () => uniqueHeadings.map((node, index) => {
    const link = el('a', index === 0 ? 'is-active' : '', node.textContent.trim());
    link.href = `#${node.id}`;
    return link;
  });
  makeLinks().forEach((link) => tocNav.appendChild(link));
  toc.append(tocLabel, tocNav);

  const mobileToc = el('details', 'lesson-toc-mobile');
  const mobileNav = document.createElement('nav');
  makeLinks().forEach((link) => {
    link.addEventListener('click', () => mobileToc.removeAttribute('open'));
    mobileNav.appendChild(link);
  });
  mobileToc.append(el('summary', '', '本课目录'), mobileNav);
  hero.appendChild(mobileToc);

  const shell = el('div', 'lesson-shell');
  shell.append(main, toc);
  page.append(hero, shell);

  const navLinks = [...toc.querySelectorAll('a'), ...mobileToc.querySelectorAll('a')];
  let frame = 0;
  const update = () => {
    frame = 0;
    const threshold = innerWidth <= 1040 ? Math.min(innerHeight * 0.42, 280) : 150;
    let active = uniqueHeadings[0];
    uniqueHeadings.forEach((target) => { if (target.getBoundingClientRect().top <= threshold) active = target; });
    navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${active.id}`));
    const total = Math.max(1, main.offsetHeight - innerHeight);
    tocProgress.textContent = `${Math.round(Math.max(0, Math.min(100, (scrollY - main.offsetTop) / total * 100)))}%`;
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  update();
  renderMath(page);
})();
