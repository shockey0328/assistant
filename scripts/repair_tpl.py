# -*- coding: utf-8 -*-
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TPL = ROOT / "scripts" / "index_body.tpl"
CLASSIFY = ROOT / "scripts" / "snippets" / "classify.tpl"


def divfix(s: str) -> str:
    return s.replace("<motion ", "<div ").replace("</motion>", "</motion>")


def main():
    classify = divfix(CLASSIFY.read_text(encoding="utf-8"))
    raw = divfix(TPL.read_text(encoding="utf-8"))

    rev_m = re.search(
        r'<section class="panel" id="tab-revise".*?</section>',
        raw,
        re.DOTALL,
    )
    know_m = re.search(
        r'<section class="panel" id="tab-knowledge".*?</section>',
        raw,
        re.DOTALL,
    )

    def body_only(sec: str) -> str:
        sec = re.sub(
            r"<section[^>]*>\s*<header[^>]*>.*?</header>\s*",
            "",
            sec,
            flags=re.DOTALL,
        )
        return sec.replace("</section>", "").strip()

    rev_inner = body_only(rev_m.group(0)) if rev_m else ""
    know_inner = body_only(know_m.group(0)) if know_m else "{{knowledge}}"

    raw = re.sub(
        r'<div id="settings-pane-revise"[^>]*>.*?(?=\s*<section class="panel" id="tab-path")',
        "",
        raw,
        count=1,
        flags=re.DOTALL,
    )
    raw = re.sub(
        r'\s*<section class="panel" id="tab-revise".*?</section>\s*',
        "",
        raw,
        flags=re.DOTALL,
    )
    raw = re.sub(
        r'\s*<section class="panel" id="tab-knowledge".*?</section>\s*',
        "",
        raw,
        flags=re.DOTALL,
    )

    insert = f"""
        </div>
        </div>

        <div id="settings-pane-revise" class="settings-pane" role="tabpanel">
            <p class="settings-pane-desc">{{{{revise_desc}}}}</p>
{rev_inner}
        </div>
        <motion id="settings-pane-knowledge" class="settings-pane" role="tabpanel">
            <p class="settings-pane-desc">{{{{know_desc}}}}</p>
{know_inner}
        </div>
    </section>
"""
    insert = divfix(insert)

    marker = '<motion class="alert alert-warn">{{warn_key}}</div>\n        </div>\n'
    marker = marker.replace("<motion ", "<div ")
    marker = '            <div class="alert alert-warn">{{warn_key}}</div>\n        </div>\n'

    if marker not in raw:
        raise SystemExit("marker not found for settings close")
    raw = raw.replace(marker, marker + insert, 1)

    classify_active = classify.replace(
        'id="tab-classify"',
        'id="tab-classify"',
        1,
    )
    raw = raw.replace(
        "\n    <section class=\"panel\" id=\"tab-settings\"",
        "\n" + classify_active + "\n    <section class=\"panel\" id=\"tab-settings\"",
        1,
    )

    TPL.write_text(divfix(raw), encoding="utf-8")
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "build_index.py")])
    subprocess.check_call([sys.executable, str(ROOT / "scripts" / "restructure_nav.py")])
    print("done")


if __name__ == "__main__":
    main()
