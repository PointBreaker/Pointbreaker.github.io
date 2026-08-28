(() => {
  const slug = location.pathname.match(/\/lessons\/([^/]+)\.html$/)?.[1];
  const lesson = window.MIT65840PracticeBank?.[slug];
  const article = document.querySelector('.reading-article.page');
  if (!lesson || !article || slug.startsWith('ass')) return;

  document.body.classList.add('mit65840-textbook');

  const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const seed = [...slug].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const ordered = (question, offset = 0) => {
    const items = question.options
      .map((text, index) => ({ text, explanation: question.explanations[index], correct: index === question.answer }))
      .filter((item) => item.text);
    const shift = (seed + offset) % items.length;
    return items.slice(shift).concat(items.slice(0, shift));
  };

  const questionMarkup = (question, id, offset = 0, followUp = false) => {
    const options = ordered(question, offset);
    return `<div class="active-question${followUp ? ' follow-up-question' : ''}" data-active-question data-question-id="${escape(id)}">
      <p class="question-prompt"><strong>${escape(question.prompt)}</strong></p>
      <div class="active-options">${options.map((option, index) => `<button type="button" data-active-option data-correct="${option.correct}" data-explanation="${escape(option.explanation || '')}"><span>${String.fromCharCode(65 + index)}</span>${escape(option.text)}</button>`).join('')}</div>
      <div class="active-feedback" aria-live="polite"></div>
      ${question.followUp ? `<div class="follow-up-slot" data-follow-up hidden>${questionMarkup(question.followUp, `${id}-follow`, offset + 1, true)}</div>` : ''}
    </div>`;
  };

  const bindQuestions = (root = document) => {
    root.querySelectorAll('[data-active-question]:not([data-bound])').forEach((block) => {
      block.dataset.bound = 'true';
      const feedback = block.querySelector(':scope > .active-feedback');
      const follow = block.querySelector(':scope > [data-follow-up]');
      block.querySelectorAll(':scope > .active-options > [data-active-option]').forEach((button) => button.addEventListener('click', () => {
        const correct = button.dataset.correct === 'true';
        block.querySelectorAll(':scope > .active-options > [data-active-option]').forEach((option) => {
          option.classList.remove('is-correct', 'is-wrong');
          option.setAttribute('aria-pressed', option === button ? 'true' : 'false');
        });
        button.classList.add(correct ? 'is-correct' : 'is-wrong');
        const correction = [...block.querySelectorAll(':scope > .active-options > [data-active-option]')].find((option) => option.dataset.correct === 'true');
        feedback.className = `active-feedback ${correct ? 'is-correct' : 'is-wrong'}`;
        feedback.innerHTML = `<strong>${correct ? '✓ 这个推理成立' : '✕ 这里暴露了一个对象或边界混淆'}</strong><p>${escape(button.dataset.explanation)}</p>${correct ? '' : `<p><b>回到机制：</b>${escape(correction?.dataset.explanation || '')}</p>`}`;
        if (!follow) return;
        if (!correct) {
          follow.hidden = false;
          follow.classList.add('is-required');
        } else if (!follow.classList.contains('is-required')) {
          follow.hidden = false;
          follow.classList.add('is-optional');
          const child = follow.querySelector(':scope > [data-active-question]');
          if (child) {
            child.hidden = true;
            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'retry-trigger';
            trigger.textContent = '再验证一次 →';
            trigger.addEventListener('click', () => { trigger.remove(); child.hidden = false; child.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }); });
            follow.prepend(trigger);
          }
        }
      }));
    });
  };

  const objectives = article.querySelector('#objectives');
  const orientation = document.createElement('section');
  orientation.className = 'reading-section active-orientation';
  orientation.id = 'active-learning';
  orientation.innerHTML = `<div class="section-label">ACTIVE ORIENTATION</div>
    <h2>先画系统边界，再进入机制</h2>
    <p class="section-lede">${escape(lesson.problem)}</p>
    <div class="system-object-map" aria-label="本课对象关系">${lesson.map.map((item, index) => `<span>${escape(item)}</span>${index < lesson.map.length - 1 ? '<b aria-hidden="true">→</b>' : ''}`).join('')}</div>
    <div class="before-start"><h3>Before We Start · 先恢复三个前提</h3>${lesson.before.map(([question, answer]) => `<details><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join('')}</div>
    <aside class="mental-model"><span>MENTAL MODEL</span><p>${escape(lesson.mental)}</p></aside>`;
  objectives?.insertAdjacentElement('afterend', orientation);

  lesson.checks.forEach(([target, label, question], index) => {
    const section = document.getElementById(target);
    if (!section) return;
    const check = document.createElement('section');
    check.className = 'inline-concept-check';
    check.id = `concept-check-${index + 1}`;
    check.innerHTML = `<div class="check-kicker">CONCEPT CHECK · ${escape(label)}</div>${questionMarkup(question, `${slug}-inline-${index}`, index)}`;
    section.insertAdjacentElement('afterend', check);
  });

  const calibration = article.querySelector('#check');
  if (calibration) {
    calibration.querySelector('.quiz-stack > h3')?.replaceChildren('综合理解验证 · Deep Quiz');
    const transfer = document.createElement('div');
    transfer.className = 'transfer-check';
    transfer.innerHTML = `<div class="check-kicker">TRANSFER · 换一个没见过的表面</div>${questionMarkup(lesson.transfer, `${slug}-transfer`, 7)}`;
    calibration.querySelector('.quiz-stack')?.append(transfer);
  }

  const explain = document.createElement('section');
  explain.className = 'reading-section explain-yourself';
  explain.id = 'explain-yourself';
  explain.innerHTML = `<div class="section-label">CLOSED-BOOK RECALL</div><h2>不看上文，你能把它重新讲出来吗？</h2>
    <p class="section-lede">这不是第三轮考试。先口头回答，再展开参考思路，检查因果链是否完整。</p>
    <div class="open-prompts">${lesson.open.map(([prompt, guide]) => `<details><summary>${escape(prompt)}</summary><p><b>参考思路：</b>${escape(guide)}</p></details>`).join('')}</div>
    <div class="can-explain"><h3>你现在应该能够解释</h3><ul>${lesson.explain.map((item) => `<li>□ ${escape(item)}</li>`).join('')}</ul></div>
    <aside class="assignment-bridge"><span>LEARN → BUILD</span><h3>${escape(lesson.bridge[0])}</h3><p>${escape(lesson.bridge[2])}</p><a href="../${escape(lesson.bridge[1])}">进入对应工程阶段 →</a></aside>`;
  const vault = article.querySelector('#source-vault');
  vault?.insertAdjacentElement('beforebegin', explain);

  const toc = document.querySelector('.reading-toc');
  const back = toc?.querySelector('.toc-back');
  [['#active-learning', 'A', '主动定向'], ['#explain-yourself', 'R', '闭卷复述']].forEach(([href, number, label]) => {
    if (!toc || toc.querySelector(`[href="${href}"]`)) return;
    const link = document.createElement('a');
    link.href = href;
    link.innerHTML = `<span>${number}</span>${label}`;
    toc.insertBefore(link, back || null);
  });

  bindQuestions();
})();
