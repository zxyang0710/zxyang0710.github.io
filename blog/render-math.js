if (window.katex) {
  for (const formula of document.querySelectorAll("[data-tex]")) {
    window.katex.render(formula.dataset.tex, formula, {
      displayMode: formula.dataset.display === "true",
      throwOnError: false
    });
  }
}
