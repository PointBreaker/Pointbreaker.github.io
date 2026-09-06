// Static course homes: one reference composition, distinct curricula, real links.
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('courses.json','utf8')).courses;
const version='20260906r1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>`<img src="../../assets/vendor/tabler/${n}.svg" alt="" width="20" height="20">`;
// Bounds follow the existing lecture numbering (including 6b and 25b), not dates.
const phases={
 'cs168':[['互联网地基',4,'数据包怎样穿过不同网络？'],['路由',10,'局部消息怎样决定全网路径？'],['传输',14,'丢包与拥塞下怎样可靠传送？'],['应用与端到端',18,'一次请求需要哪些协议协作？'],['数据中心',22,'大量主机怎样高效协作？'],['集合通信',24,'集体通信怎样映射到拓扑？'],['无线与移动',26,'共享信道与移动改变了什么？']],
 'cs336':[['模型与表示',4,'文本怎样变成可训练的张量？'],['训练系统',8,'计算、内存与通信怎样协作？'],['效率与规模',12,'有限算力应该花在哪里？'],['数据与对齐',16,'训练信号怎样塑造模型行为？'],['多模态与前沿',19,'语言模型的边界怎样扩展？']],
 'eecs498':[['梯度与优化',3,'一个可微函数怎样学会预测？'],['视觉表示',6,'空间结构怎样写进模型？'],['序列与注意力',9,'模型怎样使用上下文？'],['生成与迁移',14,'表示怎样用于新的任务？']],
 'cs267':[['机器与局部性',3,'数据移动为何比计算更贵？'],['并行编程',11,'线程、进程与 GPU 怎样协作？'],['学习系统',14,'如何调度大规模学习任务？'],['数值算法',20,'矩阵与网格怎样分解？'],['图与负载均衡',26,'不规则任务怎样高效运行？']],
 '6.1810':[['内核入口',4,'一次系统调用如何进入内核？'],['地址空间',10,'虚拟地址怎样隔离与共享？'],['并发与设备',16,'并发事件怎样安全地交织？'],['持久化',19,'崩溃之后还剩下什么？'],['隔离与扩展',23,'如何跨核扩展并守住边界？']],
 'cs152':[['机器与流水线',5,'一条指令如何在机器里前进？'],['存储与地址',10,'层次结构怎样隐藏延迟？'],['指令级并行',16,'怎样在乱序中保持顺序语义？'],['数据级并行',20,'向量与 GPU 怎样提高吞吐？'],['多核与互连',26,'多个核心怎样共享一个世界？']],
 '18-01-single-variable-calculus':[['导数与极限',8,'局部变化率如何定义？'],['微分的应用',17,'怎样用局部信息推断函数？'],['积分与累积',24,'无穷多个微小量怎样求和？'],['积分技巧',33,'如何改写一个难算的积分？'],['极限与级数',38,'无穷过程何时有确定结果？']],
 '18-06-linear-algebra':[['方程与消元',5,'方程组背后是什么几何？'],['空间与基',12,'解空间怎样被少量向量刻画？'],['正交与投影',16,'没有精确解时怎样逼近？'],['行列式与谱',24,'变换怎样缩放空间与方向？'],['分解与应用',34,'换一个基能看见什么结构？']],
 '18-02-multivariable-calculus':[['向量与空间',7,'如何描述空间中的运动？'],['多变量微分',15,'多个方向怎样共同影响变化？'],['积分与向量场',24,'局部变化怎样沿区域累积？'],['空间积分',29,'曲面与体积如何相互联系？'],['旋度与统一',36,'局部与边界怎样相互决定？']],
 'cs70':[['逻辑与证明',4,'直觉怎样变成可检查的证明？'],['代数与计算',7,'有限结构有哪些表达能力？'],['计数与概率',10,'怎样定义并计算不确定性？'],['随机变量与极限',14,'大量随机事件有哪些规律？']],
 'cs170':[['算法与分治',3,'怎样把问题拆成可计算的部分？'],['图与贪心',6,'局部选择何时保证全局正确？'],['状态与优化',8,'怎样表示并优化可行解？'],['复杂性边界',10,'哪些问题无法期待高效精确解？']],
 '6.5840':[['执行与存储',3,'跨机器执行与持久化有何不同？'],['共识与复制',10,'故障下怎样共享一致状态？'],['事务与验证',15,'怎样让多步操作表现为一步？'],['规模与信任',21,'规模增长与恶意节点改变什么？']],
 '6.102':[['规格与测试',5,'怎样描述并检查正确的软件？'],['抽象与表示',9,'如何隔离变化并保护不变量？'],['组合与语言',13,'怎样把小部件组合成可理解的系统？'],['并发与事件',19,'事件交织时怎样保持正确性？']]
};
const school=n=>({'Stanford University':'斯坦福大学','UC Berkeley':'加州大学伯克利分校','University of California, Berkeley':'加州大学伯克利分校','University of Michigan':'密歇根大学','MIT':'麻省理工学院','Massachusetts Institute of Technology':'麻省理工学院'})[n]||n;
const term=t=>String(t||'').replace(/Spring (\d+)/,'$1 年春季').replace(/Fall (\d+)/,'$1 年秋季').replace(/Code archive · /,'历史代码 · ');
const pathOf=i=>i.lessonFile||i.contentFile||i.assGuideFile;
for(const c of catalog){
 const dir=`courses/${c.id}`,info=JSON.parse(fs.readFileSync(`${dir}/course-info.json`,'utf8')),status=JSON.parse(fs.readFileSync(`${dir}/api/status.json`,'utf8'));
 const lectures=status.lectures||[],work=(status.assignments||[]).filter(pathOf);
 const old=fs.readFileSync(`${dir}/index.html`,'utf8');
 const oldIds=[...old.matchAll(/\sid="([^"\s]+)"/g)].map(m=>m[1]);
 let last=0;
 const groups=phases[c.id].map(([name,end,question],index)=>{const items=lectures.filter(l=>parseFloat(l.number)>last&&parseFloat(l.number)<=end);last=end;return {name,question,items,id:`phase-${items[0]?.number||index+1}`,index};});
 const isDiscussion=item=>/discussion|worksheet|recitation|tutorial/i.test([pathOf(item),item.kind,item.title].join(' '));
 const discussions=work.filter(isDiscussion),projects=work.filter(w=>!isDiscussion(w));
 const title=c.id==='cs168'?'互联网导论':c.id==='eecs498'?'重新理解深度学习':info.titleZh||c.titleZh;
 const heroArt=c.id==='cs168'?['network-globe.png',1254,1254]:['system-layers.png',1448,1086];
 const modes=[['book','学习','读讲义，理解原理与机制。',info.learningSteps?.[0]?.description||'从规格、例子与测试开始，建立可检查的理解。','查看讲义','#lectures'],['bulb','思考',discussions.length?'做讨论题，自己推一遍。':'做推演与自测，检验理解。',info.learningSteps?.[1]?.description||'先做预测，再沿状态、不变量与事件逐步验证。',discussions.length?'查看讨论':'进入推演',discussions.length?'#discussions':`${pathOf(lectures[0])}#${c.id==='6.102'?'checks':''}`],['cube','实践',c.id==='eecs498'||c.id==='cs168'?'用项目与历史代码复盘机制。':'用工作簿与实验验证方法。',info.learningSteps?.[2]?.description||'用失败情形和边界测试，检验代码中的设计选择。','查看实践','#projects']];
 // Unknown fragment IDs must never be invented for course-specific lessons.
 if(!discussions.length)modes[1][5]=pathOf(lectures[0]);
 const rows=items=>`<ol class="cs-lesson-list">${items.map(item=>`<li class="cs-lesson-row" data-kind="${item.lessonFile?'lecture':'work'}" data-path="${esc(pathOf(item))}"><a class="cs-lesson-link" href="${esc(pathOf(item))}"><span class="cs-lesson-number">${esc(String(item.number).padStart(2,'0'))}</span><span class="cs-lesson-name">${esc(item.titleZh||item.title)}</span><span class="cs-lesson-status">${item.lessonFile?'讲义':'工作簿'}</span></a>${c.id==='6.102'&&item.lessonFile?`<a class="cs-official-reading" href="https://web.mit.edu/6.102/www/sp26/classes/${pathOf(item).split('/').pop().replace('.html','').replace('05-designing-specifications','05-designing-specs')}/" target="_blank" rel="noreferrer">MIT 原文 ↗</a>`:''}</li>`).join('')}</ol>`;
 let html=`<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="description" content="${esc(info.summary||c.summary)}"><title>${esc(c.code)} · ${esc(title)} — CourseStack</title><link rel="icon" href="../../favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../../assets/course/platform.css?v=${version}"><script defer src="../../assets/course/platform.js?v=${version}"></script><script defer src="../../assets/course/course-home.js?v=${version}"></script></head>
<body class="cs-platform" data-course="${c.id}"><a class="skip-link" href="#lectures">跳到课程内容</a><main class="cs-course" id="reader-course">
<section class="cs-course-hero"><div><p class="cs-breadcrumb"><a href="../../#course-library">全部课程</a><span>/</span>${esc(c.code)}</p><h1><span>${esc(c.code)}：</span>${esc(title)}</h1><p class="cs-description">${esc(info.summary||c.summary)}</p>${info.coreQuestion?`<p class="cs-course-question">${esc(info.coreQuestion)}</p>`:''}</div><div class="cs-art ${c.id==='cs168'?'globe':'layers'}" aria-hidden="true"><img src="../../assets/illustrations/${heroArt[0]}" alt="" width="${heroArt[1]}" height="${heroArt[2]}"></div></section>
<div class="cs-course-meta"><span>${icon('school')}${esc(school(info.university||info.institution||c.university))}</span>${info.instructors?.length?`<span>${icon('user')}${esc(info.instructors.join('、'))}</span>`:''}<span>${icon('calendar')}${esc(term(info.term||c.term))}</span><span>${icon('book')}${lectures.length} 讲</span><a href="${esc(info.sourceUrl||info.officialCourseUrl||info.homepage||'#sources')}">官方课程 ↗</a></div>
<div class="cs-study-overview"><section class="cs-resume reader-resume"><div class="cs-play">${icon('player-play')}</div><div><p class="cs-resume-kicker" data-resume-label>从这里开始</p><h2 data-resume-title>${esc(lectures[0].titleZh||lectures[0].title)}</h2><progress max="${lectures.length}" value="0" aria-label="已完成讲义"></progress><small data-progress-label>已完成 0 / ${lectures.length} 讲 · 记录保存在当前浏览器</small></div><a class="cs-button" data-resume-link href="${esc(pathOf(lectures[0]))}">开始学习 ${icon('arrow-right')}</a></section><section class="cs-progress-panel"><h2>学习进度</h2><div class="cs-progress-body"><div class="cs-progress-ring"><div><strong data-progress-fraction>0 / ${lectures.length}</strong><small>讲义已完成</small></div></div><p>已完成 <b data-work-done>0</b> / ${work.length} 份实践<br><span>由你确认，不自动标记</span></p></div></section></div>
<section class="cs-phase-section"><h2>课程地图</h2><ol class="cs-phase-map" style="--phases:${groups.length}">${groups.map(g=>`<li data-phase-paths="${esc(g.items.map(pathOf).join('|'))}"${g.index===0?' class="is-current"':''}><a href="#${g.id}"><span class="cs-phase-dot">${g.index+1}</span><strong>${g.name}</strong><small>第 ${g.items[0]?.number}–${g.items.at(-1)?.number} 讲</small><p>${g.question}</p></a></li>`).join('')}</ol></section>
<section class="cs-modes" id="learning-methods"><h2>三种学习方式</h2><div class="cs-mode-grid">${modes.map(([i,name,lead,copy,label,href])=>`<article class="cs-mode"><h3>${icon(i)}${name}</h3><p>${lead}<br>${esc(copy)}</p><a href="${href}">${label} ${icon('arrow-right')}</a></article>`).join('')}</div></section>
<section class="cs-curriculum" id="lectures"><div class="cs-curriculum-heading"><h2>课程讲义</h2><label><span class="visually-hidden">查找本课程内容</span><input class="cs-course-search" id="reader-search" type="search" placeholder="搜索课次、主题或实践"></label></div><p class="cs-search-count" id="reader-results" role="status"></p>${groups.map(g=>`<section class="cs-course-group" id="${g.id}"><span class="cs-anchor" id="stage-${g.index+1}"></span><header class="cs-group-heading"><h3>${g.name}</h3><p>${g.question}</p></header>${rows(g.items)}</section>`).join('')}</section>
<section class="cs-course-group" id="discussions"><header class="cs-group-heading"><h3>思考 · ${discussions.length?'讨论工作簿':'推演与自测'}</h3><p>${discussions.length?'先预测，再动手推，最后对照解析。':'推演与概念检查已编排在各讲中。'}</p></header>${discussions.length?rows(discussions):`<p><a href="${esc(pathOf(lectures[0]))}">从第一讲的练习开始 →</a></p>`}</section>
<section class="cs-course-group" id="projects"><header class="cs-group-heading"><h3>实践 · ${c.id==='cs168'?'项目与实现复盘':c.id==='eecs498'?'历史代码复盘':'工作簿与实验'}</h3><p>把理解落到可检查的推导、测试与实现证据。</p></header>${rows(projects)}</section>
<details class="cs-source-footer" id="sources"><summary>参考资料与版本说明</summary><p>${esc(info.sourceStatus||info.sourceLabel||`${info.sourceUrl||info.homepage||c.university} · 课程内容依据现有一手资料整理。`)}</p>${c.id==='6.102'?'<p>原文与精读，明确分层。本站提供 CourseStack 独立中文精读；每章直达 MIT 官方原文。个人离线镜像不重新公开发布。</p>':''}${['cs168','eecs498'].includes(c.id)?'<p>历史个人实现是学习与复盘的证据，不是当前学期的官方答案；当前要求以官方资料为准。</p>':''}</details>
<footer class="cs-course-footer"><span>CourseStack · 学习原理，手推机制，实践验证</span><a href="../../#course-library">浏览其他课程</a></footer></main></body></html>`;
 const used=new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]));
 const aliases=[...new Set([...oldIds,'learning-path','course-content','workbooks','labs','assignments','homework','exams','review-map'])].filter(id=>!used.has(id));
 // Historical bookmarks stay live, landing at the curriculum rather than dead IDs.
 html=html.replace('<section class="cs-curriculum"',aliases.map(id=>`<span class="cs-anchor" id="${esc(id)}"></span>`).join('')+'<section class="cs-curriculum"');
 if(process.argv.includes('--check')){if(old.trimEnd()!==html.trimEnd()){console.error(`Stale course home: ${dir}`);process.exitCode=1;}}
 else fs.writeFileSync(`${dir}/index.html`,html+'\n');
}
console.log(`COURSE_HOMES ${catalog.length}`);
