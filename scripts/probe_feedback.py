# -*- coding: utf-8 -*-
import glob
import os
import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

for p in glob.glob(os.path.join(ROOT, "*用户需求*.xlsx")):
    df = pd.read_excel(p, sheet_name=0)
    print("file:", os.path.basename(p))
    print("rows:", len(df))
    print("columns:", list(df.columns))
    print(df.head(8).to_string())
    print("\n二级标签 value_counts:\n", df.iloc[:, 1].value_counts().head(10))
