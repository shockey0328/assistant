"""
AI模型调用客户端
支持 OpenAI / Anthropic / DeepSeek / 智谱 Zhipu
"""

import os

import yaml
from dotenv import load_dotenv

load_dotenv()


def load_config(filename):
    """加载config目录下的yaml文件"""
    config_path = os.path.join(
        os.path.dirname(__file__), '..', 'config', filename
    )
    with open(config_path, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


class AIClient:
    """AI客户端，统一封装不同模型调用"""

    def __init__(self):
        settings = load_config('settings.yaml')
        ai_cfg = settings['ai']
        self.provider = ai_cfg['provider']
        self.model = ai_cfg['model']
        self.temperature = ai_cfg['temperature']
        self.max_tokens = ai_cfg['max_tokens']
        self.api_key_env = ai_cfg['api_key_env']
        self.base_url = os.environ.get(
            'OPENAI_BASE_URL',
            ai_cfg.get('base_url'),
        )
        self.api_key = os.environ.get(self.api_key_env, '')

        if not self.api_key:
            print(f"⚠️  环境变量 {self.api_key_env} 未设置")
            print(f"   请运行: export {self.api_key_env}=你的密钥")
            print("   或在项目根目录创建 .env 文件")

    def chat(self, system_prompt: str, user_message: str) -> str:
        """发送对话请求"""
        if not self.api_key:
            raise ValueError(f"未设置 API 密钥: {self.api_key_env}")

        if self.provider == 'openai':
            return self._call_openai(system_prompt, user_message)
        elif self.provider == 'anthropic':
            return self._call_anthropic(system_prompt, user_message)
        elif self.provider == 'deepseek':
            return self._call_deepseek(system_prompt, user_message)
        elif self.provider == 'zhipu':
            return self._call_zhipu(system_prompt, user_message)
        else:
            raise ValueError(f"不支持的provider: {self.provider}")

    def _call_openai(self, system_prompt, user_message):
        from openai import OpenAI

        client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url or None,
        )
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )
        return resp.choices[0].message.content

    def _call_anthropic(self, system_prompt, user_message):
        import anthropic

        client = anthropic.Anthropic(api_key=self.api_key)
        resp = client.messages.create(
            model=self.model,
            max_tokens=self.max_tokens,
            system=system_prompt,
            messages=[{"role": "user", "content": user_message}],
        )
        return resp.content[0].text

    def _call_deepseek(self, system_prompt, user_message):
        from openai import OpenAI

        client = OpenAI(api_key=self.api_key, base_url="https://api.deepseek.com")
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )
        return resp.choices[0].message.content

    def _call_zhipu(self, system_prompt, user_message):
        from openai import OpenAI

        client = OpenAI(
            api_key=self.api_key,
            base_url="https://open.bigmodel.cn/api/paas/v4",
        )
        resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )
        return resp.choices[0].message.content
