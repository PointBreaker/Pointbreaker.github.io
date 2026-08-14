(function () {
  const page = document.querySelector('.page');
  if (!page) return;

  const languageMarkers = {
    c: 'c', cpp: 'cpp', css: 'css', html: 'html', javascript: 'javascript', js: 'javascript',
    json: 'json', markup: 'html', py: 'python', python: 'python', ts: 'typescript',
    typescript: 'typescript', xml: 'xml', bash: 'bash', sh: 'bash', shell: 'bash'
  };
  const formatLanguages = new Set(['python', 'javascript', 'typescript', 'json', 'css', 'html', 'markup', 'xml', 'c', 'cpp']);

  const clean = (source) => {
    const lines = source.replace(/\r\n?/g, '\n').split('\n');
    while (lines.length && !lines[0].trim()) lines.shift();
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
    const nonBlank = lines.filter((line) => line.trim());
    const commonIndent = nonBlank.length
      ? Math.min(...nonBlank.map((line) => (line.match(/^[ \t]*/) || [''])[0].replace(/\t/g, '  ').length))
      : 0;
    return lines.map((line) => {
      const expanded = line.replace(/^\t+/, (tabs) => '  '.repeat(tabs.length));
      const indent = (expanded.match(/^ */) || [''])[0].length;
      return expanded.slice(Math.min(commonIndent, indent)).trimEnd();
    }).join('\n');
  };

  const format = (source, language) => {
    const cleaned = clean(source);
    if (language !== 'json') return cleaned;
    try {
      return JSON.stringify(JSON.parse(cleaned), null, 2);
    } catch (_) {
      return cleaned;
    }
  };

  const languageOf = (pre, code) => {
    const className = [...code.classList, ...pre.classList].find((name) => name.startsWith('language-'));
    return className ? className.slice(9).toLowerCase() : '';
  };

  const addCopyButton = (pre, code) => {
    if (pre.querySelector('.pb-copy-code')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pb-copy-code';
    button.textContent = '复制';
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = '已复制';
        setTimeout(() => { button.textContent = '复制'; }, 1400);
      } catch (_) {
        button.textContent = '复制失败';
      }
    });
    pre.appendChild(button);
  };

  const enhancePre = (pre) => {
    if (pre.dataset.pbCodeFormatReady === 'true') return;
    const code = pre.querySelector(':scope > code');
    if (!code) return;
    pre.dataset.pbCodeFormatReady = 'true';
    const language = languageOf(pre, code);
    if (language) {
      pre.classList.add(`language-${language}`);
      code.classList.add(`language-${language}`);
      pre.dataset.language ||= language;
    }
    if (pre.dataset.pbPromoted === 'true' && window.Prism) window.Prism.highlightElement(code);
    addCopyButton(pre, code);
    if (!formatLanguages.has(language)) return;

    const original = code.textContent;
    const formatted = format(original, language);
    if (formatted.trim() === original.trim()) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pb-format-code';
    button.textContent = '格式化';
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const showingFormatted = button.getAttribute('aria-pressed') === 'true';
      code.textContent = showingFormatted ? original : formatted;
      button.textContent = showingFormatted ? '格式化' : '原文';
      button.setAttribute('aria-pressed', String(!showingFormatted));
      if (window.Prism) window.Prism.highlightElement(code);
    });
    pre.appendChild(button);
  };

  const promoteMultilineInlineCode = (root) => {
    root.querySelectorAll('code').forEach((inlineCode) => {
      if (inlineCode.closest('pre') || !/[\r\n]/.test(inlineCode.textContent)) return;
      const lines = inlineCode.textContent.replace(/\r\n?/g, '\n').split('\n');
      const language = languageMarkers[lines[0].trim().toLowerCase()] || '';
      if (language) lines.shift();
      const code = document.createElement('code');
      code.textContent = clean(lines.join('\n'));
      if (language) code.classList.add(`language-${language}`);
      const pre = document.createElement('pre');
      if (language) pre.classList.add(`language-${language}`);
      pre.dataset.pbPromoted = 'true';
      pre.appendChild(code);
      inlineCode.replaceWith(pre);
    });
  };

  const enhance = (root = page) => {
    promoteMultilineInlineCode(root);
    root.querySelectorAll('pre').forEach(enhancePre);
  };

  window.PointBreakerCodeFormat = { clean, format, enhance };
  enhance();
})();
