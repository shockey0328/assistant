import click

from src.config_loader import load_config, resolve_path

__version__ = "0.1.0"


@click.group()
@click.version_option(__version__)
def cli() -> None:
    """用户反馈分析助手。"""


@cli.command()
def info() -> None:
    """打印当前配置与数据目录路径。"""
    cfg = load_config()
    click.echo(f"feedback-assistant v{__version__}")
    ai = cfg.get("ai", {})
    click.echo(f"  AI: {ai.get('provider')} / {ai.get('model')}")
    for name, rel in cfg.get("data", {}).items():
        click.echo(f"  {name}: {resolve_path(rel)}")
    pa = cfg.get("path_analysis", {})
    if pa:
        click.echo(f"  path_analysis: {pa}")


if __name__ == "__main__":
    cli()
