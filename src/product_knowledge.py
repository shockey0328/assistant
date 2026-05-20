"""
产品知识库
加载橙子学产品功能说明，供AI分析时引用
"""

import os
import yaml


class ProductKnowledge:
    """产品知识库"""

    def __init__(self):
        config_path = os.path.join(
            os.path.dirname(__file__), '..', 'config', 'product_knowledge.yaml'
        )
        if os.path.exists(config_path):
            with open(config_path, 'r', encoding='utf-8') as f:
                self.data = yaml.safe_load(f) or {}
        else:
            self.data = {}
            print("⚠️  product_knowledge.yaml 不存在")

    def to_prompt_text(self) -> str:
        """将产品知识转为Prompt文本"""
        if not self.data:
            return "（暂无产品知识）"

        lines = []

        # 基本信息
        lines.append(f"### 产品：{self.data.get('product_name', '')}（{self.data.get('product_subtitle', '')}）")
        lines.append(f"{self.data.get('product_slogan', '')}")
        lines.append("")

        # 使用导航
        nav = self.data.get('usage_navigation', [])
        if nav:
            lines.append("### 用户需求 → 模块对照")
            lines.append("| 用户需求 | 对应模块 |")
            lines.append("|---|---|")
            for item in nav:
                lines.append(f"| {item['need']} | {item['module']} |")
            lines.append("")

        # 功能模块
        modules = self.data.get('modules', [])
        if modules:
            lines.append("### 功能模块详情")
            current_scene = ""
            for m in modules:
                scene = m.get('scene', '')
                if scene != current_scene:
                    lines.append(f"\n**场景：{scene}**")
                    current_scene = scene
                lines.append(f"- **【{m['name']}】** {m.get('slogan', '')}")
                lines.append(f"  {m.get('description', '')}")
            lines.append("")

        # 贯穿功能
        cross = self.data.get('cross_module_features', [])
        if cross:
            lines.append("### 贯穿功能")
            for feat in cross:
                lines.append(f"- **{feat['name']}**：{feat['description']}")
            lines.append("")

        # 标签
        tags = self.data.get('resource_tags', [])
        if tags:
            lines.append("### 资源标签")
            for tag in tags:
                lines.append(f"- **{tag['name']}**：{tag['description']}")

        return '\n'.join(lines)

    def get_module_names(self) -> list:
        """获取所有模块名"""
        return [m.get('name', '') for m in self.data.get('modules', [])]
