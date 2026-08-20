/* MIT 6.102 SP26 — EN ⇄ 中文 page-level language switch */
(function(){
  'use strict';

  const stored = localStorage.getItem('mit6102-lang');
  let currentLang = stored || 'en';

  function getZhPath(path) {
    if (path.endsWith('/zh/index.html')) return path; // already zh
    if (path.endsWith('/index.html')) {
      return path.replace(/\/index\.html$/, '/zh/index.html');
    }
    return null;
  }

  function getEnPath(path) {
    if (path.includes('/zh/index.html')) {
      return path.replace(/\/zh\/index\.html$/, '/index.html');
    }
    return null;
  }

  function targetPath() {
    const path = window.location.pathname;
    if (currentLang === 'zh') {
      return getZhPath(path);
    } else {
      return getEnPath(path);
    }
  }

  function toggleLang() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    localStorage.setItem('mit6102-lang', currentLang);
    const target = targetPath();
    if (target && target !== window.location.pathname) {
      window.location.href = window.location.origin + target + window.location.search + window.location.hash;
    } else {
      updateBtn();
    }
  }

  function updateBtn() {
    const btn = document.getElementById('i18n-btn');
    if (!btn) return;
    if (currentLang === 'zh') {
      btn.textContent = '中 / EN';
      btn.classList.add('active');
    } else {
      btn.textContent = 'EN / 中';
      btn.classList.remove('active');
    }
  }

  function createBtn() {
    const btn = document.createElement('button');
    btn.id = 'i18n-btn';
    btn.className = 'i18n-float';
    btn.textContent = 'EN / 中';
    btn.onclick = toggleLang;
    document.body.appendChild(btn);
  }

  function addCSS() {
    const style = document.createElement('style');
    style.textContent = '.i18n-float{position:fixed;top:16px;right:16px;z-index:9999;background:rgba(26,26,32,.9);backdrop-filter:blur(12px);border:1px solid rgba(240,236,228,.15);color:#f0ece4;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:border-color .2s,background .2s,transform .15s;font-family:inherit;text-decoration:none}.i18n-float:hover{border-color:rgba(196,48,43,.5);background:rgba(20,20,24,.95);transform:translateY(-1px)}.i18n-float.active{background:rgba(196,48,43,.15);border-color:rgba(196,48,43,.4)}';
    document.head.appendChild(style);
  }

  function init() {
    addCSS();
    createBtn();
    updateBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
