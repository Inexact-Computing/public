(() => {
  let missingLibraryReported = false;

  function renderMath(root) {
    const containers = root.querySelectorAll(".arithmatex");
    if (!containers.length) return;

    if (typeof renderMathInElement !== "function") {
      if (!missingLibraryReported) {
        console.error("KaTeX auto-render is unavailable; keeping readable math source.");
        missingLibraryReported = true;
      }
      return;
    }

    containers.forEach((container) => {
      // Navigation can announce the same document more than once.
      if (container.querySelector(".katex, .katex-error")) return;
      try {
        renderMathInElement(container, {
          delimiters: [
            { left: "\\[", right: "\\]", display: true },
            { left: "\\(", right: "\\)", display: false }
          ],
          throwOnError: false,
          errorCallback: (message, error) => console.error(message, error)
        });
      } catch (error) {
        console.error("KaTeX rendering failed; keeping math source.", error);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => renderMath(document), { once: true });
  } else {
    renderMath(document);
  }

  // Material emits this event for pages loaded by instant navigation.
  if (typeof document$ !== "undefined") {
    document$.subscribe(({ body }) => renderMath(body || document));
  }
})();
