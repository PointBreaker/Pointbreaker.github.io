(function () {
  const page = document.querySelector('.page');
  if (!page) return;

  const N = (title, meta = '', kicker = '', tone = '') => ({ title, meta, kicker, tone });
  const definitions = [
    {
      page: '/cs336/lessons/0001-intro-tokenization.html', match: 'bytes（唯一的初始单位）', layout: 'flow',
      kicker: 'Tokenizer pipeline', title: '文本如何变成唯一的 token ID 序列', note: 'Vocabulary 决定 token 是否存在；merge rank 决定 encoding 时如何切分。',
      nodes: [N('Unicode 文本', '人类看到的字符'), N('UTF-8 bytes', '唯一、可回退的初始单位'), N('Current segmentation', '从单 byte 状态开始'), N('Ranked merges', '每步执行当前最小 rank'), N('Token IDs', '最后查 vocabulary', '', 'accent')]
    },
    {
      page: '/cs336/lessons/0002-pytorch-resource-accounting.html', match: 'Training\ntokens → forward', layout: 'lanes',
      kicker: 'Resource accounting', title: '训练同时推进计算图与资源生命周期', note: 'Activations 是按 batch/sequence 产生的临时对象，不应混进固定的 per-parameter state。',
      lanes: [
        { label: '训练路径', nodes: [N('Tokens'), N('Forward'), N('Loss'), N('Backward'), N('Optimizer', '更新 weights', '', 'accent')] },
        { label: '显存对象', nodes: [N('Weights', 'model state'), N('Activations', 'forward 保存'), N('Gradients', 'backward 产生'), N('Optimizer states', 'm / v 等')] }
      ]
    },
    {
      page: '/cs336/lessons/0003-architectures-hyperparameters.html', match: 'x:[B,T,d]\n├─ norm', layout: 'flow',
      kicker: 'Transformer block', title: '同一个 token state 沿两条 residual 子层演化', note: '两次 residual add 都要求主分支输出回到 [B,T,d]；head/FFN 的内部 shape 可以变化。',
      nodes: [N('Token state x', '[B,T,d]', 'Input'), N('Norm + Q/K/V', '构造 attention 对象'), N('Causal attention', '多头合并回 [B,T,d]'), N('Residual add', '加回 x', '', 'accent'), N('Norm + MLP', 'd → d_ff → d'), N('Residual add', '进入 next block', '', 'accent')]
    },
    {
      page: '/cs336/lessons/0004-attention-alternatives-moe.html', match: 'total parameters ≠ active parameters per token', layout: 'cards',
      kicker: 'Three different reductions', title: 'GQA、Local Attention 与 MoE 缩小的对象并不相同', note: '先指出哪一个对象变小，才能判断 memory、FLOPs 与 communication 是否真的下降。',
      cards: [
        { title: 'GQA', rows: [['保留', 'query heads'], ['共享', 'K/V heads'], ['主要减少', 'KV projection + cache']] },
        { title: 'Local Attention', rows: [['限制', 'visible key positions'], ['主要减少', 'attention edges'], ['代价', '直接长程连接']] },
        { title: 'MoE', rows: [['保留', 'large total experts'], ['激活', 'top-k experts / token'], ['主要减少', 'active parameter FLOPs']] }
      ]
    },
    {
      page: '/cs336/lessons/0005-gpus.html', match: 'HBM → L2 → shared memory', layout: 'stack',
      kicker: 'GPU memory hierarchy', title: '越靠近算术单元，容量越小、复用要求越高', note: '“数据在 GPU 上”仍不够精确：瓶颈取决于它从哪一层被搬到计算单元。',
      levels: [
        { title: 'HBM', meta: '大容量 · 高带宽 · 芯片外', tag: 'global traffic', width: 100 },
        { title: 'L2 cache', meta: '全芯片共享', tag: 'reuse across SMs', width: 90 },
        { title: 'Shared / L1', meta: '每个 SM 的软件/硬件局部性', tag: 'tile reuse', width: 78 },
        { title: 'Registers', meta: '每线程最快存储', tag: 'thread-local', width: 66 },
        { title: 'Arithmetic units', meta: 'CUDA / Tensor cores', tag: 'FLOPs', width: 54 }
      ]
    },
    {
      page: '/cs336/lessons/0006-kernels-triton.html', match: 'PyTorch ops → kernel graph', layout: 'flow',
      kicker: 'Kernel optimization loop', title: '先从算子图找到 traffic，再决定 fusion 或 tiling',
      nodes: [N('PyTorch ops', '语义层'), N('Kernel graph', 'launches + intermediates'), N('Profile', '定位 traffic / stalls'), N('Fusion', '减少 launch 与中间写回'), N('Tiling', '增加 on-chip reuse', '', 'accent')]
    },
    {
      page: '/cs336/lessons/0007-parallelism.html', match: 'DP: batch shards', layout: 'cards',
      kicker: 'Parallelism object map', title: '四种并行策略切分的对象不同', note: '选择策略前先回答：切什么、复制什么、每层必须通信什么。',
      cards: [
        { title: 'Data Parallel', rows: [['切分', 'batch'], ['复制', 'full model'], ['通信', 'gradients']] },
        { title: 'FSDP', rows: [['切分', 'batch + model states'], ['临时', 'gather parameters'], ['通信', 'gather / reduce-scatter']] },
        { title: 'Tensor Parallel', rows: [['切分', 'tensor dimensions'], ['共享', 'same tokens'], ['通信', 'layer partials']] },
        { title: 'Pipeline Parallel', rows: [['切分', 'layer ranges'], ['调度', 'microbatches'], ['通信', 'activations / grads']] }
      ]
    },
    {
      page: '/cs336/lessons/0008-parallelism-2.html', match: 'steady-state shard ≠ peak memory during all-gather', layout: 'cards',
      kicker: 'ZeRO state map', title: '每升一个 ZeRO stage，就多切分一类 persistent state', note: 'Steady-state shard 只描述常驻份额；all-gather 期间 materialized parameters 仍会形成峰值。',
      cards: [
        { title: 'DDP', rows: [['Parameters', 'copy'], ['Gradients', 'copy'], ['Optimizer m/v', 'copy']] },
        { title: 'ZeRO-1', rows: [['Parameters', 'copy'], ['Gradients', 'copy'], ['Optimizer m/v', 'shard']] },
        { title: 'ZeRO-2', rows: [['Parameters', 'copy'], ['Gradients', 'shard'], ['Optimizer m/v', 'shard']] },
        { title: 'ZeRO-3 / FULL_SHARD', rows: [['Parameters', 'shard'], ['Gradients', 'shard'], ['Optimizer m/v', 'shard']] }
      ]
    },
    {
      page: '/cs336/lessons/0009-scaling-laws.html', match: 'choice: N parameters', layout: 'flow',
      kicker: 'Scaling experiment', title: 'Compute budget 只是起点，经验拟合必须经过验证',
      nodes: [N('Choose N, D, recipe', '明确 controlled variables'), N('Approximate compute', 'C ≈ 6ND'), N('Training runs', '收集 validation losses'), N('Fit function', '连同 uncertainty'), N('Validate', 'holdout + residuals', '', 'accent'), N('Extrapolate', '只在声明范围内')]
    },
    {
      page: '/cs336/lessons/0010-inference.html', match: 'Training\ntokens → forward', layout: 'lanes',
      kicker: 'Training vs inference', title: '两条运行路径保留的状态完全不同',
      lanes: [
        { label: 'Training', nodes: [N('Tokens'), N('Forward'), N('Loss'), N('Backward'), N('Optimizer')] },
        { label: 'Inference', nodes: [N('Prompt'), N('Prefill', 'build KV cache'), N('Decode', 'one token'), N('Append K/V'), N('Repeat', '', '', 'accent')] }
      ]
    },
    {
      page: '/cs336/lessons/0011-scaling-laws-details.html', match: 'point estimate ≠ confidence interval ≠ guarantee', layout: 'flow',
      kicker: 'Evidence chain', title: '可信外推从 run design 开始，而不是从 curve fitting 开始',
      nodes: [N('Run design', 'controlled variables'), N('Observations'), N('Fit parameters'), N('Validate', 'holdout + residuals'), N('Uncertainty', 'bootstrap + regime checks', '', 'accent'), N('Candidate extrapolation', 'sensitivity → decision')]
    },
    {
      page: '/cs336/lessons/0012-evaluation.html', match: 'claim with validity boundary', layout: 'flow',
      kicker: 'Evaluation pipeline', title: '从目标行为到带有效边界的结论', note: 'Dataset、prompt、decoding、scorer 与 aggregation 都是测量系统的一部分。',
      nodes: [N('Target behavior'), N('Operationalize', 'items + prompt + decoding'), N('Model responses'), N('Scorer / judge'), N('Measurements', 'per item'), N('Claim', 'uncertainty + subgroup + boundary', '', 'accent')]
    },
    {
      page: '/cs336/lessons/0013-data-sources.html', match: 'source / license / collection policy', layout: 'flow',
      kicker: 'Data provenance', title: '训练数据从来源到可审计样本的生命周期',
      nodes: [N('Source + license', '允许怎样使用'), N('Collection policy', '时间与范围'), N('Versioned snapshot', 'WARC / archive / dump'), N('Raw records', '保留 metadata'), N('Extract + normalize', '可追溯转换'), N('Training records', '进入过滤与去重', '', 'accent')]
    },
    {
      page: '/cs336/lessons/0014-data-filtering-dedup.html', match: 'filter score ≠ ground-truth quality', layout: 'lanes',
      kicker: 'Data selection pipeline', title: '过滤与去重是两条不同证据路径，最后共同改变训练分布', note: 'Filter score 不是 ground-truth quality；hash collision 也不是 duplicate 的证明。',
      lanes: [
        { label: 'Quality path', nodes: [N('Extracted text'), N('Filter scores'), N('Accept / reject')] },
        { label: 'Dedup path', nodes: [N('Normalized document'), N('Shingles + signatures'), N('Duplicate graph')] },
        { label: 'Downstream', nodes: [N('Selected corpus'), N('Mixture + tokenize'), N('Train + evaluate', '', '', 'accent')] }
      ]
    },
    {
      page: '/cs336/lessons/0015-alignment-sft-rlhf.html', match: 'SFT: prompt + target response', layout: 'cards',
      kicker: 'Alignment signals', title: 'SFT、Preference 与 RLHF 监督的是不同对象',
      cards: [
        { title: 'SFT', rows: [['输入', 'prompt + target'], ['目标', 'token cross-entropy'], ['更新', 'policy']] },
        { title: 'Preference', rows: [['输入', 'chosen / rejected'], ['目标', 'comparison loss'], ['更新', 'reward / policy']] },
        { title: 'RLHF', rows: [['输入', 'policy rollouts'], ['信号', 'reward − KL'], ['更新', 'advantage → policy']] }
      ]
    },
    {
      page: '/cs336/lessons/0016-alignment-rlvr.html', match: 'current policy samples G responses', layout: 'flow',
      kicker: 'RLVR loop', title: '可验证奖励从 rollout 回到 policy update', note: 'Verifier 只检查可观察的结果；它不自动等于真实 reasoning quality。',
      nodes: [N('Prompt'), N('Policy samples', 'G responses'), N('Verifier', 'assign rewards'), N('Group baseline', 'normalize advantage'), N('Policy update', 'new sampling distribution', '', 'accent')]
    },
    {
      page: '/cs336/lessons/0017-alignment-rl.html', match: 'understanding:\nimage → patches', layout: 'lanes',
      kicker: 'Multimodal routes', title: '理解与统一生成走的是两条不同表示路径',
      lanes: [
        { label: 'Understanding', nodes: [N('Image'), N('Patches'), N('Vision encoder'), N('Projector'), N('LLM tokens'), N('Text')] },
        { label: 'Unified generation', nodes: [N('Image'), N('Visual tokenizer'), N('Visual token IDs'), N('Joint sequence model'), N('Image / text output')] }
      ]
    },
    {
      page: '/cs336/lessons/0018-guest-daniel-selsam.html', match: 'informal intent → formal specification', layout: 'flow',
      kicker: 'Generate–verify loop', title: '生成器提出候选，验证器只接受满足形式规范的结果',
      nodes: [N('Informal intent'), N('Formal specification'), N('Generator', 'proof / program candidates'), N('Verifier', 'pass or diagnostic', '', 'accent'), N('Feedback', '修正下一轮搜索')]
    },
    {
      page: '/cs336/lessons/0019-guest-dan-fu.html', match: 'model workload + hardware hierarchy', layout: 'flow',
      kicker: 'Systems optimization', title: '每次优化都必须从资源账本回到可验证瓶颈',
      nodes: [N('Workload + hardware'), N('Resource accounting'), N('Hypothesized bottleneck'), N('Algorithm / layout / kernel change'), N('Measure again', 'accept or revise', '', 'accent')]
    },
    {
      page: '/6.1810/lessons/01-introduction.html', afterHeading: '什么是操作系统？', layout: 'stack',
      kicker: 'Operating-system stack', title: '应用通过受保护的接口共享硬件', note: 'System call boundary 同时承担抽象与隔离：应用请求服务，但不能直接控制 kernel state 或 hardware。',
      levels: [
        { title: 'Applications', meta: 'shell · compiler · database', tag: 'untrusted', width: 100 },
        { title: 'System calls', meta: 'open · read · fork · exec', tag: 'protected boundary', width: 92 },
        { title: 'Kernel services', meta: 'process · VM · FS · network', tag: 'policy + multiplexing', width: 84 },
        { title: 'Hardware', meta: 'CPU · RAM · disk · NIC', tag: 'resources', width: 76 }
      ]
    },
    {
      page: '/6.1810/lessons/02-c-in-xv6.html', afterHeading: 'C 程序在 xv6 中的内存布局', layout: 'stack',
      kicker: 'Process address space', title: '同一个虚拟地址空间容纳不同生命周期的对象', note: 'Stack 向低地址增长，heap 向高地址增长；text 的权限通常是 R+X，而 data/heap/stack 需要 R+W。',
      levels: [
        { title: 'High addresses', meta: 'trampoline / trapframe', tag: 'xv6 mappings', width: 100 },
        { title: 'Stack ↓', meta: 'frames · locals · return addresses', tag: 'R+W', width: 94 },
        { title: 'Unmapped gap', meta: 'room for growth', tag: 'guard', width: 88 },
        { title: 'Heap ↑', meta: 'sbrk / dynamic objects', tag: 'R+W', width: 82 },
        { title: 'Data', meta: 'globals · static variables', tag: 'R+W', width: 76 },
        { title: 'Text', meta: 'machine instructions', tag: 'R+X', width: 70 }
      ]
    },
    {
      page: '/6.1810/lessons/03-os-design.html', afterHeading: '操作系统全景', layout: 'flow',
      kicker: 'Protected kernel path', title: '每次系统调用都把不可信请求变成受检查的资源操作',
      nodes: [N('Application', 'untrusted state'), N('System call', 'small interface'), N('Kernel validation', 'arguments + permissions', '', 'accent'), N('Kernel abstraction', 'process / file / VM'), N('Hardware resource')]
    },
    {
      page: '/6.1810/lessons/04-organization.html', match: '用户进程:\n  fork() → libc', layout: 'flow',
      kicker: 'Microkernel service path', title: 'L4 把 Unix 语义移到用户态 server', note: '隔离边界更小，但一次服务可能引入额外 IPC、context switch 与 copy。',
      nodes: [N('User process', 'fork()'), N('libc stub'), N('IPC call', 'block for reply'), N('L4 kernel', 'route message', '', 'accent'), N('Linux server', 'implement fork'), N('IPC reply', 'resume process')]
    },
    {
      page: '/6.1810/lessons/05-page-tables.html', match: 'CPU 发出 VA', layout: 'lanes',
      kicker: 'Address translation', title: 'TLB hit 直接复用翻译；只有 miss 才遍历页表',
      lanes: [
        { label: 'TLB hit', nodes: [N('CPU virtual address'), N('Cached PTE + permission'), N('Physical address'), N('RAM access', '', '', 'accent')] },
        { label: 'TLB miss', nodes: [N('CPU virtual address'), N('Sv39 page-table walk'), N('Fill TLB'), N('Physical address'), N('RAM access', '', '', 'accent')] }
      ]
    },
    {
      page: '/6.1810/lessons/05-page-tables.html', match: 'Level 2 目录', layout: 'flow',
      kicker: 'Sv39 page-table walk', title: '三个 9-bit index 逐级找到叶 PTE', note: '12-bit page offset 不参与查表，最终原样拼到 physical page number 后面。',
      nodes: [N('VA fields', 'L2 · L1 · L0 · offset'), N('Level 2', 'index 9 bits'), N('Level 1', 'index 9 bits'), N('Level 0', 'leaf PTE', '', 'accent'), N('Physical page', '+ unchanged offset')]
    },
    {
      page: '/6.1810/lessons/06-syscall-entry.html', match: 'write()                 write() returns', layout: 'lanes',
      kicker: 'System-call round trip', title: '进入内核和返回用户态必须成对保存、切换与恢复状态',
      lanes: [
        { label: 'Entry', nodes: [N('write()'), N('ecall'), N('uservec', 'save registers'), N('usertrap'), N('sys_write', '', '', 'accent')] },
        { label: 'Return', nodes: [N('syscall result'), N('usertrapret'), N('userret', 'restore registers'), N('sret'), N('write returns', '', '', 'accent')] }
      ]
    },
    {
      page: '/6.1810/lessons/07-interposition.html', afterHeading: '为什么选择系统调用作为拦截点？', layout: 'flow',
      kicker: 'Interposition boundary', title: 'Policy monitor 必须位于应用无法绕过的资源边界', note: '仅在 libc 拦截不安全：应用与 libc 共享地址空间，恶意代码可以绕过或篡改它。',
      nodes: [N('Untrusted process'), N('System-call request'), N('Monitor', 'copy + inspect arguments', '', 'accent'), N('Policy decision', 'allow / deny'), N('Kernel resource', 'file · process · network')]
    },
    {
      page: '/6.1810/lessons/08-page-faults.html', match: 'sbrk() 只增加 p->sz', layout: 'flow',
      kicker: 'Lazy allocation', title: '先承诺虚拟地址，第一次实际访问时才分配物理页',
      nodes: [N('sbrk grows p→sz', 'no physical page'), N('Application touches VA'), N('Page fault'), N('Validate address'), N('Allocate + map page', '', '', 'accent'), N('Retry instruction')]
    },
    {
      page: '/6.1810/lessons/08-page-faults.html', match: 'fork() 不复制物理页，而是共享', layout: 'flow',
      kicker: 'Copy-on-write fork', title: '父子先共享只读页，只有写入者承担复制成本', note: 'Reference count 决定旧 physical page 何时真正可释放。',
      nodes: [N('fork'), N('Share physical pages', 'mark both PTEs read-only'), N('Write attempt'), N('COW page fault'), N('Allocate + copy', '', '', 'accent'), N('Remap writer R/W')]
    },
    {
      page: '/6.1810/lessons/09-superpages.html', afterHeading: 'TLB 与超级页动机', layout: 'cards',
      kicker: 'TLB reach', title: '同样数量的 TLB entries，page size 决定可覆盖多少内存', note: 'Superpage 减少 TLB miss，但会增加连续物理内存、promotion 与 internal fragmentation 的压力。',
      cards: [
        { title: '4 KiB pages', rows: [['128 entries', '512 KiB reach'], ['1024 entries', '4 MiB reach'], ['优势', '细粒度分配']] },
        { title: '2 MiB superpages', rows: [['128 entries', '256 MiB reach'], ['1024 entries', '2 GiB reach'], ['代价', 'collapse / fragmentation']] }
      ]
    },
    {
      page: '/6.1810/lessons/10-uservm.html', afterHeading: '应用级虚拟内存原语', layout: 'flow',
      kicker: 'User-level VM control', title: '内核暴露机制，应用用自己的 metadata 决定映射策略',
      nodes: [N('Memory access'), N('Protection / missing mapping'), N('Page-fault trap'), N('User handler', 'GC / migration policy', '', 'accent'), N('Map / protect page'), N('Resume instruction')]
    },
    {
      page: '/6.1810/lessons/11-interrupts.html', afterHeading: '中断路径', layout: 'flow',
      kicker: 'Device interrupt path', title: '设备只发出通知，driver 仍必须读取状态并完成工作', note: 'Interrupt 是“可能有工作”的提示，不是设备状态本身；driver 必须读取 MMIO registers 确认。',
      nodes: [N('Device', 'UART / disk / NIC'), N('PLIC', 'route IRQ'), N('CPU trap'), N('devintr', 'identify source'), N('Driver handler', '', '', 'accent'), N('Wake consumer')]
    },
    {
      page: '/6.1810/lessons/12-locking.html', afterHeading: '如何实现锁？', layout: 'lanes',
      kicker: 'Lock acquisition', title: '互斥要求“观察并占有”成为一个不可分割的动作', note: 'Atomic swap 决定唯一 owner；aq/rl memory ordering 还要保证 critical-section loads/stores 不越过锁边界。',
      lanes: [
        { label: 'Broken', nodes: [N('Load locked=0'), N('Another CPU loads 0'), N('Both store 1'), N('Two owners', 'mutual exclusion broken', '', 'accent')] },
        { label: 'Atomic', nodes: [N('AMOSWAP'), N('Read old + write 1', 'one memory transaction'), N('One CPU sees 0'), N('Single owner', '', '', 'accent')] }
      ]
    },
    {
      page: '/6.1810/lessons/13-threads.html', match: '用户态 → 内核态', layout: 'flow',
      kicker: 'Context-switch state', title: 'Trapframe 与 context 保存的是两次不同边界的状态', note: 'Trapframe 保存完整 user register state；context 只保存 kernel thread 切换所需的 callee-saved registers。',
      nodes: [N('User thread'), N('Trapframe', 'user → kernel'), N('Kernel thread'), N('Context', 'process → scheduler', '', 'accent'), N('Scheduler'), N('Next context'), N('Next user thread')]
    },
    {
      page: '/6.1810/lessons/14-coordination.html', afterHeading: 'Lost Wakeup 问题', layout: 'flow',
      kicker: 'Lost-wakeup race', title: '检查条件与进入 sleep 之间的空隙会吞掉一次 wakeup', note: '正确接口用同一把 condition lock 把“检查条件 → 登记睡眠”与 producer update 串行化。',
      nodes: [N('Consumer checks', 'condition=false'), N('About to sleep'), N('Producer updates', 'condition=true'), N('Producer wakeup', 'nobody sleeping yet'), N('Consumer sleeps', '', '', 'accent'), N('Stuck forever')]
    },
    {
      page: '/6.1810/lessons/15-networking.html', match: 'NIC 硬件 → NIC DMA RX Ring', layout: 'lanes',
      kicker: 'Kernel network datapath', title: '收包与发包沿相反方向穿过 DMA ring、driver 与协议栈',
      lanes: [
        { label: 'Receive', nodes: [N('NIC'), N('RX DMA ring'), N('Interrupt / poll'), N('IP + socket queue'), N('Application', '', '', 'accent')] },
        { label: 'Transmit', nodes: [N('Application'), N('Socket + IP output'), N('Driver'), N('TX DMA ring'), N('NIC', '', '', 'accent')] }
      ]
    },
    {
      page: '/6.1810/lessons/16-shenango.html', match: 'NIC 将收到的包 DMA 到 RX Ring', layout: 'lanes',
      kicker: 'Conventional Linux path', title: '传统网络路径包含中断、kernel protocol stack 与 socket queue',
      lanes: [
        { label: 'Receive', nodes: [N('NIC'), N('RX ring'), N('Kernel interrupt'), N('TCP / UDP'), N('Socket queue'), N('Application')] },
        { label: 'Transmit', nodes: [N('Application'), N('Kernel stack'), N('TX ring'), N('NIC')] }
      ]
    },
    {
      page: '/6.1810/lessons/16-shenango.html', afterHeading: '解决方案：内核旁路', layout: 'lanes',
      kicker: 'Kernel bypass', title: '旁路缩短 datapath，但资源隔离与调度责任不会消失', note: 'Shenango 的 I/O kernel 负责跨应用分配 cores 与 network resources；应用 runtime 负责自己的 fast path。',
      lanes: [
        { label: 'Traditional', nodes: [N('NIC'), N('Kernel network stack'), N('Socket API'), N('Application')] },
        { label: 'Bypass', nodes: [N('NIC queues'), N('I/O kernel', 'resource policy', '', 'accent'), N('Application runtime'), N('User threads')] }
      ]
    },
    {
      page: '/6.1810/lessons/17-fs.html', match: '系统调用层', layout: 'stack',
      kicker: 'xv6 file-system layers', title: '每一层把更低层的 block operations 提升成更稳定的抽象',
      levels: [
        { title: 'System calls', meta: 'open · read · write · link', tag: 'API', width: 100 },
        { title: 'FD + pathname', meta: 'per-process references', tag: 'names', width: 94 },
        { title: 'Inodes', meta: 'metadata + block mapping', tag: 'files', width: 88 },
        { title: 'Inode cache', meta: 'identity · references · locks', tag: 'in-memory state', width: 82 },
        { title: 'Logging', meta: 'atomic update groups', tag: 'crash safety', width: 76 },
        { title: 'Buffer cache', meta: 'cached disk blocks', tag: 'synchronization', width: 70 },
        { title: 'virtio_disk', meta: 'device commands', tag: 'hardware', width: 64 }
      ]
    },
    {
      page: '/6.1810/lessons/18-crash.html', match: '缓冲缓存', layout: 'cards',
      kicker: 'Three storage states', title: 'Crash recovery 必须区分内存缓存、home locations 与磁盘日志',
      cards: [
        { title: 'Buffer cache', rows: [['位置', 'RAM'], ['内容', 'dirty updates'], ['掉电', '会丢失']] },
        { title: 'Disk FS tree', rows: [['位置', 'home blocks'], ['内容', '已安装状态'], ['风险', 'partial update']] },
        { title: 'Disk log', rows: [['位置', 'reserved region'], ['内容', 'transaction copy'], ['作用', 'commit + replay']] }
      ]
    },
    {
      page: '/6.1810/lessons/18-crash.html', match: 'commit()                        // log.c', layout: 'flow',
      kicker: 'Write-ahead logging', title: '只有 commit record 持久化后，事务才允许安装到 home locations', note: 'WAL 的关键次序是 log data → commit point → install；反过来会在 crash 后留下不可判定的半更新。',
      nodes: [N('begin_op'), N('log_write', 'pin dirty buffers'), N('Write log blocks'), N('Write commit point', 'transaction durable', '', 'accent'), N('Install to FS'), N('Clear log')]
    },
    {
      page: '/6.1810/lessons/19-journal.html', match: '|SB: offset+seq#|', layout: 'flow',
      kicker: 'ext3 journal record', title: 'Descriptor、data blocks 与 commit record 共同定义一个事务',
      nodes: [N('Journal superblock', 'offset + sequence'), N('Descriptor', 'target block numbers'), N('Journal data blocks'), N('Commit record', 'same sequence', '', 'accent'), N('Next transaction')]
    },
    {
      page: '/6.1810/lessons/19-journal.html', match: '在日志超级块中查找开始位置', layout: 'flow',
      kicker: 'Journal recovery', title: '恢复只重放具有完整 commit evidence 的事务',
      nodes: [N('Read journal SB'), N('Locate oldest sequence'), N('Scan descriptors + commits'), N('Reject incomplete txn'), N('Replay committed blocks', '', '', 'accent'), N('Resume FS')]
    },
    {
      page: '/6.1810/lessons/20-rcu.html', afterHeading: 'Read-Copy Update (RCU)', layout: 'flow',
      kicker: 'RCU update lifecycle', title: '写者发布新版本后，必须等待旧读者离开才能回收旧对象', note: 'Publish 让新读者看见 new copy；grace period 只保证旧 readers 已结束，不自动解决多个 writers 的冲突。',
      nodes: [N('Read old pointer', 'reader: no lock'), N('Writer copies object'), N('Publish new pointer', 'atomic visibility', '', 'accent'), N('Grace period'), N('Old readers finish'), N('Reclaim old copy')]
    },
    {
      page: '/6.1810/lessons/21-isolation.html', match: 'Guest VA ──(Guest PT)', layout: 'flow',
      kicker: 'Two-dimensional translation', title: 'Guest page table 与 EPT 分别控制两层地址解释', note: 'Guest 可以管理 Guest VA→Guest PA，但 VMM 独占 EPT，因此 guest 不能映射任意 host memory。',
      nodes: [N('Guest VA'), N('Guest page table'), N('Guest PA'), N('EPT / nested PT', 'controlled by VMM', '', 'accent'), N('Host PA')]
    },
    {
      page: '/6.1810/lessons/22-bpf.html', afterHeading: '论文思想：将过滤器指定为字节码程序', layout: 'flow',
      kicker: 'Safe in-kernel extension', title: '用户提供逻辑，verifier 把它约束成内核可安全执行的程序',
      nodes: [N('Filter intent'), N('BPF bytecode'), N('Verifier', 'termination + memory safety', '', 'accent'), N('Interpreter / JIT'), N('Kernel hook', 'packet / syscall / tracepoint'), N('Action', 'accept · drop · observe')]
    },
    {
      page: '/6.1810/lessons/23-meltdown.html', afterHeading: '攻击核心', afterSelector: 'pre', layout: 'flow',
      kicker: 'Transient-execution side channel', title: '异常会撤销架构状态，却不会自动抹去 cache footprint', note: 'Meltdown 泄露的是 speculative execution 留下的微架构状态，而不是让 forbidden load 正常提交。',
      nodes: [N('Forbidden kernel load'), N('Transient secret value'), N('Index probe array'), N('Cache line becomes hot', '', '', 'accent'), N('Fault handled'), N('Timing recovers bit')]
    },
    {
      page: '/cs267/lessons/01-introduction.html', match: 'Serial:   O(n)', layout: 'lanes',
      kicker: 'Reduction', title: '相同总 work，可以有完全不同的 dependency depth',
      lanes: [
        { label: 'Serial · span O(n)', nodes: [N('x₁ + x₂'), N('+ x₃'), N('+ …'), N('+ xₙ')] },
        { label: 'Tree · span O(log n)', nodes: [N('Pairwise sums', 'n/2 tasks'), N('Partial sums', 'n/4 tasks'), N('Tree levels'), N('Final sum', '', '', 'accent')] }
      ]
    },
    {
      page: '/cs267/lessons/03-matmul-roofline.html', match: 'Attainable GFLOP/s', layout: 'roofline',
      kicker: 'Roofline model', title: '性能上界取带宽屋顶与计算屋顶的较小值', note: 'Ridge point 是两条上界相交的分界，不表示实现已经达到最佳效率。'
    },
    {
      page: '/cs267/lessons/08-advanced-mpi.html', match: '时间 t: 将 t-1 时刻收到的数据发给右边', layout: 'flow',
      kicker: 'Ring collective', title: '每一轮只把当前 chunk 传给相邻 rank', note: 'P−1 轮累积 latency；每轮消息较大、链路利用均匀。',
      nodes: [N('Rank i', 'current chunk'), N('Right neighbor', '(i+1) mod P'), N('Forward next round', 'repeat P−1 times'), N('All chunks collected', 'α(P−1) + bandwidth term', '', 'accent')]
    },
    {
      page: '/cs267/lessons/08-advanced-mpi.html', match: '时间 t: 进程 i 与进程 i+2^t 交换', layout: 'tree',
      kicker: 'Recursive doubling', title: '每轮通信距离与已知数据量同时翻倍', note: '需要 log₂P 轮；适合 latency 主导的小消息场景。',
      tree: { title: 'Round 0', meta: 'distance 1', children: [
        { title: 'Round 1', meta: 'distance 2', children: [{ title: 'Round 2', meta: 'distance 4' }, { title: 'Known data', meta: 'doubles each round' }] },
        { title: 'Partner ranks', meta: 'i ⊕ 2ᵗ' }
      ] }
    },
    {
      page: '/cs267/lessons/15-parallel-matmul.html', match: '// SUMMA: C = A * B', layout: 'flow',
      kicker: 'SUMMA iteration', title: '二维进程网格把输入面板广播变成本地 GEMM',
      nodes: [N('Choose k panel'), N('Broadcast A panel', 'along process row'), N('Broadcast B panel', 'along process column'), N('Local GEMM', 'Cᵢⱼ += AᵢₖBₖⱼ', '', 'accent'), N('Next k', 'repeat')]
    },
    {
      page: '/cs267/lessons/16-dense-la.html', match: '[L11  0 ]', layout: 'flow',
      kicker: 'Blocked GEPP', title: '窄 panel 建立依赖，宽 trailing update 承担主要 FLOPs', note: 'Panel 受 pivoting 与顺序依赖限制；trailing update 可交给高效 BLAS-3 GEMM。',
      nodes: [N('Current block column', 'A[:,k:k+b]'), N('Panel factorization', 'pivot + BLAS-2'), N('Apply pivots'), N('Trailing update', 'BLAS-3 GEMM', '', 'accent'), N('Next panel')]
    },
    {
      page: '/cs267/lessons/16-dense-la.html', match: '// TSQR for m x n matrix', layout: 'tree',
      kicker: 'TSQR reduction tree', title: 'Tall-skinny QR 只沿树归约小的 R factors', note: '叶子并行做 local QR；树上只移动 n×n 的 R，而不是重复移动整块 A。',
      tree: { title: 'Global R', meta: 'final QR', children: [
        { title: 'QR(R₀,R₁)', meta: 'stacked R', children: [{ title: 'Local QR₀', meta: 'A₀→R₀' }, { title: 'Local QR₁', meta: 'A₁→R₁' }] },
        { title: 'QR(R₂,R₃)', meta: 'stacked R', children: [{ title: 'Local QR₂', meta: 'A₂→R₂' }, { title: 'Local QR₃', meta: 'A₃→R₃' }] }
      ] }
    },
    {
      page: '/cs267/lessons/16-dense-la.html', match: '// Cholesky DAG', layout: 'tree',
      kicker: 'Task dependency DAG', title: 'POTRF 解锁 TRSM，随后才能并行执行更新', note: '真正的并行度来自已满足依赖的 ready tasks，而不是把所有 kernel 同时启动。',
      tree: { title: 'POTRF(1,1)', children: [
        { title: 'TRSM(2,1)', children: [{ title: 'SYRK(2,1)', children: [{ title: 'POTRF(2,2)' }] }, { title: 'GEMM updates', meta: 'independent tiles' }] },
        { title: 'TRSM(3,1)', children: [{ title: 'SYRK(3,1)' }] }
      ] }
    },
    {
      page: '/cs267/lessons/20-fft.html', match: 'Step 1: 列方向 FFT', layout: 'flow',
      kicker: 'Distributed 3D FFT', title: '局部 FFT 与全局数据重排必须分开计时',
      nodes: [N('Column FFT', 'local'), N('Row FFT', 'local'), N('Pack pencils / slabs'), N('Global transpose', 'all-to-all traffic', '', 'accent'), N('Z FFT', 'new local layout')]
    },
    {
      page: '/cs267/lessons/25-graph-partitioning.html', match: '// SpMV 示例：P1 需要 x(7)', layout: 'cards',
      kicker: 'Graph vs hypergraph model', title: '同一个远端值被多行复用时，edge cut 会重复计算通信', note: 'Hyperedge 把“一个数据对象服务多个消费者”建模成一次共享通信需求。',
      cards: [
        { title: 'Graph edge-cut model', rows: [['依赖', '(4,7), (5,7)'], ['估计', 'x(7) 被计两次'], ['风险', '重复估算同一远端对象']] },
        { title: 'Hypergraph model', rows: [['hyperedge', '{4,5,7}'], ['估计', 'x(7) 一次共享'], ['含义', '更贴近 SpMV communication volume']] }
      ]
    }
  ];

  const path = location.pathname;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  function renderNode(item) {
    const node = make('div', 'fd-node');
    if (item.tone) node.dataset.tone = item.tone;
    if (item.kicker) node.appendChild(make('span', 'fd-node-kicker', item.kicker));
    node.appendChild(make('strong', '', item.title));
    if (item.meta) node.appendChild(make('small', '', item.meta));
    return node;
  }

  function renderFlow(nodes) {
    const flow = make('div', 'fd-flow');
    flow.style.setProperty('--fd-count', String(nodes.length));
    nodes.forEach((item) => flow.appendChild(renderNode(item)));
    return flow;
  }

  function renderTreeNode(item) {
    const li = document.createElement('li');
    const node = make('span', 'fd-tree-node');
    node.appendChild(make('strong', '', item.title));
    if (item.meta) node.appendChild(make('small', '', item.meta));
    li.appendChild(node);
    if (item.children?.length) {
      const children = document.createElement('ul');
      item.children.forEach((child) => children.appendChild(renderTreeNode(child)));
      li.appendChild(children);
    }
    return li;
  }

  function renderBody(definition) {
    if (definition.layout === 'flow') return renderFlow(definition.nodes);
    if (definition.layout === 'lanes') {
      const lanes = make('div', 'fd-lanes');
      definition.lanes.forEach((lane) => {
        const row = make('section', 'fd-lane');
        row.append(make('div', 'fd-lane-label', lane.label), renderFlow(lane.nodes));
        lanes.appendChild(row);
      });
      return lanes;
    }
    if (definition.layout === 'cards') {
      const grid = make('div', 'fd-card-grid');
      grid.style.setProperty('--fd-count', String(definition.cards.length));
      definition.cards.forEach((item) => {
        const card = make('article', 'fd-card');
        card.appendChild(make('strong', '', item.title));
        const list = document.createElement('dl');
        item.rows.forEach(([term, detail]) => list.append(make('dt', '', term), make('dd', '', detail)));
        card.appendChild(list);
        grid.appendChild(card);
      });
      return grid;
    }
    if (definition.layout === 'stack') {
      const stack = make('div', 'fd-stack');
      definition.levels.forEach((item) => {
        const level = make('div', 'fd-stack-level');
        level.style.setProperty('--fd-width', `${item.width}%`);
        level.append(make('strong', '', item.title), make('span', '', item.meta), make('em', '', item.tag));
        stack.appendChild(level);
      });
      return stack;
    }
    if (definition.layout === 'tree') {
      const wrap = make('div', 'fd-tree-wrap');
      const tree = make('ul', 'fd-tree');
      tree.appendChild(renderTreeNode(definition.tree));
      wrap.appendChild(tree);
      return wrap;
    }
    if (definition.layout === 'roofline') {
      const chart = make('div', 'fd-roofline');
      chart.innerHTML = '<div class="fd-roofline-y">Attainable performance · FLOP/s</div><div class="fd-roofline-plot"><span class="fd-roofline-bandwidth"></span><span class="fd-roofline-compute"></span><span class="fd-roofline-ridge"></span><span class="fd-roofline-label fd-roofline-label--bandwidth">Bandwidth ceiling · AI × B</span><span class="fd-roofline-label fd-roofline-label--compute">Compute ceiling · Ppeak</span><span class="fd-roofline-label fd-roofline-label--ridge">ridge point</span></div><div class="fd-roofline-x">Arithmetic intensity · FLOP / byte</div>';
      return chart;
    }
    return document.createDocumentFragment();
  }

  const candidates = [...page.querySelectorAll('pre')];
  definitions.filter((definition) => path.endsWith(definition.page)).forEach((definition) => {
    const pre = definition.match
      ? candidates.find((candidate) => !candidate.dataset.frameworkConsumed && candidate.textContent.includes(definition.match))
      : null;
    const heading = definition.afterHeading
      ? [...page.querySelectorAll('h2, h3')].find((candidate) => candidate.textContent.includes(definition.afterHeading))
      : null;
    if (!pre && !heading) return;
    if (pre) pre.dataset.frameworkConsumed = 'true';
    const figure = make('figure', `framework-diagram framework-diagram--${definition.layout}`);
    figure.dataset.frameworkDiagram = definition.layout;
    figure.setAttribute('aria-label', definition.title);
    const caption = document.createElement('figcaption');
    caption.append(make('span', 'framework-diagram-kicker', definition.kicker), make('strong', 'framework-diagram-title', definition.title));
    if (definition.note && definition.layout === 'roofline') {
      caption.appendChild(make('span', 'framework-diagram-note', definition.note));
    }
    figure.append(caption, renderBody(definition));
    if (definition.note && definition.layout !== 'roofline') figure.appendChild(make('p', 'fd-callout', definition.note));
    if (pre) {
      const source = make('details', 'fd-source');
      source.appendChild(make('summary', '', '查看文本版 / 精确符号'));
      pre.replaceWith(figure);
      source.appendChild(pre);
      figure.appendChild(source);
      return;
    }
    let anchor = heading;
    if (definition.afterSelector) {
      let cursor = heading.nextElementSibling;
      while (cursor && !cursor.matches(definition.afterSelector)) cursor = cursor.nextElementSibling;
      if (cursor) anchor = cursor;
    } else if (heading.nextElementSibling?.matches('p')) {
      anchor = heading.nextElementSibling;
    }
    anchor.insertAdjacentElement('afterend', figure);
  });
})();
