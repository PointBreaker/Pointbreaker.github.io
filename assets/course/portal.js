(() => {
  'use strict';
  const root=document.querySelector('#reader-course'); if(!root)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const phases=[['互联网地基',1,4,'数据包如何穿过不同的网络？'],['路由',5,10,'局部消息如何决定全网路径？'],['传输',11,14,'丢包与拥塞下如何可靠传送？'],['应用与端到端',15,18,'一次请求需要哪些协议协作？'],['数据中心',19,22,'大量主机如何高效协作？'],['集合通信',23,24,'一对多与集体通信如何组织？'],['无线与移动',25,26,'共享信道与移动如何改变通信？']];
  Promise.all([fetch('course-info.json').then(r=>r.json()),fetch('api/status.json').then(r=>r.json())]).then(([info,status])=>{
    let history={};try{history=JSON.parse(localStorage.getItem('coursestack.learning.v1')||'{}')[info.id]||{};}catch{}
    const lectures=status.lectures||[],work=info.assignments||status.assignments||[];
    const localPath=item=>item.lessonFile||item.assGuideFile||item.contentFile||'';
    const allPaths=new Set([...lectures,...work].map(item=>new URL(localPath(item),location.href).pathname));
    const last=history.last&&allPaths.has(history.last.path)?history.last:null;
    const completed=new Set(history.completed||[]);
    const done=lectures.filter(item=>completed.has(new URL(localPath(item),location.href).pathname)).length;
    const start=last?.path||localPath(lectures[0]);
    const rows=items=>`<ul class="reader-list">${items.map(item=>`<li><a href="${esc(localPath(item))}">${esc(item.number||'')} · ${esc(item.titleZh||item.title)}</a><small>${completed.has(new URL(localPath(item),location.href).pathname)?'已学完':'可阅读'}</small></li>`).join('')}</ul>`;
    root.innerHTML=`<p class="muted"><a href="../../">全部课程</a> / CS 168</p><h1>CS 168：互联网导论</h1><p class="reader-lede">一个数据包如何从应用出发，经过一系列局部决策抵达远端？没有中央控制的互联网，又如何保持互联？</p><p class="muted">加州大学伯克利分校 · 2026 年秋季 · ${lectures.length} 讲<br>教师：${esc(info.instructors.join('、'))} · <a href="${esc(info.sourceUrl)}">官方课程</a></p>
    <section class="reader-resume"><div><h2>${last?'继续学习':'从这里开始'}</h2><p>${esc(last?.title||lectures[0].titleZh||lectures[0].title)}</p><progress value="${done}" max="${lectures.length}" aria-label="已完成讲义"></progress><small>已完成 ${done} / ${lectures.length} 讲 · 记录保存在当前浏览器</small></div><a class="reader-button" href="${esc(start)}">${last?'继续学习':'开始学习'}</a></section>
    <h2>课程地图</h2><ol class="reader-map">${phases.map(([name,a,b,q])=>`<li><a href="#phase-${a}">${name}</a><small>第 ${a}–${b} 讲</small><small>${q}</small></li>`).join('')}</ol>
    <h2>三种学习方式</h2><div class="reader-methods"><article><h3>学习</h3><p>读讲义，理解问题、机制与不变量。沿着数据包建立完整的网络模型。</p><a href="#lectures">查看讲义</a></article><article><h3>思考</h3><p>做讨论题，手推状态与路由表。先预测，再用提示和解析检查推理。</p><a href="#discussions">查看讨论</a></article><article><h3>实践</h3><p>用项目与历史实现复盘，把协议机制连接到代码中的判断与状态。</p><a href="#projects">查看项目</a></article></div>
    <section id="lectures"><h2>课程讲义</h2><label>查找本课程内容 <input class="reader-search" id="reader-search" type="search" placeholder="搜索课次、协议或项目"></label><p id="reader-results" class="muted" aria-live="polite"></p>${phases.map(([name,a,b,q])=>`<section id="phase-${a}" class="reader-group"><h3>${name} <small>第 ${a}–${b} 讲</small></h3><p class="muted">${q}</p>${rows(lectures.filter(l=>l.number>=a&&l.number<=b))}</section>`).join('')}</section>
    <section id="discussions" class="reader-group"><h2>思考 · 讨论工作簿</h2>${rows(work.filter(w=>/discussion/i.test(localPath(w))))}</section><section id="projects" class="reader-group"><h2>实践 · 项目与实现复盘</h2>${rows(work.filter(w=>/project/i.test(localPath(w))))}</section>
    <details><summary>参考资料与版本说明</summary><p>${esc(info.sourceStatus)}</p><p>历史个人实现用于学习与复盘。当前项目要求以官方说明为准。</p><a href="${esc(info.sourceUrl)}">查看官方课程与资料</a></details>`;
    if(location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    document.querySelector('#reader-search').addEventListener('input',event=>{const query=event.target.value.toLowerCase().trim();let count=0;root.querySelectorAll('.reader-list li').forEach(li=>{li.hidden=!li.textContent.toLowerCase().includes(query);if(!li.hidden)count++;});root.querySelectorAll('.reader-group').forEach(group=>group.hidden=![...group.querySelectorAll('li')].some(li=>!li.hidden));document.querySelector('#reader-results').textContent=query?`找到 ${count} 项内容`:'';});
  }).catch(()=>{root.insertAdjacentHTML('beforeend','<p>课程数据暂时无法载入。请刷新重试，或直接<a href="lessons/0001-architecture-and-protocols.html">开始第一讲</a>。</p>');});
})();
