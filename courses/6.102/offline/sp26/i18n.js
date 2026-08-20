/* MIT 6.102 SP26 — English ⇄ Chinese translation overlay */
(function(){
  'use strict';

  // Exact-match translation dictionary
  const T = {
    // header
    '6.102 — Software Construction': '6.102 — 软件构建',
    'Spring 2026': '2026 年春季',

    // info bar
    'Course Staff': '课程团队',
    'Tues & Thurs 9:30-11am in 26-100': '周二 & 周四 9:30-11am，26-100 教室',

    // Go to…
    'Go to…': '快速跳转…',
    'Jump to': '跳转到',
    'materials': '课程资料',
    'Piazza': 'Piazza',
    'Q & A': '问答',
    'Didit': 'Didit',
    'build reports & grades': '构建报告 & 成绩',
    'Caesar': 'Caesar',
    'code reviews & extensions': '代码审查 & 延期',
    'GitHub.mit.edu': 'GitHub.mit.edu',
    'web view of your Git repositories': 'Git 仓库网页视图',
    'Omnivore': 'Omnivore',
    'grade reports': '成绩单',
    'Classtime problem': '课堂问题',
    'report form': '报告表单',

    // General
    'General': '课程信息',
    'General information': '课程基本信息',
    'Collaboration and public sharing': '协作与公开分享',
    'Code reviewing': '代码审查',
    'I have a question, who do I ask?': '有问题，该问谁？',
    'Calendar': '日历',
    'semester view': '学期视图',
    'deadlines and quiz dates': '截止日期和考试日期',
    'week view': '周视图',
    "this week's classes, lab hours, office hours": '本周课程、实验和办公时间',

    // Tools
    'Tools': '工具',
    'Getting Started: Installing Software': '入门：安装软件',
    'Technical tips and troubleshooting': '技术提示与故障排除',
    'Git 1: Version Control': 'Git 1：版本控制',
    'Git 2: Disaster Recovery': 'Git 2：灾难恢复',
    'Git 3: Team Version Control': 'Git 3：团队版本控制',
    'Basic TypeScript': 'TypeScript 基础',

    // Readings
    'Readings': '阅读材料',
    '01: Static Checking': '01：静态检查',
    '02: Testing': '02：测试',
    '03: Code Review': '03：代码审查',
    '04: Specifications': '04：规格说明',
    '05: Designing Specifications': '05：设计规格说明',
    '06: Abstract Data Types': '06：抽象数据类型',
    '07: Abstraction Functions & Rep Invariants': '07：抽象函数与表示不变量',
    '08: Interfaces & Subtyping': '08：接口与子类型',
    '09: Equality': '09：等价性',
    '10: Functional Programming': '10：函数式编程',
    '11: Recursive Data Types': '11：递归数据类型',
    '12: Grammars & Parsing': '12：文法与分析',
    '13: Debugging': '13：调试',
    '14: Concurrency': '14：并发',
    '15: Promises': '15：Promise',
    '16: Mutual Exclusion': '16：互斥',
    '17: Callbacks & Graphical User Interfaces': '17：回调与图形用户界面',
    '18: Message-Passing & Networking': '18：消息传递与网络',
    '19: Little Languages': '19：小型语言',
    'Table of contents + Index of terms': '目录 + 术语索引',
    'Search this site': '搜索本站',
    'Further reading (books available online to MIT)': '延伸阅读（MIT 在线图书）',

    // Problem Sets
    'Problem Sets': '问题集',
    'PS0: Turtle Graphics': 'PS0：海龟绘图',
    'PS1: Specific Graphics': 'PS1：特定图形',
    'PS2: Multi-Startup Set': 'PS2：多起点集合',
    'PS3: Memely': 'PS3：Memely',
    'PS4: Memory Scramble': 'PS4：记忆扰乱',

    // Project
    'Project': '项目',
    'Star Battle': 'Star Battle',

    // Exams
    'Exams': '考试',
    'Exam 1': '考试 1',
    'Exam 1 solutions': '考试 1 解答',
    'Exam 2': '考试 2',
    'Exam 2 solutions': '考试 2 解答',
    'Exam archive': '考试归档',

    // Course Archive
    'Course Archive': '课程归档',
    'Previous semesters': '往期学期',

    // Common deadline labels
    'due': '截止',
    'alpha due': 'Alpha 截止',
    'code review due': '代码审查截止',
    'beta due': 'Beta 截止',
    'reading due': '阅读截止',
    'team contract due': '团队合同截止',
    'iteration 0 due': '迭代 0 截止',
    'iteration 1 due': '迭代 1 截止',
    'project due': '项目截止',
    'reflection due': '反思截止',

    // Announcements section
    'Announcements': '公告',
    'Announcements Archive': '公告归档',

    // Misc
    'MIT EECS': 'MIT EECS',
    'spring 2026 course site archive': '2026 年春季课程网站归档',
    'latest site at': '最新网站',
    'accessibility': '无障碍',
  };

  let currentLang = 'en';
  const originals = new WeakMap();

  function translateNode(node) {
    if (node.nodeType !== 3) return;
    const text = node.textContent.trim();
    if (!text) return;

    // Try exact match first
    if (T[text]) {
      if (!originals.has(node)) originals.set(node, node.textContent);
      node.textContent = node.textContent.replace(text, T[text]);
      return;
    }

    // Try partial match (for text with embedded elements)
    let changed = false;
    let newText = node.textContent;
    for (const [en, zh] of Object.entries(T)) {
      if (newText.includes(en)) {
        if (!originals.has(node)) originals.set(node, node.textContent);
        newText = newText.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), zh);
        changed = true;
      }
    }
    if (changed) node.textContent = newText;
  }

  function walk(root, callback) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(callback);
  }

  function translatePage(lang) {
    currentLang = lang;
    if (lang === 'zh') {
      walk(document.body, translateNode);
    } else {
      // Restore originals
      walk(document.body, node => {
        if (originals.has(node)) {
          node.textContent = originals.get(node);
          originals.delete(node);
        }
      });
    }
    updateBtn();
  }

  function updateBtn() {
    const btn = document.getElementById('i18n-btn');
    if (!btn) return;
    if (currentLang === 'zh') {
      btn.textContent = '中 / EN';
      btn.classList.add('active');
      document.documentElement.lang = 'zh-CN';
    } else {
      btn.textContent = 'EN / 中';
      btn.classList.remove('active');
      document.documentElement.lang = 'en';
    }
  }

  function createBtn() {
    const btn = document.createElement('button');
    btn.id = 'i18n-btn';
    btn.className = 'i18n-float';
    btn.textContent = 'EN / 中';
    btn.onclick = () => {
      const next = currentLang === 'en' ? 'zh' : 'en';
      localStorage.setItem('mit6102-lang', next);
      translatePage(next);
    };
    document.body.appendChild(btn);
  }

  function init() {
    createBtn();
    const saved = localStorage.getItem('mit6102-lang');
    if (saved === 'zh') translatePage('zh');
    else updateBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
