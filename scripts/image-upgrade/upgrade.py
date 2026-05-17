#!/usr/bin/env python3
"""Batch-upgrade Huamei product photos with luxury backgrounds via OpenRouter Nano Banana.

Prompts and product-type → scene mapping live in scenes.json (sibling file).

Usage:
  python3 upgrade.py --test                       # 2 reps × 3 scenes (~$0.25)
  python3 upgrade.py --all                        # full inventory, 1 scene each
  python3 upgrade.py --all --scenes=3             # full inventory, 3 scenes each
  python3 upgrade.py --case wuliangye-68          # one case-study folder
  python3 upgrade.py --case wuliangye-68 --scenes=2
  python3 upgrade.py --image PATH                 # single image, auto-pick scene
  python3 upgrade.py --image PATH --scene KEY     # single image, specific scene
  python3 upgrade.py --list                       # show classification, no API calls
  python3 upgrade.py --scenes-list                # list available scene keys
"""

import argparse
import base64
import json
import mimetypes
import os
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

# --- paths -----------------------------------------------------------------

SCRIPT_DIR = Path(__file__).parent
ROOT = Path.home() / "Desktop/huamei-website"
SRC_PHOTOS = ROOT / "public/photos"
DEST_ROOT = SRC_PHOTOS / "upgraded"
ENV_FILE = ROOT / ".env.local"
SCENES_FILE = SCRIPT_DIR / "scenes.json"

ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
TIMEOUT = 240


# --- env loader ------------------------------------------------------------

def load_env():
    if not ENV_FILE.exists():
        return
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        v = v.strip().strip('"').strip("'")
        if v and k not in os.environ:
            os.environ[k] = v


# --- scene config loader ---------------------------------------------------

def load_scenes():
    return json.loads(SCENES_FILE.read_text())


def classify(path: Path, cfg: dict) -> tuple[str, list[str]]:
    name = path.stem.lower()
    parent = path.parent.name.lower()
    haystack = f"{parent} {name}"
    for rule in cfg["type_rules"]:
        if any(kw in haystack for kw in rule["match_any"]):
            return rule["type"], rule["scenes"]
    return "generic", cfg["fallback_scenes"]


# --- products to process ---------------------------------------------------

ROOT_PRODUCT_FILES = [
    "bronze-jar-black-box.jpg",
    "757-cream-box.jpg",
    "case-01-fragrance-souverain.jpg",
    "huamei-pink-drawer.jpg",
    "pattern-dreamy-essentials.jpg",
]


def discover_products() -> list[Path]:
    out = []
    for n in ROOT_PRODUCT_FILES:
        p = SRC_PHOTOS / n
        if p.exists():
            out.append(p)
    cases_dir = SRC_PHOTOS / "cases"
    if cases_dir.exists():
        out.extend(sorted(cases_dir.glob("*/*.jpg")))
        out.extend(sorted(cases_dir.glob("*/*.png")))
        out.extend(sorted(cases_dir.glob("*/*.webp")))
    return out


def discover_case(slug: str) -> list[Path]:
    case_dir = SRC_PHOTOS / "cases" / slug
    if not case_dir.exists():
        raise SystemExit(f"case folder not found: {case_dir}")
    paths = sorted(case_dir.glob("*.jpg")) + sorted(case_dir.glob("*.png")) + sorted(case_dir.glob("*.webp"))
    if not paths:
        raise SystemExit(f"no images in {case_dir}")
    return paths


# --- API call --------------------------------------------------------------

def encode_image(path: Path) -> tuple[str, str]:
    mime = mimetypes.guess_type(str(path))[0] or "image/jpeg"
    b64 = base64.b64encode(path.read_bytes()).decode()
    return mime, b64


def call_nano_banana(image_path: Path, scene_key: str, cfg: dict, attempt: int = 1) -> bytes:
    if scene_key not in cfg["scenes"]:
        raise SystemExit(f"unknown scene key: {scene_key}. Available: {list(cfg['scenes'])}")
    prompt = cfg["prompt_template"].format(scene=cfg["scenes"][scene_key])
    mime, b64 = encode_image(image_path)
    payload = {
        "model": cfg["model"],
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}"}},
            ],
        }],
        "modalities": ["image", "text"],
    }
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise SystemExit("OPENROUTER_API_KEY not set in env or .env.local")
    req = Request(
        ENDPOINT,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://huamei.io",
            "X-Title": "Huamei product image upgrade",
        },
        method="POST",
    )
    try:
        with urlopen(req, timeout=TIMEOUT) as r:
            body = json.loads(r.read())
    except HTTPError as e:
        msg = e.read().decode("utf-8", errors="replace")
        if e.code in (429, 502, 503) and attempt < 3:
            time.sleep(3 * attempt)
            return call_nano_banana(image_path, scene_key, cfg, attempt + 1)
        raise RuntimeError(f"HTTP {e.code}: {msg[:500]}")
    except URLError as e:
        if attempt < 3:
            time.sleep(2 * attempt)
            return call_nano_banana(image_path, scene_key, cfg, attempt + 1)
        raise RuntimeError(f"network error: {e}")

    msg = body["choices"][0]["message"]
    images = msg.get("images") or []
    if not images:
        text = msg.get("content") or "(no content)"
        raise RuntimeError(f"no image in response. text: {text[:300]}")
    data_url = images[0]["image_url"]["url"]
    _, _, b64data = data_url.partition(",")
    return base64.b64decode(b64data)


