# -*- coding: utf-8 -*-
"""
将第10周真实 xlsx 转为工具可用的 CSV / 按用户切分的行为日志。
用法（项目根目录）:
  python scripts/prepare_week_data.py
"""

from __future__ import annotations

import json
import os
import re
import sys
from urllib.parse import urlparse

import pandas as pd
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(ROOT, "config", "datasets", "week_2026_w10.yaml")


def load_config() -> dict:
    with open(CONFIG_PATH, encoding="utf-8") as f:
        cfg = yaml.safe_load(f)
    cfg["sources"]["feedback"] = os.path.join(ROOT, cfg["sources"]["feedback"])
    cfg["sources"]["behavior_logs"] = [
        os.path.join(ROOT, p) for p in cfg["sources"]["behavior_logs"]
    ]
    for k in ("feedback_csv", "behavior_index", "behavior_users_dir"):
        cfg["outputs"][k] = os.path.join(ROOT, cfg["outputs"][k])
    return cfg


def clean_feedback_text(text) -> str:
    if pd.isna(text):
        return ""
    s = str(text).strip()
    s = re.sub(r"^\[图片\]\s*", "", s)
    s = re.sub(r"\n+", " ", s)
    return s.strip()


def guess_module(url: str) -> str:
    if not url or (isinstance(url, float) and pd.isna(url)):
        return ""
    u = str(url).lower()
    if "photo-search" in u:
        return "拍照答疑"
    if "doc-detail" in u or "c.xkw.com" in u:
        return "资源详情"
    if "xb.xkw.com" in u:
        return "橙子学"
    return ""


def guess_page(url: str) -> str:
    if not url or (isinstance(url, float) and pd.isna(url)):
        return ""
    try:
        path = urlparse(str(url)).path.strip("/") or "首页"
        return path[:80]
    except Exception:
        return str(url)[:80]


def normalize_behavior(df: pd.DataFrame) -> pd.DataFrame:
    """埋点原始表 → 路径分析用标准列"""
    out = pd.DataFrame()
    out["user_id"] = df["user_id"].astype(str)
    out["timestamp"] = pd.to_datetime(df["xyio_client_time"], errors="coerce")
    out["event_type"] = df.get("log_event_type", "").fillna("").astype(str)
    out["page_name"] = df["url"].apply(guess_page)
    out["resource_id"] = df.get("element_id", "").fillna("").astype(str)
    out["resource_name"] = df.get("element_name", "").fillna("").astype(str)
    out["module"] = df["url"].apply(guess_module)
    detail_parts = [
        df.get("element_content", "").fillna("").astype(str),
        df.get("element_class_name", "").fillna("").astype(str),
    ]
    out["action_detail"] = detail_parts[0].where(
        detail_parts[0].str.len() > 0, detail_parts[1]
    )
    out["url"] = df.get("url", "").fillna("").astype(str)
    out["referrer"] = df.get("referrer", "").fillna("").astype(str)
    out["platform"] = df.get("platform", "").fillna("").astype(str)
    out["source"] = df.get("source", "").fillna("").astype(str)
    out["duration"] = ""
    out = out.dropna(subset=["timestamp"])
    out = out.sort_values(["user_id", "timestamp"])
    return out


def prepare_feedback(cfg: dict) -> tuple[pd.DataFrame, set[str]]:
    fc = cfg["feedback_columns"]
    path = cfg["sources"]["feedback"]
    if not os.path.isfile(path):
        raise FileNotFoundError(f"找不到反馈表: {path}")

    raw = pd.read_excel(path, sheet_name=0)
    rename = {
        fc["label_l1"]: "label_l1",
        fc["label_l2"]: "label_l2",
        fc["text"]: "feedback_text",
        fc["membership"]: "membership",
        fc["user_id"]: "user_id",
    }
    df = raw.rename(columns=rename)
    df["user_id"] = df["user_id"].astype(str).str.replace(r"\.0$", "", regex=True)
    if "membership" in df.columns:
        df["membership"] = df["membership"].apply(
            lambda x: "" if pd.isna(x) else re.sub(r"\.0$", "", str(x).strip())
        )
    df["feedback_text"] = df["feedback_text"].apply(clean_feedback_text)
    df["feedback_time"] = cfg["default_feedback_time"]
    df["period"] = f"{cfg['period_start']} ~ {cfg['period_end']}"
    df = df[df["feedback_text"].str.len() > 0].copy()
    df = df.reset_index(drop=True)
    df.insert(0, "seq", range(1, len(df) + 1))

    out_path = cfg["outputs"]["feedback_csv"]
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    df.to_csv(out_path, index=False, encoding="utf-8-sig")
    print(f"[OK] feedback CSV: {out_path} ({len(df)} rows)")

    uids = set(df["user_id"].dropna().unique())
    return df, uids


