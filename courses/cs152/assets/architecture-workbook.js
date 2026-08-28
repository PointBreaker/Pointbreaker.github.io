(function () {
  const key = (location.pathname.match(/\/(ass\d{2})-[^/]+\.html$/) || [])[1];
  const data = window.CS152WorkbookBank && window.CS152WorkbookBank[key];
  const page = document.querySelector('.page');
  if (!data || !page || document.querySelector('.architecture-workbook')) return;

  const lessonLinks = (items) => items.map(([href, label]) => `<a href="${href}">${label}</a>`).join(' · ');
  const section = document.createElement('section');
  section.className = 'architecture-workbook';
  section.id = 'architecture-workbook';
  section.innerHTML = `
    <div class="arch-kicker">ARCHITECTURE WORKBOOK</div>
    <h2>先建模，再实现或计算</h2>
    <p class="awb-lede">${data.mission} 这里不会替你完成官方题目；它把工作拆成可验证的工程阶段，强制保留逐周期、逐地址或逐状态证据。</p>
    <nav class="awb-stage-nav" aria-label="Workbook stages">${data.stages.map((stage, index) => `<a href="#awb-stage-${index + 1}">${stage.title}</a>`).join('')}</nav>
    ${data.stages.map((stage, index) => `
      <section class="awb-stage" id="awb-stage-${index + 1}">
        <p class="awb-label">STAGE ${String(index + 1).padStart(2, '0')}</p>
        <h3>${stage.title}</h3>
        <p><strong>What you are building：</strong>${stage.build}</p>
        <p class="awb-back"><strong>Depends on：</strong>${lessonLinks(stage.lessons)}</p>
        <div class="awb-grid">
          <div class="awb-panel"><h4>Contract / invariant</h4><p>${stage.invariant}</p></div>
          <div class="awb-panel"><h4>Tiny sanity check</h4><p>先把系统缩到最小，使下面这条 trace 可以手算并逐项核对。</p></div>
        </div>
        <div class="awb-trace" aria-label="建议记录的推演轨迹">${stage.trace}</div>
        <dl class="awb-failures"><dt>如果你看到结果“差一点对”……</dt><dd>${stage.failure}</dd></dl>
        <div class="awb-evidence">
          <div><h4>Prediction</h4><p>运行或计算前，写下结果方向、关键周期/状态，以及你认为的瓶颈。</p></div>
          <div><h4>Evidence</h4><p>${stage.evidence}</p></div>
        </div>
        <div class="awb-hints">
          <details><summary>Hint 1 · Object</summary><p>先列出当前真正变化的对象：指令、资源、地址、cache line、寄存器映射或消息。</p></details>
          <details><summary>Hint 2 · Time</summary><p>把“会发生什么”改写为“在哪一拍、哪次访问或哪条消息之后发生”。</p></details>
          <details><summary>Hint 3 · Debug ladder</summary><p>按 shape/字段 → tiny trace → 单一机制 → 组合机制 → 完整 workload 的顺序扩大范围。</p></details>
        </div>
        <div class="awb-gate"><strong>Gate</strong><ul><li>结果或官方检查正确</li><li>能用 trace 解释关键状态转移</li><li>保留 prediction、measurement 与反例/边界条件</li></ul></div>
      </section>`).join('')}`;

  const firstRule = page.querySelector('.rule');
  (firstRule || page.firstElementChild).insertAdjacentElement(firstRule ? 'afterend' : 'beforebegin', section);
})();
