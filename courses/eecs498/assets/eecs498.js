(function () {
  document.querySelectorAll('.depth-check[data-answer]').forEach((check) => {
    const answer = check.dataset.answer;
    const feedback = check.querySelector('.depth-feedback, .check-feedback');
    if (feedback) {
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');
      feedback.setAttribute('aria-atomic', 'true');
    }
    check.querySelectorAll('button[data-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        check.querySelectorAll('button[data-choice]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        const correct = button.dataset.choice === answer;
        if (!feedback) return;
        feedback.textContent = correct
          ? `正确。${check.dataset.correct || ''}`
          : (button.dataset.diagnosis || check.dataset.incorrect || '再沿着对象与 shape 重新推一次。');
        feedback.dataset.state = correct ? 'correct' : 'incorrect';
      });
    });
  });

  const storageKey = 'coursestack:progress:eecs498:v1';
  const readProgress = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); }
    catch (_) { return {}; }
  };
  const writeProgress = (value) => {
    try { localStorage.setItem(storageKey, JSON.stringify(value)); }
    catch (_) { /* private browsing can deny storage */ }
  };

  const page = document.querySelector('.page');
  if (page) {
    const filename = location.pathname.split('/').pop();
    const reviewMap = {
      '0001-neural-networks-are-functions.html': ['a1', 'A1 · Tensor Foundations'],
      '0002-backprop-computational-graphs.html': ['a2', 'A2 · Classifiers'],
      '0003-optimization-training-dynamics.html': ['a2', 'A2 · Classifiers'],
      '0004-cnn-spatial-structure.html': ['a3', 'A3 · Deep Networks'],
      '0005-vision-representations.html': ['a4', 'A4 · Representations & Sequences'],
      '0006-detection-structured-prediction.html': ['a5', 'A5 · Detection'],
      '0007-rnn-through-time.html': ['a4', 'A4 · Representations & Sequences'],
      '0008-lstm-memory.html': ['a4', 'A4 · Representations & Sequences'],
      '0009-transformer-token-embedding.html': ['a4', 'A4 · Representations & Sequences'],
      '0010-transformer-attention-routing.html': ['a4', 'A4 · Representations & Sequences'],
      '0011-transformer-encoder-decoder.html': ['a4', 'A4 · Representations & Sequences'],
      '0012-transformer-seq2seq-training.html': ['a4', 'A4 · Representations & Sequences'],
      '0013-transformer-to-modern-llms.html': ['a4', 'A4 · Representations & Sequences'],
      '0014-generative-models.html': ['a6', 'A6 · Generative Models'],
    };
    const state = readProgress();
    const review = reviewMap[filename];
    if (review) {
      const bridge = document.createElement('aside');
      bridge.className = 'eecs-review-bridge';
      bridge.innerHTML = `<div><strong>Learn → Inspect → Explain</strong><p>在 Review Lab 中回到真实代码，用 tiny input、prediction 和 evidence 验证这一课。</p></div><a href="../reviews/${review[0]}.html">进入 ${review[1]} →</a>`;
      const end = document.querySelector('#pb-page-end');
      page.insertBefore(bridge, end || null);
    }
    const wrap = document.createElement('section');
    wrap.className = 'eecs-completion';
    wrap.setAttribute('aria-label', '本课程学习进度');
    wrap.innerHTML = `<p><strong>个人复习进度</strong><br>仅写入 EECS498 自己的浏览器 key，不会影响 CS336 或其他课程。</p><button type="button" aria-pressed="${Boolean(state[filename])}">${state[filename] ? '已完成本课 ✓' : '标记本课已完成'}</button>`;
    const button = wrap.querySelector('button');
    button.addEventListener('click', () => {
      const next = readProgress();
      next[filename] = !next[filename];
      if (!next[filename]) delete next[filename];
      writeProgress(next);
      button.setAttribute('aria-pressed', String(Boolean(next[filename])));
      button.textContent = next[filename] ? '已完成本课 ✓' : '标记本课已完成';
    });
    const end = document.querySelector('#pb-page-end');
    page.insertBefore(wrap, end || null);
    return;
  }

  const courseStats = document.querySelector('.course-stats');
  const learningPath = document.querySelector('#learning-path');
  if (!courseStats || !learningPath) return;
  const map = document.createElement('section');
  map.className = 'eecs-map';
  map.setAttribute('aria-labelledby', 'eecs-map-title');
  map.innerHTML = `
    <div class="eecs-map-head">
      <div><p class="eecs-map-kicker">Course map · representation flow</p><h2 id="eecs-map-title">不是六份作业，而是一条 representation 不断变形的路线。</h2></div>
      <p class="eecs-map-intro">每个节点都回到仓库中的真实实现。Transformer 被视觉突出，因为 CNN 与 RNN 提供的历史问题，正是在这里汇合。</p>
    </div>
    <ol class="eecs-map-flow">
      <li><strong>Data</strong><span>A1 · tensors / KNN</span></li>
      <li><strong>Representation</strong><span>A2 · scores / hidden</span></li>
      <li><strong>Optimization</strong><span>A3 · SGD / Adam</span></li>
      <li><strong>Spatial Models</strong><span>A3–A5 · CNN / detection</span></li>
      <li><strong>Sequence Models</strong><span>A4 · RNN / LSTM</span></li>
      <li><strong>Attention</strong><span>A4 + WI22 A5</span></li>
      <li class="transformer"><strong>Transformer</strong><span>WI22 A5 · QKV / seq2seq</span></li>
      <li><strong>Generation</strong><span>A6 · VAE / GAN</span></li>
    </ol>
    <p class="eecs-progress-note" id="eecs-progress-note">个人复习进度：正在读取…</p>`;
  courseStats.insertAdjacentElement('afterend', map);

  fetch('api/status.json', { cache: 'no-store' }).then((response) => response.json()).then((status) => {
    const state = readProgress();
    const completed = status.lectures.filter((lecture) => state[lecture.lessonFile.split('/').pop()]).length;
    const total = status.lectures.length;
    const percent = total ? Math.round(completed / total * 100) : 0;
    document.querySelector('#eecs-progress-note').textContent = `个人复习进度：${completed} / ${total} · ${percent}% · storage key: ${storageKey}`;
    const renderPersonalProgress = () => {
      const completedMetric = document.querySelector('#metric-completed');
      const progressMetric = document.querySelector('#metric-progress');
      const progressFill = document.querySelector('#progress-fill');
      if (completedMetric) completedMetric.textContent = `${completed}/${total}`;
      if (progressMetric) progressMetric.textContent = `${percent}%`;
      if (progressFill) progressFill.style.width = `${percent}%`;
    };
    renderPersonalProgress();
    const resultStatus = document.querySelector('#result-status');
    if (resultStatus && resultStatus.textContent.includes('正在载入')) {
      const observer = new MutationObserver(() => {
        if (resultStatus.textContent.includes('正在载入')) return;
        observer.disconnect();
        renderPersonalProgress();
      });
      observer.observe(resultStatus, { childList: true, subtree: true, characterData: true });
    }
    status.lectures.forEach((lecture) => {
      if (!state[lecture.lessonFile.split('/').pop()]) return;
      const link = document.querySelector(`a[href="${lecture.lessonFile}"]`);
      if (link) link.setAttribute('data-review-complete', 'true');
    });
  }).catch(() => {
    document.querySelector('#eecs-progress-note').textContent = '个人复习进度暂时无法读取。';
  });
})();
