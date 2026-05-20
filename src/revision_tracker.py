"""
修订追踪模块
记录修订，提炼规则，优化后续分类
"""

import os
import json
from datetime import datetime


class RevisionTracker:
    """修订记录与规则学习"""

    def __init__(self, base_dir=None):
        if base_dir is None:
            base_dir = os.environ.get(
                'REVISIONS_DIR',
                os.path.join(os.path.dirname(__file__), '..', 'data', 'revisions'),
            )
        base_dir = os.path.abspath(base_dir)
        os.makedirs(base_dir, exist_ok=True)

        self.log_file = os.path.join(base_dir, 'revision_log.json')
        self.rules_file = os.path.join(base_dir, 'learned_rules.json')

        self.revisions = self._load(self.log_file, [])
        self.rules = self._load(self.rules_file, [])

    def _load(self, path, default):
        if os.path.exists(path):
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return default

    def _save(self, path, data):
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def add_revision(self, feedback_id, original_text, original_category,
                     revised_category, reason, learned_rule=""):
        """添加一条修订"""
        rev = {
            "feedback_id": feedback_id,
            "original_text": original_text,
            "original_category": original_category,
            "revised_category": revised_category,
            "reason": reason,
            "learned_rule": learned_rule,
            "timestamp": datetime.now().isoformat()
        }
        self.revisions.append(rev)
        self._save(self.log_file, self.revisions)

        if learned_rule:
            self.add_rule(learned_rule)

        print(f"📝 修订已记录（共 {len(self.revisions)} 条）")

    def add_rule(self, rule_text):
        """添加学习到的规则"""
        self.rules.append({
            "rule": rule_text,
            "timestamp": datetime.now().isoformat()
        })
        self._save(self.rules_file, self.rules)
        print(f"🧠 新规则已学习: {rule_text}")

    def get_learned_rules_text(self) -> str:
        """返回规则文本供Prompt使用"""
        if not self.rules:
            return "（暂无修订规则，使用默认逻辑）"
        lines = ["以下是从历次修订中学到的规则，请遵循："]
        for i, r in enumerate(self.rules, 1):
            lines.append(f"{i}. {r['rule']}")
        return '\n'.join(lines)

    def get_rules_count(self) -> int:
        return len(self.rules)

    def show_rules(self) -> str:
        if not self.rules:
            return "暂无已学规则"
        lines = ["📚 所有已学规则：\n"]
        for i, r in enumerate(self.rules, 1):
            lines.append(f"  {i}. {r['rule']}")
        return '\n'.join(lines)

    def show_revisions(self, n=10) -> str:
        recent = self.revisions[-n:]
        if not recent:
            return "暂无修订记录"
        lines = [f"📝 最近 {len(recent)} 条修订：\n"]
        for rev in recent:
            lines.append(f"  #{rev['feedback_id']}: {rev['original_category']} → {rev['revised_category']}")
            lines.append(f"    原因: {rev['reason']}")
            if rev.get('learned_rule'):
                lines.append(f"    规则: {rev['learned_rule']}")
            lines.append("")
        return '\n'.join(lines)