# --- runner ---------------------------------------------------------------

def output_path(src: Path, scene_key: str) -> Path:
    rel = src.relative_to(SRC_PHOTOS)
    return DEST_ROOT / rel.parent / f"{src.stem}__{scene_key}.png"


def process_one(src: Path, scene_key: str, cfg: dict, dry_run: bool = False) -> Path | None:
    out = output_path(src, scene_key)
    if out.exists():
        print(f"  skip (exists): {out.relative_to(ROOT)}")
        return out
    out.parent.mkdir(parents=True, exist_ok=True)
    if dry_run:
        print(f"  would write: {out.relative_to(ROOT)}")
        return None
    print(f"  → {scene_key} ... ", end="", flush=True)
    t0 = time.time()
    try:
        png = call_nano_banana(src, scene_key, cfg)
    except Exception as e:
        print(f"FAILED ({e})")
        return None
    out.write_bytes(png)
    dt = time.time() - t0
    print(f"ok [{dt:.1f}s, {len(png)//1024}KB] → {out.relative_to(ROOT)}")
    return out


def run_targets(targets: list[tuple[Path, list[str]]], cfg: dict, dry_run: bool):
    total = sum(len(s) for _, s in targets)
    ok = 0
    fail = 0
    for src, scenes in targets:
        try:
            rel = src.relative_to(SRC_PHOTOS)
        except ValueError:
            rel = src
        type_label = ""
        try:
            ptype, _ = classify(src, cfg)
            type_label = f" [{ptype}]"
        except Exception:
            pass
        print(f"{rel}{type_label}:")
        for s in scenes:
            r = process_one(src, s, cfg, dry_run=dry_run)
            if r is None and not dry_run:
                fail += 1
            elif r is not None:
                ok += 1
    print(f"\nDONE. {ok}/{total} ok, {fail} failed. Output: {DEST_ROOT}")


# --- entry point ----------------------------------------------------------

def main():
    parser = argparse.ArgumentParser()
    g = parser.add_mutually_exclusive_group(required=True)
    g.add_argument("--test", action="store_true",
                   help="2 representative products x 3 scenes each")
    g.add_argument("--all", action="store_true", help="full inventory")
    g.add_argument("--case", type=str, metavar="SLUG",
                   help="process one case-study folder (cases/<slug>/)")
    g.add_argument("--image", type=Path, help="single image path")
    g.add_argument("--list", action="store_true",
                   help="print classification for all products, no API calls")
    g.add_argument("--scenes-list", action="store_true",
                   help="print available scene keys")
    parser.add_argument("--scene", help="single scene key (with --image)")
    parser.add_argument("--scenes", type=int, default=1,
                        help="scenes per product for --all/--case (default 1, max 3)")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    load_env()
    cfg = load_scenes()

    if args.scenes_list:
        for k, v in cfg["scenes"].items():
            print(f"  {k}\n    {v[:120]}{'...' if len(v) > 120 else ''}\n")
        return

    if args.list:
        for p in discover_products():
            ptype, scenes = classify(p, cfg)
            print(f"  {p.relative_to(SRC_PHOTOS)}  →  {ptype}  →  {scenes}")
        return

    if args.image:
        scene = args.scene or classify(args.image, cfg)[1][0]
        run_targets([(args.image, [scene])], cfg, dry_run=args.dry_run)
        return

    if args.test:
        targets = [
            (SRC_PHOTOS / "bronze-jar-black-box.jpg",
             ["japanese_tea_room", "boudoir_marble", "rose_marble_vanity"]),
            (SRC_PHOTOS / "cases/wuliangye-68/01.jpg",
             ["chinese_study", "imperial_banquet", "song_pavilion"]),
        ]
        run_targets(targets, cfg, dry_run=args.dry_run)
        return

    if args.case:
        n = max(1, min(args.scenes, 3))
        paths = discover_case(args.case)
        targets = []
        for p in paths:
            _, scenes = classify(p, cfg)
            targets.append((p, scenes[:n]))
        print(f"CASE: {args.case} — {len(paths)} images × {n} scene(s) = "
              f"{len(paths) * n} generations\n")
        run_targets(targets, cfg, dry_run=args.dry_run)
        return

    if args.all:
        n = max(1, min(args.scenes, 3))
        products = discover_products()
        targets = []
        for p in products:
            _, scenes = classify(p, cfg)
            targets.append((p, scenes[:n]))
        print(f"FULL RUN: {len(products)} products × {n} scene(s) = "
              f"{len(products) * n} generations\n")
        run_targets(targets, cfg, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
