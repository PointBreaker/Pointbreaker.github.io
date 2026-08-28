# EECS498 Depth Refactor Report

Generated: 2026-08-28  
Course: `courses/eecs498/`  
Historical source snapshot: `PointBreaker/EECS498@1b495ae8c4db1343a12a39ac626a0a84dcada300`

## Outcome

The existing 14-lesson course structure and CourseStack design system were preserved. The refactor changes the lesson experience from concept summaries into problem-driven review loops:

`problem → naive approach → failure → mechanism → worked tensor example → repository code → counterfactual → misconception diagnosis → transfer → closed-book explanation`

All 14 lessons now pass `node tools/check-eecs498-depth.mjs`. The checker verifies concrete problem framing, mental model, shapes, historical code, mechanism, counterfactual, misconception, checks, transfer, closed-book explanation, next-lesson connection, provenance, homepage registration, and course-scoped scripts. This is a structural gate; it does not replace manual teaching review.

## Lesson-by-lesson changes

| Lesson | Before depth | New mechanisms and worked examples | Code walkthrough | Counterfactual / misconception | Checks and transfer | Known gaps |
|---|---|---|---|---|---|---|
| 01 · Neural Networks Are Functions | SHALLOW | KNN → linear → two-layer motivation; `N=2,D=3,H=4,C=2` full shape flow; parameter/activation/gradient ledger | A2 two-layer forward and loss retained | Remove ReLU → two linear maps collapse; hidden activation is not a parameter | 5 checks plus token-sequence transfer and closed-book explanation | Does not re-derive softmax calculus; that belongs to L02 |
| 02 · Backprop | SHALLOW | Full `X→W1→ReLU→W2→scores→L` backward path; numeric ReLU gate | A2/A3 manual layers retained and tied to cached tensors | No cache; gradient is slope, not target parameter value | 5 checks, residual-branch transfer, closed-book graph trace | Full Jacobian notation remains optional |
| 03 · Optimization | SHALLOW | 1D SGD step; momentum/Adam state roles; training/validation failure table | A3 optimizer implementations and notebook evidence retained | No validation; Adam does not choose a correct learning rate | 5 checks, loss-spike diagnosis transfer | Historical curves are described from saved notebook evidence rather than replotted |
| 04 · CNN | SHALLOW | `[3,32,32]` patch-dot-product walkthrough; 448 vs 442,384 parameter comparison; receptive field 3→5→7 | A3 convolution loops retained | Flatten+FC; learned kernel ≠ feature map | 5 checks, 1×1 convolution transfer | Effective receptive field is left as a modern deep dive |
| 05 · Vision Representations | SHALLOW | Saliency shape; Gram `[C,C]`; four probes separated by objective | A4 visualization/style code retained | Positionwise feature matching would preserve layout; saliency is local sensitivity | 4 checks, token-gradient transfer | Adversarial optimization is not expanded into a security survey |
| 06 · Detection | SHALLOW | Dense candidate tensor ledger; 7×7×3=147 hypotheses; anchors/IoU/NMS pipeline | A5 one-stage implementation retained | No NMS; incomplete two-stage skeleton explicitly bounded | 5 checks, grid-resolution transfer | Two-stage code remains historical incomplete work, not presented as completed |
| 07 · RNN | SHALLOW | `N=2,T=3,D=4,H=5` recurrence; BPTT Jacobian chain; token-1→token-10 vs direct attention | `rnn_step_forward` line-by-line shapes | `Wh=0` / no hidden state; cache ≠ memory | 8 diagnostic checks, captioning and bidirectional transfer, closed-book trace | No full RNN backward derivative table |
| 08 · LSTM | SHALLOW | Gates derived from keep/write/read needs; numeric cell update; `[N,4H]` packing; gradient highway | `lstm_step_forward` line-by-line | No forget/input gate; output gate does not erase cell | 8 checks, long-horizon retention and GRU transfer | Gate-bias conventions remain optional and are not attributed to history |
| 09 · Token / Embedding / Position | SHALLOW | Character/codepoint/bytes/token/ID/embedding/context separated; exact arithmetic token IDs; `E∈R^(16×64)` lookup; ID-row swap; permutation argument | Preprocess and `nn.Embedding` separately traced | All positions equal; token ID/embedding/context distinctions | 8 checks, byte-token transfer, four closed-book prompts | Unicode kept deliberately short; historical positional implementation caveat retained |
| 10 · Attention / QKV | SHALLOW | `The animal slept` problem; weighted read before QKV; Q=K=V comparison; dot-product rationale; explicit 3×3 A and numeric `Y₂`; Attention vs MLP; MHA shapes | Batched no-loop attention and MultiHeadAttention traced line-by-line | No V; attention weight is not a complete model explanation | 8 diagnostic checks, cross-length/identity-head transfers, five closed-book prompts | Does not claim real checkpoint heads learned the conceptual relations |
| 11 · Encoder / Decoder / Cross | SHALLOW | Full arithmetic encoder → masked prefix → cross-memory walkthrough; `[N,Ka,Kq]`; reversed-Q thought experiment | DecoderBlock call arguments and mask axes traced | No cross-attention, post-softmax mask, no residual | 8 checks, image-caption cross-attention transfer, closed-book flow | Historical DecoderBlock mismatch remains flagged rather than repaired |
| 12 · Seq2Seq Training | SHALLOW | Shift/mask/teacher forcing separated; parallel training vs sequential generation; `P(4)=.20` CE≈1.609 backward path to embeddings; parameter ledger | Real answer slicing and vocab projection traced | Shift without mask; mask without shift; tokenizer is not trainable | 8 checks, padding/loss masks and exposure transfer, closed-book backward trace | Does not hand-calculate every QKV derivative |
| 13 · Modern LLM | SHALLOW | `P(A|Q)=∏P(a_t|Q,a_<t)`; chat serialization; SFT answer-only loss mask; encoder–decoder vs decoder-only paths; generation loop | Historical SelfAttention skeleton mapped carefully to current decoder-only models | Loss on question; no role separators; loss mask ≠ attention mask | 7 checks, system/user/assistant and vocabulary-shape transfer | Modern comparison is explicitly CourseStack Explanation, not repository intent |
| 14 · VAE / GAN | SHALLOW | Numeric reparameterization; reconstruction/KL tension; GAN learning-signal path | A6 VAE/GAN snippets retained | No KL; perfect discriminator; GAN loss ≠ explicit likelihood | 5 checks, autoregressive-vs-latent transfer | Kept Optional Review; diffusion is outside historical repository scope |

