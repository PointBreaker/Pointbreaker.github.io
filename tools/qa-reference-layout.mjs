// Real Firefox render audit of every registered course route, including legacy workbooks.
import fs from 'node:fs';
const sid=process.argv[2];if(!sid)throw Error('Pass an existing Firefox WebDriver session ID');
const base=`${process.env.COURSESTACK_WEBDRIVER||'http://127.0.0.1:4444'}/session/${sid}`,out='.course-build/reference';
fs.mkdirSync(out,{recursive:true});
async function command(p,data){const r=await(await fetch(base+p,data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{})).json();if(r.value?.error)throw Error(JSON.stringify(r.value));return r.value;}
const js=script=>command('/execute/sync',{script,args:[]});
const catalog=JSON.parse(fs.readFileSync('courses.json')).courses;
const manifest=JSON.parse(fs.readFileSync(`${out}/page-manifest.json`));
const routes=['/',...catalog.map(c=>'/'+c.path),...manifest.map(p=>'/'+p.file)];
const samples=new Set(['/',...catalog.map(c=>'/'+c.path),...catalog.map(c=>'/'+c.path+JSON.parse(fs.readFileSync(c.path+'api/status.json')).lectures[0].lessonFile),'/courses/cs168/lessons/0006-distance-vector.html','/courses/cs168/lessons/assignments/ass03-discussion-03-routing-i.html','/courses/cs168/lessons/assignments/ass16-project-2-routing.html','/courses/eecs498/reviews/a3.html']);
const resultFile=`${out}/render-results.json`;
const results=process.env.COURSESTACK_QA_RESUME&&fs.existsSync(resultFile)?JSON.parse(fs.readFileSync(resultFile,'utf8')):[];
const completed=new Set(results.map(result=>result.route));
const pending=routes.filter(route=>!completed.has(route));
for(const [index,route]of pending.entries()){
 await command('/window/rect',{width:1440,height:1050});
 await command('/url',{url:'http://127.0.0.1:4173'+route});
 for(let t=0;t<25;t++){if(await js('return !!document.querySelector(".cs-header") && (!document.querySelector(".page")||!!document.querySelector(".reader-aside"))'))break;await new Promise(r=>setTimeout(r,80));}
 await new Promise(r=>setTimeout(r,samples.has(route)?1000:200));
 const states=[];
 for(const width of [1440,500]){
  if(width!==1440){await command('/window/rect',{width,height:1050});await new Promise(r=>setTimeout(r,60));}
  const state=await js(`return {width:innerWidth,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,header:document.querySelectorAll('.cs-header').length,article:!!document.querySelector('.page'),toc:!!document.querySelector('.reader-aside'),title:[...document.querySelectorAll('h1')].filter(n=>n.getBoundingClientRect().height&&getComputedStyle(n).display!=='none').map(n=>n.textContent),notes:document.querySelectorAll('.reader-margin-note').length,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),mathErrors:document.querySelectorAll('.katex-error').length,wideElements:[...document.querySelectorAll('.page > *, .cs-course > *')].filter(n=>n.getBoundingClientRect().right>innerWidth+1||n.getBoundingClientRect().left<0).map(n=>n.tagName+'.'+n.className).slice(0,8)}`);
  state.legacyTocs=await js('return [...document.querySelectorAll(".lesson-toc,.lesson-toc-mobile,.reading-toc,.pb-toc")].filter(n=>n.getBoundingClientRect().width&&n.getBoundingClientRect().height&&getComputedStyle(n).display!=="none").length');
  states.push(state);
  if(samples.has(route)){const name=route==='/'?'home':route.slice(1).replaceAll('/','_').replace('.html','');await js('scrollTo(0,0)');fs.writeFileSync(`${out}/${name}-${width}.png`,Buffer.from(await command('/screenshot'),'base64'));}
 }
 results.push({route,states});
 fs.writeFileSync(resultFile,JSON.stringify(results,null,2));
 if(index%25===0)console.log(`CHECKED ${completed.size+index+1}/${routes.length} ${route}`);
}
const issues=results.filter(r=>r.states.some(s=>s.overflow||s.header!==1||s.title.length!==1||s.brokenImages.length||s.mathErrors||s.legacyTocs||(s.article&&!s.toc)));
fs.writeFileSync(`${out}/render-issues.json`,JSON.stringify(issues,null,2));
console.log(`REFERENCE_QA routes=${results.length} states=${results.length*2} issues=${issues.length}`);
