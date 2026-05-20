# 测试数据

| 文件 | 说明 |
|------|------|
| `week_2026_w10_online_feedback.xlsx` | 一周在线问题反馈（26年第10周），Web 端「加载测试文件」默认加载 |
| `behavior_logs/index.json` | 测试用户行为日志索引（路径分析用） |
| `behavior_logs/*.csv` | 各用户行为日志（由 `测试文件/` 同步） |

源文件放在项目根目录 **`测试文件/`** 下：

- `一周在线问题反馈（26年第10周）.xlsx` → 反馈分类
- `67640796的3月9日用户行为日志.csv` 等（文件名以用户 ID 开头）→ 路径分析

更新后运行：

```bash
python scripts/sync_test_fixture.py
```

会同时同步 xlsx 与行为日志 CSV，并生成 `behavior_logs/index.json`。提交后 Vercel 部署即可在线上加载这三个用户的日志。
