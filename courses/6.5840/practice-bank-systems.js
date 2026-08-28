(function () {
  const bank = window.MIT65840PracticeBank = window.MIT65840PracticeBank || {};
  const Q = (prompt, correct, wrongA, wrongB, why, diagnosisA, diagnosisB, followUp) => ({ prompt, options: [correct, wrongA, wrongB], answer: 0, explanations: [why, diagnosisA, diagnosisB], followUp });
  const F = (prompt, correct, wrongA, why, diagnosisA) => Q(prompt, correct, wrongA, null, why, diagnosisA, null);
  const L = (problem, map, before, mental, checks, transfer, open, explain, bridge) => ({ problem, map, before, mental, checks, transfer, open, explain, bridge });

  bank['0012-spanner'] = L(
    '跨洲事务既要复制、分片和原子提交，还要让提交顺序尊重真实时间；Paxos、2PC 与 TrueTime 各负责哪一层？',
    ['Paxos group', '2PC transaction', 'TrueTime interval', 'commit timestamp/wait'],
    [['Paxos 能替代跨 shard 2PC 吗？', '不能。Paxos 复制每个 shard 的状态；2PC 协调多个参与 shard 同进退。'], ['TrueTime 返回一个精确时刻吗？', '返回包含真实时间的区间 [earliest, latest]。'], ['commit wait 为什么等待？', '等到 TT.after(commitTS)，保证提交时间戳确实已经过去。']],
    'Spanner 把三个顺序层叠起来：Paxos 复制单 shard，2PC 原子组合 shards，TrueTime 把 commit order 锚到真实时间。',
    [
      ['spanner-2pc-paxos', 'layering', Q('两 shard 事务中，某 shard 的 Paxos group 已复制 prepare。是否代表全局事务已 commit？', '不代表；还需 2PC coordinator 收集所有参与者并发布全局决定', '代表，多数派复制等于全局提交', '不代表，因为 Paxos 不提供持久化', '局部复制与跨 shard atomic decision 是两层对象。', '你把一个参与者的 durable vote 当成全局 decision。', 'Paxos 正提供复制持久性。', F('若每个 shard 都只有单机，2PC 还需要吗？', '若事务仍跨 shard，仍需原子协调但容错更弱', '不需要，因为单机自动全局原子', '分片边界仍存在。', '单机参与者不等于单一事务资源。'))],
      ['spanner-time-math', 'commit wait', Q('coordinator 选择 commitTS=TT.now().latest 后立即回复 client，会破坏什么？', '外部一致性：真实时间更晚开始的事务可能获得更早时间戳', 'Paxos 多数派交集', '数据分片均衡', '必须等不确定区间越过 commitTS。', 'quorum 交集不是时间顺序。', '与负载均衡无关。', F('时钟不确定度增大，commit wait 通常怎样？', '变长', '变成零', '区间更宽，需要更久证明时间戳已过去。', '方向相反。'))]
    ],
    Q('TrueTime 精度改善会让所有事务延迟同比下降吗？', '不会；只减少相关 wait，不改变锁、Paxos、2PC、网络和执行成本', '会，时间是唯一成本', '不会，因为 TrueTime 不在写路径', '端到端收益受其他阶段限制。', '单一组件不能代表总路径。', 'commit wait 正在写事务路径。'),
    [['画一个跨两个 Paxos group 的 read-write transaction。', '标出读取/锁、prepare replication、2PC decision、commit timestamp、commit wait 和释放。'], ['外部一致性为何比普通 serializability 多一条约束？', '若 T1 现实中先完成、T2 后开始，序列顺序必须 T1<T2。']],
    ['Paxos、2PC 与 TrueTime 分别解决什么？', 'TrueTime 区间包含哪种不确定性？', 'commit timestamp 怎样选择？', 'commit wait 推导自哪条真实时间要求？', '只读事务如何利用时间戳避免锁？'],
    ['Lab 5 · Epoch & Transaction Thinking', 'lessons/assignments/ass05-sharded-kv.html#workbook-stage-recovery', '用 epoch、durable decision 与 recovery 组织重配置。']
  );

  bank['0013-chain-replication'] = L(
    '把写放在 head、读放在 tail 能简化顺序，但节点故障会改变链；怎样确保新链不会遗漏或重复已确认更新？',
    ['head update order', 'forwarded state', 'tail commit/reply', 'reconfiguration'],
    [['client 写为什么发 head？', 'head 建立更新的全局进入顺序并沿链传播。'], ['tail 为什么能回答读？', '到达 tail 的更新已通过整条当前链，tail state 代表 committed prefix。'], ['节点故障时只删除它的地址够吗？', '不够。必须转移可能尚未传播的 pending updates，并隔离旧配置。']],
    'Chain replication 用物理拓扑编码协议阶段：head 排序、middle 复制、tail 定义已完成更新。',
    [
      ['chain-normal-derivation', 'commit point', Q('update U 已到中间节点但未到 tail，head 随后崩溃。client 能否把 U 当作已完成？', '不能；tail 未处理且 client 未收到 tail ack', '能，因为任一副本有 U', '能，因为 head 排过序', '协议把完成边界放在 tail。', '单副本持有不代表链已提交。', '排序发生不等于传播完成。', F('恢复新链时 U 是否一定应丢弃？', '不一定；重配置协议要判断/转移 pending updates', '一定，未回复就是未执行', '超时同样有执行歧义。', '你把未获知结果当成未处理。'))],
      ['chain-failure-table', 'failure location', Q('tail 故障与 middle 故障为何恢复动作不同？', 'tail 故障改变读/commit endpoint；middle 故障还需连接前后并补齐传播缺口', '没有区别，直接重启 client', 'tail 故障不影响任何请求', '节点位置编码了协议职责。', '拓扑状态不能由 client 重启修复。', 'tail 正服务读并确认完成。', F('旧 tail 恢复后为何不能立刻回答读？', '它可能已不在当前配置且状态落后', '因为 tail 永久失去磁盘', '配置 epoch/租约必须隔离旧成员。', '故障不必损坏持久数据。'))]
    ],
    Q('链越长是否读写容错越强且没有代价？', '更长可容忍更多副本故障，但写延迟、修复和资源成本上升', '是，复制是免费的', '不是，链长度与容错无关', '副本数与路径成本共同变化。', '忽略了串行转发。', '副本数直接影响冗余。'),
    [['用两个并发 update 说明为何所有副本最终同序。', 'head 排序 U1/U2；每个节点只按接收顺序转发，tail 看到同一前缀。'], ['解释 reconfiguration 为什么需要配置服务/epoch。', '新旧链必须不能同时服务为当前配置，否则 stale endpoint 会返回错误历史。']],
    ['head、middle、tail 各自职责？', 'tail ack 代表什么？', 'pending update 在故障时为何危险？', '配置 epoch 如何隔离旧链？', '链长交换了哪些性能和容错指标？'],
    ['Lab 5 · Shard Group Ownership', 'lessons/assignments/ass05-sharded-kv.html#workbook-stage-groups', '把每个 shard 的唯一 serving group 当作可验证所有权。']
  );

  bank['0014-occ-farm'] = L(
    'RDMA 把远端内存操作变快，但并发事务仍可能互相覆盖；OCC 如何在无锁读后验证读集、锁写集并原子发布？',
    ['read versions', 'lock write set', 'validate read set', 'replicate/commit'],
    [['乐观并发控制意味着没有锁吗？', '不是。常见 OCC 在 commit 阶段锁写集，并验证读集未变化。'], ['RDMA 原子操作提供事务原子性吗？', '只提供特定内存操作原子性，跨对象事务仍需协议。'], ['验证成功后可先回复再复制吗？', 'FaRM 需要按故障原子性协议先建立备份/commit evidence。']],
    'FaRM 把常见无冲突路径做快，但提交仍是一份证明：读版本没变、写对象已锁、备份先知道决定。',
    [
      ['farm-transaction-trace', 'validation', Q('T 读 x@v5，提交前另一个事务把 x 改到 v6；即使 T 不写 x，应怎样？', '验证失败并 abort，因为 T 的决定基于旧读', '继续 commit，因为只读对象无需检查', '把 x 强制改回 v5', '读集验证保证事务观察可序列化 snapshot。', '只读依赖同样影响业务决定。', '回滚他人提交不合法。', F('为什么通常先锁 write set 再验证 read set？', '防止验证后自己的写目标被其他事务改变', '为了减少读集合大小', '锁定未来发布对象关闭 validation→write 窗口。', '集合大小不由锁顺序改变。'))],
      ['farm-failure-atomicity', 'replication order', Q('primary commit record 持久后、backup 尚不知道事务，primary 故障。风险是什么？', '恢复副本可能缺少已向外界承诺的写', '只会多一次读取', 'backup 会从 client cache 自动恢复', '外部可见 commit 前需建立可恢复证据。', '这是 durability/atomicity 破坏。', '客户端缓存不是协议副本。', F('为什么先让 backups 准备/记录再提交 primary？', '故障切换后仍能完成或重放同一事务', '让 RDMA 延迟变成零', '顺序服务于恢复。', '网络延迟不会变零。'))]
    ],
    Q('冲突率很高时 OCC 仍一定优于悲观锁吗？', '不一定；大量 abort/retry 会浪费读和网络工作', '一定，因为读阶段无锁', '不一定，因为 OCC 从不正确', '适用性取决于冲突与事务长度。', '无锁读不等于无浪费。', 'OCC 可正确实现。'),
    [['用两个事务写出一次 write-write 和 read-write conflict。', '分别标记锁冲突与版本验证失败发生在哪一步。'], ['为什么 FaRM 的硬件快路径没有改变 serializability 定义？', '硬件改变通信/持久成本，不改变事务可见顺序的 correctness contract。']],
    ['OCC 的 read/lock/validate/write 阶段？', 'version 保护什么？', 'write set lock 顺序为何重要？', '备份与 commit record 如何支持恢复？', '冲突率为何决定 OCC 收益？'],
    ['Lab 5 · Concurrent Controllers', 'lessons/assignments/ass05-sharded-kv.html#workbook-stage-concurrency', '用 epoch/CAS 验证读到的 configuration 仍是当前版本。']
  );

  bank['0015-verification-ironfleet'] = L(
    '测试只能看到部分执行；怎样把抽象协议逐层精化到网络代码，并明确证明覆盖和可信计算基边界？',
    ['spec state machine', 'inductive invariant', 'refinement relation', 'implementation/TCB'],
    [['“所有测试都过”是证明吗？', '不是。测试覆盖有限调度与故障执行。'], ['不变量在初始状态成立就够吗？', '不够；还要证明每个允许 transition 保持它。'], ['安全与活性能用同一种反例描述吗？', '安全是坏事发生的有限前缀；活性还依赖公平/环境假设。']],
    '形式化验证不是把实现直接塞进定理证明器，而是用 refinement 把可理解 specification 与具体代码行为连接。',
    [
      ['inductive-invariant', 'induction', Q('性质 P 在所有已测试状态成立，但某个合法 transition 可把 P 变假。P 是归纳不变量吗？', '不是；缺少 preservation 证明', '是，因为测试没失败', '是，只要 initial state 满足', '归纳需要 base case 和 step case。', '有限样本不能覆盖所有 transition。', '初始成立只完成一半。', F('常见修复方式？', '加强 P，加入能解释为何 transition 安全的辅助状态/条件', '删除该 transition 的测试', '更强 invariant 可支撑归纳。', '测试变化不改变系统语义。'))],
      ['verify-boundary', 'model boundary', Q('模型证明网络只丢包/重排，但真实实现会内存越界。能否声称端到端安全？', '不能；内存安全在模型外，必须由语言/运行时/额外证明覆盖', '能，协议证明覆盖全部软件', '能，只要网络模型正确', '结论只能覆盖已建模与 TCB 假设。', '抽象协议不会自动证明内存。', '真实失败面不止网络。', F('可信编译器 bug 属于哪里？', 'TCB/证明边界，需要明确假设或验证', '协议状态机中的普通输入', 'refinement 依赖工具链语义。', '不是应用协议消息。'))]
    ],
    Q('更详细的模型一定带来更强、更有用的证明吗？', '不一定；复杂度可能使证明不可维护，关键是抽象覆盖目标风险并有可靠 refinement', '一定，代码行数越多证明越强', '不一定，因为抽象永远无用', '模型精度和可验证性有 trade-off。', '细节数量不等于相关性。', '良好抽象是验证核心。'),
    [['给 Raft election safety 写一个 base/step 证明骨架。', '初始无 leader 冲突；逐类 transition 证明同 term 一票与多数派交集保持至多一 leader。'], ['为什么活性证明必须声明 fairness/timing assumption？', '异步环境可永远延迟某消息；没有环境进展假设，协议无法保证最终完成。']],
    ['spec、invariant 与 implementation 如何分层？', '归纳不变量的两步证明？', 'refinement relation 连接什么？', '安全与活性证明为何不同？', 'TCB 中通常包含哪些对象？'],
    ['Lab 3–5 · Invariant-driven implementation', 'lessons/assignments/ass03-raft.html#workbook-stage-evidence', '把单调量与状态转换写成运行时 assertion 和 timeline evidence。']
  );

  bank['0016-memcached-facebook'] = L(
    '缓存不是真实数据源，却能因 stale set、惊群和故障把数据库压垮；如何设计失效、租约和故障缓冲？',
    ['database authority', 'cache item/lease', 'invalidation pipeline', 'regional failure pool'],
    [['look-aside miss 后谁填 cache？', '应用从数据库读取后 set cache，因此会出现读写竞态。'], ['cache hit 等于最新值吗？', '不一定，取决于失效和 consistency contract。'], ['Gutter 是永久容量层吗？', '不是，是故障期间保护后端的短期 pool。']],
    '缓存正确性不是“命中率高”，而是控制旧值何时能重新进入、miss 洪峰如何被合并、故障流量何处降级。',
    [
      ['memcache-race', 'stale set', Q('reader miss→读 DB 旧值 V1；writer 更新 DB 为 V2 并 delete cache；reader 随后 set V1。发生什么？', '旧值在失效后重新污染 cache', 'cache 自动检测 V1 版本', 'writer 更新会阻止所有后续 set', 'look-aside 的 read-fill 与 write-invalidate 发生竞态。', '无 lease/version 时 cache 不知道。', '普通 delete 不锁住未来 set。', F('lease 最关键的作用？', '让 fill 只在仍持有效 token 时发布，失效可废弃旧 token', '让所有读永久串行', '它关闭 stale fill 窗口。', '目标不是全局串行。'))],
      ['memcache-failure-economics', 'failure amplification', Q('一个 cache cluster 故障时直接把所有 miss 打到 DB，风险是什么？', '流量放大压垮权威后端，造成级联故障', 'DB 命中率自动提高', 'cache 数据会自动迁移', '缓存故障会把正常吸收的 read load 突然外溢。', '数据库没有 cache hit 概念。', '故障不等于自动重平衡。', F('Gutter 为什么容量可较小？', '只承接故障热点/短期 miss，不保存完整长期工作集', '因为它不存任何值', '它是故障预算。', 'Gutter 仍缓存数据。'))]
    ],
    Q('增加 cache TTL 能否同时消除 stale data 与数据库压力？', '不能；更长 TTL 减少 miss 但延长陈旧窗口，需结合 invalidation/version', '能，TTL 越长越一致', '不能，因为 TTL 不影响 miss', '这是 freshness 与 load 的 trade-off。', '长 TTL 通常更陈旧。', 'TTL 明显影响 miss。'),
    [['手推 stale set 的四事件时间线并标出线性化边界。', 'reader DB read、writer DB write、delete、reader cache set；说明为何 delete 之后仍可出现旧值。'], ['为何 cache consistency 要按 workload/report metric 说明？', '可接受陈旧、read-your-own-writes 和故障降级不同，命中率无法代表语义。']],
    ['look-aside 的读写路径？', 'stale set 如何发生？', 'lease token 关闭哪个窗口？', 'invalidation pipeline 失败会怎样？', 'Gutter 用什么资源保护什么？'],
    ['Lab 5 · Routing & Hot Shards', 'lessons/assignments/ass05-sharded-kv.html#workbook-stage-evidence', '用 workload、热点与配置变化解释吞吐，而不只报告 pass。']
  );

  bank['0017-aws-lambda'] = L(
    '大容器镜像与毫秒冷启动冲突；如何只加载实际触碰的块，同时跨租户去重又不泄露客户密钥？',
    ['image layers', 'flattened block map', 'multi-level cache', 'on-demand read'],
    [['冷启动是否必须下载完整镜像？', '不必；可先提供逻辑块设备，按 fault/read 取实际块。'], ['flatten 是把所有字节复制一份吗？', '可构建确定性逻辑块映射/索引，不必每次复制整个镜像。'], ['跨租户去重能直接共享客户加密 key 吗？', '不能；内容寻址、平台加密与租户密钥边界需分离。']],
    '按需容器加载把“镜像大小”改写成“启动工作集”：先让文件系统可见，真实块在首次访问时从缓存层或存储取回。',
    [
      ['lambda-read-trace', 'lazy data path', Q('container 首次读一个二进制页，节点 cache miss。正确路径更像什么？', 'logical offset→chunk ID→regional/backing fetch→verify/cache→serve block', '先下载全部 10 GiB 镜像', '直接从另一个租户内存读明文', '索引把文件 offset 解析到内容块。', '按需设计正是避免全量下载。', '跨租户隔离不允许任意明文读取。', F('第二个 container 读同一内容块可能怎样？', '命中安全共享 cache，省去 backing fetch', '必须重新 flatten 全镜像', '内容寻址支持复用。', '映射已可复用。'))],
      ['lambda-security-proof', 'dedup boundary', Q('用明文 hash 作为跨租户 chunk ID，主要要额外分析什么？', '存在性侧信道、字典攻击与加密/访问控制边界', 'CPU 核心数', 'MapReduce reducer 数量', '内容寻址可暴露“某内容是否存在”。', '不是核心安全问题。', '与本系统无关。', F('完整性验证与保密性是同一性质吗？', '不是；hash 可验证内容未变，但不自动隐藏内容', '是，有 hash 就加密', '不同安全目标需不同机制。', 'hash 通常公开。'))]
    ],
    Q('按需加载一定降低每次函数调用延迟吗？', '不一定；冷路径首次 block fault 增加尾延迟，收益取决于实际工作集与 cache', '一定，因为传输字节更少', '不一定，因为它总下载更多', '平均传输与关键路径 tail 要同时测。', '少 bytes 不保证每次访问更快。', '设计目标恰是减少传输。'),
    [['把 10 GiB 镜像、100 MiB 启动工作集和 80% cache hit 写成流量账本。', '区分 metadata、miss block、cache hit，不把镜像逻辑大小当实际传输。'], ['为什么冷启动实验必须报告 percentile 与 cache state？', 'warm/cold cache 和高分位决定真实 worst-case；均值会隐藏 fault burst。']],
    ['flattened image 映射什么？', '按需 block read 的完整路径？', '哪些 cache 层可共享？', '内容寻址带来哪些安全风险？', '镜像大小为何不等于 cold-start bytes？'],
    ['系统实验 · Evidence Loop', 'lessons/assignments/ass01-mapreduce.html#workbook-stage-evidence', '沿用 baseline/config/result/explanation 纪律阅读系统 benchmark。']
  );

  bank['0018-ray'] = L(
    '动态机器学习 workload 同时需要无状态 task、持久 actor 与分布式 object；它们如何表达依赖、调度和失败恢复？',
    ['task/actor call', 'ObjectRef/owner', 'scheduler', 'lineage/restart'],
    [['ObjectRef 是数据副本吗？', '不是，是未来对象的逻辑引用和依赖句柄。'], ['actor method 可像纯 task 一样随意重算吗？', '不能；actor 有顺序与可变状态，需要 checkpoint/restart 等语义。'], ['提交 task 等于立即执行吗？', '不等于；依赖、资源和调度决定何时/何处执行。']],
    'Ray 把控制依赖编码成 ObjectRef：调度器可在数据与资源就绪时放置 task；actor 则显式引入有状态顺序边界。',
    [
      ['ray-task-trace', 'reference vs object', Q('task B 接收 task A 返回的 ObjectRef。A 尚未完成时 B 会怎样？', 'B 可被记录为依赖，真正执行需等待对象可用', 'B 立即读取空值', 'A 与 B 必须在同一进程同步调用', 'future 分离提交控制流与数据就绪。', 'ObjectRef 不是 null placeholder。', '分布式调度可跨进程。', F('ObjectRef 被传给多个 task 是否复制数据多份？', '不必；运行时可按 placement 共享/传输实际对象', '一定在 driver 内复制', '引用与物理传输是不同对象。', 'driver 不必承载数据。'))],
      ['ray-actor-boundary', 'stateful recovery', Q('actor 已处理 increment 后崩溃，简单重放该 method 有什么风险？', '若外部副作用或调用交错，可能重复执行并恢复到不同状态', '没有风险，actor method 都纯函数', 'ObjectRef 会自动撤销 increment', '有状态恢复需定义 checkpoint、重试与副作用语义。', 'actor 正用于可变状态。', '引用不提供事务回滚。', F('纯 deterministic task 为什么更适合 lineage 重算？', '同输入重跑可重建同一对象且无隐藏状态', '因为它不使用 CPU', '确定性和无副作用支撑重算。', 'task 仍使用计算资源。'))]
    ],
    Q('细粒度 task 越多是否总能提高并行度和性能？', '不能；调度、metadata、object transfer 与 backpressure 开销会主导', '能，task 数就是 speedup', '不能，因为 Ray 不支持并行', '粒度决定可并行性与固定开销的平衡。', '忽略 task 管理成本。', 'Ray 正支持分布式并行。'),
    [['画 task→ObjectRef→dependent task 的控制/数据双图。', '控制图可先建立；数据图在 producer 完成后按 placement 移动。'], ['为什么 owner failure 属于对象语义而非只是一台机器坏了？', 'owner 保存引用生命周期/位置等 metadata，失去它会影响对象可达与恢复。']],
    ['task、actor 与 ObjectRef 的角色？', 'future 如何表达依赖？', 'lineage 何时可安全重算？', 'actor state 怎样改变恢复语义？', '任务粒度为何影响 backpressure？'],
    ['Lab 1 · Task Scheduling Analogy', 'lessons/assignments/ass01-mapreduce.html#workbook-stage-scheduling', '把 logical task、attempt、依赖与结果发布区分开。']
  );

  bank['0019-sundr'] = L(
    '服务器不仅会崩溃，还可能对不同客户端展示不同历史；客户端如何检测分叉，并保证一旦分叉就不能偷偷重新合并？',
    ['signed client operation', 'version structure', 'forked views', 'cross-client evidence'],
    [['fork consistency 能阻止服务器撒谎吗？', '不能阻止初始分叉，但保证分叉历史不能无痕重新合并。'], ['数字签名能保证数据新鲜吗？', '不能单独保证；签名证明来源/完整性，版本链证明历史关系。'], ['客户端永不通信能立刻发现分叉吗？', '不一定；检测通常需要交换 signed evidence 或访问共同对象。']],
    'SUNDR 不承诺不可信服务器总给最新数据；它承诺服务器若给出分叉视图，就无法在不暴露矛盾签名链的情况下重新合并。',
    [
      ['fork-consistency-trace', 'no merge', Q('服务器把 A/B 分到两个历史分支，后来想让 A 看见 B 分支的新操作。为何危险？', 'A 的版本链缺少此前 B 已签的分支前缀，会产生不可兼容证据', '因为服务器不知道 B 的 IP', '因为签名会自动删除数据', '历史承诺让跨分支合并暴露矛盾。', '网络身份不是证明核心。', '签名不执行删除。', F('若 A/B 永远不比较证据，能否马上检测？', '不能保证；fork 可持续隐藏', '能，每次 read 都自动广播', '检测需要共同观察或证据交换。', '协议不假设全局广播。'))],
      ['sundr-data-proof', 'integrity chain', Q('验证文件块 hash 正确是否足以证明它是最新版本？', '不够；还需验证目录/版本结构和已签名历史顺序', '足够，hash 等于 freshness', '不够，因为 hash 不能验证内容', '完整性与新鲜/顺序是不同性质。', '相同旧内容 hash 仍正确。', 'hash 能验证匹配内容。', F('客户端签名主要绑定什么？', '操作/版本与前序历史承诺', '服务器物理磁盘位置', '签名链把身份与历史连接。', '存储位置不是逻辑语义。'))]
    ],
    Q('fork consistency 与 linearizability 哪个更强？', '在线性一致性可实现且服务器可信的模型下后者更强；fork consistency 是恶意服务器下的降级保证', '完全相同', 'fork consistency 总能提供最新全局顺序', '保证强弱必须连同 threat model 比较。', '它们允许的历史不同。', '分叉恰允许客户端看到不同视图。'),
    [['画出 A/B 分叉后不能合并的版本 DAG。', '共同前缀后两条签名链；任何合并都需一方接受缺失/矛盾前序。'], ['为什么 threat model 改变后“可用性”也要重述？', '恶意服务器可拒绝服务；协议多能提供检测/完整性，无法强迫对方响应。']],
    ['crash fault 与 Byzantine server 区别？', 'fork consistency 允许和禁止什么？', '签名、hash 与 version chain 各证明什么？', '分叉何时可被发现？', '为什么安全保证必须连 threat model？'],
    ['Lab 5 · Adversarial Reconfiguration Thinking', 'lessons/assignments/ass05-sharded-kv.html#workbook-stage-recovery', '即使故障模型较弱，也用不可合并历史思维审查 epoch 状态。']
  );

  bank['0020-bitcoin'] = L(
    '开放网络没有固定成员与多数派名单；如何用工作量证明让历史竞争可比较，并把双花成功变成概率事件？',
    ['signed transaction/UTXO', 'candidate block', 'proof-of-work chain', 'confirmations/reorg'],
    [['PoW 验证交易所有权吗？', '不直接；签名与 UTXO 规则验证交易，PoW 决定历史竞争成本。'], ['最长链一定按区块数量吗？', '更准确是累计工作量最大的有效链。'], ['六次确认等于绝对 finality 吗？', '不是；重组概率下降但非零。']],
    'Bitcoin 把开放成员下的 leader election 变成按算力随机抽样；共识结果是概率最终性，不是立即不可逆决定。',
    [
      ['bitcoin-transaction-trace', 'state transition', Q('一笔交易引用已花费 UTXO，即使签名有效，节点应怎样？', '拒绝；签名证明授权，不证明输入仍未消费', '接受，签名优先于状态', '等待更多 PoW 后再接受该交易', '交易合法性同时依赖签名与当前 UTXO set。', '所有权与可消费性是两条条件。', '无效交易不会因挖矿变有效。', F('同一 UTXO 的两笔有效签名交易同时传播会怎样？', '它们冲突，最终有效链至多包含一个', '两个都永久生效', '状态机规则禁止双重消费。', '签名不复制资产。'))],
      ['bitcoin-fork-probability', 'probabilistic finality', Q('交易后再等 5 个块，主要改变什么？', '攻击者追上并重组包含该交易前缀的概率降低', '交易签名变得更强', '区块大小减少', 'confirmation 增加诚实链领先工作量。', '签名算法未变化。', '与 block size 无关。', F('攻击者算力接近 50% 时呢？', '追赶概率下降得更慢，安全边界变差', '确认数立刻提供绝对安全', '概率依赖算力比例。', '没有有限确认提供数学绝对 finality。'))]
    ],
    Q('“遵循累计工作最多的链”能否单独保证系统安全？', '不能；还依赖多数算力行为、网络传播、交易验证和经济激励', '能，这是唯一假设', '不能，因为链选择没有作用', '协议、安全概率和经济模型共同成立。', '忽略了 51% 与 eclipse 等边界。', '链选择是核心机制之一。'),
    [['从交易到确认画出状态链。', '验证签名/UTXO→mempool→block→PoW→chain selection→后续 confirmations。'], ['为什么 Bitcoin 与 Paxos 的 quorum 不能直接类比？', 'Paxos 有固定身份/多数派；PoW 用可消耗资源动态加权，提供概率历史选择。']],
    ['UTXO 如何防双花？', 'PoW 解决的不是哪一项？', '累计工作链选择如何处理 fork？', 'confirmation 数为何只改变概率？', '安全依赖哪些网络和经济假设？'],
    ['课程综合 · Failure Model Transfer', 'lessons/assignments/ass05-sharded-kv.html#workbook-stage-evidence', '把安全结论与成员模型、故障模型、测量证据放在同一张表。']
  );

  bank['0021-bft-pbft'] = L(
    '副本可能任意撒谎、伪造相互矛盾消息；为何需要 3f+1，以及 prepare/commit 两层证书分别挡住什么？',
    ['pre-prepare order', 'prepare certificate', 'commit certificate', 'view change'],
    [['f Byzantine faults 为何不是 2f+1？', '需要两个 2f+1 quorum 的交集至少含 f+1 节点，从而至少一个诚实节点。'], ['签名/MAC 能阻止 primary 发矛盾消息吗？', '不能阻止，但能认证来源并让矛盾证据可验证。'], ['view change 可以丢弃旧 view 全部状态吗？', '不能；必须携带可能已 prepared/committed 的安全历史。']],
    'PBFT 的 quorum 不只要相交，还要让交集大到必含诚实证人；两阶段证书把请求从“被排序”推进到“跨 view 不会消失”。',
    [
      ['pbft-normal-trace', 'quorum math', Q('f=1、n=4。副本需要看到多少匹配 prepare 才形成 prepared certificate？', '2f+1=3 个（按课程/论文计数约定含自身）', '2 个，简单多数即可', '4 个，必须全部', '3 个集合中至少 2 个诚实，证书可跨交集传递。', '2 个可能包含一个恶意且缺少足够诚实交集。', '等待全部会让一个故障阻塞活性。', F('两个 3-of-4 quorum 至少相交几个？', '2 个，其中至少 1 个诚实', '0 个', '集合大小给出 3+3-4=2。', '不可能不相交。'))],
      ['pbft-view-change', 'history transfer', Q('新 primary 在 view change 中收到多个 prepared certificate，应怎样选安全请求？', '按协议选择能证明最高/安全序号的证据并保留已锁定历史', '忽略旧 view 从空日志开始', '只听一个最快副本', '换主不能覆盖可能已 commit 的请求。', '会产生跨 view 冲突决定。', '单副本可能 Byzantine。', F('为什么 commit phase 不只是多余一次广播？', '让足够副本知道 prepare 证书已广泛存在，保证 view change 可带走', '为了增加吞吐', '第二层证书强化跨 view 稳定性。', '额外消息通常降低而非增加吞吐。'))]
    ],
    Q('使用数字签名后能否把副本数降到 f+1？', '不能；认证阻止冒充，不阻止真实 Byzantine 节点发送冲突值，仍需 quorum 交集', '能，每个签名都可信内容', '不能，因为签名没有任何作用', '身份真实性与内容诚实不同。', '签名只证明谁说的。', '签名对证据和防伪造很重要。'),
    [['手推 f=1 四副本的一次 pre-prepare/prepare/commit。', '标出 primary 可作恶的位置、每个 certificate 数量及至少几个诚实成员。'], ['比较 crash consensus 与 BFT quorum 的交集要求。', 'crash 模型交点存在即可保存事实；BFT 还需交点中至少一个诚实。']],
    ['3f+1 如何推导？', 'pre-prepare、prepare、commit 各提供什么证据？', '认证为何不能替代 quorum？', 'checkpoint 如何限制日志？', 'view change 怎样携带安全历史？'],
    ['课程收口 · Protocol Evidence', 'lessons/assignments/ass03-raft.html#workbook-stage-evidence', '用故障模型、quorum、持久状态和第一处不变量破坏统一审查协议。']
  );
})();
