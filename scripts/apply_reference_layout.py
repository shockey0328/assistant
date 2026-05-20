# -*- coding: utf-8 -*-
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "index.html"
SNIP = Path(__file__).resolve().parent / "snippets" / "classify_stack.tpl"

EXTRA = {
    "btn_pick_file": "\u9009\u62e9 CSV \u6216 Excel \u6587\u4ef6",
    "upload_help": "\u652f\u6301 .xlsx / .xls / .csv / .txt\uff0c\u53ef\u62d6\u62fd\u5230\u4e0a\u65b9\u533a\u57df\u4e0a\u4f20",
    "text_card_title": "\u53cd\u9988\u6570\u636e",
    "text_card_desc": "\u7c98\u8d34\u6216\u7f16\u8f91\u539f\u59cb\u53cd\u9988\uff0c\u89e3\u6790\u540e\u53ef\u9884\u89c8\u5e76\u6279\u91cf\u5206\u7c7b",
    "batch_preview": "\u6570\u636e\u9884\u89c8 \u00b7 \u5171",
}


def main():
    import sys

    sys.path.insert(0, str(ROOT / "scripts"))
    import build_index as bi

    snip = SNIP.read_text(encoding="utf-8").replace("<motion ", "<div ").replace("</motion>", "</div>")
    S = {**bi.S, **EXTRA}
    for k, v in S.items():
        snip = snip.replace("{{" + k + "}}", v)

    html = HTML.read_text(encoding="utf-8")
    html = re.sub(
        r'<section class="panel active" id="tab-classify".*?</section>',
        snip.strip(),
        html,
        count=1,
        flags=re.DOTALL,
    )
    HTML.write_text(html, encoding="utf-8")
    print("ok")


if __name__ == "__main__":
    main()
