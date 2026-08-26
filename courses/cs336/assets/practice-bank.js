(function () {
  const q = (prompt, options, answer, explanations, followUp) =>
    [prompt, options, answer, explanations, followUp];

  window.CS336PracticeBank = {
    '0001': {
      before: [
        ['字符和 byte 是同一个对象吗？', '不是。字符是 Unicode 层的抽象；UTF-8 会把一个字符编码成 1～4 个 byte。中文字符通常对应多个 byte。'],
        ['Transformer 真正接收字符串还是整数？', '接收 token ID；embedding table 再把 ID 映射为向量。tokenizer 是文本与整数序列之间的边界。'],
        ['sequence length 为什么会影响后续系统？', 'token 数决定 attention 的计算与显存，也决定 KV cache 大小；tokenization 会贯穿后续课程。']
      ],
      sections: [
        { before: 'byte', label: 'bytes 与 fallback', question: q(
          '一个 UTF-8 中文字符被编码为 3 个 byte。初始 byte vocabulary 至少需要把它当成几个原子单元？',
          ['1 个字符 token', '3 个 byte token', '256 个 token', '由 merge rank 决定'], 1,
          ['把字符当成原子会混淆 Unicode 字符与 byte。', '正确。每个实际出现的 byte 是一个初始单元；256 指所有可能 byte 值的种类数。', '256 是初始 vocabulary 的可能值数量，不是这个字符的长度。', 'rank 只在已有初始 segmentation 上选择 merge，不决定 UTF-8 有几个 byte。'],
          q('若某个罕见字符从未出现在训练语料中，byte-level tokenizer 仍能表示它，最直接的原因是什么？',
            ['它会临时新增字符 token', 'UTF-8 bytes 都落在 0～255 的基础集合中', '它会改用 longest-match', '模型会猜一个相似字符'], 1,
            ['encoding 不创建 token。', '正确。任意合法 UTF-8 文本都能退回基础 byte 序列。', 'longest-match 与可表示性无关。', '这是模型行为，不是 tokenizer 的覆盖保证。'])) },
        { before: 'bpe', label: 'training 与 encoding', question: q(
          '已有 rank 0: b+c→bc，rank 1: a+b→ab，rank 2: a+bc→abc。编码 a b c 的第一步是什么？',
          ['a+b，因为更靠左', 'b+c，因为 rank 最小', 'a+b，因为 ab 更常见', '直接得到 abc，因为它在 vocab 中'], 1,
          ['位置不是主要优先级；先比较当前可执行规则的 rank。', '正确。encoding 读取训练好的 rank，先执行 rank 0。', 'encoding 不重新统计当前输入的频率。', 'vocab 只说明 token 存在，不直接规定 segmentation。'],
          q('输入中 (x,y) 出现 100 次、(a,b) 只出现 1 次；已有 rank(a,b)=3、rank(x,y)=20。两者当前都可执行时先 merge 谁？',
            ['x+y', 'a+b', '次数相同才看 rank', '创建一条新规则'], 1,
            ['这是把 training 的 frequency rule 搬到了 encoding。', '正确。encoding 选择当前可执行规则中 rank 最小者。', 'encoding 始终看 rank，不以输入频率为第一规则。', '新规则只在 training 中产生。'])) },
        { before: 'tokenizer-tradeoffs', label: 'vocabulary 与 segmentation', question: q(
          '训练执行 a+b→ab 后，下列哪个状态正确？',
          ['vocab 删除 a、b，只保留 ab', 'vocab 保留 a、b 并新增 ab；corpus segmentation 的相邻 a b 被替换', 'token ID 与 rank 都等于本轮频率', '所有 a 和所有 b 都必须消失'], 1,
          ['旧 token 是 fallback 和其他组合的组成部分，不会被删除。', '正确。vocabulary 与 current segmentation 是两个独立对象。', 'token ID 是词表索引，rank 是规则顺序，频率又是第三个量。', '只替换当前 segmentation 中匹配的相邻 pair，不是删除 token 类型。'],
          q('vocab 中有 abc，但规则先学 b+c→bc、再学 bc+d→bcd。输入 abcd 可能输出 [a][bcd]。这说明什么？',
            ['最长 token 必须优先', 'vocab 决定可存在的 token，merge rules 决定切分路径', 'abc 应从 vocab 删除', 'encoding 会重新训练'], 1,
            ['反例恰好说明 longest-match 与 BPE 可不同。', '正确。可用集合与生成 segmentation 的程序不是一个对象。', 'abc 仍可服务于别的输入路径。', 'encoding 只应用固定规则。'])) },
        { before: 'word', label: 'pre-tokenization boundary', question: q(
          '若 specification 规定 merge 不能跨 pre-token boundary，边界两侧 pair 即使全 corpus 最常见会怎样？',
          ['仍必须第一轮合并', '不会成为合法候选 pair', '临时获得 token ID 0', '只在 decoding 时合并'], 1,
          ['frequency 只在合法候选中比较。', '正确。pre-tokenization 先定义 BPE 可统计/合并的局部范围。', 'ID 与候选合法性无关。', 'decoding 不做 merge。'],
          q('把同一 corpus 的 pre-tokenization 规则改掉，其他条件固定，learned merges 可能改变吗？', ['可能，因为可见的相邻 pair 集合变了', '不可能，UTF-8 完全决定 merges', '只会改变 token IDs', '只有模型训练后才改变'], 0,
            ['正确。bytes 保证覆盖，但 boundary 仍影响训练统计。', 'UTF-8 只给初始 bytes。', 'merge table 也会改变。', 'tokenizer training 已会改变。'])) }
      ],
      deep: [
        q('同一个训练完成的 tokenizer 编码同一个 byte 序列两次，想保证结果相同，最关键的组合是什么？', ['更大的 vocabulary + 随机 tie-break', '唯一 byte 初态 + 固定 merge ranks 与 tie-break', '每次重新数输入频率', '优先最长 token'], 1, ['大词表不消除路径歧义，随机规则还会破坏复现。', '正确。唯一初态和确定的规则序列共同给出确定结果。', '这会把 encoding 变成依赖输入统计的另一算法。', 'longest-match 不是 learned BPE merge procedure。']),
        q('token abc 的 token_id=4812，规则 (ab,c) 的 rank=7。哪项陈述正确？', ['4812 表示第 4812 轮学到', '7 是 embedding row', '一个负责 token→ID，另一个负责 pair→优先级', '二者训练后必须相等'], 2, ['token ID 不编码学习轮次。', 'rank 不是 embedding 索引。', '正确。两张表回答不同问题。', '没有这种约束。']),
        q('把 vocabulary 从 32k 扩到 64k，最可靠的第一阶判断是什么？', ['序列必然更长且 embedding 更小', '通常序列可更短，但 embedding/输出层参数更多', '计算一定减半', '任何文本切分都不变'], 1, ['方向通常相反。', '正确，但“通常”不是严格定律，取决于规则和语料。', 'attention、MLP、softmax 等共同决定计算，不能由 vocab 大小直接推出减半。', '新增 merge rules 会改变部分输入的切分。']),
        q('BPE 与 Huffman 的共同点和关键区别是什么？', ['都合并最高频相邻 pair 并产出 token', '都完全等价，只是名字不同', '都利用频率；BPE 建 token，Huffman 合并低频节点建前缀码树', 'Huffman 不使用频率'], 2, ['Huffman 选择的是低频节点且目标是编码树。', '目标和贪心操作都不同。', '正确。共同点是 frequency-driven greedy，产物不同。', '频率正是 Huffman 的输入。']),
        q('某字符被切成更多 byte token，最直接会影响后续哪个量？', ['模型参数 P 必然改变', '同一文本的 sequence length，进而影响 attention 与 KV cache', 'merge rank 自动变小', 'UTF-8 失去可逆性'], 1, ['tokenizer 不必改变模型参数。', '正确。这是 Lesson 1 通向 attention 与 inference 的系统连接。', 'rank 来自训练顺序，不由单个字符长度决定。', '合法 UTF-8 的编码仍可逆。'])
      ],
      open: [
        ['不用正文，解释为什么 BPE encoding 不能直接 longest-match。', '先区分 vocab 与 merge table，再构造 vocab 同时含 abc、bcd，而低 rank 路径先形成 bcd 的反例。'],
        ['从 raw text 开始，口述 BPE training 一轮会改变哪些对象。', '应包括 pre-tokenization、UTF-8 bytes、当前 pair frequency、选 pair、创建 token、写入 vocab、记录 rank、更新 corpus segmentation。'],
        ['为什么 encoding 必须从 bytes 开始？', '任意已有 token 起步会产生多个 segmentation；bytes 给唯一初态，再配固定 ranks 才得到确定路径。']
      ]
    },

    '0002': {
      before: [
        ['矩阵 [B,D] 乘 [D,F] 的输出 shape 是什么？', '[B,F]。中间维 D 被求和，外侧维保留。'],
        ['一次乘加为什么常记 2 FLOPs？', '一次乘法加一次加法；这是 napkin-math 的计数约定，硬件文档也可能用 FMA 的口径说明峰值。'],
        ['训练与推理最基本的状态差异是什么？', '训练还要保留反向所需 activation、gradient 和 optimizer state；常规推理没有 backward 与 optimizer。']
      ],
      sections: [
        { before: 'memory', label: 'shape 与 backward', question: q(
          'X:[100,256]，W:[256,512]，dY:[100,512]。dW 与 dX 的 shape 分别是？',
          ['[100,512] 与 [256,512]', '[256,512] 与 [100,256]', '[512,256] 与 [256,100]', '[100,256] 与 [256,512]'], 1,
          ['这是 Y 与 W 的 shape 混合，不满足 dW=XᵀdY。', '正确：dW=XᵀdY，dX=dYWᵀ。', '把矩阵顺序和转置都倒置了。', '两者顺序颠倒。'],
          q('同一线性层 forward 有一个主要 matmul，backward 为什么约有两个同规模 matmul？', ['要分别求 dW 与 dX', '每个参数更新两次', 'GPU 自动重复 forward', 'Adam 有两个 moment'], 0,
            ['正确。dW=XᵀdY，dX=dYWᵀ。', '更新次数不是 backward matmul 数量的来源。', 'autograd 根据链式法则生成不同计算。', 'moment 更新另算，而且与该 2× 推导不是同一对象。'])) },
        { before: 'mfu', label: '6PD 与 processed tokens', question: q(
          '100B-token 数据集训练 3 epochs。6PD 中的 D 应取多少？',
          ['100B，因为只数 unique tokens', '300B，因为每次被处理都计数', '数据集的 GB 数', '由 batch size 决定，无法知道'], 1,
          ['6PD 的 D 不是 unique dataset size。', '正确。D 是累计 processed training tokens。', '字节大小与 tokenizer 后的 token 数不是同一量。', 'batch 改变每步 token 和步数，但此处总 processed tokens 已知。'],
          q('固定 D=1M tokens，从 1000 tokens/step 改成 2000 tokens/step，忽略效率差异，一阶总 FLOPs 怎样？', ['约减半', '约不变', '约翻倍', '变成 6PB'], 1,
            ['步数减半，但每步 token 翻倍。', '正确。6PD 的 D 未变；实际吞吐、显存、通信、优化会变。', '没有重复处理更多 token。', 'B 不是 6PD 的变量。'])) },
        { before: 'mixed-precision', label: 'utilization 与容量', question: q(
          '监控显示 GPU utilization=100%，MFU=40%。这是否可能？',
          ['不可能，两个指标必须相等', '可能；GPU 一直忙，但可能在搬数据、通信或执行低效 kernel', '只在 CPU 训练时可能', '说明模型 FLOPs 超过峰值'], 1,
          ['GPU busy 不等于有效模型 FLOP/s 达峰。', '正确。两者分母和计量对象不同。', 'GPU 场景本来就可能出现。', 'MFU 40% 没有超峰值。'],
          q('8×80GB 用 DDP 训练。为什么不能先把它当 640GB 放一份 500GB model state？', ['DDP 在每张卡复制完整 model state', 'NVLink 会删除一半显存', 'batch size 必须为 8', '参数只能是 FP32'], 0,
            ['正确。每个 rank 的容量仍受单卡副本约束；sharding 才能更接近聚合池。', '互连不删除 HBM。', '这与单卡是否放得下副本无关。', '精度可变，但 DDP replication 才是核心。'])) },
        { before: 'arithmetic-intensity', label: 'autograd 与状态生命周期', question: q(
          '在 no_grad 推理中不保存 backward graph，最直接少掉哪类对象？',
          ['模型 weights', '反向所需 saved activations / graph metadata', '输入 token IDs', '本轮 logits'], 1,
          ['forward 仍要读取 weights。', '正确。没有 backward 就不需为链式法则保留这些状态。', '输入仍需。', 'logits 仍用于采样/评分。'],
          q('只把 optimizer state 删除，训练还能按 AdamW 正常更新吗？', ['能，m/v 会从 weights 自动恢复', '不能；m/v 是跨 step 的状态，删除会改变更新规则', '能，因为 gradient 等于 m', '只影响 tokenizer'], 1,
            ['moment 不能由当前 weight 唯一恢复。', '正确。对象的生命周期跨训练 step。', 'm 是历史梯度的指数平均。', '无关。'])) }
      ],
      deep: [
        q('P=7B、D=2T，训练 FLOPs 的 napkin-math 数量级最接近？', ['8.4×10²²', '8.4×10¹³', '14×10¹²', '42×10²¹ bytes'], 0, ['正确：6×7×10⁹×2×10¹²=8.4×10²² FLOPs。', '漏掉约 10⁹ 的量级。', '只近似 P×D 的局部量。', '单位应是 FLOPs，不是 bytes。']),
        q('Adam mixed precision 的“16 或 18 bytes/param”为什么不能当普遍定律？', ['因为 P 不可数', 'precision、master weights、optimizer 和实现是否 sharding 都会改变组成', '因为 activation 永远正好 16 bytes', '因为 gradient 不占内存'], 1, ['P 可定义并估算。', '正确。应先列 weight、gradient、m、v、master copy 等真实对象。', 'activation 依赖 batch、sequence、architecture，不是固定 per-param。', 'gradient 通常是重要状态。']),
        q('一个算法 FLOPs 少却更慢，最合理的解释是哪项？', ['FLOPs 是唯一性能决定因素，所以不可能', '它降低 arithmetic intensity，增加 HBM traffic 或小 kernel 开销', '参数一定更多', 'MFU 一定超过 100%'], 1, ['系统性能还受 memory、launch、communication 约束。', '正确。少算术不保证少墙钟时间。', '无需由慢推出参数更多。', '没有该结论。']),
        q('只用 aggregate HBM / bytes-per-param 得到 35B，最准确的标签是？', ['Exact 可训练规模', 'model-state capacity upper bound 的近似', 'attention 的渐近复杂度', '单卡 DDP 下界'], 1, ['忽略 activation、buffer、碎片、并行策略等。', '正确。这只是容量上界 napkin math。', '不是复杂度表达。', '也不是下界。']),
        q('为什么 inference 常比 training 少很多 model-state memory，却仍可能被长上下文卡住？', ['推理仍保存 Adam m/v', '没有 gradient/optimizer，但 KV cache 随 batch、层数与上下文增长', '权重在推理时消失', 'decode 不访问历史 token'], 1, ['常规推理不需要 Adam state。', '正确。省掉训练状态不等于没有随序列增长的状态。', '权重仍是主要常驻对象。', 'decode 正要读历史 K/V。'])
      ],
      open: [
        ['手推为什么 Linear backward 约是 forward 的两倍。', '写出 Y=XW、dW=XᵀdY、dX=dYWᵀ，检查 shape，再分别按 2mnk 计 FLOPs。'],
        ['解释为什么 batch size 没直接出现在 6PD，却依然非常重要。', '固定 D 时每步 token 与步数互相抵消；但 batch 改变 utilization、activation memory、通信、步数和优化动力学。'],
        ['给“8 张 H100 能训多大模型”一个三层答案。', '先算 model-state upper bound，再判断 DDP 或 FSDP/ZeRO 是否能用聚合显存，最后加入 activation、buffer、workspace、碎片、序列和 batch。']
      ]
    },

    '0003': {
      before: [
        ['residual connection 要求什么 shape 条件？', '被相加的主分支与残差分支必须 shape 一致，或先经过显式投影。'],
        ['LayerNorm/RMSNorm 的归一化轴通常是哪一维？', '对每个 token 的 hidden/features 维归一化，不跨 batch 或 sequence token。'],
        ['causal mask 解决什么问题？', '阻止位置 t 看到未来位置，保持自回归条件分解。']
      ],
      sections: [
        { before: 'positional', label: 'residual 与 normalization', question: q(
          'Pre-Norm block 中最典型的顺序是哪一个？',
          ['x→Sublayer→Norm→加 x', 'x→Norm→Sublayer→加 x', 'x→加 x→Norm→Sublayer', '只 Norm，不需要 residual'], 1,
          ['这是更接近 Post-Norm 的顺序。', '正确。归一化后的分支经过子层，再与原 residual stream 相加。', '先把 x 自加没有对应 Transformer 子层语义。', '二者解决不同问题。'],
          q('若子层输出 [B,T,D+1]，想直接与 residual [B,T,D] 相加，会发生什么？', ['广播后总能成功', 'shape 不兼容，必须让输出回到 D 或显式投影', '只影响位置编码', '只要 Pre-Norm 就能成功'], 1,
            ['最后一维不同通常不能按目标语义广播。', '正确。residual 是结构性的 shape contract。', '不是位置编码问题。', 'Norm 顺序不会修复 shape。'])) },
        { before: 'attention-details', label: 'RoPE 与位置', question: q(
          'RoPE 把与位置有关的旋转施加在哪里，核心效果是什么？',
          ['只旋转 V，删除内容', '旋转 Q/K，使点积携带相对位置信息', '旋转 logits 后做 tokenizer', '给每层新增 sequence token'], 1,
          ['V 不是 RoPE 的主要施加对象。', '正确。位置相关旋转改变 Q/K 的内积关系。', 'tokenizer 在模型前，且不是该机制。', 'RoPE 不新增 token。'],
          q('若所有 token 的 Q/K 都使用同一个旋转角，最直接失去哪类信息？', ['词表 ID', '不同位置之间的相对位移', 'hidden dimension', 'causal mask'], 1,
            ['token ID 来自 tokenizer。', '正确。没有位置差异就无法通过旋转表达相对位移。', '维度仍存在。', 'mask 是另一个机制。'])) },
        { before: 'quiz', label: 'FFN 与参数预算', question: q(
          'SwiGLU FFN 相比单门激活的直觉为何要配合调整 hidden width？',
          ['它通常有三组投影，若宽度不调会改变参数/FLOPs预算', '它不含矩阵乘法', '它自动让 sequence 变短', '它与参数量无关'], 0,
          ['正确。门控支路、值支路与输出投影共同决定预算。', 'SwiGLU 主要仍由线性投影构成。', 'tokenization 决定初始 sequence length。', '投影矩阵直接贡献参数。'],
          q('比较两个 FFN 配置时，公平做法优先是什么？', ['只比较 hidden width 数字', '在相近参数或 FLOPs 预算下比较', '只看激活函数名字', '忽略输入输出投影'], 1,
            ['不同结构的投影数不同。', '正确。先控制预算才能把差异归因于结构。', '名字不能代表系统成本。', '它们往往是主要参数。'])) },
        { before: 'hyperparameters', label: 'attention shape', question: q(
          'Q,K 的单头 shape 都是 [T,d_h]。score matrix QKᵀ 的 shape 是？',
          ['[T,T]', '[d_h,d_h]', '[T,d_h]', '[d_h,T]'], 0,
          ['正确。每个 query 位置与每个 key 位置产生一个 score。', '这是把被求和维留下了。', '这是 Q 本身 shape。', '没有同时保留两个 token 轴。'],
          q('T 翻倍、其他量固定，显式 full-attention score 元素数约怎样？', ['翻倍', '四倍', '不变', '减半'], 1,
            ['忽略了两个 T 轴。', '正确，T×T。', 'sequence 已改变。', '方向错误。'])) }
      ],
      deep: [
        q('把 causal mask 移除但训练目标仍是 next-token prediction，最大的问题是什么？', ['模型参数变少', '训练时可偷看未来，目标与生成条件不一致', 'RoPE 失效', 'FFN 不能反向传播'], 1, ['参数量不由 mask 决定。', '正确。信息泄漏破坏自回归建模。', 'RoPE 仍可计算。', 'FFN backward 与 mask 无直接关系。']),
        q('GQA 主要改变哪组对象的头数？', ['只减少 Q heads', '让多组 Q heads 共享较少的 K/V heads', '删除所有 V', '让每个 token 只看局部窗口'], 1, ['通常保留较多 query heads。', '正确。这为后续 inference 的 KV cache 压缩埋下连接。', '仍需 V。', '这是 local attention。']),
        q('FlashAttention 改变的是哪一层结论？', ['近似 attention 数学函数', '保持 exact attention，重排 tiling 以减少 HBM IO', '改变 tokenizer merge rules', '删除 O(T²) 个逻辑 score'], 1, ['原始方法是 exact。', '正确。它优化 IO 和 kernel schedule。', '无关。', '逻辑 attention 仍是全连接；不必物化完整矩阵。']),
        q('初始化尺度过大最直接可能造成什么？', ['activation/logit 方差随深度失控，训练不稳', 'token ID 重排', 'GPU HBM 增加一倍', '数据集 token 数改变'], 0, ['正确。初始化控制信号与梯度尺度。', 'tokenizer 不受参数初始化影响。', '状态 shape 未必变化。', 'D 不变。']),
        q('为什么“现代 Transformer 配置”不是一组互不相关的技巧清单？', ['组件在 shape、参数预算、数值稳定与推理状态上相互约束', '每个组件只影响名称', '只要参数相同结果严格相同', '硬件不会影响设计'], 0, ['正确。配置选择形成系统。', '明显低估机制。', '结构与训练动力学仍可不同。', 'kernel、IO、cache 都影响实践。'])
      ],
      open: [
        ['画出一个 Pre-Norm Transformer block 的对象流。', 'residual x 分两路：Norm→Attention/FFN→回到 D，与原 x 相加；两类子层通常各有一次残差。'],
        ['解释 RoPE 为什么作用于 Q/K 而不是简单给 token ID 加数字。', 'attention 的相关性来自 Q·K；位置相关旋转让点积显式依赖相对位置，同时不改变 tokenizer ID。'],
        ['比较 GQA、local attention、FlashAttention 分别改变什么。', 'GQA 改 K/V head sharing；local attention 改连接模式；FlashAttention 保持 exact 数学函数，优化 IO 实现。']
      ]
    },

    '0004': {
      before: [
        ['标准 self-attention 为什么随 T 呈二次项？', '每个 query 与 T 个 key 交互，共 T×T 个 score；投影部分另有线性 T 项。'],
        ['参数量与每 token 激活参数量是一回事吗？', '不是。MoE 尤其会让总参数很大，但每个 token 只激活少数 experts。'],
        ['all-to-all 的基本数据动作是什么？', '每个 rank 都把不同分片发给其他 rank，也从所有 rank 收取属于自己的分片。']
      ],
      sections: [
        { before: 'gqa', label: 'attention bottleneck', question: q(
          '将 full attention 改为 window size w 的 local attention，attention score 的渐近量级更接近？',
          ['O(T²)', 'O(Tw)', 'O(w²) 且与 T 无关', 'O(PD)'], 1,
          ['这是 full attention 的量级。', '正确。每个 T 位置只与约 w 个位置交互。', '仍要处理 T 个 query。', '这是训练 compute napkin math。'],
          q('若 w 固定、T 翻倍，local attention 的 score 交互数约怎样？', ['约翻倍', '约四倍', '不变', '由 vocab 决定'], 0,
            ['正确，O(Tw) 在 w 固定时对 T 线性。', '四倍对应 O(T²)。', '仍新增一倍 query。', 'vocab 不直接决定窗口交互数。'])) },
        { before: 'moe', label: 'GQA 与状态', question: q(
          'GQA 在 decode 时最直接节省什么？',
          ['历史 Q cache', 'K/V cache 的 head 维份数', 'optimizer m/v', 'prompt token 数'], 1,
          ['通常不缓存历史 Q。', '正确。多个 query heads 共享更少 K/V heads。', '推理没有 Adam states。', 'tokenizer 决定 prompt token 数。'],
          q('若 Q heads=32、KV heads 从 32 降到 8，其他量相同，K/V cache 的 head-related 部分约变为？', ['1/4', '4 倍', '不变', '1/32'], 0,
            ['正确。K/V heads 降为原来的四分之一。', '方向反了。', 'head 数是 cache 公式中的因子。', '不是只剩一个 head。'])) },
        { before: 'hybrid-architectures', label: 'MoE routing', question: q(
          '一个 64-expert MoE 每 token 只选 top-2。哪项最准确？',
          ['每 token 计算全部 64 experts', '总参数可很大，但该 token 的 expert compute 主要来自 2 个 experts', '其通信必然为零', 'load balance 不再重要'], 1,
          ['这会失去稀疏激活意义。', '正确。必须区分 total parameters 与 active parameters。', 'expert 跨设备时 routing 常触发 all-to-all。', '热门 expert 会形成容量与吞吐瓶颈。'],
          q('若 router 把大多数 token 发给同一 expert，最可能发生什么？', ['完美负载均衡', '热点、丢 token/溢出或等待，吞吐下降', 'KV cache 自动消失', 'attention 变成 exact linear'], 1,
            ['恰好相反。', '正确。这是 capacity factor 与 auxiliary load-balancing loss 的动机。', 'routing 与 cache 不是同一状态。', 'MoE 替换的通常是 FFN。'])) },
        { before: 'moe-challenges', label: 'expert communication', question: q(
          'experts 分布在不同 GPU 时，router 后为何常出现 all-to-all？',
          ['每个 rank 的 token 要发送到各自目标 expert，并从多 rank 接收 token', '每个 rank 已有所有 experts 且无需移动', '为了重排 token IDs', '只为保存 checkpoint'], 0,
          ['正确。dispatch 与 combine 都涉及按目标 expert 重排通信。', '这会是复制而非 expert parallel。', '模型内 token 表示移动，不是 tokenizer ID 重编。', '发生在每个 MoE step。'],
          q('expert compute 很快但 all-to-all 很慢，端到端层会怎样？', ['仍由通信关键路径限制', '必达 Tensor Core 峰值', '自动退化为 dense 且零开销', 'loss 无法定义'], 0,
            ['正确。局部 kernel 快不代表 layer 快。', '通信期间计算单元可能空闲。', '不会自动消除通信。', '训练目标仍存在。'])) }
      ],
      deep: [
        q('多层 local attention 为什么仍可能传播远距离信息？', ['单层已直接看到所有 token', '层叠后感受野逐层扩张', '因为 vocab 包含长 token 就必然全局', '因为删除了 causal mask'], 1, ['单层只见局部。', '正确。信息可经中间位置逐层传递，但路径更长。', 'token 长度不保证模型连接全局。', 'causal local attention 仍可保留 mask。']),
        q('MoE 让参数量扩大而 FLOPs 未同比扩大，关键条件是？', ['所有 experts 并行全算', '稀疏 router 每 token 只激活少数 experts', '把权重换成 byte', '取消 FFN'], 1, ['这会让 FLOPs 随 expert 总数增长。', '正确。', '量化不是 MoE 的核心条件。', 'experts 通常就是 FFN。']),
        q('哪项是“算法复杂度改善但系统不一定更快”的反例？', ['local attention 的 sparse pattern 缺少高效 kernel，利用率下降', '矩阵 shape 完全相同且实现完全相同', 'FLOPs 与 IO 都减少且无额外开销', '硬件无限快'], 0, ['正确。渐近量级与实际 kernel efficiency 是不同层级。', '没有解释差异。', '这种理想条件更可能更快。', '无实际判断意义。']),
        q('混合 attention + SSM 层的设计动机通常是什么？', ['只追求术语更多', '在全局内容寻址能力与长序列线性状态更新之间折中', '保证严格优于所有模型', '消除训练数据需求'], 1, ['不是工程动机。', '正确。', '不存在普遍严格保证。', '架构不消除数据。']),
        q('评估 attention alternative 时最该同时报告什么？', ['只报告理论 O 记号', '质量、实际吞吐/显存、序列长度与硬件实现条件', '只报告参数总数', '只报告单个短序列 latency'], 1, ['O 记号隐藏常数与实现。', '正确。', '参数不代表激活和 IO。', '不能覆盖目标 workload。'])
      ],
      open: [
        ['解释 GQA、local attention、MoE 各自在减少哪一种成本。', 'GQA 减 K/V heads 与 cache；local attention 减 token-pair 交互；MoE 用稀疏激活扩大总参数而控制每 token expert compute。'],
        ['为什么 MoE 的“参数更多”不自动等于“训练更贵同样倍数”？', '总参数与 active parameters 分开；每 token 只路由到 top-k，但通信、负载均衡和 optimizer state 仍有成本。'],
        ['构造一个理论 FLOPs 更低但真实更慢的 attention 方案。', '让稀疏模式不规则、kernel 很碎且频繁访问 HBM；少算术被低利用率和 IO 开销抵消。']
      ]
    },

    '0005': {
      before: [
        ['FLOP 与 FLOP/s 有什么区别？', 'FLOP 是工作量，FLOP/s 是完成工作的速率。'],
        ['bandwidth 与 latency 分别描述什么？', 'bandwidth 是单位时间搬运量；latency 是一次访问/通信从发起到响应的等待。'],
        ['为什么矩阵 shape 会影响 GPU 性能？', '它决定并行工作量、内存访问连续性、tile 利用和 Tensor Core 是否适配。']
      ],
      sections: [
        { before: 'roofline', label: 'memory hierarchy', question: q(
          '同一数据从 HBM 读入一次后，在 shared memory/register 中复用 32 次，主要提升哪个量？',
          ['arithmetic intensity', '参数量 P', 'tokenizer vocabulary', '网络 latency'], 0,
          ['正确。每个 HBM byte 支撑更多 FLOPs。', '模型参数不因数据复用改变。', '无关。', '这是单 GPU 内存层次。'],
          q('若 FLOPs 不变而 HBM bytes 减半，arithmetic intensity 怎样？', ['约减半', '约翻倍', '严格不变', '变成 FLOP/s'], 1,
            ['方向反了。', '正确：AI=FLOPs/bytes。', '分母改变。', '单位仍是 FLOP/byte。'])) },
        { before: 'tensor-cores', label: 'roofline', question: q(
          '某 kernel 的 AI 很低，roofline 判断其性能上限主要由什么约束？',
          ['memory bandwidth', '词表大小', 'CPU 核数', 'checkpoint 文件大小'], 0,
          ['正确。低 AI 落在带宽斜线区域。', '无直接关系。', 'GPU kernel 的 roofline 不由 CPU 核数直接给出。', '磁盘文件不在此热路径。'],
          q('GPU utilization 100% 但 kernel 在等待 HBM，哪项可能成立？', ['MFU 仍很低', 'Tensor Core 必然满载', 'AI 必然很高', '峰值 FLOP/s 已达到'], 0,
            ['正确。busy 与有效模型 FLOPs 不是同一指标。', '等待 HBM 恰可能让 Tensor Core 空闲。', 'memory-bound 常对应低 AI。', '没有该结论。'])) },
        { before: 'quiz', label: 'memory access 与 topology', question: q(
          '一个 warp 的线程访问连续地址，相比随机跨段访问通常为何更好？',
          ['更容易合并成较少的内存事务', '会增加参数量', '自动改变算法复杂度', '让所有访问进入 register'], 0,
          ['正确。这是 coalescing 的核心收益。', '访问模式不改变参数。', 'O 记号通常不变。', 'HBM 访问不会因此全部成为 register。'],
          q('多 GPU all-reduce 变慢，单看每张卡 Tensor Core 峰值为什么不够？', ['collective 还受 NVLink/PCIe/网络拓扑与带宽约束', 'all-reduce 不传数据', 'GPU 数越多通信必为零', '只有 tokenizer 会影响'], 0,
            ['正确。通信路径是另一个 roofline。', '它正要交换/归约数据。', '规模扩大常增加通信压力。', '无关。'])) },
        { before: 'practical', label: 'Tensor Core 条件', question: q(
          '一个 BF16 matmul 没达到 H100 BF16 峰值，最合理的第一步是什么？',
          ['先检查 shape/alignment、tile、数据供给与实际 kernel 路径', '断定官方峰值错误', '把 batch 降到 1', '删除所有 memory load'], 0,
          ['正确。峰值需要特定 dtype、形状、稠密/稀疏口径和高效实现。', '标称值是条件化上界。', '小 batch 常让利用率更差。', '计算离不开数据。'],
          q('同一 H100 的 dense BF16 与 2:4 sparse BF16 峰值能直接混用吗？', ['不能，必须标明 sparsity 条件', '能，二者是同一个数', '只要 GPU utilization 高就能', '只有 FP32 才需标注'], 0,
            ['正确。硬件峰值属于 implementation/hardware-specific 结论。', '2:4 sparse 口径通常约为 dense 的两倍。', 'utilization 不创建结构化稀疏。', '所有 dtype/模式都需口径。'])) }
      ],
      deep: [
        q('增加 occupancy 为什么不保证 kernel 更快？', ['occupancy 是唯一目标', '若已隐藏 latency，更多 warps 可能受 register/shared memory 或同一带宽瓶颈限制', 'occupancy 会删除 FLOPs', '高 occupancy 必然降低 HBM traffic'], 1, ['它只是手段。', '正确。要定位真实 bottleneck。', '不改变算法工作量。', '线程数不自动减少字节。']),
        q('Tensor Core 标称峰值是 hardware-specific；实际模型吞吐还需要哪些条件？', ['合适 dtype/shape、足够大 tile、数据供给与高效 kernel', '只需 GPU utilization 指标为 1%', '任意标量循环', '不需要读取权重'], 0, ['正确。峰值不是自动获得。', '低利用率不支持。', '难以映射矩阵单元。', '矩阵仍需数据。']),
        q('将两个逐元素 kernel 融合，最直接可能减少什么？', ['中间 tensor 的 HBM 写回与再次读取', '模型参数总量', '训练 token D', 'attention 的数学连接'], 0, ['正确。fusion 常是 IO 优化。', '参数不变。', '数据量不变。', '数学函数可保持相同。']),
        q('为什么小矩阵即使 AI 理论不低也可能达不到峰值？', ['launch overhead、并行度与 tile 填充不足', '因为 FLOPs 单位错误', '因为 HBM 不存在', '因为所有小矩阵都是 CPU'], 0, ['正确。roofline 是上界模型，还需考虑固定开销与占用。', '不是主要解释。', 'HBM 仍存在。', 'GPU 也执行小矩阵。']),
        q('跨节点训练时，优先按什么把高通信量的并行组映射到硬件？', ['忽略拓扑随机放置', '尽量把通信密集组放在更快、更近的互连域', '全部经过存储磁盘', '只按 token ID'], 1, ['会浪费 NVLink/本地网络。', '正确。并行拓扑应映射物理拓扑。', '磁盘不是 collective 热路径。', '无关。'])
      ],
      open: [
        ['用 roofline 解释为什么“减少 FLOPs”不总会更快。', '先算 AI；若新算法增加 bytes 或不规则访问，它可能更 memory-bound，且低效 kernel/launch 常数可抵消 FLOPs 收益。'],
        ['给出 GPU utilization 高而 MFU 低的具体执行时间线。', 'GPU 一直调度 kernel，但周期用于 HBM stall、通信、非 Tensor Core 指令或小 kernel；busy 高，有效模型 FLOP/s 仍低。'],
        ['解释 coalescing、tiling、fusion 分别减少了哪种浪费。', 'coalescing 减内存事务；tiling 增片上复用；fusion 减中间值 HBM 往返与 launch。']
      ]
    },

    '0006': {
      before: [
        ['为什么 benchmark 前要 warm up？', '首次执行可能包含编译、cache 初始化和 allocator 开销；warm-up 把这些与稳态 kernel 时间分开。'],
        ['GPU 操作为什么常需要显式同步后再计时？', 'kernel launch 对 CPU 异步；只量 launch 会低估设备真正完成工作的时间。'],
        ['tiling 的核心目的是什么？', '把工作分块，使一小块数据在 register/shared memory 中复用，并匹配硬件并行层次。']
      ],
      sections: [
        { before: 'cuda-basics', label: 'benchmark 与 fusion', question: q(
          'CPU 计时器包住一次异步 CUDA launch，未同步，测到的主要是什么？',
          ['完整 kernel latency', 'launch 提交时间，而非设备完成时间', 'HBM 容量', '训练 FLOPs'], 1,
          ['CPU 可能在 GPU 完成前已停止计时。', '正确。应使用 CUDA events 或同步边界。', '容量不是时长。', '计时器不会推导算法 FLOPs。'],
          q('同一 kernel 连续测 100 次，为什么报告分位数比只报一次更可靠？', ['能看到抖动与离群值，区分稳态分布', '会自动让算法 exact', '能消除所有硬件差异', '会改变输入 shape'], 0,
            ['正确。benchmark 是测量分布，不是单个幸运样本。', '数值算法不由报告方式决定。', '只能表征当前条件。', '输入不应被改变。'])) },
        { before: 'triton-softmax', label: 'kernel mapping', question: q(
          'Triton softmax 把一行装入一个 program 时，长度不是 2 的幂，mask 的作用是什么？',
          ['让越界 lane 不参与 load/store 与归约', '增加 vocabulary', '把 softmax 改成 attention', '强制所有值为零'], 0,
          ['正确。padding lane 常用 -∞ 参与 max/exp，store 时屏蔽。', '无关。', 'softmax 仍是同一算子。', '只处理越界位置。'],
          q('若忘记 store mask，最危险的结果是什么？', ['越界写或污染相邻内存', 'FLOPs 变为 6PD', '模型参数减少', '自动回退 CPU'], 0,
            ['正确。边界正确性是 kernel 的首要契约。', '无关。', '不会改变参数定义。', '通常不会自动安全回退。'])) },
        { before: 'summary', label: 'tiling 与 over-fusion', question: q(
          '把很多算子融合成一个巨大 kernel，为什么可能反而变慢？',
          ['register pressure/occupancy 恶化，且某些中间值难以有效复用', '融合必然增加 token 数', '融合会删除 Tensor Core', 'CUDA 禁止多个算子'], 0,
          ['正确。fusion 有资源与调度边界。', 'token 数不变。', '是否用 Tensor Core 取决于映射。', '融合本身合法。'],
          q('决定是否继续融合前，最有用的证据是什么？', ['profiler 的 kernel time、memory traffic、occupancy 与资源使用', '文件名长度', '只看 Python 行数', '只看理论 FLOPs'], 0,
            ['正确。先定位 bottleneck。', '无关。', '源码长度不代表设备工作。', 'FLOPs 不含 IO 与资源压力。'])) },
        { before: 'ptx', label: 'correctness before speed', question: q(
          '自定义 softmax 比 reference 快 30%，但在极大 logits 上产生 NaN。应怎样判断？',
          ['性能胜出即可上线', '先判不合格；修复数值稳定与 tolerance correctness 后再谈性能', '只报告平均 latency', '把 NaN 当作近似'], 1,
          ['错误结果没有可比较的 speedup。', '正确。reference contract 与边界输入先于优化。', '隐藏不了 correctness failure。', 'NaN 通常不是可接受误差。'],
          q('修复时减去 row max 的主要作用是什么？', ['避免 exp 对大正数溢出，同时 softmax 结果数学等价', '减少 vocabulary', '改变 argmax 位置', '把 FP32 变 INT4'], 0,
            ['正确。softmax 对整体平移不变。', '无关。', '整体减同一常数不改变相对顺序。', '不是量化。'])) }
      ],
      deep: [
        q('一个 fused kernel 与 unfused reference 输出略有差异，首先应做什么？', ['直接宣称更快即可', '在明确 dtype/tolerance 下做 correctness test，再 benchmark', '只增大 batch', '删除 reference'], 1, ['性能不能替代正确性。', '正确。测试顺序是 reference→correctness→performance。', '可能掩盖而非解释错误。', '失去 oracle。']),
        q('Triton 相比 CUDA C++ 的合理定位是什么？', ['无需理解硬件', '更高层地表达 program/tile，但仍需选择 block、mask、访问模式', '只能在 CPU 运行', '任何代码都自动最优'], 1, ['性能仍依赖映射。', '正确。抽象提高生产力，不消除硬件推理。', 'Triton 面向 GPU kernels。', '仍要 autotune/profile。']),
        q('online softmax 的关键收益是什么？', ['不必保存/多遍读取完整中间值，同时保持稳定 max-normalization', '把 exact softmax 改成采样', '删除 exp', '只适用于长度 1'], 0, ['正确。逐块更新 max 与归一化和。', '它可以保持 exact 数学结果（舍入除外）。', '仍计算 exp。', '用于长行更有价值。']),
        q('tile 过大可能造成什么？', ['register/shared memory 超限或 occupancy 降低', '参数 P 自动归零', '网络带宽翻倍', 'causal mask 消失'], 0, ['正确。tile 有复用与资源占用的折中。', '无关。', '单 kernel tile 不直接改变网络。', 'mask 由程序逻辑决定。']),
        q('为什么 PTX/SASS 检查是最后几步，而不是第一步？', ['先确认算法、正确性与 profiler bottleneck，避免优化非热点或错误实现', '汇编永远没用', 'GPU 不执行汇编', 'Python 比机器码更快'], 0, ['正确。逐层缩小问题。', '在定位后很有用。', '最终执行机器指令。', '不是原因。'])
      ],
      open: [
        ['设计一个可信的 GPU kernel benchmark protocol。', '固定 shape/dtype/device；reference correctness；warm-up；CUDA events/同步；多次重复；报告 median/percentiles；同时报告 bytes、FLOPs 与硬件。'],
        ['解释 fusion 为什么常提速，以及什么时候停止融合。', '收益来自少 launch 与少 HBM 中间往返；当 register/shared memory 压力、occupancy、复杂调度或复用恶化时停止。'],
        ['口述一行 softmax 的 tiled/online 数据流。', '逐块 load（带 mask），维护 running max 与 sum-exp，最后归一化并 masked store；说明数值稳定更新。']
      ]
    },

    '0007': {
      before: [
        ['为什么单纯增加 GPU 不保证训练更快？', '新增设备也新增通信、同步与负载不均；串行部分和低效映射会限制 scaling。'],
        ['all-reduce 的输入输出是什么？', '每个 rank 输入一个同 shape tensor，经元素级归约后，每个 rank 得到同一结果。'],
        ['模型维度、层维度、batch/sequence 维度分别暗示哪些切分？', '常对应 tensor、pipeline、data/sequence parallel；真实系统会组合。']
      ],
      sections: [
        { before: 'data-parallel', label: 'collectives', question: q(
          '4 个 rank 各有标量 gradient 1、2、3、4。做 sum all-reduce 后每个 rank 得到什么？',
          ['各保留原值', '10', '2.5', '只 rank 0 得 10'], 1,
          ['那不是 collective。', '正确。sum all-reduce 归约并把结果分发给所有 rank。', '这是平均值，需要再除 world size 或使用 mean 语义。', '这更像 reduce-to-root。'],
          q('若优化器期望平均 gradient，sum all-reduce 后还需要什么？', ['除以 world size 4', '乘以 4', '删除 rank 0', '重新 tokenize'], 0,
            ['正确。也可在 loss/collective 定义中等价处理。', '方向相反。', '不解决 scale。', '无关。'])) },
        { before: 'tensor-parallel', label: 'data parallel', question: q(
          'DDP 的主要容量限制是什么？',
          ['每个 rank 通常保留完整参数/梯度/optimizer state 副本', '每个 rank 只存 1/N 参数', '不能并行计算', '没有通信'], 0,
          ['正确。它扩吞吐，但不直接解决单卡 model-state capacity。', '这是 sharded DP 的思路。', '不同 batch shard 可并行。', '需要 gradient synchronization。'],
          q('模型副本能单卡放下，但希望提高 global batch throughput，最直接的起点是？', ['data parallel', 'pipeline 只放一个 stage', '把 vocab 删除', '只做 CPU offload'], 0,
            ['正确。它在独立数据 shard 上复制计算。', '没有形成并行。', '无关。', '通常更慢且不是最直接。'])) },
        { before: 'combined', label: 'TP 与 PP', question: q(
          'Tensor parallel 与 pipeline parallel 的核心切分对象分别更接近什么？',
          ['同一层张量维度；不同层/stage', '不同数据样本；tokenizer rules', 'optimizer；dataset 文件', '都只是复制完整模型'], 0,
          ['正确。TP 在层内协作，PP 在层间传 activation/gradient。', '前者更像 DP，后者无关。', '不是定义。', '二者都切模型计算。'],
          q('pipeline stage 数增加但 microbatch 太少，最典型问题是什么？', ['bubble 占比高，部分 stage 空闲', '参数自动消失', 'all-reduce 变成本地加法', 'KV cache 翻倍'], 0,
            ['正确。要用足够 microbatches 填充流水线。', '不会。', 'collective 语义不变。', '这是训练并行课。'])) },
        { before: 'pipeline-parallel', label: 'communication placement', question: q(
          '同一层内每次 matmul 都要 collective 的 TP 组，通常应优先映射到哪里？',
          ['节点内更快的 NVLink/NVSwitch 域', '最慢的跨节点链路', '磁盘存储节点', '任意随机 rank'], 0,
          ['正确。高频关键路径通信应尽量使用快速互连。', '会放大每层通信开销。', '磁盘不是 collective fabric。', '忽略物理拓扑。'],
          q('若必须跨节点，哪种并行维度更常被放在外层慢网络上？', ['通信相对低频且可与计算重叠的 data parallel', '每层多次 collective 的细粒度 TP', '单线程 register parallel', 'token ID parallel'], 0,
            ['正确，但仍要按实际 bucket/规模验证。', '通常更敏感。', '不是分布式策略。', '不是标准并行轴。'])) }
      ],
      deep: [
        q('选择 collective 时最重要的第一问是什么？', ['哪个名字最常见', '每个 rank 开始持有什么、结束需要什么', 'GPU 品牌颜色', '代码行数'], 1, ['名字不替代数据布局推理。', '正确。由输入/目标布局推导 primitive。', '无关。', '无关。']),
        q('Ring all-reduce 的优势与局限最准确的是？', ['带宽利用可好，但 latency 随 rank 数与拓扑/消息大小影响', '永远零 latency', '只适用一个 GPU', '不移动数据'], 0, ['正确。算法选择与消息规模、拓扑有关。', '不可能。', 'collective 至少跨多个 rank。', '它正通过传输完成归约。']),
        q('Sequence parallel 常与 TP 结合，主要想减少什么？', ['某些 activation 在 TP ranks 上的重复存储/计算', '训练 token D', '模型层数', '网络接口'], 0, ['正确。它切 sequence 维上的可分 activation。', 'D 是工作量定义。', '架构不变。', '通信仍需接口。']),
        q('“8 卡所以模型容量自动 8 倍”在哪种条件下最不成立？', ['纯 DDP，每卡完整复制 model states', '参数被 FULL_SHARD', 'tensor/pipeline 切开模型', 'optimizer state 分片'], 0, ['正确。replication 不聚合容量。', '这正提高可用聚合容量。', '模型切分可突破单卡。', '至少 optimizer state 不再全复制。']),
        q('组合 DP×TP×PP 时，最应先画什么？', ['rank mesh：每个维度的组、切分对象与 collective', '网站配色', 'tokenizer vocab', '只画 GPU 数字'], 0, ['正确。mesh 把逻辑并行轴映射到物理 ranks。', '无关。', '不是并行布局。', '数量不说明组关系。'])
      ],
      open: [
        ['从“每个 rank 有什么、最后需要什么”推导 all-gather、reduce-scatter、all-reduce。', 'all-gather：分片→每个 rank 完整；reduce-scatter：完整贡献→归约后的不同分片；all-reduce：完整贡献→每个 rank 完整归约结果。'],
        ['解释为什么 TP 通信组应优先放在快速互连域。', 'TP 每层频繁 collective，通信位于关键路径；跨慢网络会反复付费，通常比相对低频的外层 DP 更敏感。'],
        ['为 16 GPU 画一个 2-way TP × 4-stage PP × 2-way DP mesh。', '明确每个 rank 的三维坐标；列出 TP 组、stage 邻居和 DP replica 组，并说明每组传什么。']
      ]
    },

    '0008': {
      before: [
        ['训练 model states 至少包括哪些对象？', 'parameters、gradients、optimizer states；activation 是随 batch/sequence 变化的另一类内存。'],
        ['replication 与 sharding 的区别是什么？', 'replication 每 rank 放完整副本；sharding 让不同 rank 只常驻不同分片，需要时通信重建。'],
        ['gradient checkpointing 节省的主要是什么？', 'activation memory；代价是 backward 时重算部分 forward。']
      ],
      sections: [
        { before: 'fsdp', label: 'ZeRO stages', question: q(
          '从 ZeRO-1 到 ZeRO-3，依次增加分片的对象通常是什么？',
          ['optimizer→gradient→parameter', 'parameter→activation→token', 'gradient→dataset→optimizer', 'KV→Q→logits'], 0,
          ['正确。stage 越高，常驻复制状态越少，通信/实现复杂度更高。', 'activation checkpointing 是另一轴。', 'dataset 不是 model state。', '这是推理对象。'],
          q('只分片 optimizer state、参数和 gradient 仍复制，属于更接近哪一级？', ['ZeRO-1', 'ZeRO-2', 'ZeRO-3', 'DDP 无 optimizer'], 0,
            ['正确。', 'ZeRO-2 再分片 gradient。', 'ZeRO-3 也分片 parameter。', 'DDP 也可用 optimizer。'])) },
        { before: 'mixed-precision-dp', label: 'FSDP lifecycle', question: q(
          'FULL_SHARD 在某层 forward 前为何需要 all-gather？',
          ['把该层参数分片临时重建为计算所需完整参数', '同步 tokenizer', '创建 Adam moment', '永久复制全部模型'], 0,
          ['正确。计算后可 reshard 以降低稳态内存。', '无关。', 'optimizer state 有自己的分片与更新。', '临时 materialization 不等于永久全模型副本。'],
          q('为什么 FSDP 的峰值显存可能明显高于稳态分片大小？', ['all-gather 临时参数、activation、通信 buffer 与 allocator 峰值会重叠', '分片不存在', '每层都保存历史 Q', 'D 必须等于 GB'], 0,
            ['正确。容量规划要看时间线上重叠对象。', '分片仍降低常驻状态。', '训练 attention 不以该方式缓存历史 Q。', '无关。'])) },
        { before: 'quiz', label: 'sharding trade-offs', question: q(
          'gradient checkpointing 与 FSDP 的区别最准确的是？',
          ['前者用重算换 activation，后者用通信/分片减少 model-state replication', '完全相同', '前者只改 optimizer，后者只改 tokenizer', '两者都保证零通信'], 0,
          ['正确。它们解决不同内存对象，可组合。', '对象与代价都不同。', '不正确。', 'FSDP 明确依赖 collectives。'],
          q('模型分片后显存刚好低于上限，为什么仍不安全？', ['还需为临时 all-gather、activation、workspace、通信 buffer 和碎片留余量', '显存上限是软建议', 'GPU 会无限扩容', 'batch 不占内存'], 0,
            ['正确。model-state capacity 不是完整训练容量。', '硬件容量是硬约束。', '不会。', 'batch 影响 activation。'])) },
        { before: 'communication', label: 'mixed precision object map', question: q(
          '配置 param dtype=BF16、reduce dtype=FP32，最准确的解释是？',
          ['参数计算/存储与梯度归约可以采用不同精度策略', '所有 optimizer states 必然 BF16', '通信 bytes 必然为零', '参数不再需要 all-gather'], 0,
          ['正确。mixed precision 必须逐对象说明。', 'optimizer/master state 需另行配置。', 'FP32 reduction 仍传数据，且可能更多。', 'sharding lifecycle 不由 dtype 消除。'],
          q('把 reduce dtype 从 BF16 改 FP32，常见 trade-off 是？', ['可能提高归约数值稳健性，但增加通信 bytes', '同时减少一半 bytes', '删除 gradients', '改变模型层数'], 0,
            ['正确。精度和带宽要共同核算。', 'FP32 每元素 bytes 更多。', 'gradient 仍在。', '架构不变。'])) }
      ],
      deep: [
        q('FSDP backward 后对 gradient 常做哪种 collective，以保留各 rank 的 gradient shard？', ['all-gather', 'reduce-scatter', 'broadcast tokenizer', 'point-to-point only'], 1, ['all-gather 重建完整对象。', '正确。归约各 rank 贡献并把结果分片。', '无关。', '可实现底层环，但语义是 reduce-scatter。']),
        q('mixed precision FSDP 中，哪项最需要明确而不能只写“用 BF16”？', ['参数计算 dtype、reduce dtype、master/optimizer state dtype 与保存策略', 'HTML 字体', '数据集文件名', 'rank 编号颜色'], 0, ['正确。不同对象可用不同精度。', '无关。', '无关。', '无关。']),
        q('prefetch 下一层参数为什么既可能提速也可能爆显存？', ['通信与计算重叠，但多个 all-gather buffer 可能同时存活', '它会改变 loss', '它删除网络', '它减少 token ID'], 0, ['正确。时间重叠也意味着内存重叠。', '数学目标可保持。', '仍需通信。', '无关。']),
        q('CPU offload 的典型 trade-off 是？', ['节省 HBM，但增加 PCIe/host traffic 与 latency', '同时消除所有通信', '让计算 FLOPs 为零', '只改变 vocabulary'], 0, ['正确。它把容量压力移到更慢层级。', '反而新增 host-device movement。', '计算仍需。', '无关。']),
        q('比较 DDP 与 FULL_SHARD 时，哪项属于 exact 对象差异而非性能保证？', ['DDP 常驻完整副本；FULL_SHARD 常驻分片并按需重建', 'FULL_SHARD 在所有 workload 必然更快', 'DDP 永不通信', 'FULL_SHARD 无峰值内存'], 0, ['正确。性能取决于规模与硬件。', '通信可能使小模型更慢。', 'DDP 要同步 gradient。', '临时 buffer 仍形成峰值。'])
      ],
      open: [
        ['画出一个 FSDP layer 的 forward/backward 时间线。', 'forward 前 all-gather 参数→计算→可 reshard；backward 前按需再 all-gather→算梯度→reduce-scatter→释放完整参数，并标注 activation/buffer。'],
        ['为什么“总 HBM / bytes-per-param”对 FSDP 仍只是上界？', '它漏掉临时 materialization、activation、communication buffer、CUDA workspace、allocator fragmentation 及 batch/sequence。'],
        ['解释 mixed precision 为什么不能简单把所有对象都无脑改低精度。', 'matmul 可用低精度提速省内存，但 optimizer accumulation、reduction、某些 normalization/softmax 对精度更敏感；要逐对象指定。']
      ]
    },

    '0009': {
      before: [
        ['log-log 图上的直线通常对应什么函数？', '幂律 y=a x^b；取对数后 log y=log a+b log x。'],
        ['interpolation 与 extrapolation 区别是什么？', '前者在观测范围内估计，后者超出范围；外推对模型假设更敏感。'],
        ['固定 compute 时为什么不能只调参数 P？', '训练 token D 与 P 共同消耗 compute，固定 C 形成约束下的资源分配问题。']
      ],
      sections: [
        { before: 'chinchilla', label: 'power law', question: q(
          '若 loss 的可约部分近似 aN^{-α}，在 log-log 图上斜率是多少？',
          ['α', '-α', 'a', 'N'], 1,
          ['指数前有负号。', '正确。log(aN^{-α})=log a-α log N。', 'a 影响截距。', 'N 是横轴变量。'],
          q('观测斜率在不同规模区间明显变化，最谨慎结论是什么？', ['单一幂律可能只在局部有效，应检查残差/分段', '数据必然错误', '斜率必须强制相同', '参数量无需记录'], 0,
            ['正确。scaling law 是经验模型。', '也可能是 regime change。', '会掩盖结构。', 'N 是核心变量。'])) },
        { before: 'implications', label: 'IsoFLOPs', question: q(
          'IsoFLOPs 实验为什么要在同一 compute budget 下训练多个 (N,D) 组合？',
          ['寻找固定计算预算下 loss 最低的资源分配', '证明 6ND 是 exact identity', '让所有模型参数相同', '消除数据质量影响'], 0,
          ['正确。它估计 compute-optimal frontier。', '6ND 是近似。', 'N 正是被扫描变量。', '若数据源不同仍会影响结果。'],
          q('只训练一个 (N,D) 点，为什么不能识别 compute-optimal 配比？', ['没有同预算对照，无法知道增 N 还是增 D 更好', '因为 loss 不可测', '因为 GPU 不能训练一个点', '因为 D 必须等于 N'], 0,
            ['正确。最优是比较关系。', 'loss 可测。', '可以训练，只是无法推断最优曲线。', '无此约束。'])) },
        { before: 'quiz', label: 'limits 与决策', question: q(
          '把训练-optimal 结论直接用于高调用量部署，可能遗漏什么？',
          ['inference compute/latency 总成本与服务次数', '训练 loss', '参数量', 'token 数'], 0,
          ['正确。部署最优可能偏向更小、训练更久的模型。', '训练 loss 已在拟合目标中。', '参数量并未遗漏。', 'D 也在训练模型中。'],
          q('若新数据质量显著更高，旧 scaling fit 为何可能失效？', ['数据不是同一分布/质量 regime，系数与有效 D 关系会变', '幂律禁止高质量数据', 'GPU 峰值变化必然为零', 'tokenizer 不存在'], 0,
            ['正确。经验规律依赖实验条件。', '没有这种禁令。', '不是核心原因。', '无关。'])) },
        { before: 'critiques', label: 'extrapolation audit', question: q(
          '拟合目标是预测 1T 参数模型，但最大训练点只有 1B。首要报告什么？',
          ['这是 1000× 外推，并给 holdout/不确定区间与函数假设敏感性', '只给一个小数点后四位预测', '称为 interpolation', '删除最大训练点'], 0,
          ['正确。外推跨度必须进入结论置信度。', '虚假精度会隐藏模型风险。', '已远超观测范围。', '应保留或作为 holdout 验证。'],
          q('两个函数在观测区间拟合同样好，外推结果差 10×，说明什么？', ['决策对函数形式敏感，不能只报一个 fit', '其中一个必由训练 loss 自动证明', '外推是 exact', '数据点越少越可靠'], 0,
            ['正确。应做 model comparison/sensitivity。', '训练区间无法区分时没有证明。', '经验外推不是恒等式。', '方向相反。'])) }
      ],
      deep: [
        q('6ND 在 scaling-law 实验中最合适的标签是什么？', ['严格数学恒等式', 'napkin-math compute approximation', '只描述显存', '硬件峰值'], 1, ['Transformer 细节与实现会带来偏差。', '正确。', '单位是 FLOPs。', '不是 FLOP/s。']),
        q('一个拟合在训练点上误差很小，为什么外推仍可能错？', ['不同函数在有限区间可近似相同，超范围后分叉', '训练误差小保证所有未来点', '外推与假设无关', '参数越多统计越 exact'], 0, ['正确。需要留出验证规模和不确定区间。', '没有保证。', '外推最依赖函数形式。', '仍有 regime shift。']),
        q('选择 scaling-law 数据点时，为什么只在一个窄 compute decade 采样危险？', ['难以稳定识别指数与渐近趋势', '会改变 UTF-8', '使 all-reduce 失效', '模型不再有 loss'], 0, ['正确。动态范围不足会让指数估计不稳。', '无关。', '无关。', '仍有 loss。']),
        q('如果训练数据重复很多 epochs，D 应怎样进入 compute 估算？', ['只数 unique tokens', '按每次 processed token 累计，但效果不一定等同新数据', '按文件 GB', '忽略重复部分的 FLOPs'], 1, ['compute 确实重复发生。', '正确。compute accounting 与数据价值要分开。', '不是 token count。', '每次 forward/backward 都耗算力。']),
        q('一个好的 scaling-law 报告为何要给 residual 与不确定性？', ['显示模型在哪些规模系统性偏离，避免把点估计当定律', '让图更长', '替代原始数据', '证明硬件相同'], 0, ['正确。', '不是目的。', '两者都应保留。', '需另行记录硬件。'])
      ],
      open: [
        ['解释从幂律假设到 log-log 直线，再到残差检查的完整推理。', '写 y=ax^b，取 log 得线性；拟合斜率/截距后看 residual 是否随机，若弯曲或分段则单一幂律不够。'],
        ['设计一个小型 IsoFLOPs 实验。', '选多个 compute budgets；每个预算扫描若干 N，按约束确定 D；统一数据/训练配方；比较最终 loss；拟合每个预算最优点。'],
        ['为什么 compute-optimal training 不等于 lifetime-cost optimal deployment？', '后者还要乘服务请求/生成 token，并考虑 latency、memory、能耗；较小模型多训练可能总体更便宜。']
      ]
    },

    '0010': {
      before: [
        ['causal self-attention 中 Q、K、V 各自扮演什么角色？', '当前 query 提出要找什么；keys 用于匹配；values 是按匹配权重读取的内容。'],
        ['arithmetic intensity 的定义是什么？', '完成的 FLOPs / 从关键内存层搬运的 bytes；低 AI 更容易 memory-bandwidth-bound。'],
        ['训练状态中哪些在常规 inference 不需要？', 'gradient、optimizer states 与 backward activation；但仍需 weights、KV cache 和临时 activation。']
      ],
      sections: [
        { before: 'kv-cache-compress', label: 'prefill 与 decode', question: q(
          '生成第 n+1 个 token 时，为什么缓存过去 K/V 而通常不缓存过去 Q？',
          ['过去 Q 未来还要反复查询', '新 Q 要与过去 K 匹配并读过去 V；过去 Q 已完成自己的那次查询', 'K/V 不来自线性投影', 'Q 比 K/V 更大'], 1,
          ['方向相反。', '正确。是否缓存由未来依赖决定，而非三者同源。', '三者都来自投影。', '通常 head 维相近，大小不是根本原因。'],
          q('若不存 KV，生成每个新 token 最直接要重复什么？', ['重新计算整个 prefix 各层的历史 K/V', '重新训练 tokenizer', '更新 Adam', '改变 vocabulary'], 0,
            ['正确。cache 用内存换避免 prefix 重算。', '无关。', '推理没有 optimizer step。', 'encoding 已结束。'])) },
        { before: 'speculative', label: 'quantization 与 cache', question: q(
          '把 weights 从 BF16 量化到 INT4，哪项不一定同比减少？',
          ['weight storage', 'KV cache（若仍用原 dtype）', 'weight memory bandwidth', '模型文件大小'], 1,
          ['通常会明显减少。', '正确。KV cache 是运行时 activation state，需要单独量化/压缩。', 'weight-only quantization 常减少权重搬运。', '通常会减少。'],
          q('AWQ 的核心更接近哪种描述？', ['永久把少数重要 weights 留 FP16', '用 activation 分布识别 salient channels，并通过等价缩放改善统一低比特 weight quantization', '量化 KV 但不量化 weight', '修改 merge rank'], 1,
            ['原论文强调避免硬件低效的 mixed-precision weight storage。', '正确。它是 activation-aware weight-only quantization。', '对象反了。', '无关。'])) },
        { before: 'summary', label: 'speculation 与 batching', question: q(
          'speculative decoding 要保持 target model 分布，draft token 的接受规则应是什么？',
          ['只要 draft 概率大就接受', '以 min(1,p/q) 的概率接受；拒绝时从校正分布采样', '全部无条件接受', '总选 draft argmax'], 1,
          ['缺少随机接受与校正，分布会偏。', '正确。这是 exactness 的关键。', 'draft 错误会直接污染分布。', 'greedy draft 不等于 target sampling。'],
          q('draft 接受率很低时，为什么 speculative decoding 可能不划算？', ['target verification 与 draft 开销无法被多 token 接受摊薄', 'KV cache 自动为零', 'target 不再计算 logits', 'tokenizer 变慢是唯一原因'], 0,
            ['正确。速度来自一次 target pass 验证多个高接受率候选。', '不会。', '仍要验证。', '不是主要热路径。'])) },
        { before: 'paged-attention', label: 'dynamic serving', question: q(
          '静态 batch 中一个短请求先结束，为什么其 slot 可能浪费？',
          ['系统要等整批结束才换入新请求', '短请求会继续生成有效 token', 'weights 被删除', 'KV cache 必须复制到 CPU'], 0,
          ['正确。continuous batching 在迭代边界补入新请求。', '结束后不应继续。', 'weights 常驻。', '并非必需。'],
          q('continuous batching 提高吞吐，为什么不保证每个请求 tail latency 都下降？', ['调度与抢占/排队策略会引入新的竞争和延迟权衡', '吞吐与 latency 永远同义', 'batch 不影响 kernel', '请求长度都相同'], 0,
            ['正确。必须同时测 TTFT、inter-token latency 与 p95/p99。', '二者可权衡。', 'batch shape 明显影响执行。', '真实请求长度动态。'])) }
      ],
      deep: [
        q('5000-token prompt 的 prefill 与随后单 token decode，哪项通常更准确？', ['prefill 可并行处理 prompt、较 compute-heavy；decode 每步读大量历史 KV、易 bandwidth-bound', '两者完全相同', 'decode 不访问 weights', 'prefill 不建立 KV'], 0, ['正确。具体瓶颈依 shape/硬件，但这是常见系统图景。', '并行结构和矩阵 shape 不同。', '每步仍读取权重。', 'prefill 正在建立 cache。']),
        q('KV cache 一阶大小随哪些量线性增长？', ['layers、batch、sequence、KV heads、head dim、K/V 两份与 dtype bytes', '只随 parameter P', '只随 vocabulary', '随 sequence 的平方'], 0, ['正确。cache 本身对序列长度线性；attention 读取/交互另论。', 'P 不能直接代替这些维度。', '无关。', 'cache 存每层每 token K/V，不是所有 pair。']),
        q('PagedAttention 主要解决哪类浪费？', ['KV cache 连续大块预留导致的碎片与动态增长管理', 'attention 数学中 softmax 错误', 'training optimizer state', 'BPE longest-match'], 0, ['正确。通过固定大小 pages/block 管理非连续物理 cache。', '数学函数不因此改变。', '面向推理 KV 管理。', '无关。']),
        q('continuous batching 相比静态 batch 的核心收益是什么？', ['请求完成后立刻插入新请求，提高迭代级利用率', '让每个请求长度相同', '删除 scheduler', '保证 latency 永远下降'], 0, ['正确。', '它正是为了处理长度不齐。', '需要更复杂 scheduler。', '吞吐/延迟存在权衡。']),
        q('decode memory-bound 时，哪种优化最直接针对瓶颈？', ['减少每 token 读取的 weight/KV bytes，或提高批处理复用', '只减少一次无关 CPU 加法', '增加 vocabulary 但不改序列', '重复计算整个 prefix'], 0, ['正确。量化、GQA/cache compression、batching 都从字节或复用入手。', '不触及主要 traffic。', '可能增加输出层成本。', '会增加工作。'])
      ],
      open: [
        ['从 Q=XWq、K=XWk、V=XWv 推导为什么 cache K/V 而不是历史 Q。', '新 token 只生成 Q_new，但 attention 要与 K_1…K_n 匹配并读取 V_1…V_n；Q_i 只服务位置 i 的那次输出，未来不再查询它。'],
        ['用 Lesson 2/5 的 arithmetic intensity 解释 decode 为什么常 memory-bound。', '每步矩阵的 token 维很小，却要读大量 weights 和随上下文增长的 KV；FLOPs/byte 低，Tensor Core 峰值难以吃满。'],
        ['解释 speculative decoding 如何既加速又保持 target 分布。', 'draft 并行提出多 token；target 一次验证；按 min(1,p/q) 接受，首个拒绝处从正差校正分布采样，因此不把 draft 分布当答案。']
      ]
    }
  };
})();