def prepare_behavior(cfg: dict, target_uids: set[str]) -> None:
    users_dir = cfg["outputs"]["behavior_users_dir"]
    os.makedirs(users_dir, exist_ok=True)

    buffers: dict[str, list[pd.DataFrame]] = {uid: [] for uid in target_uids}
    total_raw = 0
    total_kept = 0

    for path in cfg["sources"]["behavior_logs"]:
        if not os.path.isfile(path):
            print(f"[WARN] skip missing: {path}")
            continue
        name = os.path.basename(path)
        print(f"[READ] {name} ...", flush=True)
        raw = pd.read_excel(path, sheet_name=0)
        total_raw += len(raw)
        raw["user_id"] = raw["user_id"].astype(str).str.replace(r"\.0$", "", regex=True)
        sub = raw[raw["user_id"].isin(target_uids)]
        total_kept += len(sub)
        if sub.empty:
            print("   kept 0")
            continue
        norm = normalize_behavior(sub)
        for uid, grp in norm.groupby("user_id"):
            buffers.setdefault(uid, []).append(grp)
        print(f"   kept {len(sub)}")

    index_entries = []
    feedback_df = pd.read_csv(cfg["outputs"]["feedback_csv"], encoding="utf-8-sig")
    feedback_df["user_id"] = feedback_df["user_id"].astype(str).str.replace(r"\.0$", "", regex=True)
    fb_by_uid = feedback_df.set_index("user_id", drop=False)

    for uid in sorted(target_uids):
        parts = buffers.get(uid, [])
        if parts:
            merged = pd.concat(parts, ignore_index=True).sort_values("timestamp")
        else:
            merged = pd.DataFrame()

        safe_name = re.sub(r"[^\w\-]", "_", uid)
        user_path = os.path.join(users_dir, f"{safe_name}.csv")
        if len(merged) > 0:
            merged.to_csv(user_path, index=False, encoding="utf-8-sig")
        else:
            if os.path.isfile(user_path):
                os.remove(user_path)

        entry = {
            "user_id": uid,
            "log_file": f"data/behavior_logs/week_2026_w10_users/{safe_name}.csv",
            "log_rows": int(len(merged)),
        }
        if uid in fb_by_uid.index:
            row = fb_by_uid.loc[uid]
            if isinstance(row, pd.DataFrame):
                row = row.iloc[0]
            entry["feedback_text"] = str(row.get("feedback_text", ""))[:200]
            entry["feedback_time"] = str(row.get("feedback_time", "")).strip()
            entry["label_l2"] = str(row.get("label_l2", ""))
            entry["seq"] = int(row.get("seq", 0))
        index_entries.append(entry)

    index_entries.sort(key=lambda x: x.get("seq", 9999))
    index_path = cfg["outputs"]["behavior_index"]
    os.makedirs(os.path.dirname(index_path), exist_ok=True)
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "id": cfg["id"],
                "label": cfg["label"],
                "period_start": cfg["period_start"],
                "period_end": cfg["period_end"],
                "default_feedback_time": cfg["default_feedback_time"],
                "feedback_csv": "data/input/week_2026_w10_feedback.csv",
                "users": index_entries,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )

    with_logs = sum(1 for e in index_entries if e["log_rows"] > 0)
    print(f"[OK] behavior index: {index_path}")
    print(f"[OK] per-user logs: {users_dir} ({with_logs}/{len(index_entries)} users with logs)")
    print(f"     raw {total_raw:,} -> kept {total_kept:,}")


def feedback_to_ai_text(df: pd.DataFrame) -> str:
    lines = []
    for _, row in df.iterrows():
        label = row.get("label_l2", "")
        hint = f"（人工标注二级: {label}）" if label and str(label) != "nan" else ""
        mem = row.get("membership", "")
        mem_part = f"会员身份: {mem}, " if mem and str(mem) not in ("", "nan") else ""
        lines.append(
            f"{row['seq']}. 用户ID: {row['user_id']}, {mem_part}"
            f"时间: {row['feedback_time']}, "
            f"留言: \"{row['feedback_text']}\"{hint}"
        )
    return "\n".join(lines)


def main() -> int:
    os.chdir(ROOT)
    cfg = load_config()
    print(f"=== dataset: {cfg['id']} ===\n")

    fb_df, uids = prepare_feedback(cfg)
    ai_path = os.path.join(ROOT, "data", "input", "week_2026_w10_feedback_ai.txt")
    with open(ai_path, "w", encoding="utf-8") as f:
        f.write(feedback_to_ai_text(fb_df))
    print(f"[OK] AI text: {ai_path}")

    prepare_behavior(cfg, uids)
    print("\nDone. Open index.html and click load week-10 sample buttons.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
