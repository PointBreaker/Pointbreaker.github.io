# CS336 中文自学教材深度重构验收

## 验收口径

- `C`：核心机制、公式由来、概念区别、关键 why、基础反例或常见误区；已在正文、Concept Check 或能力清单中覆盖。
- `E`：框架实现差异、研究级 edge case、个性化诊断或不断变化的硬件/系统细节；有意留作延伸。
- 每课先做 ChatGPT Question Test：假设学生认真读完，列出最可能继续追问的 10 个问题。若问题属于 `C` 而页面不能回答，就继续补正文；本报告只记录完成这一轮后的结果。

## 逐课 ChatGPT Question Test

### L1 · Overview, tokenization

1. `C` 为什么 UTF-8 bytes 能覆盖任意文本？
2. `C` 一个中文字符为什么不是一个 byte？
3. `C` vocabulary 与 current segmentation 有什么区别？
4. `C` merge 后旧 token 为什么不删除？
5. `C` training frequency 与 encoding rank 分别何时使用？
6. `C` token ID 为什么不是 merge rank？
7. `C` 为什么 encoding 从 bytes 开始？
8. `C` 为什么不能 longest-match？
9. `C` BPE 与 Huffman 到底哪里相似、哪里不同？
10. `E` 工业 tokenizer 的 priority queue、special-token isolation 与 tie-break 具体怎样实现？

### L2 · PyTorch, resource accounting

1. `C` 如何从 dot product 推出 matmul FLOPs？
2. `C` backward 为什么约为 forward 两倍？
3. `C` 6PD 为什么从 one token 得到？
4. `C` (D) 为什么是 processed tokens 而不是 dataset GB？
5. `C` batch size 为什么不单独出现在 6PD？
6. `C` Adam 的各份训练状态为何存在？
7. `C` 16/18 bytes per parameter 为什么不是定律？
8. `C` 8 卡 aggregate HBM 为什么不能直接用于 DDP？
9. `C` GPU utilization 100% 时 MFU 为什么仍可为 40%？
10. `E` 特定 PyTorch/FSDP 版本的 allocator、bucket 与 master-weight 实现如何精确计量？

### L3 · Architectures, hyperparameters

1. `C` residual addition 对 shape 有什么 invariant？
2. `C` 多头 attention 的 Q/K/V 与 score shape 怎样推？
3. `C` Pre-Norm 为什么改变梯度路径？
4. `C` RMSNorm 去掉了什么，代价是什么？
5. `C` SwiGLU 为什么改变 (d_{ff}) 与参数账本？
6. `C` RoPE 怎样把位置关系带进 attention？
7. `C` attention 与 MLP 各自的主要参数/FLOPs 是什么？
8. `C` FlashAttention 为什么是 exact attention？
9. `C` 为什么不能把新组件理解成无条件替换？
10. `E` 不同模型家族的初始化常数、RoPE scaling recipe 如何选择？

### L4 · Attention alternatives, MoE

1. `C` GQA 共享的是 Q 还是 K/V？
2. `C` 如何由 head counts 推 KV 缩放比例？
3. `C` local attention 改变了哪些 attention edges？
4. `C` 多层 local attention 是否完全没有长程信息？
5. `C` MoE total 与 active parameters 为什么不同？
6. `C` top-k router 的输入输出是什么？
7. `C` capacity factor 为什么可能 drop/reroute token？
8. `C` load imbalance 为什么伤吞吐？
9. `C` MoE 为什么引入 all-to-all？
10. `E` 特定 expert-parallel runtime 如何做 token permutation 与 overlap？

### L5 · GPUs, TPUs

1. `C` GPU 为什么适合 throughput workload？
2. `C` FLOPs 与 FLOP/s 有何区别？
3. `C` registers/shared/L2/HBM 的对象关系是什么？
4. `C` 如何手算 vector add arithmetic intensity？
5. `C` roofline 的 ridge point 表示什么？
6. `C` coalescing 为什么减少 memory transactions？
7. `C` tiling 为什么增加 reuse？
8. `C` occupancy 为什么不是越高越好？
9. `C` GPU utilization 为什么不等于 MFU？
10. `E` 某一代 GPU/TPU 的具体 bank、warpgroup 与峰值规格是什么？

### L6 · Kernels, Triton

1. `C` PyTorch operation 与 GPU kernel 有何区别？
2. `C` 异步 GPU 为什么让朴素计时错误？
3. `C` warm-up 与 synchronize 分别解决什么？
4. `C` fusion 在 add+relu 中具体省哪些 bytes？
5. `C` fusion 为什么不一定减少 FLOPs？
6. `C` tiling 怎样映射到 program instances？
7. `C` mask 为什么是边界正确性的一部分？
8. `C` 更少 kernel 为什么不保证更快？
9. `C` profiler 如何验证 bottleneck hypothesis？
10. `E` 针对 Blackwell TMEM/cluster 的最佳 tile 与 autotune search space 如何设？

