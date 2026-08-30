# CS336 Spring 2026 Migration Audit

审计时间：2026-08-30（Asia/Shanghai）

审计范围：`course-info.json`、`api/status.json`、19 个 Lecture HTML、5 个 Assignment Workbook/题面页、CS336 assets、figures、source/version metadata。
迁移原则：先以 Stanford Spring 2026 官方主页、`stanford-cs336/lectures`、各 Assignment 当前仓库与 CHANGELOG 建立基线，再与 CourseStack 当前内容和 Spring 2025 archive 做差分。本文件在正文迁移前生成。

## 官方基线

- 课程主页：<https://cs336.stanford.edu/>
- 2026 lecture repository：<https://github.com/stanford-cs336/lectures>
- lecture source commit：`8b59b50730766695c2ffedd1a79c50cd09b9eb91`
- 2025 archive：<https://cs336.stanford.edu/spring2025/>

| Assignment | CHANGELOG 当前版本 | main commit（审计时） | CourseStack 当前版本 | 结论 |
|---|---:|---|---:|---|
| A1 Basics | 26.0.3 | `a158843b20107949f1a8d7df1b05cd33b9166712` | 26.0.3 | 版本号一致；完整中文题面仍以 2025 为主 |
| A2 Systems | 26.1.4 | `ca8bc81a59b70516f7ebb2da4808daade877c736` | 26.1.3 | VERSION_MISMATCH |
| A3 Scaling | 26.0.5 | `03e9372992e913061b9e78b5cfcb62ad8a87de35` | 26.0.5 | 版本号一致；2025 中文题面仍需降级为 archive |
| A4 Data | 26.0.1 | `0555bea66369872d912652debf10b115ca0688c8` | 26.0.1 | 版本号一致；2026 WET/B200 delta 已部分进入 Workbook |
| A5 Alignment | 2.0.1 | `c2734a26308710949fe13226960a1e8cece94b7e` | 26.0.0 | VERSION_MISMATCH；主实验叙事仍混有 2025 |

说明：版本号以 CHANGELOG 的最新已发布条目为准，不以 `pyproject.toml` 或 README 中可能滞后的字符串代替。A1 README 仍写 Spring 2025，但 CHANGELOG 已有 26.0.x；因此 README 标题不能单独决定 active version。

## 状态定义

- `ALREADY_2026`：主题、来源与主要叙事已与 2026 一致，只需回归或小修。
- `PARTIAL_2026`：已迁移主要主题，但遗漏官方 2026 的重要段落、边界或例子。
- `LEGACY_2025`：页面主叙事仍是 2025。
- `MIXED`：2026 Workbook/metadata 与 2025 主内容并存，学习者仍需自行判断版本。
- `SOURCE_MISMATCH`：页面内容超出或不同于页面所声称的官方来源，且边界不够清楚。
- `VERSION_MISMATCH`：本地版本号与官方 CHANGELOG 最新发布版本不一致。

## Lecture 1–19 全量审计

