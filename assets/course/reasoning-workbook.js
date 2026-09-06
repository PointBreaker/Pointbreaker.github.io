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
  html.push('<p class="reasoning-workbook__kicker">推理工作簿 · 建模 → 推导 → 检验</p>');
  html.push('<h2>' + data.title + '</h2>');
  html.push('<p class="reasoning-workbook__lede">' + data.mission + ' 先完成这张工作纸，再进入完整题面；它提供证明/建模脚手架，不提供实现或证明答案。</p>');
  html.push('<p><strong>快速复习：</strong><a href="' + data.lesson[0] + '">' + data.lesson[1] + '</a></p>');
  html.push('<ol class="reasoning-workbook__route">' + data.stages.map((stage) => '<li>' + stage + '</li>').join('') + '</ol>');
  html.push('<div class="reasoning-workbook__grid">');
  html.push('<div class="reasoning-workbook__panel invariant"><h3>契约与证明义务</h3><ul>' + data.contract.map((item) => '<li>' + item + '</li>').join('') + '</ul></div>');
  html.push('<div class="reasoning-workbook__panel"><h3>小例子与反例检查</h3><p>' + data.sanity + '</p></div></div>');
  html.push('<div class="reasoning-workbook__trace">' + data.trace + '</div>');
  html.push('<div class="reasoning-workbook__check quiz"><p class="reasoning-workbook__check-label">准备好了吗？</p><p><strong>' + data.check.question + '</strong></p>');
  html.push('<div class="reasoning-workbook__options quiz-options">' + data.check.choices.map((choice, index) => '<button type="button" data-choice="' + index + '" aria-pressed="false">' + choice + '</button>').join('') + '</div>');
  html.push('<p class="reasoning-workbook__feedback quiz-feedback" role="status" aria-live="polite" aria-atomic="true"></p></div>');
  html.push('<details class="reasoning-workbook__details"><summary>如果卡住：Failure signatures</summary><dl class="reasoning-workbook__failures">' + data.failures.map((item) => '<dt>' + item[0] + '</dt><dd>' + item[1] + '</dd>').join('') + '</dl></details>');
  html.push('<details class="reasoning-workbook__details"><summary>渐进提示（先独立尝试，再展开）</summary><ol>' + data.hints.map((hint) => '<li>' + hint + '</li>').join('') + '</ol></details>');
  html.push('<div class="reasoning-workbook__gate"><strong>Gate · 不是“看过答案”</strong><ul>' + data.gate.map((item) => '<li>' + item + '</li>').join('') + '</ul></div>');
  section.innerHTML = html.join('');

  const guide = page.querySelector('.assignment-guide-grid, .guide-banner');
  const firstRule = page.querySelector('.rule');
  if (guide) guide.insertAdjacentElement('afterend', section);
  else (firstRule || page.querySelector('h1')).insertAdjacentElement('afterend', section);

  const quiz=section.querySelector('.quiz');
  quiz.dataset.answer=String(data.check.answer);quiz.dataset.correct='正确。'+data.check.confirm;quiz.dataset.incorrect=data.check.diagnosis;
  window.initCourseQuizzes?.(section);
})();