### L7 · Parallelism

1. `C` rank 与 collective 各是什么？
2. `C` All-Reduce 的逐 rank 输入输出是什么？
3. `C` 两卡 DDP 为什么要同步梯度？
4. `C` DDP 为什么不能解决单卡容量？
5. `C` All-Gather 与 Reduce-Scatter 如何互补？
6. `C` ring cost model 的 bytes 怎样来？
7. `C` logical bytes 为什么不等于 wall time？
8. `C` TP、PP、DP 分别切哪一个轴？
9. `C` topology 为什么影响并行策略放置？
10. `E` 某个具体 cluster 的 NCCL topology file 与 channel tuning 如何设置？

### L8 · ZeRO, FSDP

1. `C` ZeRO 1/2/3 分别分片什么？
2. `C` 4 ranks 下 state shard 如何缩放？
3. `C` FSDP forward 前为什么 All-Gather？
4. `C` backward 后为什么 Reduce-Scatter？
5. `C` steady-state memory 为什么不是 peak memory？
6. `C` FSDP unit 大小有什么取舍？
7. `C` stage 越高为什么不保证越快？
8. `C` checkpointing 与 sharding 有什么区别？
9. `C` mixed precision 与 FSDP 如何共同改变账本？
10. `E` PyTorch 某版本的 prefetch/reshard policy 如何针对模型调优？

### L9 · Scaling laws

1. `C` 幂律为什么在 log-log 图上近似直线？
2. `C` 6ND 与 scaling-law fit 分别是什么结论类型？
3. `C` IsoFLOP curve 怎样构造？
4. `C` 固定 compute 为什么仍有多组 N/D 选择？
5. `C` compute-optimal 点怎样从实验而非 6ND 单独得到？
6. `C` Kaplan 与 Chinchilla 为何可能结论不同？
7. `C` 20 tokens/parameter 为什么不是普遍定律？
8. `C` loss scaling 为什么不保证 capability scaling？
9. `C` interpolation 与 extrapolation 有什么风险差异？
10. `E` 新架构/新数据域应选什么 parametric family 做 fit？

### L10 · Inference

1. `C` training 与 inference 分别保存哪些对象？
2. `C` 为什么 cache 历史 K/V 而不是 Q？
3. `C` 不使用 KV cache 会重复什么计算？
4. `C` prefill 5000 tokens 是否等于生成 5000 tokens？
5. `C` KV cache bytes 如何从 shape 推导？
6. `C` prefill 与 decode 为何是不同 workload？
7. `C` decode MLP 与 decode attention 的 bottleneck 为何不同？
8. `C` GQA/MLA、量化、投机解码分别减少什么？
9. `C` continuous batching 与 PagedAttention 分别解决什么？
10. `E` 某 serving engine 在特定 arrival trace 上的 scheduler 参数如何调？

### L11 · Scaling fit and extrapolation

1. `C` log-linear 与 NLLS 隐含的误差模型有何不同？
2. `C` parameter 与 training hyperparameter 有何区别？
3. `C` residual pattern 怎样暴露坏函数形式？
4. `C` 为什么应 hold out 最大规模？
5. `C` bootstrap confidence interval 表示什么？
6. `C` 1B 到 1T 是多少倍外推？
7. `C` power-law bend 怎样影响预测？
8. `C` point estimate 为什么不足以决策？
9. `C` inference cost 如何改变 training-optimal 选择？
10. `E` Bayesian hierarchical fit 与多保真 surrogate 如何实现？

### L12 · Evaluation

1. `C` construct、item、scorer 与 aggregate 如何关联？
2. `C` NLL 怎样推出 perplexity？
3. `C` 不同 tokenizer 的 PPL 为什么不能直接比较？
4. `C` accuracy 高为什么未必表示可迁移能力强？
5. `C` contamination 能制造什么假象？
6. `C` prompt sensitivity 应如何报告？
7. `C` LM judge 有哪些系统偏差？
8. `C` capability 与 propensity 有何区别？
9. `C` 平均分为什么需要 subgroup 与 uncertainty？
10. `E` 某一业务的真实用户分布该如何抽样与做 power analysis？

### L13 · Data sources

1. `C` source、snapshot、record、document、token 有何区别？
2. `C` WARC bytes 为什么不等于 text bytes？
3. `C` storage GB 为什么不能直接变成 D？
4. `C` epoch 如何改变 processed tokens？
5. `C` 按 document 与按 token 混合为何不同？
6. `C` provenance 为什么影响复现与删除？
7. `C` 更多来源为什么可能降低数据质量？
8. `C` benchmark contamination 怎样从数据源进入？
9. `C` 为什么必须抽样看原始数据？
10. `E` 特定司法辖区和数据源的许可结论是什么？

