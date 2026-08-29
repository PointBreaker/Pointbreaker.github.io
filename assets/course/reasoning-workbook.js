(function () {
  const key = (location.pathname.match(/\/(ass\d{2})-[^/]+\.html$/) || [])[1];
  const bank = window.ReasoningWorkbookBank;
  const data = bank && bank.entries && bank.entries[key];
  const page = document.querySelector('.page');
  if (!data || !page || document.querySelector('.reasoning-workbook')) return;

  const section = document.createElement('section');
  section.className = 'reasoning-workbook';
  section.id = 'reasoning-workbook';
  const html = [];
  html.push('<p class="reasoning-workbook__kicker">' + bank.label + '</p>');
  html.push('<h2>' + data.title + '</h2>');
  html.push('<p class="reasoning-workbook__lede">' + data.mission + ' 先完成这张工作纸，再进入完整题面；它提供证明/建模脚手架，不提供实现或证明答案。</p>');
  html.push('<p><strong>快速复习：</strong><a href="' + data.lesson[0] + '">' + data.lesson[1] + '</a></p>');
  html.push('<ol class="reasoning-workbook__route">' + data.stages.map((stage) => '<li>' + stage + '</li>').join('') + '</ol>');
  html.push('<div class="reasoning-workbook__grid">');
  html.push('<div class="reasoning-workbook__panel"><h3>Contract / proof obligation</h3><ul>' + data.contract.map((item) => '<li>' + item + '</li>').join('') + '</ul></div>');
  html.push('<div class="reasoning-workbook__panel"><h3>Tiny sanity / counterexample</h3><p>' + data.sanity + '</p></div></div>');
  html.push('<div class="reasoning-workbook__trace">' + data.trace + '</div>');
  html.push('<div class="reasoning-workbook__check"><p class="reasoning-workbook__check-label">Readiness check</p><p><strong>' + data.check.question + '</strong></p>');
  html.push('<div class="reasoning-workbook__options">' + data.check.choices.map((choice, index) => '<button type="button" data-choice="' + index + '" aria-pressed="false">' + choice + '</button>').join('') + '</div>');
  html.push('<p class="reasoning-workbook__feedback" role="status" aria-live="polite" aria-atomic="true"></p></div>');
  html.push('<details class="reasoning-workbook__details"><summary>如果卡住：Failure signatures</summary><dl class="reasoning-workbook__failures">' + data.failures.map((item) => '<dt>' + item[0] + '</dt><dd>' + item[1] + '</dd>').join('') + '</dl></details>');
  html.push('<details class="reasoning-workbook__details"><summary>渐进提示（先独立尝试，再展开）</summary><ol>' + data.hints.map((hint) => '<li>' + hint + '</li>').join('') + '</ol></details>');
  html.push('<div class="reasoning-workbook__gate"><strong>Gate · 不是“看过答案”</strong><ul>' + data.gate.map((item) => '<li>' + item + '</li>').join('') + '</ul></div>');
  section.innerHTML = html.join('');

  const guide = page.querySelector('.assignment-guide-grid, .guide-banner');
  const firstRule = page.querySelector('.rule');
  if (guide) guide.insertAdjacentElement('afterend', section);
  else (firstRule || page.querySelector('h1')).insertAdjacentElement('afterend', section);

  section.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => {
    const selected = Number(button.dataset.choice);
    section.querySelectorAll('[data-choice]').forEach((candidate) => candidate.setAttribute('aria-pressed', String(candidate === button)));
    const correct = selected === data.check.answer;
    const feedback = section.querySelector('.reasoning-workbook__feedback');
    feedback.className = 'reasoning-workbook__feedback ' + (correct ? 'is-correct' : 'is-wrong');
    feedback.textContent = correct ? '正确。' + data.check.confirm : '先修复这个模型：' + data.check.diagnosis;
  }));
})();
