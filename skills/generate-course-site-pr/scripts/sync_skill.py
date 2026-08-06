#!/usr/bin/env python3
"""Safely update this installed Skill from its canonical CourseStack source."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import sys
import tempfile
from typing import Optional, Tuple
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


SKILL_NAME = "generate-course-site-pr"
DEFAULT_REPO = "PointBreaker/Pointbreaker.github.io"
DEFAULT_BRANCH = "main"
VERSION_RE = re.compile(r"^\d+(?:\.\d+)*$")
ALLOWED_TOP_LEVEL = {"SKILL.md", "agents", "assets", "references", "scripts"}
DISABLE_VALUES = {"0", "false", "no", "off"}


class SyncError(RuntimeError):
    pass


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def version_key(value: str) -> Optional[Tuple[int, ...]]:
    if not VERSION_RE.fullmatch(value):
        return None
    return tuple(int(part) for part in value.split("."))


def safe_relative_path(value: object) -> str:
    if not isinstance(value, str) or not value:
        raise SyncError("manifest contains an empty file path")
    path = PurePosixPath(value)
    if path.is_absolute() or ".." in path.parts or path.parts[0] not in ALLOWED_TOP_LEVEL:
        raise SyncError(f"manifest contains unsafe path: {value!r}")
    if path.name in {"VERSION", "update-manifest.json"}:
        raise SyncError(f"manifest must not manage bootstrap metadata directly: {value!r}")
    return path.as_posix()


def fetch(base_url: str, relative_path: str, timeout: float) -> bytes:
    url = f"{base_url.rstrip('/')}/{quote(relative_path, safe='/')}"
    request = Request(url, headers={"User-Agent": "CourseStack-Skill-Updater/1"})
    with urlopen(request, timeout=timeout) as response:
        return response.read()


def load_json_bytes(data: bytes, label: str) -> dict:
    try:
        value = json.loads(data.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise SyncError(f"invalid {label}: {exc}") from exc
    if not isinstance(value, dict):
        raise SyncError(f"invalid {label}: expected an object")
    return value


def validate_manifest(manifest: dict, remote_version: str) -> list[dict]:
    if manifest.get("schemaVersion") != 1:
        raise SyncError("unsupported update manifest schema")
    if manifest.get("skill") != SKILL_NAME:
        raise SyncError("update manifest names a different skill")
    if manifest.get("version") != remote_version:
        raise SyncError("VERSION and update manifest disagree")
    raw_files = manifest.get("files")
    if not isinstance(raw_files, list) or not raw_files:
        raise SyncError("update manifest has no files")

    files: list[dict] = []
    seen: set[str] = set()
    for item in raw_files:
        if not isinstance(item, dict):
            raise SyncError("update manifest contains an invalid file entry")
        relative = safe_relative_path(item.get("path"))
        digest = item.get("sha256")
        size = item.get("size")
        if relative in seen:
            raise SyncError(f"duplicate manifest path: {relative}")
        if not isinstance(digest, str) or not re.fullmatch(r"[0-9a-f]{64}", digest):
            raise SyncError(f"invalid SHA-256 for {relative}")
        if not isinstance(size, int) or size < 0:
            raise SyncError(f"invalid size for {relative}")
        files.append({"path": relative, "sha256": digest, "size": size})
        seen.add(relative)

    if "SKILL.md" not in seen or "scripts/sync_skill.py" not in seen:
        raise SyncError("update manifest is missing required Skill files")
    return files


def read_local_version(skill_root: Path) -> str:
    path = skill_root / "VERSION"
    return path.read_text(encoding="utf-8").strip() if path.is_file() else "0"


def read_local_manifest(skill_root: Path) -> Optional[dict]:
    path = skill_root / "update-manifest.json"
    if not path.is_file():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def locally_modified_paths(skill_root: Path, manifest: Optional[dict]) -> list[str]:
    if not manifest:
        return []
    try:
        files = validate_manifest(manifest, str(manifest.get("version", "")))
    except SyncError:
        return ["update-manifest.json"]
    changed: list[str] = []
    for item in files:
        path = skill_root / item["path"]
        if not path.is_file() or sha256_file(path) != item["sha256"]:
            changed.append(item["path"])
    return changed


def validate_staged_skill(stage_root: Path) -> None:
    skill_md = (stage_root / "SKILL.md").read_text(encoding="utf-8")
    if not skill_md.startswith("---\n") or f"name: {SKILL_NAME}" not in skill_md.split("---", 2)[1]:
        raise SyncError("downloaded SKILL.md failed identity validation")


def atomic_write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(f".{path.name}.coursestack-update")
    temporary.write_bytes(data)
    os.replace(temporary, path)


def install_update(
    skill_root: Path,
    stage_root: Path,
    files: list[dict],
    version_bytes: bytes,
    manifest_bytes: bytes,
    old_manifest: Optional[dict],
) -> None:
    new_paths = {item["path"] for item in files}
    old_paths: set[str] = set()
    if old_manifest:
        try:
            old_paths = {item["path"] for item in validate_manifest(old_manifest, str(old_manifest.get("version", "")))}
        except SyncError:
            old_paths = set()
    obsolete = old_paths - new_paths
    affected = new_paths | obsolete | {"VERSION", "update-manifest.json"}
    backups: dict[str, Optional[bytes]] = {}
    for relative in affected:
        path = skill_root / relative
        backups[relative] = path.read_bytes() if path.is_file() else None

    try:
        for item in files:
            relative = item["path"]
            atomic_write(skill_root / relative, (stage_root / relative).read_bytes())
        atomic_write(skill_root / "VERSION", version_bytes)
        atomic_write(skill_root / "update-manifest.json", manifest_bytes)
        for relative in obsolete:
            path = skill_root / relative
            if path.is_file():
                path.unlink()
    except Exception:
        for relative, data in backups.items():
            path = skill_root / relative
            if data is None:
                if path.is_file():
                    path.unlink()
            else:
                atomic_write(path, data)
        raise


def result(status: str, local_version: str, remote_version: Optional[str], message: str) -> dict:
    return {
        "status": status,
        "skill": SKILL_NAME,
        "localVersion": local_version,
        "remoteVersion": remote_version,
        "message": message,
    }


def emit(payload: dict, json_output: bool) -> None:
    if json_output:
        print(json.dumps(payload, ensure_ascii=False, sort_keys=True))
    else:
        print(f"SKILL_SYNC_{payload['status'].upper().replace('-', '_')}: {payload['message']}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skill-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--repo", default=DEFAULT_REPO)
    parser.add_argument("--branch", default=DEFAULT_BRANCH)
    parser.add_argument("--raw-base")
    parser.add_argument("--timeout", type=float, default=10.0)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--strict", action="store_true")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    skill_root = args.skill_root.expanduser().resolve()
    local_version = read_local_version(skill_root)
    if os.environ.get("COURSESTACK_SKILL_AUTO_UPDATE", "").strip().lower() in DISABLE_VALUES:
        emit(result("disabled", local_version, None, "automatic updates are disabled by environment"), args.json)
        return 0

    branch = quote(args.branch, safe="/")
    base_url = args.raw_base or (
        f"https://raw.githubusercontent.com/{args.repo}/{branch}/skills/{SKILL_NAME}"
    )
    try:
        version_bytes = fetch(base_url, "VERSION", args.timeout)
        remote_version = version_bytes.decode("utf-8").strip()
        if version_key(remote_version) is None:
            raise SyncError(f"remote VERSION is invalid: {remote_version!r}")
        manifest_bytes = fetch(base_url, "update-manifest.json", args.timeout)
        manifest = load_json_bytes(manifest_bytes, "update manifest")
        files = validate_manifest(manifest, remote_version)
    except (HTTPError, URLError, TimeoutError, OSError) as exc:
        payload = result("offline", local_version, None, f"could not reach canonical Skill source; using bundled version ({exc})")
        emit(payload, args.json)
        return 1 if args.strict else 0
    except SyncError as exc:
        payload = result("error", local_version, None, str(exc))
        emit(payload, args.json)
        return 1 if args.strict else 0

    local_key = version_key(local_version)
    remote_key = version_key(remote_version)
    if not args.force and local_key is not None and remote_key is not None and remote_key <= local_key:
        emit(result("up-to-date", local_version, remote_version, f"version {local_version} is current"), args.json)
        return 0

    old_manifest = read_local_manifest(skill_root)
    modified = locally_modified_paths(skill_root, old_manifest)
    if modified and not args.force:
        preview = ", ".join(modified[:5]) + (" …" if len(modified) > 5 else "")
        payload = result("local-modified", local_version, remote_version, f"refusing to overwrite locally modified files: {preview}")
        emit(payload, args.json)
        return 1 if args.strict else 0

    try:
        skill_root.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix=f".{SKILL_NAME}-update-", dir=skill_root.parent) as temporary:
            stage_root = Path(temporary) / SKILL_NAME
            for item in files:
                data = fetch(base_url, item["path"], args.timeout)
                if len(data) != item["size"] or sha256_bytes(data) != item["sha256"]:
                    raise SyncError(f"download verification failed for {item['path']}")
                destination = stage_root / item["path"]
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(data)
            validate_staged_skill(stage_root)
            install_update(skill_root, stage_root, files, version_bytes, manifest_bytes, old_manifest)
    except (HTTPError, URLError, TimeoutError, OSError, SyncError) as exc:
        payload = result("error", local_version, remote_version, f"update was not installed; using bundled version ({exc})")
        emit(payload, args.json)
        return 1 if args.strict else 0

    emit(result("updated", local_version, remote_version, f"updated {local_version} -> {remote_version}; re-read SKILL.md before continuing"), args.json)
    return 0


if __name__ == "__main__":
    sys.exit(main())
