# EECS498 Code Audit

审计对象：[`PointBreaker/EECS498`](https://github.com/PointBreaker/EECS498/tree/1b495ae8c4db1343a12a39ac626a0a84dcada300)，审计快照 `1b495ae8c4db1343a12a39ac626a0a84dcada300`。

## 判定方法

- 仓库内的 `A1.zip`–`A6.zip` 与 `win22/A4.zip`、`win22/A5.zip` 被解压为 assignment skeleton 基线。
- 当前 `.py` / Notebook 与对应 zip 做逐文件差分；位于 TODO 区且相对基线新增的代码标为 **Implemented in repository**。
- Notebook 的已保存输出、`.pt` / `.pth` checkpoint、生成图片与 Git commit 记录作为完成度的第二层证据。
- 未改变的 helper、讲义 markdown、docstring 与 TODO 注释视为 **Assignment-provided skeleton / explanation**，不归因于用户。
- 本课程建立的机制解释与现代连接统一标为 **CourseStack Explanation**，不反推用户当年的主观想法。

## Module audit

| Module | Assignment | Notebook | Implementation file | Major concepts | Functions / classes implemented | Experiment / result | User-completed confidence | Potential lesson mapping |
|---|---|---|---|---|---|---|---|---|
| Tensor data | A1 | `pytorch101.ipynb` | `A1/pytorch101.py` | tensor, indexing, reshape, batched matmul | 多数 tensor exercise；`slice_assignment` 仍有 `pass` | Notebook 保存了 shape/value checks | High（zip diff）；单个练习 incomplete | L1 data + shape language |
| KNN baseline | A1 | `knn.ipynb` | `A1/knn.py` | distance, vectorization, CV | two/one/no-loop distance, `predict_labels`, `KnnClassifier`, cross-validation | best k=10；test 33.86% | High | L1: data is geometry before learning |
| Linear classifiers | A2 | `linear_classifier.ipynb` | `A2/linear_classifier.py` | scores, hinge/softmax loss, minibatch SGD, regularization | naive/vectorized SVM and softmax, sampling, train, predict, hyperparameter search | softmax test 38.85%；SVM/softmax checkpoints | High | L1–L3 |
| Two-layer net | A2 | `two_layer_net.ipynb` | `A2/two_layer_net.py` | affine, ReLU, softmax, manual gradients | forward/backward, training loop, prediction, search | best val 53.56%；test 53.59%；`nn_best_model.pt` | High | L1–L2 |
| Fully connected nets | A3 | `fully_connected_networks.ipynb` | `A3/fully_connected_networks.py` | modular layers, caches, deep nets, dropout, optimizers | `Linear`, `ReLU`, two/deep nets, SGD momentum, RMSProp, Adam, Dropout | saved two/five-layer checkpoints; dropout runs in Notebook | High | L2–L3 |
| CNN from scratch | A3 | `convolutional_networks.ipynb` | `A3/convolutional_networks.py` | convolution, pooling, receptive field, deep CNN, normalization | naive Conv/Pool fwd+bwd, ThreeLayerConvNet, DeepConvNet, Kaiming, BatchNorm | best run val 73.09%, test 72.76% | High, with caveat | L3–L4 |
| CNN caveat | A3 | same | same | correctness boundaries | `SpatialBatchNorm.forward/backward` still `pass`; handwritten Conv backward is historical and shape-assumption-heavy | Notebook later uses fast/autograd-backed paths | Certain caveat | Historical implementation note in L3–L4 |
| PyTorch / ResNet | A4 | `pytorch_autograd_and_nn.ipynb` | `A4/pytorch_autograd_and_nn.py` | autograd, modules, Sequential, residual paths | functional 3-layer CNN, `nn.Module` version, Plain/Residual/Bottleneck blocks, ResNet | saved training outputs and `pytorch_autograd_and_nn.pkl` | High | L2, L4 |
| Captioning RNN | A4 | `rnn_lstm_attention_captioning.ipynb` | `A4/rnn_lstm_attention_captioning.py` | recurrence, hidden state, BPTT, embeddings, captioning | RNN step/sequence fwd+bwd, embedding, temporal CE, CaptioningRNN train/sample | captioning training output saved | High | L7 |
| Captioning LSTM + attention | A4 | same | same | gated memory, spatial attention | LSTM step/sequence, dot-product attention, AttentionLSTM, attention sampling | attention run reaches epoch 59 loss 0.6881; attention visual outputs in Notebook | High | L8 + bridge to L10 |
| Vision interpretation | A4 | `network_visualization.ipynb` | `A4/network_visualization.py` | saliency, adversarial attack, class visualization | saliency gradients, targeted update loop, class visualization step | four result JPGs including saliency/adversarial/class viz/feature inversion | High; implementation caveat for class objective | L5 |
| Style transfer | A4 | `style_transfer.ipynb` | `A4/style_transfer.py` | feature loss, Gram matrix, TV regularization | content loss, Gram, style loss, TV loss | `style_transfer_result.jpg`, multiple completed 200-step runs | High | L5 |
| One-stage detection | A5 | `single_stage_detector_yolo.ipynb` | `A5/single_stage_detector.py` | anchors, proposals, IoU, dense heads, NMS | anchor/proposal generation, IoU, prediction head, loss path, inference, NMS | `yolo_detector.pt`; epoch loss 0.1430; result cells saved | High, historical inference caveat | L6 |
| Two-stage detection | A5 | `two_stage_detector_faster_rcnn.ipynb` | `A5/two_stage_detector.py` | RPN, proposal/classification split | proposal-layer `__init__` changed; most required forwards remain `pass` | no completed experiment output | Low / incomplete | L6 contrast only; explicitly not claimed complete |
| WI22 detection alternate | WI22 A4 | `one_stage_detector.ipynb`, `two_stage_detector.ipynb` | `win22/A4/*.py` | FCOS/FPN/Faster R-CNN skeleton | No meaningful diff from provided zip | source JSON present; no completed implementation evidence | None | Provenance caveat, not user implementation |
| WI22 RNN alternate | WI22 A5 | `rnn_lstm_captioning.ipynb` | `win22/A5/rnn_lstm_captioning.py` | newer captioning skeleton | No meaningful diff from provided zip | no completion evidence | None | Use A4 implementation instead |
| Transformer mechanism | WI22 A5 | `Transformers.ipynb` | `win22/A5/transformers.py` | tokenization, QKV, attention, MHA, LayerNorm, FFN, encoder/decoder, masks, position | `generate_token_dict`, `prepocess_input_sequence`, three attention kernels, `SelfAttention`, `MultiHeadAttention`, `LayerNormalization`, `FeedForwardBlock`, `EncoderBlock`, mask, `DecoderBlock`, position encodings, `Transformer.forward` | implementation checks mostly ~1e-6; causal mask exact | High | L9–L13 |
| Transformer training | WI22 A5 | `Transformers.ipynb` | `transformers.py`, `a5_helper.py`, `two_digit_op.json` | teacher forcing, conditional autoregression, CE, warmup | full training configuration and saved checkpoint | 5,000 pairs; overfit acc 1.0000; final validation acc 0.8213; `transformer.pt` | High | L12 |
| Transformer caveat | WI22 A5 | `Transformers.ipynb` | `win22/A5/transformers.py` | decoder validation, position encoding | DecoderBlock saved checks show errors 0.5016 / 0.4971 with note “I think the bug is with the skeleton”; sinusoidal denominator code collapses frequencies because of `floor(a / M)` | final model nevertheless trained and saved | Certain historical caveat | L11–L12 Historical note |
| VAE / CVAE | A6 | `variational_autoencoders.ipynb` | `A6/vae.py` | latent variables, reparameterization, ELBO | VAE/CVAE encoder-decoder, reparameterize, reconstruction+KL loss | `vae_generation.jpg`, `conditional_vae_generation.jpg`; saved 10-epoch losses | High | L14 optional review |
| GAN family | A6 | `generative_adversarial_networks.ipynb` | `A6/gan.py` | minimax training, BCE, LSGAN, DCGAN | noise, FC G/D, BCE and LS losses, Adam, conv G/D | all loss tests passed; FC/LS/DC result JPGs | High | L14 optional review |

## Skeleton and helper inventory

- `eecs598/` utilities, `a*_helper.py`, solver/data/submit/vis modules are predominantly course-provided infrastructure unless a diff says otherwise.
- Zips are retained historical baselines, not additional completed implementations.
- `two_digit_op.json` contains 5,000 fixed arithmetic input/output pairs and is assignment data, not user-authored data.
- Checkpoints and result images are experiment artifacts and strong evidence that a path ran; they do not prove every surrounding function was authored or correct.

## Historical implementation notes

1. `A1/pytorch101.py` retains one explicit `pass` inside `slice_assignment`.
2. `A3/convolutional_networks.py` retains incomplete SpatialBatchNorm methods; the course only attributes the filled BatchNorm and CNN sections.
3. `A5/two_stage_detector.py` is incomplete. The review teaches the two-stage mental model, but identifies the completed one-stage detector as the code-backed implementation.
4. `win22/A4` and the WI22 captioning files are alternate skeletons, not completed work.
5. The Transformer Notebook records a DecoderBlock check mismatch and a skeleton-bug hypothesis. CourseStack preserves that observation without silently rewriting history.
6. The sinusoidal position implementation passes the provided saved check, but its use of `floor(a / M)` makes every tested frequency band identical. A strict modern implementation uses exponent `2i / M` without that collapse.

## Course map decision

`Data → Representation → Differentiable computation → Optimization → Spatial structure → Structured prediction → Sequence structure → Attention → Transformer → Generation`

Assignment numbers are provenance only. The 14-lesson course follows the evolution of representation and information flow.
