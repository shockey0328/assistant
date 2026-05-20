"""
橙子学 — 用户反馈分析助手
主入口，命令行交互
"""

import os
import sys
import argparse
from datetime import datetime

from src.data_loader import FeedbackLoader, BehaviorLogLoader
from src.classifier import FeedbackClassifier, PathAnalyzer, ReportGenerator
from src.revision_tracker import RevisionTracker


def save_output(content: str, prefix: str) -> str:
    """保存输出文件"""
    os.makedirs('data/output', exist_ok=True)
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    path = f"data/output/{prefix}_{ts}.md"
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    return path


def cmd_classify(args):
    """分类分析"""
    print("\n" + "=" * 50)
    print("📋 橙子学 — 反馈分类分析")
    print("=" * 50)

    df = FeedbackLoader.load(args.file)
    text = FeedbackLoader.to_text(df)

    classifier = FeedbackClassifier()
    result = classifier.classify(text)

    print("\n" + result)

    path = save_output(result, "classification")
    print(f"\n💾 已保存: {path}")


def cmd_path(args):
    """路径分析"""
    print("\n" + "=" * 50)
    print("🔍 橙子学 — 用户路径分析")
    print("=" * 50)

    df = BehaviorLogLoader.load(args.log_file)
    user_log = BehaviorLogLoader.filter_user(
        df, args.uid, args.time,
        window_minutes=args.window or 30
    )

    if user_log.empty:
        print(f"⚠️  未找到用户 {args.uid} 的行为记录")
        return

    csv_text = BehaviorLogLoader.to_csv_text(user_log)

    analyzer = PathAnalyzer()
    result = analyzer.analyze(
        user_id=args.uid,
        feedback_text=args.feedback or "（未提供）",
        feedback_time=args.time,
        behavior_log_csv=csv_text
    )

    print("\n" + result)

    path = save_output(result, f"path_{args.uid}")
    print(f"\n💾 已保存: {path}")


def cmd_report(args):
    """生成汇总报告"""
    print("\n" + "=" * 50)
    print("📊 橙子学 — 生成汇总报告")
    print("=" * 50)

    with open(args.classified, 'r', encoding='utf-8') as f:
        classified = f.read()

    path_results = "暂无"
    if args.paths:
        parts = []
        for p in args.paths:
            with open(p, 'r', encoding='utf-8') as f:
                parts.append(f.read())
        path_results = "\n\n---\n\n".join(parts)

    generator = ReportGenerator()
    result = generator.generate(classified, path_results)

    print("\n" + result)

    path = save_output(result, "weekly_report")
    print(f"\n💾 已保存: {path}")


def cmd_revise(args):
    """记录修订"""
    print("\n" + "=" * 50)
    print("📝 橙子学 — 记录修订")
    print("=" * 50)

    tracker = RevisionTracker()
    tracker.add_revision(
        feedback_id=args.id,
        original_text=args.text or "",
        original_category=args.original,
        revised_category=args.revised,
        reason=args.reason,
        learned_rule=args.rule or ""
    )

    print("\n" + tracker.show_rules())


def cmd_rules(args):
    """查看已学规则"""
    tracker = RevisionTracker()
    print("\n" + tracker.show_rules())
    print("\n" + tracker.show_revisions())


def main():
    parser = argparse.ArgumentParser(
        description="橙子学 — 用户反馈分析助手",
        formatter_class=argparse.RawTextHelpFormatter
    )
    sub = parser.add_subparsers(dest='command', help='可用命令')

    # classify
    p1 = sub.add_parser('classify', help='反馈分类分析')
    p1.add_argument('file', help='反馈数据文件 (csv/xlsx)')

    # path
    p2 = sub.add_parser('path', help='用户路径分析')
    p2.add_argument('--log-file', required=True, help='行为日志CSV')
    p2.add_argument('--uid', required=True, help='用户ID')
    p2.add_argument('--time', required=True, help='反馈时间')
    p2.add_argument('--feedback', help='反馈原文')
    p2.add_argument('--window', type=int, default=30, help='往前查看分钟数')

    # report
    p3 = sub.add_parser('report', help='生成汇总报告')
    p3.add_argument('--classified', required=True, help='分类结果md文件')
    p3.add_argument('--paths', nargs='*', help='路径分析结果md文件（可多个）')

    # revise
    p4 = sub.add_parser('revise', help='记录修订')
    p4.add_argument('--id', required=True, help='反馈序号')
    p4.add_argument('--text', help='反馈原文')
    p4.add_argument('--original', required=True, help='AI原始分类')
    p4.add_argument('--revised', required=True, help='修订后分类')
    p4.add_argument('--reason', required=True, help='修订原因')
    p4.add_argument('--rule', help='学到的规则')

    # rules
    p5 = sub.add_parser('rules', help='查看已学规则和修订记录')

    args = parser.parse_args()

    if args.command == 'classify':
        cmd_classify(args)
    elif args.command == 'path':
        cmd_path(args)
    elif args.command == 'report':
        cmd_report(args)
    elif args.command == 'revise':
        cmd_revise(args)
    elif args.command == 'rules':
        cmd_rules(args)
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
