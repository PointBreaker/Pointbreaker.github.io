# CS336 Spring 2026 Migration Report

完成时间：2026-08-31（Asia/Shanghai）

迁移目标：让 CourseStack 的 active curriculum 明确且唯一地对应 Stanford CS336 Spring 2026，同时保留仍然正确的教材化解释，并把 Spring 2025 题面降级为可辨认的历史存档。

## Source snapshot

- 官方课程主页：<https://cs336.stanford.edu/>
- Lecture repository commit：`8b59b50730766695c2ffedd1a79c50cd09b9eb91`
- Spring 2025 archive：<https://cs336.stanford.edu/spring2025/>
- Assignment 版本与 commit：见下方表格；版本以各仓库 `CHANGELOG.md` 的最新发布条目为准。
- Metadata checked at：`2026-08-30`

## Lecture migration

| Lecture | 2025 → 2026 delta | CourseStack before | Action | Status |
|---:|---|---|---|---|
| 01 | 主线仍是 overview/tokenization | Byte-level BPE 已教材化 | 保留正文；纳入 2026 schedule/provenance regression | Untouched content / metadata verified |
| 02 | 正式标题明确包含 einops、FLOPs、memory、arithmetic intensity | 内容已完整，metadata 标题较短 | 逐字同步官方标题 | Metadata-only |
| 03 | Architecture/hyperparameters 主线延续 | 内容与官方 PDF 一致 | 保留并验证 source | Untouched |
| 04 | 从 MoE 扩展为 attention alternatives **and** MoE | 已有 GQA/MQA、local/linear/recurrent、MoE，但 learned sparse retrieval 与对象边界不足 | 补 DeepSeek Sparse Attention/indexer；显式区分 attention-edge sparsity、MoE parameter sparsity 与 KV sharing | Partially revised |
| 05 | GPU → GPUs, TPUs | GPU 深，TPU 已有但 provenance 边界模糊 | 补 workload fit；把 systolic/XLA/ICI 细节标成 CourseStack extension | Partially revised |
| 06 | Kernels/Triton 主线延续 | 已覆盖 Triton、tiling、fusion、B200/TMEM | 保留并回归 | Untouched |
| 07 | Parallelism 主线延续 | collectives、DP/TP/PP/SP 已完整 | 保留并回归 | Untouched |
| 08 | Parallelism 主线延续 | ZeRO/FSDP lifecycle 已完整 | 验证 `FULL_SHARD` 只与 ZeRO-3 核心分片思想类比，不等同框架实现 | Accuracy verified |
| 09 | Scaling laws 主线延续 | IsoFLOPs/Chinchilla 已完整 | 保留并回归 | Untouched |
| 10 | Inference 主线延续 | KV cache、prefill/decode、serving 已完整 | 回归 local-window KV 上界与 benchmark-specific 数字 provenance | Accuracy verified |
| 11 | 第二讲 scaling laws | fit/uncertainty/extrapolation 已完整 | 保留并回归 | Untouched |
| 12 | Evaluation 主线延续 | validity、benchmarks、judge/safety 已完整 | 保留并回归 | Untouched |
| 13 | 2026 强调 sources 与 processed datasets | source pipeline 已有，current dataset provenance 较弱 | 加 Common Pile/licensed-data dataset design 与 source lineage | Partially revised |
| 14 | 明确加入 mixing 与 synthetic data | filtering/dedup 深，但后半讲不足 | 新增 mixture-as-policy、epoching、UniMax、small→large transfer、synthetic prompt/response/verifier/provenance 与 contamination invariant | Deeply revised |
| 15 | Alignment → Mid/post-training (SFT/RLHF) | 传统 SFT/RLHF 主线正确 | 更新阶段语义、标题、lede 与 schedule metadata | Partially revised |
| 16 | Alignment/RL → Post-training - RLVR | 已有 RLVR/GRPO，但存在绝对化 verifier、无偏性与 CoT 来源表述 | 以 verifier proxy 为中心重写边界；补 z-score bias、on/off-policy、rollout system cost；收紧 R1-Zero 结论 | Deeply revised |
| 17 | 2026 新主线为 Alignment - multimodality | 已有 CLIP/SigLIP/LLaVA/Qwen/Chameleon | 保留历史 URL 以避免 progress 失效；明确 official trace 与 CourseStack paper expansion 的 provenance | Partially revised |
| 18 | Official schedule 只确认 guest lecturer Daniel Selsam | 页面是 contextual formal-reasoning guide | 保留，但只标为 CourseStack contextual guide，不声称复述官方 handout | Source boundary verified |
| 19 | Official schedule 只确认 guest lecturer Dan Fu | 页面是 contextual kernel/system co-design guide | 保留，但只标为 CourseStack contextual guide，不声称复述官方 handout | Source boundary verified |

没有新建或机械重写 unchanged lectures。Lecture 17 保留 `0017-alignment-rl.html` 历史 route，是为避免已有 URL、lesson progress 与 cross-link 漂移；active title 与内容只表达 Spring 2026 multimodality。

