#!/usr/bin/env python3
"""Build the hash manifest consumed by sync_skill.py."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
SKIP_NAMES = {"VERSION", "update-manifest.json", ".DS_Store"}


def main() -> None:
    version = (SKILL_ROOT / "VERSION").read_text(encoding="utf-8").strip()
    files = []
    for path in sorted(SKILL_ROOT.rglob("*")):
        if not path.is_file() or path.name in SKIP_NAMES or "__pycache__" in path.parts or path.suffix == ".pyc":
            continue
        data = path.read_bytes()
        files.append({
            "path": path.relative_to(SKILL_ROOT).as_posix(),
            "sha256": hashlib.sha256(data).hexdigest(),
            "size": len(data),
        })
    manifest = {
        "schemaVersion": 1,
        "skill": "generate-course-site-pr",
        "version": version,
        "files": files,
    }
    (SKILL_ROOT / "update-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(files)} files for Skill version {version}")


if __name__ == "__main__":
    main()
