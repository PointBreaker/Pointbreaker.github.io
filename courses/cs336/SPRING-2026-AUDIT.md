# CS336 Spring 2026 official-source audit

Audit date: 2026-08-14

Primary sources:

- Official course schedule and lecture index: <https://cs336.stanford.edu/>
- `stanford-cs336/lectures` at `8b59b50` (2026-05-27)
- `assignment1-basics` at `a158843` (2026-04-07)
- `assignment2-systems` at `ca8bc81` (2026-05-01)
- `assignment3-scaling` at `03e9372` (2026-05-08)
- `assignment4-data` at `0555bea` (2026-05-07)
- `assignment5-alignment` at `c2734a2` (2026-06-04)

Status vocabulary: `MATCHED`, `PARTIAL`, `MISSING`, `OUTDATED`, `EXTRA_BUT_VALID`, `UNVERIFIABLE`.

## Lecture mapping

| Official Spring 2026 | PointBreaker lesson | Audit result |
| --- | --- | --- |
| Lecture 1 — Overview, tokenization | `0001-intro-tokenization.html` | MATCHED |
| Lecture 2 — PyTorch, resource accounting | `0002-pytorch-resource-accounting.html` | PARTIAL → patched FP4/NVFP4; existing 6PD, memory, Roofline, optimizer state, accumulation and checkpointing retained |
| Lecture 3 — Architectures, hyperparameters | `0003-architectures-hyperparameters.html` | MATCHED |
| Lecture 4 — Attention alternatives, mixture of experts | `0004-attention-alternatives-moe.html` | MATCHED |
| Lecture 5 — GPUs, TPUs | `0005-gpus.html` | PARTIAL → patched TPU/MXU execution model, JAX/XLA sharding context and Blackwell low-precision freshness |
| Lecture 6 — Kernels, Triton | `0006-kernels-triton.html` | PARTIAL → patched B200/sm100, TMEM, thread block clusters, distributed shared memory, occupancy and swizzling |
| Lecture 7 — Parallelism | `0007-parallelism.html` | PARTIAL → patched all-to-all and the complete PCIe/NVLink/HCA/InfiniBand/RDMA/RoCE/NCCL topology substrate |
| Lecture 8 — Parallelism | `0008-parallelism-2.html` | PARTIAL → patched SP/EP and FSDP×TP multidimensional parallelism plus overlap semantics |
| Lecture 9 — Scaling laws | `0009-scaling-laws.html` | MATCHED |
| Lecture 10 — Inference | `0010-inference.html` | PARTIAL → patched pruning, distillation and the current serving-engine landscape |
| Lecture 11 — Scaling laws | `0011-scaling-laws-details.html` | MATCHED |
| Lecture 12 — Evaluation | `0012-evaluation.html` | MATCHED |
| Lecture 13 — Data sources, datasets | `0013-data-sources.html` | MATCHED |
| Lecture 14 — Data filtering, deduplication | `0014-data-filtering-dedup.html` | MATCHED |
| Lecture 15 — Alignment: SFT/RLHF | `0015-alignment-sft-rlhf.html` | MATCHED |
| Lecture 16 — Alignment: RLVR | `0016-alignment-rlvr.html` | MATCHED |
| Lecture 17 — Multimodal models | `0017-alignment-rl.html` | MATCHED |
| Lecture 18 — Daniel Selsam guest lecture | `0018-guest-daniel-selsam.html` | UNVERIFIABLE — schedule only; page is explicitly a research-direction guide, not an official reconstruction |
| Lecture 19 — Dan Fu guest lecture | `0019-guest-dan-fu.html` | UNVERIFIABLE — schedule only; page is explicitly a research-direction guide, not an official reconstruction |

## Assignment mapping

| Official Spring 2026 | PointBreaker guide | Audit result |
| --- | --- | --- |
| Assignment 1 — Basics | `assignments/ass01-basics.html` | MATCHED; the current official repository still carries the retained Spring 2025 handout filename/content lineage |
| Assignment 2 — Systems | `assignments/ass02-systems.html` | OUTDATED → patched with the authoritative 27-problem Spring 2026 map, FSDP, 2D FSDP×TP, B200/TMA and leaderboard deltas; old detailed rows are marked legacy |
| Assignment 3 — Scaling | `assignments/ass03-scaling.html` | MATCHED |
| Assignment 4 — Data | `assignments/ass04-data.html` | MATCHED |
| Assignment 5 — Alignment | `assignments/ass05-alignment.html` | OUTDATED → patched with the authoritative 44-problem Spring 2026 main/safety map and the new GRPO/Dr. GRPO/RFT/MaxRL/GSPO interface split; old detailed rows are marked legacy |

## Known deviations and source boundaries

- Assignment 2 and Assignment 5 retain detailed Spring 2025 localizations as `EXTRA_BUT_VALID` legacy appendices. Their Spring 2026 problem maps are authoritative when names, tests, interfaces or hardware requirements differ.
- The new Assignment 2/5 delta sections summarize every current official problem id and the changed acceptance surface, but do not reproduce the official PDFs word for word.
- Lecture 18 and Lecture 19 cannot be verified beyond the official schedule because no public handout or trace was available in the audited source snapshot.
- PointBreaker contains supplemental explanations (for example, systolic-array intuition and deployment guidance). They are labeled as PointBreaker context and do not claim to be Stanford quotations.
- Code presentation was normalized separately from the source-content audit: malformed multiline inline code was promoted to real `<pre><code>` blocks, all assignment blocks now declare a language or `text`, and the CS336-only formatting layer is opt-in and failure-safe for explicitly supported languages.

## Conclusion

After this patch, it is reasonable to say that PointBreaker covers the verifiable core knowledge in Stanford CS336 Spring 2026, including the systems material that was previously weakest. This is not a claim of 100% identity: guest lectures remain unverifiable, and the detailed Assignment 2/5 legacy appendices are preserved rather than rewritten wholesale.
