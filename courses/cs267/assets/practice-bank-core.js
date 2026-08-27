(function () {
  const bank = window.CS267PracticeBank = window.CS267PracticeBank || {};
  const Q = (prompt, options, answer, explanations, followUp) => [prompt, options, answer, explanations, followUp];
  const F = (prompt, options, answer, explanations) => Q(prompt, options, answer, explanations);

  bank['01-introduction'] = {
    problem: '当单核频率不再持续增长时，怎样把“更多硬件”转化为真实、更快且仍然正确的程序？',
    map: ['并行资源', '任务与数据依赖', '通信/同步', '性能与扩展性'],
    before: [
      ['加速比 \(S_p\) 的分子和分母分别是什么？', '\(S_p=T_1/T_p\)。它比较同一问题在一个处理单元和 \(p\) 个处理单元上的时间。'],
      ['更多核心为什么不保证等比例加速？', '串行部分、通信、同步、负载不均衡和内存瓶颈都会让新增核心等待。']
    ],
    mental: '并行计算不是“把循环切成 p 份”，而是同时管理可并行工作、数据移动、同步与负载平衡。',
    check: {
      after: '并行计算基础概念', label: 'Speedup 的分母',
      question: Q('一个程序在 1 核用 100 秒，在 8 核用 20 秒。哪组结论正确？',
        ['speedup=8，efficiency=100%', 'speedup=5，efficiency=62.5%', 'speedup=0.2，efficiency=2.5%'], 1,
        ['这把处理器数量误当成实际加速比。', '\(S_8=100/20=5\)，效率为 \(5/8=62.5\%\)。', '加速比的方向写反了。'],
        F('若 16 核时间仍是 20 秒，效率是多少？', ['31.25%', '50%', '80%'], 0,
          ['\(E=S/p=5/16=31.25\%\)。', '没有把处理器数从 8 更新为 16。', '效率不是串行时间占比。']))
    },
    deep: [
      Q('某优化让每个核心计算更快，却增加了全局同步次数。下面哪项最可靠？',
        ['总时间一定下降', '总时间可能上升，需要分解 compute 与 synchronization', '核心越多越能抵消同步'], 1,
        ['忽略了同步进入关键路径。', '并行性能必须看关键路径和开销，而不只看局部 kernel。', '同步成本常随规模上升，不会自动消失。']),
      Q('弱扩展实验保持什么不变？', ['总问题规模', '每个处理单元的工作量', '总运行时间必然为常数'], 1,
        ['这是强扩展的设置。', '弱扩展随处理单元增加而同比放大问题，使每个处理单元工作量近似不变。', '通信增长仍可能让时间上升。'])
    ],
    open: [
      ['不用公式解释为什么 speedup 可能小于 1。', '并行版本新增了线程/进程启动、通信、同步、调度与更差局部性；若节省的计算小于这些开销，就会变慢。'],
      ['举例说明“算法更少 FLOPs”仍可能更慢。', '若它需要更不规则的数据访问或更多通信，性能会受带宽与延迟限制；FLOPs 不是唯一资源。']
    ],
    explain: ['speedup 与 parallel efficiency 的对象分别是什么？', '强扩展和弱扩展分别固定什么？', '为什么通信和同步属于算法设计的一部分？', '为什么并行性能必须用测量证据而不是核心数推断？'],
    bridge: ['Homework 1 · Measure & Model', '../homeworks/hw1-matmul.html#workbook-stage-baseline', '先建立可信 baseline，再用 Roofline 和计时证据解释每次优化。']
  };

  bank['02-memory-hierarchies'] = {
    problem: '处理器能很快地做算术，但数据到得不够快；怎样利用局部性让计算单元不再饿死？',
    map: ['地址访问', 'cache line', '时间/空间局部性', 'blocking 与 reuse'],
    before: [
      ['延迟和带宽有什么区别？', '延迟是一次访问等待多久；带宽是稳定传输时单位时间能搬多少数据。'],
      ['为什么连续访问通常优于随机访问？', '连续地址能共享 cache line、预取与内存事务，减少每个元素的元数据和等待成本。']
    ],
    mental: 'Cache 优化的核心不是“让缓存更大”，而是让一次搬入的数据在被驱逐前完成更多有用工作。',
    check: {
      after: '内存层次结构', label: 'Locality vs capacity',
      question: Q('一个 tile 能放入 L2，但每个元素只使用一次。哪项正确？',
        ['只要放得下就一定快', '容量条件满足，但没有复用就未必提高算术强度', 'L2 命中会增加 DRAM 流量'], 1,
        ['把 capacity 与 reuse 混为一谈。', '放得下只是必要条件；性能收益来自复用和更少的下层流量。', 'L2 命中通常减少而不是增加 DRAM 流量。'],
        F('tile 太大导致工作集超过 L2，最直接的风险是什么？', ['冲突/容量 miss 增加', 'FLOP 数自动减少', '向量宽度变大'], 0,
          ['数据在复用前被驱逐，流量反弹。', '分块通常不改变数学 FLOP 数。', '向量宽度由 ISA/硬件决定。']))
    },
    deep: [
      Q('循环交换提升性能最可能改变什么？', ['数学结果与 FLOP 数', '内存访问顺序与 cache line 利用率', 'CPU 的物理 cache 容量'], 1,
        ['正确重排应保持数学语义。', '循环顺序可把 stride-n 访问改成 stride-1。', '软件不能改变物理容量。']),
      Q('预取最适合隐藏哪一类成本？', ['依赖链中的算术延迟', '可预测的未来内存访问延迟', '所有同步等待'], 1,
        ['预取不改算术依赖。', '它把可预测的数据请求提前发出。', '同步需要算法或运行时层面的处理。'])
    ],
    open: [
      ['用一个 2×3 数组解释 row-major 下的 stride-1。', '同一行相邻列在线性地址中相邻；内层遍历列可连续消费 cache line。'],
      ['为什么“cache miss 少”仍不保证总时间更短？', '可能增加了指令、分支、打包、同步或失去向量化；需要同时测量总时间和资源流量。']
    ],
    explain: ['时间局部性和空间局部性有什么不同？', '为什么 working set 放得下不等于存在 reuse？', 'blocking 如何减少下层内存流量？', '为什么循环顺序能改性能却不改 FLOP 数？'],
    bridge: ['Homework 1 · Optimize the hierarchy', '../homeworks/hw1-matmul.html#workbook-stage-locality', '用 tiny matrix 验证列主序，再逐层测量 blocking、packing 与 register reuse。']
  };

  bank['03-matmul-roofline'] = {
    problem: '一个 kernel 慢，到底应该继续减少数据移动，还是已经该优化算术流水线？',
    map: ['FLOPs', 'bytes moved', 'arithmetic intensity', 'bandwidth/compute roofs'],
    before: [
      ['FLOP/s 与 FLOP 有什么区别？', 'FLOP 是工作量；FLOP/s 是完成工作的速率。'],
      ['算术强度的单位是什么？', 'FLOP/byte：每从目标内存层移动一个 byte，完成多少浮点运算。']
    ],
    mental: 'Roofline 不是性能预测器，而是资源上界账本：先问数据从哪一层来，再比较带宽屋顶与计算屋顶。',
    check: {
      after: 'Roofline 性能模型', label: '先算两个上界',
      question: Q('峰值 1 TFLOP/s、带宽 100 GB/s、AI=4 FLOP/byte。Roofline 上界是多少？',
        ['400 GFLOP/s', '1 TFLOP/s', '25 GFLOP/s'], 0,
        ['带宽屋顶为 \(4\times100=400\) GFLOP/s，小于计算峰值。', '忽略了带宽屋顶。', '把乘法写成了除法。'],
        F('同机 AI 提升到 20 FLOP/byte，上界是多少？', ['500 GFLOP/s', '1 TFLOP/s', '2 TFLOP/s'], 1,
          ['带宽屋顶是 2 TFLOP/s，不是 0.5。', '取 1 TFLOP/s 与 2 TFLOP/s 的较小值。', '可达上界不能超过计算峰值。']))
    },
    deep: [
      Q('实测点远低于两条 roof，能直接断言 kernel memory-bound 吗？',
        ['能，只要 AI 较低', '不能，还可能受延迟、指令、并行度或同步限制', '能，因为 Roofline 给出精确时间'], 1,
        ['低 AI 只说明带宽屋顶更低，不证明已打满带宽。', 'Roofline 是上界，实际点可能因多种低效落在屋顶下。', 'Roofline 不是精确性能模型。']),
      Q('把数据来源从 DRAM 改成 L2 时，什么必须重新定义？', ['数学 FLOP 数', 'bytes 的统计边界与相应带宽 roof', '矩阵维度'], 1,
        ['算法 FLOP 数通常不变。', '不同内存层有不同流量与带宽，AI 的分母边界也随之改变。', '问题形状不因模型边界改变。'])
    ],
    open: [
      ['闭卷推导 ridge point。', '令带宽屋顶 \(AI\cdot B_{peak}\) 与计算屋顶 \(P_{peak}\) 相等，得到 \(AI=P_{peak}/B_{peak}\)。'],
      ['为什么一个 kernel 可以同时有 DRAM、L2 和 L1 Roofline？', '数据在每层的移动量和该层峰值带宽不同；同一算术工作可受到不同层的上界。']
    ],
    explain: ['Roofline 中两个 roof 分别来自哪里？', '为什么 AI 必须声明 bytes 的层级边界？', 'ridge point 如何推导？', '为什么低于 roof 不等于已经诊断出唯一瓶颈？'],
    bridge: ['Homework 1 · Evidence loop', '../homeworks/hw1-matmul.html#workbook-stage-evidence', '把 baseline、配置、测量、结果与解释放在同一个优化账本里。']
  };

  bank['04-shared-memory'] = {
    problem: '线程共享地址空间很方便，但谁能读写什么、何时可见、何时必须同步？',
    map: ['threads', 'shared/private state', 'race & false sharing', 'synchronization'],
    before: [
      ['data race 与 race condition 一样吗？', 'data race 是未同步的冲突内存访问；race condition 更广，指结果依赖不受控的执行顺序。'],
      ['barrier 保证什么？', '所有参与线程到达后才继续；它不自动修复错误的数据划分。']
    ],
    mental: '共享内存并行的第一问题不是“加 pragma”，而是为每个写入定义唯一所有者或明确归约。',
    check: {
      after: '循环并行化', label: '所有权与冲突',
      question: Q('多个线程更新同一个总和，最合适的第一选择通常是什么？',
        ['每次更新进入 critical', 'OpenMP reduction', '不加同步，最后平均'], 1,
        ['正确但通常把更新串行化。', 'reduction 给每个线程私有累加器，再高效合并。', '会产生 data race，平均也无法恢复丢失更新。'],
        F('每个线程写不同数组元素却仍很慢，优先怀疑什么？', ['false sharing', '死锁', '浮点溢出'], 0,
          ['相邻元素可能共享 cache line，引发所有权抖动。', '线程并未等待锁，症状不对应。', '溢出影响数值，不典型地造成这种扩展性下降。']))
    },
    deep: [
      Q('atomic 与 critical 的核心区别是什么？', ['atomic 只适用于受支持的单个内存更新，critical 可包围一般代码区', 'atomic 一定比 reduction 快', 'critical 不提供互斥'], 0,
        ['atomic 语义更窄，常能映射到硬件原子操作。', '高频共享更新时 reduction 往往更好。', 'critical 的目的正是互斥。']),
      Q('schedule(dynamic) 的主要 trade-off 是什么？', ['更好负载平衡，换取调度开销与可能更差局部性', '消除所有数据竞争', '减少线程数量'], 0,
        ['动态领取工作能缓解不均衡，但调度更频繁。', '调度策略不决定写所有权。', '线程数量由 parallel region/runtime 设置。'])
    ],
    open: [
      ['用所有权解释为什么 reduction 正确。', '每个线程独占私有副本；归约阶段按指定结合操作合并，避免并发写同一位置。'],
      ['为什么“没有 data race”仍可能性能很差？', 'barrier、锁竞争、false sharing、NUMA、负载不均与内存带宽都可能成为瓶颈。']
    ],
    explain: ['shared、private 与 firstprivate 的生命周期差异？', 'data race 和 false sharing 分别破坏什么？', '为什么 reduction 常优于共享 atomic 累加？', '何时 dynamic schedule 值得额外调度开销？'],
    bridge: ['Homework 2-1 · OpenMP', '../homeworks/hw2-1-openmp.html#workbook-stage-parallel', '先建立串行所有权，再逐步加入线程、同步与扩展性证据。']
  };

  bank['05-locality-1'] = {
    problem: '模拟中的交互看似是全对全，怎样利用物理局部性把不必要的候选对排除掉？',
    map: ['interaction radius', 'spatial bins', 'candidate neighbors', 'work & locality'],
    before: [
      ['\(O(n^2)\) 两两检查意味着什么？', '候选 pair 数随粒子数平方增长，即使绝大多数粒子实际不相互作用。'],
      ['cutoff 假设提供了什么结构？', '只有空间上足够近的粒子可能作用，可用空间索引缩小候选集合。']
    ],
    mental: '局部相互作用算法的关键是便宜地生成“可能相关”的候选，而不是更快地检查所有不相关 pair。',
    check: {
      after: '粒子系统', label: 'Cell list invariant',
      question: Q('cell 边长至少为 cutoff 时，为什么只需查看相邻 cell？',
        ['因为同一 cell 只有一个粒子', '更远 cell 的最小可能距离已超过 cutoff', '因为边界条件消失'], 1,
        ['cell 内可有多个粒子。', '空间几何给出了安全排除条件。', '周期或反射边界仍需显式处理。'],
        F('把 cell 做得极小会自动更快吗？', ['会，候选总更少', '不会，需访问的邻居 cell 数与索引开销会增加', '会，因为 cutoff 改变'], 1,
          ['候选减少不是唯一成本。', '更细网格增加元数据、邻居格数量和不规则访问。', 'cutoff 是物理模型参数，不由 cell size 改变。']))
    },
    deep: [
      Q('线性期望复杂度依赖哪个边界条件？', ['密度与 cutoff 使每个粒子的期望邻居数有界', '处理器数量等于粒子数', '所有粒子静止'], 0,
        ['每个粒子只产生常数期望交互，才能得到总 \(O(n)\)。', '并行度不改变串行工作复杂度。', '粒子运动并非复杂度前提。']),
      Q('候选列表正确但轨迹错误，优先检查什么？', ['只检查性能计时', '边界处理、重复/遗漏 pair 与更新顺序', '把 cell 调大'], 1,
        ['先要定位数值不一致。', '这些会直接改变受力与积分轨迹。', '调参不修复所有权或边界错误。'])
    ],
    open: [
      ['解释 spatial binning 如何把几何知识转成算法复杂度。', '用 cutoff 把全局 pair 集合限制为少量邻居格候选，使每粒子期望工作有界。'],
      ['为什么动画是 sanity check 而不是正确性证明？', '明显爆炸或越界可被发现，但细小数值误差、漏 pair 和长期漂移可能肉眼不可见。']
    ],
    explain: ['cutoff 如何产生安全的候选排除规则？', '为什么 cell size 存在 trade-off？', '线性期望复杂度依赖什么密度假设？', '如何用 tiny configuration 检查重复与遗漏 pair？'],
    bridge: ['Homework 2-1 · Serial locality', '../homeworks/hw2-1-openmp.html#workbook-stage-spatial', '先证明串行 spatial binning 正确且接近线性，再谈 OpenMP。']
  };

  bank['06-locality-2'] = {
    problem: 'PDE 离散化把连续空间变成网格依赖；怎样划分网格并只交换真正跨边界的数据？',
    map: ['stencil dependency', 'domain partition', 'halo/ghost cells', 'compute-communication overlap'],
    before: [
      ['stencil 的 radius 决定什么？', '每个更新需要多远的邻居，因此决定 halo 宽度和边界通信。'],
      ['为什么 interior 可以先算？', '内部点不依赖远端 halo，可与通信并行执行。']
    ],
    mental: '网格并行化是把依赖图切开：切口面积决定通信，子域体积决定计算。',
    check: {
      after: '热方程', label: 'Surface-to-volume',
      question: Q('3D 立方子域边长为 \(b\)，一层 halo 的通信/计算比例如何缩放？',
        ['\(O(1)\)', '\(O(1/b)\)', '\(O(b)\)'], 1,
        ['忽略了表面积与体积不同阶。', '通信 \(O(b^2)\)，计算 \(O(b^3)\)，比例为 \(O(1/b)\)。', '方向写反了。'],
        F('强扩展时每个子域变小，比例如何变化？', ['变好', '变差', '不变'], 1,
          ['子域变小使表面积/体积比上升。', '每单位计算对应更多边界通信。', '几何比例随子域尺寸变化。']))
    },
    deep: [
      Q('非阻塞 halo exchange 最可靠的重叠顺序是什么？', ['发起收发→算 interior→等待→算 boundary', '算 boundary→发起→立即等待→算 interior', '先全局 barrier'], 0,
        ['只要进度引擎支持，通信可与不依赖 halo 的内部计算重叠。', 'boundary 依赖新 halo，顺序不成立。', 'barrier 会减少而非增加重叠。']),
      Q('矩阵重排序能改变什么？', ['PDE 的数学解', '稀疏邻接在内存中的局部性与分区边界', '网格维度'], 1,
        ['正确置换保持等价线性系统。', '索引顺序影响 cache 和通信布局。', '离散问题维度不变。'])
    ],
    open: [
      ['用 surface/volume 解释为什么强扩展会撞墙。', '总问题固定时子域变小，边界相对体积变大，通信与同步逐渐主导。'],
      ['为什么 halo width 是 correctness contract？', '宽度不足会漏掉依赖，宽度过大虽可正确但增加通信与内存。']
    ],
    explain: ['stencil radius 与 halo width 的关系？', '为什么 interior/boundary 分离能重叠通信？', '表面积/体积比如何限制强扩展？', '重排序为什么能改性能但不改数学问题？'],
    bridge: ['Homework 2-1 · Partition & verify', '../homeworks/hw2-1-openmp.html#workbook-stage-spatial', '用小网格手推 ownership、边界和更新，再扩到并行粒子分区。']
  };

  bank['06b-comm-avoiding'] = {
    problem: '当数据移动比算术贵得多时，怎样判断一个算法是否已经接近不可突破的通信下界？',
    map: ['dependency DAG', 'fast memory M', 'reuse bound', 'communication lower bound'],
    before: [
      ['通信下界和某段代码的实测流量一样吗？', '不是。下界是给定计算模型下任何合法算法至少要移动的数据量。'],
      ['为什么需要声明 fast memory 容量 \(M\)？', '可同时保留的数据决定一次装入能支持多少后续运算。']
    ],
    mental: '通信避免不是“把消息发快一点”，而是重排计算，让已搬入的数据参与更多依赖满足。',
    check: {
      after: '矩阵乘法的通信下界', label: 'Lower bound scope',
      question: Q('某实现达到 \(\Omega(n^3/\sqrt{M})\) 的阶，能说明什么？',
        ['它在所有硬件上最快', '它在该模型下的数据移动阶数渐近最优', '它的常数因子也是最优'], 1,
        ['下界不包含所有硬件细节。', '达到同阶表示不能再靠算法把渐近通信量降一阶。', '同阶算法仍可有巨大常数差。'],
        F('达到带宽下界后还有哪些优化空间？', ['没有', '常数、消息数、重叠、布局和计算效率', '只能增加 FLOPs'], 1,
          ['下界不等于实现完成。', 'latency、常数和实际 roof 仍决定时间。', '有时重计算有用，但不是唯一选择。']))
    },
    deep: [
      Q('communication-avoiding 算法有时增加 FLOPs，为什么仍可能更快？', ['FLOPs 永远免费', '用便宜计算换昂贵数据移动', '它改变了正确答案'], 1,
        ['算术有成本，只是相对可能更低。', '这是资源交换，需要由机器 balance 判断。', '合法算法应保持结果语义。']),
      Q('words moved 与 messages 的下界分别更接近哪种硬件成本？', ['带宽与延迟', '延迟与带宽', '计算峰值与容量'], 0,
        ['数据总量对应带宽项，消息次数对应每次启动延迟。', '二者对调。', '它们是通信模型对象。'])
    ],
    open: [
      ['解释“达到下界”为什么不是“达到峰值性能”。', '下界只约束一类成本的阶；实现还可能受消息粒度、同步、指令、负载与常数影响。'],
      ['给出重计算换通信的例子。', '重复生成便宜的中间值，避免从远端或慢内存加载；是否划算取决于算术与带宽成本比。']
    ],
    explain: ['通信下界的计算模型必须声明哪些对象？', '为什么 fast memory 容量影响复用上界？', 'words 与 messages 对应哪些时间项？', '达到渐近下界后为什么仍需 profile？'],
    bridge: ['Homework 2-1 · Move less data', '../homeworks/hw2-1-openmp.html#workbook-stage-evidence', '用 measured bytes、同步时间和 scaling curve 区分“少算”与“少搬”。']
  };

  bank['07-distributed-memory'] = {
    problem: '进程不能直接读写彼此内存时，如何把数据所有权、消息匹配和通信时间写成可验证 contract？',
    map: ['rank ownership', 'message matching', 'α + βn', 'blocking/nonblocking'],
    before: [
      ['MPI rank 与物理节点是一回事吗？', '不是。rank 是进程标识；一个节点可放多个 rank，映射由 launcher 与资源配置决定。'],
      ['\(\alpha+\beta n\) 中两项是什么？', '\(\alpha\) 是消息启动/延迟成本，\(\beta n\) 是传输 n 个单位数据的带宽成本。']
    ],
    mental: 'MPI 程序的正确性来自显式所有权与匹配协议；性能来自让消息少、够大、可重叠。',
    check: {
      after: 'MPI 编程', label: 'Message matching',
      question: Q('两个 rank 都先执行 blocking send 再 receive，最主要风险是什么？',
        ['一定获得两倍带宽', '可能因缓冲策略产生死锁', '自动变成 nonblocking'], 1,
        ['没有这种保证。', '双方都等待对方接收时可能互相卡住。', 'blocking API 不会自动改变语义。'],
        F('最直接的结构性修复是？', ['匹配 send/recv 顺序或使用 Isend/Irecv 后 Wait', '增加 message tag 到任意值', '加全局 barrier 后仍双 send'], 0,
          ['建立可完成的匹配顺序。', 'tag 解决匹配歧义，不消除双方等待。', 'barrier 后仍会进入同样协议。']))
    },
    deep: [
      Q('把一个大消息拆成很多小消息通常增加哪项？', ['总 FLOP', '累计 latency 启动成本', '本地内存容量'], 1,
        ['通信粒度不直接改数学 FLOP。', '每条消息都支付 \(\alpha\)。', '可能有 buffer 变化，但不是主要模型结论。']),
      Q('Irecv 返回后能立即使用接收缓冲区吗？', ['能，返回即完成', '不能，必须等 request 完成', '只有 rank 0 不能'], 1,
        ['nonblocking 返回只表示操作已发起。', 'Wait/Test 完成后缓冲区内容才可安全使用。', '规则与 rank 编号无关。'])
    ],
    open: [
      ['用 ownership 表描述一个 2-rank halo exchange。', '列出每个 rank 拥有的 interior、发送边界、接收 ghost 区及更新前必须满足的 request。'],
      ['为什么 nonblocking 不自动等于 overlap？', '运行时/网络需要通信进度，且中间必须有独立计算；立即 Wait 会退化成阻塞。']
    ],
    explain: ['rank、node 与 process 的关系？', 'tag、source、destination 如何参与消息匹配？', '\(\alpha+\beta n\) 如何解释消息聚合？', 'nonblocking 的 buffer 生命周期是什么？'],
    bridge: ['Homework 2-2 · MPI ownership', '../homeworks/hw2-2-mpi.html#workbook-stage-decompose', '先画 rank 数据表，再实现 exchange、验证 tiny run，最后测通信与负载。']
  };

  bank['08-advanced-mpi'] = {
    problem: 'Collective 看似一个 API 调用，但底层拓扑、消息分段和数据布局怎样决定真实扩展性？',
    map: ['collective semantics', 'tree/ring algorithms', 'message size', 'overlap & topology'],
    before: [
      ['AllReduce 的输出在哪些 rank 上？', '归约结果最终出现在所有参与 rank。'],
      ['ReduceScatter + AllGather 能组成什么？', '常见实现中二者组合可完成 AllReduce。']
    ],
    mental: 'Collective 的名字定义语义，不定义唯一算法；规模、消息大小和拓扑决定选 tree、ring 或分层实现。',
    check: {
      after: '集合通信算法', label: 'Tree vs ring',
      question: Q('小消息、延迟主导时，为什么 tree AllReduce 常有优势？',
        ['步骤数可为 \(O(\log p)\)', '它不移动数据', '它总能达到满带宽'], 0,
        ['树降低依赖轮数，减少累计 latency。', 'collective 仍需移动数据。', '带宽利用取决于消息和实现。'],
        F('大消息、带宽主导时 ring 的主要优势是什么？', ['每 rank 分段传输，链路利用高且总数据量接近带宽最优', '只有一次通信', '不需要同步'], 0,
          ['ring 用 pipeline 让大消息稳定占满链路。', '需要多个 step。', '存在 step 依赖。']))
    },
    deep: [
      Q('相同 AllReduce API 在不同消息大小下性能转折，最可能说明什么？', ['数学语义改变', '实现切换算法或 latency/bandwidth 主导项变化', 'rank 数自动减少'], 1,
        ['collective 语义保持不变。', '库会按规模选择算法，成本项也随 n 改变。', '参与 communicator 未改变。']),
      Q('nonblocking collective 最可能何时产生重叠？', ['发起后立即 Wait', '发起后执行不依赖结果的计算，再 Test/Wait', '在 collective 前 barrier'], 1,
        ['没有可重叠窗口。', '独立计算提供通信进度期间的有用工作。', 'barrier 增加同步。'])
    ],
    open: [
      ['解释为什么 collective benchmark 必须报告消息大小和 rank mapping。', '它们决定 latency/bandwidth 比例、网络路径、节点内外层次与算法选择。'],
      ['为什么“用 NCCL/MPI collective”仍不能跳过通信 accounting？', 'API 隐藏实现但不消除数据量、同步和拓扑成本；必须知道语义和规模。']
    ],
    explain: ['collective 语义与算法选择为什么不是同一件事？', 'tree 和 ring 分别擅长什么 regime？', '分层 collective 如何利用节点内/节点间差异？', '如何证明 overlap 来自 timeline 而非噪声？'],
    bridge: ['Homework 2-2 · Communication evidence', '../homeworks/hw2-2-mpi.html#workbook-stage-communicate', '把每个 collective 的输入/输出、每-rank bytes 和测量条件写清。']
  };

  bank['09-cuda-intro'] = {
    problem: 'GPU 提供海量线程，但怎样把线程层次、内存层次和控制流组织成真正高吞吐的 kernel？',
    map: ['grid/block/thread', 'warp execution', 'memory hierarchy', 'occupancy & coalescing'],
    before: [
      ['CUDA block 为什么必须能独立执行？', 'block 可按任意顺序调度到 SM；不同 block 之间不能依赖隐式执行顺序。'],
      ['coalescing 关注谁访问哪些地址？', '同一 warp 的线程在同一指令上访问的地址模式。']
    ],
    mental: 'GPU 优化不是最大化线程数量，而是让每个 warp 发出规则访存、少分支，并保持足够并发隐藏延迟。',
    check: {
      after: '访存合并', label: 'Warp address pattern',
      question: Q('warp 中线程 t 访问 A[t]，最可能得到什么？',
        ['规则、可合并的连续访问', '每线程独立 DRAM 事务', '自动使用 shared memory'], 0,
        ['相邻线程访问相邻元素，硬件可合并事务。', '这是误解 coalescing 的典型模型。', 'global load 不会自动搬入 shared memory。'],
        F('线程 t 访问 A[t*1024] 的主要问题是？', ['跨线程地址跨度大，事务利用率低', '发生 data race', 'block 数变少'], 0,
          ['同一 warp 的请求分散到许多内存段。', '每线程仍读不同地址。', '索引模式不直接决定 launch block 数。']))
    },
    deep: [
      Q('__syncthreads() 能同步哪些线程？', ['整个 grid', '同一 block', '同一节点的所有 GPU'], 1,
        ['block 间没有这种内建 barrier。', '它是 block 级 barrier，并约束 shared/global memory visibility。', '不跨设备。']),
      Q('occupancy 从 50% 提升到 100% 后性能不变，最合理解释？', ['occupancy 一定算错', '原 kernel 已有足够 warps 隐藏延迟，其他瓶颈主导', 'GPU 只使用一半核心'], 1,
        ['测量可能正确。', 'occupancy 是手段，不是性能目标。', 'occupancy 不是核心启用比例。'])
    ],
    open: [
      ['用 warp 解释 branch divergence。', '同一 warp 的不同线程选择不同路径时，路径往往分批执行，被屏蔽线程不做有用工作。'],
      ['为什么 shared memory tiling 可能变慢？', '增加同步、地址计算、bank conflict 或占用资源；若 reuse 不足，搬运成本无法摊薄。']
    ],
    explain: ['thread、block、grid 与 warp 的关系？', 'coalescing 为什么是跨线程概念？', 'shared memory tiling 需要什么 reuse 才划算？', '为什么 occupancy 不是越高越好？'],
    bridge: ['Homework 2-3 · CUDA kernel', '../homeworks/hw2-3-gpu.html#workbook-stage-map', '从一粒子/一线程的正确映射开始，再用 memory transaction 与 timeline 解释性能。']
  };

  bank['10-data-parallel'] = {
    problem: '很多并行算法都可归结为 map、reduce、scan；如何同时分析总工作量和关键路径？',
    map: ['associative operator', 'work W', 'span D', 'map/reduce/scan'],
    before: [
      ['归约为什么需要结合律？', '并行树会改变括号顺序；结合律保证不同分组仍有相同抽象结果。'],
      ['work 与 span 分别测什么？', 'work 是总操作量；span/depth 是无限处理器下的最长依赖链。']
    ],
    mental: '数据并行算法的目标不是只缩短 depth；还要保持 work-efficient，避免用海量额外工作换表面并行度。',
    check: {
      after: 'Blelloch', label: 'Work-efficient scan',
      question: Q('Blelloch scan 的 work 和 span 典型是多少？',
        ['\(O(n\log n)\), \(O(1)\)', '\(O(n)\), \(O(\log n)\)', '\(O(\log n)\), \(O(n)\)'], 1,
        ['混淆了朴素并行 scan 的额外 work。', 'up-sweep/down-sweep 总 work 线性，树深对数。', '把两个量对调。'],
        F('若 p 个处理器执行，Brent 风格上界是什么？', ['\(O(W/p+D)\)', '\(O(WD)\)', '\(O(p/W)\)'], 0,
          ['工作均摊与关键路径共同限制时间。', '不是标准调度上界。', '量纲和方向都不对。']))
    },
    deep: [
      Q('浮点加法严格满足结合律吗？', ['满足', '不满足，因此并行归约可能有舍入差异', '只有 GPU 不满足'], 1,
        ['有限精度舍入使括号顺序可改变低位。', '这是数值可复现性 contract。', '与具体处理器类别无关。']),
      Q('算法 span 很小但 GPU 很慢，可能缺少什么分析？', ['work、访存、同步与映射效率', '数学正确性一定错误', '只需增加递归层数'], 0,
        ['抽象 DAG 不包含全部硬件成本。', '性能慢不能推出结果错误。', '更多层可能增加开销。'])
    ],
    open: [
      ['手推 4 个数的 up-sweep/down-sweep。', '先构建部分和树，再把 identity 放到根并下扫，分别传播 exclusive prefix。'],
      ['为什么 scan 比 reduce 输出更多信息？', 'reduce 只保留整体聚合；scan 为每个位置返回其前缀聚合。']
    ],
    explain: ['work、span 与处理器数如何共同约束时间？', '为什么并行归约依赖结合律？', 'Blelloch scan 为什么 work-efficient？', '浮点归约为什么可能不 bitwise reproducible？'],
    bridge: ['Homework 2-3 · Parallel primitives', '../homeworks/hw2-3-gpu.html#workbook-stage-evidence', '用 work/span 预测，再用 GPU profile 解释实际映射和访存差距。']
  };

  bank['11-upc'] = {
    problem: 'PGAS 让远端对象看起来可寻址，但 locality、completion 和 progress 仍必须由程序员显式推理。',
    map: ['global_ptr + affinity', 'one-sided operations', 'future completion', 'progress'],
    before: [
      ['global_ptr 与普通 C++ 指针的关键区别？', '它包含跨 rank 的全局地址/affinity，不能假设可直接本地解引用。'],
      ['future ready 意味着什么？', '与该 future 关联的异步操作已经达到定义的 completion，可安全消费结果。']
    ],
    mental: 'PGAS 简化“指向哪里”，但没有消除“数据在哪、何时完成、谁推动通信”三个问题。',
    check: {
      after: 'global_ptr', label: 'Affinity before access',
      question: Q('拿到 global_ptr 后，何时能用 local()？',
        ['任何 rank 都可以', '只有当前 rank 对该对象有 affinity 时', 'future 未完成时'], 1,
        ['远端对象不能当本地地址解引用。', 'affinity 表明对象属于当前 rank，才可转换成本地指针。', 'completion 与 locality 是不同条件。'],
        F('远端读取应优先使用？', ['rget/copy 等 one-sided 操作', '强制 local()', 'reinterpret_cast'], 0,
          ['通过异步通信把远端数据取到本地。', '远端 affinity 不满足。', '类型转换不能改变数据位置。']))
    },
    deep: [
      Q('发起 rget 后程序一直做不进入 UPC++ 的长计算，可能出现什么？', ['通信必然立刻完成', '若实现需要 user-level progress，future 可能迟迟不 ready', 'global_ptr 变成本地'], 1,
        ['异步不等于独立进度保证。', '必须理解运行时 progress contract。', '数据所有权不随等待方式改变。']),
      Q('RPC 适合传什么？', ['对远端状态执行的小型操作/控制逻辑', '任意大数组以零成本传输', '本地指针供远端解引用'], 0,
        ['RPC 把函数与参数送到有 affinity 的 rank 执行。', '大数据仍有序列化和网络成本。', '本地地址在远端无意义。'])
    ],
    open: [
      ['解释 global address space 为什么不等于 uniform access cost。', '地址统一只是命名；本地 load 与跨网络 rget 的延迟、带宽和 completion 完全不同。'],
      ['画出 rget 的 buffer 生命周期。', '远端源保持有效，操作发起；本地 future 完成后结果可用；此前不能假设数据到达。']
    ],
    explain: ['global_ptr、affinity 与 local pointer 的关系？', 'future 表示哪个 completion 事件？', 'one-sided 为什么仍有通信成本？', 'progress contract 如何影响异步 overlap？'],
    bridge: ['Homework 3 · Distributed hash table', '../homeworks/hw3-genome.html#workbook-stage-hash', '先用 2-rank tiny table 验证 affinity、RPC/rget 与 completion，再扩展 genome 数据。']
  };

  bank['12-ml-supervised'] = {
    problem: '训练计算由线性代数构成，但数据、参数、激活和梯度应该怎样分布，才能减少关键路径通信？',
    map: ['training graph', 'data/model parallel', 'collectives', 'memory & communication'],
    before: [
      ['数据并行中每个 rank 通常持有什么？', '完整模型副本和不同 mini-batch shard；梯度需要聚合。'],
      ['模型并行解决的首要约束是什么？', '单设备容量或单算子规模无法容纳/高效执行完整模型。']
    ],
    mental: '训练并行策略是在参数、数据、激活和 optimizer state 四类对象之间选择复制、切分与通信。',
    check: {
      after: '数据并行', label: 'What must synchronize',
      question: Q('同步数据并行每步为何需要梯度 collective？',
        ['让每个副本应用等价的全局 batch 更新', '交换输入样本', '减少参数数量'], 0,
        ['聚合局部梯度后，各副本保持同一参数轨迹。', '样本通常在步开始前已分片。', '复制不会减少模型参数。'],
        F('若跳过一次梯度同步会怎样？', ['副本可能沿不同参数轨迹分叉', '自动变成模型并行', 'batch size 变为零'], 0,
          ['各 rank 使用不同局部梯度更新。', '并行策略不会自动切换。', '本地 batch 仍存在。']))
    },
    deep: [
      Q('增加 data-parallel batch 的主要 trade-off？', ['通常吞吐提高，但优化步数/统计与内存行为改变', '总训练 FLOPs 必然减半', '模型参数自动 sharding'], 0,
        ['系统和优化两方面都需重新评估。', '固定 processed examples 时 FLOPs 一阶不因 batch 自动减半。', '数据并行复制模型。']),
      Q('pipeline bubble 来自什么？', ['stage 之间的填充/排空与负载不均', 'AllReduce 精度误差', '输入 tokenization'], 0,
        ['微批次无法让所有 stage 在开头和结尾同时忙。', '不是主要定义。', '与 pipeline 调度无关。'])
    ],
    open: [
      ['列出 data parallel、tensor/model parallel 各复制和切分什么。', 'DP 切 batch、复制模型并聚合梯度；模型并行切参数/算子并在层内交换激活或部分结果。'],
      ['为什么并行训练不能只比较 FLOPs？', '通信、activation/optimizer memory、bubble、kernel efficiency 与优化统计共同决定可行性和时间。']
    ],
    explain: ['训练图中哪些对象可复制或切分？', '数据并行为何需要梯度同步？', '模型并行用什么换取容量？', 'pipeline bubble 的来源和缓解方式？'],
    bridge: ['Homework 3 · Distributed execution', '../homeworks/hw3-genome.html#workbook-stage-evidence', '把对象所有权、通信和吞吐证据迁移到分布式 genome pipeline。']
  };

  bank['13-ray'] = {
    problem: '异构分布式应用既有无状态任务又有有状态服务；怎样统一调度而不掩盖数据与故障语义？',
    map: ['task vs actor', 'object references', 'scheduler', 'lineage & failure'],
    before: [
      ['无状态 task 为什么较容易重算？', '输入和函数定义可由 lineage 重建，不依赖隐藏的可变进程状态。'],
      ['actor 提供什么额外语义？', '一个长期存在、有顺序处理方法调用且持有可变状态的远端对象。']
    ],
    mental: 'Ray 的 API 简化调度表达，但性能和可靠性仍取决于 task 粒度、对象位置、状态所有权和重算边界。',
    check: {
      after: '为什么需要 Actor', label: 'Task vs actor',
      question: Q('在线模型服务需要保留加载后的权重和连接池，优先建模成什么？',
        ['许多完全无状态 task', 'actor', '每次调用写本地全局变量'], 1,
        ['会重复初始化且难维护状态。', 'actor 持有长期状态并串行/并发处理方法调用。', '调度到不同 worker 时本地全局不可靠。'],
        F('纯函数 map over shards 更适合？', ['stateless tasks', '单个 actor 串行执行', 'driver 本地循环'], 0,
          ['任务可并行、失败后按 lineage 重算。', '会形成不必要瓶颈。', '失去分布式并行。']))
    },
    deep: [
      Q('把 10 微秒工作包装成远端 task 可能变慢，为什么？', ['调度与序列化开销无法摊薄', '远端 task 不执行代码', '对象存储禁用内存'], 0,
        ['任务粒度必须显著大于运行时开销。', 'task 会执行。', '对象存储仍使用内存。']),
      Q('同节点 Object Store 的“零拷贝”应怎样理解？', ['所有 Python 对象永不序列化', '特定对象格式可通过共享内存读取，仍受对象创建与格式条件约束', '跨节点网络也没有复制'], 1,
        ['对象类型与写入过程仍有条件。', '这是 implementation-specific 能力，不是普遍零成本。', '跨节点仍需传输。'])
    ],
    open: [
      ['说明 task 与 actor 的故障恢复边界。', 'task 可按 lineage 重新执行；actor 的内部可变状态需要 checkpoint、重建或应用级恢复。'],
      ['为什么 object reference 不等于对象就在本地？', 'reference 是逻辑句柄，调度器/对象管理器决定位置与传输。']
    ],
    explain: ['task 和 actor 的状态语义差异？', '任务粒度为何决定 runtime overhead 是否可摊薄？', 'object reference 与 data locality 的关系？', 'lineage 能恢复什么，不能恢复什么？'],
    bridge: ['Homework 3 · Distributed pipeline', '../homeworks/hw3-genome.html#workbook-stage-evidence', '用 task graph、对象位置和 failure boundary 解释分布式 pipeline，而不只报告吞吐。']
  };

  bank['14-ml-unsupervised'] = {
    problem: '聚类、谱方法和 GNN 都围绕图结构；怎样在保留统计意义的同时控制稀疏计算、采样和通信？',
    map: ['similarity graph', 'sparse operators', 'sampling', 'quality vs scalability'],
    before: [
      ['谱聚类为何需要图拉普拉斯？', '它把相似性图的连通结构转成特征向量问题，用低频结构表示簇。'],
      ['邻居采样解决什么系统问题？', '限制每层展开的节点/边，控制 GNN mini-batch 的计算与内存爆炸。']
    ],
    mental: '无监督并行算法不能只追求更多样本/边每秒；采样与近似改变了统计 estimator，必须同时验证质量。',
    check: {
      after: '采样方法', label: 'Sampling trade-off',
      question: Q('降低每节点采样邻居数最直接改变什么？',
        ['只降低运行时间，模型估计不变', '降低计算/内存，但增加估计方差或偏差风险', '自动提高图连通性'], 1,
        ['采样改变聚合 estimator。', '这是 systems 资源与统计质量的交换。', '采样不会增加原图边。'],
        F('比较两个 sampler 时还必须报告？', ['只报告 samples/s', '验证指标、方差/稳定性和相同预算', 'GPU 名称即可'], 1,
          ['吞吐不能证明学习质量。', '控制预算并同时测质量才能解释 trade-off。', '硬件信息不足。']))
    },
    deep: [
      Q('谱聚类扩展困难的核心算子是什么？', ['稀疏特征值/特征向量计算及其通信', '字符串排序', '密集卷积'], 0,
        ['大图拉普拉斯的迭代稀疏线性代数主导。', '不是核心。', '问题通常是稀疏图算子。']),
      Q('MCL 中 inflation 参数主要控制什么？', ['随机游走分布的强化与簇粒度', 'MPI rank 数', '图存储格式'], 0,
        ['对概率做幂与归一化，强化高概率流。', '不是硬件参数。', '不直接定义格式。'])
    ],
    open: [
      ['解释 GNN neighbor explosion。', '每层对邻居再展开邻居，节点数近似按 fanout 的层数指数增长。'],
      ['为什么近似算法必须同时画 quality-cost curve？', '单看速度会掩盖近似误差；应比较相同质量的成本或相同预算的质量。']
    ],
    explain: ['谱聚类把 clustering 转成什么线性代数问题？', 'neighbor sampling 用什么统计代价换系统可扩展性？', 'MCL expansion/inflation 分别做什么？', '怎样设计公平的 sampler 对比实验？'],
    bridge: ['Homework 3 · Data & graph scale', '../homeworks/hw3-genome.html#workbook-stage-evidence', '把稀疏图、负载分布和质量/吞吐证据带入 genome assembly。']
  };
})();
