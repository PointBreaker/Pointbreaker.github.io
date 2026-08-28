(function () {
  const page = document.querySelector('.page');
  const match = location.pathname.match(/\/lessons\/([^/]+)\.html$/);
  const bank = window.MIT61810PracticeBank;
  if (!page || !match || !bank?.[match[1]] || page.dataset.learningReady) return;
  const data = bank[match[1]];
  page.dataset.learningReady = 'true';
  document.body.classList.add('mit61810-textbook');
  let uid = 0;
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const renderMath = (root) => window.renderCourseMath?.(root);
  const slugify = (value) => String(value).trim().toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]+/g, '-').replace(/^-+|-+$/g, '') || 'section';

  const usedIds = new Set([...page.querySelectorAll('[id]')].map((node) => node.id));
  page.querySelectorAll('h2, h3').forEach((heading, index) => {
    if (heading.id) return;
    const base = slugify(heading.textContent).slice(0, 72) || `section-${index + 1}`;
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    heading.id = id;
    usedIds.add(id);
  });

  function normalizeQuestion(question) {
    const entries = question.options.map((option, index) => ({ option, explanation: question.explanations[index], correct: index === question.answer })).filter((entry) => entry.option);
    const rotation = [...question.prompt].reduce((sum, char) => sum + char.charCodeAt(0), 0) % entries.length;
    const rotated = entries.slice(rotation).concat(entries.slice(0, rotation));
    return { ...question, entries: rotated, answer: rotated.findIndex((entry) => entry.correct) };
  }

  function createQuestion(rawQuestion, kind, onFirstResult) {
    const question = normalizeQuestion(rawQuestion);
    const article = el('article', `practice-question practice-question--${kind}`);
    const prompt = el('p', 'practice-prompt');
    prompt.innerHTML = question.prompt;
    article.appendChild(prompt);
    const fieldset = el('fieldset', 'practice-options');
    fieldset.setAttribute('aria-label', '选择一个答案');
    const name = `mit61810-${match[1]}-${++uid}`;
    question.entries.forEach((entry, index) => {
      const label = el('label', 'practice-option');
      const input = document.createElement('input');
      input.type = 'radio'; input.name = name; input.value = String(index);
      const copy = el('span', 'practice-option-copy');
      copy.innerHTML = `<strong>${String.fromCharCode(65 + index)}.</strong> ${entry.option}`;
      label.append(input, copy); fieldset.appendChild(label);
    });
    article.appendChild(fieldset);
    const actions = el('div', 'practice-actions');
    const submit = el('button', 'practice-submit', '提交答案');
    const retry = el('button', 'practice-retry', '重新作答');
    submit.type = retry.type = 'button'; retry.hidden = true;
    actions.append(submit, retry); article.appendChild(actions);
    const feedback = el('div', 'practice-explanation');
    feedback.setAttribute('aria-live', 'polite'); article.appendChild(feedback);
    let first = true;
    submit.addEventListener('click', () => {
      const selected = fieldset.querySelector('input:checked');
      if (!selected) { feedback.className = 'practice-explanation is-empty'; feedback.textContent = '先做出预测，再提交。'; return; }
      const choice = Number(selected.value); const correct = choice === question.answer;
      fieldset.querySelectorAll('input').forEach((input) => { input.disabled = true; });
      fieldset.querySelectorAll('.practice-option').forEach((label, index) => {
        label.classList.toggle('is-correct', index === question.answer);
        label.classList.toggle('is-selected-wrong', index === choice && !correct);
      });
      feedback.className = `practice-explanation ${correct ? 'is-correct' : 'is-incorrect'}`;
      const reasons = question.entries.map((entry, index) => `<li class="${entry.correct ? 'is-answer' : ''}"><strong>${String.fromCharCode(65 + index)}.</strong> ${entry.explanation}</li>`).join('');
      feedback.innerHTML = `<p class="practice-result">${correct ? '✓ 正确：这条对象关系成立。' : '✗ 这个选择暴露了一个可修正的 mental model。'}</p>` +
        (correct ? '' : `<p><strong>你混淆的地方：</strong>${question.entries[choice].explanation}</p>`) +
        `<p><strong>正确机制：</strong>${question.entries[question.answer].explanation}</p><ol class="option-reasons">${reasons}</ol>`;
      submit.hidden = true; retry.hidden = false;
      if (first) { first = false; onFirstResult?.(correct); }
      if (question.followUp) {
        const follow = el(correct ? 'details' : 'div', `follow-up ${correct ? 'follow-up--optional' : 'follow-up--required'}`);
        follow.append(el(correct ? 'summary' : 'p', 'follow-up-label', correct ? '再验证一次（可选）' : '再验证一次 → 换一个表面形式确认误区已修正'), createQuestion(question.followUp, 'follow-up'));
        feedback.appendChild(follow);
      }
      renderMath(article);
    });
    retry.addEventListener('click', () => {
      fieldset.querySelectorAll('input').forEach((input) => { input.disabled = false; input.checked = false; });
      fieldset.querySelectorAll('.practice-option').forEach((label) => label.classList.remove('is-correct', 'is-selected-wrong'));
      feedback.className = 'practice-explanation'; feedback.replaceChildren(); submit.hidden = false; retry.hidden = true;
    });
    return article;
  }

  const meta = page.querySelector(':scope > .meta');
  const map = el('section', 'learning-map'); map.id = 'learning-map';
  map.append(el('p', 'learning-map-kicker', '30 秒知识地图'), el('h2', '', '本课真正解决什么问题'));
  const problem = el('p', 'learning-problem', data.problem); map.appendChild(problem);
  const flow = el('div', 'learning-flow');
  data.map.forEach((item, index) => { flow.append(el('span', 'learning-flow-node', item)); if (index < data.map.length - 1) flow.append(el('span', 'learning-flow-arrow', '→')); });
  map.appendChild(flow); (meta || page.querySelector(':scope > .lede'))?.insertAdjacentElement('afterend', map);

  const before = el('section', 'before-start'); before.id = 'before-start';
  before.append(el('h2', '', 'Before We Start · 先修知识回收'), el('p', 'small', '先在脑中回答，再展开核对。答不上来不是失败，而是说明应先补哪块地基。'));
  before.querySelector('h2').id = 'before-start-heading';
  const beforeGrid = el('div', 'before-start-grid');
  data.before.forEach(([question, answer]) => { const details = el('details', 'before-prompt'); const body = el('p'); body.innerHTML = answer; details.append(el('summary', '', question), body); beforeGrid.appendChild(details); });
  before.appendChild(beforeGrid);
  const legend = el('p', 'claim-legend'); legend.innerHTML = '<strong>结论边界：</strong><span>Exact 严格机制</span><span>Asymptotic 渐近</span><span>Approximation 近似</span><span>Implementation-specific 实现相关</span>'; before.appendChild(legend);
  map.insertAdjacentElement('afterend', before);

  const mental = el('aside', 'teaching-block mental-model'); mental.dataset.blockLabel = 'Mental Model'; mental.append(el('p', '', data.mental)); before.insertAdjacentElement('afterend', mental);
  const reasoning = el('section', 'reasoning-start'); reasoning.id = 'reasoning-start'; reasoning.append(el('h2', '', '推导起点 · 对象、最小例子与为什么不是另一种做法'));
  reasoning.querySelector('h2').id = 'reasoning-start-heading';
  const reasoningGrid = el('div', 'reasoning-grid');
  data.reasoning.forEach((item, index) => { const article = el('article'); article.append(el('p', 'reasoning-label', ['Objects', 'Toy Trace', 'Mechanism', 'Why not?'][index]), el('p', '', item)); reasoningGrid.appendChild(article); });
  reasoning.appendChild(reasoningGrid); mental.insertAdjacentElement('afterend', reasoning);

  data.checks.forEach(([after, label, question], index) => {
    const heading = [...page.querySelectorAll(':scope > h2')].find((node) => node.textContent.includes(after));
    if (!heading) return;
    const block = el('aside', 'concept-lab teaching-block concept-check-block'); block.id = `concept-check-${index + 1}`; block.dataset.blockLabel = 'Concept Check';
    block.append(el('p', 'concept-lab-eyebrow', `理解检查 ${index + 1}/${data.checks.length} · ${label}`), createQuestion(question, 'section'));
    let boundary = heading.nextElementSibling; while (boundary && boundary.tagName !== 'H2') boundary = boundary.nextElementSibling;
    (boundary || heading).insertAdjacentElement(boundary ? 'beforebegin' : 'afterend', block);
  });

  const legacyQuizzes = [...page.querySelectorAll(':scope > .quiz')];
  const legacyHeading = [...page.querySelectorAll(':scope > h2')].find((node) => /测验|知识检查/.test(node.textContent));
  const deep = el('section', 'deep-quiz'); deep.id = 'deep-quiz';
  deep.append(el('h2', '', '综合理解验证 · Deep Quiz'), el('p', '', '先完成旧题的快速区分，再做一道跨 section 迁移题；不强制完成。'));
  deep.querySelector('h2').id = 'deep-quiz-heading';
  const progress = el('p', 'deep-quiz-progress', `理解检查 ${legacyQuizzes.length + 1} 道 · 可按需展开`); deep.appendChild(progress);
  if (legacyQuizzes.length) {
    const bankDetails = el('details', 'legacy-quiz-bank'); bankDetails.append(el('summary', '', `基础与机制题 · ${legacyQuizzes.length} 道`));
    legacyQuizzes.forEach((quiz) => bankDetails.appendChild(quiz)); deep.appendChild(bankDetails);
    legacyHeading?.remove();
  }
  const transfer = el('details', 'deep-quiz-item'); transfer.open = true; transfer.append(el('summary', '', 'Level 4 · Transfer · 新场景迁移'), createQuestion(data.transfer, 'deep')); deep.appendChild(transfer);
  const recapHeading = [...page.querySelectorAll(':scope > h2')].find((node) => /要点总结|本课要点/.test(node.textContent));
  (recapHeading || page.querySelector(':scope > .nav'))?.insertAdjacentElement('beforebegin', deep);

  const open = el('section', 'open-practice'); open.id = 'explain-yourself'; open.appendChild(el('h2', '', '闭卷自测 · Explain It Yourself'));
  open.querySelector('h2').id = 'explain-yourself-heading';
  data.open.forEach(([prompt, guide]) => { const details = el('details', 'open-prompt'); const answer = el('div', 'open-guide'); answer.innerHTML = `<p><strong>参考推理骨架：</strong>${guide}</p>`; details.append(el('summary', '', prompt), answer); open.appendChild(details); });
  deep.insertAdjacentElement('afterend', open);
  const explain = el('section', 'explain-checklist'); explain.id = 'can-explain'; explain.appendChild(el('h2', '', '不看上文，你现在应该能够解释'));
  explain.querySelector('h2').id = 'can-explain-heading';
  const list = el('ul'); data.explain.forEach((item) => { const li = el('li'); li.innerHTML = `<span aria-hidden="true">□</span><span>${item}</span>`; list.appendChild(li); }); explain.appendChild(list); open.insertAdjacentElement('afterend', explain);
  const bridge = el('aside', 'lesson-build-bridge'); bridge.innerHTML = `<p class="lesson-build-kicker">Learn → Build → Return</p><h3>${data.bridge[0]}</h3><p>${data.bridge[2]}</p><a href="${data.bridge[1]}">进入对应 Lab Workbook →</a>`; explain.insertAdjacentElement('afterend', bridge);

  page.querySelectorAll('.card.idea').forEach((node) => { node.classList.add('teaching-block', 'mental-model'); node.dataset.blockLabel = 'Mental Model / Key Result'; });
  page.querySelectorAll('.card.warning, .pitfall').forEach((node) => { node.classList.add('teaching-block', 'misconception-block'); node.dataset.blockLabel = 'Boundary / Common Misconception'; });

  const hero = el('header', 'lesson-hero'); hero.id = 'lesson-top';
  while (page.firstChild) { const child = page.firstChild; hero.appendChild(child); if (child === map) break; }
  const bottomNav = page.querySelector(':scope > .nav'); const pager = el('nav', 'lesson-pager'); pager.setAttribute('aria-label', '相邻课程'); bottomNav?.querySelectorAll('a').forEach((link) => pager.appendChild(link.cloneNode(true))); (hero.querySelector('.eyebrow') || hero.firstElementChild)?.insertAdjacentElement('afterend', pager);
  const main = el('main', 'lesson-main'); while (page.firstChild) main.appendChild(page.firstChild);
  const tocHeadings = [...main.querySelectorAll(':scope > h2')].filter((node) => !/延伸阅读|要点总结|本课要点|测验|知识检查/.test(node.textContent));
  const toc = el('aside', 'lesson-toc'); toc.setAttribute('aria-label', '本课目录'); const tocLabel = el('p', 'lesson-toc-label', 'On this page'); const tocProgress = el('span', 'lesson-toc-progress', '0%'); tocLabel.appendChild(tocProgress); const tocNav = document.createElement('nav');
  tocHeadings.slice(0, 11).forEach((heading, index) => { const link = el('a', index ? '' : 'is-active', heading.textContent.trim()); link.href = `#${heading.id}`; tocNav.appendChild(link); }); toc.append(tocLabel, tocNav);
  const mobileToc = el('details', 'lesson-toc-mobile'); const mobileNav = tocNav.cloneNode(true); mobileToc.append(el('summary', '', '本课目录'), mobileNav); hero.appendChild(mobileToc);
  const shell = el('div', 'lesson-shell'); shell.append(main, toc); page.append(hero, shell);
  const tocLinks = [...toc.querySelectorAll('a'), ...mobileToc.querySelectorAll('a')];
  const update = () => { const threshold = innerWidth <= 1040 ? Math.min(innerHeight * .4, 260) : 150; let active = tocHeadings[0]; tocHeadings.forEach((heading) => { if (heading.getBoundingClientRect().top <= threshold) active = heading; }); tocLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${active?.id}`)); const total = Math.max(1, main.offsetHeight - innerHeight); tocProgress.textContent = `${Math.round(Math.max(0, Math.min(100, (scrollY - main.offsetTop) / total * 100)))}%`; };
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update(); renderMath(page);
})();
