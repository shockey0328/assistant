"""临时脚本：列出并预览 data 目录下的真实样例文件"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, ROOT)

for folder in ["data/input", "data/behavior_logs", "data", ".."]:
    path = os.path.join(ROOT, folder)
    print(f"\n=== {path} ===")
    if not os.path.isdir(path):
        print("  (不存在)")
        continue
    for name in sorted(os.listdir(path)):
        fp = os.path.join(path, name)
        if os.path.isfile(fp):
            print(f"  {name}\t{os.path.getsize(fp)} bytes")
