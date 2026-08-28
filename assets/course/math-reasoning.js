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
    <p class="math-reasoning__kicker">${bank.label || 'REPRESENT → DERIVE → CHECK'}</p>
    <h2>${data.title}</h2>
    <p class="math-reasoning__mental"><strong>Mental model</strong>${data.mental}</p>
    <ol class="math-reasoning__map" style="--math-columns:${Math.min(data.nodes.length, 5)}" role="img" aria-label="${data.title}：${data.nodes.join('，然后')}" data-math-diagram>
      ${data.nodes.map((node) => `<li class="math-reasoning__node"><strong>${node}</strong></li>`).join('')}
    </ol>
    <div class="math-reasoning__check" data-math-check>
      <p class="math-reasoning__check-label">先预测，再看推导</p>
      <p><strong>${data.check.question}</strong></p>
      <div class="math-reasoning__options">${data.check.choices.map((choice, index) => `<button type="button" data-choice="${index}" aria-pressed="false">${choice}</button>`).join('')}</div>
      <p class="math-reasoning__feedback" role="status" aria-live="polite" aria-atomic="true"></p>
    </div>
    <details class="math-reasoning__transfer"><summary>闭卷迁移：换一个表面形式</summary><p>${data.transfer}</p></details>
    <p class="math-reasoning__bridge">这不是额外公式：它规定了读本课正文时应反复执行的数学动作。</p>`;
  const firstRule = page.querySelector('.rule');
  (firstRule || page.firstElementChild).insertAdjacentElement(firstRule ? 'afterend' : 'beforebegin', section);

  section.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    const selected = Number(button.dataset.choice);
    section.querySelectorAll('[data-choice]').forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
    const correct = selected === data.check.answer;
    const feedback = section.querySelector('.math-reasoning__feedback');
    feedback.className = `math-reasoning__feedback ${correct ? 'is-correct' : 'is-wrong'}`;
    feedback.textContent = correct ? `正确。${data.mental}` : `再检查：${data.check.diagnosis}`;
  }));

  if (window.renderMathInElement) {
    window.renderMathInElement(section, { delimiters: [
      { left: '$$', right: '$$', display: true }, { left: '\\[', right: '\\]', display: true },
      { left: '\\(', right: '\\)', display: false }, { left: '$', right: '$', display: false },
    ], throwOnError: false });
  }
})();
