(function () {
  const entries = {};
  const assign = (keys, data) => keys.forEach((key) => { entries['ass' + String(key).padStart(2, '0')] = data; });
  const commonGate = ['算法/构造覆盖所有合法输入与边界情形', '正确性证明明确说明为何输出满足目标', '复杂度按实际状态、边、转移或迭代次数逐项记账'];

  const fundamentals = {
    title: 'Algorithm Contract · 先定义输入输出，再比较增长率',
    mission: '把算法叙述改写成输入、输出、前提、正确性和 cost model，避免在对象未固定前直接报复杂度。',
    lesson: ['../0001-prologue-algorithms-and-complexity.html', 'Lesson 1–2 · Complexity / Numbers'],
    stages: ['写 input / output contract', '手推 tiny instance', '声明 invariant / number property', '证明并逐层计数'],
    contract: ['输入规模 n 的含义必须明确', '输出要满足的性质与最优性分开写', '算术操作成本要区分 unit-cost 与 bit complexity'],
    sanity: '用 n=0、1、2 或一位/两位整数执行完整 trace，并检查算法是否终止。',
    trace: 'input + assumptions → state transition → invariant → output property → operation/bit count',
    failures: [['复杂度只数循环层数', '检查每次算术的位长与内层操作是否真为 O(1)。'], ['算法在普通样例对、边界错', '主动测试空输入、单元素、重复元素和最大/最小值。']],
    check: { question: '处理 n-bit 整数时，一次乘法是否自动是 O(1)？', choices: ['是', '不是，取决于 cost model 与位长', '只有素数不是'], answer: 1, confirm: '数值算法必须说明按算术操作还是按位操作计费。', diagnosis: '把任意精度整数运算当常数会隐藏输入位长。' },
    hints: ['先写 n 是元素个数还是 bit length。', '在最小输入上列出每一步状态。', '把总成本写成“次数 × 单次成本”。'],
    gate: commonGate,
  };
  const divide = {
    title: 'Divide & Conquer Workshop · 子问题必须更小且能完整合并',
    mission: '用子问题定义、递归树和合并证明闭合分治算法，而不是只写一个看似熟悉的 recurrence。',
    lesson: ['../0003-divide-and-conquer-algorithms.html', 'Lesson 3 · Divide and Conquer'],
    stages: ['定义子问题与 base', '证明划分覆盖且不重', '证明 merge 正确', '画递归树/解 recurrence'],
    contract: ['每个递归调用规模严格减小', '合并阶段只使用子问题保证的输出', 'recurrence 的分支数、缩小比和非递归工作来自代码'],
    sanity: '对长度 0、1、2、3 的输入画递归树；若某分支规模不降，先修算法。',
    trace: 'instance n → subinstances n_i → inductive guarantees → merge → T(n)',
    failures: [['Master theorem 参数写不出来源', '回到递归调用数量、每个规模和 merge 循环。'], ['归纳证明只说“子问题正确所以整体正确”', '还需证明划分与 merge 把子答案组合成原问题答案。']],
    check: { question: '分治正确性证明中，归纳假设之后缺少什么最常见？', choices: ['更多 base cases', 'merge 将子问题正确解变成原问题正确解', '把 T(n) 写大一些'], answer: 1, confirm: '子答案正确不自动保证组合结果正确。', diagnosis: '复杂度 recurrence 与正确性 merge obligation 是两条不同证明链。' },
    hints: ['画一个 n=5 的真实划分。', '精确写出每个递归返回值承诺什么。', '单独证明 merge 不漏、不重或保持顺序。'],
    gate: commonGate,
  };
  const graph = {
    title: 'Graph Algorithm Workbook · 状态、松弛与访问顺序',
    mission: '把图算法写成对 frontier、distance、parent、component 等状态的更新，并用最小反例检验算法前提。',
    lesson: ['../0005-paths-in-graphs.html', 'Lesson 4–5 · Graph decompositions / Paths'],
    stages: ['标图类型与权重前提', '建立 frontier/state 表', '逐步更新并记录理由', '证明 invariant + 计数 V,E'],
    contract: ['有向/无向、负权、连通性等前提必须显式', '每个顶点/边被处理次数需能解释', 'parent/distance 状态含义在全程一致'],
    sanity: '用 4 个点构造一条捷径、一个回边和（若允许）一条负边，逐步记录队列/栈/距离。',
    trace: 'graph assumptions → frontier → chosen vertex/edge → state update → final certificate',
    failures: [['BFS 距离在加权图上错误', 'BFS invariant 是边数层级，不是任意权重最短路。'], ['Dijkstra 在负边上给出错误 finalized 距离', '构造三点反例检查“取出即最终”前提。']],
    check: { question: 'Dijkstra 正确性依赖哪项关键前提？', choices: ['图必须是树', '边权非负', '顶点编号连续'], answer: 1, confirm: '非负权保证当前最小 tentative distance 不会被未来路径降低。', diagnosis: '负边可在顶点 finalized 后制造更短路径。' },
    hints: ['先写 graph assumptions，不运行算法。', '每步只记录 frontier 与一个被改变的 state。', '用“第一次 invariant 失效”的最小图找反例。'],
    gate: commonGate,
  };
  const greedy = {
    title: 'Greedy Workshop · 局部选择需要交换证明',
    mission: '区分“算法看起来合理”和“每个最优解都可安全变形成包含该选择的最优解”。',
    lesson: ['../0006-greedy-algorithms.html', 'Lesson 6 · Greedy Algorithms'],
    stages: ['写 greedy choice', '搜索最小反例', '构造 exchange/cut argument', '证明剩余子问题结构'],
    contract: ['局部选择规则必须无歧义', '交换后解仍可行且目标值不差', '递归/迭代剩余部分仍是同类问题'],
    sanity: '用 3–5 个元素穷举所有可行解，与 greedy 输出对照；先尝试打败自己的规则。',
    trace: 'optimal O + greedy choice g → exchange → O′ contains g → residual optimality → result',
    failures: [['只证明 greedy 每步合法', '合法不等于全局最优，还需 exchange、cut 或 stays-ahead。'], ['用一个例子声称最优', '先构造对手实例；找不到反例才开始一般证明。']],
    check: { question: '交换论证最核心要证明什么？', choices: ['greedy 解唯一', '某最优解可变形成包含 greedy choice 且不变差', '每一步运行很快'], answer: 1, confirm: '这一步把局部选择与全局最优解连接起来。', diagnosis: '可行性与运行时间都不能替代最优性连接。' },
    hints: ['写出最小看似能打败 greedy 的实例。', '选一个最优解 O，定位它与 greedy 的第一次差异。', '交换一项并分别检查可行性和目标值。'],
    gate: commonGate,
  };
  const dp = {
    title: 'Dynamic Programming Workbook · 状态必须携带未来所需的全部信息',
    mission: '从决策边界推导 state、recurrence、base 与求值顺序，并用双射/最优子结构证明不漏不重。',
    lesson: ['../0007-dynamic-programming.html', 'Lesson 7 · Dynamic Programming'],
    stages: ['画决策边界', '定义 state 含义', '枚举最后选择并写 recurrence', 'base/order/space/complexity'],
    contract: ['相同 state 的历史必须对未来等价', '每个解对应且只对应一个 transition case', '依赖先于当前 state 计算'],
    sanity: '把输入缩到 3–4 个元素，列出所有合法答案并逐格核对 DP table。',
    trace: 'state meaning → choices → predecessor states → recurrence → evaluation order → reconstruction',
    failures: [['递推能算但 state 不清楚', '用完整句子写 dp[...] 代表的子问题，不写公式。'], ['结果重复或漏计', '检查每个完整解最后一步是否唯一归入一个 case。']],
    check: { question: '判断 DP state 是否足够，最有力的问题是什么？', choices: ['下标够不够多', '拥有同一 state 的两段历史，未来可选集合是否完全相同', '表格是否方形'], answer: 1, confirm: 'state 是对历史的充分摘要；若未来仍依赖被丢信息，state 不完整。', diagnosis: '下标数量或表格形状不能证明 Markov/充分性。' },
    hints: ['先画“已处理 / 未处理”的边界。', '问未来决策需要知道历史的哪几项。', '用 exhaustive tiny instance 对照每个 table entry。'],
    gate: commonGate,
  };
  const lp = {
    title: 'LP / Reduction Workbook · 保持可行解与目标值的对应',
    mission: '在线性规划、对偶和初步归约中，明确变量、约束、目标与映射方向，避免只做符号替换。',
    lesson: ['../0008-linear-programming.html', 'Lesson 8 · Linear Programming'],
    stages: ['定义变量语义', '逐条翻译约束', '检查可行解映射', '目标/对偶/复杂度解释'],
    contract: ['每个变量的单位和取值域明确', '每条约束对应原问题的一条必要限制', '构造需双向说明可行性；优化还需保持目标关系'],
    sanity: '用 2 个变量画可行域，逐条加入约束并观察被切掉的区域是否符合语义。',
    trace: 'original objects → variables → constraints → feasible point ↔ solution → objective/certificate',
    failures: [['LP 解满足公式却不是合法原解', '变量域或 integrality 约束可能丢失。'], ['归约只写一个方向', '分别写 YES→YES 与 mapped YES→original YES。']],
    check: { question: '把组合问题写成 LP relaxation 时，最常被放宽的是什么？', choices: ['变量的整数性', '目标函数名称', '输入大小'], answer: 0, confirm: '把 0/1 变量允许为连续区间会扩大可行域。', diagnosis: 'relaxation 的核心通常是移除 integrality，而非改名。' },
    hints: ['为每个变量写一句现实语义。', '逐条问删除该约束会允许哪个非法解。', '从一个 tiny feasible point 映射回原对象。'],
    gate: commonGate,
  };
  const np = {
    title: 'NP / Approximation Workbook · 归约方向就是证明方向',
    mission: '用 source problem、target instance、双向正确性与多项式时间构造完成归约，再明确 hardness 结论究竟落在哪个问题。',
    lesson: ['../0009-np-complete-problems.html', 'Lesson 9–10 · NP-completeness / Coping'],
    stages: ['选已知难 source', '构造 target instance', '证明 iff 两方向', '计构造时间并写结论'],
    contract: ['要证明 B 困难，应从已知难 A 归约到 B', 'YES/NO 对应必须双向成立', '构造大小与时间对 source 输入多项式有界'],
    sanity: '在一个最小 YES 和最小 NO source instance 上运行构造；若 NO 被映成 YES，归约失败。',
    trace: 'A instance x → polynomial f(x) → B instance → x∈A iff f(x)∈B → hardness',
    failures: [['归约方向写反', '问“若我有 B 的快速算法，能否借它解决 A？”'], ['只证明 YES 情况', '补上 target YES 推回 source YES，或等价的 NO 方向。']],
    check: { question: '要证明新问题 B 是 NP-hard，应采用哪一方向？', choices: ['B ≤p 已知难问题 A', '已知难问题 A ≤p B', 'B ≤p B'], answer: 1, confirm: '若能快速解 B，就经该映射快速解 A，因此 B 至少和 A 一样难。', diagnosis: '从 B 归约到 A 只说明 B 不比 A 更难，不能推出 B 的 hardness。' },
    hints: ['画箭头：known-hard A → target B。', '先只构造变量/顶点/gadget 的对应，不写证明。', '分别用一个 YES 与 NO tiny instance 检查 iff。'],
    gate: commonGate,
  };

  assign([1,2,3,4], fundamentals);
  assign([5,6], divide);
  assign([7,8,9,10], graph);
  assign([11,12,13,14], greedy);
  assign([15,16], dp);
  assign([17,18,19,20], lp);
  assign([21,22,23,24,25,26,27], np);

  const lessonBridges = {
    '0001':['ass02-homework-01-cs-170-fall-2023-homework-1.html','Homework 1','把输入规模、正确性与 cost model 分开记录。'],
    '0002':['ass04-homework-02-cs-170-fall-2023-homework-2.html','Homework 2','在位复杂度下验证数值算法。'],
    '0003':['ass06-homework-03-homework-3.html','Homework 3','闭合 divide、conquer、merge 与 recurrence。'],
    '0004':['ass08-homework-04-cs-170-fall-2023-homework-4.html','Homework 4','用状态与 invariant 推演图分解。'],
    '0005':['ass10-homework-05-cs-170-fall-2023-homework-5-optional.html','Homework 5','用最小负边/回边反例检查路径算法前提。'],
    '0006':['ass12-homework-06-cs-170-homework-6.html','Homework 6','把 greedy choice 连接到 exchange 或 cut proof。'],
    '0007':['ass16-homework-08-cs-170-fall-2023-homework-8.html','Homework 8','从决策边界推导 DP state 和 recurrence。'],
    '0008':['ass18-homework-09-homework-9.html','Homework 9','让 LP 变量、约束与原问题对象双向对应。'],
    '0009':['ass22-homework-11-homework-11.html','Homework 11','用 source→target、iff 和多项式构造完成 NP 归约。'],
    '0010':['ass26-homework-13-cs-170-fall-2023-homework-13.html','Homework 13','记录 approximation/随机化的保证、反例与证据。'],
  };
  window.ReasoningWorkbookBank = { label: 'CS170 · ALGORITHM DESIGN WORKBOOK', entries, lessonBridges };
})();
