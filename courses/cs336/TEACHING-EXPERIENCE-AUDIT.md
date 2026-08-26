# CS336 Lesson 1–10 教学体验重构审查

日期：2026-08-26

## 本轮统一验收口径

- 每课新增 3 个 `Before We Start` 回收题、4 个 section-level Concept Check、4 个同机制变体 Follow-up Check、5 个 lesson-end Deep Quiz、3 个开放题。
- 因而每课有 13 道带选项的诊断题：4 道局部题 + 4 道二次验证题 + 5 道综合题。每个 A/B/C/D 选项都有独立解释；答错反馈指出混淆的对象或推理规则。
- 原先“点一下立刻出一个通用答案”的旧版选择题在 Lesson 1–10 运行时退出展示；原有手推式 `<details class="concept-check">` 保留，避免重复刷题。
- `Exact / Approximation / Asymptotic / Hardware-specific` 四类标签在课前区统一说明；具体正文继续用已有 claim tag 和限定语。
- 页面仍以教材正文为主。练习用左边线、段间分隔与可展开答案区分，不把每段内容包装成 card；双栏只用于课前回收和适合比较的对象。

## 逐课审查结果

| Lesson | 原本最大的教学缺口 | 本轮新增的推导 / 迁移 | 重点覆盖的 misconception | 局部检查 | Deep Quiz | 排版调整 |
|---|---|---|---|---:|---:|---|
| 1 · Tokenization / BPE | 正文已能手推 BPE，但学生没有足够机会证明自己真能区分五个对象 | UTF-8 byte 数、frequency→rank、rank-driven encoding、deterministic start、vocab/sequence trade-off | byte=字符；merge 删除旧 token；encoding 重数频率；rank=token ID；longest-match；BPE=Huffman | 4 主题 + 4 变体 | 5 | Training / Encoding 新增响应式双栏；练习插入 byte、BPE、trade-off 之后 |
| 2 · PyTorch / Resource Accounting | 6PD、显存、MFU 已有正文推导，但缺少跨对象计算与错误迁移诊断 | `dW/dX` shape、one-token→6PD、epoch→D、batch 抵消、三层 capacity 判断 | backward 结论死记；D=unique data；batch 不重要；GPU util=MFU；aggregate HBM=可训练规模；bytes/param 是定律 | 4 + 4 | 5 | shape、6PD、capacity 各自就地检查；综合题移到能力清单前 |
| 3 · Architecture / Hyperparameters | 组件多，容易变成“现代配置清单” | residual shape contract、Pre-Norm 数据流、RoPE 的 Q/K 点积、SwiGLU 参数预算 | Norm 修复 shape；RoPE 改 token ID；GQA=local attention；FlashAttention 是近似；同参数=同模型 | 4 + 4 | 5 | 在 normalization、position、FFN 后分散验证，不把全部题堆在页尾 |
| 4 · Attention Alternatives / MoE | asymptotic、active parameters 与真实系统吞吐容易混在一起 | `O(Tw)`、GQA cache 比例、top-k active compute、layered receptive field | 低 FLOPs 必更快；GQA 减 Q；MoE 每 token 算全部 experts；多层 local 永远无长程；router 不均衡无代价 | 4 + 4 | 5 | local/GQA/MoE 三个机制分别设置诊断边界 |
| 5 · GPUs | 容易背硬件数字而不会从 bytes 与 FLOPs 定位瓶颈 | reuse→AI、ridge point、coalescing transaction、topology mapping | GPU busy=Tensor Core 满载；occupancy 越高越好；小矩阵必达峰；FLOPs 少必更快；峰值与实测混同 | 4 + 4 | 5 | 课前显式区分 FLOP/FLOP/s 与 bandwidth/latency；硬件事实归入 hardware-specific |
| 6 · Kernels / Triton | 正文有工具链，但从 correctness 到 benchmark 的验证顺序不够可操作 | async timing、mask 边界、online softmax、tile/fusion 资源折中 | CPU timer=GPU latency；少 kernel 必快；Triton 自动最优；忘记 mask 只影响性能；先看汇编再验证正确性 | 4 + 4 | 5 | benchmark、kernel mapping、over-fusion 各自即时检查 |
| 7 · Parallelism | collective 名词与 rank 上的数据状态没有充分互测 | 逐 rank all-reduce、sum/mean scale、DP/TP/PP axis、pipeline bubble、mesh mapping | all-reduce 只到 rank 0；DDP 聚合容量；8 卡容量自动 8×；PP 无 bubble；只看 GPU 数不画通信组 | 4 + 4 | 5 | collective→DP→TP/PP 按对象流插入练习；综合题要求画 rank mesh |
| 8 · ZeRO / FSDP | stage 定义会背，但临时 materialization 与 peak memory 容易漏算 | ZeRO 1→3 状态扩展、FSDP all-gather/reshard/reduce-scatter 时间线、prefetch overlap | shard size=peak；checkpointing=sharding；FULL_SHARD 必更快；全 BF16 即完整 mixed precision；offload 消除通信 | 4 + 4 | 5 | 用生命周期问题连接 steady-state 与 peak；开放题要求画内存时间线 |
| 9 · Scaling Laws | 容易把经验拟合、6ND 与普遍定律混成一件事 | power law→log slope、IsoFLOPs 对照、residual/holdout、processed repeated tokens、lifetime cost | 6ND 是 exact；一个点能找最优；训练点拟合好即可外推；20 tokens/param 普适；高质量数据不改 fit | 4 + 4 | 5 | 结论类型进入课前提示；局部题按 fit、IsoFLOPs、决策边界拆开 |
| 10 · Inference | KV/prefill/decode 已能推导，但量化与 speculative decoding 的事实表述有两处需要纠正 | future dependency→cache K/V、weight quantization≠KV compression、`min(1,p/q)` 接受与正差校正 | Q/K/V 都缓存；prefill=逐 token decode；weight INT4 自动压 KV；AWQ 永久留少数 FP16；draft 全接收仍 exact | 4 + 4 | 5 | KV、quantization、speculation 三段就地检查；AWQ 与采样公式正文重写 |

