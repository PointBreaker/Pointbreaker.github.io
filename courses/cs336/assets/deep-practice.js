(function () {
  const bank = window.CS336PracticeBank;
  const page = document.querySelector('.page');
  const lessonMatch = location.pathname.match(/\/(00(?:0[1-9]|1[0-9]))-[^/]+\.html$/);
  if (!bank || !page || !lessonMatch) return;

  const lesson = bank[lessonMatch[1]];
  if (!lesson) return;

  const letters = ['A', 'B', 'C', 'D'];
  let uid = 0;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const renderMath = (root) => window.renderCourseMath?.(root);

  function createQuestion(question, kind, onResult) {
    const [prompt, options, answer, explanations, followUp] = question;
    const id = 'practice-' + lessonMatch[1] + '-' + (++uid);
    const article = el('article', 'practice-question practice-question--' + kind);
    const promptNode = el('p', 'practice-prompt');
    promptNode.innerHTML = prompt;
    article.appendChild(promptNode);

    const fieldset = el('fieldset', 'practice-options');
    fieldset.setAttribute('aria-label', '选择一个答案');
    options.forEach((option, index) => {
      const label = el('label', 'practice-option');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = id;
      input.value = String(index);
      const copy = el('span', 'practice-option-copy');
      copy.innerHTML = '<strong>' + letters[index] + '.</strong> ' + option;
      label.append(input, copy);
      fieldset.appendChild(label);
    });
    article.appendChild(fieldset);

    const actions = el('div', 'practice-actions');
    const submit = el('button', 'practice-submit', '提交答案');
    submit.type = 'button';
    const retry = el('button', 'practice-retry', '重新作答');
    retry.type = 'button';
    retry.hidden = true;
    actions.append(submit, retry);
    article.appendChild(actions);

    const feedback = el('div', 'practice-explanation');
    feedback.setAttribute('aria-live', 'polite');
    article.appendChild(feedback);

    let answered = false;
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
      feedback.className = 'practice-explanation ' + (correct ? 'is-correct' : 'is-incorrect');
      const heading = correct
        ? '✓ 正确：这条推理链成立。'
        : '✗ 需要修正：你选择了 ' + letters[choice] + '。';
      const reasons = options.map((option, index) =>
        '<li class="' + (index === answer ? 'is-answer' : '') + '"><strong>' +
        letters[index] + '.</strong> ' + explanations[index] + '</li>'
      ).join('');
      const selectedReason = correct ? '' : '<p><strong>你的选择错在哪里：</strong>' + explanations[choice] + '</p>';
      feedback.innerHTML = '<p class="practice-result">' + heading + '</p>' + selectedReason +
        '<p><strong>正确答案为什么成立：</strong>' + explanations[answer] + '</p>' +
        '<ol class="option-reasons">' + reasons + '</ol>';
      submit.hidden = true;
      retry.hidden = false;
      if (!answered) {
        answered = true;
        onResult?.(correct);
      }
      if (followUp) {
        if (correct) {
          const follow = el('details', 'follow-up follow-up--optional');
          const followLabel = el('summary', 'follow-up-label', '再验证一次');
          follow.append(followLabel, createQuestion(followUp, 'follow-up'));
          feedback.appendChild(follow);
        } else {
          const follow = el('div', 'follow-up follow-up--required');
          const followLabel = el('p', 'follow-up-label', '再验证一次 → 用不同表面形式确认这个 mental model 已修正');
          follow.append(followLabel, createQuestion(followUp, 'follow-up'));
          feedback.appendChild(follow);
        }
      }
      renderMath(article);
    });

    retry.addEventListener('click', () => {
      fieldset.querySelectorAll('input').forEach((input) => {
        input.disabled = false;
        input.checked = false;
      });
      fieldset.querySelectorAll('.practice-option').forEach((label) =>
        label.classList.remove('is-correct', 'is-selected-wrong'));
      feedback.className = 'practice-explanation';
      feedback.replaceChildren();
      submit.hidden = false;
      retry.hidden = true;
    });

    renderMath(article);
    return article;
  }

  function renderBeforeStart() {
    const map = page.querySelector('.learning-map');
    if (!map || !lesson.before?.length) return;
    const section = el('section', 'before-start');
    section.setAttribute('aria-labelledby', 'before-start-heading');
    const heading = el('h2', '', 'Before We Start · 先把旧知识叫回来');
    heading.id = 'before-start-heading';
    section.appendChild(heading);
    section.appendChild(el('p', 'small', '这不是考试。先在脑中回答，再展开核对；答不上来就先读 refresher。'));
    const grid = el('div', 'before-start-grid');
    lesson.before.forEach(([question, answer]) => {
      const details = el('details', 'before-prompt');
      const summary = el('summary', '', question);
      const response = el('p');
      response.innerHTML = answer;
      details.append(summary, response);
      grid.appendChild(details);
    });
    section.appendChild(grid);
    const legend = el('p', 'claim-legend');
    legend.innerHTML = '<strong>本课结论标签：</strong><span>Exact 严格关系</span><span>Approximation 近似</span><span>Asymptotic 渐近量级</span><span>Hardware-specific 实现/硬件条件</span>';
    section.appendChild(legend);
    map.insertAdjacentElement('afterend', section);
    renderMath(section);
  }

  function renderSectionChecks() {
    lesson.sections?.forEach((item, index) => {
      const target = page.querySelector('#' + item.before);
      if (!target) return;
      const aside = el('aside', 'concept-lab');
      aside.setAttribute('aria-labelledby', 'concept-lab-' + index);
      const eyebrow = el('p', 'concept-lab-eyebrow', 'Concept Check · ' + item.label);
      eyebrow.id = 'concept-lab-' + index;
      aside.append(eyebrow, createQuestion(item.question, 'section'));
      target.insertAdjacentElement('beforebegin', aside);
    });
  }

  function renderDeepQuiz() {
    const anchor = page.querySelector('.explain-checklist');
    if (!anchor || !lesson.deep?.length) return;
    const section = el('section', 'deep-quiz');
    section.setAttribute('aria-labelledby', 'deep-quiz-heading');
    const heading = el('h2', '', '综合理解验证 · Deep Quiz');
    heading.id = 'deep-quiz-heading';
    const description = el('p', '', '这些题不按正文顺序排列。提交后会解释四个选项各自对应的 reasoning；可以重试。');
    const progress = el('p', 'deep-quiz-progress', '已完成 0 / ' + lesson.deep.length + ' · 答对 0');
    section.append(heading, description, progress);
    const stack = el('div', 'deep-quiz-stack');
    let completed = 0;
    let correctCount = 0;
    const levels = [
      ['Level 1', 'Understand'],
      ['Level 2', 'Distinguish'],
      ['Level 3', 'Derive'],
      ['Level 4', 'Transfer']
    ];
    lesson.deep.forEach((question, index) => {
      const wrapper = el('details', 'deep-quiz-item');
      if (index === 0) wrapper.open = true;
      const level = levels[Math.min(index, levels.length - 1)];
      const summary = el('summary');
      summary.innerHTML = '<span class="deep-quiz-level">' + level[0] + ' · ' + level[1] + '</span>题目 ' + (index + 1);
      const body = createQuestion(question, 'deep', (correct) => {
        completed += 1;
        if (correct) correctCount += 1;
        progress.textContent = '已完成 ' + completed + ' / ' + lesson.deep.length + ' · 首次答对 ' + correctCount;
      });
      wrapper.append(summary, body);
      stack.appendChild(wrapper);
    });
    section.appendChild(stack);
    anchor.insertAdjacentElement('beforebegin', section);
  }

  function renderOpenPractice() {
    const anchor = page.querySelector('.explain-checklist');
    if (!anchor || !lesson.open?.length) return;
    const section = el('section', 'open-practice');
    section.setAttribute('aria-labelledby', 'open-practice-heading');
    const heading = el('h2', '', '闭卷自测 · Explain It Yourself');
    heading.id = 'open-practice-heading';
    section.appendChild(heading);
    lesson.open.forEach(([prompt, guide]) => {
      const details = el('details', 'open-prompt');
      const summary = el('summary', '', prompt);
      const answer = el('div', 'open-guide');
      answer.innerHTML = '<p><strong>参考思路，不是标准措辞：</strong>' + guide + '</p>';
      details.append(summary, answer);
      section.appendChild(details);
    });
    anchor.insertAdjacentElement('beforebegin', section);
    renderMath(section);
  }

  function retireLegacyQuiz() {
    // Lessons 1–10 used to expose click-on-option quizzes with one generic
    // explanation. The diagnostic bank supersedes them and explains every
    // distractor, so keeping both would add repetition without better recall.
    page.querySelectorAll(':scope > .quiz').forEach((quiz) => quiz.remove());
    const heading = page.querySelector('#quiz');
    if (heading) heading.remove();
  }

  renderBeforeStart();
  renderSectionChecks();
  retireLegacyQuiz();
  renderDeepQuiz();
  renderOpenPractice();
})();
