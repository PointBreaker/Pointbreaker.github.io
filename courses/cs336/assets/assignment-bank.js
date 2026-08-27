(function () {
  const L = (lesson, anchor, label) => ({
    href: `../${lesson}.html#${anchor}`,
    label
  });

  const commonDone = {
    correct: ['official tests / required checks pass', 'shape、dtype 与边界行为符合 contract'],
    understand: ['能解释关键 invariant 为什么成立', '能指出一个看似合理但错误的实现假设'],
    evidence: ['保留最小复现实例与输出', '记录配置、观察和结论，而不只写“通过”']
  };

  window.CS336AssignmentBank = {
    '01': {
      title: 'Basics',
      version: 'Spring 2026 · v26.0.3',
      basis: 'Spring 2026 repository and handout',
      legacy: '页面下方保留旧版详细中文题面；接口、题号、限制冲突时以 2026 PDF / repository 为准。',
      localization: '完整中文题面主要基于 Spring 2025 PDF / README 本土化；Stage 与 official problem mapping 依据 Spring 2026 v26.0.3。ID 匹配只表示可导航，不代表接口、测试或约束已经逐题核验。',
      mission: '把 raw text 变成可训练、可恢复、可生成文本的 Transformer language-model system。',
      capabilities: ['Tokenizer', 'Transformer Forward', 'Optimization', 'Training System'],
      stages: [
        {
          id: 'tokenizer', title: 'Tokenizer', capability: 'Tokenizer',
          build: '一个能独立 train、encode、decode 的 byte-level BPE tokenizer。',
          why: 'Transformer 只接收离散 token IDs；tokenizer 决定模型真正看到的序列、词表与压缩效率。',
          lessons: [L('0001-intro-tokenization', 'byte', 'Lesson 1 · UTF-8 bytes'), L('0001-intro-tokenization', 'bpe-training', 'Lesson 1 · BPE training vs encoding')],
          readiness: ['vocabulary 与 current segmentation 有什么区别？', 'training 为什么看 frequency，encoding 为什么看 rank？', 'token ID 为什么不是 merge rank？'],
          official: ['unicode1', 'unicode2', 'train_bpe', 'train_bpe_tinystories', 'train_bpe_expts_owt', 'tokenizer', 'tokenizer_experiments'],
          contract: {
            input: ['training text / iterable of files', 'new Unicode text and special tokens'],
            output: ['vocabulary、ordered merge rules', 'token IDs；decode 后的 text'],
            shape: ['byte values ∈ [0,255]', 'token IDs must reference the emitted vocabulary'],
            invariants: ['training deterministic under the specified tie-break', 'encoding starts from UTF-8 bytes and uses existing ranks only', 'special tokens remain atomic'],
            forbidden: ['recomputing pair frequency during encoding', 'longest-match over vocabulary', 'assuming one character equals one byte']
          },
          done: commonDone,
          sanity: { title: '三行 corpus', body: ['abc', 'abc', 'abd'], expect: '手工写出每轮 segmentation、pair counts、chosen merge 和 rank；encode/decode 可肉眼核对。' },
          failures: [
            { signature: '同一 corpus 多次训练得到不同 merges', checks: ['frequency tie-break', 'unordered set / dict iteration', 'rank assignment order'] },
            { signature: 'decode 后 Unicode 损坏或 special token 被拆开', checks: ['先拼接 bytes 再 UTF-8 decode', 'invalid-byte policy', 'special-token boundary handling'] }
          ],
          hints: ['回忆：encoding 不重新统计 frequency。', '每次 merge 只会让被影响位置附近的 adjacent pairs 改变。', '用三个短 pre-token，每轮打印 segmentation、pair counts 与 ranks。'],
          experiment: {
            hypothesis: '更大的 vocabulary 通常减少 token count，但会增加 embedding / LM-head 参数。',
            prediction: '在同一文本上比较两个 vocab sizes，先写下你预计的 bytes/token 与 sequence length 方向。',
            experiment: '固定语料与 pre-tokenizer，只改变 vocab size；记录 vocab、token count、bytes/token 与训练时间。',
            observation: '填写两组结果与任何反例文本。',
            explanation: '用 merges、语言分布和长尾 token 解释结果，而不是只报一个比值。'
          }
        },
        {
          id: 'model', title: 'Transformer Forward', capability: 'Transformer Forward',
          build: '从 token IDs 到 next-token logits 的完整 Transformer forward pass。',
          why: '这一阶段把 embedding、normalization、RoPE、causal attention、SwiGLU 与 residual stream 组合成一个数值正确的函数。',
          lessons: [L('0003-architectures-hyperparameters', 'transformer-recap', 'Lesson 3 · Transformer shapes'), L('0003-architectures-hyperparameters', 'positional', 'Lesson 3 · RoPE and position')],
          readiness: ['为什么 residual branch 输入输出 shape 必须相同？', 'causal mask 保护的因果 invariant 是什么？', 'RoPE 作用在哪些对象上？'],
          official: ['linear', 'embedding', 'rmsnorm', 'positionwise_feedforward', 'rope', 'softmax', 'scaled_dot_product_attention', 'multihead_self_attention', 'transformer_block', 'transformer_lm', 'transformer_accounting'],
          contract: {
            input: ['token IDs [B,T]', 'model parameters and optional positions'],
            output: ['logits [B,T,V]'],
            shape: ['residual [B,T,D]', 'Q/K/V [B,H,T,Dh], D=H×Dh'],
            invariants: ['future tokens cannot affect an earlier position', 'softmax is numerically stable', 'pre-norm residual additions preserve shape'],
            forbidden: ['silently broadcasting a wrong mask', 'softmax over the wrong dimension', 'using torch.nn implementations forbidden by the handout']
          },
          done: commonDone,
          sanity: { title: '一头、两个 token', body: ['B=1, H=1, T=2, Dh=2', 'choose tiny Q/K/V with integer entries'], expect: '手算 scores、mask、row softmax 和 output；再与实现逐元素比较。' },
          failures: [
            { signature: 'shape 正确但 attention 数值不对', checks: ['1/√Dh scale', 'mask orientation', 'softmax axis', 'transpose / reshape order'] },
            { signature: '长序列出现 NaN 或 inf', checks: ['subtract row max', 'RMSNorm epsilon and accumulation dtype', 'mask value before softmax'] }
          ],
          hints: ['先把每个 primitive 当成 shape-preserving or shape-changing map。', '对 attention 写出每一次 transpose 后的轴含义。', '关闭 batching 和 multi-head，只测 B=H=1 的 tiny tensor。'],
          experiment: {
            hypothesis: 'causal mask 的错误可能不改变 output shape，却会泄漏未来信息。',
            prediction: '只修改最后一个 input token，较早位置 logits 应该如何变化？',
            experiment: '复制同一输入，只替换最后 token；比较每个 position 的 logits。',
            observation: '记录第一个出现差异的位置。',
            explanation: '若早期位置变化，沿 mask / score axes 定位因果泄漏。'
          }
        },
        {
          id: 'optimization', title: 'Optimization', capability: 'Optimization',
          build: '一个稳定的 loss → backward → AdamW update 完整训练步。',
          why: 'forward 只定义预测；loss、gradient、optimizer 与 schedule 才把误差转成参数变化。',
          lessons: [L('0002-pytorch-resource-accounting', 'autograd', 'Lesson 2 · Backward and autograd'), L('0002-pytorch-resource-accounting', 'training-loop', 'Lesson 2 · Training loop')],
          readiness: ['stable cross-entropy 为什么要用 log-sum-exp？', 'AdamW 的 m、v 与 decoupled weight decay 分别做什么？', 'gradient clipping 改的是哪个对象？'],
          official: ['cross_entropy', 'learning_rate_tuning', 'adamw', 'adamw_accounting', 'learning_rate_schedule', 'gradient_clipping'],
          contract: {
            input: ['logits [B,T,V], targets [B,T]', 'parameters, gradients and optimizer state'],
            output: ['scalar loss', 'updated parameters and Adam moments'],
            shape: ['loss scalar', 'm and v match each parameter shape'],
            invariants: ['cross-entropy finite for large logits', 'optimizer step counter and bias correction stay aligned', 'global norm clipping uses all gradients'],
            forbidden: ['weight decay coupled into the Adam gradient path', 'clipping each tensor independently when global clipping is required', 'updating parameters before gradients exist']
          },
          done: commonDone,
          sanity: { title: '一个参数、一个梯度、一步', body: ['θ=1, g=2, m=v=0', 'choose fixed lr, β1, β2, ε and weight decay'], expect: '纸上算出 m、v、bias-corrected values 与 θ_new，再逐项对齐实现。' },
          failures: [
            { signature: 'loss 开始正常随后 NaN', checks: ['learning rate', 'stable CE', 'gradient norm', 'epsilon / dtype', 'update order'] },
            { signature: '第一步接近 reference，后续逐渐偏离', checks: ['step indexing', 'bias correction exponent', 'state persistence', 'weight decay placement'] }
          ],
          hints: ['先区分 gradient transform 与 parameter decay。', 'optimizer state 必须与 parameter 一一对应且跨 step 保留。', '用单 scalar 连跑两步，打印每一步 m、v、step 和 θ。'],
          experiment: {
            hypothesis: '过高 learning rate 会先提高 update norm，再导致 loss instability。',
            prediction: '在运行 sweep 前画出你预计的 stable、edge-of-stability 与 divergent 区域。',
            experiment: '固定 seed、data order 与 steps，只改变 learning rate。',
            observation: '记录 loss、gradient norm、update norm 与首次非有限 step。',
            explanation: '说明结果来自 optimization dynamics，而不是只说“这个 lr 最好”。'
          }
        },
        {
          id: 'training-system', title: 'Training System', capability: 'Training System',
          build: '可复现的 dataset → train → checkpoint → resume → generate → evaluate 系统。',
          why: '独立正确的组件并不自动组成可信实验；状态、数据偏移、恢复与证据链必须一致。',
          lessons: [L('0002-pytorch-resource-accounting', 'training-loop', 'Lesson 2 · End-to-end training loop'), L('0009-scaling-laws', 'methodology', 'Lesson 9 · Controlled experiments')],
          readiness: ['next-token targets 与 inputs 如何错开？', 'checkpoint 最少要保存哪些状态？', '为什么 tests pass 不等于训练实验可复现？'],
          official: ['data_loading', 'checkpointing', 'training_together', 'decoding', 'experiment_log', 'learning_rate', 'batch_size_experiment', 'generate', 'layer_norm_ablation', 'pre_norm_ablation', 'no_pos_emb', 'swiglu_ablation', 'main_experiment', 'leaderboard'],
          contract: {
            input: ['serialized token stream, config and random state'],
            output: ['checkpoints, logs, generated samples and validation loss'],
            shape: ['x/y batches [B,T] with one-token offset'],
            invariants: ['resume continues optimizer and iteration state', 'validation does not update model', 'experiment config is recorded with results'],
            forbidden: ['saving only model weights while claiming exact resume', 'changing multiple variables in one ablation', 'evaluating on training batches']
          },
          done: commonDone,
          sanity: { title: '两步连续性', body: ['run step 1, save, resume, run step 2', 'compare with an uninterrupted two-step run'], expect: '在 deterministic setting 下，parameters、optimizer state、step 与 sampled batch sequence 对齐。' },
          failures: [
            { signature: 'resume 后 loss 突然跳变', checks: ['optimizer moments', 'iteration / scheduler step', 'RNG and data position', 'model train/eval mode'] },
            { signature: '生成正常但 validation loss 异常', checks: ['target shift', 'vocab/checkpoint compatibility', 'reduction denominator', 'eval-mode state'] }
          ],
          hints: ['checkpoint 是训练状态快照，不只是权重文件。', '把 reproducibility contract 写成“同状态 + 同输入 → 同下一步”。', '先在 tiny data 上比较 uninterrupted 与 resume 的下一步，再运行完整训练。'],
          experiment: {
            hypothesis: '单变量 ablation 才能把 loss 差异归因到组件。',
            prediction: '在运行 NoPE / norm / activation ablation 前写出影响方向与不确定性。',
            experiment: '固定 seed、token budget、optimizer 与 eval protocol，只改一个组件。',
            observation: '同时记录 train/validation loss、throughput 与 generated samples。',
            explanation: '区分 quality、stability 与 efficiency，不把一个 metric 当全部结论。'
          }
        }
      ]
    },

    '02': {
      title: 'Systems', version: 'Spring 2026 · v26.1.3', basis: 'Spring 2026 repository and handout',
      legacy: '旧版 2025 详细任务只作 Legacy Reference；2026 problem map、接口与硬件条件优先。',
      localization: '完整中文题面来自 Spring 2025 handout 本土化；Workbook 与 2026 problem map 依据 Spring 2026 v26.1.3。2026 新增 FSDP、parallelism calculations 与 B200 条件尚无对应完整中文译文。',
      mission: '把“模型能跑”推进到“性能可测、瓶颈可解释、训练可扩展”。',
      capabilities: ['Measurement', 'Memory Trade-off', 'IO-aware Kernel', 'Communication Overlap', 'State Sharding', 'Parallelism'],
      stages: [
        {
          id: 'measure', title: 'Measure', capability: 'Measurement', build: '一个可信的 benchmark / profiler harness。',
          why: '没有同步、warmup、shape 与硬件上下文的数字，无法支持任何性能结论。',
          lessons: [L('0005-gpus', 'roofline', 'Lesson 5 · Roofline'), L('0006-kernels-triton', 'benchmarking', 'Lesson 6 · Benchmarking')],
          readiness: ['GPU launch 为什么让 CPU timer 失真？', 'FLOPs、bytes 与 latency 分别是什么？'],
          official: ['benchmarking_script', 'nsys_profile', 'mixed_precision_accumulation', 'benchmarking_mixed_precision', 'memory_profiling'],
          contract: { input: ['model, shape, dtype, device and phase'], output: ['latency distribution, peak memory and profile trace'], shape: ['记录 batch / sequence / model size'], invariants: ['warmup and synchronization', 'baseline and candidate use identical workload', 'repetitions and statistic documented'], forbidden: ['single unsynchronized timing', 'reporting speedup without configuration', 'mixing forward-only with train-step numbers'] },
          done: { correct: ['timing harness agrees with profiler order of magnitude'], understand: ['能解释 measurement overhead 与 asynchronous execution'], evidence: ['Baseline、Configuration、Method、Result、Explanation 五项齐全'] },
          sanity: { title: 'sleep 不是 GPU work', body: ['compare a trivial launch with and without synchronize', 'repeat after warmup'], expect: '观察 launch time 与 completed-work time 的差别。' },
          failures: [{ signature: '第一次迭代远慢于后续', checks: ['warmup', 'compile / cache', 'allocator initialization'] }, { signature: 'profiler 与 timer 差很多', checks: ['synchronization boundary', 'measured region', 'CPU launch vs GPU execution'] }],
          hints: ['先定义被测区间。', '同一配置只改变一个变量。', '打印 shape/dtype/device，warm up 后用 CUDA events 与 profiler 交叉检查。'],
          experiment: { hypothesis: '较大 matmul 更容易摊薄 launch overhead。', prediction: '先预测 shape 变大时 latency 与 achieved FLOP/s 如何变。', experiment: '固定 dtype/device，扫矩阵 shape 与 repetitions。', observation: '记录 median/p10/p90 与 achieved rate。', explanation: '用 launch、utilization 与 memory traffic 解释曲线。' }
        },
        {
          id: 'checkpointing', title: 'Trade Compute for Memory', capability: 'Memory Trade-off', build: '可验证的 activation checkpointing 策略。',
          why: '少存 activation 可以降低显存，但 backward 必须重算；这是一笔 compute ↔ memory 交换。',
          lessons: [L('0002-pytorch-resource-accounting', 'memory', 'Lesson 2 · Memory accounting'), L('0008-parallelism-2', 'mixed-precision-dp', 'Lesson 8 · Training memory')],
          readiness: ['activation 与 parameter state 有何区别？', 'checkpointing 为什么不减少 optimizer state？'],
          official: ['gradient_checkpointing'],
          contract: { input: ['module graph and checkpoint boundaries'], output: ['same loss/gradients within tolerance'], shape: ['forward outputs unchanged'], invariants: ['recomputed path is functionally equivalent', 'RNG-sensitive ops handled consistently'], forbidden: ['claiming sharding', 'comparing different batch/sequence sizes'] },
          done: { ...commonDone, evidence: ['peak-memory trace', 'latency overhead under the same workload'] },
          sanity: { title: '两层 MLP', body: ['checkpoint only the middle activation'],  },
          failures: [{ signature: 'memory 不降', checks: ['boundary too small/large', 'saved tensors outside checkpoint', 'measurement point'] }, { signature: 'gradients 不一致', checks: ['non-determinism', 'in-place mutation', 'RNG state'] }],
          hints: ['checkpointing 删除 saved activations，不删除计算依赖。', '边界决定重算量和保存量。', '用 saved-tensor hooks / profiler 看真正留下了什么。'],
          experiment: { hypothesis: '更激进 checkpointing 降低 peak memory、增加 step time。', prediction: '画出不同 boundary 的 memory/latency 排序。', experiment: '固定模型和 batch，改变 checkpoint policy。', observation: '记录 peak、forward/backward time。', explanation: '指出哪部分 memory 没被 checkpointing 影响。' }
        },
        {
          id: 'kernels', title: 'Move Less Data', capability: 'IO-aware Kernel', build: '数值正确、IO-aware 的 FlashAttention-2 forward/backward kernel。',
          why: 'attention 的关键不只是 FLOPs；避免将完整 score/probability matrix 往返 HBM 才能改变瓶颈。',
          lessons: [L('0005-gpus', 'memory-hierarchy', 'Lesson 5 · Memory hierarchy'), L('0006-kernels-triton', 'tiling', 'Lesson 6 · Tiling and fusion')],
          readiness: ['为什么不物化 T×T 可以省 HBM bytes？', 'online softmax 需要维护哪些统计量？'],
          official: ['pytorch_attention', 'torch_compile', 'flash_forward', 'flash_backward', 'flash_benchmarking'],
          contract: { input: ['Q,K,V and dO with stated shapes/dtypes'], output: ['O, LSE and gradients matching reference'], shape: ['Q/O [Nq,d], K/V [Nk,d] per kernel contract'], invariants: ['causal mask correct', 'online softmax stable', 'boundary masks safe'], forbidden: ['changing attention semantics', 'benchmarking before correctness', 'claiming speedup without shape/dtype/hardware'] },
          done: { correct: ['forward/backward match reference over boundary shapes'], understand: ['能解释 HBM traffic reduction and online softmax'], evidence: ['baseline/config/method/result/explanation benchmark table'] },
          sanity: { title: 'T=2, d=2', body: ['one causal and one non-causal case'],  },
          failures: [{ signature: '短序列正确，非 tile multiple 失败', checks: ['load/store masks', 'masked score value', 'tail dimensions'] }, { signature: '正确但比 PyTorch 慢', checks: ['tile size', 'occupancy/register pressure', 'launch count', 'workload too small'] }],
          hints: ['先保证 exact attention semantics。', 'tile 内只保留 running max、normalizer 与 output accumulator。', '先测一个 tile，再测 tail，再用 profiler 看 HBM 与 occupancy。'],
          experiment: { hypothesis: 'T 翻倍时 naive intermediate memory 约 4×，FlashAttention 不物化该矩阵。', prediction: '先写 T=2048→4096 的 memory 变化。', experiment: '固定 B,d,dtype，扫 T，测 reference/compiled/Flash。', observation: '记录 peak memory、latency 与 correctness tolerance。', explanation: '把收益归因到 IO、kernel schedule 或 compile，而非只报 1.7×。' }
        },
        {
          id: 'communication', title: 'Overlap Communication', capability: 'Communication Overlap', build: '从 naïve DDP 到 backward-overlapped gradient synchronization。',
          why: '多卡性能取决于 collective 位于 critical path 的哪一段，而不只取决于通信总 bytes。',
          lessons: [L('0007-parallelism', 'collectives', 'Lesson 7 · Collectives'), L('0007-parallelism', 'data-parallel', 'Lesson 7 · Data parallel')],
          readiness: ['all-reduce 后每个 rank 拿到什么？', 'sum 与 mean 的 scale 在哪里处理？'],
          official: ['distributed_communication_single_node', 'naive_ddp', 'naive_ddp_benchmarking', 'minimal_ddp_flat_benchmarking', 'ddp_overlap_individual_parameters', 'ddp_overlap_individual_parameters_benchmarking'],
          contract: { input: ['same model replica, rank-local minibatch'], output: ['synchronized gradients and equivalent update'], shape: ['each collective payload shape documented'], invariants: ['all ranks call collectives in compatible order', 'gradient scale matches global-batch convention'], forbidden: ['rank-0-only synchronization', 'timing without a barrier/sync boundary', 'assuming overlap from an async flag alone'] },
          done: { ...commonDone, evidence: ['timeline showing compute/communication overlap', 'strong-scaling result with workload and topology'] },
          sanity: { title: '2 ranks, 1 scalar gradient', body: ['rank0 g=2, rank1 g=4'],  },
          failures: [{ signature: 'single GPU correct, multi-GPU loss scale wrong', checks: ['sum vs mean', 'local/global batch', 'duplicate division'] }, { signature: 'async implementation no faster', checks: ['wait placement', 'bucket readiness', 'stream dependency', 'network critical path'] }],
          hints: ['先画每个 rank 上的 tensor。', 'overlap 必须让 communication 与可独立 compute 同时存在。', '用 2 ranks/scalars 验证语义，再用 timeline 看 wait 是否提前。'],
          experiment: { hypothesis: '更早发起 ready gradients 可隐藏部分 collective latency。', prediction: '先标注 naïve 与 overlap timeline 的 critical path。', experiment: '同模型/全局 batch 比较 naïve、flat、per-parameter overlap。', observation: '记录 exposed communication 与 step time。', explanation: '说明为何 bytes 可能不变但 critical path 改变。' }
        },
        {
          id: 'sharding', title: 'Shard Model State', capability: 'State Sharding', build: 'optimizer-state sharding 与 FSDP FULL_SHARD lifecycle。',
          why: '复制参数、梯度与 optimizer state 会限制模型容量；sharding 用 collective 换 persistent memory。',
          lessons: [L('0008-parallelism-2', 'zero', 'Lesson 8 · ZeRO stages'), L('0008-parallelism-2', 'fsdp', 'Lesson 8 · FSDP lifecycle')],
          readiness: ['persistent shard 为什么不等于 peak memory？', 'FULL_SHARD 计算前为何要 all-gather？'],
          official: ['optimizer_state_sharding', 'optimizer_state_sharding_accounting', 'fsdp', 'fsdp_accounting'],
          contract: { input: ['model states across N ranks'], output: ['equivalent updates with sharded persistent states'], shape: ['shard ownership and padding explicit'], invariants: ['full parameters available when compute needs them', 'gradients reduced to correct owners', 'optimizer updates authoritative shard'], forbidden: ['FSDP = a single fixed configuration', 'peak = total/N', 'ignoring temporary gather buffers'] },
          done: { ...commonDone, evidence: ['memory timeline separating persistent and peak', 'communication/latency comparison'] },
          sanity: { title: '4 ranks, 12 parameter elements', body: ['assign 3 elements per rank'],  },
          failures: [{ signature: 'steady-state small but OOM during forward/backward', checks: ['materialized unit size', 'prefetch overlap', 'temporary buffers', 'fragmentation'] }, { signature: 'loss diverges only under sharding', checks: ['gradient ownership', 'reshard timing', 'mixed-precision policy', 'optimizer state mapping'] }],
          hints: ['把 model state 按 parameter/gradient/optimizer 分账。', '再加一条时间轴：gather → compute → reshard → reduce-scatter。', '缩小到一个 FSDP unit，逐 rank 打印 ownership 与 collective 前后 shape。'],
          experiment: { hypothesis: 'FULL_SHARD 降低 persistent model-state memory，但 peak 不会严格按 world size 等比下降。', prediction: '先列 persistent、materialized unit、activation、buffer 四项。', experiment: '固定模型/sequence/batch，比较 DDP、optimizer sharding、FULL_SHARD。', observation: '记录 persistent estimate、allocated/reserved peak 与 step time。', explanation: '用 lifecycle 解释差异，不只说“通信开销”。' }
        },
        {
          id: 'parallelism', title: 'Multi-dimensional Parallelism', capability: 'Parallelism', build: '能对 DP/FSDP/TP 与 2D mesh 做 shape、memory、communication accounting。',
          why: '单一并行轴无法同时满足容量、吞吐与网络约束；组合前必须知道每一轴切什么、通信什么。',
          lessons: [L('0007-parallelism', 'tensor-parallel', 'Lesson 7 · Tensor parallel'), L('0007-parallelism', 'combined', 'Lesson 7 · Combined strategies')],
          readiness: ['DP、TP、FSDP 分别切分哪个对象？', '为什么设备数相同不代表通信图相同？'],
          official: ['alternate_ring_all_reduce', 'data_parallel_calcs', 'fsdp_calcs', 'tp_calcs', 'fsdp_tp_calcs', 'leaderboard'],
          contract: { input: ['global shapes, mesh axes, topology and precision'], output: ['per-rank tensor shapes, bytes and critical collectives'], shape: ['world size = product of independent mesh degrees'], invariants: ['partition dimensions divide or pad correctly', 'collective group membership explicit'], forbidden: ['using aggregate HBM without a sharding plan', 'ignoring topology', 'adding axis speedups multiplicatively'] },
          done: { ...commonDone, evidence: ['per-rank shape/communication table', 'measured result explained by the accounting'] },
          sanity: { title: '2×2 mesh', body: ['2 FSDP groups × 2 TP ranks'],  },
          failures: [{ signature: 'shape mismatch only at collective', checks: ['split dimension', 'group membership', 'gather/reduce-scatter destination'] }, { signature: 'more GPUs slower', checks: ['per-rank work too small', 'cross-node topology', 'collective serialization', 'pipeline bubbles'] }],
          hints: ['先画 rank mesh，再写 tensor。', '每个 axis 单独写 before/after shape 与 bytes。', '用 4 ranks 的 toy tensor 验证，再映射真实 layer。'],
          experiment: { hypothesis: '最优 parallelism mapping 依 topology 与 per-rank arithmetic intensity。', prediction: '先预测哪些 collectives 应留在 node 内。', experiment: '固定 global workload，比较两种 mesh-to-topology mapping。', observation: '记录 per-rank work、collective time、step time。', explanation: '将差异连接到 link bandwidth、message size 与 overlap。' }
        }
      ]
    },

    '03': {
      title: 'Scaling', version: 'Spring 2026 · v26.0.5', basis: 'Spring 2026 repository and handout',
      legacy: '旧版完整中文题面作为方法参考；2026 hosted API、预算和 leaderboard 要求优先。',
      localization: '完整中文题面主要基于 Spring 2025 handout 本土化；Stage、hosted API、预算和 problem mapping 依据 Spring 2026 v26.0.5。相同 problem 可能服务多个研究 stage。',
      mission: '用受控实验和不确定性诊断，在固定 compute budget 下提出可辩护的 compute-optimal 配置。',
      capabilities: ['Experiment Design', 'Curve Fitting', 'Fit Validation', 'IsoFLOPs', 'Extrapolation'],
      stages: [
        {
          id: 'experiments', title: 'Build Controlled Experiments', capability: 'Experiment Design', build: '一份覆盖有效 search space 的实验 ledger。',
          why: 'Scaling law 的质量首先受实验设计限制；没有信息量的点不能靠更复杂拟合补救。',
          lessons: [L('0009-scaling-laws', 'methodology', 'Lesson 9 · Fit methodology'), L('0011-scaling-laws-details', 'fitting-practice', 'Lesson 11 · Fitting workflow')],
          readiness: ['P、D、C 各代表什么？', '为什么 D 是 processed tokens？'], official: ['scaling_laws · experiment design / API runs'],
          contract: { input: ['12 B200-hour fitting budget and API search space'], output: ['versioned run table with config, wall time, tokens, loss'], shape: ['units normalized across runs'], invariants: ['one recorded config per result', 'failed/truncated runs retained and labeled'], forbidden: ['cherry-picking only good runs', 'changing tokenizer/data silently', 'using unrecorded manual corrections'] },
          done: commonDone, sanity: { title: '三点不成一条可信外推律', body: ['choose 3 N values under one compute slice'],  },
          failures: [{ signature: '重复 run 差异大', checks: ['seed/noise', 'wall-time truncation', 'data order', 'API status'] }, { signature: '大量点落在同一狭窄 N 区间', checks: ['log-space coverage', 'budget allocation', 'adaptive next point'] }],
          hints: ['先定义要识别的 curve。', '实验点应覆盖 log scale 与多个 compute slices。', '先做低成本 pilot，画表后再决定下一个 query。'],
          experiment: { hypothesis: 'log-spaced N 比线性密集点更有效覆盖幂律尺度。', prediction: '比较两种 sampling 对 slope uncertainty 的影响。', experiment: '用同预算模拟/选择两组 N。', observation: '记录 coverage 与 fit sensitivity。', explanation: '说明为何信息量来自范围而非点数本身。' }
        },
        {
          id: 'fit', title: 'Fit Scaling Curves', capability: 'Curve Fitting', build: '明确 objective、units 与参数的 scaling fit。',
          why: '拟合算法隐含误差模型；log-space 与原空间不会自动得到同一结论。',
          lessons: [L('0011-scaling-laws-details', 'fitting', 'Lesson 11 · Fitting objective')], readiness: ['log-log 斜率表示什么？', 'NLLS 与 log-linear fit 的误差权重有何不同？'], official: ['scaling_laws · curve fitting'],
          contract: { input: ['cleaned run ledger'], output: ['fit coefficients, objective and predictions'], shape: ['positive quantities before log transforms'], invariants: ['fit region explicit', 'units and transforms recorded'], forbidden: ['reporting coefficients without objective', 'mixing train/validation loss', 'treating empirical exponent as exact'] },
          done: commonDone, sanity: { title: '已知幂律 toy data', body: ['generate y=2x^-0.5 with one perturbed point'],  },
          failures: [{ signature: '系数对一个点极敏感', checks: ['leverage/outlier', 'fit range', 'objective weighting'] }, { signature: '预测出现不可能值', checks: ['parameter constraints', 'irreducible loss term', 'unit/log transform'] }],
          hints: ['写出被最小化的 residual。', '把 parameter constraints 与 domain 一起写。', '先用 synthetic known coefficients 验证 fitter。'],
          experiment: { hypothesis: '不同 objectives 会改变高/低 loss 点的权重。', prediction: '先预测哪个 fit 更受大绝对误差点影响。', experiment: '同一数据做 raw-space 与 log-space fit。', observation: '比较 coefficients 与 residuals。', explanation: '用误差模型解释差异。' }
        },
        {
          id: 'validate', title: 'Validate Fit Quality', capability: 'Fit Validation', build: 'residual、holdout、uncertainty 与 pseudo-extrapolation 证据。',
          why: '训练点拟合好只证明插值；真正决策关心的是更大规模外推。',
          lessons: [L('0011-scaling-laws-details', 'noise', 'Lesson 11 · Residual and uncertainty'), L('0011-scaling-laws-details', 'extrapolation', 'Lesson 11 · Extrapolation')], readiness: ['随机 holdout 与 largest-run holdout 测什么？', '窄置信区间为何不能排除 model misspecification？'], official: ['scaling_laws · diagnostics / holdout'],
          contract: { input: ['fit and held-out runs'], output: ['residual plots, holdout error, uncertainty statement'], shape: ['residual sign and scale defined'], invariants: ['holdout excluded from fitting', 'extrapolation distance reported'], forbidden: ['using R² alone', 'calling training residual a forecast guarantee', 'hiding failed runs'] },
          done: { ...commonDone, evidence: ['fit region、holdout、residual、extrapolation range、uncertainty 五项齐全'] },
          sanity: { title: '结构化 residual', body: ['small models all positive, large models all negative'],  },
          failures: [{ signature: 'random holdout 好、largest holdout 差', checks: ['curve regime', 'functional form', 'scale-dependent bias'] }, { signature: 'bootstrap interval 极窄但 forecast 错', checks: ['resampling assumption', 'model misspecification', 'correlated runs'] }],
          hints: ['先画 residual，不先看总分。', 'holdout 要模拟真正的外推方向。', '用小 runs fit、最大 runs 验证，再决定是否远外推。'],
          experiment: { hypothesis: '按规模 holdout 比随机 holdout 更能暴露远外推风险。', prediction: '先预测两种 split 的 error。', experiment: '在同一 run table 比较两种 split。', observation: '记录 holdout error 与 residual pattern。', explanation: '解释哪一种更接近最终 decision。' }
        },
        {
          id: 'isoflops', title: 'Run IsoFLOPs Analysis', capability: 'IsoFLOPs', build: '每个 compute slice 的 Nopt(C)、Dopt(C) 点。',
          why: '固定 compute 下，模型过大意味着 token 不够，模型过小意味着参数不足；IsoFLOPs 找平衡点。',
          lessons: [L('0009-scaling-laws', 'chinchilla', 'Lesson 9 · Chinchilla'), L('0011-scaling-laws-details', 'decision', 'Lesson 11 · Decision boundary')], readiness: ['为什么同 compute 下 N 与 D 有 trade-off？', '6ND 是什么类型的近似？'], official: ['chinchilla_isoflops', 'scaling_laws · compute slices'],
          contract: { input: ['runs grouped by comparable compute'], output: ['Nopt and Dopt per slice, then fitted trends'], shape: ['C,N,D units consistent'], invariants: ['optimum derived within each slice before cross-slice fit'], forbidden: ['fitting one global line without within-slice minima', 'assuming 20 tokens/parameter universal', 'mixing wall time and FLOPs silently'] },
          done: commonDone, sanity: { title: '三模型同 compute', body: ['small/medium/large with U-shaped loss'],  },
          failures: [{ signature: 'optimum always at search boundary', checks: ['range too narrow', 'budget slice mismatch', 'training truncation'] }, { signature: 'Nopt trend non-monotonic', checks: ['noise', 'slice comparability', 'fit regime'] }],
          hints: ['先在每条 IsoFLOPs curve 找 minimum。', '再对 optima 做 log-log fit。', '若 minimum 在边界，优先扩 search range 而非强行拟合。'],
          experiment: { hypothesis: '每个 compute slice 的 loss 对 N 应存在 interior optimum（若范围覆盖充分）。', prediction: '先画 U-shape 草图与边界风险。', experiment: '构造 compute slices 并采多个 N。', observation: '标记 minima 和 uncertainty。', explanation: '说明是否真正覆盖 optimum。' }
        },
        {
          id: 'extrapolate', title: 'Extrapolate Carefully', capability: 'Extrapolation', build: '面向 48 B200-hour target 的配置建议与风险边界。',
          why: '最终输出不是一个神奇数字，而是 decision、假设、外推距离与失败条件。',
          lessons: [L('0011-scaling-laws-details', 'extrapolation', 'Lesson 11 · Extrapolation risk'), L('0011-scaling-laws-details', 'decision', 'Lesson 11 · Lifetime decisions')], readiness: ['外推倍数如何计算？', '哪些 architecture/data changes 会让旧系数失效？'], official: ['chinchilla_isoflops · final projection', 'scaling_laws · leaderboard prediction'],
          contract: { input: ['validated fits and target budget'], output: ['predicted config, interval/sensitivity and assumptions'], shape: ['extrapolation ratio in N,D,C reported'], invariants: ['prediction traceable to fit version', 'sensitivity to plausible coefficients shown'], forbidden: ['point estimate without uncertainty', 'claiming empirical law is universal', 'hiding target outside fit region'] },
          done: { ...commonDone, evidence: ['recommendation plus alternative under fit uncertainty'] },
          sanity: { title: '1B → 1T', body: ['largest observed N=1B, target N=1T'],  },
          failures: [{ signature: 'tiny coefficient change flips recommendation', checks: ['sensitivity', 'extrapolation distance', 'fit identifiability'] }, { signature: 'predicted config violates API/system limits', checks: ['feasibility constraints', 'batch/width divisibility', 'wall-clock mapping'] }],
          hints: ['先报告外推距离。', '给 point estimate 之外的 sensitivity band。', '对最终候选做最接近预算的 validation run 或 pseudo-extrapolation。'],
          experiment: { hypothesis: '最优建议对 exponent uncertainty 可能高度敏感。', prediction: '先预测 α/β 小幅变化对 Nopt 的方向。', experiment: '在 fit uncertainty 内做 coefficient sweep。', observation: '记录推荐范围而非单点。', explanation: '把稳健结论与脆弱结论分开。' }
        }
      ]
    },

    '04': {
      title: 'Data', version: 'Spring 2026 · v26.0.1', basis: 'Spring 2026 repository and handout',
      legacy: '旧版本土化细节保留为 Deep Reference；2026 repository 的 schema、训练入口与 B200 配置优先。',
      localization: '完整中文题面主要基于 Spring 2025 PDF / README 本土化；Stage 与 official problem mapping 依据 Spring 2026 v26.0.1。相同 ID 仍需按 2026 repository 复核 schema 与测试。',
      mission: '把 Common Crawl 转成可审计、可复现、可训练并能用模型效果验证的数据集。',
      capabilities: ['Extraction', 'Filtering', 'Deduplication', 'Tokenization', 'Pipeline', 'Data Evaluation'],
      stages: [
        {
          id: 'extract', title: 'Extract', capability: 'Extraction', build: 'WARC/WET/HTML → Unicode text records 的可追踪转换。', why: '所有后续过滤都依赖抽取质量；导航噪声或正文丢失会被下游误判成数据质量。',
          lessons: [L('0013-data-sources', 'pipeline', 'Lesson 13 · Data pipeline'), L('0014-data-filtering-dedup', 'html-extraction', 'Lesson 14 · HTML extraction')], readiness: ['WARC、document、token 是同一对象吗？', '为什么要保留 source/snapshot provenance？'], official: ['look_at_cc', 'extract_text', 'language_identification'],
          contract: { input: ['WARC response bytes / WET records'], output: ['text + source metadata + extraction status'], shape: ['one record has stable source id'], invariants: ['decode errors explicit', 'provenance survives transform', 'record boundaries preserved'], forbidden: ['dropping failed records silently', 'treating HTML tags as content', 'assuming public URL means training license'] },
          done: commonDone, sanity: { title: '一段 tiny HTML', body: ['title, nav, paragraph, script and malformed bytes'],  },
          failures: [{ signature: '输出充满菜单/脚本', checks: ['extractor choice', 'boilerplate removal', 'HTML parser errors'] }, { signature: '同一 URL 无法追到原始记录', checks: ['snapshot/time', 'WARC id', 'lineage fields'] }],
          hints: ['抽取是有损 transform。', '把 text 与 provenance 一起定义为 output contract。', '对 10 个已知页面逐字段 diff WARC/WET/extracted text。'],
          experiment: { hypothesis: '不同 extractor 会改变 retained text 与后续 filter score。', prediction: '先预测 boilerplate 和正文召回差异。', experiment: '同一小样本跑两种 extraction path。', observation: '记录 text length、manual quality 与 downstream scores。', explanation: '说明变化来自 extraction，而不是 classifier 本身。' }
        },
        {
          id: 'filter', title: 'Filter', capability: 'Filtering', build: '带审计统计的 language/PII/harmful/quality filtering pipeline。', why: 'filter 是 policy 与 error trade-off，不是真理 oracle；必须同时看到 kept/removed 与 subgroup risk。',
          lessons: [L('0014-data-filtering-dedup', 'filtering-algorithms', 'Lesson 14 · Filtering algorithms'), L('0013-data-sources', 'copyright', 'Lesson 13 · License and governance')], readiness: ['false positive 与 false negative 分别伤害什么？', 'quality score 为什么可能编码 domain bias？'], official: ['mask_pii', 'harmful_content', 'gopher_quality_filters', 'quality_classifier'],
          contract: { input: ['extracted text population'], output: ['kept/masked/removed record + reason + score'], shape: ['counts reconcile: input = kept + removed'], invariants: ['criterion/version logged', 'removed samples remain auditable', 'PII masking does not merge records'], forbidden: ['only reporting accuracy', 'deleting subgroup examples without audit', 'changing thresholds without versioning'] },
          done: { ...commonDone, evidence: ['input population、criterion、kept%、removed%、FP risk、bias risk'] },
          sanity: { title: '六条 hand-labeled text', body: ['clean, code, dialect, PII, toxic quote, boilerplate'],  },
          failures: [{ signature: 'retained rate 很高但样本仍差', checks: ['false negatives', 'extractor noise', 'threshold calibration'] }, { signature: '某语言/方言几乎消失', checks: ['subgroup false positives', 'training labels', 'language-id threshold'] }],
          hints: ['先定义“positive”是 keep 还是 remove。', '每条决策都保留 reason code。', '做 stratified manual audit，不只随机看总体。'],
          experiment: { hypothesis: '提高 quality threshold 会改善部分质量指标但降低覆盖与多样性。', prediction: '先画 quality/coverage trade-off。', experiment: '固定 population，扫 threshold。', observation: '记录 kept%、manual precision、domain/subgroup distribution。', explanation: '指出收益与偏差风险。' }
        },
        {
          id: 'deduplicate', title: 'Deduplicate', capability: 'Deduplication', build: 'exact line dedup 与 MinHash+LSH near-document dedup。', why: '重复会改变 sampling weight、污染评估并浪费 compute；exact 与 near duplicate 是不同问题。',
          lessons: [L('0014-data-filtering-dedup', 'deduplication', 'Lesson 14 · Exact/near dedup')], readiness: ['Jaccard 的分母是什么？', 'MinHash 为什么是 estimate 而不是 exact comparison？'], official: ['exact_deduplication', 'minhash_deduplication'],
          contract: { input: ['normalized lines/documents'], output: ['deduplicated set + cluster/removed provenance'], shape: ['shingle and hash parameters versioned'], invariants: ['deterministic representative policy', 'exact and near duplicate metrics separated'], forbidden: ['calling MinHash exact', 'discarding cluster membership', 'dedup after split when leakage matters'] },
          done: { ...commonDone, evidence: ['exact removed%、near removed%、MinHash settings and manual pair audit'] },
          sanity: { title: '三个 shingle sets', body: ['A={a,b,c}, B={a,b,d}, C={x,y}'],  },
          failures: [{ signature: '几乎所有文档进入一个 cluster', checks: ['normalization too aggressive', 'empty/common shingles', 'banding parameters'] }, { signature: '明显改写重复未被发现', checks: ['shingle size', 'threshold', 'candidate recall', 'tokenization normalization'] }],
          hints: ['先分 exact 与 near。', 'MinHash 估 Jaccard，LSH 只做 candidate generation。', '用已知相似度 toy sets 检查 signature，再抽样 cluster。'],
          experiment: { hypothesis: '更低 Jaccard threshold 提高 duplicate recall 但增加 false merges。', prediction: '先写 precision/recall 方向。', experiment: '构造 labeled pairs，扫 threshold/bands。', observation: '记录 candidate recall、manual precision、removed%。', explanation: '选择与 downstream risk 对应的 operating point。' }
        },
        {
          id: 'tokenize', title: 'Tokenize', capability: 'Tokenization', build: '可验证的 filtered text → GPT-2 token binary 数据。', why: 'training D 从 tokenizer 输出产生；文件 GB、document count 与 token count 不能互换。',
          lessons: [L('0001-intro-tokenization', 'efficiency', 'Lesson 1 · bytes/token'), L('0013-data-sources', 'pipeline', 'Lesson 13 · From source to D')], readiness: ['bytes/token 与 character/token 有何区别？', '为什么 D 还要考虑 epochs/sampling？'], official: ['tokenize_data'],
          contract: { input: ['filtered documents and tokenizer version'], output: ['serialized token IDs + counts/manifests'], shape: ['dtype supports vocab range'], invariants: ['document boundary policy explicit', 'token count reconciles with files'], forbidden: ['choosing dtype too small', 'losing tokenizer version', 'calling compressed bytes D'] },
          done: commonDone, sanity: { title: '两个短 document', body: ['include one Chinese character and boundary token'],  },
          failures: [{ signature: '训练读到 vocab 外 ID', checks: ['dtype overflow', 'endianness/serialization', 'tokenizer mismatch'] }, { signature: 'document 边界消失', checks: ['EOS insertion', 'concatenation order', 'special-token handling'] }],
          hints: ['先记录 tokenizer hash/version。', '序列化 contract 包含 dtype 与 boundary。', '写入 20 tokens 后读回、decode、核对 min/max。'],
          experiment: { hypothesis: 'data mixture 和 language distribution 会改变 bytes/token。', prediction: '先预测不同 domains 的效率差异。', experiment: '固定 tokenizer，对 stratified samples 统计。', observation: '记录 bytes、tokens、domain。', explanation: '说明 sequence budget 的 downstream 影响。' }
        },
        {
          id: 'pipeline', title: 'Build Pipeline', capability: 'Pipeline', build: '可恢复、可审计的 end-to-end filtering job。', why: '2,500 个 WET files 需要 failure isolation、versioned manifests 与 stage-level counts。',
          lessons: [L('0013-data-sources', 'pipeline', 'Lesson 13 · Data lineage'), L('0014-data-filtering-dedup', 'pipeline', 'Lesson 14 · Processing order')], readiness: ['为什么处理顺序属于 specification？', '哪些 counts 能证明 population 没静默丢失？'], official: ['filter_data', 'inspect_filtered_data'],
          contract: { input: ['versioned input manifest'], output: ['versioned artifacts, metrics and failure log'], shape: ['stage counts reconcile'], invariants: ['idempotent/restartable stages', 'source→artifact lineage', 'config captured'], forbidden: ['catching and discarding errors', 'overwriting artifacts without version', 'only inspecting kept data'] },
          done: { ...commonDone, evidence: ['per-stage population ledger and samples from kept/removed/modified'] },
          sanity: { title: '十条 mixed records', body: ['one intentional failure in each stage'],  },
          failures: [{ signature: '重跑得到不同 counts', checks: ['nondeterministic sampling', 'unordered inputs', 'mutable external model/version'] }, { signature: '总数对不上', checks: ['exceptions', 'duplicate IDs', 'multi-output masking', 'stage joins'] }],
          hints: ['每个 stage 都写 population ledger。', 'failed 是一种显式状态。', '先跑 10 records 并核对 IDs，再扩到一 file。'],
          experiment: { hypothesis: '最大的 throughput bottleneck 可能不是 classifier compute，而是 IO/extraction。', prediction: '先按 stage 估 bytes、calls 与 latency。', experiment: 'profile stage wall time and throughput。', observation: '记录 records/s 与 failure rate。', explanation: '选择并行化/缓存方案并说明一致性代价。' }
        },
        {
          id: 'evaluate', title: 'Evaluate Data Through Training', capability: 'Data Evaluation', build: '用固定训练 recipe 比较数据 pipeline 的 downstream evidence。', why: 'filter score 只是 proxy；最终仍要看模型质量、subgroup 与安全/偏差证据。',
          lessons: [L('0012-evaluation', 'validity', 'Lesson 12 · Evaluation validity'), L('0009-scaling-laws', 'methodology', 'Lesson 9 · Controlled comparisons')], readiness: ['为什么 validation loss 不是唯一 construct？', '如何避免同时改变数据量与数据质量？'], official: ['train_model'],
          contract: { input: ['versioned datasets and fixed training config'], output: ['loss curves, benchmark/subgroup results and samples'], shape: ['token budget controlled or explicitly normalized'], invariants: ['same model/optimizer/eval protocol', 'dataset delta isolated'], forbidden: ['rewarding only one benchmark', 'changing token budget silently', 'claiming causality from uncontrolled runs'] },
          done: { ...commonDone, evidence: ['controlled run table, uncertainty and sample-level audit'] },
          sanity: { title: 'tiny overfit', body: ['train on a handful of kept documents'],  },
          failures: [{ signature: 'filtered data loss 更差但 benchmark 更好', checks: ['construct difference', 'domain mixture', 'token diversity'] }, { signature: 'run 间差异大于 pipeline delta', checks: ['seed variance', 'insufficient budget', 'training instability'] }],
          hints: ['先固定 training recipe。', '把 proxy metric 与 true desired behavior 分开。', '做 tiny smoke run，再做 matched-token multi-seed comparison。'],
          experiment: { hypothesis: '某 filter 可提高 target-domain utility，同时牺牲覆盖。', prediction: '先写 quality、coverage、bias 三个方向。', experiment: 'baseline vs one pipeline change under matched tokens。', observation: '记录 loss、target metrics、subgroups、samples。', explanation: '说明哪项证据支持/反驳 hypothesis。' }
        }
      ]
    },

    '05': {
      title: 'Alignment & Reasoning RL', version: 'Spring 2026 · v26.0.0', basis: 'Required reasoning-RL handout + optional SFT/DPO safety supplement',
      legacy: '主作业是 reasoning RL；SFT、DPO 与 safety evaluation 属于 2026 optional supplement。旧版 2025 内容仅作 Legacy Reference。',
      localization: '完整中文题面来自 Spring 2025 主作业与 safety/RLHF supplement 本土化；Spring 2026 v26.0.0 已重构 reasoning-RL / GRPO 主线。SFT、DPO 与安全评估只在 2026 optional supplement 中对应。',
      mission: '建立 baseline，正确实现并比较 on-policy / variant / off-policy GRPO，同时区分 reward proxy 与真实 desired behavior。',
      capabilities: ['Baseline & Grader', 'Rollout Contract', 'On-policy GRPO', 'RL Variants', 'Off-policy RL', 'Safety & Preference Evaluation'],
      stages: [
        {
          id: 'baseline', title: 'Establish Baseline', capability: 'Baseline & Grader', build: 'OLMo-2 on GSM8K 的 prompting baseline、grader 与 variance ledger。', why: '没有稳定 baseline 与 reward contract，RL 曲线无法解释。',
          lessons: [L('0012-evaluation', 'reasoning-benchmarks', 'Lesson 12 · Reasoning evaluation'), L('0016-alignment-rlvr', 'what-is-rlvr', 'Lesson 16 · Verifiable reward')], readiness: ['final-answer grader 不能观察什么？', 'zero/few-shot/CoT 改变的是 weights 还是 protocol？'], official: ['prompting_baselines', 'baseline_calcs'],
          contract: { input: ['GSM8K prompt, model output and answer parser'], output: ['graded rollouts, accuracy and variance estimate'], shape: ['prompt/response boundaries explicit'], invariants: ['same decoding/eval protocol across baselines', 'grader failures visible'], forbidden: ['treating parse failure as model reasoning failure without label', 'changing prompt and sampling together'] },
          done: commonDone, sanity: { title: '四条 grader cases', body: ['correct format, equivalent number, malformed, wrong answer'],  },
          failures: [{ signature: '肉眼正确但 reward=0', checks: ['parser/format', 'normalization', 'answer delimiter'] }, { signature: 'baseline 波动极大', checks: ['sampling temperature', 'seed/sample count', 'prompt sensitivity'] }],
          hints: ['先定义 reward 观察到什么。', 'grader 与 model behavior 分开测。', '建立 four-case parser suite，再跑固定 prompts/seeds。'],
          experiment: { hypothesis: 'CoT prompt 可能提高 capability elicitation，但也改变 length 与 parse failure。', prediction: '先写 accuracy/length/parse-rate 方向。', experiment: '固定 model/sampling，比较 prompt protocol。', observation: '记录 accuracy、length、invalid rate。', explanation: '区分 reasoning gain 与 grader artifact。' }
        },
        {
          id: 'rollout', title: 'Build Rollout Contract', capability: 'Rollout Contract', build: 'prompt/output tokenization、response log-probs、rewards 与 group advantages。', why: 'policy gradient 的每个 token 必须知道自己属于 prompt 还是 response，并绑定生成它的 policy 概率。',
          lessons: [L('0016-alignment-rlvr', 'grpo', 'Lesson 16 · Group-relative advantage'), L('0015-alignment-sft-rlhf', 'sft', 'Lesson 15 · Response loss mask')], readiness: ['为什么 prompt tokens 通常不计 response policy loss？', '全组 reward 相同会产生什么 signal？'], official: ['tokenize_prompt_and_output', 'get_response_log_probs', 'compute_rollout_rewards', 'compute_group_normalized_rewards_grpo'],
          contract: { input: ['prompts, sampled responses, policy logits and grader rewards'], output: ['response mask, per-token log-probs/entropy, group advantages'], shape: ['batch × sequence aligned across masks/log-probs'], invariants: ['response boundary exact', 'grouping by prompt', 'zero-variance group numerically safe'], forbidden: ['normalizing across unrelated prompts', 'including padding in loss', 'recomputing old-policy probabilities after update'] },
          done: commonDone, sanity: { title: '1 prompt, 4 rewards', body: ['[1,1,0,0] then [2,2,2,2]'],  },
          failures: [{ signature: 'advantages 不以组内 0 为中心', checks: ['group axis', 'mask/count', 'baseline formula'] }, { signature: 'loss 随 padding 长度变化', checks: ['response mask', 'token aggregation denominator', 'padding log-probs'] }],
          hints: ['所有 tensor 先标 prompt/group/token axes。', 'group normalization 只在同 prompt rollouts 内。', '用固定四条 rewards 与手写 mask 比较每个中间 tensor。'],
          experiment: { hypothesis: 'length normalization 选择会改变长短 response 的 effective weight。', prediction: '先比较 token-average 与 sequence-average。', experiment: '构造等 reward、不同长度 responses。', observation: '记录每条 sequence 对 total loss 的贡献。', explanation: '说明 estimator 隐含的 reweighting。' }
        },
        {
          id: 'on-policy', title: 'On-policy GRPO', capability: 'On-policy GRPO', build: '标准 on-policy GRPO train step 与可解释训练 run。', why: '当前 policy 采样能减少 distribution mismatch，但 rollout cost、group variance 与 sparse reward 决定信号质量。',
          lessons: [L('0016-alignment-rlvr', 'grpo', 'Lesson 16 · GRPO'), L('0016-alignment-rlvr', 'challenges', 'Lesson 16 · Sparse reward')], readiness: ['positive/negative advantage 如何改变 log-prob？', '为什么 all-zero rewards 不是“模型已学会”？'], official: ['compute_policy_gradient_loss_on_policy', 'aggregate_loss_across_microbatch_sequence', 'grpo_train_step_standard_on_policy', 'grpo_experiments_standard_on_policy', 'grpo_learning_rate', 'grpo_prompt_ablation'],
          contract: { input: ['current-policy rollouts and group advantages'], output: ['policy update plus training/eval metrics'], shape: ['loss aggregation follows official token/sequence contract'], invariants: ['rollouts sampled from current policy', 'optimizer step uses matching log-probs'], forbidden: ['reusing stale rollouts without off-policy correction', 'judging success from reward alone', 'changing prompt and lr in one ablation'] },
          done: { ...commonDone, evidence: ['reward、true task accuracy、length、entropy、KL/proxy diagnostics'] },
          sanity: { title: '两 token response', body: ['one positive and one negative advantage case'],  },
          failures: [{ signature: 'reward 上升但 accuracy 不升', checks: ['grader exploit', 'format shortcut', 'proxy mismatch'] }, { signature: 'entropy 快速坍缩', checks: ['learning rate', 'advantage scale', 'group diversity', 'sampling'] }],
          hints: ['先验证 loss direction。', '训练监控至少分 reward proxy 与 true evaluation。', '固定一个 batch 做单步 update，检查 chosen token log-prob 的方向。'],
          experiment: { hypothesis: '适中 lr 提升 verifier reward，过高 lr 造成 entropy collapse 或 instability。', prediction: '先画 reward/entropy/accuracy 随 lr 的预期。', experiment: '固定 prompts/rollout budget，做 lr sweep。', observation: '记录多 seed mean/variance。', explanation: '区分 optimization instability 与 reward hacking。' }
        },
        {
          id: 'variants', title: 'RL Variants & Ablations', capability: 'RL Variants', build: 'Dr. GRPO、RFT、MaxRL 与 normalization ablations 的受控比较。', why: 'estimator 选择会重新加权 difficulty、length 与 group signal；不能只看最终 reward。',
          lessons: [L('0016-alignment-rlvr', 'grpo', 'Lesson 16 · Estimator mental model'), L('0012-evaluation', 'validity', 'Lesson 12 · Metric validity')], readiness: ['advantage normalization 隐含怎样的 task weighting？', 'ablation 为什么要求单变量？'], official: ['think_about_length_normalization', 'compute_group_normalized_rewards_drgrpo', 'aggregate_loss_across_microbatch_constant', 'think_about_rft', 'derive_difficulty_reweightings', 'think_about_advantage_normalization', 'compute_group_normalized_rewards_maxrl', 'grpo_train_step_variants_on_policy', 'grpo_experiments_variants_on_policy'],
          contract: { input: ['same rollout/eval protocol across estimators'], output: ['comparable learning curves and estimator diagnostics'], shape: ['aggregation denominator explicit'], invariants: ['same token/rollout budget', 'variant is the only intended change'], forbidden: ['comparing different compute budgets', 'selecting best seed only', 'calling higher reward better reasoning automatically'] },
          done: { ...commonDone, evidence: ['multi-seed curves, compute-normalized comparison, exploit audit'] },
          sanity: { title: 'easy vs hard groups', body: ['one group all succeeds, one mixed, one all fails'],  },
          failures: [{ signature: 'variant 优势只来自更长输出', checks: ['length distribution', 'aggregation', 'reward parser'] }, { signature: '单 seed 排名反复翻转', checks: ['variance', 'sample count', 'shared evaluation set'] }],
          hints: ['先推导 estimator 的 implicit weights。', '控制 rollout tokens 与 optimizer updates。', '在 synthetic groups 上算贡献，再跑 multiple seeds。'],
          experiment: { hypothesis: '不同 normalization 会改变 difficulty weighting。', prediction: '先写 easy/mixed/hard groups 的相对贡献。', experiment: '同 rollouts 离线计算多个 estimator，再做 matched online runs。', observation: '记录 contribution、reward、accuracy、length。', explanation: '把曲线差异连接回 estimator weights。' }
        },
        {
          id: 'off-policy', title: 'Off-policy GRPO', capability: 'Off-policy RL', build: '带 token/sequence importance reweighting 与 clipping 的 off-policy update。', why: '复用旧 rollouts 节省生成成本，但 behavior policy 与 current policy 不同，需要控制 bias/variance。',
          lessons: [L('0016-alignment-rlvr', 'future', 'Lesson 16 · On/off-policy boundary')], readiness: ['importance ratio 的分子分母是什么？', 'clipping 用什么换什么？'], official: ['derive_surrogate_objectives', 'compute_policy_gradient_loss_off_policy', 'think_about_importance_reweighting', 'compute_policy_gradient_loss_off_policy_gspo', 'grpo_train_step_off_policy', 'grpo_experiments_off_policy', 'try_your_own'],
          contract: { input: ['behavior log-probs, current log-probs, advantages and masks'], output: ['clipped/reweighted policy loss'], shape: ['token vs sequence ratios not silently mixed'], invariants: ['behavior probabilities frozen with rollout', 'ratio/clipping formula matches estimator'], forbidden: ['using current log-prob as both numerator and denominator', 'unbounded ratios without diagnostics', 'claiming clipping removes all bias'] },
          done: { ...commonDone, evidence: ['ratio histogram, clip fraction, ESS-like diagnostic, task metrics'] },
          sanity: { title: '三个 ratios', body: ['0.5, 1.0, 3.0 with chosen clip bounds'],  },
          failures: [{ signature: 'loss 几乎为零且 clip fraction 极高', checks: ['policy lag', 'clip bounds', 'log-prob alignment'] }, { signature: '偶发巨大 update', checks: ['ratio tails', 'sequence product', 'numerical log-space calculation'] }],
          hints: ['ratio = current / behavior。', 'token 与 sequence reweighting 是不同 estimator。', '先用手写 log-probs 验证 ratio/clip，再画真实 histogram。'],
          experiment: { hypothesis: '更旧 rollouts 提高 reuse，但 ratio variance 与 clipping 增加。', prediction: '先预测 lag 对 ESS/clip/task gain 的方向。', experiment: '固定 rollout set，比较不同 policy lag。', observation: '记录 ratio stats、clip%、update norm、accuracy。', explanation: '说明 bias/variance/compute trade-off。' }
        },
        {
          id: 'safety-eval', title: 'Safety & Preference Evaluation', capability: 'Safety & Preference Evaluation', build: '可选 supplement：SFT、DPO、red-team 与多 construct evaluation 证据。', why: 'reward 或 benchmark 上升不自动代表 true preference、helpfulness 或 safety 上升。',
          lessons: [L('0015-alignment-sft-rlhf', 'sft', 'Lesson 15 · SFT'), L('0015-alignment-sft-rlhf', 'preference-data', 'Lesson 15 · Preference data'), L('0012-evaluation', 'safety', 'Lesson 12 · Safety evaluation')], readiness: ['SFT loss mask 为什么只覆盖 response？', 'preference label 与 true desired behavior 有何距离？'], official: ['mmlu_baseline', 'gsm8k_baseline', 'alpaca_eval_baseline', 'sst_baseline', 'look_at_sft', 'data_loading', 'sft_script', 'sft', 'mmlu_sft', 'gsm8k_sft', 'alpaca_eval_sft', 'sst_sft', 'red_teaming', 'look_at_hh', 'dpo_loss', 'dpo_training'],
          contract: { input: ['demonstrations / preference pairs / eval suites'], output: ['SFT/DPO model and construct-specific evidence'], shape: ['prompt/response and chosen/rejected boundaries explicit'], invariants: ['objective, proxy, desired behavior and evidence separated', 'optional supplement labeled optional'], forbidden: ['reward↑ = safety↑', 'evaluating on training preferences only', 'hiding red-team failures behind average score'] },
          done: { ...commonDone, evidence: ['Objective、Proxy metric、Desired behavior、Potential exploit、Evaluation evidence'] },
          sanity: { title: '一条 preference pair', body: ['same prompt, chosen/rejected responses'],  },
          failures: [{ signature: 'preference metric 上升但 safety subgroup 下降', checks: ['construct mismatch', 'data composition', 'reward shortcut'] }, { signature: 'SFT 后通用能力下降', checks: ['overfitting', 'mixture/learning rate', 'eval protocol'] }],
          hints: ['把 objective 与 desired behavior 分列。', '任何 proxy 都要写 potential exploit。', '先跑 baseline suite，再单变量训练，再用 held-out and red-team evidence 比较。'],
          experiment: { hypothesis: 'SFT/DPO 可改善目标行为但可能引入 capability or safety regressions。', prediction: '先写各 construct 的预期与风险。', experiment: '固定 eval suite，做 before/after 与 subgroup/red-team。', observation: '记录平均、subgroup、failure examples。', explanation: '说明哪些证据支持真实改进，哪些只支持 proxy。' }
        }
      ]
    }
  };

  Object.values(window.CS336AssignmentBank).forEach((assignment) => {
    assignment.stages.forEach((stage) => {
      if (!stage.sanity.expect) {
        stage.sanity.expect = '运行代码前先手算或写下逐项预期；运行后逐项比较，不要只看最终 pass/fail。';
      }
    });
  });
})();
