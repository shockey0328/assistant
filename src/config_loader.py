from pathlib import Path

import yaml

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG = PROJECT_ROOT / "config" / "settings.yaml"


def load_config(path: Path | None = None) -> dict:
    config_path = path or DEFAULT_CONFIG
    with config_path.open(encoding="utf-8") as f:
        return yaml.safe_load(f)


def resolve_path(relative: str, root: Path | None = None) -> Path:
    base = root or PROJECT_ROOT
    return (base / relative).resolve()
