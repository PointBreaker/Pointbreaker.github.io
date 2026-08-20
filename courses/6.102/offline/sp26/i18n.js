/* MIT 6.102 SP26 — EN ⇄ 中文 in-place language toggle */
(function(){
  'use strict';

  const T = {
    '6.102 — Software Construction':'6.102 — 软件构建',
    '6.102':'6.102','Spring 2026':'2026 年春季',
    'Course Staff':'课程团队',
    'Tues & Thurs 9:30-11am in 26-100':'周二 & 周四 9:30-11am，26-100 教室',
    'Go to…':'快速跳转…','Jump to':'跳转到','materials':'课程资料',
    'Piazza':'Piazza','Q & A':'问答','Didit':'Didit','build reports & grades':'构建报告 & 成绩',
    'Caesar':'Caesar','code reviews & extensions':'代码审查 & 延期',
    'GitHub.mit.edu':'GitHub.mit.edu','web view of your Git repositories':'Git 仓库网页视图',
    'Omnivore':'Omnivore','grade reports':'成绩单',
    'Classtime problem':'课堂问题','report form':'报告表单',
    'General':'课程信息','General information':'课程基本信息',
    'Collaboration and public sharing':'协作与公开分享','Code reviewing':'代码审查',
    'I have a question, who do I ask?':'有问题，该问谁？',
    'Calendar':'日历','semester view':'学期视图','deadlines and quiz dates':'截止日期和考试日期',
    'week view':'周视图',"this week's classes, lab hours, office hours":'本周课程、实验和办公时间',
    'Tools':'工具','Getting Started: Installing Software':'入门：安装软件',
    'Technical tips and troubleshooting':'技术提示与故障排除',
    'Git 1: Version Control':'Git 1：版本控制','Git 2: Disaster Recovery':'Git 2：灾难恢复',
    'Git 3: Team Version Control':'Git 3：团队版本控制','Basic TypeScript':'TypeScript 基础',
    'Readings':'阅读材料','Problem Sets':'问题集','Project':'项目','Exams':'考试',
    'Course Archive':'课程归档','Previous semesters':'往期学期','Announcements':'公告',
    'Announcements Archive':'公告归档',
    '01: Static Checking':'01：静态检查','02: Testing':'02：测试','03: Code Review':'03：代码审查',
    '04: Specifications':'04：规格说明','05: Designing Specifications':'05：设计规格说明',
    '06: Abstract Data Types':'06：抽象数据类型',
    '07: Abstraction Functions & Rep Invariants':'07：抽象函数与表示不变量',
    '07: Abstraction Functions &amp; Rep Invariants':'07：抽象函数与表示不变量',
    '08: Interfaces & Subtyping':'08：接口与子类型','08: Interfaces &amp; Subtyping':'08：接口与子类型',
    '09: Equality':'09：等价性','10: Functional Programming':'10：函数式编程',
    '11: Recursive Data Types':'11：递归数据类型','12: Grammars & Parsing':'12：文法与分析',
    '12: Grammars &amp; Parsing':'12：文法与分析','13: Debugging':'13：调试',
    '14: Concurrency':'14：并发','15: Promises':'15：Promise','16: Mutual Exclusion':'16：互斥',
    '17: Callbacks & Graphical User Interfaces':'17：回调与图形用户界面',
    '17: Callbacks &amp; Graphical User Interfaces':'17：回调与图形用户界面',
    '18: Message-Passing & Networking':'18：消息传递与网络',
    '18: Message-Passing &amp; Networking':'18：消息传递与网络',
    '19: Little Languages':'19：小型语言',
    'Table of contents + Index of terms':'目录 + 术语索引','Search this site':'搜索本站',
    'Further reading (books available online to MIT)':'延伸阅读（MIT 在线图书）',
    'PS0: Turtle Graphics':'PS0：海龟绘图','PS1: Specific Graphics':'PS1：特定图形',
    'PS2: Multi-Startup Set':'PS2：多起点集合','PS3: Memely':'PS3：Memely',
    'PS4: Memory Scramble':'PS4：记忆扰乱','Star Battle':'Star Battle',
    'Exam 1':'考试 1','Exam 1 solutions':'考试 1 解答','Exam 2':'考试 2','Exam 2 solutions':'考试 2 解答',
    'Exam archive':'考试归档','due':'截止','alpha due':'Alpha 截止','code review due':'代码审查截止',
    'beta due':'Beta 截止','reading due':'阅读截止','team contract due':'团队合同截止',
    'iteration 0 due':'迭代 0 截止','iteration 1 due':'迭代 1 截止','project due':'项目截止',
    'reflection due':'反思截止','due Tue':'截止 周二','due Wed':'截止 周三','due Mon':'截止 周一',
    'due Fri':'截止 周五','due Sun':'截止 周日',
    'Reading':'阅读','Objectives':'学习目标','Summary':'总结',
    'Hailstone sequence':'冰雹数列','Types':'类型','Static typing':'静态类型',
    'Arrays':'数组','Functions':'函数','big three properties of good software':'好软件的三大属性',
    'Safe from bugs':'安全免于缺陷','Easy to understand':'易于理解','Ready for change':'随时可变',
    'static typing':'静态类型','Correct today and correct in the unknown future.':'正确今天，也正确于未知的未来。',
    'Communicating clearly with future programmers, including future you.':'与未来的程序员（包括未来的你）清晰沟通。',
    'Designed to accommodate change without rewriting.':'设计时就不打算重写。',
    'Problem Set':'问题集','Install':'安装','Getting started with Git':'Git 入门','Clone':'克隆',
    'Collaboration policy':'协作政策','Slack days':'宽限期','Getting started with TypeScript':'TypeScript 入门',
    'Turtle graphics and drawSquare':'海龟绘图与 drawSquare','Commit and push your work so far':'提交并推送当前工作',
    'Drawing circles':'绘制圆形','Calculating distances and paths':'计算距离和路径','Personal art':'个人艺术',
    'Submitting':'提交','Grading':'评分','Welcome to 6.102!':'欢迎来到 6.102！',
    'This course is about three essential properties of software:':'本课程关注软件的三个基本属性：',
    'The purpose of this problem set is to:':'本作业的目的是：',
    'introduce the tools we will use in 6.102, including TypeScript, VS Code, Mocha, and Git;':'介绍 6.102 中使用的工具，包括 TypeScript、VS Code、Mocha 和 Git；',
    'The deadlines for this problem set are shown on the':'本作业截止日期见','course calendar':'课程日历',
    'Collaboration':'协作','Public sharing':'公开分享','code review':'代码审查',
    'I have a question':'我有问题','who do I ask?':'该问谁？','further reading':'延伸阅读',
    'Technical tips':'技术提示','troubleshooting':'故障排除',
    'MIT EECS':'MIT EECS','spring 2026 course site archive':'2026 年春季课程网站归档',
    'latest site at':'最新网站','accessibility':'无障碍',
    'More progress with Git':'Git 进阶','Get the code':'获取代码','Overview':'概述','Steps':'步骤',
    'What you can and can\'t change':'什么可以改、什么不能改','Specifications':'规格说明','Testing':'测试',
    'Implementation':'实现','Designing your toolbox of animation functions':'设计你的动画函数工具箱',
    'Learning about colors and curves, and a Python notebook':'学习颜色和曲线，以及 Python 笔记本',
  };

  let currentLang = localStorage.getItem('mit6102-lang') || 'en';
  const originals = new WeakMap();

  function translateText(text) {
    const trimmed = text.trim();
    if (!trimmed) return text;
    if (T[trimmed]) return text.replace(trimmed, T[trimmed]);
    let result = text;
    for (const [en, zh] of Object.entries(T)) {
      if (result.includes(en)) result = result.split(en).join(zh);
    }
    return result;
  }

  function translateNode(node) {
    if (node.nodeType !== 3) return;
    const text = node.textContent;
    if (!text.trim()) return;
    const translated = translateText(text);
    if (translated !== text) {
      if (!originals.has(node)) originals.set(node, text);
      node.textContent = translated;
    }
  }

  function walk(root, cb) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(cb);
  }

  function translatePage(lang) {
    currentLang = lang;
    localStorage.setItem('mit6102-lang', lang);
    if (lang === 'zh') {
      walk(document.body, translateNode);
    } else {
      walk(document.body, node => {
        if (originals.has(node)) { node.textContent = originals.get(node); originals.delete(node); }
      });
    }
    updateBtn();
  }

  function updateBtn() {
    const btn = document.getElementById('i18n-btn');
    if (!btn) return;
    btn.textContent = currentLang === 'zh' ? '中 / EN' : 'EN / 中';
    btn.classList.toggle('active', currentLang === 'zh');
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  }

  function createBtn() {
    const btn = document.createElement('button');
    btn.id = 'i18n-btn';
    btn.className = 'i18n-float';
    btn.onclick = () => translatePage(currentLang === 'en' ? 'zh' : 'en');
    document.body.appendChild(btn);
  }

  function addCSS() {
    const s = document.createElement('style');
    s.textContent = '.i18n-float{position:fixed;top:16px;right:16px;z-index:9999;background:rgba(26,26,32,.9);backdrop-filter:blur(12px);border:1px solid rgba(240,236,228,.15);color:#f0ece4;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:border-color .2s,background .2s,transform .15s;font-family:inherit;text-decoration:none}.i18n-float:hover{border-color:rgba(196,48,43,.5);background:rgba(20,20,24,.95);transform:translateY(-1px)}.i18n-float.active{background:rgba(196,48,43,.15);border-color:rgba(196,48,43,.4)}';
    document.head.appendChild(s);
  }

  function init() { addCSS(); createBtn(); if (currentLang === 'zh') walk(document.body, translateNode); updateBtn(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
