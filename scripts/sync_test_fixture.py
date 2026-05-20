# -*- coding: utf-8 -*-
"""将 测试文件/ 同步到 data/test/：在线反馈 xlsx + 各用户行为日志 CSV。"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "测试文件")
DST = os.path.join(ROOT, "data", "test", "week_2026_w10_online_feedback.xlsx")


def sync_feedback_xlsx() -> int:
    if not os.path.isdir(SRC_DIR):
        print(f"[SKIP] 未找到目录: {SRC_DIR}")
        return 1
    src = None
    picked = None
    for name in os.listdir(SRC_DIR):
        if not name.endswith(".xlsx") or name.startswith("~$"):
            continue
        if "10" in name or "反馈" in name:
            src = os.path.join(SRC_DIR, name)
            picked = name
            break
    if not src:
        print("[ERR] 测试文件夹中未找到 xlsx")
        return 1
    os.makedirs(os.path.dirname(DST), exist_ok=True)
    shutil.copy2(src, DST)
    print(f"[OK] {picked} -> {DST} ({os.path.getsize(DST)} bytes)")
    return 0


def main() -> int:
    code = sync_feedback_xlsx()
    script = os.path.join(os.path.dirname(__file__), "sync_test_behavior_logs.py")
    sub = subprocess.run([sys.executable, script], cwd=ROOT)
    return code if code else sub.returncode


if __name__ == "__main__":
    raise SystemExit(main())
