# EECS498 Depth Audit

审计范围：`courses/eecs498/lessons/*.html` 共 14 课。审计基线为首次发布版本 `d9f0cad`；深度参照为当前 `courses/cs336/lessons/` 的问题驱动、对象辨析、worked example、diagnostic check、transfer 与 explain-it-yourself 结构。

## 评级标准

- **GOOD**：当前内容已经承担该教学功能，保留并深化。
- **SHALLOW**：方向正确，但主要给结论；学习者难以自行重建机制。
- **MISSING**：没有形成可识别的教学环节。

## 全课结论

第一版的 provenance、shape-first 语言、historical caveat 与 14 课演化结构均为 **GOOD**。主要深度缺口是：公式出现得比问题快；worked example 很少真正算到元素；“没有 X 会怎样”覆盖不足；Concept Checks 数量少且诊断性弱；没有闭卷复述与跨 shape / 跨架构 transfer；课与课之间的必然性多为一句结语。

| Lesson | Concept introduced | Current mental model | Derivation depth | Concrete example | Code coverage | Shape coverage | Counterfactual | Misconceptions | Checks | Transfer | Next connection |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 01 Neural Networks | function chain, parameter/activation | **GOOD**：representation rewrite | **SHALLOW**：只列两层公式 | **SHALLOW**：无完整样本/score/loss | **GOOD**：two-layer snippet | **SHALLOW**：仅总流程 | **SHALLOW**：无 ReLU 有提及 | **SHALLOW** | **SHALLOW**：3 道 | **MISSING** | **MISSING**：未把 local derivative 推向 backprop |
| 02 Backprop | local backward, VJP, cache | **GOOD**：upstream × local | **SHALLOW**：未沿真实 two-layer graph 走完 | **MISSING**：无数值/shape backward ledger | **GOOD**：Linear.backward | **SHALLOW** | **MISSING**：无 cache / no sharing | **SHALLOW** | **SHALLOW** | **MISSING** | **SHALLOW**：autograd connection only |
| 03 Optimization | SGD→Adam, norm/init | **GOOD**：direction vs scale | **SHALLOW**：moment/state 仅公式 | **MISSING**：未读 historical loss curves | **GOOD**：Adam | **SHALLOW**：state shape 一题 | **SHALLOW** | **SHALLOW** | **SHALLOW** | **MISSING** | **MISSING**：未引出 spatial bias |
| 04 CNN | locality, sharing, receptive field | **GOOD** | **SHALLOW**：output formula 无逐 patch计算 | **MISSING**：无 3×32×32 参数量对比 | **GOOD**：loop snippet | **SHALLOW** | **SHALLOW**：FC 对比只有结论 | **SHALLOW** | **SHALLOW** | **MISSING** | **SHALLOW** |
| 05 Vision representations | input gradients, Gram | **GOOD** | **SHALLOW** | **MISSING**：无小 Gram / saliency例 | **GOOD** | **SHALLOW** | **MISSING** | **GOOD**：historical L2 caveat | **SHALLOW** | **MISSING** | **MISSING** |
| 06 Detection | dense structured output | **GOOD** | **SHALLOW**：anchor→offset→proposal 未算数值 | **MISSING** | **GOOD**：one-stage completion boundary | **GOOD**：宏观 shape | **SHALLOW**：no anchors / no NMS | **GOOD**：incomplete two-stage boundary | **SHALLOW** | **MISSING** | **MISSING** |
| 07 RNN | recurrence, BPTT | **GOOD**：rolling summary | **SHALLOW**：未展开 token1→token10 path | **MISSING**：无三步 recurrence walkthrough | **GOOD** | **GOOD**：sequence shape | **SHALLOW**：无 hidden state只剩独立 tokens | **SHALLOW** | **SHALLOW** | **MISSING** | **SHALLOW**：attention 只一句直达 |
| 08 LSTM | gated additive memory | **GOOD** | **SHALLOW**：gate 从需求中推导不足 | **MISSING**：无具体 gate values | **GOOD** | **GOOD** | **SHALLOW**：无 cell path / gates | **SHALLOW** | **SHALLOW** | **MISSING** | **GOOD**：attention bridge 已存在但过短 |
| 09 Token/Embedding/Position | string→ID→vector | **GOOD**：ID/index/embedding 区分 | **SHALLOW**：embedding update 与 permutation equivariance不足 | **GOOD**：真实 arithmetic chain，但未追 E row | **GOOD** | **GOOD** | **SHALLOW**：ID swap / equal P 缺失 | **GOOD**：三者不等 | **SHALLOW** | **MISSING** | **SHALLOW** |
| 10 Attention | dynamic routing, QKV | **GOOD** | **SHALLOW**：定义先于需求，QKV separation / dot choice不足 | **MISSING**：没有完整小矩阵 Y₂ | **GOOD**：核心 5 行 | **GOOD**：宏观 shape | **SHALLOW**：Q=K=V / no V / uniform weights 缺失 | **GOOD**：interpretation caveat 有一句 | **SHALLOW**：4 道 | **SHALLOW** | **SHALLOW**：未把 token mixing 对比 MLP 推到 block |
| 11 Encoder/Decoder | self/cross/causal | **GOOD** | **SHALLOW**：未用 arithmetic token 逐位置 walkthrough | **MISSING**：无 [Ka,Kq] 数值/方向例 | **GOOD**：DecoderBlock / mask | **GOOD** | **SHALLOW**：reverse Q source、no cross/residual不足 | **GOOD**：cross≠concat | **SHALLOW** | **SHALLOW** | **SHALLOW** |
| 12 Seq2Seq training | teacher forcing, shifted loss | **GOOD** | **SHALLOW**：loss→embedding 的 backward path 缺失 | **SHALLOW**：有 shift table，无错误 logits 例 | **GOOD** | **GOOD** | **SHALLOW**：shift/mask/teacher forcing各自缺失后果不足 | **GOOD**：token vs sequence accuracy | **SHALLOW** | **SHALLOW** | **MISSING**：未自然推出 decoder-only QA |
| 13 Modern LLM | encoder-decoder→decoder-only | **GOOD** | **SHALLOW**：QA/SFT loss mask 未展开 | **MISSING**：无 Q/A causal sequence factorization | **GOOD** | **GOOD** | **MISSING** | **SHALLOW** | **SHALLOW** | **SHALLOW** | **GOOD**：CS336 bridge |
| 14 VAE/GAN | latent/adversarial generation | **GOOD** | **SHALLOW**：ELBO 与 game 只到口号 | **MISSING**：无 1D reparam / loss tradeoff例 | **GOOD** | **GOOD** | **SHALLOW**：no KL / overpower D 有提及 | **GOOD** | **SHALLOW** | **MISSING** | **MISSING**：全课收束不足 |

