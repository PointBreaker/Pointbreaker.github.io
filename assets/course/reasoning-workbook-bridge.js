(function () {
  const key = (location.pathname.match(/\/(\d{4})-[^/]+\.html$/) || [])[1];
  const bank = window.ReasoningWorkbookBank;
  const bridge = bank && bank.lessonBridges && bank.lessonBridges[key];
  const page = document.querySelector('.page');
  if (!bridge || !page || document.querySelector('.reasoning-workbook__bridge')) return;
  const aside = document.createElement('aside');
  aside.className = 'reasoning-workbook__bridge';
  aside.innerHTML = '<h3>把本课变成可提交的推理</h3><p>' + bridge[2] + '</p><p><a href="assignments/' + bridge[0] + '#reasoning-workbook">' + bridge[1] + ' Workbook →</a></p>';
  const nav = page.querySelector('.nav');
  const footer = page.querySelector('footer');
  (nav || footer || page.lastElementChild).insertAdjacentElement('beforebegin', aside);
})();
