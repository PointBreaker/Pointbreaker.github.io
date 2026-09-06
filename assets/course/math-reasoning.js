(function () {
  const key = (location.pathname.match(/\/(\d{4})-[^/]+\.html$/) || [])[1];
  const bank = window.MathReasoningBank;
  const data = bank && bank.entries && bank.entries[key];
  const page = document.querySelector('.page');
  if (!data || !page || document.querySelector('.math-reasoning')) return;

  const section = document.createElement('section');
  section.className = 'math-reasoning';
  section.id = 'math-reasoning';
  section.innerHTML = `
    <p class="math-reasoning__kicker">数学推演 · 表示 → 推导 → 检验</p>
    <h2>${data.title}</h2>
    <p class="math-reasoning__mental mental-model"><strong>心智模型</strong>${data.mental}</p>
    <ol class="math-reasoning__map" style="--math-columns:${Math.min(data.nodes.length, 5)}" role="img" aria-label="${data.title}：${data.nodes.join('，然后')}" data-math-diagram>
      ${data.nodes.map((node) => `<li class="math-reasoning__node"><strong>${node}</strong></li>`).join('')}
    </ol>
    <div class="math-reasoning__check quiz" data-math-check>
      <p class="math-reasoning__check-label">先预测，再看推导</p>
      <p><strong>${data.check.question}</strong></p>
      <div class="math-reasoning__options quiz-options">${data.check.choices.map((choice, index) => `<button type="button" data-choice="${index}" aria-pressed="false">${choice}</button>`).join('')}</div>
      <p class="math-reasoning__feedback quiz-feedback" role="status" aria-live="polite" aria-atomic="true"></p>
    </div>
    <details class="math-reasoning__transfer"><summary>闭卷迁移：换一个表面形式</summary><p>${data.transfer}</p></details>
    <p class="math-reasoning__bridge">这不是额外公式：它规定了读本课正文时应反复执行的数学动作。</p>`;
  const firstRule = page.querySelector('.rule');
  (firstRule || page.firstElementChild).insertAdjacentElement(firstRule ? 'afterend' : 'beforebegin', section);

  const quiz=section.querySelector('.quiz');
  quiz.dataset.answer=String(data.check.answer);quiz.dataset.correct=`正确。${data.mental}`;quiz.dataset.incorrect=data.check.diagnosis;
  window.initCourseQuizzes?.(section);

  if (window.renderMathInElement) {
    window.renderMathInElement(section, { delimiters: [
      { left: '$$', right: '$$', display: true }, { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false }, { left: '$', right: '$', display: false },
    ], throwOnError: false });
  }
})();
