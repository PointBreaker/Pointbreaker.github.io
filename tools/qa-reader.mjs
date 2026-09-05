// Browser regression checks for the optional Chinese reader profile.
// Start Firefox WebDriver and the static site, then pass the existing session ID.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const session=process.argv[2];
if(!session)throw new Error('Usage: node tools/qa-reader.mjs <Firefox WebDriver session ID>');
const base=`http://127.0.0.1:4444/session/${session}`;
const out='.course-build/reader-qa';fs.mkdirSync(out,{recursive:true});
async function call(path,data){const result=await(await fetch(base+path,data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{})).json();if(result.value?.error)throw new Error(JSON.stringify(result.value));return result.value;}
const js=script=>call('/execute/sync',{script,args:[]});
async function visit(path){await call('/url',{url:`http://127.0.0.1:4173${path}`});for(let n=0;n<40;n++){if(await js('return document.readyState === "complete" && (!document.querySelector("#reader-course") || !!document.querySelector("#reader-search")) && (!document.querySelector(".page") || !!document.querySelector(".reader-aside"))'))break;await new Promise(r=>setTimeout(r,100));}await js('window.scrollTo(0,0)');}
async function click(selector){await js(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'center',behavior:'instant'})`);const el=await call('/element',{using:'css selector',value:selector});await call(`/element/${el['element-6066-11e4-a52e-4f735466cecf']}/click`,{});}
const pages=[['home','/'],['course','/courses/cs168/'],['lecture','/courses/cs168/lessons/0006-distance-vector.html'],['discussion','/courses/cs168/lessons/assignments/ass03-discussion-03-routing-i.html'],['project','/courses/cs168/lessons/assignments/ass16-project-2-routing.html']];
const results=[];
for(const width of [1440,768,500]){
  await call('/window/rect',{width,height:1000});
  for(const [name,path]of pages){await visit(path);const result=await js('return {width:innerWidth,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length,tocOpen:document.querySelector(".reader-aside details")?.open}');assert.equal(result.overflow,false,`${name} overflow at ${width}`);assert.equal(result.brokenImages,0);if(width<=1100&&name!=='home'&&name!=='course')assert.equal(result.tocOpen,false);results.push({name,...result});fs.writeFileSync(`${out}/${name}-${width}.png`,Buffer.from(await call('/screenshot'),'base64'));}
}
await visit(pages[3][1]);
await click('.progressive-hints summary');assert.equal(await js('return document.querySelector(".progressive-hints details").open'),true);
await click('details.reveal summary');assert.equal(await js('return document.querySelector("details.reveal").open'),true);
await click('.quiz-options button');assert.equal(await js('return document.querySelector(".quiz-options button").getAttribute("aria-pressed")'),'true');
await js('const t=document.querySelector(".work-it-out textarea");t.value="QA：先确认邻居通告，再更新路由表";t.dispatchEvent(new Event("input"))');await visit(pages[3][1]);assert.match(await js('return document.querySelector(".work-it-out textarea").value'),/先确认/);
await js('localStorage.removeItem(`coursestack.notes:${location.pathname}:0`)');
await visit(pages[2][1]);await click('.cs-network-toolbar button[aria-label="下一步"]');assert.match(await js('return document.querySelector(".cs-network-frame-label").textContent'),/第 1 轮/);
await click('.cs-network-inspector-tabs button:nth-child(2)');assert.equal(await js('return document.querySelector(".cs-network-inspector-tabs button:nth-child(2)").getAttribute("aria-selected")'),'true');
await click('.reader-completion button');assert.equal(await js('return document.querySelector(".reader-completion button").getAttribute("aria-pressed")'),'true');
await visit('/courses/cs168/');assert.match(await js('return document.querySelector(".reader-resume").textContent'),/已完成 1 \/ 26/);
await js('const s=document.querySelector("#reader-search");s.value="ZZZ-no-match";s.dispatchEvent(new Event("input"))');assert.match(await js('return document.querySelector("#reader-results").textContent'),/0/);
await visit('/');assert.equal(await js('return document.querySelector("#home-resume a").textContent'),'继续学习');
await js('const s=document.querySelector("#course-search");s.value="ZZZ-no-match";s.dispatchEvent(new Event("input"))');assert.match(await js('return document.querySelector("#course-grid").textContent'),/没有找到/);
await visit(pages[4][1]);await click('.pb-copy-code');assert.equal(await js('return document.querySelector(".pb-copy-code").textContent'),'已复制');
await call('/window/rect',{width:1440,height:1000});await js('document.querySelector("pre").scrollIntoView()');fs.writeFileSync(`${out}/project-code.png`,Buffer.from(await call('/screenshot'),'base64'));
// Remove only QA-owned progress in this fresh test browser.
await js('localStorage.removeItem("coursestack.learning.v1")');
fs.writeFileSync(`${out}/results.json`,JSON.stringify({results,interactions:'hints, reveal, quiz, persisted notes, trace, completion, resume, search, clipboard passed'},null,2));
console.log(`READER_QA_OK pages=${results.length} interactions=10`);
