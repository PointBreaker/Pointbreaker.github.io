/* MIT 6.102 SP26 — EN ⇄ 中文 page-level switch */
(function(){
  'use strict';
  let lang = localStorage.getItem('mit6102-lang') || 'en';

  function switchLang(target) {
    lang = target;
    localStorage.setItem('mit6102-lang', target);
    const path = window.location.pathname;
    const parts = path.split('/');
    if (target === 'zh') {
      parts.splice(parts.length - 1, 0, 'zh');
    } else {
      const i = parts.indexOf('zh');
      if (i !== -1) parts.splice(i, 1);
    }
    window.location.href = window.location.origin + parts.join('/') + window.location.search + window.location.hash;
  }

  function updateBtn() {
    const btn = document.getElementById('i18n-btn');
    if (!btn) return;
    btn.textContent = lang === 'zh' ? '中 / EN' : 'EN / 中';
    btn.classList.toggle('active', lang === 'zh');
  }

  function init() {
    const style = document.createElement('style');
    style.textContent = '.i18n-float{position:fixed;top:16px;right:16px;z-index:9999;background:rgba(26,26,32,.9);backdrop-filter:blur(12px);border:1px solid rgba(240,236,228,.15);color:#f0ece4;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:border-color .2s,background .2s,transform .15s;font-family:inherit;text-decoration:none}.i18n-float:hover{border-color:rgba(196,48,43,.5);background:rgba(20,20,24,.95);transform:translateY(-1px)}.i18n-float.active{background:rgba(196,48,43,.15);border-color:rgba(196,48,43,.4)}';
    document.head.appendChild(style);
    const btn = document.createElement('button');
    btn.id = 'i18n-btn';
    btn.className = 'i18n-float';
    btn.onclick = () => switchLang(lang === 'en' ? 'zh' : 'en');
    document.body.appendChild(btn);
    updateBtn();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
