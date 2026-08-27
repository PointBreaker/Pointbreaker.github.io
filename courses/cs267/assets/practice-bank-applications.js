(function () {
  const bank = window.CS267PracticeBank = window.CS267PracticeBank || {};
  const Q = (q, options, answer, reasons, follow) => [q, options, answer, reasons, follow];
  const F = (q, options, answer, reasons) => Q(q, options, answer, reasons);
  const entry = (problem, map, before, mental, after, label, question, deep, open, explain, bridge) =>
    ({ problem, map, before, mental, check: { after, label, question }, deep, open, explain, bridge });

  bank['15-parallel-matmul'] = entry(
    '矩阵乘法的 FLOPs 很规则，但分布式性能取决于怎样放置 A、B、C；如何从数据布局推导通信量？',
    ['data layout', 'local GEMM', 'broadcasts', 'memory ↔ communication'],
    [['串行 GEMM 的主要复用对象是什么？', '一个 A 或 B 元素被多个乘加重复使用；blocking 的目标是让复用发生在快内存。'], ['二维进程网格为什么自然？', 'C 的二维块可映射到进程网格；每个 rank 沿行/列取得所需 A、B 面板。']],
    '并行 GEMM 不是“把循环分给 p 个进程”，而是选择数据布局，使本地 GEMM 足够大，同时少广播、少复制。',
    'SUMMA', '2D data layout',
    Q('SUMMA 中计算 C(i,j) 的 rank 在每个 k 步需要什么？', ['A(i,k) 面板与 B(k,j) 面板', '完整 A、B、C', '只需要 C 的邻居块'], 0,
      ['它们构成该步的局部乘积更新。', '复制完整矩阵违背 2D 分布目标。', 'C 邻居不能替代输入面板。'],
      F('增加 2.5D replication 通常用什么换什么？', ['额外内存换更少通信', '更多消息换更少内存', '数值误差换正确性'], 0, ['复制一部分数据减少跨层通信。', '方向相反。', '算法仍应保持数学语义。'])),
    [Q('从 1D 布局转为 2D 布局通常怎样改变每 rank 通信？', ['改善渐近通信量', '必然消除所有通信', '把 GEMM 变成稀疏运算'], 0, ['二维分解提高数据复用并缩短广播范围。', '分布式 GEMM 仍需交换面板。', '矩阵仍是 dense。']), Q('只报告并行 GFLOP/s 缺少什么？', ['问题规模、rank 网格、内存占用和通信时间', '函数名', '矩阵颜色'], 0, ['这些条件决定结果是否可比较。', '不足以解释性能。', '无关。'])],
    [['为什么 2.5D 不是免费加速？', '它复制数据，减少通信但增加每 rank/集群内存，并可能增加规约成本。'], ['怎样验证进程网格选择？', '固定矩阵与 rank 数，比较网格形状、本地 GEMM 尺寸、通信时间和总时间。']],
    ['从 C 的一个块推导它需要哪些 A/B 块。', '1D、2D、2.5D 各用什么资源换什么？', '为什么 local GEMM 太小会降低效率？', '性能结果必须声明哪些布局条件？'],
    ['Homework 1 · Matrix multiplication evidence', '../homeworks/hw1-matmul.html#workbook-stage-evidence', '先在单核建立 blocking 与证据，再把同一复用模型扩展到进程网格。']);

  bank['16-dense-la'] = entry(
    'LU、QR 等分解必须在数据依赖、数值稳定性和通信成本之间同时做选择；怎样不把“更快”误写成“等价”？',
    ['factorization DAG', 'panel bottleneck', 'communication avoiding', 'stability'],
    [['LU 为什么需要 pivoting？', '选择较合适的主元以控制消元中的增长和舍入误差。'], ['QR 中 panel 与 trailing update 有何差别？', 'panel 依赖强、并行度有限；trailing update 常可转成高效 BLAS-3。']],
    'Dense LA 的关键不是公式本身，而是把依赖 DAG 重排成大块更新，同时明确重排或随机化是否改变稳定性保证。',
    '通信避免算法', 'Cost is not semantics',
    Q('CALU/TSQR 的主要系统目标是什么？', ['减少同步和数据移动', '删除数值稳定性要求', '减少矩阵维度'], 0,
      ['它们重组计算/归约树以降低通信。', '稳定性必须另行分析。', '输入问题大小未改变。'],
      F('一个算法通信更少时，下一步必须验证什么？', ['数值误差与性能条件', '只验证代码能编译', '峰值 FLOP 标签'], 0, ['速度和数值行为都属于 contract。', '编译不等于正确。', '标签不是证据。'])),
    [Q('传统 blocked LU 常见串行瓶颈是？', ['panel factorization', 'trailing GEMM', '矩阵初始化'], 0, ['panel 依赖限制并行度。', 'GEMM 通常高度并行。', '不是算法关键路径。']), Q('QR 的 backward stability 与运行时间属于？', ['两个必须分别验证的维度', '同一个指标', '都由 FLOP 数唯一决定'], 0, ['数学正确性与系统成本不可混写。', '不是。', '通信与实现也重要。'])],
    [['解释为什么更多 BLAS-3 往往更快。', '块更新提高复用和 arithmetic intensity，更能利用向量/并行单元。'], ['为什么减少 pivot communication 不能靠直接取消 pivot？', '取消会改变数值稳定性；需要算法性替代与误差证据。']],
    ['factorization DAG 如何暴露并行度？', 'panel bottleneck 从哪里来？', 'communication avoiding 改变什么、不改变什么？', '怎样同时报告 residual、growth factor 与 time？'],
    ['Homework 4 · Distributed PCG', '../homeworks/hw4-pcg.html#workbook-stage-evidence', '用 residual、迭代数、collective 时间共同证明求解器正确且可扩展。']);

  bank['17-randomized'] = entry(
    '随机采样与 sketch 能显著降低数据和通信，但结论只以概率成立；怎样正确解释精度、失败概率和重复实验？',
    ['random sketch', 'probabilistic guarantee', 'load balance', 'uncertainty'],
    [['“高概率成立”缺少哪个必要量？', '失败概率 δ，以及它如何随维度、样本量和重复次数变化。'], ['随机算法为什么要固定 seed？', '便于复现和隔离实现变化；最终还应跨多个 seed 报告分布。']],
    '随机化把确定性工作换成概率保证；工程报告必须同时给出成本分布与误差/失败分布。',
    '随机抽样与负载均衡', 'Probability is part of the contract',
    Q('一次随机实验成功，能否证明失败概率很小？', ['能', '不能，需要理论界或跨 seed 统计', '只要速度快就能'], 1,
      ['单样本无法估计尾部。', '需要与声明的概率保证对应。', '速度不证明正确概率。'],
      F('比较两个 sketch size 时应固定什么？', ['输入、误差指标与 seed 方案', '只固定图表颜色', '什么都不固定'], 0, ['控制变量才能归因。', '无关。', '无法解释。'])),
    [Q('balls-into-bins 的最大负载为何重要？', ['决定并行完成时间由最慢 worker 主导', '决定浮点格式', '只影响平均值'], 0, ['尾部负载决定 makespan。', '无关。', '最大值而非平均值是关键。']), Q('增加样本量通常怎样影响？', ['成本上升、误差/方差下降', '成本和误差都必然下降', '保证变成 exact'], 0, ['典型 bias/variance-cost trade-off。', '成本不会免费下降。', '有限采样仍是概率结论。'])],
    [['为什么平均运行时间不足？', '随机负载和算法可能有长尾，应报告分位数或置信区间。'], ['怎样写 randomized algorithm 的 Definition of Done？', '正确性容差、失败概率/seed 方案、性能分布和复现配置。']],
    ['概率保证中的 ε、δ 分别表达什么？', '为什么要跨 seed？', '最大负载为何比平均负载更决定并行时间？', '采样量改变哪些质量与成本？'],
    ['Project · Experimental methodology', '../projects/index.html#workbook-stage-experiment', '把 seed、uncertainty 和失败边界写进 proposal，而不是只展示最好一次结果。']);

  bank['18-structured-grids'] = entry(
    '规则网格看似容易并行，但局部 stencil、halo 和全局收敛形成不同通信尺度；怎样从一次迭代推导瓶颈？',
    ['domain decomposition', 'stencil', 'halo exchange', 'convergence'],
    [['为什么子域要有 halo？', '边界 stencil 依赖相邻 rank 拥有的网格值。'], ['Jacobi 的新旧数组为什么常分开？', '一次迭代必须统一读取旧状态，避免原地更新改变算法语义。']],
    '结构网格的每步成本由局部 stencil 与表面积通信组成；总求解时间还乘上收敛所需迭代数。',
    '并行 Jacobi 方法', 'Per-step vs time-to-solution',
    Q('弱扩展中每 rank 网格固定，为什么效率仍可能下降？', ['全局规约和通信距离/拥塞仍随规模变化', '每 rank FLOPs 自动变零', 'halo 不再存在'], 0,
      ['局部工作固定不代表全局同步成本固定。', '局部计算仍在。', '分区边界仍需交换。'],
      F('比较两个 solver 时应优先比较？', ['达到相同 residual 的 time-to-solution', '单次迭代最短即可', '迭代次数越多越好'], 0, ['统一收敛目标才公平。', '快迭代可能收敛很慢。', '相反。'])),
    [Q('二维方形子域扩大边长时，计算/halo 比如何变化？', ['随边长改善', '保持零', '必然恶化'], 0, ['体积 O(n²)，边界 O(n)。', '不是。', '方向相反。']), Q('multigrid 中 coarse grid 容易出现什么并行问题？', ['并发度下降、通信占比上升', 'FLOPs 无限增加', '不再需要同步'], 0, ['粗层单元少，rank 过多。', '不是无限。', '仍可能有全局/邻域通信。'])],
    [['为什么只优化 stencil kernel 可能不改善求解时间？', '全局规约、halo 或迭代次数可能主导。'], ['解释 surface-to-volume ratio。', '分区计算随体积增长，通信随边界面积增长；更大更规则的子域通常更有利。']],
    ['一次 stencil 更新读写哪些对象？', 'halo 宽度由什么决定？', '每步时间与 time-to-solution 的区别？', 'multigrid 粗层为什么难扩展？'],
    ['Homework 2 · Domain decomposition', '../homeworks/hw2-2-mpi.html#workbook-stage-decompose', '在粒子域分解中测量 ghost exchange，并用相同 surface/volume 模型解释 scaling。']);

  bank['19-sparse-mv'] = entry(
    'SpMV FLOPs 很少、访存不规则；怎样从稀疏格式和非零分布解释带宽、负载和通信，而不只看 nnz？',
    ['sparse format', 'irregular gathers', 'load balance', 'global reductions'],
    [['CSR 的 row pointer 表达什么？', '每行非零元素在 column/value 数组中的起止偏移。'], ['SpMV 为什么常 memory-bound？', '每个非零只做少量运算，却要读 value、index 和不规则 x。']],
    'SpMV 的工作量近似跟 nnz 走，但时间由 bytes、x 的复用、行长分布和跨 rank 依赖共同决定。',
    '稀疏矩阵向量乘法', 'nnz is not enough',
    Q('两个 rank 各有相同行数就一定负载均衡吗？', ['是', '否，行 nnz 可高度不同', '只要使用 CSR 就是'], 1,
      ['稀疏工作量由非零和访问模式决定。', '应按 nnz/成本划分并测尾部。', '格式不自动均衡。'],
      F('最直接的诊断是？', ['画每 rank nnz、时间和等待分布', '只看总 nnz', '换变量名'], 0, ['把负载与 makespan 对齐。', '总量掩盖分布。', '无关。'])),
    [Q('s-step Krylov 试图减少什么？', ['全局同步频率', '矩阵非零数', '解向量长度'], 0, ['批量推进迭代，减少 reductions。', '输入不变。', '维度不变。']), Q('减少同步的代价可能包括？', ['额外本地计算/存储和数值稳定性风险', '必然 exact', '消除所有 halo'], 0, ['communication avoidance 是资源与稳定性的交换。', '不保证。', '邻域依赖仍可能存在。'])],
    [['为什么 bytes/nonzero 比 FLOPs/nonzero 更能解释 SpMV？', '低 arithmetic intensity 下，索引和值与 x 的数据移动主导。'], ['怎样公平比较 CSR 与另一格式？', '固定矩阵、精度、ordering 和硬件，报告存储量、吞吐、带宽与 preprocessing。']],
    ['CSR 三个数组的 contract？', '行数相等为何不等于负载均衡？', 'SpMV 的 arithmetic intensity 为什么低？', 's-step 用什么换同步？'],
    ['Homework 4 · PCG evidence', '../homeworks/hw4-pcg.html#workbook-stage-evidence', '把 SpMV、halo、AllReduce 和 residual 拆开 profile，解释 PCG 的真正瓶颈。']);

  bank['20-fft'] = entry(
    'FFT 把 O(n²) DFT 降到 O(n log n)，但分布式转置可能主导；怎样把计算分解与 data redistribution 放在一张图里？',
    ['Cooley–Tukey', 'local FFTs', 'global transpose', 'decomposition'],
    [['FFT 的蝶形在复用什么？', '把偶/奇或因子分解后的子问题结果用 twiddle factor 组合。'], ['三维 FFT 为什么常需 transpose？', '要让当前变换维在本地连续，需要在进程间重新分布 pencil/slab。']],
    '分布式 FFT 的局部计算很快且规则；扩展上限往往由几次全局重分布的消息量、拥塞和布局决定。',
    '三维 FFT', 'Compute is not the whole algorithm',
    Q('把本地 FFT kernel 加速 2×，总时间一定接近 2× 吗？', ['一定', '不一定，transpose/All-to-All 可能主导', '只在单精度不成立'], 1,
      ['Amdahl 定律限制整体收益。', '需先分解 compute 与 communication。', '和精度没有这种简单关系。'],
      F('验证瓶颈最直接的方法？', ['分别计时 local FFT、pack/unpack、network transpose', '只看总 GFLOP/s', '删除同步'], 0, ['阶段分解可定位主导项。', '无法归因。', '可能破坏正确性。'])),
    [Q('slab decomposition 的并行度主要受什么限制？', ['某一网格维度大小', '浮点指数位', 'CPU 主频'], 0, ['slab 数不能无限超过切分维。', '无关。', '不是布局上限。']), Q('pencil decomposition 的典型 trade-off？', ['支持更多 ranks，但需更复杂/更多重分布', '不需要网络', '复制完整三维数组'], 0, ['二维进程网格提升并发度。', '仍需通信。', '通常不是完整复制。'])],
    [['用 Amdahl 定律解释 FFT kernel 优化上限。', '若 transpose 占比 f，未优化部分直接限制总加速比。'], ['为什么 All-to-All 对拓扑敏感？', '大量 rank 同时交换，链路竞争、路由和 placement 会改变有效带宽。']],
    ['Cooley–Tukey 如何降低复杂度？', '3D FFT 为什么需要 redistribution？', 'slab 与 pencil 的扩展边界？', '如何做阶段级性能证据？'],
    ['Project · Communication profile', '../projects/index.html#workbook-stage-experiment', '把 local compute 与 redistribution 分开计时，避免把 kernel 峰值当成应用加速。']);

  bank['22-graph-algorithms'] = entry(
    '图算法 frontier 动态、度分布长尾、访问不规则；如何在 work、span、通信和方向选择之间建立可迁移模型？',
    ['frontier', 'irregular work', 'push vs pull', 'load balance'],
    [['BFS frontier 是什么？', '当前层已发现、下一步要扩展邻边的顶点集合。'], ['图算法为何不适合只按顶点数分区？', '度数和边分布可能极不均匀，工作与通信更接近边。']],
    '并行图算法的单位不是“一个顶点”，而是动态 frontier 上的边访问；方向、分区和粒度必须随 frontier 形态变化。',
    '方向优化 BFS', 'Push vs pull',
    Q('frontier 很大时 pull BFS 可能更优，为什么？', ['未访问顶点可尽早找到任一 frontier 邻居并停止', 'pull 不读边', 'pull 自动复制全图'], 0,
      ['大 frontier 提高早停概率并减少重复写竞争。', '仍需检查入邻边。', '不要求全图复制。'],
      F('frontier 很小时通常优先？', ['push，从少量活跃顶点出发', '始终 pull', '排序全部顶点'], 0, ['工作与活跃边成比例。', '会扫描大量未访问顶点。', '无必要。'])),
    [Q('按顶点均分后仍慢，首要检查？', ['每 rank 边数、frontier 边和等待时间', '顶点 ID 字体', 'FLOP 峰值'], 0, ['长尾度数导致工作倾斜。', '无关。', '图遍历常不是 FLOP-bound。']), Q('top-down BFS 的并发写风险来自？', ['多个父节点同时发现同一顶点', '所有边权相同', '队列长度为零'], 0, ['需原子/幂等 visited 协议。', '无关。', '非空 frontier 才扩展。'])],
    [['为什么 power-law graph 特别容易负载不均？', '少量高阶顶点贡献大量边，平均度掩盖长尾。'], ['怎样判断方向切换阈值？', '基于 frontier 边量、未访问顶点/边量，并用同图族基准验证。']],
    ['frontier 如何改变每轮工作？', 'push/pull 分别扫描什么？', '顶点平衡为何不等于边平衡？', '访问冲突怎样保持 BFS 层级正确？'],
    ['Project · Irregular parallelism', '../projects/index.html#workbook-stage-experiment', '用 workload distribution 和 tail latency 证明图优化，而不只报告平均 TEPS。']);

  bank['23-selection-sorting'] = entry(
    '分布式排序的本地 sort 很容易，难点是 splitter 能否产生平衡 bucket；如何从采样误差推导通信尾部？',
    ['local sample', 'splitters', 'all-to-all', 'bucket balance'],
    [['sample sort 的 splitter 决定什么？', '把全局 key 范围划成 buckets，决定每个 rank 最终接收的数据量。'], ['为什么平均 bucket 大小不够？', '总时间由最大 bucket 的通信和本地排序决定。']],
    '并行排序的 correctness 是全局顺序；scalability 则由最坏 bucket 而不是平均 bucket 决定。',
    'Sample Sort', 'Tail load decides time',
    Q('输入高度偏斜时，均匀抽样不足可能造成什么？', ['splitter 偏差和单个超大 bucket', '自动稳定排序', 'All-to-All 消失'], 0,
      ['样本未代表 CDF，分区失衡。', '稳定性是另一属性。', '仍需交换。'],
      F('提高 oversampling 的典型代价？', ['更多采样/选择成本换更好平衡概率', '删除所有比较', '必然减少内存'], 0, ['这是 balance-quality trade-off。', '排序仍需比较。', '样本本身增加资源。'])),
    [Q('验证全局排序不能只检查每 rank 内有序，还需？', ['相邻 rank 边界满足 max_i ≤ min_{i+1}', '所有 rank 大小相等', 'key 必须唯一'], 0, ['局部有序加跨 rank 边界才推出全局有序。', '正确性不要求完全等大。', '重复 key 合法。']), Q('All-to-All 后性能长尾最可能由？', ['最大接收 bucket 与网络拥塞', '比较器名字', 'HTML 缓存'], 0, ['makespan 取决于最慢 rank。', '无关。', '无关。'])],
    [['构造一个局部有序但全局错误的反例。', 'rank0=[1,100]，rank1=[2,3]；两边内部有序，但边界 100>2。'], ['怎样报告 sample sort 平衡质量？', 'max/mean bucket、分位数、exchange bytes/time，并跨分布/seed。']],
    ['splitter 与 bucket 的因果关系？', '局部有序为何不够？', 'oversampling 用什么换平衡？', '为什么最大 bucket 决定并行时间？'],
    ['Project · Controlled experiments', '../projects/index.html#workbook-stage-experiment', '用多种输入分布和 seed 检验算法，而不是只在均匀随机数据上成功。']);

  bank['24-comp-biology'] = entry(
    '基因组组装把字符串转成巨大图；如何让 k-mer 表示、分布式哈希和通信协议同时保持生物语义与可扩展性？',
    ['k-mers', 'de Bruijn graph', 'distributed hash', 'contigs'],
    [['k-mer 的节点/边语义取决于什么？', '具体 de Bruijn 表示约定：常见做法用 (k−1)-mer 为节点、k-mer 为边，或用 k-mer 为节点并按 overlap 连边。'], ['canonical k-mer 为什么有用？', '将序列与 reverse complement 归一化，减少重复表示；但 strand/orientation 仍需记录。']],
    '并行 genome pipeline 的 correctness 先由 k-mer/方向约定决定；hash 和通信只是实现这套图语义的系统机制。',
    '并行基因组组装', 'Representation before optimization',
    Q('直接 hash canonical k-mer 而不保存 orientation 可能丢失什么？', ['原序列方向信息', 'MPI rank 数', 'k 的数值'], 0,
      ['canonicalization 合并正反互补，恢复路径时仍需方向。', '无关。', 'k 已知。'],
      F('优化前最小 sanity check 应包含？', ['短 read 的手算 k-mer、reverse complement 和边', '只跑最大数据集', '只测网络带宽'], 0, ['先验证表示语义。', '难以定位错误。', '不证明图正确。'])),
    [Q('分布式 hash 的 owner function 必须具备？', ['所有 rank 一致且 deterministic', '每次随机改变', '只在 rank0 可计算'], 0, ['否则相同 key 无法路由到同一 owner。', '会破坏查找。', '会形成中央瓶颈。']), Q('大量逐个 remote lookup 慢的主要原因？', ['每个请求支付 latency，粒度太小', 'hash 没有比较', 'DNA 只有四种字符'], 0, ['应批量/聚合以摊薄启动成本。', '不是原因。', '字母表小不消除 key 数。'])],
    [['解释 de Bruijn graph 的一个具体表示约定。', '例如 k-mer 为边，prefix/suffix (k−1)-mer 为节点；必须全流程一致。'], ['为什么吞吐高不证明 assembly 正确？', '还需 contig/图结构、read coverage、reference 或官方 correctness tests。']],
    ['k-mer 与 de Bruijn graph 的对象关系？', 'canonicalization 改变和不改变什么？', 'owner function 的 invariant？', '批量通信为什么重要？'],
    ['Homework 3 · Genome assembly', '../homeworks/hw3-genome.html#workbook-stage-build', '先用 tiny reads 验证图语义，再用 UPC++ 证明 owner、batching 和 scaling。']);

  bank['25-graph-partitioning'] = entry(
    '图分区同时追求平衡与少切边，这两个目标常冲突；如何把“好分区”写成可测目标而非视觉判断？',
    ['vertex/edge weights', 'balance constraint', 'edge cut', 'migration cost'],
    [['edge cut 近似表示什么成本？', '跨分区边可能引起的通信；真实成本还取决于访问频率与消息聚合。'], ['balance 应按什么定义？', '应按真实工作/存储权重，不一定是顶点个数。']],
    '分区是多目标优化：先声明平衡约束，再在约束内降低通信代理，并把 repartition migration 也计入。',
    '图划分', 'Balance is a constraint',
    Q('edge cut 更低的分区一定更快吗？', ['一定', '不一定，可能严重失衡或迁移代价更高', '只在无向图一定'], 1,
      ['通信只是总时间的一部分。', '需同时看 balance、通信模式和动态成本。', '无向也不保证。'],
      F('公平比较两个 partitioner 应固定？', ['平衡容差、图、权重与运行条件', '只固定颜色', '只固定输出文件名'], 0, ['否则 cut 改善可能来自放松约束。', '无关。', '无关。'])),
    [Q('按顶点数完美平衡但仍慢，最可能？', ['顶点权重/度数不均或通信热点', '图一定错误', 'CPU 没有 cache'], 0, ['真实工作与通信不由顶点数唯一决定。', '不一定。', '不成立。']), Q('动态重分区是否越频繁越好？', ['否，迁移和停顿可能超过收益', '是', '与图变化无关'], 0, ['需要 amortization window。', '不是免费。', '变化速度是核心。'])],
    [['为什么 edge cut 只是通信 proxy？', '消息可聚合，边访问频率不同，拓扑/placement 也影响实际代价。'], ['如何决定何时 repartition？', '估计剩余运行阶段可节省的时间是否超过分区与迁移成本。']],
    ['balance 的权重应来自哪里？', 'edge cut 与实际通信的差异？', '为什么低 cut 不能覆盖负载失衡？', '动态分区如何做成本收益判断？'],
    ['Project · Multi-objective evidence', '../projects/index.html#workbook-stage-experiment', '把 objective、constraint、proxy 与真实 time-to-solution 分开报告。']);

  bank['25b-work-stealing'] = entry(
    '动态任务大小未知时，静态分配会留下空闲核；work stealing 如何用少量调度开销逼近关键路径，同时保持任务语义？',
    ['task DAG', 'local deque', 'steal', 'grain size'],
    [['work 与 span 分别是什么？', 'work T₁ 是总操作量；span T∞ 是 DAG 最长依赖路径。'], ['为何 owner 与 thief 常操作 deque 两端？', '减少竞争：owner 在一端处理细粒度本地任务，thief 从另一端取较大/较旧任务。']],
    'Work stealing 把负载发现推迟到运行时；收益来自减少 idle time，代价是调度、同步、迁移和 locality 损失。',
    'Work Stealing', 'Grain size',
    Q('把任务拆得无限小为什么不会无限加速？', ['调度/同步开销和 locality 损失会主导', '因为任务不能执行', '因为 span 自动变大到无穷'], 0,
      ['粒度必须足够摊薄 runtime overhead。', '任务仍可执行。', 'span 可能受 DAG 影响，但不是必然无穷。'],
      F('发现大量 steal 但 CPU 仍空闲，优先检查？', ['任务粒度、关键路径和 victim 分布', '只提高日志级别', '把全部任务放一个 deque'], 0, ['steal 数高不等于获得足够工作。', '不解决原因。', '会加重瓶颈。'])),
    [Q('理想调度时间下界近似？', ['max(T₁/P, T∞)', 'T₁×P', 'T∞/P²'], 0, ['资源下界与依赖下界取最大。', '方向错误。', '依赖路径不能被任意并行化。']), Q('stealing 可能损害哪类性能？', ['cache/NUMA locality', '数学正确性必然失效', '输入规模'], 0, ['任务迁移可能远离数据。', '正确 runtime 不应改变结果。', '输入不变。'])],
    [['构造 work 很大但 span 也很大的例子。', '大量任务被一条串行依赖链生成或汇合；总工作可多，关键路径仍限制加速。'], ['如何选择 cutoff？', '测任务成本、调度开销、steal/idle 与 locality；选择能摊薄开销又提供足够并发的粒度。']],
    ['T₁、T∞、P 如何共同给出下界？', 'deque 两端设计减少什么冲突？', '粒度过细/过粗各错在哪里？', 'steal count 为何不是目标指标？'],
    ['Project · Dynamic load balance', '../projects/index.html#workbook-stage-experiment', '把 work/span、idle、steal 和 locality 一起测，避免把调度活动量当成有效加速。']);

  bank['26-nbody-hierarchical'] = entry(
    'N-body 精确两两相互作用是 O(n²)；树算法如何用可控近似减少工作，并在并行时处理不均匀空间分布？',
    ['spatial tree', 'far-field approximation', 'θ / expansion order', 'domain balance'],
    [['Barnes–Hut 的核心近似是什么？', '把足够远的一簇粒子用聚合质量/多极表示代替逐粒子相互作用。'], ['开角 θ 控制什么？', '接受远场聚合节点的严格程度：阈值约定需按实现声明，通常更严格意味着更多工作和更小误差。']],
    '层次 N-body 用误差预算换工作量；并行性能还由树构建、交互列表和空间聚簇造成的负载/通信决定。',
    'Barnes–Hut 算法', 'Approximation contract',
    Q('只报告比 direct O(n²) 快，为什么不够？', ['必须在同一误差/物理量容差下比较', 'direct 方法没有答案', '树算法必然 exact'], 0,
      ['近似强度不同会改变工作和误差。', 'direct 是参考基线。', '树算法一般是近似。'],
      F('调大近似容忍度后速度变快，报告还必须包含？', ['force/energy error 与配置', '只写 speedup', '删除 direct baseline'], 0, ['质量-成本曲线才可解释。', '缺少正确性条件。', '小规模 baseline 很重要。'])),
    [Q('均匀按空间体积分区一定平衡吗？', ['否，粒子可能高度聚簇', '一定', '只要是 3D 一定'], 0, ['工作跟粒子和交互列表分布走。', '不成立。', '维度不消除偏斜。']), Q('FMM 相比 Barnes–Hut 的关键扩展？', ['系统处理源与目标簇的多极/局部展开以获得更强复杂度保证', '删除近似', '只适用于一个粒子'], 0, ['通过层次展开传播远场。', '仍是可控近似。', '相反，面向大规模。'])],
    [['为什么 θ 的数值不能脱离具体 acceptance convention 解读？', '不同代码可能用 s/d<θ 或等价变形；“变大更严格”并非跨实现普遍。'], ['怎样做 N-body weak scaling？', '保持每 rank 粒子数和误差目标，报告树构建、通信、交互与总时间，并描述分布。']],
    ['direct 与 hierarchical N-body 的工作量差异？', '近似参数如何连接误差与成本？', '空间均分为何不保证工作均衡？', 'time-to-solution 报告必须包含哪些阶段？'],
    ['Project · End-to-end parallel evidence', '../projects/index.html#workbook-stage-experiment', '把近似误差、树阶段、通信与 load distribution 写成一套可复现实验。']);
})();
