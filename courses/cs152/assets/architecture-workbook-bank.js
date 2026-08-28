(function () {
  const stage = (title, build, trace, invariant, failure, evidence, lessons) => ({ title, build, trace, invariant, failure, evidence, lessons });
  const workbook = (mission, stages) => ({ mission, stages });
  const L = {
    pipe: ['../0004-pipelining-i.html#architecture-brief', 'Lesson 4 · Pipeline'],
    hazard: ['../0005-pipelining-ii.html#architecture-brief', 'Lesson 5 · Hazards'],
    cache: ['../0006-memory.html#architecture-brief', 'Lesson 6 · Cache'],
    amat: ['../0007-memory-ii.html#architecture-brief', 'Lesson 7 · AMAT'],
    ooo: ['../0012-out-of-order-execution-i.html#architecture-brief', 'Lesson 12 · OoO'],
    rename: ['../0013-out-of-order-execution-ii.html#architecture-brief', 'Lesson 13 · Rename/ROB'],
    vector: ['../0017-vectors.html#architecture-brief', 'Lesson 17 · Vectors'],
    rvv: ['../0019-risc-v-vectors.html#architecture-brief', 'Lesson 19 · RVV'],
    coherence: ['../0021-cache-coherence.html#architecture-brief', 'Lesson 21 · Coherence'],
    consistency: ['../0022-memory-consistency.html#architecture-brief', 'Lesson 22 · Consistency'],
    interconnect: ['../0025-interconnects.html#architecture-brief', 'Lesson 25 · Interconnects'],
  };

  window.CS152WorkbookBank = {
    'ass01': workbook('把 ISA 语义逐层落实为微操作、流水级和性能账本。', [
      stage('1 · 固定 ISA 契约', '一张不依赖实现细节的架构状态转换表。', 'instruction → operands → architectural writes → exceptions', '相同输入架构状态必须得到相同可见结果。', '结果值对但异常/PC 错：你可能只追了数据，没有追控制状态。', '给每条指令列出读集、写集和可能异常。', [L.pipe]),
      stage('2 · 展开控制与流水时序', '逐周期的微操作/五级占用表。', 'cycle × instruction → stage / resource / produced value', '每个值必须在消费者需要前产生；同一独占资源不能同拍双占。', 'CPI 算对但时序表冲突：检查 stage latency 与 forwarding 可用点。', '手推 3 条相关指令，再与公式预测对照。', [L.pipe, L.hazard]),
      stage('3 · 闭合 Iron Law', '把指令数、CPI、周期时间分开的性能解释。', 'program time = instructions × CPI × cycle time', '任何优化结论必须说明改变了哪个因子及是否伤害另一个因子。', '只报“更深流水线更快”：遗漏 branch penalty 与 latch overhead。', '提交 baseline、假设、计算和一句瓶颈归因。', [L.pipe]),
    ]),
    'ass02': workbook('在 Sodor 中把控制状态机接到真实数据通路，并用小程序证明每拍都正确。', [
      stage('1 · 建立可观察基线', '能逐拍显示 PC、微状态、关键控制信号的最小程序。', 'cycle → PC | micro-PC | controls | register writes', '先证明原基线可重复，再改 RTL。', '波形每次不同：先移除未初始化状态和非确定输入。', '保存一段基线 trace，标出一次完整指令生命周期。', [L.pipe]),
      stage('2 · 实现控制契约', '新增指令的状态序列与合法 next-state。', 'decode → state₀ → micro-ops → stateₙ → fetch', '每状态只驱动必要写使能；退出路径覆盖正常与异常情况。', '寄存器被重复写：检查状态停留一拍还是写使能跨拍保持。', 'tiny program 只含目标指令和一个可观察结果。', [L.pipe, L.hazard]),
      stage('3 · 集成与回归', '新指令正确且旧指令行为未改变。', 'unit trace → directed test → regression suite', '测试通过还要能解释每个新增状态为何存在。', '单测过、程序挂：检查 PC 更新与取指状态恢复。', '附关键波形、回归结果和控制状态解释。', [L.pipe]),
    ]),
    'ass03': workbook('把缓存问题还原成地址位、候选电路路径和 AMAT 三本独立账。', [
      stage('1 · 地址拆分与逐次命中', '每个地址的 tag/index/offset 与命中状态表。', 'address → tag | index | offset → old line → hit/miss → new line', '每次访问后立即更新替换/脏状态，不能只写最终 cache。', '前几项对、后面错：通常漏了 miss 后的状态更新。', '用 4–8 行 tiny cache 手推一遍完整序列。', [L.cache]),
      stage('2 · 电路关键路径', '直接映射与组相联设计的两条候选延迟路径。', 'tag path vs data path → max delay → ceil(delay / cycle)', '相联度改变 set 数、tag 宽度、比较器和 mux，必须重算而非套旧路径。', '周期数差 1：检查单位与向上取整发生的位置。', '提交模块延迟表并圈出真正 critical path。', [L.cache]),
      stage('3 · AMAT 权衡', '把 hit time、miss rate、miss penalty 分开的对照实验。', 'AMAT = hit time + miss rate × miss penalty', '每次访问都付 hit time；miss penalty 只按 miss rate 加权。', 'miss rate 降但 AMAT 变差：不要当 bug，先看 hit time 是否上涨。', '做一次敏感性分析，说明哪个参数支配结果。', [L.amat]),
    ]),
    'ass04': workbook('修改 cache 前先做可重复 baseline，再用 trace 和计数器解释性能变化。', [
      stage('1 · 固定基线', '给定 workload/config 下可重复的周期、miss 与 traffic 记录。', 'config + workload → counters + trace + runtime', '硬件、输入、warmup 与测量窗口必须固定。', '数字漂移大：先查初始化、warmup 与统计区间。', '至少重复三次并保存原始计数器。', [L.cache, L.amat]),
      stage('2 · 单变量修改', '一次只改变容量、相联度、line size 或策略中的一个。', 'one change → predicted hit/traffic/latency direction → run', '控制变量不变，才能把差异归因给目标机制。', '同时改多个参数后变快：无法解释，不算证据。', '运行前写方向预测，运行后对照 miss taxonomy。', [L.cache]),
      stage('3 · 性能证据链', '从 cache 行为到 CPI/时间的完整解释。', 'cache event → stall cycles → CPI → runtime', '命中率提高不等价于总时间下降。', '计数器改善但运行变慢：检查 hit latency、带宽和关键路径。', '提交 baseline、配置、结果、归因和反例。', [L.amat]),
    ]),
    'ass05': workbook('用依赖图、资源时间表与 ROB 状态证明复杂流水线仍保持程序语义。', [
      stage('1 · 依赖与重命名', '区分 RAW、WAR、WAW 的依赖图和 rename map。', 'logical regs → dependencies → physical mapping', '只消除名字依赖，真实 RAW 必须保留。', '消费者过早执行：检查 ready bit 是否对应物理寄存器。', '给一段 5 指令序列标出三类依赖。', [L.ooo, L.rename]),
      stage('2 · 逐周期调度', 'issue/execute/writeback/commit 的周期表。', 'cycle × instruction → queue | FU | result | ROB', '资源、operand-ready 和宽度约束必须同拍同时满足。', '表里同一端口多次使用：遗漏结构约束。', '手推一个含 cache miss 与独立指令的窗口。', [L.ooo]),
      stage('3 · 精确状态恢复', '分支错误或异常下的 squash/commit 轨迹。', 'event → younger entries flushed → rename restored → correct fetch', '错误路径结果不得提交到架构状态。', '结果偶发污染：检查 complete 与 commit 是否被混用。', '标出 recovery 前后 ROB head 与 map 状态。', [L.rename]),
    ]),
    'ass06': workbook('在 BOOM 中把参数或机制变化连接到可观测队列、停顿与 IPC。', [
      stage('1 · 读懂 BOOM 生命周期', '一条指令穿过 rename、issue、execute、ROB commit 的 trace。', 'fetch → rename → issue → execute → writeback → commit', '每个观测信号必须能对应到一个体系结构对象。', '波形很忙但无法解释：先只追一条带唯一 PC 的指令。', '保存一条指令的端到端时间线。', [L.ooo, L.rename]),
      stage('2 · 参数化实验', '一次改变 issue width、ROB 或队列容量的受控实验。', 'resource change → predicted bottleneck shift → counters', '更宽资源只有在原瓶颈被它限制时才应显著收益。', '参数变大无收益：检查 dependency、cache 或 frontend 是否才是瓶颈。', '记录配置、benchmark、warmup 和计数器。', [L.ooo]),
      stage('3 · 解释 IPC', '把 IPC 差异分解为前端、依赖、资源和内存停顿。', 'lost slots → classified causes → IPC delta', '不要用单一平均 IPC 代替瓶颈证据。', 'IPC 变快但提交数不一致：可能测量窗口不同。', '提交 trace/counter 与一条可证伪解释。', [L.rename]),
    ]),
    'ass07': workbook('分别用 chime、lane 利用率与线程槽占用分析数据并行和线程并行。', [
      stage('1 · 向量指令计数', 'scalar loop 到 strip-mined vector loop 的映射。', 'N → VL chunks → vector instructions → chimes', 'VL、MVL、lane count 是三个不同对象。', '把 VL 当 lanes 会低估多个 chime。', '用 N=10、VL=4、lanes=2 手推尾部循环。', [L.vector]),
      stage('2 · Convoy 与 chaining', '逐 chime 的功能单元占用图。', 'dependencies + FU lanes → convoys → total chimes', 'chaining 只在生产结果可流式到消费者时减少等待。', '所有向量指令都画成并行：遗漏 RAW 或共享 FU。', '画出一组含 load、mul、add 的时间表。', [L.vector]),
      stage('3 · 多线程延迟隐藏', '线程选择和执行槽占用表。', 'stalling thread → scheduler → ready thread → utilization', '吞吐收益与单线程延迟需分别报告。', '总 IPC 增加就称每线程更快：混淆 metric。', '对比 throughput、fairness 与 per-thread latency。', [L.vector]),
    ]),
    'ass08': workbook('写硬件宽度无关的 RVV 循环，并用语义、尾部和性能证据验证。', [
      stage('1 · VLA 控制循环', '由 vsetvl 驱动的剩余元素循环。', 'remaining → vl → body → pointers += vl → remaining -= vl', '不得假设固定 VLEN；最后一轮也不能越界。', '只在某个 VLEN 通过：通常硬编码了步长。', '用 N 小于、等于、大于 VLmax 三组 tiny cases。', [L.rvv]),
      stage('2 · 向量语义正确性', 'mask、tail 与 memory stride 的边界用例。', 'inputs + mask/tail policy → expected element-wise outputs', '未激活元素的行为必须与选定 policy 一致。', '随机数据偶发错：缩到一个 tail 或一个 mask bit。', '与 scalar reference 做逐元素比较。', [L.rvv]),
      stage('3 · 性能归因', '从指令减少到 lane 利用率与 memory traffic 的证据链。', 'vectorization → instruction count / utilization / traffic → time', '向量化不保证算术或带宽瓶颈都改善。', '指令少但不快：检查短向量、stride 和内存带宽。', '报告 shape、VLEN、计数器、时间和瓶颈。', [L.vector, L.rvv]),
    ]),
    'ass09': workbook('对每个地址逐事件推演 coherence 状态，再用 litmus test 分析跨地址顺序。', [
      stage('1 · 单地址协议轨迹', '每个 core/line 的状态与总线事务表。', 'event → requester old state → message → peer actions → new states', '同一时刻写权限唯一；M 中最新数据不能被静默丢失。', '状态看似对、读值错：检查谁提供最新 data。', '从 I/I 开始手推 Read、Remote Read、Write。', [L.coherence]),
      stage('2 · 竞争与暂态', '两个请求接近同时发生时的序列化与等待。', 'requests → arbitration → transient states → completion', '协议必须说明 in-flight transaction，而不只是稳定 MSI 状态。', '出现两个 M：遗漏仲裁或 invalidation ack。', '画出消息和状态并标出唯一 serialization point。', [L.coherence]),
      stage('3 · 一致性模型', '跨地址 litmus test 的允许执行图。', 'program order + reorder rules + reads-from → outcome', 'coherence 不能单独决定不同地址之间的顺序。', '逐地址都合法却判结果非法：可能暗中假设 SC。', '列出目标模型允许/禁止的观察结果及理由。', [L.consistency]),
    ]),
    'ass10': workbook('把多核 cache protocol 的 RTL 事件、消息与共享内存行为闭合成证据。', [
      stage('1 · 可观测协议基线', '单核命中、单核缺失和两核共享读的最小 trace。', 'core request → cache state → network msg → response', '先验证无竞争路径，再加入写竞争。', '复杂测试挂而基础 trace 缺失：debug 范围过大。', '保存三条 tiny trace 并标注稳定状态。', [L.coherence]),
      stage('2 · 所有权转移', '写入导致 invalidation/ack/数据转移的完整状态机。', 'GetM/upgrade → peer invalidation → acks → writable state', '写完成前必须收齐协议要求的权限证据。', '偶发旧值：检查 ack 与 data response 的先后条件。', '用两个 scalar 地址隔离协议与替换问题。', [L.coherence]),
      stage('3 · 并发与性能', 'correctness regression 加 traffic/latency 解释。', 'workload → sharing pattern → messages → stalls → runtime', '协议正确是前提，消息减少也要确认没有弱化语义。', '快但测试偶发失败：不能用性能掩盖 race。', '提交 baseline、配置、消息计数和关键 trace。', [L.coherence, L.consistency]),
    ]),
    'ass11': workbook('用统一的 workload—metric—mechanism—evidence 模板收束分支、互连与规模化系统主题。', [
      stage('1 · 定义设计问题', '明确 workload、metric、baseline 与不可违反约束。', 'workload + constraints → metric → baseline', '没有 baseline 的改进无法度量。', '目标写成“更快”：metric 尚未可操作化。', '写出可复现实验条件和成功阈值。', [L.interconnect]),
      stage('2 · 建立机制模型', '分支 penalty、网络 hop/queue 或 tail-latency 的最小模型。', 'mechanism parameters → predicted bottleneck → observable counters', '模型要能给方向预测，也要说明忽略了什么。', '公式吻合但实测反向：检查排队与工作负载假设。', '先在 toy case 手算，再扩大真实配置。', [L.interconnect]),
      stage('3 · 证据与反思', '结论、反例、边界条件与下一实验。', 'prediction ↔ observation → explanation → falsifying test', '相关性不能自动证明目标机制是原因。', '只选最好的一个数字：遗漏分布和失败样例。', '报告原始数据、差异、局限与可证伪后续。', [L.interconnect]),
    ]),
  };
})();
