#!/usr/bin/env python3
"""Backward-compatible alias for run_claude_extraction.py."""

import json
from run_claude_extraction import main


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as error:
        print(json.dumps({"status": "error", "message": str(error)}, ensure_ascii=False))
        raise SystemExit(1)
