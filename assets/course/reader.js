/* Optional Chinese reading profile. Existing lessons and exercises remain the source. */
(() => {
  'use strict';
  const page = document.querySelector('.page');
  if (!page) return;
  document.body.classList.add('reader');
  const courseId = location.pathname.match(/\/courses\/([^/]+)\//)?.[1] || '';
  const translations = new Map(Object.entries({
    'Work It Out':'动手推一推','Why This Works':'为什么成立','Variation':'变式','Prediction':'想一想',
    'Closed-book reconstruction':'闭卷重建','Code Prediction':'代码预测','Then / Now':'当时与现在',
    'Implementation Recap Contract':'项目复盘：阅读约定','What does it do?':'这段代码做了什么？',
    'Why must it?':'协议为什么需要这样做？','What breaks?':'如果写错，会发生什么？',
    'Framework Context':'框架提供的逻辑','YOUR CODE · Historical Implementation':'你的代码 · 历史实现',
    'YOUR CODE · Historical Modification':'你的修改 · 历史实现','Why the official problem exists：':'这组题检查什么：',
    'Common Wrong Turn：':'易错点：','Wrong assumption：':'错误假设：','Root cause：':'根本原因：',
    'Fixed invariant：':'修复后的不变量：','Then：':'当时：','Now：':'现在：',
    'MENTAL MODEL':'心智模型','30-SECOND RECALL':'30 秒回顾','COURSE MAP · REPRESENTATION FLOW':'课程地图 · 表示流',
    'Learn → Inspect → Explain':'学习 → 检查 → 解释','Depth Lab':'深度练习','Transfer Question':'迁移问题',
    'Connection':'连接','Source of truth':'一手资料','SOURCE OF TRUTH':'一手资料','Practice':'实践','Readings':'阅读',
    'ENGINEERING WORKBOOK':'工程工作簿','SOURCE / VERSION':'来源 / 版本','Official version':'官方版本',
    'Mission':'任务','Final Project':'期末项目','PROJECT':'项目','Official Sources':'官方来源',
    'Question & Hypothesis':'问题与假设','Correct Baseline':'正确基线','Controlled Experiments':'受控实验','Poster & Report':'海报与报告',
    'Before We Start':'开始前','Deep Quiz':'深度测验','FIELD TRACE':'现场推演','FIELD MEMO':'现场笔记','FIELD INDEX':'本页目录',
    'ACTIVE ORIENTATION':'主动定向','CLOSED-BOOK RECALL':'闭卷回顾','DEEP READING':'深度阅读','DERIVATION':'推导','BUILD':'构建',
    'CALIBRATION':'校准','EVIDENCE':'证据','PROBLEM':'问题','IMPLEMENTATION':'实现','PAPER READING':'论文阅读',
    'READING TARGET':'阅读目标','COVERAGE / READ THIS FIRST':'覆盖 / 先读这里','COVERAGE MATRIX':'覆盖矩阵',
    'SOURCE VAULT / NO ABRIDGEMENT':'资料库 / 完整收录','ON THIS PAGE':'本页目录',
    'Project':'项目','Lecture':'讲义','Discussion':'讨论','Assignment':'作业','Homework':'作业','Quiz':'测验','Review':'复盘','Lab':'实验',
    'Official solution':'官方解答','official solution':'官方解答','worksheet':'工作表','Worksheet':'工作表','source of truth':'一手资料',
    'CourseStack Explanation':'CourseStack 解析','CourseStack explanation':'CourseStack 解析',
    'DIAGRAM IN CONTEXT':'机制图','ACTIVE ORIENTATION':'主动定向','DEEP READING':'深度阅读',
    'Ready to test this?':'准备好检验了吗？','Course discussion':'课程讨论','Source boundary':'来源边界'
  }));
  const translate = text => {
    let value = text;
    for (const [from,to] of [...translations].sort((a,b)=>b[0].length-a[0].length)) value = value.replaceAll(from,to);
    return value.replace(/YOUR CODE\s*[·•]\s*Historical Implementation/g,'你的代码 · 历史实现').replace(/YOUR CODE\s*[·•]\s*Historical Modification/g,'你的修改 · 历史实现').replace(/Framework Context/g,'框架提供的逻辑').replace(/Historical Implementation Review/g,'历史实现审查').replace(/Hint (\d+) · Concept/g,'提示 $1 · 回想概念').replace(/Hint (\d+) · State \/ Invariant/g,'提示 $1 · 检查状态与不变量').replace(/Hint (\d+) · First Step/g,'提示 $1 · 从第一步开始').replace(/Reveal · /g,'解析 · ').replace(/Repository Audit：/g,'代码归属审计：').replace(/Execution Trace：/g,'执行推演：').replace(/Counterfactual：/g,'失败情形：').replace(/Bug Reconstruction：/g,'故障复盘：').replace(/Historical Implementation Review：/g,'历史实现审查：').replace(/Parts? (\d+(?:[–—-]\d+)?) · /g,'第 $1 部分 · ');
  };
  const headingTerms={'Explain It Yourself':'自己讲一遍','Table Trace':'表格推演','Failure trace':'失败推演','Implementation state':'实现状态','convergence trace':'收敛推演','Lifecycle / invariant':'生命周期与不变量','从代码回到 Lesson':'从代码回到讲义','Current State':'当前状态'};
  for(const [a,b] of Object.entries(headingTerms)) translations.set(a,b);
  const translateUiLabels = () => page.querySelectorAll('h2,h3,summary,dt,strong,small,td,th,.source-note,.evidence-note,.section-label,.field-callout span,.source-ribbon span,.source-ribbon strong,.source-ribbon b,.code-label,.recall-kicker,.code-kicker,.provenance-kicker,.eecs-map-kicker,.eyebrow,.guide-eyebrow,.reading-note span,.lesson-meta span,.lesson-title-en,.assignment-primary-nav a,.stage-label,.problem-kicker').forEach(node => {
    const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
    const texts=[]; while(walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(text => { if (!text.parentElement.closest('code,pre')) text.textContent=translate(text.textContent); });
  });
  translateUiLabels();
  // Course-specific scripts can add their labels after this reader profile.
  // Repeat only the narrow UI selector set, never the prose body.
  setTimeout(translateUiLabels,120);
  setTimeout(translateUiLabels,700);
  page.querySelectorAll('.prerequisite-block').forEach(block => {
    const list=block.querySelector('ul');
    if(list && !list.children.length && !list.textContent.trim()) block.remove();
  });
  const notes = { 'mental-model':'model','misconception':'misconception','misconception-analysis':'misconception','wrong-turn':'misconception','invariant':'invariant','why-this-works':'why','counterfactual':'failure','historical-note':'history','warning-note':'failure' };
  Object.entries(notes).forEach(([cls,type]) => page.querySelectorAll(`.${cls}`).forEach(node => {node.classList.add('reader-note');node.dataset.note=type;}));
  page.querySelectorAll('.code-mechanism dl').forEach(node => node.classList.add('code-annotation'));
  page.querySelectorAll('pre').forEach(pre=>{const lang=pre.dataset.language;pre.dataset.language=({python:'Python',typescript:'TypeScript',javascript:'JavaScript',plaintext:'文本 / 推演',text:'文本 / 推演',pseudocode:'伪代码',bash:'Shell'})[lang]||lang||'代码';});
  page.querySelectorAll('.work-it-out').forEach((work,index)=>{
    if(work.querySelector('textarea,input'))return;
    const label=document.createElement('label');label.className='reader-work-label';label.textContent='写下你的推演，再展开解析核对';
    const field=document.createElement('textarea');field.rows=3;field.placeholder='已知状态 → 输入事件 → 使用的规则 → 更新后的状态';field.id=`reader-work-${index}`;label.htmlFor=field.id;
    const storageKey=`coursestack.notes:${location.pathname}:${index}`;
    try{field.value=localStorage.getItem(storageKey)||'';}catch{}
    field.addEventListener('input',()=>{try{localStorage.setItem(storageKey,field.value);}catch{label.textContent='写下你的推演（当前浏览器无法保存，离开页面前请自行备份）';}});
    work.append(label,field);
  });
  const eyebrow=page.querySelector(':scope > .eyebrow');
  // CS168's packet-centric course uses a compact normalized label. Other
  // courses keep their authored eyebrow (often containing a date, instructor,
  // or source term) instead of being mislabeled as CS168.
  if(eyebrow && courseId === 'cs168'){
    const number=eyebrow.textContent.match(/(?:LECTURE|DISCUSSION|PROJECT)\s*([\dAB.]+)/i)?.[1]||'';
    const type=location.pathname.includes('discussion')?'讨论':location.pathname.includes('project')?'项目复盘':'第';
    eyebrow.textContent=`CS 168 · ${type} ${number}${type==='第'?' 讲':''}`;
  }
  // A few historical pages expose their title only inside a course-specific
  // hero (or resolve that hero asynchronously). Re-home that identity into
  // the textbook article so the reader profile never leaves a dark banner or
  // a duplicate navigation shell behind.
  const directTitle=page.querySelector(':scope > h1');
  const existingIntro=page.querySelector(':scope > .pb-studio-intro,:scope > .pb-reader-intro');
  const sourceTitle=directTitle||page.querySelector('.guide-banner h1')||document.querySelector('.lesson-hero h1,.review-hero h1,h1');
  if(!directTitle&&!existingIntro&&sourceTitle){
    const sourceEyebrow=page.querySelector('.guide-banner .guide-eyebrow')||document.querySelector('.lesson-hero .eyebrow,.review-hero > * > p:first-child');
    const sourceLede=page.querySelector('.guide-banner .guide-lede')||document.querySelector('.lesson-hero .hero-lede,.lesson-hero .lesson-secondary-summary,.lesson-hero .lede,.review-hero .review-lede');
    const intro=document.createElement('header');intro.className='pb-reader-intro';
    if(sourceEyebrow){const node=document.createElement('p');node.className='eyebrow';node.textContent=translate(sourceEyebrow.textContent.trim());intro.append(node);}
    const title=document.createElement('h1');title.textContent=sourceTitle.textContent.trim();intro.append(title);
    if(sourceLede){const node=document.createElement('p');node.className='lede';node.textContent=sourceLede.textContent.trim();intro.append(node);}
    page.prepend(intro);document.body.classList.add('pb-rebuilt-intro');
  }
  // Keep provenance available without letting a hidden legacy hero swallow it.
  // Older course templates put the source note inside the hero we deliberately
  // hide; move that compact disclosure next to the visible reader intro.
  const sourceAnchor=page.querySelector(':scope > .pb-reader-intro');
  const sources=[...page.querySelectorAll(':scope > .source-note,:scope > .warning-note,.lesson-hero .source-note,.review-hero .source-note,.guide-banner .source-note,.discussion-contract > .evidence-note')];
  sources.forEach(source=>{if(!/版本|source|来源|worksheet/i.test(source.textContent))return;const disclosure=document.createElement('details');disclosure.className='source-note reader-source-disclosure';const label=document.createElement('summary');label.textContent='来源与版本说明';const hiddenHero=source.closest('.lesson-hero,.review-hero,.guide-banner');if(hiddenHero&&sourceAnchor)sourceAnchor.after(disclosure);else source.before(disclosure);disclosure.append(label);while(source.firstChild)disclosure.append(source.firstChild);source.remove();});
  page.querySelector(':scope > nav:not([class])')?.setAttribute('hidden','');
  const headings=[...page.querySelectorAll('h2')];
  const aside=document.createElement('aside'); aside.className='reader-aside'; aside.setAttribute('aria-label','本页目录与注释');
  const details=document.createElement('details'); details.open=matchMedia('(min-width:1181px)').matches;
  matchMedia('(min-width:1181px)').addEventListener('change',event=>{details.open=event.matches;});
  const summary=document.createElement('summary'); summary.textContent='本页目录'; details.append(summary);
  const nav=document.createElement('nav');
  headings.forEach((h,i)=>{ if(!h.id) h.id=`reader-section-${i+1}`; const a=document.createElement('a');a.href=`#${h.id}`;a.dataset.index=String(i+1).padStart(2,'0');a.textContent=h.textContent;nav.append(a); });
  details.append(nav);aside.append(details);
  const model=page.querySelector('.mental-model,.invariant');
  if(model){const note=document.createElement('p');note.className='reader-note';note.textContent='推演时先确认：谁收到了什么事件，查什么表，更新什么状态，向谁发送什么。';aside.append(note);}
  // Some course-specific enhancement scripts resolve course metadata after
  // this reader script runs. When that happens there may not be a heading yet;
  // keep the aside attached to the article so it is not lost inside a detached
  // placeholder. A deferred pass also lets late-added headings appear in the
  // lightweight table of contents.
  const updateAsideActive=()=>{
    const currentHeadings=[...page.querySelectorAll('h2')];
    if(!currentHeadings.length) return;
    let current=currentHeadings[0];
    for(const heading of currentHeadings){ if(heading.getBoundingClientRect().top <= 132) current=heading; else break; }
    nav.querySelectorAll('a').forEach(link=>{
      const active=link.getAttribute('href')===`#${current.id}`;
      link.classList.toggle('is-active',active);
      if(active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    });
  };
  const placeAside=()=>{
    const intro=page.querySelector(':scope > .lede')||page.querySelector(':scope > h1')||page.querySelector(':scope > .pb-studio-intro')||page.querySelector(':scope > .pb-reader-intro');
    if(!aside.isConnected) intro?.after(aside);
    if(!aside.isConnected) page.prepend(aside);
    const current=[...page.querySelectorAll('h2')];
    current.forEach((heading,index)=>{if(!heading.id)heading.id=`reader-section-${index+1}`;});
    nav.replaceChildren(...current.map((heading,index)=>{const link=document.createElement('a');link.href=`#${heading.id}`;link.dataset.index=String(index+1).padStart(2,'0');link.textContent=heading.textContent;return link;}));
    updateAsideActive();
  };
  placeAside();
  setTimeout(placeAside,0);
  setTimeout(placeAside,250);
  setTimeout(placeAside,900);
  addEventListener('DOMContentLoaded',placeAside,{once:true});
  addEventListener('scroll',updateAsideActive,{passive:true});
  addEventListener('resize',updateAsideActive);
  // Record visits, never infer learner completion from authoring status.json.
  const key='coursestack.learning.v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{return {};}};
  const save=value=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
  const state=read(); const course=state[courseId]||{completed:[]};
  course.last={path:location.pathname,title:page.querySelector('h1')?.textContent||document.title,at:Date.now()};
  state[courseId]=course;save(state);
  const footer=document.createElement('section');footer.className='reader-completion';
  const button=document.createElement('button');button.type='button';button.className='reader-button';
  const isDone=()=>Array.isArray(read()[courseId]?.completed)&&read()[courseId].completed.includes(location.pathname);
  const update=()=>{button.textContent=isDone()?'已学完 · 点击撤销':'标记本页已学完';button.setAttribute('aria-pressed',String(isDone()));};update();
  const hint=document.createElement('p');hint.className='muted';hint.textContent='学习记录保存在当前浏览器；完成状态由你确认。';
  button.onclick=()=>{const data=read();const item=data[courseId]||{last:course.last,completed:[]};const set=new Set(item.completed||[]);set.has(location.pathname)?set.delete(location.pathname):set.add(location.pathname);item.completed=[...set];data[courseId]=item;if(!save(data))hint.textContent='浏览器暂时无法保存记录，仍可正常阅读。';update();};
  footer.append(button,hint);page.append(footer);
})();
