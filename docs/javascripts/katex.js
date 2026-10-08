/* KaTeX for arithmatex — client fallback + instant-navigation re-render. */
function stripDelimiters(raw) {
  let tex = (raw || "").trim();
  if (tex.startsWith("\\(") && tex.endsWith("\\)")) return tex.slice(2, -2).trim();
  if (tex.startsWith("\\[") && tex.endsWith("\\]")) return tex.slice(2, -2).trim();
  if (tex.startsWith("$$") && tex.endsWith("$$")) return tex.slice(2, -2).trim();
  if (tex.startsWith("$") && tex.endsWith("$")) return tex.slice(1, -1).trim();
  return tex;
}

function renderArithmatex(root) {
  if (!window.katex) return false;
  const scope = root || document.body;
  if (!scope || !scope.querySelectorAll) return false;
  scope.querySelectorAll("span.arithmatex, div.arithmatex").forEach((el) => {
    if (el.getAttribute("data-katex-done") === "1") return;
    // Already contains KaTeX HTML from build-time prerender
    if (el.querySelector(".katex")) {
      el.setAttribute("data-katex-done", "1");
      return;
    }
    const display = el.tagName.toLowerCase() === "div";
    const tex = stripDelimiters(el.textContent || "");
    try {
      katex.render(tex, el, {
        displayMode: display,
        throwOnError: false,
        strict: "ignore",
        output: "html"
      });
      el.setAttribute("data-katex-done", "1");
    } catch (err) {
      el.setAttribute("title", String(err));
    }
  });
  return true;
}

function scheduleRender(root) {
  if (renderArithmatex(root)) return;
  let tries = 0;
  const id = setInterval(() => {
    tries += 1;
    if (renderArithmatex(root) || tries > 40) clearInterval(id);
  }, 50);
}

if (window.document$) {
  document$.subscribe((event) => {
    const body = event && event.body ? event.body : document.body;
    scheduleRender(body);
  });
}

document.addEventListener("DOMContentLoaded", () => scheduleRender(document.body));
window.addEventListener("load", () => scheduleRender(document.body));
