# -*- coding: utf-8 -*-
import glob
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

try:
    import pandas as pd
except ImportError:
    print("需要 pandas openpyxl"); sys.exit(1)

def probe(path):
    print("\n" + "=" * 60)
    print(path)
    xl = pd.ExcelFile(path)
    print("sheets:", xl.sheet_names)
    for sn in xl.sheet_names[:3]:
        df = pd.read_excel(path, sheet_name=sn, nrows=5)
        print(f"\n  [{sn}] cols ({len(df.columns)}):", list(df.columns))
        print(df.head(3).to_string())

for p in sorted(glob.glob(os.path.join(ROOT, "*.xlsx"))):
    probe(p)
