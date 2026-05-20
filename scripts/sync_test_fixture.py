# -*- coding: utf-8 -*-
"""将 测试文件/ 下的在线反馈 xlsx 同步到 data/test/。"""
from __future__ import annotations

import os
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "测试文件")
DST = os.path.join(ROOT, "data", "test", "week_2026_w10_online_feedback.xlsx")


def main() -> int:
    if not os.path.isdir(SRC_DIR):
        print(f"[SKIP] 未找到目录: {SRC_DIR}")
        return 1
    src = None
    for name in os.listdir(SRC_DIR):
        if not name.endswith(".xlsx") or name.startswith("~$"):
            continue
        if "10" in name or "反馈" in name:
            src = os.path.join(SRC_DIR, name)
            break
    if not src:
        print("[ERR] 测试文件夹中未找到 xlsx")
        return 1
    os.makedirs(os.path.dirname(DST), exist_ok=True)
    shutil.copy2(src, DST)
    print(f"[OK] {name} -> {DST} ({os.path.getsize(DST)} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