## P0 findings

### 07–08 Sequence bridge

- **GOOD**：真实 captioning code 与 RNN→LSTM→attention 历史链存在。
- **SHALLOW**：没有让信息从 token 1 穿过多次 recurrence 到 token 10，也没有和 attention 的一步 direct access 形成结构图。
- **MISSING**：具体 gate 数值、长期 gradient path、迁移题、闭卷解释。

### 09 Token / Embedding / Position

- **GOOD**：真实 16-token arithmetic pipeline 与 shape 链。
- **SHALLOW**：`E[11]` 的行查表、embedding 作为 parameter 的更新路径、tokenizer 是否训练、permutation equivariance。
- **MISSING**：ID-row swap、相同 positional vector、`cat eats fish` 顺序反例。

### 10 Attention

- **GOOD**：routing mental model、row-reader/column-source、真实代码。
- **SHALLOW**：Q/K/V 仍是定义式；没有先建立 weighted read，再推出匹配机制。
- **MISSING**：小矩阵逐元素、`Y₂` 展开、Q=K=V 对照、dot-vs-add、fixed parameters vs dynamic weights、attention-vs-MLP、multi-head worked shape、解释性 caveat 的 composition 原因。

### 11 Encoder / Decoder

- **GOOD**：self/cross 来源与 causal mask 方向正确。
- **SHALLOW**：没有挑 `subtract` / 当前 answer position 走完整 self→cross flow。
- **MISSING**：cross matrix `[Ka,Kq]` 元素语义、反转 Q 与 K/V 的思想实验、answer-so-far + question-information 的状态组成。

### 12 Training

- **GOOD**：shift、mask、teacher forcing、真实训练 metric。
- **SHALLOW**：只到 loss，未回到 embedding/QKV/encoder parameter update。
- **MISSING**：一个错误 token distribution 的 backward walkthrough；tokenizer fixed vs learned parameters ledger；shift 与 mask 各自不可替代的反例。

### 13 Modern LLM

- **GOOD**：拓扑对照与 CS336 隔离。
- **SHALLOW**：decoder-only QA 仍是一段描述。
- **MISSING**：chat serialization、answer-only loss mask、`P(A|Q)=∏P(a_t|Q,a_<t)`、prompt/context 与 target 的精确角色。

## Refactor acceptance gate

每课最终必须可识别地包含：concrete problem、stable mental model、shape trace、real repository code、why-design、counterfactual、misconception diagnosis、inline checks、transfer question、explain-it-yourself、next-lesson bridge。Transformer 09–13 还必须包含可手算 worked example 与至少一个真正的 mechanism derivation。
