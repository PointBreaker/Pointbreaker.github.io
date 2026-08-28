(() => {
  const slug = location.pathname.match(/\/assignments\/([^/]+)\.html$/)?.[1];
  const assignment = window.MIT65840AssignmentBank?.[slug];
  const article = document.querySelector('.reading-article.page');
  if (!assignment || !article) return;

  document.body.classList.add('mit65840-workbook');
  const escape = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const tasks = [...article.querySelectorAll('.lab-task[id]')];
  const firstTask = tasks[0];
  const objective = article.querySelector('.objectives');
  const sourceVault = article.querySelector('#source-vault');
  if (!firstTask || !objective) return;

  const stageForProblem = new Map();
  assignment.stages.forEach((stage, index) => stage.official.forEach((id) => stageForProblem.set(id, { stage, index })));

  const primaryNav = document.createElement('nav');
  primaryNav.className = 'assignment-primary-nav';
  primaryNav.setAttribute('aria-label', 'Assignment primary navigation');
  primaryNav.innerHTML = `<a href="#workbook">Engineering Workbook</a><a href="#translated-handout">中文完整题面</a><a href="#official-sources">Official Handout</a>`;
  objective.insertAdjacentElement('afterend', primaryNav);

  const workbook = document.createElement('section');
  workbook.className = 'assignment-workbook';
  workbook.id = 'workbook';
  workbook.innerHTML = `<div class="section-label">ENGINEERING WORKBOOK</div>
    <h2>${escape(assignment.title)} · 从理解到证据</h2>
    <p class="section-lede">先确认 contract 和 tiny case，再实现；官方测试通过之后，还要留下能解释正确性、失败恢复或性能的证据。</p>
    <aside class="version-notice"><strong>版本边界</strong><p>Workbook 与题面映射依据 <b>${escape(assignment.source.label)}</b> 官方实验。接口、测试或交付要求若与本页任何说明冲突，以官方 Handout 与 repository 为准。</p><a href="${escape(assignment.source.url)}" target="_blank" rel="noreferrer">核对官方 Handout ↗</a></aside>
    <nav class="stage-map" aria-label="Engineering stages">${assignment.stages.map((stage, index) => `<a href="#workbook-stage-${escape(stage.id)}"><span>${String(index + 1).padStart(2, '0')}</span>${escape(stage.title)}</a>`).join('')}</nav>
    <div class="capability-strip"><span>完成后获得的能力</span>${assignment.capability.map((item) => `<b>${escape(item)}</b>`).join('')}</div>
    <div class="workbook-stages">${assignment.stages.map((stage, index) => stageMarkup(stage, index)).join('')}</div>
    <section class="assignment-retrospective"><h3>Retrospective · 你实际学到了什么？</h3><ol><li>最难 debug 的问题是什么？第一条非法状态迁移在哪里？</li><li>原来的 mental model 哪一点被实验推翻了？</li><li>哪项机制用一种资源换了另一种资源？</li><li>如果重新做一次，你会先写哪一个 tiny sanity check？</li></ol></section>`;
  primaryNav.insertAdjacentElement('afterend', workbook);

  function stageMarkup(stage, index) {
    const c = stage.contract;
    const e = stage.experiment;
    return `<section class="workbook-stage" id="workbook-stage-${escape(stage.id)}" data-workbook-stage="${escape(stage.id)}">
      <header><span>STAGE ${String(index + 1).padStart(2, '0')}</span><h3>${escape(stage.title)}</h3><p><b>What you are building：</b>${escape(stage.build)}</p></header>
      <div class="stage-depends"><strong>Depends on</strong>${stage.lessons.map((lesson) => `<a href="${escape(lesson.href)}">${escape(lesson.label)} ↗</a>`).join('')}</div>
      <div class="stage-official"><strong>对应中文题面</strong>${stage.official.map((id) => `<a href="#${escape(id)}" data-problem-link="${escape(id)}"><code>${escape(id)}</code><span>打开题面 ↓</span></a>`).join('')}</div>
      <div class="contract-block"><h4>Contract</h4><dl><div><dt>Input</dt><dd>${escape(c.input)}</dd></div><div><dt>Output</dt><dd>${escape(c.output)}</dd></div><div><dt>Invariants</dt><dd><ul>${c.invariants.map((item) => `<li>${escape(item)}</li>`).join('')}</ul></dd></div><div><dt>Forbidden assumptions</dt><dd><ul>${c.forbidden.map((item) => `<li>${escape(item)}</li>`).join('')}</ul></dd></div></dl></div>
      <aside class="sanity-check"><span>TINY SANITY CHECK</span><p>${escape(stage.sanity)}</p></aside>
      <div class="failure-signatures"><h4>如果你看到……</h4>${stage.failures.map(([symptom, direction]) => `<details><summary>${escape(symptom)}</summary><p>${escape(direction)}</p></details>`).join('')}</div>
      <div class="hint-ladder"><h4>Progressive Hints</h4><p>建议先独立尝试 10–15 分钟；Hint 只帮助缩小问题，不提供可提交实现。</p>${stage.hints.map((hint, hintIndex) => `<details><summary>Hint ${hintIndex + 1} · ${['Concept', 'Invariant / Structure', 'Debug Strategy'][hintIndex]}</summary><p>${escape(hint.replace(/^[^：]+：/, ''))}</p></details>`).join('')}</div>
      <div class="experiment-loop"><h4>Prediction → Experiment → Explanation</h4><ol><li><b>Hypothesis</b><p>${escape(e.hypothesis)}</p></li><li><b>Prediction</b><p>${escape(e.prediction)}</p></li><li><b>Controlled experiment</b><p>${escape(e.run)}</p></li><li><b>Observation / Explanation</b><p>${escape(e.observe)}</p></li></ol></div>
      <div class="definition-done"><h4>Definition of Done</h4><div><b>Correct</b><p>对应官方 tests 通过；shape/state/result 与 contract 一致。</p></div><div><b>Understand</b><p>能解释两个 invariant，以及 forbidden assumption 会产生的反例。</p></div><div><b>Evidence</b><p>保存 tiny case、失败复现或 controlled experiment 的观察与解释。</p></div></div>
      <div class="gate-check"><strong>GATE · ${escape(stage.title)}</strong><label><input type="checkbox"> Contract 与 tiny case 已验证</label><label><input type="checkbox"> 官方题面与 tests 已完成</label><label><input type="checkbox"> 我能解释失败路径和实验结果</label><small>不硬锁下一阶段；这些勾选只保存在你的阅读上下文中。</small></div>
    </section>`;
  }

  const handoutHeader = document.createElement('section');
  handoutHeader.className = 'translated-handout-header';
  handoutHeader.id = 'translated-handout';
  const indexGroups = assignment.stages.map((stage, index) => ({ stage, index, tasks: stage.official.map((id) => document.getElementById(id)).filter(Boolean) }));
  const mapped = new Set([...stageForProblem.keys()]);
  const extra = tasks.filter((task) => !mapped.has(task.id));
  handoutHeader.innerHTML = `<div class="section-label">COMPLETE CHINESE HANDOUT</div><h2>中文完整题面</h2>
    <p class="section-lede">保留原任务、约束、测试与官方编号；它和 Workbook 同为核心资源，不是附录。实现要求冲突时仍以 ${escape(assignment.source.label)} 官方源为准。</p>
    <div class="problem-index">${indexGroups.map(({ stage, index, tasks: groupTasks }) => `<section><h3>${String(index + 1).padStart(2, '0')} · ${escape(stage.title)}</h3>${groupTasks.map(problemLink).join('')}</section>`).join('')}${extra.length ? `<section><h3>Handout 其他要求</h3>${extra.map(problemLink).join('')}</section>` : ''}</div>`;
  firstTask.insertAdjacentElement('beforebegin', handoutHeader);

  function problemLink(task) {
    const title = task.querySelector('summary strong')?.textContent.trim() || task.id;
    return `<a href="#${escape(task.id)}" data-problem-link="${escape(task.id)}"><code>${escape(task.id)}</code><span>${escape(title)}</span></a>`;
  }

  tasks.forEach((task) => {
    const details = task.querySelector(':scope > details.problem-row');
    details?.removeAttribute('open');
    const mapping = stageForProblem.get(task.id);
    if (!details || !mapping) return;
    const back = document.createElement('a');
    back.className = 'problem-stage-back';
    back.href = `#workbook-stage-${mapping.stage.id}`;
    back.textContent = `← Stage ${String(mapping.index + 1).padStart(2, '0')} · ${mapping.stage.title}`;
    details.querySelector('summary')?.insertAdjacentElement('afterend', back);
  });

  if (sourceVault) {
    const officialAnchor = document.createElement('span');
    officialAnchor.id = 'official-sources';
    officialAnchor.className = 'official-source-anchor';
    sourceVault.insertAdjacentElement('beforebegin', officialAnchor);
    sourceVault.querySelector('h2')?.replaceChildren('Official Handout 与原始资料');
    sourceVault.querySelector('.section-label')?.replaceChildren('OFFICIAL SOURCES / FINAL AUTHORITY');
  }

  const toc = document.querySelector('.reading-toc');
  const back = toc?.querySelector('.toc-back');
  [['#workbook', 'W', 'Engineering Workbook'], ['#translated-handout', '中', '中文完整题面'], ['#official-sources', 'O', 'Official Sources']].forEach(([href, number, label]) => {
    const old = href === '#official-sources' ? toc?.querySelector('[href="#source-vault"]') : null;
    if (old) { old.innerHTML = `<span>${number}</span>${label}`; return; }
    const link = document.createElement('a'); link.href = href; link.innerHTML = `<span>${number}</span>${label}`; toc?.insertBefore(link, back || null);
  });

  const openProblem = (id) => {
    const task = document.getElementById(id);
    const details = task?.querySelector(':scope > details.problem-row');
    if (!task || !details) return;
    details.open = true;
    task.classList.add('is-target-problem');
    setTimeout(() => task.classList.remove('is-target-problem'), 1800);
  };
  document.querySelectorAll('[data-problem-link]').forEach((link) => link.addEventListener('click', () => openProblem(link.dataset.problemLink)));
  if (location.hash) openProblem(location.hash.slice(1));
  addEventListener('hashchange', () => openProblem(location.hash.slice(1)));

  document.querySelectorAll('.gate-check input').forEach((input) => input.addEventListener('change', () => {
    const gate = input.closest('.gate-check');
    const count = gate.querySelectorAll('input:checked').length;
    gate.classList.toggle('is-complete', count === 3);
  }));
})();
