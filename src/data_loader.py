"""
数据加载模块
支持 CSV / Excel 格式的反馈数据和行为日志
"""

import os
import pandas as pd


class FeedbackLoader:
    """用户反馈数据加载"""

    COLUMN_MAP = {
        '用户id': 'user_id', '用户ID': 'user_id', 'userid': 'user_id',
        'UserID': 'user_id', 'user_id': 'user_id', 'uid': 'user_id',
        'UID': 'user_id', '用户编号': 'user_id',

        '反馈时间': 'feedback_time', '时间': 'feedback_time',
        'time': 'feedback_time', 'timestamp': 'feedback_time',
        'feedback_time': 'feedback_time', '提交时间': 'feedback_time',
        '留言时间': 'feedback_time', 'create_time': 'feedback_time',

        '反馈内容': 'feedback_text', '留言': 'feedback_text',
        '留言内容': 'feedback_text', '内容': 'feedback_text',
        'content': 'feedback_text', 'feedback_text': 'feedback_text',
        'text': 'feedback_text', 'message': 'feedback_text',
        '问题描述': 'feedback_text', '用户留言': 'feedback_text',
        '有效信息': 'feedback_text',

        '一级问题标签': 'label_l1', '二级问题标签': 'label_l2',
        '用户姓名': 'user_name',
        '用户身份': 'membership', '会员身份': 'membership',
    }

    @staticmethod
    def load(file_path: str) -> pd.DataFrame:
        """加载反馈数据"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"文件不存在: {file_path}")

        ext = os.path.splitext(file_path)[1].lower()
        if ext == '.csv':
            df = pd.read_csv(file_path, encoding='utf-8')
        elif ext in ('.xlsx', '.xls'):
            df = pd.read_excel(file_path)
        else:
            raise ValueError(f"不支持的格式: {ext}")

        # 标准化列名
        rename = {}
        for col in df.columns:
            stripped = col.strip()
            if stripped in FeedbackLoader.COLUMN_MAP:
                rename[col] = FeedbackLoader.COLUMN_MAP[stripped]
        df = df.rename(columns=rename)

        required = ['user_id', 'feedback_time', 'feedback_text']
        missing = [c for c in required if c not in df.columns]
        if missing:
            print(f"⚠️  缺少列: {missing}，当前列: {list(df.columns)}")

        print(f"✅ 已加载 {len(df)} 条反馈")
        return df

    @staticmethod
    def to_text(df: pd.DataFrame) -> str:
        """转为文本格式供AI分析"""
        lines = []
        for idx, row in df.iterrows():
            lines.append(
                f"{idx + 1}. 用户ID: {row.get('user_id', '未知')}, "
                f"时间: {row.get('feedback_time', '未知')}, "
                f"留言: \"{row.get('feedback_text', '')}\""
            )
        return '\n'.join(lines)


class BehaviorLogLoader:
    """用户行为日志加载"""

    XYIO_COLUMN_MAP = {
        'xyio_client_time': 'timestamp',
        'log_event_type': 'event_type',
    }

    @staticmethod
    def load(file_path: str) -> pd.DataFrame:
        """加载行为日志 CSV / Excel"""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"文件不存在: {file_path}")

        ext = os.path.splitext(file_path)[1].lower()
        if ext == '.csv':
            df = pd.read_csv(file_path, encoding='utf-8')
        elif ext in ('.xlsx', '.xls'):
            df = pd.read_excel(file_path)
        else:
            raise ValueError(f"不支持的格式: {ext}")

        rename = {k: v for k, v in BehaviorLogLoader.XYIO_COLUMN_MAP.items() if k in df.columns}
        if rename:
            df = df.rename(columns=rename)

        # 尝试解析时间列
        for col in ['timestamp', 'xyio_client_time', '时间', 'time', 'event_time']:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
                if col != 'timestamp':
                    df = df.rename(columns={col: 'timestamp'})
                break

        print(f"✅ 已加载 {len(df)} 条行为日志")
        return df

    @staticmethod
    def filter_user(df: pd.DataFrame, user_id: str, feedback_time: str,
                    window_minutes: int = 30) -> pd.DataFrame:
        """筛选指定用户在反馈前的行为"""
        # 找用户ID列
        uid_col = None
        for col in ['user_id', 'userid', 'UserID', 'uid', '用户ID']:
            if col in df.columns:
                uid_col = col
                break
        if not uid_col:
            raise ValueError(f"找不到用户ID列: {list(df.columns)}")

        # 找时间列
        time_col = None
        for col in ['timestamp', '时间', 'time', 'event_time']:
            if col in df.columns:
                time_col = col
                break
        if not time_col:
            raise ValueError(f"找不到时间列: {list(df.columns)}")

        feedback_dt = pd.to_datetime(feedback_time)
        start_dt = feedback_dt - pd.Timedelta(minutes=window_minutes)

        mask = (
            (df[uid_col].astype(str) == str(user_id)) &
            (df[time_col] >= start_dt) &
            (df[time_col] <= feedback_dt)
        )
        result = df[mask].sort_values(time_col)
        print(f"✅ 筛选出 {len(result)} 条记录（{user_id}, {start_dt} ~ {feedback_dt}）")
        return result

    @staticmethod
    def to_csv_text(df: pd.DataFrame) -> str:
        """转为CSV文本供AI分析"""
        return df.to_csv(index=False)
