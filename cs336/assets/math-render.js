(() => {
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
      macros: { "\\nnz": "\\operatorname{nnz}" },
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
      errorCallback(message, error) {
        window.__mathRenderErrors.push({ message, error: String(error) });
        console.error(message, error);
      }
    });
  };
  window.renderCourseMath = render;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
