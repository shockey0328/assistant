# -*- coding: utf-8 -*-
"""将 测试文件/ 下各用户的行为日志 CSV 同步到 data/test/behavior_logs/ 并生成索引。"""
from __future__ import annotations

import json
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "测试文件")
OUT_DIR = os.path.join(ROOT, "data", "test", "behavior_logs")
INDEX_PATH = os.path.join(OUT_DIR, "index.json")

UID_RE = re.compile(r"^(\d+)")


def count_csv_rows(path: str) -> int:
    with open(path, encoding="utf-8-sig", errors="replace") as f:
        return max(0, sum(1 for line in f if line.strip()) - 1)


def main() -> int:
    if not os.path.isdir(SRC_DIR):
        print(f"[ERR] 未找到目录: {SRC_DIR}")
        return 1

    os.makedirs(OUT_DIR, exist_ok=True)
    entries = []

    for name in sorted(os.listdir(SRC_DIR)):
        if not name.lower().endswith(".csv") or name.startswith("~$"):
            continue
        m = UID_RE.match(name)
        if not m:
            print(f"[SKIP] 无法识别用户 ID: {name}")
            continue
        uid = m.group(1)
        src = os.path.join(SRC_DIR, name)
        dst = os.path.join(OUT_DIR, f"{uid}.csv")
        shutil.copy2(src, dst)
        rows = count_csv_rows(dst)
        entries.append({
            "user_id": uid,
            "log_file": f"data/test/behavior_logs/{uid}.csv",
            "log_rows": rows,
            "source_name": name,
        })
        print(f"[OK] {name} -> {dst} ({rows} rows)")

    if not entries:
        print("[ERR] 测试文件夹中未找到用户行为日志 CSV（文件名需以用户 ID 开头）")
        return 1

    index = {
        "id": "week_2026_w10",
        "label": "测试用户（来自 测试文件/）",
        "default_feedback_time": "2026-03-11 12:00:00",
        "users": sorted(entries, key=lambda x: x["user_id"]),
    }
    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"[OK] index: {INDEX_PATH} ({len(entries)} users)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
