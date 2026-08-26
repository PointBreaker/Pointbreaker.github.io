(function () {
  const bank = window.CS336PracticeBank;
  if (!bank) return;
  const q = (prompt, options, answer, explanations, followUp) =>
    [prompt, options, answer, explanations, followUp];

  Object.assign(bank, {
    '0011': {
      before: [
        ['log-log 图上的直线对应什么关系？', '对应幂律。若 \\(y=ax^b\\)，则 \\(\\log y=\\log a+b\\log x\\)，斜率是指数 \\(b\\)。'],
        ['parameter 与 hyperparameter 在拟合中分别是什么？', 'parameter 是由观测数据估出的系数；hyperparameter 是训练或拟合前设定的选择。'],
        ['为什么要保留最大的 runs 做 holdout？', '它模拟真正关心的“向更大规模外推”，比随机切分更能暴露函数形式错误。']
      ],
      sections: [
        { before: 'fitting', label: 'fit objective', question: q(
          '对 loss 直接做 NLLS 与对 log(loss) 做线性回归，为什么不完全等价？',
          ['两者隐含的误差权重不同', '因为 log 不能用于正数', 'NLLS 不拟合参数', '二者永远给相同系数'], 0,
          ['正确。log-space 更接近相对误差，原空间更重视绝对误差。', 'loss 为正时可以取 log。', 'NLLS 正是在拟合参数。', '只有特殊噪声/数据下才可能接近。'],
          q('小 loss 点在 log-space 中被放大，最该检查什么？', ['误差模型是否与测量噪声匹配', 'token ID 是否连续', 'GPU 是否有 KV cache', 'BPE rank'], 0,
            ['正确。选择目标函数就是选择怎样看待误差。', '无关。', '不是拟合统计问题。', '无关。'])) },
        { before: 'noise', label: 'residual 与 uncertainty', question: q(
          '小模型 residual 全正、大模型全负，但平均为 0。应如何判断？',
          ['fit 很好，因为均值为 0', '存在随规模变化的系统偏差', '只需增加小数位', '说明 bootstrap 无效'], 1,
          ['均值抵消会隐藏结构。', '正确。函数形式或 regime 假设可能错。', '显示精度不修复模型。', '无需由此否定 bootstrap。'],
          q('若 residual 围绕 0 随机散布且无明显尺度趋势，说明什么？', ['至少没有同样明显的结构性漏项', '证明外推必然正确', '证明数据无噪声', '指数是 exact constant'], 0,
            ['正确，但仍需 holdout 和不确定性。', '观测区间拟合好不保证远外推。', '随机 residual 正说明仍有噪声。', '经验指数会依条件变化。'])) },
        { before: 'extrapolation', label: '外推距离', question: q(
          '最大观测模型是 1B，目标是 1T。这是多少倍外推？',
          ['3×', '100×', '1000×', '1,000,000×'], 2,
          ['混淆了 log10 decade 数与倍数。', '少一个数量级。', '正确：\\(10^{12}/10^9=10^3\\)。', '多算了三个数量级。'],
          q('若最大观测点改为 10B，目标仍 1T，外推倍数是多少？', ['10×', '100×', '1000×', '10000×'], 1,
            ['1T/10B 不是 10。', '正确。', '这是从 1B 出发。', '过大。'])) },
        { before: 'decision', label: 'decision boundary', question: q(
          '训练 loss 最优的模型为什么不一定是产品总成本最优？',
          ['部署还会重复支付 inference memory、latency 与 compute', '训练 loss 不可测', '参数量不影响推理', '服务请求不消耗 token'], 0,
          ['正确。lifetime objective 不只含一次训练。', 'loss 可测但只是一个目标。', '参数直接影响权重读取和容量。', '每次请求都会产生工作。'],
          q('若模型要服务极大量 tokens，更可能偏向哪种方案？', ['更小模型、适度 overtrain，并联合验证质量', '只选最大 N', '完全忽略 D', '让 inference cost 为 0'], 0,
            ['正确。用更多一次性训练换更低重复服务成本可能合理。', '未计生命周期。', 'D 影响质量。', '不现实。'])) }
      ],
      deep: [
        q('哪项是 scaling-law fit 的 parameter？', ['学习率 schedule', '幂律指数 α', 'batch size', '训练步数'], 1, ['这些是训练设置。', '正确，由观测拟合。', '这是 hyperparameter。', '这是实验设置。']),
        q('置信区间很窄能否证明函数形式正确？', ['能', '不能；它只描述给定模型/采样假设下的不确定性', '只有 R² 低时不能', '参数多就能'], 1, ['窄但有偏仍会稳定地错。', '正确。model misspecification 是另一层风险。', 'R² 也不充分。', '更多参数还可能过拟合。']),
        q('幂律指数估错 0.02，在 1000× 外推时为什么值得担心？', ['误差会通过幂指数累计放大', '指数只影响单位', '外推倍数与指数无关', '只会改变 token ID'], 0, ['正确。小斜率偏差跨多个 decade 会累积。', '指数决定缩放速度。', '强相关。', '无关。']),
        q('一个模型在随机 holdout 好、最大规模 holdout 差，最可能说明什么？', ['局部插值可行，但外推结构不可靠', '最大 run 必然数据错', '应该只保留随机 holdout', '幂律成为 exact'], 0, ['正确。目标是外推时应按规模留出。', '不能先假定。', '会掩盖目标风险。', '相反。']),
        q('换 architecture 与 data mixture 后直接沿用旧系数，属于什么错误？', ['把条件化经验规律当普遍定律', '正确迁移', 'Exact identity', '只改变图表颜色'], 0, ['正确。必须重新校准或至少做验证 runs。', '缺乏证据。', '不是恒等式。', '实际 regime 已变。'])
      ],
      open: [
        ['不用公式表，解释为什么 residual pattern 比单个 R² 更有诊断力。', 'R² 汇总整体拟合；residual 随规模、数据域或 compute 有结构时，会暴露漏项、弯曲和 regime shift。'],
        ['设计一次 pseudo-extrapolation。', '只用较小 runs 拟合，保留最大的若干 runs；预测它们并检查误差/覆盖率，再决定是否相信更远外推。'],
        ['解释训练-optimal 与 lifetime-cost-optimal 的差别。', '前者最小化固定训练预算下 loss；后者还计大量重复 inference、latency、memory 和服务约束。']
      ]
    },

    '0012': {
      before: [
        ['construct、item、scorer 分别是什么？', 'construct 是想测的能力；item 是具体输入；scorer 把输出映射成分数。'],
        ['PPL 为什么和 tokenizer 有关？', '它对 token event 的平均 NLL 取指数；token 边界变化会改变事件空间和分母。'],
        ['capability 与 propensity 有什么区别？', 'capability 问模型在合适条件下能否做到；propensity 问它在给定提示/环境下倾向做什么。']
      ],
      sections: [
        { before: 'perplexity', label: 'NLL → PPL', question: q(
          '两个正确 token 概率为 0.5、0.25，PPL 最接近多少？',
          ['1.33', '2.00', '2.83', '4.00'], 2,
          ['这是概率和的倒数附近。', '漏了几何平均。', '正确：\\(\\sqrt{1/(0.5·0.25)}\\approx2.83\\)。', '这是只看 0.25 的倒数。'],
          q('若两个概率都为 0.25，PPL 是多少？', ['2', '4', '8', '16'], 1,
            ['对应概率 0.5。', '正确，平均 NLL 的指数等于 1/0.25。', '多一倍。', '误把两个倒数相乘。'])) },
        { before: 'lm-as-judge', label: 'judge bias', question: q(
          'Judge 总偏好更长答案，模型 A 比 B 更冗长。裸胜率最可能混入什么？',
          ['verbosity bias', 'tokenizer fallback', 'gradient sharding', 'roofline ridge'], 0,
          ['正确。长度成为质量之外的混杂因素。', '无关。', '训练系统概念。', '硬件概念。'],
          q('把答案顺序随机交换，主要检测哪类 judge bias？', ['position bias', 'copyright risk', 'PPL tokenization', 'data epoch'], 0,
            ['正确。若交换后偏好翻转，位置影响显著。', '不是该实验。', '无关。', '无关。'])) },
        { before: 'validity', label: 'contamination', question: q(
          '模型训练时见过 benchmark 答案，测试高分首先破坏什么解释？',
          ['高分代表可迁移能力', '分数可计算', 'item 有文本', 'GPU 能运行'], 0,
          ['正确。记忆可伪装成泛化。', '仍能算分。', '仍存在。', '无关。'],
          q('用训练截止日期之后发布的数据做测试，主要想降低什么？', ['train-test overlap', 'attention FLOPs', 'KV cache', 'judge latency'], 0,
            ['正确，时间切分是 contamination audit 的一种手段。', '不改变模型计算。', '不直接改变。', '不是主要目标。'])) },
        { before: 'test-time-compute', label: 'compute trade-off', question: q(
          'self-consistency 采样 32 条 reasoning 后投票，主要交换了什么？',
          ['更多 inference compute 换更高成功概率', '更大 training D 换更小 vocab', 'KV cache 换 optimizer state', '参数变为 32 倍'], 0,
          ['正确。模型参数不变，测试时工作量增加。', '不是训练。', '无关。', '只是运行 32 个样本。'],
          q('若所有 32 条 reasoning 高度相关且同错，继续采样的边际收益怎样？', ['可能很低', '必然线性提高', '参数自动增加', 'PPL 归零'], 0,
            ['正确。多样性和 verifier 质量决定收益。', '相关错误不能靠数量消除。', '参数不变。', '无关。'])) }
      ],
      deep: [
        q('哪条链最完整？', ['benchmark→真相', 'construct→items→protocol→scorer→aggregate→claim', 'prompt→accuracy', 'judge→能力'], 1, ['跳过测量设计。', '正确。每个箭头都可能引入偏差。', '过度简化。', 'judge 只是 scorer。']),
        q('不同 tokenizer 的 token-level PPL 能否裸比？', ['能，都是指数', '不能，event space 与 token count 不同', '只要模型参数一样就能', '中文时能'], 1, ['数学形式相同不代表事件相同。', '正确。应使用可比单位或固定 tokenizer。', '参数无关。', '语言不修复。']),
        q('一个 benchmark 平均分提高，但某关键 subgroup 显著下降。最好的报告方式是？', ['只报平均分', '同时报 subgroup、样本量与不确定性', '删除 subgroup', '把下降记为噪声'], 1, ['会掩盖风险。', '正确。aggregate 不应覆盖异质性。', '不可取。', '需证据。']),
        q('prompt formatting 改动让分数差 15 分，说明什么？', ['protocol sensitivity 是测量的一部分', '模型参数变化', 'benchmark 无 item', 'PPL 是 exact'], 0, ['正确。结论应绑定 prompt/protocol。', '权重未变。', '仍有 item。', '无关。']),
        q('LM judge 与人类偏好一致率高，能否直接当 safety evaluator？', ['能，任何 construct 通用', '不能；需针对 safety construct 校准、攻击与独立验证', '只需更长 prompt', '只要 judge 更大'], 1, ['不同 construct 不能自动迁移。', '正确。', '不充分。', '规模不消除偏差。'])
      ],
      open: [
        ['为“代码助手可靠性”画 construct→claim 测量链。', '定义真实任务与失败成本，再选 repository-level items、执行 tests/静态检查、汇总成功率与 subgroup，最后限定 claim。'],
        ['解释为什么 benchmark 高分既可能高估也可能低估能力。', 'contamination/judge bias 会高估；prompt mismatch、scorer 过窄或任务分布不代表真实使用会低估。'],
        ['不用公式，解释 perplexity 的直觉与比较边界。', '它是模型对正确 token 的平均“有效分支数”；只有 tokenization 与评估约定一致时才可直接横比。']
      ]
    },

    '0013': {
      before: [
        ['WARC、document、token 是同一对象吗？', '不是。WARC 是抓取容器；抽取后得到 records/documents；tokenizer 再产生 tokens。'],
        ['按 document 混合与按 token 混合为什么不同？', '长文档在 token-weighted mixture 中贡献更大；document-weighted 先让文档等权。'],
        ['provenance 解决什么问题？', '记录来源、版本、处理链与许可，支持复现、审计和删除。']
      ],
      sections: [
        { before: 'pipeline', label: 'storage → D', question: q(
          '100GB 压缩 WARC 能直接令 6PD 的 D=100B 吗？',
          ['能，GB 与 token 等价', '不能，要经过抽取、过滤、去重、tokenize 并累计 epochs', '只需除以参数 P', '只需看 URL 数'], 1,
          ['混淆 bytes 与 tokens。', '正确。D 是 processed training tokens。', '无此换算。', 'URL 与文本长度不同。'],
          q('过滤后有 20B tokens，训练 3 epochs，D 是多少？', ['20B', '23B', '60B', '取决于文件 GB'], 2,
            ['只数 unique corpus。', '错误相加。', '正确。每次处理都计入 compute。', 'token count 已给出。'])) },
        { before: 'web-sources', label: 'snapshot 与 extraction', question: q(
          '同一 URL 在两个 crawl dates 内容不同，provenance 最少应保留什么？',
          ['只保留域名', 'snapshot/time 与原始 record 标识', '只保留最终 token IDs', '只保留长度'], 1,
          ['无法区分版本。', '正确。来源必须定位到具体快照。', '丢失原始可追溯性。', '不足。'],
          q('重新使用更好的 HTML extractor，为什么需要原始 WARC？', ['抽取是有损步骤，只有原始响应能重做', 'token IDs 能还原 DOM', '模型权重保存网页', 'WET 总比 WARC 完整'], 0,
            ['正确。', '通常不能还原结构。', '不成立。', '方向相反。'])) },
        { before: 'copyright', label: 'license boundary', question: q(
          '看到网页公开访问，能否直接推出可无条件训练并再分发？',
          ['能，公开=public domain', '不能；访问、版权、许可、隐私与司法辖区是不同问题', '只要模型小就能', '只要去重就能'], 1,
          ['公开可读不等于权利放弃。', '正确。需要具体法律/政策审查。', '规模不改变权利。', '去重不授予许可。'],
          q('数据删除请求最依赖哪项工程能力？', ['可追踪 source→derived artifacts 的 lineage', '更大 batch', '更小 KV cache', '更高 MFU'], 0,
            ['正确。没有 lineage 很难定位衍生数据。', '无关。', '无关。', '无关。'])) },
        { before: 'exploration', label: 'mixture audit', question: q(
          '一个来源占 documents 的 10%，但文档平均长度是其他域的 20×。按 token 采样时会怎样？',
          ['仍必然只占 10%', '若不重加权，token 贡献可能远高于 10%', '自动被 tokenizer 删除', '只影响文件名'], 1,
          ['忽略长度。', '正确。mixture 的分母必须写清。', '不会。', '影响训练分布。'],
          q('要验证实际训练 mixture，最该记录什么？', ['每域 sampled processed tokens', '每域文件颜色', 'URL 字符数', 'GPU 温度'], 0,
            ['正确。它直接对应模型消费量。', '无关。', '不是 mixture 权重。', '系统指标不替代。'])) }
      ],
      deep: [
        q('source、snapshot、record、document、token 的正确方向是？', ['token→网页→WARC', 'source→snapshot→record→extracted document→token', 'document→license→GPU', 'URL→parameter'], 1, ['方向反了。', '正确。', '对象链不完整。', '无关。']),
        q('更多数据源为何可能降低质量？', ['会引入重复、模板、隐私、污染与分布偏差', '来源越多 token 越少', '模型不能读网页', 'BPE 只能一域'], 0, ['正确。quantity 与 utility/risk 分账。', '不成立。', '抽取后可训练。', '不成立。']),
        q('训练数据 2 epochs，compute accounting 与数据价值应怎样描述？', ['D 翻倍，第二遍价值可能低于新 token', 'D 不变且价值相同', 'D 变 GB', '只参数 P 翻倍'], 0, ['正确。工作量与信息增益不同。', '重复仍计算。', '单位错。', '参数不变。']),
        q('benchmark contamination 最早可能在哪一环进入？', ['source collection 或后续拼接任何环节', '只在 optimizer step', '只在 inference', '只在 GPU HBM'], 0, ['正确，应全链路审计。', '太晚。', '训练已污染。', '无关。']),
        q('一个可复现 data recipe 最少还需什么，不能只有最终 tar 文件？', ['版本化 manifest、source IDs、transform configs 与 counts', '模型 logo', '一张总大小截图', '单个随机 seed'], 0, ['正确。', '无关。', '不足。', 'seed 只是部分。'])
      ],
      open: [
        ['从 100GB WARC 口述得到训练 D 的完整链。', '解压/解析→抽取 text→过滤→去重→tokenize→mixture sampling→乘实际 epochs，并逐步记录 counts。'],
        ['解释为什么 provenance 同时是科研和治理基础设施。', '科研需要复现 recipe；治理需要定位许可、隐私、删除与 contamination 的来源和衍生物。'],
        ['构造 document-weighted 与 token-weighted mixture 不同的 toy example。', '一域 1 篇 1000-token 文，另一域 10 篇各 10-token；按文档与按 token 会给出完全不同权重。']
      ]
    },

    '0014': {
      before: [
        ['Jaccard 相似度怎样计算？', '集合交集大小除以并集大小：\\(|A∩B|/|A∪B|\\)。'],
        ['false positive 对过滤器意味着什么？', '本应保留的数据被错误删除；false negative 则是不该保留的数据漏过。'],
        ['MinHash 在估计什么？', '估计两个 shingle sets 的 Jaccard，相同最小 hash 的概率等于 Jaccard。']
      ],
      sections: [
        { before: 'html-extraction', label: 'extraction loss', question: q(
          'HTML extractor 把导航和正文混在一起，后续质量 classifier 可能怎样？',
          ['把提取噪声当内容质量信号', '自动恢复 DOM', '不受任何影响', '只改变 token ID 顺序'], 0,
          ['正确。上游 extraction 会污染下游判断。', 'classifier 不恢复结构。', '输入已变。', '还会改变文本内容。'],
          q('同一过滤器换 extractor 后 retained rate 大变，首先说明什么？', ['pipeline components 相互依赖，需重新校准', '过滤器是 exact truth', '数据量 P 改变', 'GPU 网络坏了'], 0,
            ['正确。处理顺序/输入分布是 specification。', '恰好相反。', 'P 是参数量。', '无关。'])) },
        { before: 'filtering-algorithms', label: 'classifier errors', question: q(
          '百科风格 quality classifier 删除大量口语和方言，属于什么风险？',
          ['subgroup false positives 与分布变窄', 'KV cache overflow', 'all-reduce error', 'BPE longest-match'], 0,
          ['正确。clean score 不等于目标覆盖。', '无关。', '无关。', '无关。'],
          q('降低 classifier threshold 通常怎样移动 trade-off？', ['保留更多，false positives 减少但 false negatives 可能增加', '所有错误都减少', '只改变 FLOPs', '阈值与结果无关'], 0,
            ['正确，这里的 positive 指“删除/拒绝”需按页面定义核对。', '通常不能同时免费改善。', '首先改变数据选择。', '直接相关。'])) },
        { before: 'deduplication', label: 'Jaccard / MinHash', question: q(
          'A={a,b,c}，B={a,b,d}，Jaccard 是多少？',
          ['1/4', '1/2', '2/3', '1'], 1,
          ['交集是 2。', '正确：交集 2，并集 4。', '误用交集/单集合大小。', '集合不相同。'],
          q('A={x,y}，B={x,y,z}，Jaccard 是多少？', ['1/3', '1/2', '2/3', '1'], 2,
            ['交集不是 1。', '并集不是 4。', '正确。', '多一个 z。'])) },
        { before: 'data-mixing', label: 'dedup boundary', question: q(
          '增加 MinHash 数量能否修复错误的 shingle size 或 threshold？',
          ['能，hash 越多语义越准', '不能，只降低 Jaccard 估计方差', '能，自动学语义', '只要 Bloom filter 同时开启'], 1,
          ['仍在估计错误定义。', '正确。estimator accuracy 与 target definition 分开。', 'MinHash 不理解语义。', 'Bloom 也不修定义。'],
          q('near-dedup 后保留 cluster representative，为什么 selection rule 重要？', ['它决定最终保留哪个域/质量/时间版本', 'cluster 内文档完全同一', '只影响文件名', '不会影响训练分布'], 0,
            ['正确。代表选择会改变分布。', 'near duplicates 并非 exact same。', '内容被选择。', '会影响。'])) }
      ],
      deep: [
        q('Bloom filter false positive 对 exact dedup pipeline 可能造成什么？', ['把未见文档误判为已见并删除', '让重复全部通过', '提高 Jaccard', '增加模型参数'], 0, ['正确。', '这是 false negative 方向。', '不同机制。', '无关。']),
        q('shingle 太小的主要风险是？', ['常见短片段让无关文档看起来相似', '永远检测不到模板', 'hash 无法计算', 'tokenizer 失效'], 0, ['正确。', '方向相反。', '仍可 hash。', '无关。']),
        q('先过滤再去重与先去重再过滤为什么结果可能不同？', ['代表文档和 classifier 输入集合会改变', '集合运算永远可交换', '只有 GPU 不同', '过滤不删除数据'], 0, ['正确。pipeline order 是 recipe 一部分。', '这些操作通常不交换。', '不是主要原因。', '过滤会删除。']),
        q('去重 retained ratio 很低能否证明质量更高？', ['能', '不能；还需样本审计、覆盖与下游 eval', '只要低于 50% 能', '只需看 hash 数'], 1, ['删除多可能误删。', '正确。', '无通用阈值。', '不充分。']),
        q('DSIR 改变的核心对象是什么？', ['从候选数据到目标分布的重要性权重/采样概率', 'KV heads', 'optimizer moments', 'merge rank'], 0, ['正确。', '无关。', '无关。', '无关。'])
      ],
      open: [
        ['设计一次 dedup threshold audit。', '抽样 threshold 两侧 pairs，人工标注 exact/near/template/unrelated，报告 precision/recall 与 subgroup，再看下游训练。'],
        ['解释 MinHash 为什么不是“语义去重”。', '它近似 shingle-set Jaccard；语义只会通过 normalization/shingle 设计间接体现。'],
        ['给“过滤越严质量越高”一个反例。', '百科 classifier 删除方言、代码或对话，cleanliness 上升但目标 domain coverage 和能力下降。']
      ]
    },

    '0015': {
      before: [
        ['SFT 的 prompt 与 response 在 loss 中角色相同吗？', '通常 prompt 是条件，response tokens 才是主要 imitation target；需要显式 loss mask。'],
        ['preference pair 包含什么？', '同一 prompt 下 chosen 与 rejected responses，以及偏好来源/标注协议。'],
        ['KL penalty 在 RLHF 中约束什么？', '限制新 policy 偏离 reference policy 的程度，但不是事实或安全保证。']
      ],
      sections: [
        { before: 'sft', label: 'loss mask', question: q(
          'prompt 900 tokens、response 100 tokens。全部 token 等权算 loss，哪部分更可能主导？',
          ['response，因为更重要', 'prompt reconstruction，因为位置多 9×', '两者严格相同', '由 KV cache 决定'], 1,
          ['重要性不会自动进入 loss。', '正确。mask 决定哪些 positions 是 target。', '位置数不同。', '无关。'],
          q('response-only mask 下 prompt tokens 是否完全没用？', ['是，模型看不到 prompt', '否，它们作为条件参与 forward，只是不计目标 loss', '只用于 tokenizer training', '只在 optimizer 中出现'], 1,
            ['mask loss 不等于 mask attention。', '正确。', '不是。', '不是。'])) },
        { before: 'preference-data', label: 'preference semantics', question: q(
          'chosen 胜过 rejected，能否推出 chosen 是客观真理？',
          ['能', '不能，只表示给定协议/标注者下的相对偏好', '只要 unanimous 就能', '模型大时能'], 1,
          ['偏好不是绝对真值。', '正确。', '一致也可能共享偏差。', '规模不改变标签语义。'],
          q('若标注者系统性偏爱冗长答案，reward model 可能学到什么？', ['verbosity shortcut', '更小 KV', '更高 MFU', 'BPE fallback'], 0,
            ['正确。它会优化可预测偏好信号。', '无关。', '无关。', '无关。'])) },
        { before: 'rlhf-challenges', label: 'KL boundary', question: q(
          'KL penalty 很强通常会怎样？',
          ['policy 更接近 reference，但可改善空间受限', '保证输出真实', '删除 reward model', '让 gradient 为零在所有情况'], 0,
          ['正确。它是偏移—优化 trade-off。', 'KL 不检查事实。', '仍需 reward/目标。', '不一定。'],
          q('KL 很弱的典型风险是什么？', ['policy exploit reward model 并远离有用行为', '模型无法更新', 'prompt 变短', 'PPL 必为 1'], 0,
            ['正确。约束不足会放大 reward hacking。', '恰好更容易大更新。', '无直接关系。', '不成立。'])) },
        { before: 'practical', label: 'independent eval', question: q(
          '训练 reward 上升但独立 human eval 下降，最合理诊断是？',
          ['目标被 exploit 或 reward model 泛化失败', '训练必然成功', 'human eval 无效', 'optimizer state 太小'], 0,
          ['正确。proxy 与真实目标脱钩。', 'reward 只是 proxy。', '需调查，不能直接否定。', '没有直接证据。'],
          q('修正后最关键的验证是什么？', ['使用未参与训练的 prompts、judges/人类与具体 failure slices', '继续只看训练 reward', '增加模型名字长度', '删除 rejected data'], 0,
            ['正确。独立性避免同一偏差闭环。', '无法发现 exploit。', '无关。', '会损失对比信号。'])) }
      ],
      deep: [
        q('SFT、reward modeling、policy optimization 的对象顺序是？', ['demonstrations→preference model→policy rollouts/update', 'KV→BPE→WARC', 'optimizer→tokenizer→judge', 'proof→kernel→SFT'], 0, ['正确。', '无关。', '顺序错误。', '无关。']),
        q('KL divergence 低能否推出 policy 安全？', ['能', '不能，只说明接近 reference distribution', '只在 batch 大时能', '只在 BF16 能'], 1, ['reference 本身也可能不安全。', '正确。', '无关。', '无关。']),
        q('DPO 类目标为什么仍依赖 preference data quality？', ['目标直接从 chosen/rejected 对构造', '它不使用数据', '只依赖 GPU', '偏好会被自动纠正'], 0, ['正确。objective 简化不消除 label bias。', '错误。', '无关。', '没有保证。']),
        q('reward hacking 的最准确定义是？', ['优化 proxy 得高分却偏离真实意图', 'reward 数值低', '模型参数多', 'response 太短'], 0, ['正确。', '低分不是 exploit。', '无关。', '可能是表现但非定义。']),
        q('为什么 alignment 评估要同时看 helpfulness 与 failure slices？', ['平均收益可能掩盖 safety、bias 或拒答过度', '只为增加表格', '两者必相同', '因为 PPL 不可算'], 0, ['正确。多目标不能只用单均值。', '不是。', '会权衡。', '不是原因。'])
      ],
      open: [
        ['画出 SFT→preference→policy update 的数据对象流。', 'demonstration 得 SFT policy；同 prompt 多 responses 得 preference pairs；reward/直接偏好目标再更新 policy，并用 reference/KL 约束。'],
        ['解释为什么 response-only loss mask 不会让模型忽略 prompt。', 'prompt 仍进入 causal context 并改变 hidden states；只是其位置不作为要重建的 target。'],
        ['构造一个 reward hacking 例子和独立验证。', 'judge 偏爱长答案→policy 注水；用长度匹配的 blind human eval 与简洁性 slice 检验。']
      ]
    },

    '0016': {
      before: [
        ['rollout、reward、advantage 的顺序是什么？', 'policy 先采样 rollout；verifier 给 reward；reward 与 baseline 比较得到 advantage。'],
        ['group-relative baseline 在做什么？', '用同 prompt 的一组 samples 建局部比较基准，减少对独立 value model 的依赖。'],
        ['“可验证”保证过程正确吗？', '不保证。verifier 通常只覆盖 final answer、tests 或格式，可能看不到过程错误与 exploit。']
      ],
      sections: [
        { before: 'what-is-rlvr', label: 'reward semantics', question: q(
          '代码通过公开 tests 得 reward=1，最严格能说明什么？',
          ['程序满足所有隐含需求', '程序通过了 verifier 当前覆盖的 tests', '推理过程诚实', '没有 hard-code'], 1,
          ['tests 覆盖有限。', '正确。claim 不能超过 verifier。', '结果检查不证明过程。', '可能 exploit。'],
          q('加入 hidden tests 主要降低什么？', ['针对公开 cases 的 hard-code exploit', '模型参数', 'KV cache', 'group size'], 0,
            ['正确。', '不直接改变。', '无关。', '无关。'])) },
        { before: 'grpo', label: 'group advantage', question: q(
          '同一 prompt 四个 rewards=[1,1,0,0]，简单中心化 advantages 是？',
          ['[1,1,0,0]', '[0.5,0.5,-0.5,-0.5]', '[0,0,0,0]', '[2,2,-2,-2]'], 1,
          ['未减 baseline。', '正确，均值 0.5。', '只有 rewards 全同时才如此。', '尺度错误。'],
          q('rewards=[2,2,2,2] 时简单 group-centered advantages 是？', ['[2,2,2,2]', '[1,1,1,1]', '[0,0,0,0]', '[-2,-2,-2,-2]'], 2,
            ['未减均值。', '不是。', '正确。组内无差异信号。', '方向错误。'])) },
        { before: 'challenges', label: 'sparse signal', question: q(
          '所有 rollouts reward 都为 0，最可能的学习问题是什么？',
          ['group 内没有相对信号', '模型已经完美', 'advantage 都为 1', 'KL 自动消失'], 0,
          ['正确。任务可能过难或 exploration 不足。', '全错不代表完美。', '中心化后为 0。', '无直接关系。'],
          q('调低题目难度让 group 同时出现成功/失败，目的是什么？', ['制造可比较 reward variation', '减少 vocabulary', '增加参数', '删除 verifier'], 0,
            ['正确。这是 curriculum 的信号设计作用。', '无关。', '无关。', '仍需 verifier。'])) },
        { before: 'future', label: 'on-policy boundary', question: q(
          'policy 已大幅更新，却持续用旧 policy rollouts 不做校正，主要风险是？',
          ['off-policy distribution mismatch', 'UTF-8 错误', 'HBM 变大', 'MinHash variance'], 0,
          ['正确。samples 不再代表当前 policy。', '无关。', '无关。', '无关。'],
          q('重新从当前 policy 采样主要修复什么？', ['让训练数据回到当前策略分布附近', '保证 verifier 完整', '消除所有方差', '让 reward 客观'], 0,
            ['正确。', 'verifier 边界仍在。', '采样仍有方差。', 'reward 仍由规则定义。'])) }
      ],
      deep: [
        q('RLVR 与 RLHF 最核心的 reward-source 区别是？', ['程序化 verifier vs 人类/偏好模型', '是否有 token', '是否用 GPU', '是否有 policy'], 0, ['正确。', '两者都有 token。', '都可用 GPU。', '都有 policy。']),
        q('全组 rewards 相同，标准化时还需注意什么？', ['标准差为零，需要数值保护且信号仍为零', '会得到无限好更新', '参数翻倍', '自动加入新题'], 0, ['正确。', '相反。', '无关。', '需 curriculum。']),
        q('final answer 正确但 reasoning 含矛盾，answer-only verifier 会怎样？', ['可能仍给满 reward', '必然检测', '删除 rollout', '改变 tokenizer'], 0, ['正确。这暴露 process supervision gap。', '它看不到过程。', '没有必然。', '无关。']),
        q('提高 group size 的主要 trade-off 是？', ['更稳定的相对估计与更多 rollout compute/memory', '参数必增', 'reward 更客观', '训练变 supervised'], 0, ['正确。', '模型参数不变。', '规则不变。', '仍是 RL。']),
        q('一个 verifier 可被格式空格骗过，RL 最可能做什么？', ['放大这个 exploit，因为它稳定得分', '自动修 verifier', '忽略 reward', '停止生成'], 0, ['正确。optimization 会发现 proxy loophole。', '需要工程修复。', '目标正依赖 reward。', '无此保证。'])
      ],
      open: [
        ['从 4 条 rollout 手算 group-relative update signal。', '先求 group mean（可再除 std），逐条 reward 减 baseline；正 advantage 提高相对概率，负值降低。'],
        ['解释“答案可验证”与“推理可信”之间的缺口。', 'verifier 只证明它观察的条件；猜测、hard-code、格式 exploit 或错误过程都可能得到正确 final answer。'],
        ['设计一个防 verifier hacking 的测试组合。', '隐藏/随机化 cases、隔离格式 parser、property-based tests、过程 slice 与独立 holdout verifier。']
      ]
    },

    '0017': {
      before: [
        ['图片如何变成 LLM 可接收的序列？', '切 patches→vision encoder vectors→projector 映射到 \\(d_{model}\\)→作为 visual tokens 接入 LLM。'],
        ['维度对齐等于语义对齐吗？', '不等于。shape 合法只保证接口能相连，语义要靠配对数据与训练目标学习。'],
        ['分辨率长宽各翻倍，固定 patch size 下 token 数怎样？', '每轴 patch 数翻倍，因此总 visual tokens 约变为 4×。']
      ],
      sections: [
        { before: 'clip', label: 'contrastive pairs', question: q(
          'CLIP 训练的正样本是什么？',
          ['同一 batch 中配对的 image-text', '任意两张图', '两个 token IDs', 'optimizer states'], 0,
          ['正确。目标让配对 embedding 更近。', '通常是负对。', '不是训练对象。', '无关。'],
          q('图像 i 与错误 caption j 在 batch 中通常扮演什么？', ['negative pair', 'positive pair', 'gradient shard', 'KV pair'], 0,
            ['正确。', '不配对。', '无关。', '无关。'])) },
        { before: 'siglip', label: 'loss distinction', question: q(
          'SigLIP 相比 batch-softmax contrastive loss 的关键改变是？',
          ['逐 image-text pair 做 sigmoid 二元目标', '删除 text encoder', '把 pixels 做 BPE', '只训练 projector'], 0,
          ['正确。它降低对巨大 global batch negatives 的结构依赖。', '仍需文本表示。', '不成立。', '不是 SigLIP 定义。'],
          q('这是否表示 batch size 完全不影响 SigLIP？', ['是', '否；优化统计和负样本数量仍受 batch 影响，只是目标不需全局 softmax 归一化', '只在推理影响', 'batch 不存在'], 1,
            ['说得过强。', '正确。', '训练仍受影响。', '存在。'])) },
        { before: 'llava', label: 'projector shape', question: q(
          'vision feature 是 [B,N,1024]，LLM d_model=4096。线性 projector W 的 shape 应是？',
          ['[1024,4096]', '[4096,1024] 且右乘', '[N,4096]', '[B,N]'], 0,
          ['正确，右乘得到 [B,N,4096]。', '若按 x@W，顺序错误。', 'N 不是 feature 输入维。', '缺 feature 维。'],
          q('投影后 [B,N,4096] 能否证明 image-text 已语义对齐？', ['能，shape 一样', '不能，还需 alignment/instruction training 与 eval', '只要 N=文本长度', '只要 BF16'], 1,
            ['shape 是必要接口，不是语义保证。', '正确。', '长度相同也不证明。', 'dtype 无关。'])) },
        { before: 'qwen2-vl', label: 'visual token budget', question: q(
          '224×224、patch 16 得多少 visual tokens（忽略 special token）？',
          ['14', '28', '196', '256'], 2,
          ['只数一轴。', '是两轴和而非乘积。', '正确：14×14。', '误把 patch size 平方。'],
          q('448×448、patch 16 得多少？', ['392', '784', '896', '3136'], 1,
            ['少一半。', '正确：28×28。', '错误乘法。', '是 56×56。'])) }
      ],
      deep: [
        q('文本 BPE 为什么不能直接 tokenize pixels？', ['BPE merge table 定义 UTF-8 byte 序列，不是连续二维信号表示', '图片没有 bytes', 'LLM 不能接 vectors', 'pixels 已是 words'], 0, ['正确。图片文件有 bytes，但其编码语义也不是文本 BPE。', '文件当然有 bytes。', 'projector 可接。', '不是。']),
        q('分辨率 2×（宽高各 2×）时 full multimodal attention score 最坏可能怎样？', ['visual tokens 4×，相关二次交互可接近 16×', '只 2×', '不变', '参数 16×'], 0, ['正确，若视觉 token 主导总序列。', '漏两轴与平方。', '错误。', '权重不随输入分辨率变。']),
        q('CLIP similarity 高能否证明 OCR 正确？', ['能', '不能，共享 embedding 相似不等于字符级识别', '只中文不能', '只大模型能'], 1, ['construct 不同。', '正确。需 OCR-specific eval。', '不是语言限定。', '规模不保证。']),
        q('动态分辨率的主要 trade-off 是？', ['保留细节但 visual token/compute/memory 变动态且可能增长', '永远更便宜', '删除 position', '不需 tokenizer'], 0, ['正确。', '通常更贵。', '仍需位置。', '文本仍需。']),
        q('理解型 VLM 与统一生成模型的主要表示差异是？', ['前者常用连续 vision features 接 LLM；后者还需离散/生成视觉表示', '二者完全一样', '前者无图像', '后者无文本'], 0, ['正确。', '目标与接口不同。', '错误。', '错误。'])
      ],
      open: [
        ['从 pixels 到 visual tokens 画出 shape 流。', '[B,H,W,C]→patches [B,N,p²C]→encoder [B,N,d_v]→projector [B,N,d_model]→与 text tokens 拼接/交互。'],
        ['解释为什么高分辨率是 sequence budget 问题。', '固定 patch 下 N 与图像面积成正比；N 增加会影响 attention interactions、activation、KV 与 latency。'],
        ['比较 CLIP、SigLIP、LLaVA 分别解决哪个接口。', 'CLIP 学跨模态对比空间；SigLIP 改对比损失；LLaVA 把 vision features 投影并用语言监督接入 LLM。']
      ]
    },

    '0018': {
      before: [
        ['test 与 proof 的量词范围有何不同？', 'test 检查有限样例；proof 在给定 axioms/specification 下覆盖命题量化的全部情况。'],
        ['trusted kernel 检查什么？', '检查 proof term 是否满足 formal statement 与类型规则，不判断 informal intent 是否翻译正确。'],
        ['verification-guided generation 的闭环是什么？', 'generator 提候选→verifier 检查→反馈错误→继续搜索，直到通过或资源耗尽。']
      ],
      sections: [
        { before: 'formal-verification', label: 'quantifier', question: q(
          '测试 x=-1,0,2 都通过，能否证明函数对所有整数正确？',
          ['能，覆盖正负零', '不能，只覆盖三个点', '只要 deterministic 就能', '只要测试无 bug'], 1,
          ['仍有无限未测输入。', '正确。', '确定性不扩大量词。', '测试工具正确也只测样例。'],
          q('再加 1000 个随机 tests 能否变成形式证明？', ['能', '不能，证据更强但量词仍有限', '只在 Python 能', '只在 GPU 能'], 1,
            ['仍不是全称证明。', '正确。', '语言无关。', '无关。'])) },
        { before: 'program-synthesis', label: 'specification', question: q(
          'synthesizer 找到满足 specification 的程序，但 specification 漏掉负数。结论是什么？',
          ['原始需求已完全满足', '程序只对形式化出的较弱需求有保证', 'kernel 不 sound', '程序必错误'], 1,
          ['claim 超过 specification。', '正确。intent→spec 是人工边界。', 'kernel 可完全 sound。', '对已写 spec 可能正确。'],
          q('修复的首要动作是什么？', ['补全/审计 specification，再重新验证', '增加 GPU', '换 tokenizer', '删除 proof'], 0,
            ['正确。', '不修语义。', '无关。', '应保留并重验。'])) },
        { before: 'verification-guided', label: 'search feedback', question: q(
          'verifier 返回具体 type mismatch，而非只返回 false，有什么价值？',
          ['给 generator 更局部的搜索信号', '证明 theorem 错', '增加模型参数', '消除所有搜索'], 0,
          ['正确。诊断反馈可缩小候选空间。', '可能只是候选错。', '参数不变。', '仍可能困难。'],
          q('verifier 只返回 pass/fail 时，搜索通常怎样？', ['反馈更稀疏，可能需更多候选', '自动最优', '不需 generator', '变成监督学习'], 0,
            ['正确。', '相反。', '仍需产生候选。', '不必然。'])) },
        { before: 'llm-verification', label: 'verifier boundary', question: q(
          'Lean kernel 接受 proof，最准确的 claim 是？',
          ['formal theorem 在所声明环境/axioms 下被证明', '现实世界陈述必真', 'informal intent 必完整', '库中 axioms 无风险'], 0,
          ['正确。claim 绑定 formal context。', '还需语义映射。', 'kernel 不检查 completeness。', 'axioms 仍是信任边界。'],
          q('若 theorem 翻译错了，proof 还能完全合法么？', ['可以', '不可以，kernel 会读自然语言', '只在短 proof 可以', '只在测试后'], 0,
            ['正确。这是 specification gap。', 'kernel 只看 formal statement。', '长度无关。', '无关。'])) }
      ],
      deep: [
        q('proof term、kernel、specification 的关系是？', ['kernel 检查 proof term 是否 inhabits specification/type', 'proof 检查 kernel', 'spec 自动生成 intent', 'test 等于 proof'], 0, ['正确。', '方向反了。', '不保证。', '不同。']),
        q('verification-guided generation 为什么不是一次 forward？', ['失败反馈会形成搜索/修正循环', '因为没有模型', '因为 proof 不可检查', '因为 token 不存在'], 0, ['正确。', '有 generator。', '正因为可检查。', '仍有 token。']),
        q('verified program 仍可能不安全的最直接反例是？', ['spec 漏掉资源上限或恶意输入', 'proof 很长', '代码用整数', 'kernel 快'], 0, ['正确。保证只覆盖 spec。', '长度不是。', '无关。', '无关。']),
        q('测试的独特价值是什么，即使已有形式证明？', ['可检查实现/环境与 specification 外的现实行为', '证明可替代一切', '没有价值', '只测 tokenizer'], 0, ['正确。两者覆盖不同失败面。', '说反了。', '错误。', '无关。']),
        q('LLM+verifier 最合理的分工是？', ['LLM 提案和搜索，verifier 提供高精度合法性检查', 'LLM 证明自己正确', 'verifier 生成所有候选', '两者都只计 FLOPs'], 0, ['正确。', 'self-claim 不可靠。', 'verifier 通常不负责生成。', '忽略语义。'])
      ],
      open: [
        ['用一个例子区分测试通过、formal proof 通过和原始需求满足。', '分别说明有限样例、formal statement 全量证明，以及 intent→spec 是否完整这三层。'],
        ['画 verification-guided generation 的状态机。', '候选→parse/typecheck/prove→成功结束；失败则结构化错误→更新搜索状态→新候选；另有 timeout/budget 终止。'],
        ['解释 trusted kernel 为什么要小。', '信任基越小越容易审计；复杂搜索可不可信，只要最终 proof term 由小 kernel 检查。']
      ]
    },

    '0019': {
      before: [
        ['FlashAttention 改变 attention 数学函数吗？', '不改变 exact attention 语义（浮点舍入除外）；它改变 tiling 与 HBM dataflow。'],
        ['Amdahl law 在提醒什么？', '端到端收益受未优化部分限制，局部 kernel speedup 不能直接当全流程 speedup。'],
        ['系统优化的最小闭环是什么？', '定义 workload→列 FLOPs/bytes→profile→提出 bottleneck→改 dataflow→重新测端到端。']
      ],
      sections: [
        { before: 'flashattention', label: 'IO-aware attention', question: q(
          'FlashAttention 主要避免什么 HBM traffic？',
          ['完整 T×T score/probability matrix 的写回与重读', 'Q/K/V 所有读取', '模型 weights', 'tokenizer vocab'], 0,
          ['正确。tile 中维护 online softmax。', '仍需读输入。', 'attention 投影仍有 weights。', '无关。'],
          q('逻辑 attention interactions 是否从 O(T²) 变 O(T)？', ['是', '否；主要改善 IO complexity 和中间存储', '只在 causal 时是', '只在 BF16 是'], 1,
            ['数学 pair interactions 仍二次。', '正确。', 'mask 不改量级。', 'dtype 不改。'])) },
        { before: 'systems-thinking', label: 'roofline transfer', question: q(
          'AI 低于 ridge point 的 kernel，首要优化方向通常是什么？',
          ['减少关键内存层 bytes 或提高复用', '只增加 FLOPs', '扩大 vocabulary', '增加日志'], 0,
          ['正确。目标是离开 bandwidth-bound 区域。', '可能更慢。', '无关。', '无关。'],
          q('FLOPs 减半但 bytes 不变，memory-bound kernel 速度一定 2×吗？', ['一定', '不一定，带宽仍可能主导', '一定变慢', '参数归零'], 1,
            ['roofline 说明不保证。', '正确。', '也不一定。', '无关。'])) },
        { before: 'kernel-engineering', label: 'Amdahl accounting', question: q(
          '某 kernel 占 step 20%，自身快 2×，新 step time 是原来的多少？',
          ['0.5', '0.8', '0.9', '1.2'], 2,
          ['把局部当全部。', '忽略优化部分仍需一半时间。', '正确：0.8+0.2/2=0.9。', '方向错误。'],
          q('若该 kernel 占 60%，快 3×，端到端 speedup 最接近？', ['1.25×', '1.67×', '3×', '5×'], 1,
            ['新时间 0.6 不是 0.8。', '正确：1/(0.4+0.6/3)=1.67。', '忽略 40%。', '过大。'])) },
        { before: 'course-review', label: 'new bottleneck', question: q(
          '优化 attention 后 step 只快 8%，profiler 显示 all-reduce 成最大项。下一步是什么？',
          ['把通信视为新瓶颈并重新建立 hypothesis', '继续只优化 attention', '宣称 profiler 错', '删除 loss'], 0,
          ['正确。优化会移动瓶颈。', '边际收益会下降。', '无依据。', '不成立。'],
          q('更换 GPU 后旧 tile 仍正确但变慢，说明什么？', ['正确性可迁移，最优 schedule 未必可迁移', '算法失去数学语义', 'tokenizer 改变', 'proof 无效'], 0,
            ['正确。硬件 hierarchy/shape 决定最佳实现。', '输出可仍正确。', '无关。', '无关。'])) }
      ],
      deep: [
        q('哪项属于 exact、asymptotic、hardware-specific 的正确搭配？', ['score shape T×T；O(T²)；某 GPU 峰值带宽', '三者都是 exact', '三者都是 benchmark', 'O(T²) 是硬件数字'], 0, ['正确。', '结论层级不同。', '前两者不是 benchmark。', '不是。']),
        q('microbenchmark 2×而 end-to-end 1.05×，最可能为什么？', ['热点占比小或新瓶颈出现', '速度单位错误必然', '模型参数消失', 'benchmark 越快越假'], 0, ['正确。Amdahl 与 critical path。', '不必然。', '无关。', '不能这样推。']),
        q('IO-aware algorithm 的第一本账是什么？', ['哪些 tensors 在哪个 memory level 读写多少次', '论文引用数', '函数名', 'GPU 风扇'], 0, ['正确。', '无关。', '无关。', '无关。']),
        q('为什么 exact FlashAttention 输出仍可能与 naive 有微小数值差？', ['浮点归约顺序改变导致舍入差异', '数学函数变成近似', '删除 softmax', '随机 tokenizer'], 0, ['正确。语义 exact 与 bitwise identical 不同。', '不是算法近似。', '仍有 softmax。', '无关。']),
        q('完成 CS336 后遇到新系统，最稳健的起点是什么？', ['先列对象、shape、依赖、FLOPs、bytes、links 与测量目标', '先复制热门优化', '只看 GPU utilization', '只加模型参数'], 0, ['正确。这是可迁移的系统方法。', '可能不适配。', '单指标不足。', '不一定。'])
      ],
      open: [
        ['从 naive attention 到 FlashAttention 口述 dataflow 改变。', 'naive 物化 T×T 到 HBM；FlashAttention 分块读取 Q/K/V，在片上维护 max/sum 与 output，不写完整中间矩阵。'],
        ['用 Amdahl 分析一个局部优化。', '先测热点占比 f 和局部 speedup s，端到端为 1/((1-f)+f/s)，再 profile 新瓶颈。'],
        ['给一个新 kernel 写完整优化实验计划。', 'reference correctness→边界/tolerance→warm-up/sync benchmark→bytes/FLOPs→profile→单一假设修改→端到端复测。']
      ]
    }
  });
})();
