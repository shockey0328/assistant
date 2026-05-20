# -*- coding: utf-8 -*-
"""Sync config/prompts/classify_single.md into app.js SYSTEM_PROMPTS.classifySingle"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
md = (ROOT / "config/prompts/classify_single.md").read_text(encoding="utf-8")
escaped = md.replace("\\", "\\\\").replace("`", "\\`")
prompt_js = f"classifySingle: `{escaped}`,"
app_path = ROOT / "app.js"
app = app_path.read_text(encoding="utf-8")
start = app.find("classifySingle: `")
end = app.find("`,\n\npath: `", start)
if start < 0 or end < 0:
    raise SystemExit(f"markers not found: {start}, {end}")
app = app[:start] + prompt_js + app[end + 2 :]
app_path.write_text(app, encoding="utf-8")
print("Synced classifySingle to app.js")
