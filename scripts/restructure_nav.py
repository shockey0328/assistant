# -*- coding: utf-8 -*-
"""Restructure sidebar nav and merge settings panes."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"


def section(html: str, tab_id: str) -> str:
    m = re.search(
        rf'<section class="panel[^"]*" id="{tab_id}"[^>]*>.*?</section>',
        html,
        re.DOTALL,
    )
    if not m:
        raise ValueError(f"missing section {tab_id}")
    return m.group(0)


def strip_eyebrow(sec: str) -> str:
    return re.sub(r"\s*<span class=\"page-eyebrow\">[^<]*</span>\s*", "\n", sec)


def panel_body(sec: str) -> str:
    body = re.sub(r"<section[^>]*>\s*", "", sec, count=1)
    body = re.sub(r"</section>\s*$", "", body)
    body = re.sub(r"<header class=\"page-header\">.*?</header>\s*", "", body, flags=re.DOTALL)
    return body.strip()


def set_panel_class(sec: str, active: bool) -> str:
    if active:
        return re.sub(r'class="panel(?: active)?"', 'class="panel active"', sec, count=1)
    return re.sub(r'class="panel(?: active)?"', 'class="panel"', sec, count=1)


def main():
    html = HTML.read_text(encoding="utf-8")
    head = html[: html.index('<nav class="sidebar"')]
    tail = html[html.index("</main>") :]

    classify = set_panel_class(strip_eyebrow(section(html, "tab-classify")), True)
    path = set_panel_class(strip_eyebrow(section(html, "tab-path")), False)
    report = set_panel_class(strip_eyebrow(section(html, "tab-report")), False)
    report = report.replace(
        "\u5df2\u5206\u7c7b\u7684\u53cd\u9988\uff08\u53ef\u4ece\u6b65\u9aa4 02 \u5bfc\u51fa\u590d\u5236\uff09",
        "\u5df2\u5206\u7c7b\u7684\u53cd\u9988\uff08\u53ef\u4ece\u300c\u53cd\u9988\u5206\u7c7b\u300d\u5bfc\u51fa\u590d\u5236\uff09",
    )

    api_body = panel_body(section(html, "tab-settings"))
    revise_body = panel_body(section(html, "tab-revise"))
    know_body = panel_body(section(html, "tab-knowledge"))

    nav = """<nav class="sidebar" aria-label="\u4e3b\u5bfc\u822a">
    <div class="sidebar-brand">
        <motion class="sidebar-brand-top">
            <img class="sidebar-logo" src="assets/xiaochengzi.png" width="40" height="40" alt="">
            <div>
                <h1>\u6a59\u5b50\u5b66</h1>
                <p>\u53cd\u9988\u5206\u6790\u52a9\u624b</p>
            </div>
        </div>
    </div>
    <ul class="nav nav-primary">
        <li class="active" data-tab="classify"><span class="nav-label">\u53cd\u9988\u5206\u7c7b</span></li>
        <li data-tab="path"><span class="nav-label">\u8def\u5f84\u5206\u6790</span></li>
        <li data-tab="report"><span class="nav-label">\u6c47\u603b\u62a5\u544a</span></li>
    </ul>
    <div class="nav-settings">
        <button type="button" class="nav-settings-btn" data-tab="settings" aria-label="\u8bbe\u7f6e">
            <span class="nav-settings-icon" aria-hidden="true">&#9881;</span>
            <span class="nav-label">\u8bbe\u7f6e</span>
        </button>
    </div>
    <div class="sidebar-ft">
        <span class="pill">\u5df2\u5b66\u89c4\u5219 <b id="rulesCount">0</b> \u6761</span>
    </div>
</nav>"""
    nav = nav.replace("<motion ", "<div ").replace("</motion>", "</div>")

    settings = f"""<section class="panel" id="tab-settings" aria-labelledby="settings-hub-title">
        <header class="page-header page-header-compact">
            <h2 class="page-title" id="settings-hub-title">\u8bbe\u7f6e</h2>
        </header>
        <div class="settings-tabs" role="tablist">
            <button type="button" class="settings-tab active" role="tab" data-settings-pane="api" aria-selected="true">API \u8bbe\u7f6e</button>
            <button type="button" class="settings-tab" role="tab" data-settings-pane="revise">\u4fee\u8ba2\u7ba1\u7406</button>
            <button type="button" class="settings-tab" role="tab" data-settings-pane="knowledge">\u4ea7\u54c1\u77e5\u8bc6</button>
        </div>
        <div id="settings-pane-api" class="settings-pane active" role="tabpanel">
            <p class="settings-pane-desc">API Key \u4ec5\u4fdd\u7559\u5728\u672c\u673a\u6d4f\u89c8\u5668\uff0c\u540e\u7eed\u5206\u7c7b\u3001\u8def\u5f84\u4e0e\u62a5\u544a\u5747\u4f1a\u8c03\u7528\u540c\u4e00\u5957\u51ed\u8bc1\u3002</p>
{api_body}
        </div>
        <div id="settings-pane-revise" class="settings-pane" role="tabpanel">
            <p class="settings-pane-desc">\u8bb0\u5f55\u5206\u7c7b\u4fee\u8ba2\uff0cAI \u4f1a\u5b66\u4e60\u4f60\u7684\u5224\u65ad\u903b\u8f91\u3002</p>
{revise_body}
        </div>
        <motion id="settings-pane-knowledge" class="settings-pane" role="tabpanel">
            <p class="settings-pane-desc">AI \u5206\u6790\u65f6\u53c2\u7167\u7684\u4ea7\u54c1\u529f\u80fd\u8bf4\u660e\u3002</p>
{know_body}
        </div>
    </section>"""
    settings = settings.replace("<motion ", "<div ").replace("</motion>", "</div>")

    main = f"<main class=\"main\">\n\n{classify}\n\n{path}\n\n{report}\n\n{settings}\n</main>"
    HTML.write_text(head + nav + "\n\n" + main + "\n" + tail, encoding="utf-8")
    print("OK:", HTML)


if __name__ == "__main__":
    main()
