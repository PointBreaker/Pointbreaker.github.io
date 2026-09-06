/* Progressive enhancement of the complete static course map. */
(() => {
 const root=document.querySelector('.cs-course');if(!root)return;
 const courseId=document.body.dataset.course;
 const rows=[...root.querySelectorAll('.cs-lesson-row')];
 const path=row=>new URL(row.dataset.path,location.href).pathname;
 let saved={};try{saved=JSON.parse(localStorage.getItem('coursestack.learning.v1')||'{}')[courseId]||{};}catch{}
 const completed=new Set(Array.isArray(saved.completed)?saved.completed:[]);
 const lectures=rows.filter(r=>r.dataset.kind==='lecture'),work=rows.filter(r=>r.dataset.kind==='work');
 const done=lectures.filter(r=>completed.has(path(r))).length;
 const last=rows.find(row=>saved.last?.path===path(row));
 rows.forEach(row=>{if(completed.has(path(row))){row.classList.add('is-complete');row.querySelector('.cs-lesson-status').textContent='已学完';}});
 root.querySelector('progress').value=done;
 root.querySelector('[data-progress-label]').textContent=`已完成 ${done} / ${lectures.length} 讲 · 记录保存在当前浏览器`;
 root.querySelector('[data-progress-fraction]').textContent=`${done} / ${lectures.length}`;
 root.querySelector('.cs-progress-ring').style.setProperty('--progress',`${lectures.length?done/lectures.length*100:0}%`);
 root.querySelector('[data-work-done]').textContent=work.filter(r=>completed.has(path(r))).length;
 if(last){root.querySelector('[data-resume-label]').textContent='继续学习';root.querySelector('[data-resume-title]').textContent=last.querySelector('.cs-lesson-name').textContent;const link=root.querySelector('[data-resume-link]');link.href=path(last);link.firstChild.textContent='继续学习 ';}
 const current=last?.dataset.kind==='lecture'?last:lectures.find(row=>!completed.has(path(row)))||lectures[0];
 root.querySelectorAll('[data-phase-paths]').forEach(phase=>phase.classList.toggle('is-current',phase.dataset.phasePaths.split('|').includes(current?.dataset.path)));
 const input=root.querySelector('#reader-search');
 input.addEventListener('input',()=>{
   const query=input.value.toLocaleLowerCase().trim();let found=0;
   rows.forEach(row=>{row.hidden=!row.textContent.toLocaleLowerCase().includes(query);if(!row.hidden)found++;});
   root.querySelectorAll('.cs-course-group').forEach(group=>{const items=group.querySelectorAll('.cs-lesson-row');group.hidden=!!query&&(!items.length||![...items].some(row=>!row.hidden));});
   root.querySelector('#reader-results').textContent=query?`找到 ${found} 项内容${found?'':'，试试其他关键词。'}`:'';
 });
})();
