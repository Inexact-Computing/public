"""Build English at the existing root, then Chinese at /zh/."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
for config in ("mkdocs.yml", "mkdocs.zh.yml"):
    subprocess.run([sys.executable, "-m", "mkdocs", "build", "--strict", "--config-file", str(ROOT / config)], cwd=ROOT, check=True)
