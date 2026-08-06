(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const COLORS = ['#166534', '#2563eb', '#c2410c', '#7c3aed', '#0f766e', '#be123c'];
  const FUNCTIONS = {
    abs: Math.abs, acos: Math.acos, asin: Math.asin, atan: Math.atan,
    ceil: Math.ceil, cos: Math.cos, exp: Math.exp, floor: Math.floor,
    log: Math.log, log10: Math.log10, max: Math.max, min: Math.min,
    pow: Math.pow, round: Math.round, sin: Math.sin, sqrt: Math.sqrt, tan: Math.tan
  };
  let instanceId = 0;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const svgElement = (tag, attributes = {}) => {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
  const numberLabel = (value) => {
    if (!Number.isFinite(value)) return '—';
    const absolute = Math.abs(value);
    if ((absolute > 0 && absolute < 0.001) || absolute >= 10000) return value.toExponential(2);
    return Number(value.toFixed(4)).toString();
  };

  const localUrl = (value, baseUrl) => {
    const resolved = new URL(value, baseUrl);
    if (resolved.origin !== location.origin) throw new Error('interactive assets must be same-origin');
    return resolved.href;
  };

  function tokenize(expression) {
    if (typeof expression !== 'string' || !expression.trim() || expression.length > 180) throw new Error('invalid expression');
    const tokens = [];
    const pattern = /\s*(?:(\d*\.?\d+(?:e[+-]?\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|([()+\-*/^,]))/iy;
    let index = 0;
    while (index < expression.length) {
      pattern.lastIndex = index;
      const match = pattern.exec(expression);
      if (!match) {
        if (!expression.slice(index).trim()) break;
        throw new Error(`unsupported expression token near ${expression.slice(index, index + 12)}`);
      }
      tokens.push(match[1] ? { type: 'number', value: Number(match[1]) } : match[2] ? { type: 'name', value: match[2] } : { type: match[3], value: match[3] });
      index = pattern.lastIndex;
      if (tokens.length > 160) throw new Error('expression is too complex');
    }
    return tokens;
  }

  function compileExpression(expression, allowedNames) {
    const tokens = tokenize(expression);
    let position = 0;
    const peek = (type) => tokens[position]?.type === type;
    const take = (type) => {
      if (!peek(type)) throw new Error(`expected ${type}`);
      return tokens[position++];
    };

    const parsePrimary = () => {
      if (peek('number')) {
        const value = take('number').value;
        return () => value;
      }
      if (peek('name')) {
        const name = take('name').value;
        if (peek('(')) {
          take('(');
          const args = [];
          if (!peek(')')) {
            args.push(parseExpression());
            while (peek(',')) {
              take(',');
              args.push(parseExpression());
            }
          }
          take(')');
          if (!FUNCTIONS[name]) throw new Error(`unsupported function ${name}`);
          return (scope) => FUNCTIONS[name](...args.map((argument) => argument(scope)));
        }
        if (name === 'pi') return () => Math.PI;
        if (name === 'e') return () => Math.E;
        if (!allowedNames.has(name)) throw new Error(`unknown variable ${name}`);
        return (scope) => scope[name];
      }
      if (peek('(')) {
        take('(');
        const inner = parseExpression();
        take(')');
        return inner;
      }
      throw new Error('expected a number, variable, or parenthesized expression');
    };

    const parsePower = () => {
      const left = parsePrimary();
      if (!peek('^')) return left;
      take('^');
      const right = parseUnary();
      return (scope) => Math.pow(left(scope), right(scope));
    };

    const parseUnary = () => {
      if (peek('+')) {
        take('+');
        return parseUnary();
      }
      if (peek('-')) {
        take('-');
        const value = parseUnary();
        return (scope) => -value(scope);
      }
      return parsePower();
    };

    const parseTerm = () => {
      let left = parseUnary();
      while (peek('*') || peek('/')) {
        const operator = tokens[position++].type;
        const right = parseUnary();
        const previous = left;
        left = operator === '*' ? (scope) => previous(scope) * right(scope) : (scope) => previous(scope) / right(scope);
      }
      return left;
    };

    const parseExpression = () => {
      let left = parseTerm();
      while (peek('+') || peek('-')) {
        const operator = tokens[position++].type;
        const right = parseTerm();
        const previous = left;
        left = operator === '+' ? (scope) => previous(scope) + right(scope) : (scope) => previous(scope) - right(scope);
      }
      return left;
    };

    const evaluator = parseExpression();
    if (position !== tokens.length) throw new Error('unexpected expression suffix');
    return evaluator;
  }

  function buildPanel(spec, kindLabel) {
    const panel = element('section', 'cs-interactive-panel');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', spec.title);
    const header = element('header', 'cs-interactive-header');
    const copy = element('div');
    copy.append(element('p', 'cs-interactive-kicker', 'Interactive learning'));
    copy.append(element('h3', 'cs-interactive-title', spec.title));
    if (spec.description) copy.append(element('p', 'cs-interactive-description', spec.description));
    header.append(copy, element('span', 'cs-interactive-badge', kindLabel));
    panel.append(header);
    const body = element('div', 'cs-interactive-body');
    panel.append(body);
    return { panel, body };
  }

  function appendNotes(body, spec, specUrl) {
    if (spec.caption) body.append(element('p', 'cs-interactive-caption', spec.caption));
    if (spec.source?.url) {
      const source = element('p', 'cs-interactive-source');
      source.append('来源：');
      const link = element('a', '', spec.source.label || spec.source.url);
      const resolved = new URL(spec.source.url, specUrl);
      if (!['http:', 'https:'].includes(resolved.protocol)) throw new Error('interactive source must use http or https');
      link.href = resolved.href;
      if (resolved.origin !== location.origin) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      source.append(link);
      body.append(source);
    }
  }

  function renderFunctionPlot(spec, specUrl) {
    const { panel, body } = buildPanel(spec, 'Function plot');
    const parameters = Array.isArray(spec.parameters) ? spec.parameters : [];
    const scope = { x: 0 };
    const allowed = new Set(['x']);
    const controls = element('div', 'cs-interactive-controls');
    parameters.forEach((parameter) => {
      allowed.add(parameter.id);
      scope[parameter.id] = Number(parameter.value);
    });
    const series = spec.series.map((item, index) => ({
      ...item,
      color: item.color || COLORS[index % COLORS.length],
      evaluate: compileExpression(item.expression, allowed)
    }));
    const plot = element('div', 'cs-interactive-plot');
    const legend = element('div', 'cs-interactive-legend');
    series.forEach((item) => {
      const entry = element('span');
      const swatch = element('i', 'cs-interactive-swatch');
      swatch.style.background = item.color;
      entry.append(swatch, document.createTextNode(item.label || item.expression));
      legend.append(entry);
    });

    const draw = () => {
      const width = 760;
      const height = 360;
      const margin = { left: 62, right: 20, top: 20, bottom: 48 };
      const xDomain = spec.xDomain.map(Number);
      const samples = clamp(Number(spec.samples) || 240, 64, 600);
      const sampled = series.map((item) => {
        const values = [];
        for (let index = 0; index < samples; index += 1) {
          const x = xDomain[0] + (xDomain[1] - xDomain[0]) * index / (samples - 1);
          scope.x = x;
          const y = Number(item.evaluate(scope));
          values.push({ x, y: Number.isFinite(y) ? y : null });
        }
        return values;
      });
      const finite = sampled.flat().map((point) => point.y).filter(Number.isFinite);
      if (!finite.length) throw new Error('function plot produced no finite values');
      let yDomain = Array.isArray(spec.yDomain) ? spec.yDomain.map(Number) : [Math.min(...finite), Math.max(...finite)];
      if (yDomain[0] === yDomain[1]) yDomain = [yDomain[0] - 1, yDomain[1] + 1];
      if (!spec.yDomain) {
        const padding = (yDomain[1] - yDomain[0]) * .08;
        yDomain = [yDomain[0] - padding, yDomain[1] + padding];
      }
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const xScale = (value) => margin.left + (value - xDomain[0]) / (xDomain[1] - xDomain[0]) * innerWidth;
      const yScale = (value) => margin.top + (yDomain[1] - value) / (yDomain[1] - yDomain[0]) * innerHeight;
      const svg = svgElement('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': spec.title });
      const clipId = `cs-plot-clip-${instanceId++}`;
      const defs = svgElement('defs');
      const clip = svgElement('clipPath', { id: clipId });
      clip.append(svgElement('rect', { x: margin.left, y: margin.top, width: innerWidth, height: innerHeight }));
      defs.append(clip);
      svg.append(defs);
      for (let tick = 0; tick <= 5; tick += 1) {
        const xValue = xDomain[0] + (xDomain[1] - xDomain[0]) * tick / 5;
        const yValue = yDomain[0] + (yDomain[1] - yDomain[0]) * tick / 5;
        const x = xScale(xValue);
        const y = yScale(yValue);
        svg.append(svgElement('line', { x1: x, y1: margin.top, x2: x, y2: height - margin.bottom, class: 'cs-interactive-grid' }));
        svg.append(svgElement('line', { x1: margin.left, y1: y, x2: width - margin.right, y2: y, class: 'cs-interactive-grid' }));
        const xText = svgElement('text', { x, y: height - 23, 'text-anchor': 'middle', class: 'cs-interactive-tick' });
        xText.textContent = numberLabel(xValue);
        const yText = svgElement('text', { x: margin.left - 10, y: y + 4, 'text-anchor': 'end', class: 'cs-interactive-tick' });
        yText.textContent = numberLabel(yValue);
        svg.append(xText, yText);
      }
      if (xDomain[0] <= 0 && xDomain[1] >= 0) svg.append(svgElement('line', { x1: xScale(0), y1: margin.top, x2: xScale(0), y2: height - margin.bottom, class: 'cs-interactive-axis' }));
      if (yDomain[0] <= 0 && yDomain[1] >= 0) svg.append(svgElement('line', { x1: margin.left, y1: yScale(0), x2: width - margin.right, y2: yScale(0), class: 'cs-interactive-axis' }));
      sampled.forEach((points, index) => {
        let path = '';
        let drawing = false;
        points.forEach((point) => {
          if (point.y === null || Math.abs(point.y) > 1e12) {
            drawing = false;
            return;
          }
          path += `${drawing ? 'L' : 'M'}${xScale(point.x).toFixed(2)},${yScale(point.y).toFixed(2)} `;
          drawing = true;
        });
        svg.append(svgElement('path', { d: path.trim(), stroke: series[index].color, class: 'cs-interactive-series', 'clip-path': `url(#${clipId})` }));
      });
      if (spec.xLabel) {
        const label = svgElement('text', { x: margin.left + innerWidth / 2, y: height - 5, 'text-anchor': 'middle', class: 'cs-interactive-axis-label' });
        label.textContent = spec.xLabel;
        svg.append(label);
      }
      if (spec.yLabel) {
        const label = svgElement('text', { x: 15, y: margin.top + innerHeight / 2, transform: `rotate(-90 15 ${margin.top + innerHeight / 2})`, 'text-anchor': 'middle', class: 'cs-interactive-axis-label' });
        label.textContent = spec.yLabel;
        svg.append(label);
      }
      plot.replaceChildren(svg);
    };

    parameters.forEach((parameter) => {
      const control = element('div', 'cs-interactive-control');
      const id = `cs-parameter-${instanceId++}`;
      const label = element('label', '', parameter.label || parameter.id);
      label.htmlFor = id;
      const output = element('output', '', numberLabel(scope[parameter.id]));
      output.htmlFor = id;
      const input = element('input');
      input.type = 'range';
      input.id = id;
      input.min = parameter.min;
      input.max = parameter.max;
      input.step = parameter.step;
      input.value = parameter.value;
      input.addEventListener('input', () => {
        scope[parameter.id] = Number(input.value);
        output.value = numberLabel(scope[parameter.id]);
        draw();
      });
      control.append(label, output, input);
      controls.append(control);
    });
    if (parameters.length) body.append(controls);
    body.append(plot, legend);
    draw();
    appendNotes(body, spec, specUrl);
    return panel;
  }

  function colorFor(value, minimum, maximum, diverging) {
    if (diverging) {
      const bound = Math.max(Math.abs(minimum), Math.abs(maximum)) || 1;
      const t = clamp((value / bound + 1) / 2, 0, 1);
      if (t < .5) return `rgb(${Math.round(59 + (247 - 59) * t * 2)},${Math.round(130 + (247 - 130) * t * 2)},${Math.round(246 + (247 - 246) * t * 2)})`;
      const u = (t - .5) * 2;
      return `rgb(${Math.round(247 + (190 - 247) * u)},${Math.round(247 + (24 - 247) * u)},${Math.round(247 + (60 - 247) * u)})`;
    }
    const t = clamp((value - minimum) / ((maximum - minimum) || 1), 0, 1);
    return `rgb(${Math.round(238 + (22 - 238) * t)},${Math.round(241 + (101 - 241) * t)},${Math.round(237 + (52 - 237) * t)})`;
  }

  function renderMatrix(spec, specUrl) {
    const { panel, body } = buildPanel(spec, 'Matrix explorer');
    const frames = spec.frames?.length ? spec.frames : [{ label: spec.title, values: spec.values }];
    const frameHeader = element('div', 'cs-matrix-frame');
    frameHeader.append(element('span', '', spec.frameLabel || '当前视图'));
    const frameName = element('strong', '', frames[0].label || '1');
    frameHeader.append(frameName);
    const plot = element('div', 'cs-interactive-plot');
    const allValues = frames.flatMap((frame) => frame.values.flat()).map(Number).filter(Number.isFinite);
    const minimum = Number.isFinite(spec.valueDomain?.[0]) ? Number(spec.valueDomain[0]) : Math.min(...allValues);
    const maximum = Number.isFinite(spec.valueDomain?.[1]) ? Number(spec.valueDomain[1]) : Math.max(...allValues);
    const diverging = spec.colorScale === 'diverging';

    const draw = (frameIndex) => {
      const frame = frames[frameIndex];
      frameName.textContent = frame.label || `${frameIndex + 1}`;
      const values = frame.values;
      const rows = values.length;
      const columns = values[0].length;
      const labelSpace = rows <= 12 && columns <= 12 ? 54 : 12;
      const cell = Math.min(44, Math.max(12, 560 / Math.max(rows, columns)));
      const width = labelSpace + columns * cell + 16;
      const height = labelSpace + rows * cell + 16;
      const svg = svgElement('svg', { viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': `${spec.title}：${frameName.textContent}` });
      values.forEach((row, rowIndex) => row.forEach((rawValue, columnIndex) => {
        const value = Number(rawValue);
        svg.append(svgElement('rect', { x: labelSpace + columnIndex * cell, y: labelSpace + rowIndex * cell, width: cell - 1, height: cell - 1, rx: 2, fill: colorFor(value, minimum, maximum, diverging) }));
        if (rows * columns <= 64) {
          const text = svgElement('text', { x: labelSpace + (columnIndex + .5) * cell, y: labelSpace + (rowIndex + .5) * cell + 4, 'text-anchor': 'middle', class: 'cs-interactive-tick' });
          text.textContent = numberLabel(value);
          svg.append(text);
        }
      }));
      if (labelSpace > 12) {
        (spec.columnLabels || []).forEach((label, index) => {
          const text = svgElement('text', { x: labelSpace + (index + .5) * cell, y: labelSpace - 12, 'text-anchor': 'middle', class: 'cs-interactive-tick' });
          text.textContent = label;
          svg.append(text);
        });
        (spec.rowLabels || []).forEach((label, index) => {
          const text = svgElement('text', { x: labelSpace - 9, y: labelSpace + (index + .5) * cell + 4, 'text-anchor': 'end', class: 'cs-interactive-tick' });
          text.textContent = label;
          svg.append(text);
        });
      }
      plot.replaceChildren(svg);
    };

    body.append(frameHeader);
    if (frames.length > 1) {
      const controls = element('div', 'cs-interactive-controls');
      const control = element('div', 'cs-interactive-control');
      const id = `cs-matrix-frame-${instanceId++}`;
      const label = element('label', '', spec.controlLabel || '切换视图');
      label.htmlFor = id;
      const output = element('output', '', frames[0].label || '1');
      output.htmlFor = id;
      const input = element('input');
      input.type = 'range';
      input.id = id;
      input.min = '0';
      input.max = String(frames.length - 1);
      input.step = '1';
      input.value = '0';
      input.addEventListener('input', () => {
        const index = Number(input.value);
        output.value = frames[index].label || `${index + 1}`;
        draw(index);
      });
      control.append(label, output, input);
      controls.append(control);
      body.append(controls);
    }
    body.append(plot);
    const legend = element('div', 'cs-matrix-legend');
    legend.append(element('span', '', numberLabel(minimum)), element('i', 'cs-matrix-gradient'), element('span', '', numberLabel(maximum)));
    body.append(legend);
    draw(0);
    appendNotes(body, spec, specUrl);
    return panel;
  }

  function renderStepper(spec, specUrl) {
    const { panel, body } = buildPanel(spec, 'Step-by-step');
    const stage = element('div', 'cs-stepper-stage');
    const copy = element('div');
    const visual = element('div', 'cs-stepper-visual');
    stage.append(copy, visual);
    const controls = element('div', 'cs-stepper-controls');
    const previous = element('button', '', '上一步');
    previous.type = 'button';
    const progress = element('span', 'cs-stepper-progress');
    progress.setAttribute('aria-live', 'polite');
    const next = element('button', '', '下一步');
    next.type = 'button';
    controls.append(previous, progress, next);
    let current = 0;

    const draw = () => {
      const step = spec.steps[current];
      copy.replaceChildren();
      visual.replaceChildren();
      copy.append(element('p', 'cs-stepper-index', `Step ${current + 1}`));
      copy.append(element('h4', '', step.title));
      if (step.body) copy.append(element('p', 'cs-stepper-text', step.body));
      if (step.formula) {
        const formula = element('div', 'cs-stepper-formula');
        if (window.katex?.render) window.katex.render(step.formula, formula, { displayMode: true, throwOnError: false });
        else formula.textContent = step.formula;
        copy.append(formula);
      }
      if (step.image) {
        const image = element('img');
        image.src = localUrl(step.image, specUrl);
        image.alt = step.imageAlt || step.title;
        visual.append(image);
      } else {
        visual.hidden = true;
      }
      visual.hidden = !step.image;
      progress.textContent = `${current + 1} / ${spec.steps.length}`;
      previous.disabled = current === 0;
      next.disabled = current === spec.steps.length - 1;
    };
    previous.addEventListener('click', () => { current = Math.max(0, current - 1); draw(); });
    next.addEventListener('click', () => { current = Math.min(spec.steps.length - 1, current + 1); draw(); });
    panel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' && current > 0) { current -= 1; draw(); }
      if (event.key === 'ArrowRight' && current < spec.steps.length - 1) { current += 1; draw(); }
    });
    body.append(stage, controls);
    draw();
    appendNotes(body, spec, specUrl);
    return panel;
  }

  async function mount(host) {
    const source = host.dataset.interactiveSrc;
    if (!source) return;
    host.setAttribute('aria-busy', 'true');
    try {
      const specUrl = localUrl(source, location.href);
      const response = await fetch(specUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error(`interactive spec ${response.status}`);
      const spec = await response.json();
      if (spec.version !== 1 || !spec.title || !spec.kind) throw new Error('invalid interactive spec');
      let panel;
      if (spec.kind === 'function-plot') panel = renderFunctionPlot(spec, specUrl);
      else if (spec.kind === 'matrix-heatmap') panel = renderMatrix(spec, specUrl);
      else if (spec.kind === 'stepper') panel = renderStepper(spec, specUrl);
      else throw new Error(`unsupported interactive kind ${spec.kind}`);
      host.replaceChildren(panel);
      host.classList.add('is-ready');
    } catch (error) {
      host.classList.add('is-error');
      const message = element('p', 'course-interactive-error', '交互内容暂时不可用，已保留静态图与正文说明。');
      host.append(message);
      console.warn('[CourseStack interactive]', error);
    } finally {
      host.removeAttribute('aria-busy');
    }
  }

  document.querySelectorAll('.course-interactive[data-interactive-src]').forEach((host) => mount(host));
}());