### L14 · Filtering, deduplication

1. `C` filter 的 false positive/negative 分别删错或留错什么？
2. `C` exact 与 near duplicate 如何定义？
3. `C` shingles 的 Jaccard 怎样手算？
4. `C` MinHash 估计的对象是什么？
5. `C` hash 数增加能修复错误 threshold 吗？
6. `C` Bloom false positive 会怎样影响数据？
7. `C` shingle size 为什么影响模板重复？
8. `C` 过滤越严为什么不保证下游更好？
9. `C` 处理顺序为什么改变最终 corpus？
10. `E` 十亿文档下 LSH banding、cluster representative 如何工程化？

### L15 · SFT, RLHF

1. `C` base model 与 instruct model 的目标有什么不同？
2. `C` SFT 的 prompt/response mask 为什么重要？
3. `C` demonstration 与 preference pair 有何区别？
4. `C` reward model 学到的是绝对真值吗？
5. `C` policy rollout 与训练 example 有何关系？
6. `C` KL penalty 在约束什么？
7. `C` KL 为什么不是 safety guarantee？
8. `C` verbosity reward hacking 怎样产生？
9. `C` 为什么需要独立 eval？
10. `E` PPO/DPO/其他 preference objective 在具体框架中的稳定性差异如何调参？

### L16 · RLVR

1. `C` rollout、reward、baseline、advantage 的顺序是什么？
2. `C` group-relative advantage 怎样从 rewards 得到？
3. `C` 全组 reward 相同为什么没有信号？
4. `C` 正/负 advantage 如何影响 sequence probability？
5. `C` 可验证答案为什么不等于过程已验证？
6. `C` verifier exploit 是怎样的 reward hacking？
7. `C` hidden tests 为什么重要？
8. `C` on-policy 与 off-policy 有何区别？
9. `C` exploration 与难度 curriculum 如何关联？
10. `E` GRPO/GSPO 的 token/sequence importance weighting 在框架中如何实现？

### L17 · Multimodal models

1. `C` pixel、patch、feature 与 visual token 有何区别？
2. `C` vision encoder 输出怎样接入 LLM？
3. `C` projector 对齐维度是否等于语义对齐？
4. `C` CLIP 与 SigLIP 分别优化什么？
5. `C` 分辨率翻倍为什么 visual tokens 约四倍？
6. `C` visual token count 怎样影响 attention cost？
7. `C` 动态分辨率解决什么又付出什么？
8. `C` 文本 BPE 为什么不能直接 tokenize pixels？
9. `C` 理解与统一生成路线有何差异？
10. `E` 特定 VLM 的 image tiling、MRoPE 与 video sampling 细节如何实现？

### L18 · Guest: Daniel Selsam

1. `C` test 与 proof 的量词范围有何不同？
2. `C` proposition、proof term 与 kernel 分别是什么？
3. `C` formal specification 为什么可能漏掉真实意图？
4. `C` verified 输出到底保证什么？
5. `C` generator 与 verifier 如何形成 search loop？
6. `C` verifier diagnostic 为什么有学习/搜索价值？
7. `C` verification-guided generation 的失败边界是什么？
8. `C` 为什么 verifier 不是事实机器？
9. `C` 无 handout 时哪些内容不能归因于讲者？
10. `E` Lean tactic synthesis、Mathlib retrieval 与 proof-state encoding 如何实现？

### L19 · Guest: Dan Fu

1. `C` IO-aware algorithm 首先核算什么？
2. `C` FlashAttention 为什么不物化完整 score matrix？
3. `C` 它保持了什么 exact 语义？
4. `C` 为什么 attention interactions 仍是 (O(T^2))？
5. `C` microbenchmark 与 end-to-end benchmark 有何区别？
6. `C` Amdahl law 如何限制局部加速收益？
7. `C` profiler 怎样验证新 bottleneck？
8. `C` 算法—硬件协同为什么不是硬件参数背诵？
9. `C` 全课六本资源/目标账如何统一？
10. `E` 新 accelerator 上应如何重新搜索 layout、tile 与 collective schedule？

## 结构验收结果

19 个 lecture pages 均包含：本课问题、prerequisite refresher、对象关系图、toy/worked example、一般化公式或 shape 规则、真实系统映射、misconception/counterexample、Concept Check、可解释能力清单和下一课连接。L18/L19 继续明确无本地官方 handout 的来源边界。

测验脚本现会把错误反馈统一标为“理解诊断”，并允许每个选项通过 `data-diagnosis` 指向具体错误 mental model；L1 的关键 byte/BPE 题已使用逐选项诊断。
