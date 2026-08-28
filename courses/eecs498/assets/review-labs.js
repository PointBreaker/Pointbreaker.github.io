(function () {
  const root = document.querySelector('[data-review-lab]');
  if (!root) return;
  const lab = window.EECS498ReviewLabs?.[root.dataset.reviewLab];
  if (!lab) { root.innerHTML = '<main class="review-shell"><h1>Review Lab not found</h1></main>'; return; }
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const list = (items) => `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
  const contract = (value) => `<div class="review-contract"><dl><div><dt>Input</dt><dd>${esc(value.input)}</dd></div><div><dt>Output</dt><dd>${esc(value.output)}</dd></div></dl><div><strong>Invariants</strong>${list(value.invariants)}</div><div><strong>Forbidden assumptions</strong>${list(value.forbidden)}</div></div>`;
  const stages = lab.stages.map((stage, index) => `<article class="review-stage" id="stage-${esc(stage.id)}">
    <header><span>STAGE ${String(index + 1).padStart(2,'0')}</span><h2>${esc(stage.title)}</h2><p>${esc(stage.build)}</p></header>
    <section><h3>Why this exists</h3><p>${esc(stage.why)}</p><div class="review-links">${stage.lessons.map((item) => `<a href="${esc(item.href)}">${esc(item.label)} →</a>`).join('')}</div></section>
    <section><h3>开始前应该已经会回答</h3>${list(stage.readiness)}</section>
    <section><h3>Contract</h3>${contract(stage.contract)}</section>
    <section class="review-sanity"><h3>Tiny sanity check</h3><p>${esc(stage.sanity)}</p></section>
    <section><h3>如果你看到……</h3><div class="failure-grid">${stage.failures.map((item) => `<div><strong>${esc(item.see)}</strong><p>优先检查：${esc(item.check)}</p></div>`).join('')}</div></section>
    <section class="review-loop"><h3>Prediction → Experiment → Evidence</h3><dl><div><dt>Prediction</dt><dd>${esc(stage.prediction)}</dd></div><div><dt>Experiment</dt><dd>${esc(stage.experiment)}</dd></div><div><dt>Evidence</dt><dd>${list(stage.evidence)}</dd></div></dl></section>
    <section><h3>Progressive hints</h3><p class="hint-note">先独立排查 10–15 分钟，再按需展开。</p>${stage.hints.map((hint, hintIndex) => `<details><summary>Hint ${hintIndex + 1}</summary><p>${esc(hint)}</p></details>`).join('')}</section>
    <section class="review-gate"><h3>Gate · ${esc(stage.title)}</h3>${list(stage.gate)}</section>
  </article>`).join('');
  root.innerHTML = `<a class="skip-link" href="#review-content">跳到 Review Lab</a><nav class="review-bar"><a href="../index.html">← EECS498</a><a href="${esc(lab.source)}" target="_blank" rel="noreferrer">代码快照 ↗</a></nav>
  <header class="review-hero"><div class="review-shell"><p>${esc(lab.eyebrow)}</p><h1>${esc(lab.title)}</h1><p class="review-lede">${esc(lab.subtitle)}</p><div class="review-capabilities">${lab.capabilities.map((item) => `<span>${esc(item)}</span>`).join('')}</div><p class="review-boundary"><strong>Review Lab，不是作业答案。</strong>阅读现有实现，先预测，再运行小实验并解释证据；原始仓库快照是代码事实来源。</p></div></header>
  <nav class="review-stage-nav" aria-label="Review Lab stages">${lab.stages.map((stage,index)=>`<a href="#stage-${esc(stage.id)}"><span>${String(index+1).padStart(2,'0')}</span>${esc(stage.title)}</a>`).join('')}</nav>
  <main class="review-shell" id="review-content">${stages}<section class="review-retro"><h2>Retrospective</h2>${list(['哪一个原有 mental model 被代码证据推翻了？','哪一个 bug 最适合用 tiny input 定位？','哪项优化只是换了一种资源，而没有改变模型语义？','如果重新审计一次，你会先验证哪个 invariant？'])}</section></main>`;
})();
