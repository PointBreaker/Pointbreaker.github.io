(function () {
  const bank = window.MIT65840PracticeBank = window.MIT65840PracticeBank || {};
  const Q = (prompt, correct, wrongA, wrongB, why, diagnosisA, diagnosisB, followUp) => ({ prompt, options: [correct, wrongA, wrongB], answer: 0, explanations: [why, diagnosisA, diagnosisB], followUp });
  const F = (prompt, correct, wrongA, why, diagnosisA) => Q(prompt, correct, wrongA, null, why, diagnosisA, null);
  const L = (problem, map, before, mental, checks, transfer, open, explain, bridge) => ({ problem, map, before, mental, checks, transfer, open, explain, bridge });

  bank['0001-introduction-mapreduce'] = L(
    '把一个确定的单机计算扩到许多会变慢、失联和崩溃的 worker，框架必须接管哪些状态与恢复责任？',
    ['logical task', 'attempt/worker', 'intermediate files', 'accepted output'],
    [['Map task 和 worker 是同一个对象吗？', '不是。task 是逻辑工作；worker 只是某次 attempt 的执行位置。'], ['为什么 Reduce 不能在任意 Map 完成后就算完整结果？', '它需要取得所有 Map 为自己分区产生的中间桶。'], ['确定性为什么与重试有关？', '同一逻辑 task 的不同 attempt 若产生不同内容，消费者可能组合出不可解释的结果。']],
    'MapReduce 的容错来自把逻辑 task、物理 attempt 和可发布结果分开；失败后替换 attempt，而不是改变作业语义。',
    [
      ['mr-wordcount-by-hand', 'segmentation of work', Q('M=3、R=2 时，Map-2 worker 在 Reduce 开始前崩溃且本地中间文件丢失。必须重做什么？', '逻辑 Map-2，并重新产生它面向两个 Reduce 的桶', '只重做 Reduce-0', '整个作业全部从输入重启', '同一个 Map attempt 产生 R 个本地中间分区。', '你把消费者当成丢失数据的生产者。', '框架保留了其他逻辑 task 的完成事实。', F('若已完成 Reduce 的最终输出在 GFS，Reduce worker 随后崩溃呢？', '已原子发布的最终文件通常无需重算', '必须重做所有 Map', '持久发布结果与本地临时文件生命周期不同。', '你忽略了最终输出的存储位置。'))],
      ['mr-failure-matrix', 'attempt identity', Q('超时后 coordinator 把同一 Map task 重派，旧 worker 随后也报告完成。正确做法是什么？', '按 task/attempt 状态只接受当前有效结果，迟到结果不能覆盖已接受 attempt', '两个结果随机选一个', '把它们拼接以免浪费工作', '重派产生两个物理 attempt，但只能发布一个逻辑结果。', '随机选择在非确定性或文件位置变化下不可审计。', '拼接会把同一逻辑输入计算两次。', F('这条规则主要在区分哪两个对象？', 'logical task 与 physical attempt', 'Map 与 Reduce 函数名', '恢复协议必须分开工作身份与执行身份。', '函数阶段不是这里的竞态根因。'))]
    ],
    Q('把 Map 中间结果复制到分布式存储是否一定更好？', '不一定；提高可恢复性但增加网络、持久化和写放大', '一定，复制从不花成本', '一定更差，因为分布式存储没有容错', '设计要比较重算代价与常态数据移动。', '复制会消耗真实资源。', '分布式存储正用于持久结果。'),
    [['不用组件名解释一次 worker crash 如何恢复。', '说明哪些状态仍然可信、哪些本地文件丢失、谁创建替代 attempt、如何只发布一个结果。'], ['为什么 straggler 与 crash 不能仅靠同一个 timeout 直觉解释？', 'timeout 只能表达怀疑；慢 attempt 可能仍在运行，因此 backup execution 需要处理重复完成。']],
    ['task、attempt 与 worker 如何区分？', 'M×R 中间文件矩阵如何形成？', '确定性为什么帮助重试？', '数据本地性减少哪段网络流量？', 'backup execution 为什么需要结果仲裁？'],
    ['Lab 1 · MapReduce Workbook', 'lessons/assignments/ass01-mapreduce.html#workbook-stage-model', '先画 task/attempt/file 状态机，再实现 coordinator 与 worker。']
  );

  bank['0002-rpc-threads'] = L(
    'RPC 把远端调用写得像函数，但 timeout 后无法知道远端是否执行；并发服务器怎样把这种不确定性转成明确语义？',
    ['client attempt', 'network delivery', 'server operation', 'reply/dedup state'],
    [['timeout 能证明服务器没执行吗？', '不能；请求、执行或回复任一环节都可能只是延迟/丢失。'], ['at-most-once 与 exactly-once 相同吗？', '不同。前者避免重复执行，但请求可能完全没执行。'], ['锁与 channel 解决同一个问题吗？', '锁保护共享状态；channel 还可表达所有权转移与条件同步。']],
    'RPC 的返回值之外还要定义不确定结果：每次 retry 都是新消息，但可以携带同一逻辑请求身份。',
    [
      ['rpc-under-failure', 'ambiguous timeout', Q('Append 请求到达并执行，reply 丢失，client timeout 后重试。若无 request ID，最可能发生什么？', '同一逻辑 append 被执行两次', '服务器自动回滚第一次执行', 'client 能从 timeout 知道第一次成功', '非幂等操作会把传输重试变成状态重复。', '普通 RPC 不提供这种事务回滚。', 'timeout 无法区分执行前后丢包。', F('若操作是 Get，重复执行为何通常更安全？', '读取通常幂等，但两次可能观察到不同并发状态', '因为 Get 不经过网络', '幂等减少重复副作用，不消除并发语义。', 'Get 仍是 RPC。'))],
      ['rpc-semantics-derivation', 'dedup lifecycle', Q('server 用 clientID+seq 去重后，何时可安全删除旧结果？', '知道 client 不会再重试该序号，或用已确认水位线回收', '回复发送后立刻', '固定一秒后', 'reply 仍可能丢失，client 会再次询问同一请求。', '发送不等于送达。', '墙钟等待没有协议证明。', F('去重表重启后丢失会怎样？', '旧请求重试可能被再次执行', '只影响性能', '去重状态是可见语义的一部分。', '重复非幂等写是正确性错误。'))]
    ],
    Q('持锁发送 RPC 是否总能避免并发 bug？', '不能；它可能阻塞本地进展并形成跨节点锁依赖，回复回来仍需版本验证', '能，锁覆盖网络就最安全', '不能，因为锁从不保护共享状态', '网络等待应与本地临界区分离。', '锁时间无限且可能死锁。', '锁本来就用于共享状态。'),
    [['构造请求丢、回复丢和服务器崩溃三种 timeout 时间线。', '分别标出服务器是否执行、client 能观察什么，以及 retry 的风险。'], ['解释“unlock→RPC→relock→validate”为什么是标准形状。', '避免持锁等待；回来后用 term/version/ownership 判断结果是否仍适用于现在。']],
    ['timeout 为什么不是失败证明？', 'at-least-once 与 at-most-once 如何推导？', 'request ID 和 dedup result 各负责什么？', '去重状态为何有生命周期？', '为什么 RPC 返回后还要重新验证本地状态？'],
    ['Lab 2 · Key/Value Workbook', 'lessons/assignments/ass02-key-value-server.html#workbook-stage-semantics', '先写出丢请求、丢回复和重复请求的协议表。']
  );

  bank['0003-gfs'] = L(
    'GFS 为大文件、追加和组件故障优化；它如何分离 metadata control plane 与 chunk data plane，并精确定义弱于 POSIX 的语义？',
    ['file namespace', 'chunk handle/replicas', 'lease primary', 'mutation order'],
    [['master 在正常 read data path 上吗？', '不在。client 向 master 查 metadata 后直接联系 chunkserver。'], ['lease 选择的 primary 是永久 leader 吗？', '不是，是特定 chunk、有限期限内排序 mutation 的副本。'], ['consistent 与 defined 区域相同吗？', 'defined 要求所有副本一致且内容等于某次完整 mutation；consistent 只要求副本相同。']],
    'GFS 用中心化 metadata 决定“去哪里”，再让 chunk replicas 直接搬数据；lease 只为单个 chunk 的 mutation 排序。',
    [
      ['gfs-control-data-plane', 'control/data split', Q('client 读 130 MiB offset 时，master 最关键的回复是什么？', 'chunk handle 与 replica locations', '文件全部内容', '每个字节的 checksum', 'client 用 file+chunk index 查位置，然后直接读副本。', 'master 不承载大数据路径。', 'checksum 由 chunkserver 管理，不是定位核心。', F('缓存这份 metadata 的主要风险？', 'chunk location/lease 变化后可能短暂陈旧', '文件内容会自动复制到 client', 'control-plane cache 需要版本/过期语义。', 'metadata cache 不等于 data cache。'))],
      ['gfs-write-pipeline', 'data vs order', Q('GFS mutation 为什么先把 data 推到 replicas，再由 primary 指定 serial order？', '让大字节流流水化，同时用小控制消息统一应用顺序', '因为 replicas 可各自选择不同顺序', '因为 primary 不需要看到 mutation', '数据传输与排序职责被刻意分离。', '不同顺序会破坏副本一致。', 'primary 需要 mutation identity/顺序，不必转发全部数据。', F('secondary 何时可回复成功？', '按 primary 指定顺序完成该 mutation 后', '收到 data 就立刻', '拥有字节不等于已按协议应用。', '你混淆 data arrival 与 mutation commit。'))]
    ],
    Q('把 master 复制成多个可独立写 metadata 的节点会自动消除瓶颈吗？', '不会；还要为 metadata 更新建立一致顺序与故障恢复协议', '会，复制数量等于吞吐倍数', '不会，因为 metadata 无法复制', '多写者把单点性能问题转成共识问题。', '忽略了冲突更新。', 'metadata 可以复制，只是需协调。'),
    [['走一遍 append 的 control flow 和 data flow。', 'client 获取 lease/replicas；data pipeline 到副本；primary 排序；secondary 应用；ack 返回。'], ['为什么 GFS 的 workload 假设属于 correctness contract 的一部分？', '大量 append、少覆盖和应用可容忍重复片段，使其一致性取舍可被接受。']],
    ['master 保存哪些 metadata？', 'read path 为什么绕过 master data plane？', 'lease primary 排序的范围是什么？', 'data push 与 mutation order 为什么分开？', 'defined、consistent 与 inconsistent 区域如何区分？'],
    ['Lab 2 · 从 GFS 语义回到 KV', 'lessons/assignments/ass02-key-value-server.html#workbook-stage-failures', '用可见结果表描述网络故障，而不把“成功返回”说成模糊直觉。']
  );

  bank['0004-paxos'] = L(
    '多个 proposer 并发且消息可丢失时，如何让所有成功决定共享同一个值，即使决定已经发生却无人完整知道？',
    ['proposal number', 'promise', 'accepted pair', 'chosen value'],
    [['多数派交集为何重要？', '任意两个多数派至少共享一个 acceptor，未来 round 能接触过去证据。'], ['accepted 与 chosen 相同吗？', 'accepted 是单 acceptor 状态；chosen 要求某值被一个多数派接受。'], ['Paxos 保证活性吗？', '基本协议保证安全；竞争 proposer 可反复打断，需要稳定 leader 等提高活性。']],
    'Paxos 的核心不是“两轮消息”，而是新 proposal 必须继承 prepare quorum 中编号最高的已接受值。',
    [
      ['paxos-round-by-hand', 'value inheritance', Q('proposer 12 的 prepare quorum 返回：A 接受(7,X)，B 无，C 接受(10,Y)。它必须提议什么？', 'Y，因为它是 quorum 中最高编号 accepted value', '任意新值 Z', 'X，因为 A 最先回复', '继承规则把过去可能已 chosen 的值带入未来。', '这会允许两个不同值各被多数派接受。', '回复先后不是协议证据强度。', F('若 quorum 全都没有 accepted value 呢？', 'proposer 可选择自己的新值', '协议必须永久停住', '没有过去值需要继承。', '安全性不要求无历史时停机。'))],
      ['paxos-quorum-safety', 'chosen but unknown', Q('值 X 已被多数派接受，但 proposer 在收到回复前崩溃。未来 round 怎样保护 X？', '新 prepare quorum 与旧多数派相交，并通过 accepted state 继承 X', '因为 client 会重发 X', '因为所有 acceptor 都已接受 X', '安全不依赖原 proposer 或 client 存活。', 'client 不知道 chosen 事实也不可靠。', 'chosen 只需多数派，不是全部。', F('相交 acceptor 的 accepted state 必须满足什么？', '跨崩溃持久保存', '只在内存保留一秒', '否则未来无法观察过去证据。', '时间等待不提供恢复保证。'))]
    ],
    Q('给每个 proposer 分配唯一递增编号就能保证很快决定吗？', '不能；编号保证可比较，竞争 proposer 仍可不断抢占', '能，唯一编号自动选出 leader', '不能，因为编号与安全无关', '活性还需调度/稳定 leader 假设。', '唯一不等于停止竞争。', '编号和继承规则是安全基础。'),
    [['用 acceptor 三个持久字段重讲一次 prepare/accept。', 'maxPromised 决定拒绝旧轮次；acceptedN/value 保存未来需要继承的最强证据。'], ['为什么“已经 chosen 但没人知道”是 Paxos 的关键起点？', '协议必须保证未来仍只会决定同一值，不能依赖某个观察者保存结果。']],
    ['accepted 与 chosen 如何区分？', '多数派交集把什么证据带到未来？', 'prepare reply 为何携带 accepted pair？', 'proposer 如何选择 Phase 2 value？', '安全与活性的假设分别是什么？'],
    ['Lab 3 · Raft Workbook', 'lessons/assignments/ass03-raft.html#workbook-stage-election', '把 quorum、epoch 和持久证据映射到 Raft term、vote 与 log。']
  );

  bank['0005-go-patterns'] = L(
    '分布式协议的消息并发到达、状态持续变化；Go 代码怎样让所有权、生命周期和陈旧结果检查可审查？',
    ['goroutine lifecycle', 'shared state owner', 'message/channel', 'version validation'],
    [['并发一定意味着多核并行吗？', '不一定；并发描述多个可推进活动，可能在一个核心交错。'], ['channel send 自动让整个对象线程安全吗？', '只对通过该同步边传递的状态建立顺序；其他别名仍可能 race。'], ['为什么 goroutine 需要退出协议？', '测试、重启和 Kill 后泄漏 goroutine 会继续修改旧状态或消耗资源。']],
    'Go 并发设计先决定谁拥有状态，再选择 mutex、channel 或 single-owner loop；语法只是协议的载体。',
    [
      ['go-state-ownership-table', 'ownership', Q('term/log 由 mutex 保护，但后台 goroutine 把 log slice 引用带出锁后使用。主要风险是什么？', '其他 goroutine 可 append/替换底层数组，使快照不再稳定', 'mutex 会自动复制 slice', 'Go slice 永远不可变', '带出锁的是 descriptor/alias，不是不可变副本。', '锁不提供复制语义。', 'slice 可被修改和扩容。', F('更安全的常见做法？', '锁内复制 RPC 所需不可变参数，解锁后发送', '持锁等待所有网络回复', '复制形成稳定 request snapshot。', '网络等待会阻塞本地状态推进。'))],
      ['go-unlock-rpc-proof', 'stale result', Q('term=5 时解锁发 RPC，返回时 currentTerm=7。最可靠的处理？', '丢弃或仅处理与 term 7 仍兼容的结果', '按 term 5 逻辑直接更新状态', '把 currentTerm 改回 5', '异步结果需要出生版本与失效条件。', '旧结果不能污染新 epoch。', 'term 必须单调。', F('为什么 RPC reply 成功仍不足？', '网络操作成功不证明本地角色/版本仍与发送时相同', '因为成功回复没有内容', '外部结果与当前状态要再次建立关系。', 'reply 可以有内容，问题是陈旧性。'))]
    ],
    Q('把所有状态放进一个 goroutine 是否自动消除所有并发 bug？', '不会；消息顺序、阻塞调用、生命周期和外部状态仍需协议', '会，single owner 等于系统正确', '不会，因为 goroutine 不能拥有状态', '所有权简化 data race，不替代分布式不变量。', '这是把实现纪律当成协议证明。', 'single-owner 是有效模式。'),
    [['为一个 Raft RPC 写出生证：它离开锁时要记录哪些字段？', '发送 term、角色、peer、prev index/term、entries 范围；回来逐项验证仍适用。'], ['解释 channel close、context cancellation 与 Kill flag 的不同职责。', '分别表达流结束、调用树取消和组件生命周期；选择应匹配 owner 与观察者。']],
    ['goroutine、thread 与 parallel execution 如何区分？', 'slice/map alias 为什么可能逃出锁？', 'happens-before 从哪些同步边建立？', 'RPC 前为何复制状态快照？', '后台 goroutine 的退出条件如何验证？'],
    ['Lab 3 · 并发实现纪律', 'lessons/assignments/ass03-raft.html#workbook-stage-concurrency', '先建立锁纪律、RPC 生命周期和 Kill 协议，再增加 Raft 机制。']
  );

  bank['0006-raft-1'] = L(
    '节点只能通过超时怀疑 leader；如何在旧消息、分票和网络分区中仍保持每个 term 至多一个合法 leader？',
    ['role/term', 'persistent vote', 'RequestVote evidence', 'majority leader'],
    [['election timeout 能证明 leader 死亡吗？', '不能，只能触发怀疑和新一轮竞选。'], ['term 是墙钟时间吗？', '不是，是单调逻辑 epoch。'], ['heartbeat 可以跳过 prevLog 检查吗？', '不能。空 AppendEntries 仍是日志一致性 RPC。']],
    '随机 timeout 只改善活性；选举安全来自 term 单调、每 term 一票、日志新旧限制和多数派。',
    [
      ['raft-election-by-hand', 'term guard', Q('S1 在 term 5 发 RequestVote，等待时已因更高消息进入 term 6。term 5 的赞成回复晚到。应怎样？', '忽略旧回复，不能把 S1 升为 term 6 leader', '计入 term 6 票数', '把节点降回 term 5', 'reply 只对出生 term/role 有效。', '不同 term 的票不能混合。', 'term 单调不允许回退。', F('检查旧回复至少要核对什么？', '当前仍是 candidate 且 currentTerm 等于发送 term', '只看 RPC 是否成功', '状态版本决定结果能否应用。', 'transport success 不等于 protocol relevance。'))],
      ['raft-vote-log-order', 'up-to-date rule', Q('voter 尾条目(index=12,term=5)。候选 A=(20,4)，B=(10,6)。谁的日志更新？', 'B，先比较 lastLogTerm，再比较 index', 'A，因为日志更长', '两者一样', '字典序键是(lastTerm,lastIndex)。', '长度不能覆盖更晚 term 的证据。', 'term 不同已决定顺序。', F('lastTerm 相同为 5 时如何比较？', 'lastIndex 更大的更新', '随机选择', '只有 term 相同时才看 index。', '安全规则不是负载均衡。'))]
    ],
    Q('把 heartbeat interval 调得极短能否修复选举安全 bug？', '不能；它可能减少正常超时，但 term/vote/log 规则错误仍会破坏安全', '能，只要没有 timeout 就安全', '不能，因为 heartbeat 与选举无关', 'timing 只影响活性概率，不替代安全不变量。', '分区和旧消息仍会触发边界。', 'heartbeat 正参与维持 leader。'),
    [['闭卷讲清同一 term 双 leader 为何被多数派阻止。', '每节点一票；两个获胜集合都是多数派，必相交；交点不能同 term 投两票。'], ['为什么 votedFor 必须在成功回复前持久化？', '崩溃重启后若忘记，可能同 term 再投一票。']],
    ['term 如何触发角色退让？', '随机 timeout 解决与不解决什么？', '每 term 一票如何依赖持久化？', '日志新旧规则如何比较？', '旧 RPC reply 为什么必须带版本护栏？'],
    ['Lab 3A · Election', 'lessons/assignments/ass03-raft.html#workbook-stage-election', '用三节点 timeline 验证 term、vote、timer 与 majority。']
  );

  bank['0007-raft-2'] = L(
    'leader 要修复冲突日志、推进提交、持久恢复和压缩前缀；这些机制怎样共同维护唯一可执行前缀？',
    ['log match', 'majority replication', 'commit/apply', 'snapshot base'],
    [['nextIndex 与 matchIndex 都是事实吗？', 'matchIndex 是已确认匹配事实；nextIndex 是可回退探针。'], ['复制到多数派就总能直接 commit 吗？', '当前 leader 只直接用计数提交 current-term entry。'], ['snapshot index 之后 slice index 仍相同吗？', '不相同，需要逻辑 index→slice offset 映射。']],
    'Raft 的可见历史由 commitIndex 划界；日志、持久化和 snapshot 都必须保持这个逻辑 index 空间连续。',
    [
      ['raft-current-term-commit', 'commit rule', Q('term 5 leader 发现旧 term 3 的 entry 已在多数派。能否仅据此把它直接 commit？', '不能；先提交一个 current-term entry，随后前缀一起成为 committed', '能，任何多数复制都足够', '永远不能提交旧 term entry', 'Raft 的计数规则直接推进要求 log[N].term=currentTerm。', '这会重现 Figure 8 的安全风险。', '旧项可随当前 term 项的提交间接提交。', F('一旦 term 5 entry N 提交，N 前旧项如何处理？', '作为日志前缀一并 committed', '全部删除', 'commitIndex 表示连续前缀。', '提交不是删除。'))],
      ['raft-snapshot-boundary', 'logical index', Q('snapshot 包含到 index 100，保留日志首项逻辑 index=100。收到 prevLogIndex=105 时，应如何定位？', '用 105-snapshotBase 转成 slice offset', '直接访问 slice[105]', '把 prevLogIndex 改成 5 发回去', '协议 index 是全局逻辑空间。', 'slice 已压缩，物理 offset 不等于逻辑 index。', '消息仍使用逻辑 index。', F('落后 follower 的 nextIndex=80 呢？', 'leader 应发送 snapshot，而非访问已删除日志', '不断把 nextIndex 加一', '所需前缀已不在 log slice。', '搜索不能恢复已压缩数据。'))]
    ],
    Q('每次 AppendEntries 失败都 nextIndex-- 是否正确？', '通常能最终找到匹配点，但在长冲突日志上效率差；还要防旧回复倒退新进度', '完全错误，永远不会匹配', '最优，因为每次只发一个 entry', '正确性与快速回退/并发 reply safety要分开。', '朴素回退可工作。', '逐项发送不代表最优。'),
    [['用一组冲突日志手推 prev check、truncate 与 append。', '明确哪一 index 首次 term 不同，只从冲突处删除，已匹配前缀不变。'], ['解释 commit、apply 与 persist 的三条边界。', 'commit 是协议事实；apply 是交给状态机；persist 保证崩溃后不违反已作承诺。']],
    ['nextIndex 与 matchIndex 如何区分？', 'current-term commit rule 防什么反例？', 'commitIndex 与 lastApplied 为什么分别存在？', 'persistent fields 何时必须保存？', 'snapshot 如何重定义日志基准？'],
    ['Lab 3B–3D · Replication & Recovery', 'lessons/assignments/ass03-raft.html#workbook-stage-replication', '把复制、持久化和 snapshot 视为同一条恢复链。']
  );

  bank['0008-linearizability'] = L(
    '并发调用各自返回合理值还不够；怎样判断整段历史是否能解释成尊重实时先后的单机合法执行？',
    ['invocation/response interval', 'real-time edges', 'sequential spec', 'linearization order'],
    [['线性一致性等于所有操作按开始时间排序吗？', '不是。重叠操作可任选合法顺序；不重叠操作必须尊重实时先后。'], ['client program order 是否重要？', '同一 client 的非重叠操作形成实时约束。'], ['可用性与线性一致性是同一个性质吗？', '不是；分区下可选择阻塞来保持强一致性。']],
    '线性化不是在时间线上寻找真实瞬间，而是证明存在一个位于每次调用区间内的合法顺序。',
    [
      ['linear-history-method', 'constraint graph', Q('A 的 Put 完成后 B 才开始 Get。任何线性化顺序必须怎样？', 'Put 在 Get 前', '可任意交换，因为来自不同 client', '只按 response 时间排序', '非重叠实时区间形成硬边。', '线性一致性是全局实时语义。', 'response 时间不足以处理重叠操作。', F('若 Put 与 Get 区间重叠呢？', '两种顺序都可能，取决于返回值和规范', '仍强制 Put 在前', '重叠没有实时硬边。', '你把重叠误当成完成先后。'))],
      ['linear-duplicates', 'logical operation identity', Q('client 重试同一 Put，历史检查器把两次 RPC 当两个独立操作，会怎样？', '可能错误地认为值被写两次或违反至多一次语义', '完全没影响', '会自动合并相同参数', '传输 attempt 与逻辑 operation 必须区分。', '非幂等/版本操作会改变历史。', '检查器不会猜请求身份。', F('历史记录应保存什么？', 'logical request ID 以及 invocation/response', '只保存服务器日志行数', '线性化约束需要操作身份和时间区间。', '行数不能恢复调用语义。'))]
    ],
    Q('系统在网络分区时拒绝/阻塞少数派请求，是否违反线性一致性？', '不违反；线性一致性约束已完成操作，不保证每次调用都完成', '违反，因为每个请求都必须成功', '不违反，因为一致性不考虑返回值', '这是 safety 与 availability 的区别。', '完成保证属于 liveness。', '返回值是合法顺序的核心。'),
    [['给一段 3 操作历史画区间并列出硬边。', '先加不重叠实时边，再用 sequential spec 枚举重叠操作可能顺序。'], ['为什么线性化点是证明工具，不一定对应一行代码？', '分布式实现的可见决定可能由 quorum、日志提交与回复共同形成。']],
    ['调用区间如何产生实时约束？', '重叠操作有哪些排序自由？', 'sequential spec 在检查中做什么？', '重试为何必须保留逻辑 request identity？', '线性一致性为什么不保证可用性？'],
    ['Lab 4 · Linearizable KV', 'lessons/assignments/ass04-kv-raft.html#workbook-stage-rsm', '先定义线性化与重复请求语义，再实现等待和回复路径。']
  );

  bank['0009-zookeeper'] = L(
    '协调服务为何提供少量有序、带会话的原语，而不是让每个应用自己写一个共识系统？',
    ['znode/version', 'session/ephemeral node', 'ordered write', 'watch notification'],
    [['watch 是持久事件日志吗？', '不是。它通常是一次性提示，收到后必须重新读取并重新注册。'], ['ephemeral znode 的生命周期由 TCP 断开决定吗？', '由 ZooKeeper session 过期决定，短暂连接断开不必立刻删除。'], ['follower local read 一定是最新吗？', '不一定；写有全局顺序，读可在本地返回较旧状态。']],
    'ZooKeeper 把一致写序、版本条件和 session 生命周期做成原语；应用仍要用循环“读状态→注册 watch→重检”。',
    [
      ['zk-recipes', 'fair lock', Q('用 ephemeral sequential 节点实现锁时，排队者应 watch 谁？', '紧邻自己的前驱节点', '锁目录本身的所有变化', '所有后继节点', '只观察前驱避免 herd effect，并保持顺序。', '目录级广播会惊醒全部 waiter。', '后继消失不代表轮到自己。', F('前驱在 watch 注册前已删除怎么办？', '注册后立即重查前驱；不存在就继续竞争', '永久等待下一次 watch', 'read/watch 必须用循环关闭竞态。', '一次性通知可能已经错过。'))],
      ['zk-consistency-order', 'read freshness', Q('client 写成功后换到另一个 follower 立即 local read，能否无条件看到新值？', '不能；要依赖 session guarantee/sync 或经过更新的 replica', '能，所有读都线性化', '不能，因为写也没有顺序', 'ZooKeeper 有全局写序，但读路径语义更弱。', '你把写一致性外推到所有本地读。', '写由 Zab 排序。', F('sync 的作用更接近什么？', '让后续读至少赶上调用前的已知写进度', '把所有 znode 永久锁住', '它用于建立 freshness barrier。', '与锁住数据无关。'))]
    ],
    Q('watch 丢失或合并是否意味着 ZooKeeper recipe 无法正确实现？', '不意味着；正确 recipe 把 watch 当提示，每次醒来重读权威状态', '意味着，watch 必须传递每次变化', '不意味着，因为客户端无需读状态', '正确性来自状态与版本，通知只降低轮询。', 'watch 不承诺完整日志。', '客户端必须读取。'),
    [['用 ephemeral sequential node 完整推导一次 leader election。', '创建带序号节点，最小序号为 leader；其他只 watch 前驱；session expiry 自动移除。'], ['为什么 configuration update 需要 version 条件？', '防止基于旧读的覆盖写；compare-and-set 让冲突显式失败。']],
    ['persistent/ephemeral/sequential znode 如何组合？', 'session expiry 与连接断开区别？', 'watch 为什么是 hint？', '写入顺序与本地读 freshness 如何区分？', 'herd effect 如何由前驱 watch 缓解？'],
    ['Lab 5 · Configuration Controller', 'lessons/assignments/ass05-sharded-kv.html#workbook-stage-config', '把 configuration 当 epoch，用条件发布和恢复协议管理重配置。']
  );

  bank['0010-raft-lab-qa'] = L(
    '随机故障测试最后 timeout 时，怎样找到第一次不变量破坏，而不是在海量 heartbeat 日志里猜？',
    ['event identity', 'term/index state', 'first divergence', 'minimal replay'],
    [['最后一条报错通常是根因吗？', '通常不是；它常是更早非法状态造成的超时或无进展。'], ['race detector 能证明协议正确吗？', '不能；它发现 data race，不发现所有时序和协议错误。'], ['日志越多越容易调试吗？', '不一定。高频无结构日志会淹没关键状态变化。']],
    'Raft 调试的单位不是 printf 行，而是带 term、index、role、message ID 的状态转换和单调性断言。',
    [
      ['debug-rpc-timeline', 'first stale reply', Q('matchIndex 从 12 变成 8，最可能违反哪条调试不变量？', '已确认复制事实应单调，旧 RPC reply 不得倒退它', 'election timeout 必须单调', '日志长度永远不能增加', 'matchIndex 是 confirmed fact。', 'timer 与此字段变化无直接关系。', '日志本来就会追加。', F('下一步最有效的日志字段？', 'reply 的发送 term/prev range、当前 term 与旧/new matchIndex', '只打印“RPC failed”', '要证明结果为何被错误应用。', '无版本上下文无法定位。'))],
      ['raft-test-strategy', 'failure reduction', Q('一个 churn 测试偶发失败，最有效的第一步通常是什么？', '保存 seed/timeline，定位最早异常，再缩成更小可复现事件序列', '把所有 sleep 放大十倍', '只连续重跑直到通过', '可重复证据才能验证修复。', '调大 sleep 可能掩盖 race 并破坏性能。', '偶然通过不解释根因。', F('为什么固定 seed 仍可能不完全复现？', 'goroutine/OS 调度还有未被 seed 控制的并发', '因为 seed 从不影响随机数', '随机网络与真实调度是不同来源。', 'seed 会控制测试随机选择。'))]
    ],
    Q('为每个 heartbeat 打印完整日志 slice 是否是好 observability？', '通常不是；应记录状态改变和拒绝原因，必要时按节点/term 过滤', '是，字节越多证据越强', '不是，因为日志完全无用', '信噪比和因果字段比体积重要。', '大量重复会掩盖第一处偏离。', '结构化日志非常有用。'),
    [['设计一条能审计 AppendEntries reply 的结构化日志。', 'node/peer、send term、prev/entries range、reply term/success/conflict、当前 role/term、更新前后 next/match。'], ['解释为什么 monotonic assertions 常比 timeout 日志更接近根因。', '单调量第一次倒退就是非法状态；timeout 只是系统后来无法推进的结果。']],
    ['first divergence 与 final symptom 如何区分？', '哪些 Raft 字段应单调？', 'RPC 日志为何需要出生版本？', 'race detector 能覆盖与不能覆盖什么？', '如何把随机失败缩成最小反例？'],
    ['Lab 3 · Evidence & Debug', 'lessons/assignments/ass03-raft.html#workbook-stage-evidence', '建立 timeline、assertion、race 和重复运行的固定证据链。']
  );

  bank['0011-distributed-transactions'] = L(
    '一个事务跨多个参与者时，协调者与参与者可能在任意阶段崩溃；怎样保证所有人最终不作矛盾决定？',
    ['local tentative state', 'prepare vote/log', 'global decision', 'recovery/blocking'],
    [['2PC 的 prepare 是询问当前能否提交吗？', '更强：YES 参与者持久承诺以后即使重启也能提交，且不能单方面 abort。'], ['2PC 自己提供并发隔离吗？', '不完整；还需锁、OCC 等并发控制。'], ['2PC 在 coordinator 崩溃时总能继续吗？', 'prepared 参与者可能阻塞，直到得知全局决定。']],
    '2PC 的原子性来自持久状态机：YES vote 把参与者带入 in-doubt 状态，只能接受唯一全局决定。',
    [
      ['tx-state-table', 'durable prepare', Q('participant 回复 YES 后立刻崩溃，重启时本地没有 prepare record。风险是什么？', '它可能忘记承诺并 abort，而其他参与者已 commit', '只会少一次 RPC', 'coordinator 会自动修复所有本地数据', 'YES 必须在回复前持久化。', '这是原子性而非性能问题。', '协调者不能凭空恢复参与者未记录的状态。', F('若它回复 NO，需要进入 in-doubt 吗？', '通常不需要，可持久 abort/释放资源', '需要等待 commit', '任一 NO 使全局只能 abort。', 'commit 已不可能。'))],
      ['two-phase-blocking', 'uncertainty', Q('participant 已 prepared，coordinator 失联。为何不能自己 timeout 后 abort？', '全局 commit 可能已决定并通知其他参与者', '因为 timeout 能证明 commit', '因为 participant 没有日志', '局部观察无法区分决定前后 coordinator crash。', 'timeout 只表示不确定。', '恰恰需要日志保存 prepared。', F('向其他 participant 询问总能解阻塞吗？', '不总能；若无人知道 decision，仍需等 coordinator/恢复协议', '总能，多数派会决定', '经典 2PC 没有内置共识多数决。', '你把 2PC 当成 Paxos。'))]
    ],
    Q('把 coordinator 复制一份是否自动让 2PC non-blocking？', '不会；副本间还需一致决定和恢复协议，实质引入共识', '会，只要有两个 coordinator', '不会，因为 coordinator 不可复制', '复制控制面需要确定唯一 decision。', '两个独立决定者可能矛盾。', '可以复制，但必须协调。'),
    [['列出 coordinator 在 prepare 前、收齐 YES 后、写 decision 后崩溃的恢复差异。', '关键是全局 decision 是否持久；未决定可 abort，已决定必须重发同一结果。'], ['为什么 2PC 的 atomicity 与 serializability 要分开证明？', '前者保证参与者同进退；后者约束多个事务并发可见顺序。']],
    ['YES vote 承诺了什么？', 'prepare record 为什么先于回复？', 'in-doubt participant 为什么阻塞？', '2PC 与 concurrency control 分别保证什么？', '复制 coordinator 为什么会引入 consensus？'],
    ['Lab 5 · Reconfiguration Transaction', 'lessons/assignments/ass05-sharded-kv.html#workbook-stage-migration', '把 Freeze→Install→Delete→Publish 当作可恢复的跨组事务。']
  );
})();
