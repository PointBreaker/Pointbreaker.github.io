import fs from 'node:fs';
import assert from 'node:assert/strict';
const sid=process.argv[2],base=`${process.env.COURSESTACK_WEBDRIVER||'http://127.0.0.1:4444'}/session/${sid}`;
const out='.course-build/reference';
async function c(p,d){const r=await(await fetch(base+p,d?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}:{})).json();if(r.value?.error)throw Error(JSON.stringify(r.value));return r.value;}
const js=script=>c('/execute/sync',{script,args:[]});
const visit=async path=>{await c('/url',{url:'http://127.0.0.1:4173'+path});await new Promise(r=>setTimeout(r,1100));};
async function click(selector){await js(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);const el=await c('/element',{using:'css selector',value:selector});await c(`/element/${el['element-6066-11e4-a52e-4f735466cecf']}/click`,{});}
const checks=[];
await c('/window/rect',{width:1440,height:1280});
await visit('/');
await click('.cs-search-trigger');assert.equal(await js('return document.querySelector("dialog").open'),true);
await js('let s=document.querySelector("#cs-search-input");s.value="TCP";s.dispatchEvent(new Event("input"))');
for(let i=0;i<30;i++){if(await js('return document.querySelector(".cs-search-results").textContent.includes("可靠")'))break;await new Promise(r=>setTimeout(r,150));}
assert.match(await js('return document.querySelector(".cs-search-results").textContent'),/TCP|可靠/);checks.push('全站搜索：课程、讲义、练习真实索引');
await click('.cs-search-top button');assert.equal(await js('return document.querySelector("dialog").open'),false);
await click('[data-topic="computer-networks"]');assert.equal(await js('return document.querySelectorAll(".course-card").length'),1);checks.push('主题入口筛选课程');
await visit('/courses/cs168/');assert.match(await js('return document.querySelector("[data-progress-label]").textContent'),/0 \/ 26/);
await js('const s=document.querySelector("#reader-search");s.value="ZZZ-no-match";s.dispatchEvent(new Event("input"))');assert.match(await js('return document.querySelector("#reader-results").textContent'),/找到 0/);checks.push('课程内搜索与空状态');
const discussion='/courses/cs168/lessons/assignments/ass03-discussion-03-routing-i.html';
await visit(discussion);
await click('.progressive-hints summary');assert.equal(await js('return document.querySelector(".progressive-hints details").open'),true);
await click('details.reveal summary');assert.equal(await js('return document.querySelector("details.reveal").open'),true);checks.push('渐进提示与解析');
await click('.quiz-options button');assert.equal(await js('return document.querySelector(".quiz-feedback").hidden'),true);await click('.cs-quiz-check');assert.equal(await js('return document.querySelector(".quiz-feedback").hidden'),false);checks.push('选择不泄露答案，检查后反馈');
await js('let t=document.querySelector(".work-it-out textarea");t.value="reference QA: B receives C advertisement";t.dispatchEvent(new Event("input"))');await visit(discussion);assert.match(await js('return document.querySelector(".work-it-out textarea").value'),/reference QA/);await js('localStorage.removeItem(`coursestack.notes:${location.pathname}:0`)');checks.push('推演笔记保存与恢复');
await visit('/courses/cs168/lessons/0006-distance-vector.html');
await click('.cs-network-toolbar button[aria-label="下一步"]');assert.match(await js('return document.querySelector(".cs-network-frame-label").textContent'),/第 1 轮/);checks.push('距离向量逐轮推演');
await click('.reader-completion button');assert.equal(await js('return document.querySelector(".reader-completion button").getAttribute("aria-pressed")'),'true');
await visit('/courses/cs168/');assert.match(await js('return document.querySelector("[data-progress-label]").textContent'),/1 \/ 26/);assert.match(await js('return document.querySelector("[data-resume-title]").textContent'),/距离向量/);checks.push('学完标记、进度环与继续学习');
await visit('/courses/cs168/lessons/assignments/ass16-project-2-routing.html');
await click('.pb-copy-code');assert.equal(await js('return document.querySelector(".pb-copy-code").textContent'),'已复制');assert.ok(await js('return !!document.querySelector(".cs-code-lines")'));checks.push('复制真实代码，不包含行号');
await js('document.querySelector("pre").scrollIntoView({block:"center",behavior:"instant"})');fs.writeFileSync(`${out}/component-code.png`,Buffer.from(await c('/screenshot'),'base64'));
await visit('/courses/18-06-linear-algebra/lessons/0001-geometry-of-linear-equations.html');
await click('.math-reasoning__options button');await click('.math-reasoning .cs-quiz-check');assert.ok(await js('return document.querySelector(".math-reasoning__feedback").textContent.length>10'));checks.push('数学推演使用统一检查组件');
for(const width of [1280,1024,768,500]){await c('/window/rect',{width,height:1000});await visit('/courses/cs168/lessons/0006-distance-vector.html');assert.equal(await js('return document.documentElement.scrollWidth>innerWidth'),false);assert.equal(await js('return document.querySelector(".reader-aside details").open'),width>900);checks.push(`正文响应式 ${width}px`);}
await js('localStorage.removeItem("coursestack.learning.v1")');
fs.writeFileSync(`${out}/interaction-results.json`,JSON.stringify(checks,null,2));
console.log(`REFERENCE_INTERACTIONS_OK ${checks.length}`);