| Lecture | Audit | Current state | Official Spring 2026 state | Delta | Required action |
|---:|---|---|---|---|---|
| 01 | ALREADY_2026 | 深度 byte-level BPE 教材；source 指向 2026 trace | Overview, tokenization | 主机制仍适用 | 保留正文；只补统一 provenance/version marker 与 regression |
| 02 | ALREADY_2026 | PyTorch、einops、FLOPs/memory/arithmetic intensity 已覆盖 | PyTorch (einops), resource accounting (FLOPs, memory, arithmetic intensity) | `course-info` 标题过短 | 更新官方标题；保留教学推导 |
| 03 | ALREADY_2026 | architectures/hyperparameters，来源为 lecture_03.pdf | Architectures, hyperparameters | 无结构性差异 | metadata/provenance-only |
| 04 | PARTIAL_2026 | 已改为 attention alternatives + MoE，覆盖 linear/local/sparse/Mamba/GQA/MLA 与 routing | Attention alternatives and mixture of experts；官方强调 linear/recurrent form、Mamba-2/GDN hybrids、DeepSeek Sparse Attention、routing/load balancing/system constraints | sparse attention 仍偏泛化；`attention sparsity != MoE sparsity`、KV sharing 边界与 capacity/communication 可更明确 | 保留主体，补官方 2026 delta、对象区分和 source boundary |
| 05 | PARTIAL_2026 | GPU 主线完整；已有 GPU/TPU 对照表 | GPUs, TPUs；官方把 TPU 作为 GPU 旁的同类 accelerator，对比轻控制、大矩阵单元与快速存储 | TPU 已不止一句，但部分 systolic/XLA/ICI 解释是 CourseStack 扩展，需与官方边界分开；缺 workload-fit 小结 | 收紧 provenance；补 workload fit/编译器假设边界，不虚构官方细节 |
| 06 | ALREADY_2026 | Kernels/Triton，含 B200/TMEM 与 benchmark/fusion/tiling | Kernels, Triton | 主线一致 | metadata/provenance-only；回归 |
| 07 | ALREADY_2026 | collectives、DP/TP/PP/SP、网络拓扑 | Parallelism | 主线一致 | 保留；回归 |
| 08 | ALREADY_2026 | ZeRO/FSDP lifecycle、多维并行 | Parallelism | 主线一致 | 保留；验证 FSDP/ZeRO 准确表述 |
| 09 | ALREADY_2026 | scaling fundamentals/IsoFLOPs/Chinchilla | Scaling laws | 主线一致 | 保留；回归 |
| 10 | ALREADY_2026 | inference/KV/prefill/decode/serving | Inference | 主线一致 | 保留；回归 benchmark claim provenance |
| 11 | ALREADY_2026 | fit、uncertainty、extrapolation、decision | Scaling laws | 主线一致 | 保留；回归 |
| 12 | ALREADY_2026 | evaluation validity、benchmarks、judge/safety | Evaluation | 主线一致 | 保留；回归 |
| 13 | PARTIAL_2026 | sources/datasets、crawl→processed data、copyright/licensing | Data (sources, datasets)；2026 trace 明确 live service→crawl/dump→processed dataset，并更新 Common Crawl/Wikipedia/GitHub/arXiv 与 Common Pile 等案例 | 现有 pipeline 正确，但 2026 对 raw source constraints、WARC/WET 与 current dataset provenance 的强调不够集中 | 保留数据源主体；补 2026 source lineage、WARC/WET 和 current source examples |
| 14 | PARTIAL_2026 | filtering/dedup 很深；mixing 只有较短 DoReMi 段；synthetic data 缺主 section | Data (filtering, deduplication, mixing, synthetic data)；官方明确 transformation→filtering→dedup→mixing→post-training synthetic data | 这是最大 lecture content delta：缺 UniMax/epoch cap、small-scale mixture transfer、synthetic prompt/response pipeline 与 contamination 边界 | 深改后半课并改官方标题；保留已有 filtering/dedup 推导 |
| 15 | PARTIAL_2026 | 以传统 Alignment/SFT/RLHF 为主 | Mid/post-training (SFT/RLHF) | 标题与阶段语义落后；需核对 official lecture emphasis，避免把所有 alignment 统一叫 post-training | 改标题/阶段图和 provenance；保留仍准确的 SFT/RM/PPO 基础 |
| 16 | PARTIAL_2026 | 已以 RLVR 为中心，含 rollout→reward→advantage→update | Post-training - RLVR | 主结构正确，但存在过强表述：RLVR reward “客观”、reward hacking “几乎不存在”、组均值是无偏 value estimate、纯 RL “无需 SFT CoT”等；on/off-policy 只在 checklist 出现 | 依据 lecture_16.pdf 收紧定义，补 estimator/on-off-policy 边界，删除不成立的普遍结论 |
| 17 | PARTIAL_2026 | 内容已是 multimodal：CLIP/SigLIP/LLaVA/Qwen/Chameleon | Alignment - multimodality | 主题正确；历史 filename 仍是 `alignment-rl`，官方来源与 CourseStack 扩展论文需要更清楚分层 | 为避免破坏既有 URL/progress 保留历史 route；以 title/metadata 明确 2026 语义并修 provenance |
| 18 | SOURCE_MISMATCH | 以 formal verification/Lean/program synthesis 构建一课，但官方日程仅给讲者，无本地 handout | Guest lecture: Daniel Selsam | 具体讲题无法由 schedule 单独证明 | 保留为明确标注的 CourseStack contextual guide；不得称为官方讲义复述 |
| 19 | SOURCE_MISMATCH | 以 FlashAttention/kernel/system co-design 构建一课，但官方日程仅给讲者，无本地 handout | Guest lecture: Dan Fu | 具体讲题无法由 schedule 单独证明 | 保留为明确标注的 CourseStack contextual guide；不得称为官方讲义复述 |

## Assignment 1–5 全量审计

