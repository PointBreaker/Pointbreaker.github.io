(function () {
  const root = document.querySelector('[data-review-lab]');
  if (!root) return;
  const lab = window.EECS498ReviewLabs?.[root.dataset.reviewLab];
  if (!lab) { root.innerHTML = '<main class="review-shell"><h1>Review Lab not found</h1></main>'; return; }
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const titles={'Tensor Contract':'张量契约','KNN Decision Rule':'KNN 决策规则','Evidence Gate':'证据检查','Scores and Loss':'得分与损失','Gradient Contract':'梯度契约','Two-layer Representation':'两层网络的表示','Training Evidence':'训练证据','Layer Contracts':'网络层的契约','Optimizer State':'优化器状态','Convolution Shape and Locality':'卷积的形状与局部性','CNN Evidence Gate':'CNN 证据检查','Autograd Boundary':'自动微分的边界','Recurrent State':'循环状态','LSTM and Attention':'LSTM 与注意力','Sequence Evidence Gate':'序列模型的证据','Box Geometry':'边界框的几何','Matching and Loss':'匹配与损失','NMS Decision':'非极大值抑制','Detector Evidence Gate':'检测器的证据','VAE Objective':'VAE 的目标函数','Reparameterization':'重参数化','Adversarial Game':'对抗博弈','Generative Evidence Gate':'生成模型的证据'};
  const titleOf=stage=>titles[stage.title]||stage.title;
  const list = (items) => `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`;
  const contract = (value) => `<div class="review-contract"><dl><div><dt>输入</dt><dd>${esc(value.input)}</dd></div><div><dt>输出</dt><dd>${esc(value.output)}</dd></div></dl><div class="invariant"><strong>不变量</strong>${list(value.invariants)}</div><div class="misconception"><strong>不成立的假设</strong>${list(value.forbidden)}</div></div>`;
  const stages = lab.stages.map((stage, index) => `<article class="review-stage" id="stage-${esc(stage.id)}">
    <header><span>阶段 ${String(index + 1).padStart(2,'0')}</span><h2>${esc(titleOf(stage))}</h2><p>${esc(stage.build)}</p></header>
    <section class="why-this-works"><h3>为什么需要它</h3><p>${esc(stage.why)}</p><div class="review-links">${stage.lessons.map((item) => `<a href="${esc(item.href)}">${esc(item.label.replace('Lesson','讲义'))} →</a>`).join('')}</div></section>
    <section><h3>开始前应该已经会回答</h3>${list(stage.readiness)}</section>
    <section><h3>输入、输出与契约</h3>${contract(stage.contract)}</section>
    <section class="review-sanity"><h3>用最小例子检查</h3><p>${esc(stage.sanity)}</p></section>
    <section><h3>如果你看到……</h3><div class="failure-grid">${stage.failures.map((item) => `<div><strong>${esc(item.see)}</strong><p>优先检查：${esc(item.check)}</p></div>`).join('')}</div></section>
    <section class="review-loop"><h3>预测 → 实验 → 证据</h3><dl><div><dt>先预测</dt><dd>${esc(stage.prediction)}</dd></div><div><dt>做实验</dt><dd>${esc(stage.experiment)}</dd></div><div><dt>留证据</dt><dd>${list(stage.evidence)}</dd></div></dl></section>
    <section><h3>渐进提示</h3><p class="hint-note">先独立排查 10–15 分钟，再按需展开。</p>${stage.hints.map((hint, hintIndex) => `<details><summary>提示 ${hintIndex + 1}</summary><p>${esc(hint)}</p></details>`).join('')}</section>
    <section class="review-gate"><h3>闭卷检查 · ${esc(titleOf(stage))}</h3>${list(stage.gate)}</section>
  </article>`).join('');
  root.classList.add('lesson-page');
  root.innerHTML = `<a class="skip-link" href="#review-content">跳到 Review Lab</a><nav class="review-bar"><a href="../index.html">← EECS498</a><a href="${esc(lab.source)}" target="_blank" rel="noreferrer">代码快照 ↗</a></nav>
  <header class="review-hero"><div class="review-shell"><p>${esc(lab.eyebrow)}</p><h1>${esc(lab.title)}</h1><p class="review-lede">${esc(lab.subtitle)}</p><div class="review-capabilities">${lab.capabilities.map((item) => `<span>${esc(item)}</span>`).join('')}</div><p class="review-boundary"><strong>Review Lab，不是作业答案。</strong>阅读现有实现，先预测，再运行小实验并解释证据；原始仓库快照是代码事实来源。</p></div></header>
  <nav class="review-stage-nav" aria-label="复盘阶段">${lab.stages.map((stage,index)=>`<a href="#stage-${esc(stage.id)}"><span>${String(index+1).padStart(2,'0')}</span>${esc(titleOf(stage))}</a>`).join('')}</nav>
  <main class="review-shell page" id="review-content">${stages}<section class="review-retro"><h2>复盘与迁移</h2>${list(['哪一个原有心智模型被代码证据推翻了？','哪一个 bug 最适合用最小输入定位？','哪项优化只是换了一种资源，而没有改变模型语义？','如果重新审计一次，你会先验证哪个不变量？'])}</section></main>`;
})();
