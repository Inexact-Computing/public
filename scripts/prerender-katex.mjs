/**
 * Build-time KaTeX prerender for MkDocs output.
 * 1) Renders <span/div class="arithmatex">…</…>
 * 2) Renders leftover $…$ / \(…\) / \[…\] inside HTML (e.g. raw <details> quizzes)
 *    so equations are visible even when Markdown did not wrap them.
 */
import { createRequire } from "node:module";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const katex = require(path.join(root, "docs/javascripts/vendor/katex/katex.min.js"));

const ARITH =
  /<(span|div) class="arithmatex"(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;

function stripDelimiters(raw) {
  let tex = raw.trim();
  if (tex.startsWith("\\(") && tex.endsWith("\\)")) return tex.slice(2, -2).trim();
  if (tex.startsWith("\\[") && tex.endsWith("\\]")) return tex.slice(2, -2).trim();
  if (tex.startsWith("$$") && tex.endsWith("$$")) return tex.slice(2, -2).trim();
  if (tex.startsWith("$") && tex.endsWith("$")) return tex.slice(1, -1).trim();
  return tex;
}

function decodeBasicEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function renderTex(tex, display) {
  return katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    strict: "ignore",
    output: "html",
  });
}

function wrapInline(rendered) {
  return `<span class="arithmatex" data-katex-done="1">${rendered}</span>`;
}

function wrapDisplay(rendered) {
  return `<div class="arithmatex" data-katex-done="1">${rendered}</div>`;
}

async function walkHtml(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) await walkHtml(p, out);
    else if (ent.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/** Protect regions that must not be scanned for $…$. */
function withProtectedRegions(html, fn) {
  const stubs = [];
  const protect = (re) => {
    html = html.replace(re, (m) => {
      const i = stubs.length;
      stubs.push(m);
      return `\uE000${i}\uE001`;
    });
  };
  protect(/<script\b[\s\S]*?<\/script>/gi);
  protect(/<style\b[\s\S]*?<\/style>/gi);
  protect(/<pre\b[\s\S]*?<\/pre>/gi);
  protect(/<code\b[\s\S]*?<\/code>/gi);
  protect(/<span class="arithmatex"[^>]*>[\s\S]*?<\/span>/gi);
  protect(/<div class="arithmatex"[^>]*>[\s\S]*?<\/div>/gi);
  protect(/class="katex[\s\S]*?<\/span><\/span>/gi);
  let out = fn(html);
  out = out.replace(/\uE000(\d+)\uE001/g, (_, i) => stubs[Number(i)]);
  return out;
}

function renderBareMath(html) {
  let count = 0;
  return {
    html: withProtectedRegions(html, (chunk) => {
      // Display: $$…$$ or \[…\]
      chunk = chunk.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
        try {
          count += 1;
          return wrapDisplay(renderTex(decodeBasicEntities(tex), true));
        } catch {
          return `$$${tex}$$`;
        }
      });
      chunk = chunk.replace(/\\\[([\s\S]+?)\\\]/g, (_, tex) => {
        try {
          count += 1;
          return wrapDisplay(renderTex(decodeBasicEntities(tex), true));
        } catch {
          return `\\[${tex}\\]`;
        }
      });
      // Inline: \(…\)
      chunk = chunk.replace(/\\\(([\s\S]+?)\\\)/g, (_, tex) => {
        try {
          count += 1;
          return wrapInline(renderTex(decodeBasicEntities(tex), false));
        } catch {
          return `\\(${tex}\\)`;
        }
      });
      // Inline: $…$ (no newlines; skip empty)
      chunk = chunk.replace(/\$([^\$\n]+?)\$/g, (full, tex) => {
        const t = tex.trim();
        if (!t || /^[0-9]+(\.[0-9]+)?$/.test(t)) return full; // keep plain $12$
        try {
          count += 1;
          return wrapInline(renderTex(decodeBasicEntities(t), false));
        } catch {
          return full;
        }
      });
      return chunk;
    }),
    count,
  };
}

function prerenderArithmatex(html) {
  let count = 0;
  const next = html.replace(ARITH, (full, tag, inner) => {
    if (/\bdata-katex-done=/.test(full)) return full;
    const display = String(tag).toLowerCase() === "div";
    const tex = stripDelimiters(decodeBasicEntities(inner));
    try {
      const rendered = renderTex(tex, display);
      count += 1;
      return `<${tag} class="arithmatex" data-katex-done="1">${rendered}</${tag}>`;
    } catch {
      return full;
    }
  });
  return { html: next, count };
}

function prerenderHtml(html) {
  const a = prerenderArithmatex(html);
  const b = renderBareMath(a.html);
  return { html: b.html, count: a.count + b.count };
}

const siteDir = path.join(root, "site");
const files = await walkHtml(siteDir);
let total = 0;
for (const file of files) {
  const raw = await readFile(file, "utf8");
  const { html, count } = prerenderHtml(raw);
  if (count > 0 || html !== raw) {
    await writeFile(file, html, "utf8");
    total += count;
  }
}
console.log(`prerender-katex: rendered ${total} equation(s) across ${files.length} HTML file(s)`);
