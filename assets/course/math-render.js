(() => {
  const fallbackColor = "#5f6670";
  const macros = {
    "\\nnz": "\\operatorname{nnz}",
    "\\prev": "\\operatorname{prev}",
    "\\avec": "\\mathbf{a}",
    "\\bvec": "\\mathbf{b}",
    "\\qvec": "\\mathbf{q}",
    "\\uvec": "\\mathbf{u}",
    "\\vvec": "\\mathbf{v}",
    "\\xvec": "\\mathbf{x}",
    "\\yvec": "\\mathbf{y}",
    "\\xhat": "\\widehat{\\mathbf{x}}",
    "\\zerovec": "\\mathbf{0}",
    "\\rij": "r_{ij}"
  };

  const render = (root = document.body) => {
    if (typeof window.renderMathInElement !== "function") return;
    window.__mathRenderErrors = [];
    window.renderMathInElement(root, {
      delimiters: [
        { left: "\\[", right: "\\]", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false,
      strict: "warn",
      errorColor: fallbackColor,
      macros,
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
      errorCallback(message, error) {
        window.__mathRenderErrors.push({ message, error: String(error) });
        console.error(message, error);
      }
    });

    const fallbackRgb = "rgb(95, 102, 112)";
    const fallbackNodes = [...root.querySelectorAll(".katex span")].filter((node) =>
      node.classList.contains("text")
      && node.hasAttribute("style")
      && getComputedStyle(node).color === fallbackRgb
    );
    const formulas = [...new Set(fallbackNodes.map((node) => node.textContent.trim()).filter(Boolean))];
    formulas.forEach((formula) => {
      window.__mathRenderErrors.push({
        message: "KaTeX rendered an unsupported expression with the readable fallback",
        error: formula
      });
    });
    fallbackNodes.forEach((node) => {
      const formula = node.closest(".katex");
      if (!formula) return;
      formula.classList.add("pb-math-fallback");
      formula.title ||= "此公式包含暂不支持的 LaTeX 命令";
    });
  };
  window.renderCourseMath = render;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
