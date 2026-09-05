/* Optional Chinese reading profile. Existing lessons and exercises remain the source. */
(() => {
  'use strict';
  const page = document.querySelector('.page');
  if (!page) return;
  document.body.classList.add('reader');
  const translations = new Map(Object.entries({
    'Work It Out':'动手推一推','Why This Works':'为什么成立','Variation':'变式','Prediction':'想一想',
    'Closed-book reconstruction':'闭卷重建','Code Prediction':'代码预测','Then / Now':'当时与现在',
    'Implementation Recap Contract':'项目复盘：阅读约定','What does it do?':'这段代码做了什么？',
    'Why must it?':'协议为什么需要这样做？','What breaks?':'如果写错，会发生什么？',
    'Framework Context':'框架提供的逻辑','YOUR CODE · Historical Implementation':'你的代码 · 历史实现',
    'YOUR CODE · Historical Modification':'你的修改 · 历史实现','Why the official problem exists：':'这组题检查什么：',
    'Common Wrong Turn：':'易错点：','Wrong assumption：':'错误假设：','Root cause：':'根本原因：',
    'Fixed invariant：':'修复后的不变量：','Then：':'当时：','Now：':'现在：'
  }));
  const translate = text => {
    let value = text;
    for (const [from,to] of [...translations].sort((a,b)=>b[0].length-a[0].length)) value = value.replaceAll(from,to);
    return value.replace(/Hint (\d+) · Concept/g,'提示 $1 · 回想概念').replace(/Hint (\d+) · State \/ Invariant/g,'提示 $1 · 检查状态与不变量').replace(/Hint (\d+) · First Step/g,'提示 $1 · 从第一步开始').replace(/Reveal · /g,'解析 · ').replace(/Repository Audit：/g,'代码归属审计：').replace(/Execution Trace：/g,'执行推演：').replace(/Counterfactual：/g,'失败情形：').replace(/Bug Reconstruction：/g,'故障复盘：').replace(/Historical Implementation Review：/g,'历史实现审查：').replace(/Parts? (\d+(?:[–—-]\d+)?) · /g,'第 $1 部分 · ');
  };
  const headingTerms={'Explain It Yourself':'自己讲一遍','Table Trace':'表格推演','Failure trace':'失败推演','Implementation state':'实现状态','convergence trace':'收敛推演','Lifecycle / invariant':'生命周期与不变量','从代码回到 Lesson':'从代码回到讲义','Current State':'当前状态'};
  for(const [a,b] of Object.entries(headingTerms)) translations.set(a,b);
  page.querySelectorAll('h2,h3,summary,dt,strong,.code-label,.eyebrow').forEach(node => {
    const walker = document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
    const texts=[]; while(walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(text => { if (!text.parentElement.closest('code,pre')) text.textContent=translate(text.textContent); });
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
  if(eyebrow){const number=eyebrow.textContent.match(/(?:LECTURE|DISCUSSION|PROJECT)\s*([\dAB.]+)/i)?.[1]||'';const type=location.pathname.includes('discussion')?'讨论':location.pathname.includes('project')?'项目复盘':'第';eyebrow.textContent=`CS 168 · ${type} ${number}${type==='第'?' 讲':''}`;}
  const sources=[...page.querySelectorAll(':scope > .source-note,:scope > .warning-note, .discussion-contract > .evidence-note')];
  sources.forEach(source=>{if(!/版本|source|来源|worksheet/i.test(source.textContent))return;const disclosure=document.createElement('details');disclosure.className='source-note';const label=document.createElement('summary');label.textContent='来源与版本说明';source.before(disclosure);disclosure.append(label);while(source.firstChild)disclosure.append(source.firstChild);source.remove();});
  page.querySelector(':scope > nav:not([class])')?.setAttribute('hidden','');
  const headings=[...page.querySelectorAll('h2')];
  const aside=document.createElement('aside'); aside.className='reader-aside'; aside.setAttribute('aria-label','本页目录与注释');
  const details=document.createElement('details'); details.open=matchMedia('(min-width:1101px)').matches;
  matchMedia('(min-width:1101px)').addEventListener('change',event=>{details.open=event.matches;});
  const summary=document.createElement('summary'); summary.textContent='本页目录'; details.append(summary);
  const nav=document.createElement('nav');
  headings.forEach((h,i)=>{ if(!h.id) h.id=`reader-section-${i+1}`; const a=document.createElement('a');a.href=`#${h.id}`;a.textContent=h.textContent;nav.append(a); });
  details.append(nav);aside.append(details);
  const model=page.querySelector('.mental-model,.invariant');
  if(model){const note=document.createElement('p');note.className='reader-note';note.textContent='推演时先确认：谁收到了什么事件，查什么表，更新什么状态，向谁发送什么。';aside.append(note);}
  const intro=page.querySelector(':scope > .lede')||page.querySelector('h1');intro?.after(aside);
  // Record visits, never infer learner completion from authoring status.json.
  const key='coursestack.learning.v1';
  const courseId=location.pathname.match(/\/courses\/([^/]+)\//)?.[1];
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