## Misconception Audit

每课题库至少覆盖 5 个真实错误模型，合计 60 余个。设计时采用同一诊断链：

1. 主问题让错误模型产生一个看似合理的选项。
2. 提交后解释正确项，并逐项说明其余三项混淆了什么。
3. 局部题紧接一个换数字或换表面场景的 Follow-up Check。
4. Deep Quiz 再把该机制与相邻 section 组合，检查能否迁移。

题目和解释集中在 `assets/practice-bank.js`，渲染与状态逻辑集中在 `assets/deep-practice.js`，便于下一轮逐题人工审阅而不用在十个 HTML 页面复制交互代码。

## 技术事实核验

本轮优先对照以下 primary / official sources：

- Stanford CS336 2026 [课程主页](https://cs336.stanford.edu/) 与 [lecture source repository](https://github.com/stanford-cs336/lectures)
- PyTorch [FSDP stable documentation](https://docs.pytorch.org/docs/stable/fsdp.html)
- NVIDIA [H100 product specifications](https://www.nvidia.com/en-us/data-center/h100/) 与 [Hopper tuning guide](https://docs.nvidia.com/cuda/hopper-tuning-guide/)
- Dao et al., [FlashAttention](https://arxiv.org/abs/2205.14135)
- Rajbhandari et al., [ZeRO](https://arxiv.org/abs/1910.02054)
- Leviathan et al., [Speculative Decoding](https://arxiv.org/abs/2211.17192)
- Lin et al., [AWQ](https://arxiv.org/abs/2306.00978)

已修正 Lesson 10 两处高风险表述：AWQ 不再被写成“保留少量重要 FP16 权重”；speculative decoding 不再被简化成 `p(d)>q(d)` 的确定性接受规则。

## 仍建议人工复核的部分

- H100/A100/B200 的峰值数字必须继续绑定具体 SKU、dtype、dense/2:4 sparse 与是否启用 Transformer Engine；硬件网页更新时要重新核对。
- PyTorch FSDP 的 prefetch、reshard、mixed-precision 和 optimizer state 行为会随版本与配置变化；正文讲的是对象生命周期，不替代目标版本的 source/profile。
- AWQ、PagedAttention、continuous batching 与 speculative decoding 的速度数字高度 workload-specific，应只保留带模型、batch、上下文、硬件和实现条件的 benchmark。
- Scaling-law 系数与 compute-optimal ratio 是经验结果；换 tokenizer、data mixture、architecture 或训练 recipe 后必须重新拟合。
- 题库已经做静态结构检查；发布前仍建议由课程作者做一次逐题学术审阅，尤其检查中文措辞是否会暗示过强的 universal claim。
