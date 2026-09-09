"use strict";
(() => {
    'use strict';
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const steps = [
        {
            title: 'Shard the weight matrix',
            shortTitle: 'Shard W',
            operation: 'Split W along its output dimension.',
            shape: 'Wᵢ: [H, 4H / 4]',
            communication: 'None during the forward computation.',
            explanation: 'GPU i owns one contiguous column shard Wᵢ. The four shards concatenate to the original matrix W.',
            ariaLabel: 'Step 1. The weight matrix is split by output columns into four shards, one per GPU.'
        },
        {
            title: 'Run local GEMM',
            shortTitle: 'Local GEMM',
            operation: 'Each GPU independently evaluates X multiplied by its local Wᵢ.',
            shape: '[B, T, H] × [H, 4H / 4]',
            communication: 'None. X is available on every tensor-parallel rank.',
            explanation: 'The same input X is consumed on all four GPUs, but no GPU needs another rank’s weight shard to perform its local matrix multiplication.',
            ariaLabel: 'Step 2. All four GPUs multiply the replicated input by their local weight shard in parallel.'
        },
        {
            title: 'Produce local output shards',
            shortTitle: 'Local outputs',
            operation: 'GPU i produces Yᵢ = XWᵢ.',
            shape: 'Yᵢ: [B, T, 4H / 4]',
            communication: 'None yet. Each Yᵢ remains local to its owner.',
            explanation: 'These are disjoint slices of the output dimension, not partial sums. Concatenating Y₀…Y₃ reconstructs Y.',
            ariaLabel: 'Step 3. Each GPU owns one non-overlapping output shard with one quarter of the output width.'
        },
        {
            title: 'Materialize the full output when needed',
            shortTitle: 'Optional AllGather',
            operation: 'AllGather concatenates Y₀…Y₃ on every rank.',
            shape: 'Y: [B, T, 4H]',
            communication: 'Ring AllGather: each rank sends and receives (TP − 1) / TP × |Y| bytes.',
            explanation: 'This AllGather is conditional: it is needed only when the next consumer requires full Y. A Megatron-style paired Row Parallel layer can consume the shards directly and avoid this materialization.',
            ariaLabel: 'Step 4. An optional AllGather exchanges the four output shards so every GPU can materialize the full output tensor.'
        }
    ];
    const ownerColors = ['#3f7fbc', '#ca8b28', '#3d9070', '#7666b8'];
    function svgElement(name, attributes = {}) {
        const node = document.createElementNS(SVG_NS, name);
        Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
        return node;
    }
    function addText(parent, text, x, y, className, anchor = 'middle') {
        const node = svgElement('text', { x, y, class: className, 'text-anchor': anchor });
        node.textContent = text;
        parent.append(node);
        return node;
    }
    class TensorParallelVisualizer {
        constructor(root) {
            this.abortController = new AbortController();
            this.currentStep = 0;
            this.root = root;
            this.mount();
        }
        mount() {
            this.root.dataset.ready = 'true';
            this.root.tabIndex = 0;
            this.root.innerHTML = `
        <header class="tp-header">
          <div>
            <div class="tp-heading-row">
              <h3 id="tp-visualizer-title">Tensor Parallelism</h3>
              <span class="tp-badge">Interactive</span>
            </div>
            <p>Follow one Column Parallel linear layer across four GPUs.</p>
          </div>
          <button class="tp-reset" type="button" data-action="reset">Reset</button>
        </header>
        <ol class="tp-steps" aria-label="Execution steps"></ol>
        <section class="tp-stage" aria-labelledby="tp-current-step">
          <div class="tp-stage-heading">
            <p class="tp-step-count"></p>
            <h4 id="tp-current-step"></h4>
          </div>
          <div class="tp-svg-wrap"></div>
        </section>
        <section class="tp-explanation" aria-label="Step explanation">
          <dl>
            <div><dt>Operation</dt><dd data-field="operation"></dd></div>
            <div><dt>Tensor shape</dt><dd data-field="shape"></dd></div>
            <div><dt>Communication</dt><dd data-field="communication"></dd></div>
            <div><dt>Why</dt><dd data-field="explanation"></dd></div>
          </dl>
        </section>
        <footer class="tp-footer">
          <button type="button" data-action="previous">Previous</button>
          <p class="tp-status" aria-live="polite"></p>
          <button type="button" data-action="next">Next</button>
        </footer>`;
            this.svg = this.buildSvg();
            this.root.querySelector('.tp-svg-wrap')?.append(this.svg);
            this.stepList = this.requireElement('.tp-steps');
            this.title = this.requireElement('#tp-current-step');
            this.status = this.requireElement('.tp-status');
            this.previousButton = this.requireElement('[data-action="previous"]');
            this.nextButton = this.requireElement('[data-action="next"]');
            this.operation = this.requireElement('[data-field="operation"]');
            this.shape = this.requireElement('[data-field="shape"]');
            this.communication = this.requireElement('[data-field="communication"]');
            this.explanation = this.requireElement('[data-field="explanation"]');
            const signal = this.abortController.signal;
            this.root.addEventListener('click', event => this.handleClick(event), { signal });
            this.root.addEventListener('keydown', event => this.handleKeydown(event), { signal });
            window.addEventListener('pagehide', () => this.destroy(), { signal, once: true });
            this.render();
        }
        requireElement(selector) {
            const element = this.root.querySelector(selector);
            if (!element)
                throw new Error(`Tensor parallel visualizer is missing ${selector}`);
            return element;
        }
        buildSvg() {
            const svg = svgElement('svg', {
                viewBox: '0 0 920 455',
                role: 'img',
                'aria-labelledby': 'tp-svg-title tp-svg-description',
                preserveAspectRatio: 'xMidYMid meet'
            });
            const title = svgElement('title', { id: 'tp-svg-title' });
            title.textContent = 'Column Parallel linear layer across four GPUs';
            const description = svgElement('desc', { id: 'tp-svg-description' });
            svg.append(title, description);
            const input = svgElement('g', { class: 'tp-svg-input' });
            input.append(svgElement('rect', { x: 275, y: 18, width: 370, height: 58, rx: 5 }));
            addText(input, 'Input X · replicated on all ranks', 460, 41, 'tp-svg-label');
            addText(input, '[B, T, H]', 460, 61, 'tp-svg-shape');
            svg.append(input);
            const xPositions = [25, 252, 479, 706];
            xPositions.forEach((x, index) => {
                const group = svgElement('g', { class: 'tp-svg-gpu', 'data-gpu': index, style: `--owner:${ownerColors[index]}` });
                group.append(svgElement('line', { x1: 460, y1: 76, x2: x + 94, y2: 112, class: 'tp-svg-input-line' }));
                group.append(svgElement('rect', { x, y: 112, width: 188, height: 205, rx: 6, class: 'tp-svg-gpu-card' }));
                addText(group, `GPU ${index}`, x + 94, 136, 'tp-svg-gpu-title');
                addText(group, `W${index} · shard ${index + 1} / 4`, x + 94, 160, 'tp-svg-small');
                addText(group, '[H, 4H / 4]', x + 94, 178, 'tp-svg-shape');
                const weight = svgElement('g', { class: 'tp-svg-weight' });
                for (let cell = 0; cell < 6; cell += 1)
                    weight.append(svgElement('rect', { x: x + 22 + cell * 24, y: 190, width: 23, height: 22, class: 'tp-svg-cell' }));
                group.append(weight);
                addText(group, 'local GEMM', x + 94, 237, 'tp-svg-operation');
                group.append(svgElement('line', { x1: x + 94, y1: 244, x2: x + 94, y2: 261, class: 'tp-svg-compute-line' }));
                addText(group, `Y${index} = XW${index}`, x + 94, 279, 'tp-svg-small');
                addText(group, '[B, T, 4H / 4]', x + 94, 297, 'tp-svg-shape');
                const output = svgElement('g', { class: 'tp-svg-output' });
                for (let cell = 0; cell < 6; cell += 1)
                    output.append(svgElement('rect', { x: x + 22 + cell * 24, y: 304, width: 23, height: 18, class: 'tp-svg-cell' }));
                group.append(output);
                svg.append(group);
            });
            const collective = svgElement('g', { class: 'tp-svg-collective' });
            collective.append(svgElement('line', { x1: 119, y1: 338, x2: 801, y2: 338, class: 'tp-svg-bus' }));
            xPositions.forEach(x => collective.append(svgElement('line', { x1: x + 94, y1: 322, x2: x + 94, y2: 338, class: 'tp-svg-bus' })));
            collective.append(svgElement('rect', { x: 250, y: 350, width: 420, height: 38, rx: 5, class: 'tp-svg-collective-box' }));
            addText(collective, 'Optional AllGather · concatenate output shards', 460, 374, 'tp-svg-label');
            const movingX = [300, 380, 460, 540];
            movingX.forEach((x, index) => collective.append(svgElement('rect', { x, y: 399, width: 80, height: 20, class: 'tp-svg-moving-shard', 'data-shard': index, style: `--owner:${ownerColors[index]}` })));
            addText(collective, 'Full Y on each rank · [B, T, 4H]', 460, 445, 'tp-svg-label');
            svg.append(collective);
            return svg;
        }
        handleClick(event) {
            const button = event.target.closest('button');
            if (!button)
                return;
            if (button.dataset.step !== undefined)
                this.setStep(Number(button.dataset.step));
            if (button.dataset.action === 'previous')
                this.setStep(this.currentStep - 1);
            if (button.dataset.action === 'next')
                this.setStep(this.currentStep + 1);
            if (button.dataset.action === 'reset')
                this.setStep(0);
        }
        handleKeydown(event) {
            if (event.target instanceof HTMLButtonElement)
                return;
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                this.setStep(this.currentStep - 1);
            }
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                this.setStep(this.currentStep + 1);
            }
            if (event.key === 'Home') {
                event.preventDefault();
                this.setStep(0);
            }
            if (event.key === 'End') {
                event.preventDefault();
                this.setStep(steps.length - 1);
            }
        }
        setStep(nextStep) {
            this.currentStep = Math.max(0, Math.min(steps.length - 1, nextStep));
            this.render();
        }
        render() {
            const step = steps[this.currentStep];
            this.stepList.innerHTML = steps.map((item, index) => `
        <li class="${index < this.currentStep ? 'is-complete' : ''} ${index === this.currentStep ? 'is-active' : ''}">
          <button type="button" data-step="${index}" ${index === this.currentStep ? 'aria-current="step"' : ''}>
            <span>${index < this.currentStep ? '✓' : index + 1}</span>${item.shortTitle}
          </button>
        </li>`).join('');
            this.title.textContent = step.title;
            this.requireElement('.tp-step-count').textContent = `Step ${this.currentStep + 1} of ${steps.length}`;
            this.status.textContent = `Step ${this.currentStep + 1} / ${steps.length}`;
            this.operation.textContent = step.operation;
            this.shape.textContent = step.shape;
            this.communication.textContent = step.communication;
            this.explanation.textContent = step.explanation;
            this.previousButton.disabled = this.currentStep === 0;
            this.nextButton.disabled = this.currentStep === steps.length - 1;
            this.nextButton.textContent = this.currentStep === steps.length - 1 ? 'Complete' : 'Next';
            this.svg.dataset.step = String(this.currentStep + 1);
            const description = this.svg.querySelector('desc');
            if (description)
                description.textContent = step.ariaLabel;
            this.root.dataset.step = String(this.currentStep + 1);
        }
        destroy() {
            this.abortController.abort();
            delete this.root.dataset.ready;
        }
    }
    const mount = () => {
        document.querySelectorAll('[data-tp-visualizer]').forEach(root => {
            if (!root.dataset.ready)
                new TensorParallelVisualizer(root);
        });
    };
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', mount, { once: true });
    else
        mount();
})();