## Assignment migration

| Assignment | Official current version | Source commit | Major Spring 2026 delta | CourseStack action | Status |
|---:|---:|---|---|---|---|
| A1 Basics | 26.0.3 | `a158843b20107949f1a8d7df1b05cd33b9166712` | B200 assumptions、tokenization clarifications、modernized accounting、AdamW update order、tests/tensor typing | Workbook/contract 保持 active；新增 authoritative delta；2025 localized statements 进入折叠 archive | Migrated |
| A2 Systems | 26.1.4 | `ca8bc81a59b70516f7ebb2da4808daade877c736` | Nsight、checkpointing、FSDP、B200/TMA、FA3-style two-pass backward；移除 excessive sweeps/bucketed DDP 主任务 | 更新版本、kernel/backward stage 与 active map；bucketed DDP 只保留在 archive | Deeply migrated |
| A3 Scaling | 26.0.5 | `03e9372992e913061b9e78b5cfcb62ad8a87de35` | offline training → hosted online model-training API | 保留 scaling-law 教学；新增 authoritative hosted-API run ledger/budget workflow | Migrated |
| A4 Data | 26.0.1 | `0555bea66369872d912652debf10b115ca0688c8` | English-only WET、2,500 raw WET source、8 B200、16,384 steps、约 8.6B tokens | 更新 final gate/contract/evidence 与 authoritative delta；2025 interfaces 归档 | Migrated |
| A5 Alignment | 2.0.1 | `c2734a26308710949fe13226960a1e8cece94b7e` | OLMo-2-1B + GSM8K、zero/few/r1-zero、GRPO/Dr. GRPO/RFT/MaxRL/GSPO、4 seeds、math+word problems | required reasoning-RL 成为唯一 active 主线；安全 SFT/DPO 单列 optional；Qwen/MATH 旧题面归档 | Deeply migrated |

### Active / archive hierarchy

- 页面顶部只把 `2026 Engineering Workbook` 与 `2026 Official Handout` 作为 active resources。
- 原有完整中文翻译没有删除；它现在位于 `What changed from 2025? · 中文题面与旧接口存档` 折叠区。
- Stage 中匹配到旧译文时标为 `2025 题面参考`，无法匹配时标为 `2026 Official only`，避免把相同 problem ID 误报为接口已验证兼容。
- Stanford repository、PDF、README、tests 与 CHANGELOG 始终拥有最终优先级。
- 所有 assignment metadata 都记录 `version`、`checkedAt` 与完整 `sourceCommit`；Workbook UI 同时显示该 snapshot。

## Validation added

`tools/lint-cs336-content.mjs` 现在自动验证：

1. `course-info.json` 与 `api/status.json` 的 19 个标题逐字匹配 Spring 2026 schedule，lesson route 一致且文件存在。
2. Lecture source snapshot commit 固定；L4/L14/L16/L17 的关键 2026 delta 可检测。
3. 禁止重新引入 RLVR “几乎无 reward hacking”、group mean 是无偏 value estimate、CoT 来源被绝对化等表述。
4. A1–A5 的 CHANGELOG version、checked date 与 source commit 在 metadata、Workbook data 和页面 source note 中一致。
5. Spring 2025 中文题面仍完整存在，但不能重新成为 active primary navigation。
6. Assignment ↔ Lesson links、localized problem IDs、stage contracts、hints、experiment loop 与恢复报告仍通过原有 regression。

## Regression scope

- 19 lecture files、5 assignment files存在且可由 metadata 打开。
- Lesson 17 历史 route、lesson numbering 与 assignment dependencies 保持不变。
- Workbook stage/gate/progress storage keys 未修改。
- 现有 Lesson UI、quiz、sticky TOC、framework diagrams 与 Assignment Workbook renderer 保留。
- 全站 integrity lint 用于确认其他 CourseStack 课程不受影响；移动端由现有 responsive CSS 与浏览器 viewport smoke test 覆盖。

## Manual review still recommended

- Spring 2026 assignment repository 未来若在本次 snapshot 后继续发布 CHANGELOG，需要重新跑 version audit。
- A2 的 B200/TMA/FlashAttention 性能数字仍必须绑定学生实际 benchmark 配置，不能从教材页面推断稳定 speedup。
- PyTorch FSDP 行为随版本、strategy 与 wrapping policy 变化；本页只承诺当前概念边界，不替代对应版本文档。
- Scaling-law fits、data-mixture transfer 与 RL estimator results 都是 empirical claims；远距离 extrapolation、不同 hardware/model/task 的迁移需要独立实验。
- A5 的 optional safety supplement 与 required reasoning-RL handout 应继续分别核对；reward 上升不能替代独立 capability/safety evaluation。

## Outcome

Course header、schedule、lecture provenance、Assignment active workflow 与 version snapshot 现在形成一个统一的 Spring 2026 curriculum。Spring 2025 内容只承担 archive/history 角色，学习者无需再自行判断页面中哪一段是当前任务要求。
