(function () {
  const bank = window.CS267PracticeBank || {};
  const depth = {
    '01-introduction': ['让 90% 工作可并行、10% 串行；先手算 1、8、无限核心的时间上界，再讨论现实开销。', '为什么不是“核心数就是 speedup”：串行关键路径、通信和等待都不会随核心数自动消失。'],
    '02-memory-hierarchies': ['用两个 cache line 容量的数组，比较顺序扫描、跨行 stride 和重复读取同一小 tile 的流量。', '为什么不是“能装进 cache 就快”：只有在驱逐前复用，容量才转化为更少下层流量。'],
    '03-matmul-roofline': ['给一个 8 FLOP、搬 16 byte 的 tiny kernel，先算 AI=0.5 FLOP/byte，再分别套带宽与计算 roof。', '为什么不是只看峰值 FLOP/s：低 AI kernel 根本没有足够独立算术让计算单元成为限制。'],
    '04-shared-memory': ['两个线程各执行一次 x=x+1，枚举 load/load/store/store 交错，观察最终值为何可能只增加 1。', '为什么不是“单条 store 原子就安全”：read-modify-write 是多步状态转换，不变量可在步骤间被并发破坏。'],
    '05-locality-1': ['把 6 个粒子放进 3 个 cell，逐粒子列出真正需要检查的相邻 cell 与候选 pair。', '为什么不是把 cell 无限做小：候选可能下降，但邻居格数量、索引和不规则访问成本会上升。'],
    '06-locality-2': ['在 4×4 网格上切成左右两个子域，圈出 interior、boundary 和一层 halo，手算计算点与交换点。', '为什么不是每一步交换整个子域：跨分区依赖只来自切口附近，额外传输不会改变数学结果。'],
    '06b-comm-avoiding': ['比较一次传 8 个数和分 8 次各传 1 个数：bytes 相同，但 α 启动成本被支付的次数不同。', '为什么不是只减少总 bytes：消息数量和同步轮数会让 latency 项主导小消息通信。'],
    '07-distributed-memory': ['用 2 ranks 各持一个标量，手推 send/recv、broadcast、reduce 和 all-reduce 后每个 rank 拥有什么。', '为什么不是把 MPI 当远程共享内存：消息匹配、buffer 生命周期和数据所有权都必须显式成立。'],
    '08-advanced-mpi': ['把 4 个 ranks 排成 2×2 网格，手推一次行 broadcast 与列 reduce 的参与者和通信边。', '为什么不是一个全局 communicator 解决全部问题：拓扑子通信器能表达局部所有权并缩小集体操作范围。'],
    '09-cuda-intro': ['一个 warp 访问连续 32 个 float，再访问 stride-32 的 32 个 float，比较需要覆盖的内存区间。', '为什么不是“线程多就隐藏一切”：低 occupancy、依赖链和非合并访问都可能让可运行 warp 不足。'],
    '10-data-parallel': ['让 8 lanes 执行条件分支，其中 4 个走 A、4 个走 B；手推 SIMT 需要串行执行几条路径。', '为什么不是每个 GPU thread 都是独立 CPU：warp 共享指令发射，控制流分歧会掩码串行化路径。'],
    '11-upc': ['把 8 个元素按 block-cyclic 分给 2 个线程，标出 local 与 remote access，并统计一次遍历的远端比例。', '为什么不是全局地址空间等于统一延迟：语法统一了命名，数据所在节点仍决定通信成本。'],
    '12-ml-supervised': ['用两条样本、一维参数手算 prediction、loss、gradient 和一次 update，明确每个 tensor 的角色。', '为什么不是训练 loss 越低模型越好：泛化取决于未见数据，模型可记住训练集噪声。'],
    '13-ray': ['两个远程 task，一个依赖另一个输出；画出 object ref、调度依赖和实际数据移动。', '为什么不是“remote”装饰器自动提供并行：依赖链、对象传输和 task 粒度仍决定关键路径。'],
    '14-ml-unsupervised': ['给 4 个二维点和 2 个中心，手算一次 assignment 与 center update，观察目标函数为何不增。', '为什么不是随机初始化无关紧要：非凸目标可收敛到不同局部解，聚类标签也没有预先语义。'],
    '15-parallel-matmul': ['把 4×4 矩阵切到 2×2 process grid，标出每个 rank 初始 A/B/C block 与一次广播后的状态。', '为什么不是一维切分永远足够：随进程数增加，单维复制或广播会让通信/内存项恶化。'],
    '16-dense-la': ['在 3×3 消元上标出 panel、pivot 与 trailing update，区分串行依赖和大规模并行 GEMM。', '为什么不是所有步骤都并行：下一 panel 依赖前一次更新，但 trailing matrix 内部有大量并行工作。'],
    '17-randomized': ['从 4×3 矩阵用一个随机向量取样到低维，再检查保留的是精确元素还是近似子空间信息。', '为什么不是随机化等于随便猜：概率保证依赖分布、样本数和误差界，且通常保留结构而非逐元素精确。'],
    '18-structured-grids': ['对 5 点 stencil 在 4×4 tile 上圈出内部、边界和 halo，手算一次 update 读哪些点。', '为什么不是只优化 FLOPs：stencil 每点算术少、邻域读取多，数据复用和边界通信常更关键。'],
    '19-sparse-mv': ['给一行只有两个非零元的 CSR，逐数组读取 rowptr、colind、values 与 x，算出 y 的一个元素。', '为什么不是稀疏就一定快：索引、随机 x 访问和行长不均会抵消减少的 FLOPs。'],
    '20-fft': ['对 4 点 DFT 展开偶数/奇数项，亲手得到两个 2 点 DFT 与 twiddle 组合。', '为什么不是把 DFT 矩阵直接并行乘：FFT 利用重复子结构把总工作从平方级降到 n log n。'],
    '22-graph-algorithms': ['在 6 节点图上做一层 BFS frontier，分别列出 top-down 扩展边与 bottom-up 检查未访问点。', '为什么不是一种 traversal 方向适合全程：frontier 稀疏和稠密时，扫描无效边的比例完全不同。'],
    '23-selection-sorting': ['把 8 个键分到 2 个 ranks，本地排序后手推一次 splitter 如何决定 bucket 与 all-to-all 流量。', '为什么不是本地排序完成就结束：全局顺序还要求跨 rank 重分布，并处理 splitter 导致的负载不均。'],
    '24-comp-biology': ['用两条短字符串画动态规划表，标出一个 cell 依赖的左、上、左上三个状态与 wavefront。', '为什么不是按行完全并行：同一行 cell 依赖左邻居，合法并行方向来自反对角线。'],
    '25-graph-partitioning': ['把 6 节点图切成两份，分别计算 vertex balance 与 cut edges，比较两个候选分区。', '为什么不是只最小化 edge cut：极度不平衡的分区通信小却几乎没有并行吞吐。'],
    '25b-work-stealing': ['两个 worker：A 有 4 个递归任务、B 为空；手推 owner 从底部取、thief 从顶部偷如何减少竞争。', '为什么不是全局队列最简单也最好：它集中所有 push/pop，随 worker 增加会成为同步热点。'],
    '26-nbody-hierarchical': ['把 4 个远粒子聚成一个 cell，用质心近似一次作用，再与逐粒子求和比较工作与误差来源。', '为什么不是所有远处 cell 都可合并：是否接受近似取决于 cell 尺寸与距离的 opening criterion。']
  };
  Object.entries(depth).forEach(([id, [toy, whyNot]]) => {
    if (!bank[id]) return;
    bank[id].reasoning = { toy, whyNot };
  });
})();
