"""
反馈分类引擎 + 路径分析 + 报告生成
"""

from .ai_client import AIClient, load_config
from .product_knowledge import ProductKnowledge
from .revision_tracker import RevisionTracker


def _load_prompts():
    return load_config('prompts.yaml')


class FeedbackClassifier:
    """反馈分类器"""

    def __init__(self):
        self.ai = AIClient()
        self.prompts = _load_prompts()
        self.pk = ProductKnowledge()
        self.rt = RevisionTracker()

    def classify(self, feedback_text_list: str) -> str:
        """对一批反馈做分类分析，返回Markdown"""
        prompt = self.prompts['classification_prompt']
        prompt = prompt.replace('{learned_rules}', self.rt.get_learned_rules_text())

        # 注入产品知识（prompt中已内嵌完整知识，此处补充动态部分）
        print("🔄 分类分析中...")
        print(f"   产品模块: {len(self.pk.get_module_names())} 个")
        print(f"   已学规则: {self.rt.get_rules_count()} 条")

        result = self.ai.chat(prompt, feedback_text_list)
        print("✅ 分类完成")
        return result


class PathAnalyzer:
    """用户路径分析"""

    def __init__(self):
        self.ai = AIClient()
        self.prompts = _load_prompts()

    def analyze(self, user_id: str, feedback_text: str,
                feedback_time: str, behavior_log_csv: str) -> str:
        """分析用户行为路径，返回Markdown"""
        prompt = self.prompts['path_analysis_prompt']
        prompt = prompt.replace('{user_id}', str(user_id))
        prompt = prompt.replace('{feedback_text}', feedback_text)
        prompt = prompt.replace('{feedback_time}', str(feedback_time))
        prompt = prompt.replace('{behavior_log}', behavior_log_csv)

        print(f"🔄 分析用户 {user_id} 的行为路径...")
        result = self.ai.chat(prompt, f"请分析用户 {user_id} 的行为路径。")
        print("✅ 路径分析完成")
        return result


class ReportGenerator:
    """汇总报告生成"""

    def __init__(self):
        self.ai = AIClient()
        self.prompts = _load_prompts()

    def generate(self, classified_data: str,
                 path_results: str = "暂无") -> str:
        """生成汇总报告"""
        prompt = self.prompts['summary_prompt']
        prompt = prompt.replace('{classified_data}', classified_data)
        prompt = prompt.replace('{path_analysis_results}', path_results)

        print("🔄 生成汇总报告...")
        result = self.ai.chat(prompt, "请生成汇总报告。")
        print("✅ 报告生成完成")
        return result
