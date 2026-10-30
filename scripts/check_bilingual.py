"""Verify paired routes, canonical URLs and local links without network access."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
BASE = "https://inexact-computing.github.io/public/"

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.ids, self.links, self.canonical = set(), [], None
        self.feed(path.read_text(encoding="utf-8"))
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.add(a["id"])
        if tag in ("a", "img", "iframe", "script", "link"):
            ref = a.get("href") or a.get("src")
            if ref:
                self.links.append(ref)
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href")

pages = {}
def parse(path):
    if path not in pages:
        pages[path] = Page(path)
    return pages[path]

for locale, docs in (("", ROOT / "docs"), ("zh", ROOT / "translations/zh/docs")):
    md = list(docs.rglob("*.md"))
    labs = list((docs / "labs").glob("*.html"))
    assert len(md) == 18 and len(labs) == 8, (locale, len(md), len(labs))
    for source in md:
        rel = source.relative_to(docs)
        route = Path("index.html") if rel.as_posix() == "index.md" else rel.with_suffix("") / "index.html"
        target = SITE / locale / route
        page = parse(target)
        expected = BASE + (locale + "/" if locale else "") + ("" if route == Path("index.html") else route.parent.as_posix() + "/")
        assert page.canonical == expected, (target, page.canonical, expected)
        assert any("javascripts/language.js" in ref for ref in page.links), target
    for source in labs:
        assert (SITE / locale / "labs" / source.name).is_file()

for path in SITE.rglob("*.html"):
    page = parse(path)
    url = BASE + path.relative_to(SITE).as_posix()
    for ref in page.links:
        resolved = urlsplit(urljoin(url, ref))
        if resolved.scheme not in ("http", "https") or resolved.netloc != "inexact-computing.github.io":
            continue
        if not resolved.path.startswith("/public/"):
            continue
        dest = SITE / unquote(resolved.path[len("/public/"):])
        if dest.is_dir():
            dest = dest / "index.html"
        assert dest.is_file(), (path, ref)
        if resolved.fragment and dest.suffix == ".html":
            assert unquote(resolved.fragment) in parse(dest).ids, (path, ref)
print("PASS: 18 reading pages + 8 tools per language; canonical URLs and local links/fragments")
