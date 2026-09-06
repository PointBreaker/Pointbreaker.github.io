/* Shared navigation. Search indexes real course manifests; no account or fake state. */
(() => {
  'use strict';
  const assetRoot = new URL('../', document.currentScript.src);
  const site = new URL('../', assetRoot);
  const url = path => new URL(path, site).href;
  const icon = name => `<img src="${url(`assets/vendor/tabler/${name}.svg`)}" alt="" width="20" height="20">`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const courseId = location.pathname.match(/\/courses\/([^/]+)\//)?.[1];
  document.body.classList.add('cs-platform');
  const header = document.createElement('header');
  header.className = 'cs-header';
  header.innerHTML = `<div class="cs-header-inner"><a class="cs-wordmark" href="${site.href}" aria-label="CourseStack 首页">CourseStack</a><nav aria-label="主导航"><a href="${url('#course-library')}">课程</a><a href="${url('#learning-methods')}">关于</a><a href="https://github.com/PointBreaker/Pointbreaker.github.io/discussions">社区</a></nav><button class="cs-search-trigger" type="button">${icon('search')}<span>搜索课程、讲义与练习</span><kbd>/</kbd></button><a class="cs-person" href="https://github.com/PointBreaker" aria-label="PointBreaker 的 GitHub 主页">${icon('user')}</a></div>`;
  document.body.prepend(header);
  document.body.classList.add('cs-enhanced');
  const dialog = document.createElement('dialog');
  dialog.className = 'cs-search-dialog';
  dialog.setAttribute('aria-labelledby', 'cs-search-title');
  dialog.innerHTML = `<form method="dialog" class="cs-search-top"><label id="cs-search-title" for="cs-search-input">搜索 CourseStack</label><button aria-label="关闭搜索">${icon('x')}</button></form><input id="cs-search-input" type="search" placeholder="试试 TCP、Transformer、线性代数…" autocomplete="off"><p class="cs-search-status" role="status">正在载入课程目录…</p><div class="cs-search-results"></div>`;
  document.body.append(dialog);
  let entries = [], loading;
  const input = dialog.querySelector('input'), results = dialog.querySelector('.cs-search-results'), status = dialog.querySelector('[role=status]');
  const render = () => {
    const query = input.value.trim().toLocaleLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    const matches = entries.filter(item => !query ? item.kind === '课程' : words.every(word => item.search.includes(word)));
    matches.sort((a,b) => Number(b.courseId === courseId) - Number(a.courseId === courseId));
    status.textContent = query ? `找到 ${matches.length} 项${matches.length > 60 ? '，先显示前 60 项' : ''}` : '选择一门课程，或输入关键词查找具体内容';
    results.innerHTML = matches.slice(0,60).map(item => `<a href="${esc(item.href)}"><span>${esc(item.code)} · ${item.kind}</span><strong>${esc(item.title)}</strong></a>`).join('') || '<p>没有找到匹配内容。试试课程编号或更短的关键词。</p>';
  };
  const load = () => loading ||= (async () => {
    try {
      const response = await fetch(url('courses.json')); if(!response.ok) throw Error();
      const {courses} = await response.json();
      const add = item => entries.push({...item, search:[item.code,item.title,item.extra].join(' ').toLocaleLowerCase()});
      courses.forEach(c => add({courseId:c.id,code:c.code,title:c.titleZh,kind:'课程',href:url(c.path),extra:[c.title,c.domain,...c.tags].join(' ')}));
      render();
      const settled = await Promise.allSettled(courses.map(async c => {
        const r=await fetch(url(`${c.path}api/status.json`)); if(!r.ok)throw Error();
        const data=await r.json();
        for(const item of [...(data.lectures||[]),...(data.assignments||[])]) {
          const path=item.lessonFile||item.contentFile||item.assGuideFile;if(!path)continue;
          add({courseId:c.id,code:c.code,title:item.titleZh||item.title,kind:item.lessonFile?'讲义':'练习 / 实践',href:url(c.path+path),extra:item.title});
        }
      }));
      render();
      if(settled.some(r=>r.status==='rejected'))status.textContent+=' · 部分课程目录暂时未能载入';
    } catch { status.textContent='搜索暂时不可用，仍可从课程目录进入。'; results.innerHTML=`<a href="${url('#course-library')}">浏览全部课程</a>`;loading=null; }
  })();
  const open = () => { if(!dialog.open)dialog.showModal();input.focus();load(); };
  header.querySelector('button').addEventListener('click',open);
  input.addEventListener('input',render);
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  addEventListener('keydown',event=>{
    if(event.key==='/'&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target.closest('input,textarea,select,[contenteditable="true"]')){event.preventDefault();open();}
  });
})();