| Assignment | Audit | Current state | Official Spring 2026 state | Delta | Required action |
|---:|---|---|---|---|---|
| A1 Basics | MIXED | 2026 v26.0.3 Workbook/problem map + 大量 Spring 2025 本土化题面；2025 H100/time/interface 仍可见 | v26.0.3：B200、tokenization clarifications、modernized architecture accounting、AdamW update-order fix、revised tests/tensor typing | 学习主路径仍会进入旧任务叙事 | 让 2026 Workbook/authoritative map 成为唯一 active 主线；2025 题面进入折叠 `2025 → 2026 Delta / Archive`，不删除 |
| A2 Systems | MIXED + VERSION_MISMATCH | Workbook 已覆盖 Nsight/checkpointing/FA2/DDP overlap/sharding/FSDP/2D；仍写 v26.1.3，并有 DDP bucketing/旧 benchmarking 文案和 2025 中文题面 | v26.1.4；26.0–26.1 移除 excessive benchmarking、multi-GPU sweeps、bucketed DDP，新增详细 Nsight、checkpointing、FSDP、B200/TMA、FA3-style backward writeup | 版本与旧主线冲突 | P0：升级 v26.1.4；移除 bucketed-DDP 主路线与旧 sweep；更新 backward/测试说明；旧题面降级 archive |
| A3 Scaling | MIXED | 2026 v26.0.5 Workbook 已写 hosted API、12/48 B200-hour planning；完整中文题面仍主要来自 2025 | v26.0.5；核心 delta 是 offline→online training API | 概念正确，任务接口分层仍混合 | 保留 Chinchilla/IsoFLOPs 教学；把 API workflow、budget、run ledger 设为 active；旧 offline 题面归档 |
| A4 Data | MIXED | 2026 v26.0.1 Workbook 已提 2,500 English WET、B200；中文题面主要为 2025 | v26.0.1：English-only WET files derived from 2,500 raw WETs；8 B200、16,384 steps、约 8.6B tokens | active/legacy 仍同页并列 | 更新 active version notice/contract/experiment；2025 interface 归档，保留概念型 filtering/dedup 指引 |
| A5 Alignment | MIXED + VERSION_MISMATCH | Workbook 已出现 OLMo-2/GSM8K、Dr. GRPO/RFT/MaxRL/GSPO，但 metadata/页面仍写 v26.0.0，描述和大段题面仍以 Qwen-2.5-Math/MATH 与旧 safety 为主 | v2.0.1：OLMo-2-1B + GSM8K、zero/few-shot/r1-zero、SFT、4 seeds、math+word problems、MaxRL、GSPO；optional safety supplement 独立 | active narrative 与版本号严重漂移 | P0：升级 2.0.1；以 required reasoning-RL 为主，optional safety 独立；2025 Qwen/MATH 主作业降级 archive；补实验矩阵与 evidence contract |

## Cross-cutting findings

1. `course-info.json` 的 term 正确，但 Lecture 2/14/15/16/17 title 尚未逐字对齐 2026 schedule。
2. `api/status.json` 与 course-info 存在重复 schedule metadata，需要同步修改并做一致性 lint。
3. Assignment source note 目前没有统一的 `checked_at` 和 source commit；版本还分散在 HTML、`course-info.json` 与 `assignment-bank.js` 三处。
4. Assignment Localization UI 会把 Spring 2025 完整题面提升为“中文完整题面”一级资源；这符合旧恢复任务，但不符合本次“active curriculum 只显示 2026”要求。应保留资产，改变版本层级，而不是删除翻译。
5. Lecture 17 的历史 filename 与 2026 主题不一致；为避免既有 URL/progress 回归，本次保留 route，但 title、metadata 与页面内容必须只表达 multimodality。
6. Lecture 18–19 没有官方 handout，任何详细主题只能作为 CourseStack contextual guide，不能伪装成 Stanford lecture provenance。

## Migration order

1. 统一 schedule/title/provenance/version metadata，并增加可检测的 source snapshot。
2. 深改 L14、L16；定向修 L4、L5、L13、L15、L17；收紧 L18–19 source boundary。
3. P0 迁移 A2、A5；随后 A1、A3、A4 的 active/legacy 层级与 2026 delta。
4. 增加 schedule/version/provenance/legacy phrase lint，生成 migration report。
5. 跑 19 lectures + 5 assignments、anchor、interactive、mobile/static regression；确认其他课程不受影响。
