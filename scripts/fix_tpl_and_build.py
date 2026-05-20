# -*- coding: utf-8 -*-
"""Repair index_body.tpl, build index.html, restructure nav, apply wide layout."""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TPL = Path(__file__).resolve().parent / "index_body.tpl"

CLASSIFY_SECTION = r"""
    <section class="panel active" id="tab-classify" aria-labelledby="classify-title">
        <header class="page-header page-header-split">
            <div class="page-header-main">
                <h2 class="page-title" id="classify-title">{{classify_title}}</h2>
                <p class="page-desc">{{classify_desc}}</p>
            </div>
            <div class="page-hint">{{classify_hint}}</div>
        </header>
        <div class="card card-import">
            <h3 class="card-title">{{import_title}}</h3>
            <motion class="import-grid">
                <div class="import-col-upload">
                    <div class="upload-area" id="uploadArea">
                        <div class="upload-icon" aria-hidden="true">&#128193;</div>
                        <p>{{upload_p}} <label for="fileInput">{{upload_link}}</label></p>
                        <input type="file" id="fileInput" accept=".csv,.txt,.xlsx,.xls" hidden>
                        <p class="upload-hint">{{upload_hint}}</p>
                    </div>
                    <p class="import-or">{{divider}}</p>
                </div>
                <div class="import-col-text">
                    <textarea id="feedbackInput" rows="12" placeholder="{{fb_placeholder}}"></textarea>
                    <div class="bar bar-flush">
                        <span class="count" id="feedbackCount">0 {{count_unit}}</span>
                        <div class="btn-group">
                            <button type="button" class="btn btn-s" id="loadWeekFeedbackBtn">{{btn_week}}</button>
                            <button type="button" class="btn btn-s" id="parseFeedbackBtn">{{btn_parse}}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <motion class="card batch-card" id="batchPanel" style="display:none;">
            <div class="batch-toolbar">
                <h3 class="batch-title" id="batchPreviewTitle">{{batch_title}} {{batch_mid}} 0 {{batch_end}}</h3>
                <motion class="batch-actions">
                    <button type="button" class="btn btn-s" id="exportBatchBtn" disabled>{{btn_export}}</button>
                    <button type="button" class="btn btn-s" id="cancelClassifyBtn" style="display:none;">{{btn_cancel}}</button>
                    <button type="button" class="btn btn-batch" id="classifyBtn">{{btn_classify}}</button>
                </div>
            </div>
            <div class="batch-progress-wrap">
                <div class="batch-progress-track"><div class="batch-progress-fill" id="batchProgressFill"></motion></div>
                <span class="batch-progress-text" id="batchProgressText">0 / 0</span>
            </div>
            <div class="batch-table-wrap">
                <table class="batch-table">
                    <thead>
                        <tr>
                            <th class="col-num">{{th_num}}</th>
                            <th class="col-msg">{{th_msg}}</th>
                            <th class="col-id">{{th_id}}</th>
                            <th class="col-path">{{th_path}}</th>
                            <th class="col-result">{{th_result}}</th>
                        </tr>
                    </thead>
                    <tbody id="batchTableBody"></tbody>
                </table>
            </div>
        </div>
    </section>
""".replace("<motion ", "<motion ").replace("</motion>", "</motion>")


def fix_motion(html: str) -> str:
    return html.replace("<motion ", "<div ").replace("</motion>", "</div>")


def repair_tpl():
    raw = TPL.read_text(encoding="utf-8")
    raw = fix_motion(raw)
    # close settings api pane
    raw = raw.replace(
        "            <div class=\"alert alert-warn\">{{warn_key}}</div>\n        </motion>\n\n        <div id=\"settings-pane-revise\"",
        "            <div class=\"alert alert-warn\">{{warn_key}}</motion>\n        </div>\n        </div>\n\n        <div id=\"settings-pane-revise\"",
        1,
    )
    raw = fix_motion(raw)
    # remove garbage classify inside revise pane through tab-path
    raw = re.sub(
        r"<div id=\"settings-pane-revise\".*?</section>\s*\n\s*<section class=\"panel\" id=\"tab-path\"",
        lambda m: m.group(0)[ : m.group(0).rfind("<section class=\"panel\" id=\"tab-path\"")],
        raw,
        count=1,
        flags=re.DOTALL,
    )
    # extract revise block from old tab-revise if still present
    rev_m = re.search(
        r"<section class=\"panel\" id=\"tab-revise\".*?</section>",
        raw,
        re.DOTALL,
    )
    know_m = re.search(
        r"<section class=\"panel\" id=\"tab-knowledge\".*?</section>",
        raw,
        re.DOTALL,
    )
    if rev_m:
        rev_body = rev_m.group(0)
        rev_inner = re.sub(r"<section[^>]*>.*?<header[^>]*>.*?</header>\s*", "", rev_body, flags=re.DOTALL)
        rev_inner = rev_inner.replace("</section>", "").strip()
    else:
        rev_inner = ""

    if know_m:
        know_inner = know_m.group(0)
        know_inner = re.sub(r"<section[^>]*>.*?<header[^>]*>.*?</header>\s*", "", know_inner, flags=re.DOTALL)
        know_inner = know_inner.replace("</section>", "").strip()
        know_inner = know_inner.replace("{{knowledge}}", "{{knowledge}}")
    else:
        know_inner = "{{knowledge}}"

    # rebuild settings revise/knowledge panes
    settings_revise = f"""
        <div id="settings-pane-revise" class="settings-pane" role="tabpanel">
            <p class="settings-pane-desc">{{{{revise_desc}}}}</p>
{rev_inner}
        </div>
        <div id="settings-pane-knowledge" class="settings-pane" role="tabpanel">
            <p class="settings-pane-desc">{{{{know_desc}}}}</p>
{know_inner}
        </div>
    </section>
"""

    # splice: after broken revise pane start, replace until tab-path
    raw = re.sub(
        r"<motion id=\"settings-pane-revise\".*?(?=<section class=\"panel\" id=\"tab-path\")",
        settings_revise + "\n\n    ",
        raw,
        count=1,
        flags=re.DOTALL,
    )
    raw = fix_motion(raw)

    classify = fix_motion(CLASSIFY_SECTION)
    # insert classify before tab-path, remove tab-revise tab-knowledge sections
    raw = re.sub(r"<section class=\"panel\" id=\"tab-revise\".*?</section>\s*", "", raw, flags=re.DOTALL)
    raw = re.sub(r"<section class=\"panel\" id=\"tab-knowledge\".*?</section>\s*", "", raw, flags=re.DOTALL)
    raw = raw.replace(
        '<section class="panel" id="tab-settings"',
        classify + "\n\n    <section class=\"panel\" id=\"tab-settings\"",
        1,
    )
    # settings should not be active
    raw = raw.replace('id="tab-settings" aria', 'id="tab-settings" aria', 1)
    TPL.write_text(raw, encoding="utf-8")
    print("repaired tpl")


def patch_classify_layout(html: str) -> str:
    return html  # already in tpl after repair


def main():
    repair_tpl()
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "build_index.py")])
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "restructure_nav.py")])
    print("done")


if __name__ == "__main__":
    main()
