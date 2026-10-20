/* One palette for reading pages and same-origin teaching tools. */
(() => {
  'use strict';
  const key = 'inexact-computing.public.theme.v1';
  const isTheme = value => value === 'light' || value === 'dark';
  const stored = () => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const remember = theme => {
    try { localStorage.setItem(key, theme); } catch (_) { /* Private mode: session-only. */ }
  };
  const boot = () => {
    const palette = document.querySelector('[data-md-component="palette"]');
    const lab = !palette;
    let parentBody = null;
    if (lab) {
      try { if (window.frameElement) parentBody = window.parent.document.body; } catch (_) { /* Standalone fallback. */ }
      document.body.classList.toggle('tutorial-practice', Boolean(document.getElementById('theme')));
    }
    const current = () => {
      const scheme = (parentBody || document.body).getAttribute('data-md-color-scheme');
      return scheme ? (scheme === 'slate' ? 'dark' : 'light') :
        (isTheme(stored()) ? stored() : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    };
    let button = lab ? document.getElementById('theme') : document.createElement('button');
    if (!lab) {
      button.type = 'button';
      button.id = 'tutorial-theme-toggle';
      button.className = 'tutorial-theme-toggle';
      palette.append(button);
      palette.classList.add('tutorial-theme-enhanced');
    }
    const paint = theme => {
      if (lab) {
        document.documentElement.dataset.tutorialTheme = theme;
        document.body.dataset.tutorialTheme = theme;
      }
      if (button) {
        button.textContent = theme === 'dark' ? '☾ Dark' : '☀ Light';
        button.setAttribute('aria-label', 'Dark theme');
        button.setAttribute('aria-pressed', String(theme === 'dark'));
        button.title = 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode';
      }
    };
    const set = theme => {
      if (!isTheme(theme)) return;
      if (parentBody) {
        const parentToggle = window.parent.document.getElementById('tutorial-theme-toggle');
        if (parentToggle && theme !== current()) parentToggle.click();
        return;
      }
      if (palette) {
        const scheme = theme === 'dark' ? 'slate' : 'default';
        const radio = palette.querySelector('input[data-md-color-scheme="' + scheme + '"]');
        if (radio && !radio.checked) radio.click();
      }
      remember(theme);
      paint(theme);
    };
    if (button) button.addEventListener('click', event => {
      // Replace the two practice tools' local cycle; no reload or input reset.
      event.stopImmediatePropagation();
      set(current() === 'dark' ? 'light' : 'dark');
      button.focus({ preventScroll: true });
    }, true);
    const body = parentBody || document.body;
    const observer = new MutationObserver(() => paint(current()));
    observer.observe(body, { attributes: true, attributeFilter: ['data-md-color-scheme'] });
    window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
    window.addEventListener('pageshow', () => {
      observer.observe(body, { attributes: true, attributeFilter: ['data-md-color-scheme'] });
      paint(current());
    });
    window.addEventListener('storage', event => {
      if (!parentBody && event.key === key && isTheme(event.newValue)) set(event.newValue);
    });
    if (!parentBody && isTheme(stored())) set(stored());
    else paint(current());
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
