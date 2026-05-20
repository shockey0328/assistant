import glob, os
import pandas as pd
os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
for p in sorted(glob.glob("2026年3月*行为*.xlsx"))[:1]:
    df = pd.read_excel(p, sheet_name=0, nrows=0)
    print("cols", list(df.columns))
    # fast row count via openpyxl optional - just read one file full
    df = pd.read_excel(p, sheet_name=0, usecols=["user_id"])
    print(p, "rows", len(df), "users", df["user_id"].nunique())
