/* Same-page language navigation; use a full navigation to reload the locale/search index. */
(() => {
  'use strict';
  const script = document.currentScript;
  const localeBase = new URL('../', script.src).pathname;
  const root = localeBase.endsWith('/zh/') ? localeBase.slice(0, -3) : localeBase;
  const update = () => {
    const palette = document.querySelector('[data-md-component="palette"]');
    if (!palette) return;
    let link = document.getElementById('tutorial-language-toggle');
    if (!link) {
      link = document.createElement('a');
      link.id = 'tutorial-language-toggle';
      link.className = 'tutorial-language-toggle';
      palette.before(link);
      link.addEventListener('click', event => {
        if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        event.stopPropagation();
        update();
        window.location.assign(link.href);
      });
    }
    if (!location.pathname.startsWith(root)) return;
    const path = location.pathname.slice(root.length);
    const chinese = path.startsWith('zh/');
    let hash = location.hash;
    if (chinese && hash) {
      let target = null;
      try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch (_) { /* Keep malformed fragments unchanged. */ }
      if (target && /^H[1-6]$/.test(target.tagName)) {
        const previous = target.previousElementSibling;
        const stable = previous && (previous.matches('a[id]') ? previous : previous.matches('p') ? previous.querySelector('a[id]') : null);
        if (stable) hash = '#' + encodeURIComponent(stable.id);
      }
    }
    link.href = root + (chinese ? path.slice(3) : 'zh/' + path) + hash;
    link.textContent = chinese ? 'English' : '中文';
    link.hreflang = chinese ? 'en' : 'zh-CN';
    link.lang = chinese ? 'en' : 'zh-CN';
    link.setAttribute('aria-label', chinese ? 'Switch this page to English' : '切换到本页中文版');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', update, { once: true });
  else update();
  if (typeof document$ !== 'undefined') document$.subscribe(update);
  window.addEventListener('hashchange', update);
  window.addEventListener('pageshow', update);
})();