## Interaction and UI changes

- Added diagnostic multiple-choice checks with per-option misconception feedback.
- Reused the existing lesson layout and sticky TOC generator; no parallel layout system was introduced.
- Added prose-first styles for worked examples, mechanism ledgers, counterfactuals, parameter ledgers, transfer questions, debug lenses, and closed-book explanations.
- Mobile remains single-column; shape flows and code blocks retain safe overflow behavior.
- EECS498 progress continues to use `coursestack:progress:eecs498:v1`, isolated from CS336.
- The root CourseStack catalog already reads EECS498 from `courses.json`; the no-JavaScript fallback now links to it explicitly as well.

## Provenance boundaries

- **Direct repository evidence:** linked functions, classes, Notebook metrics, datasets, checkpoints, and saved historical behavior.
- **CourseStack Explanation:** modern LLM comparison, conceptual attention patterns, counterfactuals, and transfer questions.
- **Historical caveats:** positional encoding behavior, DecoderBlock mismatch, incomplete SpatialBatchNorm/two-stage detector boundaries remain disclosed. Historical source files were not modified.

## QA status

- Content depth gate: PASS, 14/14 lessons.
- Stable source snapshot links: PASS.
- Transformer arithmetic thread 09–13: PASS.
- Homepage catalog and course-info lesson registration: PASS.
- Course-scoped progress script: PASS.
- JavaScript syntax / JSON parse / whitespace checks: PASS.
- Firefox/WebDriver desktop (1800px): no horizontal overflow; shared sticky TOC visible at 210px with 14 links.
- Firefox/WebDriver compact viewport: no horizontal overflow; diagnostic grid collapses to one column; TOC hidden; code blocks use horizontal scrolling.
- Root CourseStack homepage: EECS498 course card rendered from `courses.json`; course homepage rendered the map and all 14 lesson links.
- Diagnostic interaction: selecting the correct Attention answer rendered `正确。`; the course progress UI reports the isolated key `coursestack:progress:eecs498:v1`.
- Scoped code-block formatting check: PASS. The optional Python table checker could not run in this environment because `beautifulsoup4` is not installed; table rendering was covered by browser inspection instead.

## Remaining optional improvements

- Add rendered historical notebook figures only when a source image materially improves a mechanism explanation.
- Add answer persistence for concept checks if long-term quiz history becomes a product requirement; current checks are intentionally lightweight and local to the page session.
- Revisit P2 lessons for a second depth pass if vision/generative modeling becomes the user's next review focus.
