# -*- coding: utf-8 -*-
"""Vercel 构建：生成 index.html 并复制静态资源到 dist/"""
from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


def copy_tree(src: Path, dest: Path) -> None:
    if not src.exists():
        return
    if dest.exists():
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main() -> int:
    subprocess.run(
        [sys.executable, str(ROOT / "scripts" / "build_index.py")],
        cwd=str(ROOT),
        check=True,
    )

    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir(parents=True)

    for name in ("index.html", "app.js", "style.css"):
        src = ROOT / name
        if not src.exists():
            print(f"Missing required file: {src}", file=sys.stderr)
            return 1
        shutil.copy2(src, DIST / name)

    copy_tree(ROOT / "config", DIST / "config")

    test_src = ROOT / "data" / "test"
    if test_src.exists():
        copy_tree(test_src, DIST / "data" / "test")

    assets = ROOT / "assets"
    if assets.exists() and any(assets.iterdir()):
        copy_tree(assets, DIST / "assets")

    print(f"Wrote {DIST} ({sum(1 for _ in DIST.rglob('*') if _.is_file())} files)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
