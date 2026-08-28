(function () {
  const key = (location.pathname.match(/\/(\d{4})-[^/]+\.html$/) || [])[1];
  const data = window.CS152ArchitectureBank && window.CS152ArchitectureBank[key];
  const page = document.querySelector('.page');
  if (!data || !page || document.querySelector('.arch-experience')) return;

  const section = document.createElement('section');
  section.className = 'arch-experience';
  section.id = 'architecture-brief';
  section.innerHTML = `
    <div class="arch-kicker">ARCHITECTURE REASONING</div>
    <h2>${data.title}</h2>
    <p class="arch-mental"><strong>Mental model</strong>${data.mental}</p>
    <div class="arch-diagram" role="img" aria-label="${data.title}：${data.flow.join('，然后')}" data-arch-diagram>
      ${data.flow.map((node, index) => `<div class="arch-node"><span>${String(index + 1).padStart(2, '0')}</span><strong>${node}</strong></div>`).join('<div class="arch-arrow" aria-hidden="true">→</div>')}
    </div>
    <div class="arch-check" data-arch-check>
      <p class="arch-check-label">先预测，再继续</p>
      <p><strong>${data.check.question}</strong></p>
      <div class="arch-options">${data.check.choices.map((choice, index) => `<button type="button" data-choice="${index}" aria-pressed="false">${choice}</button>`).join('')}</div>
      <p class="arch-feedback" role="status" aria-live="polite" aria-atomic="true"></p>
    </div>
    <p class="arch-bridge"><strong>Build it：</strong>在 <a href="assignments/${data.bridge}#architecture-workbook">Architecture Workbook</a> 中把这条机制变成逐周期、逐地址或逐状态证据。</p>`;

  const firstRule = page.querySelector('.rule');
  (firstRule || page.firstElementChild).insertAdjacentElement(firstRule ? 'afterend' : 'beforebegin', section);
  section.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = Number(button.dataset.choice);
      const correct = selected === data.check.answer;
      section.querySelectorAll('[data-choice]').forEach((candidate) => {
        candidate.setAttribute('aria-pressed', String(candidate === button));
        candidate.classList.toggle('is-selected', candidate === button);
      });
      const feedback = section.querySelector('.arch-feedback');
      feedback.className = `arch-feedback ${correct ? 'is-correct' : 'is-wrong'}`;
      feedback.textContent = correct ? `正确。${data.mental}` : `再检查：${data.check.diagnosis}`;
    });
  });
})();
