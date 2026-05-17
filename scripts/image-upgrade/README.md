# Product image upgrade — luxury background generator

Replaces studio backgrounds on Huamei product photos with editorial luxury
settings (Chinese study, marble boudoir, Kyoto tea room, etc.) using
OpenRouter's Nano Banana (Gemini 2.5 Flash Image).

Originals are never modified. Output goes to `public/photos/upgraded/`,
mirroring the source folder structure. Each output is named
`<original-stem>__<scene-key>.png`.

## When new case study images land

```bash
# add new images to public/photos/cases/<slug>/01.jpg, 02.jpg, ...
cd ~/Desktop/huamei-website
python3 scripts/image-upgrade/upgrade.py --case <slug>
```

The script auto-classifies by case slug + filename keywords (see
`scenes.json` → `type_rules`) and picks an appropriate scene. Override
with `--scenes=2` or `--scenes=3` to get backups.

## Other modes

```bash
python3 scripts/image-upgrade/upgrade.py --list           # show classification, no API
python3 scripts/image-upgrade/upgrade.py --scenes-list    # show available scene keys
python3 scripts/image-upgrade/upgrade.py --image PATH     # single image, auto scene
python3 scripts/image-upgrade/upgrade.py --image PATH --scene chinese_study
python3 scripts/image-upgrade/upgrade.py --test           # 6-image smoke test (~$0.25)
python3 scripts/image-upgrade/upgrade.py --all            # entire inventory
```

## Editing prompts / adding scenes / adding product types

Everything is in **`scenes.json`** — the Python script just reads it.

- Add a new scene → new entry in `scenes.{key}`
- Change wording of an existing scene → edit the string
- Add a new product type → append to `type_rules` (match by case-folder
  slug or filename keyword)
- Reorder scenes within a type → first-listed is the default for `--scenes=1`
- Try Nano Banana 2 / Pro → change `model` in `scenes.json`

Keep scene **keys** stable — they're embedded in output filenames.

## Cost

~$0.04 per generated image at Nano Banana baseline. ~10s per image.
Full inventory (~67 products × 1 scene) ≈ $3 and ~12 minutes.

## API key

`OPENROUTER_API_KEY` in `.env.local` (gitignored). Get one at
<https://openrouter.ai/keys>. The Vercel-stored copy was an empty
placeholder as of 2026-05-13 — if you need it on the live site too, run:

```bash
vercel env rm OPENROUTER_API_KEY production
vercel env add OPENROUTER_API_KEY production   # paste real key
```
