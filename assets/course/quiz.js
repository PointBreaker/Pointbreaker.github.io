// One quiz contract across courses: select → check → diagnose → try again.
window.initCourseQuizzes = (root=document) => root.querySelectorAll('.quiz, [data-quiz]').forEach(quiz => {
  if(quiz.dataset.quizReady)return;
  const choices=[...quiz.querySelectorAll('button[data-choice],button[data-answer]')];
  if(!choices.length)return; // Leave specialized exercise engines in control.
  quiz.dataset.quizReady='true';
  const compact=/^[a-d]$/i.test(quiz.dataset.correct||'')?quiz.dataset.correct.toLowerCase():'';
  const answer=(quiz.dataset.answer||compact).toLowerCase();
  let selected=null;
  let feedback=quiz.querySelector('[data-feedback],.quiz-feedback');
  if(!feedback){feedback=document.createElement('p');feedback.className='quiz-feedback';feedback.dataset.feedback='';quiz.append(feedback);}
  feedback.setAttribute("role", "status");
  feedback.setAttribute('aria-live','polite');feedback.setAttribute('aria-atomic','true');
  feedback.hidden=true;
  const check=document.createElement('button');check.type='button';check.className='cs-quiz-check';check.textContent='检查答案';check.disabled=true;
  feedback.before(check);
  choices.forEach(choice=>{
    choice.type='button';choice.setAttribute('aria-pressed','false');
    choice.addEventListener('click',()=>{
      selected=choice;
      choices.forEach(item=>{item.setAttribute('aria-pressed',String(item===choice));item.classList.toggle('is-selected',item===choice);item.classList.remove('is-correct','is-incorrect');});
      feedback.hidden=true;feedback.textContent='';check.disabled=false;check.textContent='检查答案';
    });
  });
  check.addEventListener('click',()=>{
    if(!selected)return;
    feedback.hidden=false;
    if(!answer&&!selected.dataset.answer){feedback.dataset.state='neutral';feedback.textContent='参考解析：'+(quiz.dataset.correct||'本题还没有确定答案，请结合正文核对推导。');}
    else {
      const correct=selected.dataset.answer?selected.dataset.answer==='correct':selected.dataset.choice?.toLowerCase()===answer;
      const good=(compact?'':quiz.dataset.correct)||selected.dataset.correct||'正确。试着解释每一步为什么成立。';
      const wrong=selected.dataset.diagnosis||selected.dataset.incorrect||quiz.dataset.incorrect||'再检查一下前提、状态和边界条件。';
      feedback.dataset.state=correct?'correct':'incorrect';
      selected.classList.add(correct?'is-correct':'is-incorrect');
      feedback.textContent=correct?good:`理解诊断：${wrong}`;
    }
    check.disabled=true;check.textContent='已检查 · 重新选择可再试';
    window.renderCourseMath?.(feedback);
  });
});
window.initCourseQuizzes();
