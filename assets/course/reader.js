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
    'Ready to test this?':'准备好检验了吗？','Course discussion':'课程讨论','Source boundary':'来源边界',
    'OBJECTS':'对象','TOY EXAMPLE':'最小例子','TOY TRACE':'最小推演','MECHANISM':'机制','WHY NOT?':'另一种做法为什么不行？',
    'Objects':'对象','Toy example':'最小例子','Toy trace':'最小推演','Mechanism':'机制','Why not?':'另一种做法为什么不行？',
    'Mental Model / Key Result':'心智模型 / 关键结论','Mental Model':'心智模型'
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
  const translateReasoningLabels=()=>{
    page.querySelectorAll('.reasoning-label,.lesson-build-kicker,.concept-lab-eyebrow').forEach(node=>{const translated=translate(node.textContent);if(translated!==node.textContent)node.textContent=translated;});
    page.querySelectorAll('[data-block-label]').forEach(node=>{node.dataset.blockLabel=translate(node.dataset.blockLabel);});
  };
  translateReasoningLabels();setTimeout(translateReasoningLabels,1000);
  if(courseId==='6.102')page.querySelector('.source-switch a[aria-current="page"]')?.setAttribute('href',location.pathname);
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
  page.querySelectorAll('pre').forEach(pre=>{const lang=pre.dataset.language;pre.dataset.language=({python:'Python',py:'Python',ts:'TypeScript',typescript:'TypeScript',js:'JavaScript',javascript:'JavaScript',cpp:'C++',c:'C',rust:'Rust',go:'Go',json:'JSON',plaintext:'文本 / 推演',text:'文本 / 推演',pseudocode:'伪代码',bash:'Shell'})[lang]||lang||'代码';});
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
  const outlineHeadings=()=>[...page.querySelectorAll('h2')].filter(h=>!h.closest('.reader-note,.quiz,details,.reader-completion,.reader-aside,.reader-marginalia'));
  const headings=outlineHeadings();
  const aside=document.createElement('aside'); aside.className='reader-aside'; aside.setAttribute('aria-label','本页目录与注释');
  const details=document.createElement('details'); details.open=matchMedia('(min-width:901px)').matches;
  matchMedia('(min-width:901px)').addEventListener('change',event=>{details.open=event.matches;});
  const summary=document.createElement('summary'); summary.textContent='本页目录'; details.append(summary);
  const nav=document.createElement('nav');
  headings.forEach((h,i)=>{ if(!h.id) h.id=`reader-section-${i+1}`; const a=document.createElement('a');a.href=`#${h.id}`;a.dataset.index=String(i+1).padStart(2,'0');a.textContent=h.textContent;nav.append(a); });
  details.append(nav);aside.append(details);
  // The right column contains evidence from THIS page, never generic networking
  // copy on a math/ML lesson. Keep the authored block in place for mobile reading.
  const marginalia=document.createElement('aside');marginalia.className='reader-marginalia';marginalia.setAttribute('aria-label','阅读注释');
  const noteTypes=[['model','心智模型','brain','.mental-model,.math-reasoning__mental,.learning-map,.mental-model-callout,.recall,.card.idea,blockquote'],['invariant','不变量','circle-check','.invariant,.invariant-box'],['misconception','易错点','alert-triangle','.misconception,.misconception-analysis,.wrong-turn,.pitfall,.card.warning'],['history','历史说明','history','.historical-note,.evidence-note,.source-note,.source-switch'],['practice','想一想','bulb','.quiz,.review-sanity']];
  const clean=node=>{const clone=node.cloneNode(true);clone.querySelectorAll('.katex-mathml,script,button,textarea,summary').forEach(n=>n.remove());return clone.textContent.replace(/\s+/g,' ').trim();};
  const populateNotes=()=>{
    marginalia.replaceChildren();
    for(const [type,label,icon,selector] of noteTypes){
      if(marginalia.children.length===4)break;
      let source=(type==='model'?page.querySelector('.mental-model,.math-reasoning__mental'):null)||page.querySelector(selector);
      if(!source){const pattern=({model:/心智模型|知识地图/,invariant:/不变量|表示不变式/,misconception:/误区|易错|常见错误/,history:/历史实现|历史说明/})[type];const title=pattern&&[...page.querySelectorAll('h2,h3,strong')].find(h=>pattern.test(h.textContent));if(title)source=/^H[23]$/.test(title.tagName)?title.nextElementSibling:title.parentElement;}
      if(!source||source.closest('.reader-marginalia'))continue;
      const textNode=[...source.querySelectorAll('p:not(.eyebrow):not(.code-label),li')].find(node=>clean(node).length>=12)||source;
      // A table is structured evidence, not a sentence. Never flatten its
      // headers and cells into an unreadable marginal "invariant".
      if(textNode.matches('table,pre')||textNode.querySelector('table,pre'))continue;
      let text=clean(textNode).replace(/^(?:心智模型|不变量|易错点)\s*[:：]?\s*/,'');if(text.length<12)continue;
      if(text.length>120){const sentence=text.slice(0,120).match(/^[\s\S]*[。；！？]/)?.[0];text=(sentence?.length>30?sentence:text.slice(0,110)+'…');}
      if(!source.id)source.id=`reader-note-${type}`;
      const note=document.createElement('section');note.className='reader-margin-note';note.dataset.note=type;
      let noteLabel=label;
      if(source.matches('.card.idea,blockquote'))noteLabel=source.querySelector('h3')?.textContent.replace(/^\d+[.、]\s*/,'')||'概念速记';
      if(source.matches('.card.warning'))noteLabel=source.querySelector('h3')?.textContent||'需要留意';
      if(type==='history'&&!source.matches('.historical-note')&&!/历史实现|历史说明/.test(source.textContent))noteLabel='来源说明';
      const head=document.createElement('h2');const img=document.createElement('img');img.src=new URL(`../vendor/tabler/${icon}.svg`,new URL('assets/course/',location.origin));img.alt='';img.width=18;img.height=18;head.append(img,noteLabel);
      const p=document.createElement('p');
      if(textNode.querySelector('.katex')&&clean(textNode).length<200){p.innerHTML=textNode.innerHTML;p.querySelectorAll('script,button,textarea').forEach(n=>n.remove());}
      else p.textContent=text;
      const a=document.createElement('a');a.href=`#${source.id}`;a.textContent='在正文中查看';a.addEventListener('click',()=>{let n=source;while(n&&n!==page){if(n.tagName==='DETAILS')n.open=true;n=n.parentElement;}});
      note.append(head,p,a);marginalia.append(note);
    }
    if(marginalia.children.length&&!marginalia.isConnected)page.append(marginalia);
  };
  // Some course-specific enhancement scripts resolve course metadata after
  // this reader script runs. When that happens there may not be a heading yet;
  // keep the aside attached to the article so it is not lost inside a detached
  // placeholder. A deferred pass also lets late-added headings appear in the
  // lightweight table of contents.
  const updateAsideActive=()=>{
    const currentHeadings=outlineHeadings();
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
    const current=outlineHeadings();
    current.forEach((heading,index)=>{if(!heading.id)heading.id=`reader-section-${index+1}`;});
    nav.replaceChildren(...current.map((heading,index)=>{const link=document.createElement('a');link.href=`#${heading.id}`;link.dataset.index=String(index+1).padStart(2,'0');link.textContent=clean(heading);return link;}));
    updateAsideActive();
    populateNotes();
  };
  placeAside();
  const asideFooter=document.createElement('footer');asideFooter.className='reader-outline-footer';
  const courseLink=document.createElement('a');courseLink.href=`/courses/${courseId}/`;courseLink.textContent='返回课程地图';asideFooter.append(courseLink);
  const exercise=page.querySelector('[data-interactive-src],.guided-problem,.quiz,.math-reasoning__check');
  if(exercise){if(!exercise.id)exercise.id='reader-first-exercise';const link=document.createElement('a');link.href=`#${exercise.id}`;link.textContent='进入推演与练习';asideFooter.append(link);}
  const sourceLink=[...page.querySelectorAll('a[href]')].find(a=>/\.pdf(?:$|[?#])/i.test(a.href));
  if(sourceLink){const link=document.createElement('a');link.href=sourceLink.href;link.textContent='原始讲义 / 工作表';asideFooter.append(link);}
  aside.append(asideFooter);
  setTimeout(placeAside,0);
  setTimeout(placeAside,250);
  setTimeout(placeAside,900);
  // Course-specific lessons can arrive after their data bank resolves. Observe
  // substantive sections, not text/KaTeX/our own sidebars, to avoid feedback loops.
  let refreshTimer;
  new MutationObserver(records=>{
    const changed=records.some(record=>!record.target.closest?.('.reader-aside,.reader-marginalia')&&[...record.addedNodes].some(node=>node.nodeType===1&&(node.matches('section,article,main,.lesson-shell')||node.querySelector('h2,.mental-model'))));
    if(!changed)return;
    clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{
      translateUiLabels();
      translateReasoningLabels();
      Object.entries(notes).forEach(([cls,type])=>page.querySelectorAll(`.${cls}`).forEach(node=>{node.classList.add('reader-note');node.dataset.note=type;}));
      placeAside();
    },100);
  }).observe(page,{childList:true,subtree:true});
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
