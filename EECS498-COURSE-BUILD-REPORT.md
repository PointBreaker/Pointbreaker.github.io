# EECS498 Course Build Report

课程：**EECS498 · Deep Learning Revisited**  
副标题：**从我当年写过的代码，重新理解深度学习**  
源码快照：[`PointBreaker/EECS498@1b495ae`](https://github.com/PointBreaker/EECS498/tree/1b495ae8c4db1343a12a39ac626a0a84dcada300)

## Build summary

- CourseStack 路径：`courses/eecs498/`
- 课程首页：通用 CourseStack dashboard + EECS498 representation-flow course map
- Lessons：14（Transformer 拆为五个连续模块）
- Progress：`localStorage` key `coursestack:progress:eecs498:v1`，与 CS336 / 其他课程隔离
- Source links：固定 commit URL；关键实现使用稳定 line anchors
- Shared system：复用根目录 `assets/course/` typography、lesson hero、TOC、code formatting、pager 与 reading progress

## Lesson matrix

| Lesson | Source files | Concepts | User implementation referenced | Modern connection | Concept checks | Status |
|---|---|---|---|---|---:|---|
| 1 · Neural Networks Are Functions | A1 KNN; A2 linear/two-layer | data → hidden → scores → loss | distance kernels, SVM/softmax, two-layer forward | Transformer remains a parameterized function chain | 3 | Complete |
| 2 · Backprop & Graphs | A2 two-layer; A3 fully connected | chain rule, cache, VJP | manual layer backward and full-net gradients | autograd / Transformer backprop | 3 | Complete |
| 3 · Optimization | A3 FC/CNN | SGD, momentum, RMSProp, Adam, init, norm | four optimizers, dropout, BatchNorm/Kaiming sections | AdamW, optimizer memory, LayerNorm | 3 | Complete |
| 4 · CNN | A3 CNN; A4 PyTorch/ResNet | locality, sharing, receptive field, residual | Conv/Pool fwd+bwd, ConvNets, residual blocks | ViT patch structure | 3 | Complete |
| 5 · Vision representations | A4 visualization/style | saliency, adversarial, Gram, synthesis | saliency/attack/class-viz, style losses | LLM interpretability analogy | 3 | Complete |
| 6 · Detection | A5 detector | localization, dense prediction, proposals, NMS | completed one-stage detector | DETR/set prediction | 3 | Complete |
| 7 · RNN | A4 captioning | hidden state, recurrence, BPTT | RNN step/sequence, embedding, captioner | SSM / Transformer comparison | 3 | Complete |
| 8 · LSTM | A4 captioning | gates, cell state, spatial attention | LSTM + AttentionLSTM | direct-access bridge to attention | 3 | Complete |
| 9 · Transformer I | WI22 A5 py/ipynb/json | token, ID, embedding, position | token dict/preprocess/embedding/position | CS336 byte BPE | 3 | Complete |
| 10 · Transformer II | WI22 A5 transformers.py | Q/K/V, [K,K] routing, MHA | three attention kernels, Self/MHA | FlashAttention, MQA/GQA | 4 | Complete |
| 11 · Transformer III | WI22 A5 transformers.py/ipynb | encoder, decoder, cross, causal mask | blocks, LayerNorm, FFN, mask | encoder-decoder vs decoder-only | 4 | Complete |
| 12 · Transformer IV | WI22 A5 py/ipynb/pt/json | teacher forcing, seq2seq, CE, inference | full Transformer forward + saved training | next-token prediction | 4 | Complete |
| 13 · Transformer V | WI22 A5 | architecture comparison, scaling | MHA/Transformer core | GPT/Llama + CS336 systems bridge | 4 | Complete |
| 14 · VAE & GAN | A6 vae/gan/ipynb | latent variables, ELBO, adversarial learning | VAE/CVAE, reparameterization, FC/LS/DCGAN | diffusion/autoregressive contrast | 4 | Complete |

## Content origin labels

### Directly from repository

- Function/class names, short code excerpts, shapes explicitly documented or observed in source.
- Saved Notebook outputs: KNN / classifier / CNN results, attention implementation checks, Transformer 1.0000 small-set overfit and 0.8213 validation accuracy, VAE/GAN runs.
- Saved checkpoints and generated result images as execution evidence.
- Arithmetic example and 5,000-pair dataset facts from `two_digit_op.json`.

### CourseStack Explanation

- Representation-flow course map and concept-evolution ordering.
- Mental models such as “attention as dynamic information routing”.
- Q/K/V address/payload framing, shape-led diagrams, counterfactual explanations.
- Then-vs-now connections to BPE, GPT/Llama, KV cache, FlashAttention, AdamW, ViT/DETR and CS336.
- These explanations are not attributed to the user's historical intent.

### Assignment-provided material

- Unchanged docstrings/TODO prose, helpers, datasets and test expectations.
- Original zip archives used as skeleton baselines.
- WI22 A4 detection and WI22 A5 captioning alternate versions, which show no meaningful implementation diff.

## Historical caveats surfaced in lessons

1. `A1/pytorch101.py` has one remaining `pass`.
2. `A3/convolutional_networks.py` leaves SpatialBatchNorm methods incomplete.
3. `A5/two_stage_detector.py` is incomplete; only the one-stage implementation is presented as completed work.
4. The Transformer Notebook records DecoderBlock relative-error mismatches around 0.5 and a skeleton-bug note.
5. Historical sinusoidal position code collapses intended frequency bands despite passing the saved assignment check.
6. A4 class-visualization L2 update differs from the strict gradient of a conventional L2 penalty.

## QA gate

### Content

- [x] All 14 lessons include repository provenance.
- [x] Skeleton/helper text is not claimed as user implementation.
- [x] Transformer I–IV use the real arithmetic dataset and one recurring example.
- [x] Tokenizer → embedding → attention → encoder/decoder → loss/generation flow is complete.
- [x] Self-attention and cross-attention use one consistent Q/K/V view.
- [x] Historical implementation and CourseStack interpretation are visibly separated.
- [x] Every lesson begins with 30-Second Recall and contains 3–4 mechanism/shape concept checks.

### UI / architecture

- [x] Existing CourseStack dashboard and lesson design system reused.
- [x] Course map is reading-oriented and Transformer is visually highlighted.
- [x] Lesson TOC and previous/next pager supplied by shared `lesson-ui.js`.
- [x] Code blocks inherit shared horizontal scrolling and do not force page width.
- [x] Course-specific layouts collapse to one column on mobile.
- [x] Progress key is EECS498-scoped.
- [x] Headless Firefox desktop/mobile renders have `scrollWidth == clientWidth`; no page-level horizontal overflow.
- [x] Mobile TOC is hidden by the shared breakpoint; code/shape flows collapse or scroll inside their own container.

### Regression

- [x] No CS336 files changed.
- [x] No shared CourseStack components changed.
- [x] EECS498 source repository was read only; all learning-layer changes are in CourseStack.
- [x] Headless Firefox render, runtime progress/pager test, local-link crawl and 14-page HTTP smoke test passed.

## Build decisions

- Assignment order is retained only as provenance; lesson order follows representation evolution.
- Transformer receives five lessons and the course-map highlight, while CNN/RNN remain as necessary historical logic.
- Generative modeling remains as an Optional Review rather than being removed for the LLM emphasis.
- Source links target a fixed commit so line anchors remain stable.
