(function () {
  const entries = {};
  const assign = (keys, data) => keys.forEach((key) => { entries['ass' + String(key).padStart(2, '0')] = data; });
  const commonGate = ['不看官方解答能写出对象、假设与目标', '每个关键跳步都有理由或已命名定理', '用反例、归一化或边界情形完成独立复核'];

  const proof = {
    title: 'Proof Workshop · 先写量词，再选证明方向',
    mission: '把自然语言命题变成带量词的证明义务，并在 direct、contrapositive、contradiction、induction 或 counterexample 中做有理由的选择。',
    lesson: ['../0001-propositional-logic-sets-and-proof-techniques.html', 'Lesson 1–2 · Logic / Induction'],
    stages: ['形式化命题与量词', '尝试最小真例/反例', '选择证明骨架', '逐行检查推理义务'],
    contract: ['明确给定、要证、变量域和量词顺序', '若用归纳，写清 P(n)、base、IH 与 step', '若要推翻全称命题，一个满足前提的反例即可'],
    sanity: '先在 0、1、2 或空集上测试命题；这不是证明，但能迅速发现漏掉的边界和错误量词。',
    trace: 'statement → quantifiers → proof direction → named obligation → justified conclusion',
    failures: [['写了很多代数却不知道在证什么', '把结论改写成 “for every / there exists / implies” 并圈出量词。'], ['归纳步骤偷偷假设 P(k+1)', '只允许使用题目条件与明确写出的 induction hypothesis。']],
    check: { question: '要证明“若 P 则 Q”，哪种改写与原命题等价且常便于证明？', choices: ['若非 Q 则非 P', '若 Q 则 P', 'P 且非 Q'], answer: 0, confirm: '逆否命题与原蕴含严格等价。', diagnosis: 'converse（若 Q 则 P）一般不等价；反证中的 P 且非 Q 是假设组合，不是改写后的结论。' },
    hints: ['只标出量词和逻辑连接词，不做代数。', '尝试证明逆否命题，或搜索最小反例。', '逐行标注使用了定义、假设还是已证命题。'],
    gate: commonGate,
  };
  const graph = {
    title: 'Graph / Matching Workshop · 维护不变量而不是讲故事',
    mission: '把算法过程写成状态、允许操作和始终成立的不变量，再从终止状态推出稳定性、连通性或图性质。',
    lesson: ['../0003-stable-matching.html', 'Lesson 3–4 · Matching / Graphs'],
    stages: ['定义顶点、边与状态', '手推最小图', '声明 invariant', '终止 + 正确性/反例'],
    contract: ['图是有向还是无向、简单还是允许重边必须明确', '算法每一步能改变哪些集合/边', '结论必须从 invariant 与 termination 推出'],
    sanity: '用 3–5 个顶点画出全部状态；对稳定匹配同时检查“配对有效”和“不存在 blocking pair”。',
    trace: 'initial graph/state → one legal move → invariant preserved → terminal state → claimed property',
    failures: [['例子跑通但证明不成立', '例子只说明存在一条轨迹；需要说明任意合法一步都保持 invariant。'], ['把 maximal 与 maximum 混用', '前者不能再局部扩张，后者是全局最优，主动找一个二者不同的小图。']],
    check: { question: '证明迭代图算法正确，通常还必须单独证明什么？', choices: ['只证明每步可运行', 'invariant、终止以及终止态推出目标', '只给一个大例子'], answer: 1, confirm: '维护性、终止性和后置条件共同闭合证明。', diagnosis: '单步合法或单个例子都不能覆盖所有执行路径。' },
    hints: ['只画 4 个顶点，记录一步前后哪些对象改变。', '把 invariant 写成每轮开始时为真的完整句子。', '分别证明初始化、保持、终止后的含义。'],
    gate: commonGate,
  };
  const modular = {
    title: 'Algebra Workshop · 每一步都写明所在的模或域',
    mission: '在模运算、RSA、有限域多项式与纠错中保持对象类型，先验证可逆条件，再执行变换。',
    lesson: ['../0005-modular-arithmetic-and-rsa.html', 'Lesson 5–6 · Modular arithmetic / Polynomials'],
    stages: ['标 modulus / field', '检查 gcd 与可逆性', '执行算法/插值', '代回同余与次数界'],
    contract: ['同余式始终注明 modulus', '除法只有在分母可逆时才合法', '多项式恢复需要明确点数、次数与错误预算'],
    sanity: '先在 mod 5 或 mod 7 的小表上检查逆元、零因子和插值；再推广符号推导。',
    trace: 'typed objects → preconditions → Euclid / exponentiation / interpolation → substitution check',
    failures: [['像实数一样直接约分', '检查被约因子与 modulus 是否互素。'], ['RSA 指数关系写对但消息恢复失败', '检查消息域、gcd 条件与指数等式究竟模哪个数成立。']],
    check: { question: '在 mod n 下，什么时候可以把同余两边同时除以 a？', choices: ['任何时候', 'a 在 mod n 下可逆时', 'a 是偶数时'], answer: 1, confirm: '存在乘法逆元才允许把“除以 a”解释为乘逆元。', diagnosis: '普通整数除法规则不能无条件搬入模环。' },
    hints: ['写出当前元素属于 Z/nZ 还是 GF(p)[x]。', '先计算 gcd 或写出 Bezout identity。', '用一个小数值代回每个同余式。'],
    gate: commonGate,
  };
  const counting = {
    title: 'Counting Workshop · 先定义被数对象与唯一编码',
    mission: '把计数、可数性和容斥证明还原成集合、映射与是否重复计数，而不是直接猜组合数公式。',
    lesson: ['../0007-countability-computability-and-counting.html', 'Lesson 7–8 · Countability / Counting'],
    stages: ['定义对象集合', '设计分类或编码', '证明不漏不重', '用小 n 与双计数复核'],
    contract: ['排列、组合、函数或图结构是否区分顺序必须明确', '映射证明需写 injective/surjective/bijective 哪一项', '容斥中的交集层级与符号必须可解释'],
    sanity: '把 n 缩到 2 或 3，列出全部对象并与公式对照；若不同，先修对象定义。',
    trace: 'objects → canonical representation / cases → count each once → sum → boundary check',
    failures: [['答案差一个阶乘', '通常是把有序选择与无序集合混淆。'], ['对角化只写“不同”', '必须指出新对象在第 i 位与第 i 个枚举对象不同。']],
    check: { question: '组合证明等式最关键的共同中介是什么？', choices: ['两边都代数化简', '两边分别计数同一个集合', '检查一个 n'], answer: 1, confirm: '同一集合的两种不重不漏计数直接给出等式。', diagnosis: '代数化简可以验证，但不能展示组合对象为何对应。' },
    hints: ['用一句话写“我究竟在数什么”。', '为每个对象指定唯一分类标签。', '用 n=3 完整枚举检查不漏不重。'],
    gate: commonGate,
  };
  const probability = {
    title: 'Probability Workshop · 先定义实验，再谈独立',
    mission: '先写样本空间和概率质量，再定义事件；条件概率、Bayes 与独立性都必须相对于这个模型解释。',
    lesson: ['../0009-probability-basics-conditional-probability-and-independence.html', 'Lesson 9–10 · Probability models'],
    stages: ['定义 Ω 与 P', '把语言变成事件', '选择 conditioning / complement / counting', '归一化与极端值检查'],
    contract: ['等可能必须被证明，不能由“看起来对称”默认', '独立是 P(A∩B)=P(A)P(B)，不是互斥', '条件化后样本空间与权重可能改变'],
    sanity: '把次数、球数或门数缩到 2–3，完整列出结果；特别比较有放回与无放回。',
    trace: 'experiment → outcomes + weights → event → probability rule → total probability = 1',
    failures: [['把组合数直接当概率', '先问每个被计对象是否等权，并除以正确样本空间。'], ['看到“不同事件”就相乘', '乘法需要独立或条件概率链，名称不同不等于独立。']],
    check: { question: 'A 与 B 互斥且都有正概率，它们能独立吗？', choices: ['能', '不能', '只有公平实验能'], answer: 1, confirm: '互斥使交集概率为 0，但独立要求其等于两个正数的乘积。', diagnosis: '互斥描述不能同时发生；独立描述获知一个不改变另一个概率。' },
    hints: ['写出一个具体 outcome 长什么样。', '写 P(A∩B)=P(A)P(B) 或条件概率，不凭直觉说独立。', '检查所有互斥基本结果的概率是否和为 1。'],
    gate: commonGate,
  };
  const randomVariables = {
    title: 'Random Variable Workshop · 把函数与分布分开记账',
    mission: '随机变量是 outcome 的函数；期望、方差、协方差和浓缩界建立在该函数诱导的分布上。',
    lesson: ['../0011-expectation-variance-covariance-geometric-and-poisson.html', 'Lesson 11–12 · Expectation / Concentration'],
    stages: ['定义 X(ω)', '写 support / pmf', '用 indicators 或条件化分解', '检查单位、界与相关性'],
    contract: ['X 的取值与事件概率要完整覆盖样本空间', '线性期望不要求独立，方差相加通常要求协方差条件', '使用 Markov/Chebyshev 前验证非负性或矩存在'],
    sanity: '用两个 Bernoulli 指示变量做最小模型，分别构造独立、完全相关和互斥情形。',
    trace: 'ω → X(ω) → distribution/moments → theorem preconditions → numerical/probability bound',
    failures: [['E[X+Y] 里额外假设独立', '期望线性无条件成立；把独立留给乘积或方差。'], ['方差算成 E[X²]', '还要减去 E[X]²，并检查量纲是平方单位。']],
    check: { question: '计算 E[X+Y] 时是否需要 X,Y 独立？', choices: ['需要', '不需要', '仅连续变量需要'], answer: 1, confirm: '期望的线性来自求和/积分线性，与独立无关。', diagnosis: '独立常用于 E[XY] 分解和协方差为零，不是期望相加的前提。' },
    hints: ['先把目标量写成 indicators 的和。', '区分 E[X²]、E[X]² 与 Var(X)。', '用 0/1 极端相关例检查公式。'],
    gate: commonGate,
  };
  const continuous = {
    title: 'Continuous Probability Workshop · 密度不是点概率',
    mission: '用 CDF、积分区域和标准化把连续分布、Gaussian、CLT 与估计问题连接起来。',
    lesson: ['../0013-continuous-distributions-pdf-cdf-and-the-central-limit-theorem.html', 'Lesson 13–14 · Continuous / CLT'],
    stages: ['确定 support 与 density/CDF', '写积分或标准化', '选择 exact / bound / CLT', '检查归一化和近似尺度'],
    contract: ['pdf 可大于 1，但积分必须为 1', '连续点概率为 0，区间概率来自积分/CDF 差', 'CLT 近似要说明样本量、中心化与尺度'],
    sanity: '先用 Uniform(0,1) 检查区间、CDF 跳转和期望；再换成一般参数。',
    trace: 'support → density/CDF → transform/standardize → probability or estimator → range check',
    failures: [['把 f(x) 当 P(X=x)', '连续变量单点概率为 0；f 是单位长度概率的极限密度。'], ['CLT 后忘记除以标准差', '标准化需要减均值并除以正确的标准差/标准误。']],
    check: { question: '连续随机变量的密度 f(2)=1.4 是否自动矛盾？', choices: ['矛盾，概率不能超过 1', '不矛盾，只需总积分为 1 且非负', '只在离散分布矛盾'], answer: 1, confirm: '密度有“每单位 x”的量纲，不是单点概率。', diagnosis: '概率由面积给出；窄区间上的高密度仍可有小于 1 的面积。' },
    hints: ['先画 support 并标出积分区间。', '优先写 CDF 差或变量变换的 Jacobian。', '检查答案是否在 [0,1]，单位是否合理。'],
    gate: commonGate,
  };

  assign([1,2,3,4,5], proof);
  assign([6,7,8,9,10], graph);
  assign([11,12,13,14,15,16,17], modular);
  assign([18,19,20,21,22], counting);
  assign([23,24,25,26,27,28,29], probability);
  assign([30,31,32,33,34,35], randomVariables);
  assign([36,37,38,39,40,41], continuous);

  const lessonBridges = {
    '0001':['ass03-homework-00-administrivia-ed-academic-integrity-propositional-logic-implication-quantifiers-set-operations.html','Homework 00','把量词和蕴含写成可检查的 proof obligation。'],
    '0002':['ass05-homework-01-calculus-review-prove-or-disprove-rationals-irrationals-twin-primes-airport-induction-inequality-am-gm-coin-game.html','Homework 01','用 base / IH / step 与最小反例验证归纳结构。'],
    '0003':['ass07-homework-02-universal-preference-partial-matching-merging-stable-pairings-build-up-error-graph-proofs-bipartite-graphs.html','Homework 02','把 stable matching 运行过程变成 invariant 与终止证明。'],
    '0004':['ass10-homework-03-planarity-and-graph-complements-touring-hypercube-binary-trees-edge-colorings-modular-practice-wilson-s-theorem.html','Homework 03','在小图上验证图论命题与反例。'],
    '0005':['ass14-homework-04-fermat-s-little-theorem-euler-s-totient-function-euler-s-theorem-sparsity-of-primes-rsa-practice-tweaking-rsa.html','Homework 04','保持 modulus、可逆条件与 RSA 对象类型。'],
    '0006':['ass17-homework-05-polynomials-over-gf-p-one-point-interpolation-crt-and-lagrange-secret-sharing-error-correcting-codes-alice-and-bob.html','Homework 05','用次数、点数与错误预算检查恢复条件。'],
    '0007':['ass20-homework-06-unions-intersections-countability-infinite-graphs-countability-proofs-fixed-points-kolmogorov-complexity-counting-fermat-wristband.html','Homework 06','把可数性证明写成明确映射或对角构造。'],
    '0008':['ass22-homework-07-shipping-crates-grid-paths-and-trees-counting-on-graphs-symmetry-combinatorial-proofs-fibonacci-fashion.html','Homework 07','先定义被数对象，再证明不重不漏。'],
    '0009':['ass25-homework-08-probability-warm-up-five-up-past-probabilified-cliques-in-random-graphs-pie-extended-independent-complements.html','Homework 08','先定义样本空间与权重，再谈事件。'],
    '0010':['ass28-homework-09-monty-hall-s-revenge-man-speaks-truth-mario-s-coins-symmetric-marbles-cookie-jars-testing-model-planes.html','Homework 09','用条件化和全概率拆解看似反直觉的模型。'],
    '0011':['ass31-homework-11-lossy-channels-class-enrollment-swaps-and-cycles-throwing-frisbees-balls-and-bins-will-i-get-my-package.html','Homework 11','把复杂随机量拆成 indicators 并记录依赖。'],
    '0012':['ass34-homework-12-covariance-intuition-unreliable-servers-geometric-and-poisson-coupon-collector-variance-buying-probability-books-dice-games.html','Homework 12','区分期望线性、协方差与方差条件。'],
    '0013':['ass37-homework-13-cantelli-s-inequality-coupon-collector-variance-estimating-continuous-short-answer-useful-uniforms-waiting-for-the-bus.html','Homework 13','用 support、CDF 与积分检查连续模型。'],
    '0014':['ass41-homework-14-raining-fish-poisson-process-noisy-love-gaussian-channel-chebyshev-vs-clt-uniform-estimation.html','Homework 14','比较 exact、bound 与 CLT 近似的适用条件。'],
  };
  window.ReasoningWorkbookBank = { label: 'CS70 · PROOF & PROBABILITY WORKBOOK', entries, lessonBridges };
})();
