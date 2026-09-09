"use strict";
(() => {
    'use strict';
    const DEFAULTS = { sequenceLength: 8, heads: 8, model: 512 };
    const TOKENS = ['The', 'quick', 'brown', 'fox', 'jumped', 'over', 'the', 'log', 'then', 'looked', 'back', 'at', 'the', 'quiet', 'green', 'field'];
    const dHead = (parameters) => parameters.model / parameters.heads;
    const dFf = (parameters) => parameters.model * 4;
    const modelShape = (parameters) => `[B, ${parameters.sequenceLength}, ${parameters.model}]`;
    const headShape = (parameters) => `[B, ${parameters.heads}, ${parameters.sequenceLength}, ${dHead(parameters)}]`;
    const scoreShape = (parameters) => `[B, ${parameters.heads}, ${parameters.sequenceLength}, ${parameters.sequenceLength}]`;
    const stages = [
        {
            shortTitle: 'Embed',
            title: 'Tokens become vectors',
            input: p => `[B, ${p.sequenceLength}] token IDs`,
            operation: () => 'Look up one learned embedding vector for each token position.',
            output: modelShape,
            changed: p => `A feature axis of width d_model = ${p.model} was added. Sequence length stayed ${p.sequenceLength}.`,
            why: 'The Transformer operates on continuous vectors, not integer token IDs.',
            activeNodes: ['tokens', 'embedding', 'residual-start'],
            changedAxes: [2]
        },
        {
            shortTitle: 'Norm',
            title: 'Normalize the attention branch',
            input: modelShape,
            operation: () => 'LayerNorm normalizes features independently at every token position.',
            output: modelShape,
            changed: () => 'Values changed. Shape did not. The residual highway remains available unchanged.',
            why: 'Pre-Norm conditions the branch input while preserving a clean identity path for the residual stream.',
            activeNodes: ['residual-start', 'norm-attn'],
            changedAxes: []
        },
        {
            shortTitle: 'Q K V',
            title: 'Create query, key, and value views',
            input: modelShape,
            operation: () => 'Apply three learned linear projections to the normalized residual stream.',
            output: p => `Q, K, V ∈ ${modelShape(p)}`,
            changed: () => 'Values changed into three different representations. Their shapes did not.',
            why: 'Q asks what a token seeks, K describes what each position offers for matching, and V carries information to aggregate.',
            activeNodes: ['norm-attn', 'qkv'],
            changedAxes: []
        },
        {
            shortTitle: 'Heads',
            title: 'Split heads and compare positions',
            input: modelShape,
            operation: p => `Reshape d_model into ${p.heads} heads, then compute QKᵀ / √${dHead(p)}.`,
            output: scoreShape,
            changed: p => `${p.model} features became ${p.heads} parallel heads × ${dHead(p)} features. Scores introduce a T × T position-pair matrix.`,
            why: 'Each head can learn a different matching pattern. Attention is the part of the block that mixes information across token positions.',
            activeNodes: ['qkv', 'heads', 'attention'],
            changedAxes: [1, 3]
        },
        {
            shortTitle: 'Attend',
            title: 'Softmax and aggregate values',
            input: scoreShape,
            operation: () => 'Apply the causal mask and softmax across keys for each query, then take the weighted sum of V and concatenate all heads.',
            output: modelShape,
            changed: p => `The T × T scores were reduced back to one ${p.model}-wide representation per token. Sequence length stayed ${p.sequenceLength}.`,
            why: 'Softmax turns compatibility scores into weights that sum to one. The weighted sum is over value vectors, not key vectors.',
            activeNodes: ['heads', 'attention', 'concat'],
            changedAxes: [1, 3]
        },
        {
            shortTitle: 'Add',
            title: 'Project and return to the residual stream',
            input: modelShape,
            operation: () => 'Apply the output projection Wₒ, then add the attention branch back to the saved residual stream.',
            output: modelShape,
            changed: () => 'Values changed. Shape did not; both sides of a residual addition must match exactly.',
            why: 'The projection mixes information across heads. Residual addition updates the main stream without replacing its identity path.',
            activeNodes: ['concat', 'output-projection', 'residual-attn'],
            changedAxes: []
        },
        {
            shortTitle: 'MLP',
            title: 'Transform each token with the MLP',
            input: modelShape,
            operation: p => `Normalize, expand ${p.model} → ${dFf(p)}, apply a nonlinearity, then project ${dFf(p)} → ${p.model}.`,
            output: modelShape,
            changed: p => `The feature width temporarily expanded to d_ff = ${dFf(p)} and returned to d_model. Token positions never mixed.`,
            why: 'Unlike attention, the MLP applies the same feature transformation independently to every token position.',
            activeNodes: ['residual-attn', 'norm-mlp', 'mlp'],
            changedAxes: [2]
        },
        {
            shortTitle: 'Next block',
            title: 'Add the MLP result and continue',
            input: modelShape,
            operation: () => 'Add the MLP branch to the residual stream and pass the result to the next Transformer block.',
            output: modelShape,
            changed: () => 'Values changed. B, T, and d_model all stayed the same across the block.',
            why: 'A block repeatedly enriches the persistent residual stream: attention mixes across positions; the MLP mixes within each position.',
            activeNodes: ['mlp', 'residual-output', 'next-block'],
            changedAxes: []
        }
    ];
    const diagramNodes = [
        { id: 'tokens', label: 'Token IDs', x: 24, y: 22, width: 116, shape: p => `[B, ${p.sequenceLength}]`, stage: 0 },
        { id: 'embedding', label: 'Embedding', x: 174, y: 22, width: 126, shape: modelShape, stage: 0 },
        { id: 'residual-start', label: 'Residual stream', x: 52, y: 116, width: 150, shape: modelShape, stage: 1 },
        { id: 'norm-attn', label: 'LayerNorm', x: 280, y: 116, width: 112, shape: modelShape, stage: 1 },
        { id: 'qkv', label: 'Q · K · V', x: 430, y: 116, width: 118, shape: modelShape, stage: 2 },
        { id: 'heads', label: 'Split heads', x: 586, y: 116, width: 126, shape: headShape, stage: 3 },
        { id: 'attention', label: 'Attention', x: 750, y: 116, width: 132, shape: scoreShape, stage: 3 },
        { id: 'concat', label: 'Concat heads', x: 586, y: 226, width: 126, shape: modelShape, stage: 4 },
        { id: 'output-projection', label: 'Output Wₒ', x: 430, y: 226, width: 118, shape: modelShape, stage: 5 },
        { id: 'residual-attn', label: 'Residual add', x: 52, y: 226, width: 150, shape: modelShape, stage: 5 },
        { id: 'norm-mlp', label: 'LayerNorm', x: 280, y: 336, width: 112, shape: modelShape, stage: 6 },
        { id: 'mlp', label: 'MLP', x: 430, y: 336, width: 172, shape: p => `${p.model} → ${dFf(p)} → ${p.model}`, stage: 6 },
        { id: 'residual-output', label: 'Residual add', x: 52, y: 336, width: 150, shape: modelShape, stage: 7 },
        { id: 'next-block', label: 'Next block', x: 52, y: 446, width: 150, shape: modelShape, stage: 7 }
    ];
    const escapeHtml = (value) => value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    class TransformerRefresher {
        constructor(root) {
            this.abortController = new AbortController();
            this.parameters = { ...DEFAULTS };
            this.currentStage = 0;
            this.selectedToken = 3;
            this.selectedHead = 0;
            this.focusedTensor = 'residual-start';
            this.playTimer = null;
            this.root = root;
            this.mount();
        }
        mount() {
            this.root.dataset.ready = 'true';
            this.root.tabIndex = 0;
            this.root.innerHTML = `
        <header class="tr-header">
          <div>
            <div class="tr-heading-row">
              <h3 id="tr-refresher-title">Transformer Refresher</h3>
              <span class="tr-badge">Interactive</span>
            </div>
            <p>Follow one batch of tokens through a Transformer block.</p>
          </div>
          <button class="tr-reset" type="button" data-action="reset">Reset</button>
        </header>
        <div class="tr-toolbar">
          <ol class="tr-steps" aria-label="Transformer refresher stages"></ol>
          <details class="tr-parameters">
            <summary>Parameters</summary>
            <div class="tr-parameter-grid">
              <label>Sequence length<select data-parameter="sequenceLength"><option>4</option><option selected>8</option><option>16</option></select></label>
              <label>Heads<select data-parameter="heads"><option>4</option><option selected>8</option><option>16</option></select></label>
              <label>d_model<select data-parameter="model"><option>256</option><option selected>512</option><option>1024</option></select></label>
            </div>
          </details>
        </div>
        <section class="tr-stage" aria-labelledby="tr-stage-title">
          <div class="tr-stage-heading"><p class="tr-step-count"></p><h4 id="tr-stage-title"></h4></div>
          <div class="tr-shape-equation" aria-live="polite"></div>
          <div class="tr-diagram-wrap"></div>
          <div class="tr-mobile-flow" aria-label="Compact Transformer flow"></div>
          <p class="tr-focus-readout" aria-live="polite"></p>
          <div class="tr-attention-explorer" hidden></div>
          <div class="tr-mixing-comparison" hidden></div>
        </section>
        <section class="tr-explanation" aria-label="What changed in this stage">
          <dl>
            <div><dt>Input</dt><dd data-field="input"></dd></div>
            <div><dt>Operation</dt><dd data-field="operation"></dd></div>
            <div><dt>Output</dt><dd data-field="output"></dd></div>
            <div><dt>What changed?</dt><dd data-field="changed"></dd></div>
            <div class="tr-why"><dt>Why?</dt><dd data-field="why"></dd></div>
          </dl>
        </section>
        <footer class="tr-footer">
          <button type="button" data-action="previous">Previous</button>
          <button type="button" data-action="play">Play</button>
          <p class="tr-status" aria-live="polite"></p>
          <button type="button" data-action="next">Next</button>
        </footer>`;
            const signal = this.abortController.signal;
            this.root.addEventListener('click', event => this.handleClick(event), { signal });
            this.root.addEventListener('change', event => this.handleChange(event), { signal });
            this.root.addEventListener('keydown', event => this.handleKeydown(event), { signal });
            window.addEventListener('pagehide', () => this.destroy(), { signal, once: true });
            this.render();
        }
        requireElement(selector) {
            const element = this.root.querySelector(selector);
            if (!element)
                throw new Error(`Transformer refresher is missing ${selector}`);
            return element;
        }
        handleClick(event) {
            const target = event.target;
            const button = target.closest('button');
            const tensor = target.closest('[data-tensor]');
            if (tensor?.dataset.tensor) {
                this.focusedTensor = tensor.dataset.tensor;
                this.renderDiagram();
                return;
            }
            if (!button)
                return;
            if (button.dataset.stage !== undefined)
                this.setStage(Number(button.dataset.stage));
            if (button.dataset.action === 'previous')
                this.setStage(this.currentStage - 1);
            if (button.dataset.action === 'next')
                this.setStage(this.currentStage + 1);
            if (button.dataset.action === 'play')
                this.togglePlay();
            if (button.dataset.action === 'reset')
                this.reset();
            if (button.dataset.token !== undefined) {
                this.selectedToken = Number(button.dataset.token);
                this.renderAttentionExplorer();
            }
            if (button.dataset.head !== undefined) {
                this.selectedHead = Number(button.dataset.head);
                this.renderAttentionExplorer();
            }
            if (button.dataset.mobileTensor) {
                this.focusedTensor = button.dataset.mobileTensor;
                this.renderDiagram();
            }
        }
        handleChange(event) {
            const select = event.target.closest('select[data-parameter]');
            if (!select)
                return;
            const value = Number(select.value);
            if (select.dataset.parameter === 'sequenceLength')
                this.parameters.sequenceLength = value;
            if (select.dataset.parameter === 'heads')
                this.parameters.heads = value;
            if (select.dataset.parameter === 'model')
                this.parameters.model = value;
            this.selectedToken = Math.min(this.selectedToken, this.parameters.sequenceLength - 1);
            this.selectedHead = Math.min(this.selectedHead, this.parameters.heads - 1);
            this.stopPlaying();
            this.render();
        }
        handleKeydown(event) {
            if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLSelectElement || event.target instanceof HTMLElement && event.target.closest('summary'))
                return;
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                this.setStage(this.currentStage - 1);
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                this.setStage(this.currentStage + 1);
            }
            if (event.key === 'Home') {
                event.preventDefault();
                this.setStage(0);
            }
            if (event.key === 'End') {
                event.preventDefault();
                this.setStage(stages.length - 1);
            }
            if (event.key === ' ' && event.target === this.root) {
                event.preventDefault();
                this.togglePlay();
            }
        }
        setStage(nextStage) {
            this.currentStage = Math.max(0, Math.min(stages.length - 1, nextStage));
            if (this.currentStage === stages.length - 1)
                this.stopPlaying();
            this.render();
        }
        togglePlay() {
            if (this.playTimer !== null) {
                this.stopPlaying();
                this.renderControls();
                return;
            }
            if (this.currentStage === stages.length - 1)
                this.currentStage = 0;
            this.playTimer = window.setInterval(() => {
                if (this.currentStage >= stages.length - 1) {
                    this.stopPlaying();
                    this.renderControls();
                }
                else {
                    this.currentStage += 1;
                    this.render();
                }
            }, 1800);
            this.renderControls();
        }
        stopPlaying() {
            if (this.playTimer !== null)
                window.clearInterval(this.playTimer);
            this.playTimer = null;
        }
        reset() {
            this.stopPlaying();
            this.parameters = { ...DEFAULTS };
            this.currentStage = 0;
            this.selectedToken = 3;
            this.selectedHead = 0;
            this.focusedTensor = 'residual-start';
            this.root.querySelectorAll('select[data-parameter]').forEach(select => {
                const key = select.dataset.parameter;
                select.value = String(this.parameters[key]);
            });
            this.render();
        }
        render() {
            const stage = stages[this.currentStage];
            this.root.dataset.stage = String(this.currentStage);
            this.requireElement('.tr-steps').innerHTML = stages.map((item, index) => `
        <li class="${index < this.currentStage ? 'is-complete' : ''} ${index === this.currentStage ? 'is-active' : ''}">
          <button type="button" data-stage="${index}" ${index === this.currentStage ? 'aria-current="step"' : ''}>
            <span>${index < this.currentStage ? '✓' : index + 1}</span>${item.shortTitle}
          </button>
        </li>`).join('');
            this.requireElement('.tr-step-count').textContent = `Step ${this.currentStage + 1} of ${stages.length}`;
            this.requireElement('#tr-stage-title').textContent = stage.title;
            this.requireElement('[data-field="input"]').textContent = stage.input(this.parameters);
            this.requireElement('[data-field="operation"]').textContent = stage.operation(this.parameters);
            this.requireElement('[data-field="output"]').textContent = stage.output(this.parameters);
            this.requireElement('[data-field="changed"]').textContent = stage.changed(this.parameters);
            this.requireElement('[data-field="why"]').textContent = stage.why;
            this.renderShapeEquation();
            this.renderDiagram();
            this.renderAttentionExplorer();
            this.renderMixingComparison();
            this.renderControls();
        }
        renderShapeEquation() {
            const values = ['B', String(this.parameters.sequenceLength), String(this.parameters.model)];
            const stage = stages[this.currentStage];
            const parts = values.map((value, index) => `<span class="tr-shape-dim ${stage.changedAxes.includes(index) ? 'is-changed' : ''}">${value}</span>`).join('<span class="tr-shape-comma">,</span>');
            const headParts = `<span>${this.parameters.model}</span><b>=</b><span class="tr-head-segments" aria-label="${this.parameters.heads} heads">${Array.from({ length: this.parameters.heads }, () => '<i></i>').join('')}</span><span>${this.parameters.heads} × ${dHead(this.parameters)}</span>`;
            this.requireElement('.tr-shape-equation').innerHTML = `
        <div><small>Residual shape</small><strong>[${parts}]</strong></div>
        <div class="tr-head-equation"><small>Head decomposition</small><strong>${headParts}</strong></div>`;
        }
        nodeMarkup(node) {
            const stage = stages[this.currentStage];
            const isActive = stage.activeNodes.includes(node.id);
            const isPast = node.stage < this.currentStage;
            const isFocused = node.id === this.focusedTensor;
            const shape = this.displayShape(node);
            const label = node.id === 'qkv'
                ? '<tspan class="tr-svg-q">Q</tspan><tspan> · </tspan><tspan class="tr-svg-k">K</tspan><tspan> · </tspan><tspan class="tr-svg-v">V</tspan>'
                : escapeHtml(node.label);
            return `<g class="tr-svg-node ${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''} ${isFocused ? 'is-focused' : ''}" data-tensor="${node.id}" role="button" tabindex="0" aria-label="${escapeHtml(`${node.label}, tensor shape ${shape}`)}">
        <title>${escapeHtml(`${node.label}: ${shape}`)}</title>
        <rect x="${node.x}" y="${node.y}" width="${node.width}" height="58" rx="6"></rect>
        <text x="${node.x + node.width / 2}" y="${node.y + 23}" text-anchor="middle" class="tr-svg-label">${label}</text>
        <text x="${node.x + node.width / 2}" y="${node.y + 43}" text-anchor="middle" class="tr-svg-shape">${escapeHtml(shape)}</text>
      </g>`;
        }
        displayShape(node) {
            return node.id === 'attention' && this.currentStage >= 4
                ? headShape(this.parameters)
                : node.shape(this.parameters);
        }
        renderDiagram() {
            const diagram = this.requireElement('.tr-diagram-wrap');
            diagram.innerHTML = `<svg viewBox="0 0 920 526" role="img" aria-labelledby="tr-svg-title tr-svg-desc" preserveAspectRatio="xMidYMid meet">
        <title id="tr-svg-title">Pre-Norm Transformer block residual stream</title>
        <desc id="tr-svg-desc">The residual stream is the persistent main path. Attention and MLP branches normalize, transform, and return to it through residual additions.</desc>
        <defs><marker id="tr-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z"></path></marker></defs>
        <path class="tr-svg-highway" d="M127 174 L127 226 M127 284 L127 336 M127 394 L127 446"></path>
        <path class="tr-svg-flow" d="M140 51 L174 51 M237 80 L237 97 L127 97 L127 116"></path>
        <path class="tr-svg-flow" d="M202 145 L280 145 M392 145 L430 145 M548 145 L586 145 M712 145 L750 145"></path>
        <path class="tr-svg-flow" d="M816 174 L816 205 L649 205 L649 226 M586 255 L548 255 M430 255 L202 255"></path>
        <path class="tr-svg-flow" d="M202 255 L237 255 L237 365 L280 365 M392 365 L430 365 M602 365 L637 365 L637 415 L127 415 L127 394"></path>
        <path class="tr-svg-flow" d="M127 504 L127 526"></path>
        <text x="127" y="105" text-anchor="middle" class="tr-svg-highway-label">persistent residual highway</text>
        <text x="495" y="98" text-anchor="middle" class="tr-svg-branch-label">attention: mixes across token positions</text>
        <text x="465" y="326" text-anchor="middle" class="tr-svg-branch-label">MLP: mixes features within each token</text>
        ${diagramNodes.map(node => this.nodeMarkup(node)).join('')}
      </svg>`;
            const focused = diagramNodes.find(node => node.id === this.focusedTensor) ?? diagramNodes[2];
            this.requireElement('.tr-focus-readout').textContent = `Focused tensor · ${focused.label}: ${this.displayShape(focused)}`;
            this.requireElement('.tr-mobile-flow').innerHTML = diagramNodes
                .filter(node => stages[this.currentStage].activeNodes.includes(node.id))
                .map(node => `<button type="button" data-mobile-tensor="${node.id}" class="${node.id === this.focusedTensor ? 'is-focused' : ''}"><span>${node.label}</span><small>${this.displayShape(node)}</small></button>`)
                .join('<b aria-hidden="true">↓</b>');
        }
        attentionWeights() {
            const length = this.parameters.sequenceLength;
            const query = this.selectedToken;
            const raw = Array.from({ length }, (_, key) => {
                if (key > query)
                    return 0;
                const distance = query - key;
                const mode = this.selectedHead % 4;
                if (mode === 0)
                    return Math.exp(-distance * 0.65);
                if (mode === 1)
                    return 0.25 + ((key + this.selectedHead) % 3 === 0 ? 1.45 : 0.12);
                if (mode === 2)
                    return key === 0 ? 1.8 : 0.35 + 0.2 * Math.cos((key + 1) * (this.selectedHead + 1));
                return key === query ? 1.45 : 0.3 + (key / Math.max(1, query)) * 0.75;
            });
            const total = raw.reduce((sum, value) => sum + value, 0);
            return raw.map(value => total === 0 ? 0 : value / total);
        }
        renderAttentionExplorer() {
            const explorer = this.requireElement('.tr-attention-explorer');
            const visible = this.currentStage === 3 || this.currentStage === 4;
            explorer.hidden = !visible;
            if (!visible)
                return;
            const tokens = TOKENS.slice(0, this.parameters.sequenceLength);
            const weights = this.attentionWeights();
            explorer.innerHTML = `
        <div class="tr-explorer-heading">
          <div><p>Attention explorer</p><h5>Which keys does <q>${escapeHtml(tokens[this.selectedToken])}</q> attend to?</h5></div>
          <span>Illustrative synthetic pattern</span>
        </div>
        <div class="tr-token-row" aria-label="Choose a query token">${tokens.map((token, index) => `<button type="button" data-token="${index}" class="${index === this.selectedToken ? 'is-selected' : ''}" aria-pressed="${index === this.selectedToken}">${escapeHtml(token)}</button>`).join('')}</div>
        <div class="tr-head-row" aria-label="Choose an attention head">${Array.from({ length: this.parameters.heads }, (_, index) => `<button type="button" data-head="${index}" class="${index === this.selectedHead ? 'is-selected' : ''}" aria-pressed="${index === this.selectedHead}">H${index + 1}</button>`).join('')}</div>
        <div class="tr-attention-formula"><strong>softmax(QKᵀ / √d_head + causal mask)</strong><span>Softmax runs across keys → weights sum to 1</span></div>
        <div class="tr-weight-grid" style="--token-count:${tokens.length}" aria-label="Attention weights from selected query to each key">${tokens.map((token, index) => {
                const weight = weights[index];
                const blocked = index > this.selectedToken;
                return `<div class="${blocked ? 'is-masked' : ''}" style="--weight:${weight.toFixed(3)}"><span>${escapeHtml(token)}</span><b>${blocked ? 'mask' : `${Math.round(weight * 100)}%`}</b><i style="height:${Math.max(3, Math.round(weight * 92))}%"></i></div>`;
            }).join('')}</div>
        <p class="tr-value-note"><strong>Weighted aggregation:</strong> the selected query uses these weights to sum the corresponding <em>V</em> vectors. K determines the weights; V supplies the content.</p>`;
        }
        renderMixingComparison() {
            const comparison = this.requireElement('.tr-mixing-comparison');
            const visible = this.currentStage >= 6;
            comparison.hidden = !visible;
            if (!visible)
                return;
            comparison.innerHTML = `
        <article><p>Attention</p><h5>Mixes across token positions</h5><div class="tr-token-mix"><span>A</span><b>→</b><span>B</span><span>C</span><span>D</span></div><small>Each query gathers information from other positions.</small></article>
        <article><p>MLP</p><h5>Mixes features within each token</h5><div class="tr-feature-mix"><span>token A</span><b>→</b><span>${this.parameters.model}</span><b>→</b><span>${dFf(this.parameters)}</span><b>→</b><span>token A</span></div><small>The same MLP runs independently at every position.</small></article>`;
        }
        renderControls() {
            const previous = this.requireElement('[data-action="previous"]');
            const next = this.requireElement('[data-action="next"]');
            const play = this.requireElement('[data-action="play"]');
            previous.disabled = this.currentStage === 0;
            next.disabled = this.currentStage === stages.length - 1;
            next.textContent = this.currentStage === stages.length - 1 ? 'Complete' : 'Next';
            play.textContent = this.playTimer === null ? 'Play' : 'Pause';
            play.setAttribute('aria-pressed', String(this.playTimer !== null));
            this.requireElement('.tr-status').textContent = `Step ${this.currentStage + 1} / ${stages.length}`;
        }
        destroy() {
            this.stopPlaying();
            this.abortController.abort();
            delete this.root.dataset.ready;
        }
    }
    const mount = () => {
        document.querySelectorAll('[data-transformer-refresher]').forEach(root => {
            if (!root.dataset.ready)
                new TransformerRefresher(root);
        });
    };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', mount, { once: true });
    else
        mount();
})();
