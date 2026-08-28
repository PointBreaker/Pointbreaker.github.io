(function () {
  const bank = window.MIT61810PracticeBank = window.MIT61810PracticeBank || {};
  const Q = (prompt, correct, wrongA, wrongB, why, diagnosisA, diagnosisB, followUp) => ({ prompt, options: [correct, wrongA, wrongB], answer: 0, explanations: [why, diagnosisA, diagnosisB], followUp });
  const F = (prompt, correct, wrongA, why, diagnosisA) => Q(prompt, correct, wrongA, null, why, diagnosisA, null);
  const lesson = (problem, map, before, mental, reasoning, checks, transfer, open, explain, bridge) => ({ problem, map, before, mental, reasoning, checks, transfer, open, explain, bridge });

  bank['13-threads'] = lesson(
    '线程切换看起来只是换寄存器，但内核怎样保证“旧线程被冻结、新线程从自己的历史继续”，且跨切换仍守住锁不变量？',
    ['运行线程', '保存 context', 'scheduler stack', '恢复另一线程'],
    [['线程与进程的状态有什么重叠？', '线程有自己的寄存器和栈；同进程线程通常共享地址空间与进程资源。'], ['context 和 trapframe 一样吗？', '不完全一样。trapframe 保存 user↔kernel 边界状态；context 保存内核线程切换所需的 callee-saved 状态。'], ['为什么 scheduler 需要自己的栈？', '不能在已不再运行、甚至将被回收的进程内核栈上调度其他线程。']],
    'Context switch 的本质是转移“谁拥有 CPU 状态”：保存足以继续旧执行流的最小状态，再恢复另一个已冻结执行流。',
    ['对象：trapframe、kernel context、kernel stack、proc state、p->lock。', '最小例子：A 在 yield 中保存 ra/sp，scheduler 选 B 并恢复 B 的 ra/sp。', '机制链：锁住进程状态→标记不可运行/可运行→swtch→scheduler→选择→swtch 返回另一历史点。', '为什么不是复制整个地址空间：同进程线程共享内存，切换只需 CPU/调度状态。'],
    [
      ['上下文切换（Context Switch）', '最小保存集', Q('swtch 为什么不必保存所有 caller-saved 寄存器？', '调用约定已允许被调用函数覆盖它们，调用者需要的值已自行保存', '因为这些寄存器永远是零', '因为页表保存寄存器', 'context layout 与 ABI 共同定义最小恢复集。', 'caller-saved 有值，只是责任在调用者。', '页表只翻译地址。', F('ra 和 sp 为什么必须在 context 中？', '它们决定恢复到哪里以及使用哪段栈', '它们只影响浮点运算', '控制流与栈是继续执行的核心。', 'ra/sp 与浮点无关。'))],
      ['p->lock 的跨线程释放', '跨切换不变量', Q('xv6 为何允许 scheduler 在另一执行流中释放 p->lock？', '锁保护的是进程状态转换，切换前后共同完成一个协议', '因为锁不需要 owner', '因为 context switch 会自动释放所有锁', '特殊协议把临界区跨越 swtch，直到新栈安全接管状态。', '一般锁仍有所有权规则，这里是刻意设计。', '硬件不会自动释放锁。', F('普通代码可否仿照此模式任意跨线程解锁？', '不可；只有明确证明并文档化的协议才安全', '可以，所有自旋锁都无 owner', '这是 xv6 调度器的特定不变量。', '泛化会破坏锁协议。'))]
    ],
    Q('上下文切换次数减少，吞吐量是否一定提高？', '不一定；更少切换可能意味着更差响应、公平性或 CPU 空闲', '一定，切换是唯一开销', '不一定，因为切换完全免费', '调度同时优化利用率、延迟与公平性。', '单一成本不能代表系统目标。', '保存状态和 cache disruption 都有成本。'),
    [['用“冻结与恢复”解释 swtch 的两个返回点。', 'A 调用 swtch 后冻结；未来被恢复时才从同一调用返回，而 scheduler 当前恢复的是 B 的旧 swtch。'], ['为什么 context switch 可能伤害 cache/TLB？', '新线程的工作集不同，会替换缓存；地址空间切换还可能失效或污染 TLB。']],
    ['thread、process 与 CPU context 分别是什么？', 'trapframe 和 context 各服务哪条边界？', 'scheduler stack 为什么独立？', 'p->lock 跨 swtch 保护什么不变量？', '切换成本为何不只是一组 store/load？'],
    ['Lab traps/lock · 观察调度与并发', '../labs/lock.html#workbook-stage-kmem', '用锁竞争与上下文证据理解调度器如何协调 per-CPU 状态。']
  );

  bank['14-coordination'] = lesson(
    '互斥只能阻止同时修改；当线程必须等待某个状态变化时，怎样保证“检查条件”和“进入睡眠”之间不会丢事件？',
    ['条件谓词', '持锁检查', '原子 sleep', 'wakeup 后重检'],
    [['锁能自动让条件变真吗？', '不能。锁只保护条件与队列的检查/更新。'], ['为什么 wakeup 不是“保存一个未来许可”？', '典型 condition wakeup 只通知当前等待者；若无人等待，事件可能不被记住。'], ['spurious wakeup 为什么要求 while？', '醒来只表示应重新检查，不能证明谓词仍成立。']],
    '正确的 sleep/wakeup 协议要把“条件不成立→登记为等待者→释放锁”做成对生产者不可分割的状态转换。',
    ['对象：condition predicate、condition lock、sleep queue、channel。', '最小例子：消费者见队列空；若释放锁后再登记，生产者可能在缝隙 wakeup，消费者永睡。', '机制链：持锁检查→原子入睡并释放→生产者持同锁改条件/wakeup→醒来重检。', '为什么不是 sleep 前先 unlock：会产生 lost-wakeup window。'],
    [
      ['Lost Wakeup 问题', '竞态窗口', Q('消费者 unlock 后、调用 sleep 前，生产者入队并 wakeup。随后会怎样？', 'wakeup 无等待者，消费者再睡后可能永久等待', '消费者自动记住 wakeup', '生产者必然阻塞', '事件发生在登记前而没有持久状态记录。', '典型 wakeup 不是计数信号量。', '消费者已释放锁，生产者可运行。', F('原子 sleep(lock) 需要保证什么？', '登记等待与释放 condition lock 之间无可见缝隙', '睡眠期间一直持有所有锁', '生产者不能在未登记时改变条件。', '一直持锁会阻止生产者让条件变真。'))],
      ['正确的 sleep/wakeup 接口', '醒来重检', Q('为什么从 sleep 返回后应再次用 while 检查条件？', '其他线程可能先消费资源，或发生无关/虚假唤醒', '因为 sleep 总会清空队列', '因为 while 比 if 编译更快', 'wakeup 只提供重新竞争条件的机会。', 'sleep 不必清空受保护资源队列。', '这是语义正确性，不是微优化。', F('广播唤醒多个消费者但只有一个资源时，谁能继续？', '重新拿锁并发现谓词成立的那个', '所有消费者', '谓词与锁决定实际所有权。', '广播不复制资源。'))]
    ],
    Q('把 wakeup 改成只唤醒一个线程总是安全吗？', '不一定；要证明一个状态变化至多需要一个等待者推进', '总是，减少调度一定正确', '永不安全，必须广播', '通知策略取决于条件语义。', '性能选择不能替代活性证明。', '许多互斥资源可安全单唤醒。'),
    [['构造 lost wakeup 的两线程时间线。', '列出 consumer 检查空、unlock；producer 入队/wakeup；consumer 登记/sleep。'], ['condition variable 为什么必须与谓词和锁一起文档化？', '单独的 channel 名称不能说明何时等待、谁改变条件、何时唤醒和如何重检。']],
    ['互斥与条件同步解决什么不同问题？', 'lost wakeup 的精确窗口在哪里？', 'sleep(lock) 为什么需要原子协议？', '醒来为什么不等于条件成立？', 'signal 与 broadcast 的选择依赖什么？'],
    ['Lab lock · 从互斥走向协调', '../labs/lock.html#workbook-stage-bcache', '在缓存与分配器中识别锁保护的不变量、等待条件和进展证据。']
  );

  bank['15-networking'] = lesson(
    '高速网络把大量小事件推给 CPU；为什么“每包一个中断、立即处理到底”会在过载时产生接收活锁？',
    ['NIC ring', 'interrupt/poll', '协议处理', '应用进展'],
    [['吞吐与 goodput 有什么区别？', '吞吐可包含被接收后丢弃的工作；goodput 是最终交付给应用的有用工作。'], ['RX ring 中描述符的 owner 为什么重要？', '驱动与 NIC 通过位和索引交接缓冲区，owner 不清会读写同一槽。'], ['过载时为什么处理更多中断可能交付更少数据？', 'CPU 被入口和丢包工作占满，没有时间让协议栈/应用排空队列。']],
    '网络过载控制的目标不是“尽快接住每个包”，而是保护完成路径，让有限 CPU 用在最终能交付的工作上。',
    ['对象：descriptor ring、interrupt budget、software queue、application drain rate。', '最小例子：到达率超过处理率；每包中断吃光 CPU，应用不运行，队列永不下降。', '机制链：中断提示有工作→暂时 poll 批量处理→设 budget→给应用和其他任务调度机会。', '为什么不是无限 poll：会伤害其他设备与尾延迟、公平性。'],
    [
      ['今日论文：消除接收活锁', '过载反馈', Q('接收活锁时 CPU utilization 很高但 goodput 很低，原因是什么？', 'CPU 忙于中断和最终被丢弃的包，完成路径得不到调度', 'NIC 完全没有收到包', '应用计算太少所以 CPU 空闲', '忙碌不代表做了最终有用工作。', '高到达率恰是触发条件。', '症状是 CPU 很忙。', F('NAPI 过载时从 interrupt 转 poll 的目的是什么？', '批量摊销入口成本并限制中断风暴', '让每个包产生更多中断', 'polling 在积压时更高效。', '方向相反。'))],
      ['论文解决方案', 'budget', Q('poll budget 的作用是什么？', '限制一次处理量，避免网络独占 CPU 并允许重新调度', '保证所有包零延迟', '扩大 MTU', 'budget 是公平与活性的控制。', '排队与调度使零延迟不可能保证。', 'MTU 是协议/链路配置。', F('budget 太小的主要代价？', '固定调度/轮询开销占比上升，吞吐可能下降', '环形队列不再需要', '批量不足会失去摊销。', 'ring 仍是 NIC 接口。'))]
    ],
    Q('把 RX ring 无限增大能否解决过载？', '不能；只能延迟丢包并增加排队延迟，长期到达率仍须不高于服务率', '能，内存足够就不会过载', '不能，因为 ring 越大带宽越小', '容量不能修复持续速率不匹配。', '有限或无限等待都无法让服务率增加。', '带宽不由 ring 大小简单反比决定。'),
    [['用队列论直觉解释接收活锁。', '到达率超过端到端服务率，系统却把 CPU 花在入口，进一步降低完成服务率，形成反馈。'], ['为什么性能报告应同时给 packet rate、drop、goodput 与 CPU 分布？', '单一吞吐不能区分接住、丢弃和真正交付，也不能定位 CPU 花在哪里。']],
    ['RX descriptor 的所有权怎样交接？', 'interrupt 与 polling 各在何种负载下更合适？', '接收活锁为什么不是 CPU idle？', 'budget 交换了哪些目标？', 'ring 容量为什么不能修复持续过载？'],
    ['Lab net · 实现 ring ownership', '../labs/net.html#workbook-stage-rx', '先用最小 descriptor trace 证明 owner 交接，再验证丢包、并发与中断路径。']
  );

  bank['16-shenango'] = lesson(
    '通用内核网络栈提供隔离和兼容性，却难以满足微秒级尾延迟；如何旁路数据面又保留 CPU 与 NIC 的全局调度？',
    ['NIC queues', 'I/O kernel', 'runtime cores', 'latency-aware scheduling'],
    [['kernel bypass 绕过了什么？', '数据包常规内核协议栈与系统调用路径；不等于没有保护/驱动/资源管理。'], ['平均延迟与 tail latency 为什么不同？', '少量排队、抢占或 cache miss 会显著抬高高分位，即使均值看似好。'], ['为何 busy polling 低延迟却昂贵？', '即使无请求也占用核心和功耗。']],
    'Shenango 把快路径搬到应用 runtime，同时保留一个全局 I/O kernel 观察负载并重新分配核心。',
    ['对象：hardware queue、runtime、guaranteed core、congestion signal、CPU allocation。', '最小例子：一个 runtime 突发排队；I/O kernel 检测积压并借给它额外核心。', '机制链：旁路 packet→runtime fast path→I/O kernel 全局观测→动态 core allocation。', '为什么不是每应用固定核心：负载突发与空闲会造成尾延迟或浪费。'],
    [
      ['解决方案：内核旁路', '边界变化', Q('kernel bypass 是否意味着应用可无约束地访问整个 NIC？', '不是；IOMMU、队列分配与控制面仍建立隔离', '是，旁路等于取消操作系统', '不是，因为包仍逐个经过传统 socket 栈', '旁路改变快路径，不删除资源边界。', '系统仍需多租户保护和仲裁。', '传统栈正是被绕开的部分。', F('IOMMU 在这里主要约束什么？', '设备 DMA 可访问的物理内存范围', '应用可执行的 C 语法', 'DMA 需要硬件级地址保护。', '与语言语法无关。'))],
      ['Shenango 的解决方案：I/O 内核', '全局调度', Q('为什么仍需要 I/O kernel？', '各 runtime 只见局部负载，需全局组件仲裁 NIC 与 CPU', '因为 runtime 不能执行任何用户代码', '为了把所有数据包复制两次', '资源过载与公平需要全局视角。', 'runtime 就运行应用逻辑。', '额外复制不是目标。', F('固定分配每个应用 4 核的主要问题？', '空闲时浪费、突发时仍可能不足', '会自动降低 cache miss 到零', '静态容量不匹配动态负载。', '固定核心不能消除所有缓存行为。'))]
    ],
    Q('旁路系统在单应用微基准更快，能否证明多租户尾延迟也更好？', '不能；还要评估隔离、超载、公平与动态资源竞争', '能，峰值吞吐决定一切', '不能，因为微基准永远无价值', '端到端目标与 workload 必须匹配。', '峰值不等于尾延迟。', '微基准可定位机制，只是不能独立证明系统结论。'),
    [['解释 fast path 与 control plane 的分工。', 'runtime 处理常见包/请求；I/O kernel 配置队列、观察拥塞并调整核心。'], ['为什么 tail latency 需要报告具体 percentile 与 offered load？', 'p99/p999 含义不同，接近饱和时排队行为会突变。']],
    ['kernel bypass 绕过与保留了什么？', 'IOMMU 如何保护 DMA？', 'I/O kernel 为何仍在系统里？', '动态 core allocation 修复什么？', '吞吐证据为何不能代替尾延迟证据？'],
    ['Lab net · 从设备契约到 fast path', '../labs/net.html#workbook-stage-evidence', '先证明 xv6 ring 正确，再用 workload、队列与 CPU 证据理解旁路系统的收益来源。']
  );

  bank['17-fs'] = lesson(
    '文件 API 看似只是路径和字节，底层却要把名字、inode、块、缓存和并发更新组织成一致的持久对象图。',
    ['pathname', 'directory/inode', 'block cache', 'disk blocks'],
    [['文件名存在哪里？', '目录文件的目录项把名字映射到 inode number；名字不是 inode 自身属性。'], ['fd 指向路径吗？', '打开后 fd 经 file object 指向 inode/pipe/device，之后 rename 不改变该已打开引用。'], ['block cache 只为性能吗？', '还常提供同一磁盘块的唯一内存副本和同步点。']],
    '文件系统是多层对象映射：路径解析得到 inode，inode 把逻辑 offset 映射到块，缓存协调内存副本与磁盘状态。',
    ['对象：fd、file、inode、directory entry、logical block、buffer cache entry。', '最小例子：open("a/b") 逐级读目录；read 根据 inode/offset 找块并经 cache 读取。', '机制链：name lookup→inode lock/ref→block mapping→buffer ownership→copy to user。', '为什么不是路径直接存数据：命名、硬链接和已打开引用需要独立对象身份。'],
    [
      ['xv6 文件系统架构', '对象区分', Q('unlink 一个仍被进程打开的文件后，进程为什么仍可 read？', '目录名被删，但打开的 file/inode 引用仍保持对象存活', 'unlink 实际不删除目录项', 'read 会重新创建路径', '名称与对象生命周期通过引用计数解耦。', '目录项确实被移除。', '已有 fd 不重新查路径。', F('最后一个 fd 关闭且 link count 为 0 时可发生什么？', 'inode 与数据块可被回收', '路径自动恢复', '两类引用都消失后对象不再可达。', '没有名称来源可恢复。'))],
      ['块缓存 (bio.c)', '唯一缓存副本', Q('同一磁盘块同时存在两个可写 cache entry 的风险是什么？', '更新分叉，写回顺序可能丢失其中一份修改', '磁盘容量自动翻倍', 'inode number 会变短', '唯一副本把同步与一致性集中到一个对象。', '缓存副本不改变物理容量。', 'inode 编号与缓存条目数无关。', F('bget 返回锁住的 buffer 主要保证什么？', '调用者独占观察/修改该块缓存内容', '磁盘已经永久写入', '锁保护内存副本，不等于持久化。', '写回需要另外的 I/O/日志协议。'))]
    ],
    Q('路径解析全程持有根目录到叶子的所有锁是否总更安全？', '不一定；可能死锁且并发差，应靠引用、逐级锁和不变量设计', '是，锁越多越正确', '不是，因为路径解析不需锁', '锁集合必须兼顾生命周期、顺序和并发。', '更多锁可引入循环依赖。', '目录可被并发修改。'),
    [['从 pathname 到磁盘块画出对象链。', 'path components→directory inode/data→inode number→inode→bmap→buffer cache→disk sector。'], ['硬链接为何说明“文件名不是文件”？', '多个目录项可指向同一 inode；删一个名称不必删除对象。']],
    ['fd、file、inode、directory entry 如何区分？', '路径解析为何需要逐级同步与引用？', 'bmap 映射的两个编号是什么？', 'buffer cache 为什么也负责一致性？', 'unlink 与 close 如何共同决定回收？'],
    ['Lab fs · 扩展对象映射', '../labs/fs.html#workbook-stage-large-files', '从 direct/indirect block invariant 开始，再实现 symlink 的名称重解释。']
  );

  bank['18-crash'] = lesson(
    '一次文件系统操作会改多个块；电源可能在任意写入后消失，怎样让恢复后只看到操作前或操作后的完整状态？',
    ['内存事务', 'write-ahead log', 'commit record', 'replay/install'],
    [['并发原子性与崩溃原子性相同吗？', '不相同。锁防止运行时交错；日志约束持久写入前缀。'], ['磁盘写返回就一定持久吗？', '不一定，设备缓存和重排序需要 flush/barrier/FUA 等 contract。'], ['WAL 的“write ahead”指什么？', '新数据的日志记录必须在相应 home-location 更新前持久。']],
    '日志把多块更新变成一个持久化状态机：先持久化完整意图，再提交，最后安装；恢复只认已提交事务。',
    ['对象：transaction updates、log blocks、log header/commit、home blocks。', '最小例子：创建文件需改目录与 inode；只有两者日志和 commit 都持久后才可视为完成。', '机制链：log data→flush→commit→flush→install→clear；recovery 重放 committed log。', '为什么不是直接写 home blocks：崩溃可留下跨块半完成不变量。'],
    [
      ['解决方案：预写日志', '持久顺序', Q('若先写 commit record，再写完所有 log data，崩溃后有什么风险？', '恢复把不完整日志当作已提交事务重放', '只会让日志更快且仍正确', 'commit record 会自动等待其他写', 'commit 必须证明完整意图已经持久。', '这破坏 WAL 的关键顺序。', '没有 flush/设备保证时写入可重排。', F('正确顺序为什么需要 flush/barrier？', '防止设备把逻辑先后写反或只留在易失缓存', '为了压缩日志大小', '持久顺序必须由存储 contract 强制。', '压缩与 ordering 无关。'))],
      ['xv6 日志实现', 'replay 幂等性', Q('恢复可能重复安装同一 committed transaction，为什么通常要让安装幂等？', '崩溃可发生在 replay 中，再次恢复必须仍得到同一状态', '因为日志永远只读', '因为磁盘不会保存 commit', 'home block 覆盖式安装可安全重复。', '恢复会读并写日志/home blocks。', 'commit 正是恢复判断依据。', F('“把块 B 内容写到 home B”为什么天然较易幂等？', '重复覆盖同一目标得到相同最终字节', '因为磁盘自动去重', '赋值式更新可重复执行。', '不依赖设备去重。'))]
    ],
    Q('日志让操作原子后，是否也自动保证多个线程看不到中间状态？', '不自动；运行时隔离仍需锁/事务协调', '是，crash atomicity 等于 concurrency isolation', '否，因为日志从不影响磁盘', '两类原子性约束不同观察者。', '你混淆了 crash 与 concurrent execution。', '日志正是持久化机制。'),
    [['列出 create 涉及两个 home block 时的所有危险崩溃点。', 'log data 期间、commit 前后、安装第一个/第二个 home block、清日志期间，并说明恢复动作。'], ['为什么日志容量会限制单次 transaction？', '提交前必须容纳全部需原子安装的更新，溢出会丢失完整意图。']],
    ['crash atomicity 与并发原子性如何区分？', 'WAL 的持久顺序如何推导？', 'commit record 证明了什么？', 'replay 为什么要幂等？', '设备缓存为何会破坏只看程序顺序的推理？'],
    ['Lab fs · 用不变量理解持久更新', '../labs/fs.html#workbook-stage-symlink', '实现映射功能时同时追踪 inode、块与日志边界，避免“tests pass”掩盖崩溃漏洞。']
  );

  bank['19-journal'] = lesson(
    '真实文件系统既要保证元数据一致，又不想把每个数据块都复制进日志；不同 journaling mode 究竟承诺什么？',
    ['metadata/data updates', 'journal mode', 'ordering/barrier', 'recovery guarantees'],
    [['metadata journaling 与 data journaling 的差别？', '前者只把结构性元数据写日志；后者连文件数据也 journal。'], ['ordered 模式的“ordered”指什么？', '相关 data blocks 必须在提交暴露引用它们的 metadata 前到达稳定存储。'], ['checksum 能替代 flush 吗？', '不能。它能检测不完整/错误记录，但不自动建立写入顺序。']],
    'Journaling mode 是持久化语义 contract：它规定崩溃后哪些对象一致、哪些新数据可能丢，以及写入必须按何顺序持久。',
    ['对象：file data、metadata、journal descriptor/data/commit、device cache。', '最小例子：扩展文件先分配块再更新 inode；ordered 模式先持久 data，再提交指向它的 metadata。', '机制链：选择 journal 集合→建立 data/metadata ordering→commit→checkpoint→recovery scan。', '为什么不是 metadata 一致就够：inode 指向未写的新块可能暴露旧磁盘数据。'],
    [
      ['ext3 "Ordered Data" 模式', '数据泄露边界', Q('inode size/指针先提交，新分配 data block 尚未写入，崩溃后风险是什么？', '文件可能暴露该块原有旧内容', '只会丢文件名，不影响数据', '磁盘会自动把新块清零', '结构一致不等于数据内容安全。', 'inode 已能定位并暴露数据。', '除非文件系统显式清零，设备不会保证。', F('ordered mode 的关键约束？', 'data block 先持久，再提交引用它的 metadata', '所有 data 必须写入 journal', '它用 ordering 而非完整 data journaling。', '这是 data=journal 模式的更强做法。'))],
      ['校验和 (Checksums)', '检测与排序', Q('journal checksum 最直接提供什么？', '识别 torn/incomplete transaction，避免误把垃圾当成有效记录', '强制磁盘按程序顺序写', '让所有应用写原子化', 'checksum 提供完整性证据。', '排序仍需 barrier/flush 或设备 contract。', '应用语义还依赖 transaction 边界。', F('checksum 正确是否证明 home blocks 已安装？', '不证明，只说明被校验日志内容匹配', '证明，checksum 是 commit', '日志完整与 checkpoint 状态是不同对象。', '把数据完整性误当成安装进度。'))]
    ],
    Q('data=journal 一定是最佳模式吗？', '不一定；语义更强但写放大更大，选择取决于 workload 与保证', '一定，保证越强永远越好', '一定最差，因为日志没有价值', '工程设计要匹配所需持久语义。', '额外写入和 latency 是真实成本。', '日志解决崩溃一致性。'),
    [['比较 writeback、ordered、journal 三种模式的崩溃后承诺。', '分别说明 metadata 一致、data-before-metadata ordering、data+metadata journal，以及可能暴露/丢失的数据。'], ['为什么 benchmark 必须包含 fsync 语义？', '不等待持久化的吞吐不能代表需要 durability 的应用路径。']],
    ['metadata consistency 与 data freshness 有何不同？', 'ordered mode 约束哪条持久顺序？', 'checksum 能证明与不能证明什么？', 'journaling mode 如何影响 write amplification？', 'fsync 为什么改变性能实验语义？'],
    ['Lab fs · 在功能实现中保留 crash contract', '../labs/fs.html#workbook-stage-evidence', '把测试结果、日志边界和崩溃后不变量放在同一证据表里。']
  );

  bank['20-rcu'] = lesson(
    '读多写少结构若每次读取都争同一把锁，扩展性会崩塌；怎样允许读者无锁观察，同时安全回收旧版本？',
    ['reader snapshot', 'copy/update', 'publish pointer', 'grace period/reclaim'],
    [['“无锁读取”是否等于没有同步？', '不是。读者仍依赖发布顺序、read-side critical section 与延迟回收。'], ['为什么不能更新指针后立刻 free 旧节点？', '已经取得旧指针的读者可能仍在使用。'], ['grace period 的语义是什么？', '更新前已进入的读侧临界区都已结束，因此旧版本不再被这些读者引用。']],
    'RCU 把写入拆成发布新版本与延迟回收旧版本；读者快，是因为回收者替它们承担了生命周期协调。',
    ['对象：current pointer、old/new version、reader epoch、grace period。', '最小例子：writer 复制节点并原子发布；旧 reader 继续走旧链，新 reader 看新链；grace 后 free。', '机制链：copy→modify→release-publish→wait grace→reclaim。', '为什么不是立刻原地改：读者可能看到中间结构或悬空对象。'],
    [
      ['Read-Copy Update (RCU)', '安全回收', Q('writer 发布新 head 后最早何时可 free 旧 head？', '确认所有可能持有旧指针的既有读者都退出后', '原子 store 返回后立刻', '等任意一个新读者进入后', '指针发布与旧对象生命周期是两个阶段。', '原子性不等待已在途读者。', '新读者不代表旧读者结束。', F('若读侧临界区无限阻塞，会怎样？', 'grace period 与回收可能被无限延迟', 'writer 可安全忽略它', '回收安全依赖读者最终退出。', '忽略会造成 use-after-free。'))],
      ['RCU 的局限性', 'workload 边界', Q('RCU 最适合哪类 workload？', '读取极多、更新较少且可复制发布的数据结构', '高频多字段原地写且需立即回收', '只有单线程的结构', '它用写侧复杂度和延迟回收换读侧低开销。', '该模式会放大复制、冲突和积压。', '单线程无需这类并发机制。', F('更新速度长期超过 grace/reclaim 速度的风险？', '旧版本积压并消耗大量内存', '读者自动更快', '延迟回收形成 backlog。', '更新积压不会提升读取。'))]
    ],
    Q('RCU 读取到旧版本是否一定是 bug？', '不一定；其 contract 通常允许一致的旧 snapshot', '一定，读者必须总见最新写', '不一定，因为 RCU 不保证内存安全', '一致性语义需明确，不必等于线性最新。', '你假定了更强的一致性。', '正确 RCU 正是要保证生命周期安全。'),
    [['用三条时间线画出旧 reader、新 reader 与 writer。', '旧 reader 先取旧指针；writer 发布新；新 reader 取新；旧 reader 退出；grace；free 旧。'], ['RCU 把同步成本从谁转移给谁？', '读者几乎不争锁；writer/回收器承担复制、发布、等待与内存积压。']],
    ['publish 与 reclaim 为什么必须分开？', 'grace period 证明了什么？', '旧 snapshot 何时可接受？', 'RCU 为什么偏好读多写少？', 'memory ordering 在 pointer publish 中保护什么？'],
    ['Lab lock · 对比锁竞争与读侧成本', '../labs/lock.html#workbook-stage-evidence', '用 contention/throughput 证据区分“正确同步”和“可扩展同步”。']
  );

  bank['21-isolation'] = lesson(
    '容器、虚拟机和用户态内核都叫“隔离”，但它们共享与复制的内核边界不同；怎样比较真实攻击面？',
    ['workload', 'syscall/hypercall boundary', 'shared kernel or VMM', 'resource isolation'],
    [['namespace 与 access control 相同吗？', '不是。namespace 改变可见名称视图；权限/capability/seccomp 限制可执行操作。'], ['容器有自己的内核吗？', '通常共享宿主内核，只隔离进程看到的资源视图。'], ['VM 为什么仍不等于绝对安全？', 'hypervisor、设备模型、固件与硬件仍是可信计算基和攻击面。']],
    '比较隔离方案要画出共享边界：攻击者能调用哪些接口、与谁共享哪层内核、逃逸后获得什么能力。',
    ['对象：namespace、cgroup、seccomp filter、guest kernel、VMM/device model。', '最小例子：容器 syscall 直接进入 host kernel；VM syscall 先由 guest kernel处理，特权操作再到 VMM。', '机制链：隔离视图→限制能力/资源→在共享边界验证请求。', '为什么不是“加 chroot 就安全”：路径根改变不限制 syscall、进程、网络和特权能力。'],
    [
      ['Linux 容器', '边界组合', Q('仅使用 namespaces、没有 cgroups，主要缺少什么？', 'CPU/内存/I/O 等资源用量约束', '文件名隔离', '独立 guest kernel', '可见性隔离不自动限制消耗。', 'mount namespace 等可隔离名称视图。', '容器本来通常共享 host kernel。', F('仅使用 cgroups、没有 namespaces 呢？', '资源受限但仍可能看到宿主/其他进程的名称与对象', '自动获得完整 VM 隔离', '两类机制解决不同维度。', 'cgroup 不创建 guest kernel。'))],
      ['安全对比：可访问的系统调用', '攻击面', Q('为什么减少可达 syscall 集通常有助于容器安全？', '缩小攻击者能触发的内核代码与状态转换集合', '保证剩余 syscall 都无 bug', '让应用不再需要内核', 'seccomp 是攻击面缩减而非正确性证明。', '过滤不能证明实现无漏洞。', '允许的调用仍由共享内核处理。', F('VM 中 guest syscall 是否直接进入 host kernel 同名 handler？', '通常不会，先由 guest kernel 处理', '一定会', 'VM 增加了一层内核/VMM边界。', '这混淆容器与 VM。'))]
    ],
    Q('“VM 比容器安全”能否脱离 threat model 成为绝对结论？', '不能；要比较共享边界、VMM/设备攻击面、配置与对手能力', '能，VM 永远不可逃逸', '不能，因为两者完全相同', '隔离强度是具体系统与威胁模型的性质。', 'hypervisor 也会有漏洞。', '它们共享内核边界明显不同。'),
    [['画出容器与 VM 的 syscall 路径并标出共享组件。', '容器 app→host kernel；VM app→guest kernel→虚拟硬件/VMM→host，分别标注攻击面。'], ['为什么资源隔离也是安全性？', '无限 CPU、内存、fd 或 I/O 消耗可造成拒绝服务，即使无法读取他人数据。']],
    ['namespace、cgroup、capability、seccomp 各限制什么？', '容器与 VM 共享的最底层边界有何不同？', 'TCB 和 attack surface 如何区分？', '为什么 chroot 不是完整沙箱？', '隔离比较为何必须声明 threat model？'],
    ['Lab mmap · 从地址空间 contract 理解隔离', '../labs/mmap.html#workbook-stage-fork', '用 VMA、fork 与 unmap 生命周期观察“共享什么、复制什么、谁验证”的边界。']
  );

  bank['22-bpf'] = lesson(
    '允许用户把程序注入内核快路径极其强大；验证器怎样证明它终止、内存安全且只使用获准能力？',
    ['untrusted bytecode', 'static verifier', 'interpreter/JIT', 'kernel hook'],
    [['解释器与 JIT 的信任边界差异？', '解释器每步执行受控语义；JIT 还必须正确把已验证语义翻成机器码。'], ['静态验证为何必须保守？', '无法证明安全的程序必须拒绝，即使它运行时可能恰好安全。'], ['BPF map 是普通用户指针吗？', '不是，是由内核管理、通过 helper/受验证访问使用的共享对象。']],
    'eBPF 的可扩展性来自 proof-before-use：加载时把不可信程序转成带状态证明的受限程序，运行时才敢放在内核热路径。',
    ['对象：bytecode instruction、abstract register state、pointer provenance、helper capability、JIT output。', '最小例子：verifier 跟踪 r1 是 packet pointer 且 offset 在 data_end 前，才允许 load。', '机制链：解析 CFG→抽象执行→证明终止/边界/类型→加载/JIT→hook 执行。', '为什么不是崩了再杀：内核内越界可在检测前破坏整个系统。'],
    [
      ['eBPF 验证器', '抽象状态', Q('verifier 为什么区分“标量 0x1000”和“指向 packet 的指针+offset”？', '数值相同不代表拥有同样的内存访问能力与边界证明', '为了让寄存器更多', '因为标量不能做加法', 'pointer provenance 是安全能力的一部分。', '状态分类不改变硬件寄存器数量。', '标量当然可以算术。', F('指针与未知标量相加后为何常被拒绝或缩窄？', '结果边界/来源可能无法证明', '因为 BPF 没有加法指令', '验证器必须保持可证明的访问范围。', 'ISA 支持算术，问题是安全证明。'))],
      ['方案 3：将', '验证与翻译', Q('bytecode 已通过 verifier，是否意味着任何 JIT 实现都安全？', '不是；JIT bug 可生成与已验证语义不同的机器码', '是，验证自动覆盖所有编译器 bug', '不是，因为 JIT 永远不能在内核运行', '翻译器本身仍在可信计算基。', '证明针对源语义，不自动证明实现。', '生产 eBPF 正广泛使用内核 JIT。', F('最直接的缓解思路？', '测试/形式验证翻译、W^X、架构加固与差分执行', '跳过 verifier', '需同时约束生成代码和映射权限。', '这会扩大风险。'))]
    ],
    Q('验证器拒绝一个实际上不会越界的程序，是否证明验证器错误？', '不一定；保守静态分析允许 false negative', '是，验证器必须接受所有安全程序', '不是，因为验证器可随意拒绝', 'soundness 与 completeness 是不同目标。', '完备证明对一般程序不可得且成本高。', '拒绝仍应遵守明确语言/资源规则。'),
    [['用抽象解释画出 packet bounds check 前后寄存器状态。', '检查 data+offset<=data_end 后，true 分支获得可访问范围证明；另一路不能 load。'], ['为什么 helper API 是 capability surface？', '程序只能通过获准 helper 访问内核对象；参数和返回类型也进入验证。']],
    ['verifier 要证明哪几类性质？', 'pointer provenance 为什么不等于数值？', '保守验证为何会拒绝安全程序？', 'JIT 为什么加入新的 TCB？', 'helper 与 map 如何限制内核能力？'],
    ['Lab net · 在更硬的设备边界练 ownership', '../labs/net.html#workbook-stage-tx', '先理解 ring descriptor 的受控状态，再回看 verifier 如何用静态状态限制快路径。']
  );

  bank['23-meltdown'] = lesson(
    '架构权限检查最终会阻止内核数据返回，但推测执行留下的微架构痕迹为何仍能泄露秘密？',
    ['faulting load', 'speculative transient work', 'cache side effect', 'timing recovery'],
    [['architectural state 与 microarchitectural state 的区别？', '前者是 ISA 可见结果；后者包括 cache、预测器、TLB 等实现状态。'], ['异常会撤销 cache fill 吗？', '通常不会完整撤销，这正给瞬态执行侧信道留下信号。'], ['侧信道与直接读取有什么区别？', '攻击者从时间、缓存等间接效应推断秘密，而非在寄存器中合法获得它。']],
    'Meltdown 利用“权限检查在架构上生效，但秘密已影响 cache”的时间窗口，把不可见值编码成可测量延迟。',
    ['对象：privileged address、transient value、probe array、cache line、timing measurement。', '最小例子：瞬态读取 secret=s，再访问 probe[s*4096]；异常后测哪条 cache line 快。', '机制链：训练/触发→faulting load→瞬态编码→异常清架构状态→cache timing 解码。', '为什么不是普通越权 load：最终寄存器结果会被 fault 丢弃，泄露在旁路状态。'],
    [
      ['Meltdown 详细分析', '两类状态', Q('异常处理后攻击者寄存器里没有 secret，攻击为何仍可能成功？', 'secret 已选择性加载某条 cache line，时间测量可间接恢复它', '异常会把 secret 写入文件', '内核会把 secret 作为错误码返回', '微架构副作用没有随架构回滚完全消失。', '攻击不依赖文件写入。', '错误返回不包含秘密。', F('若每个 probe line 访问时间都相同，哪一步失去信号？', 'cache timing 解码', '页表权限检查', '没有可区分的侧信道输出。', '权限检查仍可正常发生。'))],
      ['防御', 'KPTI 边界', Q('KPTI 为什么能缓解 Meltdown？', '用户页表中不映射大部分内核内存，使瞬态 load 也缺少目标映射', '把所有 cache 永久关闭', '让用户进程运行在内核态', '它减少用户态可达的内核映射。', '实际防御不要求禁用所有 cache。', '这会彻底破坏隔离。', F('KPTI 的主要性能代价来自哪里？', '系统调用/中断更频繁切页表并影响 TLB', '文件名更长', '隔离边界增加翻译状态切换。', '命名与此无关。'))]
    ],
    Q('权限检查严格正确，能否据此证明没有微架构侧信道？', '不能；还需分析 cache、预测器、执行端口等可观测共享状态', '能，ISA 正确就是全部安全性', '不能，因为权限检查没有意义', '安全性必须覆盖实现层可观察性。', 'Meltdown 正是反例。', '架构权限仍是必要防线。'),
    [['不用“CPU 有 bug”概括，讲清 Meltdown 的编码与解码。', '瞬态 secret 作为 probe 索引造成一条 cache line 热；异常后逐条计时，最快索引推断 secret。'], ['为什么修补侧信道常有性能代价？', '隔离 cache/页表、序列化推测或增加 flush 会牺牲缓存复用与流水线并行。']],
    ['架构状态与微架构状态如何区分？', 'secret 如何被编码进 cache？', '异常为何没有消除全部痕迹？', 'KPTI 改变了哪条映射关系？', '侧信道防御为何必须声明 threat model 与硬件？'],
    ['Lab pgtbl · 回到页表隔离边界', '../labs/pgtbl.html#workbook-stage-permissions', '用 PTE、TLB 与地址空间证据理解 KPTI 改变了什么，以及它没有消灭什么。']
  );
})();
