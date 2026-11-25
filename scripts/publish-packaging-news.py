"""Publish one original English packaging Q&A for each Shanghai calendar day."""
import argparse
import hashlib
import html
import importlib.util
import json
import os
import re
import tempfile
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import urlsplit
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
SHANGHAI = ZoneInfo("Asia/Shanghai")


def clean(text):
    return " ".join(html.unescape(str(text or "")).split())


PHOTO_LICENSES = {"cc0", "cc0 1.0", "public domain", "unsplash license", "pexels license",
                  "burst license", "shopify burst license", "pixabay content license"}


def checked_photo(photo):
    fields = ("url", "alt", "credit", "sourceUrl", "license")
    if not isinstance(photo, dict) or not all(isinstance(photo.get(k), str) and photo[k].strip() for k in fields):
        raise ValueError("Missing photo rights or alt text")
    photo = {k: photo[k].strip() for k in (*fields, "licenseUrl") if k in photo and isinstance(photo[k], str)}
    if (".." in photo["url"] or not re.fullmatch(r"/news-media/[a-zA-Z0-9_-]+(?:[.][a-zA-Z0-9_-]+)*\.(?:jpe?g|webp|png)", photo["url"], re.I)
            or photo["license"].lower() not in PHOTO_LICENSES):
        raise ValueError("Unapproved photo path or licence")
    for field in ("sourceUrl", "licenseUrl"):
        if field in photo:
            link = urlsplit(photo[field])
            if link.scheme != "https" or not link.hostname or link.username is not None or link.password is not None:
                raise ValueError("Missing HTTPS photo rights record")
    return photo


def illustrate(items, root, day, history):
    library = json.loads((root / "content/news-photo-library.json").read_text(encoding="utf-8"))
    used = {i["image"]["url"] for i in items if i.get("image")}
    last_use = {}
    for when, old in history:
        url = (old.get("image") or {}).get("url")
        if url:
            last_use[url] = max(when, last_use.get(url, date.min))
    photos = [(entry["topics"], checked_photo(entry["image"])) for entry in library]
    if not photos:
        raise ValueError("The newsroom photo library is empty")
    for item in items:
        if item.get("image"):
            continue
        text = " ".join([item["title"], item["summary"], item["buyerNote"]]).lower().replace("-", " ")
        choices = []
        for terms, photo in photos:
            if photo["url"] in used:
                continue
            terms = {term.lower().replace("-", " ") for term in terms}
            matches = sum(len(term.split()) for term in terms - {"packaging", "paper"} if
                          re.search(r"\b" + re.escape(term) + r"(?:s|es)?\b", text))
            if not matches and ("packaging" not in terms or used):
                continue
            when = last_use.get(photo["url"], date.min)
            tie = hashlib.sha256(f'{day}:{photo["url"]}'.encode()).digest()
            # Specific, unused photos take precedence over broad or recently used images.
            score = (bool(matches), day - when > timedelta(days=14), matches, -when.toordinal(), tie)
            choices.append((score, photo))
        if choices:
            item["image"] = max(choices, key=lambda row: row[0])[1]
            used.add(item["image"]["url"])
    if not used:
        raise ValueError("No suitable licensed photograph for this edition")
    return items


def question_key(title):
    words = re.findall(r"[a-z0-9]+", title.casefold().replace("’", "'"))
    return " ".join(words)


def prepare_question(item, today):
    keys = ("title", "summary", "buyerNote", "sourceName", "sourceDate", "sourceUrl")
    if not isinstance(item, dict) or not all(isinstance(item.get(k), str) and item[k].strip() for k in keys):
        raise ValueError("Question, direct answer, practical note and evidence are required")
    question = {k: item[k].strip() for k in keys}
    body = " ".join(question[k] for k in ("title", "summary", "buyerNote"))
    if (item.get("kind", "question") != "question" or not question["title"].endswith("?")
            or re.search(r"[\u3400-\u9fff]|https?://|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}", body)
            or len(question["summary"].split()) < 8 or len(question["buyerNote"].split()) < 5):
        raise ValueError("A standalone English packaging question and answer are required")
    if date.fromisoformat(question["sourceDate"]) > today:
        raise ValueError("Future evidence date")
    evidence = urlsplit(question["sourceUrl"])
    if evidence.scheme != "https" or not evidence.hostname or evidence.path in ("", "/") or evidence.username is not None or evidence.password is not None:
        raise ValueError("A permanent HTTPS evidence URL is required")
    question["kind"] = "question"
    if "image" in item:
        question["image"] = checked_photo(item["image"])
    return question


def archive_text(text):
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text.strip().removeprefix("> "))
    return clean(text.replace("**", "").replace("__", ""))


# The archive also contains time-sensitive campaigns, prices and client stories.
# Only independent, evergreen answers to a concrete packaging question are eligible.
ARCHIVE_SKIP = re.compile(
    r"\b(20\d\d|China|Chinese|Huamei|Henan|certifi\w+|regulat\w+|standard[s]?|legislation|"
    r"PPWR|EPR|EU|FSC|FDA|BSCI|MOQ|ISO|GB/T|programme|pricing|trend[s]?|forecast|"
    r"million|trillion|our|we|briefs?|manufacturers?|procurement|audit|ROI|sourcing|supplier[s]?|trade shows?|"
    r"lead times?|wholesale|B2B|commercial sense|unit cost|DTC|SKU|retail launch|brand[s]?|factory|factories)\b|"
    r"[$¥€]|[-+]\d+%|[\u3400-\u9fff]",
    re.I,
)
BOX_TERMS = re.compile(r"\b(packaging|boxes|box|cartons?|paper\w*|cardboard|corrugat\w*|inserts?|ribbon|foil|emboss\w*|deboss\w*|laminat\w*|liners?|lids?|mailers?)\b", re.I)


def archive_questions(root, today):
    for path in sorted((root / "content/blogs").glob("*.md")):
        text = path.read_text(encoding="utf-8")
        meta = re.search(r'''(?m)^publishedAt:\s*["']?(\d{4}-\d{2}-\d{2})''', text)
        if not meta or meta[1] > today.isoformat():
            continue
        for match in re.finditer(r"(?m)^## ([^\n]+\?)\s*\n+(.*?)(?=^#|\Z)", text, re.S | re.M):
            title = archive_text(match[1])
            if not BOX_TERMS.search(title) or ARCHIVE_SKIP.search(title) or len(title) > 115:
                continue
            paragraphs = [archive_text(p) if "/volumes/" not in p else "" for p in re.split(r"\n\s*\n", match[2].strip())]
            if len(paragraphs) < 2:
                continue
            answer = paragraphs[0]
            # Never splice unrelated sections or publish fragments of a table/list.
            if not (12 <= len(answer.split()) <= 95) or ARCHIVE_SKIP.search(answer) or answer[:1] in "-*|#" or not answer.endswith((".", "?", "!")):
                continue
            for paragraph in paragraphs[1:]:
                if ARCHIVE_SKIP.search(paragraph) or paragraph[:1] in "-*|#0123456789" or "see " in paragraph.lower():
                    continue
                note = re.split(r"(?<=[.!?])\s+(?=[A-Z])", paragraph, maxsplit=1)[0]
                practical = re.search(r"\b(if|choose|use\w*|place|avoid|keep|allow\w*|protect\w*|fit\w*|check|measure|hold\w*|seal\w*|grip|ship\w*|wrap\w*|test|tape|clos\w*)\b", note, re.I)
                if practical and 10 <= len(note.split()) <= 65 and note.endswith(".") and note not in answer:
                    yield prepare_question({"title": title, "summary": answer, "buyerNote": note,
                                           "sourceName": "Huamei packaging guide", "sourceDate": meta[1],
                                           "sourceUrl": "https://huamei.io/blogs/" + path.stem}, today)
                    break


def read_history(root, today):
    result = []
    for file in sorted((root / "content/news").glob("????-??-??.json")):
        day = date.fromisoformat(file.stem)
        if day < today:
            edition = json.loads(file.read_text(encoding="utf-8"))
            result.extend((day, item) for item in edition["items"])
    return result


def question_edition(question, root, today, history):
    illustrate([question], root, today, history)
    return {"date": str(today), "title": question["title"], "summary": question["summary"], "items": [question]}


def new_question(existing, history, day):
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key or not existing:
        raise ValueError("No unused question or configured editorial fallback")
    # Only already-public content is sent to the same editorial provider used by this site.
    passages = sorted(existing, key=lambda q: hashlib.sha256((str(day) + q["title"]).encode()).digest())[:8]
    known = {question_key(q["title"]) for _, q in history if q.get("kind") == "question"}
    recent = [q["title"] for _, q in sorted(history, key=lambda entry: entry[0], reverse=True) if q.get("kind") == "question"][:120]
    excerpts = [q["summary"] + " " + q["buyerNote"] for q in passages]
    system = (
        "Write a new evergreen FAQ for ordinary English-speaking shoppers mailing, opening, saving or recycling paper boxes. "
        "Pick a distinct, useful follow-up that the supplied public evidence answers. Avoid rewording any listed question. "
        "Base every factual claim and step on a single excerpt. No invented facts, brand names, citations, numeric tolerances, "
        "legal claims or unsupported advice. Use ordinary, concrete words. Return JSON with a candidates array of two objects. "
        "Each has index (the zero-based excerpt index), evidence (one exact supporting sentence copied only for internal verification), "
        "title (a short search question), summary (a direct original answer) and buyerNote (a distinct practical check)."
    )
    payload = {"model": "openai/gpt-4.1-mini", "response_format": {"type": "json_object"},
               "max_tokens": 850, "temperature": 0.4, "messages": [{"role": "system", "content": system},
               {"role": "user", "content": json.dumps({"publicExcerpts": excerpts, "previousQuestions": recent}, ensure_ascii=False)}]}
    req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=json.dumps(payload).encode(),
                                 headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=20) as response:
        result = json.load(response)
    candidates = json.loads(result["choices"][0]["message"]["content"])["candidates"]
    for proposed in candidates:
        index = proposed.get("index")
        if type(index) is not int or not 0 <= index < len(passages):
            continue
        support = clean(proposed.get("evidence"))
        if len(support.split()) < 6 or support.casefold() not in clean(excerpts[index]).casefold():
            continue
        try:
            base = {k: passages[index][k] for k in ("sourceName", "sourceDate", "sourceUrl")}
            candidate = prepare_question({**base, **{k: proposed[k] for k in ("title", "summary", "buyerNote")}}, day)
        except (ValueError, KeyError, TypeError):
            continue
        normalized = question_key(candidate["title"])
        numbers = set(re.findall(r"\d+(?:\.\d+)?", candidate["summary"] + " " + candidate["buyerNote"]))
        if normalized not in known and numbers <= set(re.findall(r"\d+(?:\.\d+)?", excerpts[index])):
            return candidate
    raise ValueError("No new question supported by the supplied public guides")


def checked_study(study):
    def prose(value):
        return isinstance(value, str) and bool(value.strip())

    if not isinstance(study, dict) or not all(prose(study.get(k)) for k in ("title", "method", "limitations")):
        raise ValueError("Study title, method and limitations are required")
    columns, rows, findings = (study.get(k) for k in ("columns", "rows", "findings"))
    if (not isinstance(columns, list) or not 2 <= len(columns) <= 12 or not all(map(prose, columns))
            or not isinstance(rows, list) or not 2 <= len(rows) <= 200
            or not isinstance(findings, list) or not findings or not all(map(prose, findings))):
        raise ValueError("A numeric study needs a labelled table and findings")
    normalized = []
    for row in rows:
        cells = row.get("cells") if isinstance(row, dict) else row
        if not isinstance(cells, list) or len(cells) != len(columns) or not all(map(prose, cells)):
            raise ValueError("Study rows must match the column headings")
        normalized.append({"cells": [cell.strip() for cell in cells]})
    return {k: study[k].strip() for k in ("title", "method", "limitations")} | {
        "columns": columns, "rows": normalized, "findings": findings}


def weekly_edition(root, day, history, researcher=None):
    if researcher is None:
        path = Path(__file__).with_name("packaging_research.py")
        spec = importlib.util.spec_from_file_location("packaging_research", path)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        researcher = module.build_research
    known = {question_key(item["title"]) for _, item in history if item.get("kind") == "question"}
    for offset in range(40):
        data = researcher(day + timedelta(weeks=offset))
        title = data["question"]
        if question_key(title) in known:
            title = data.get("specificQuestion", title)
        if question_key(title) not in known:
            break
    else:
        raise ValueError("No unused weekly study model or distinct dimensional question")
    question = prepare_question({"title": title, "summary": data["answer"], "buyerNote": data["check"],
                                 "sourceName": data.get("sourceName", "Huamei packaging research"),
                                 "sourceDate": data.get("sourceDate", str(day)),
                                 "sourceUrl": data.get("sourceUrl", "https://huamei.io/news/" + str(day))}, day)
    edition = question_edition(question, root, day, history)
    if not isinstance(data.get("intro"), str) or not data["intro"].strip():
        raise ValueError("Research edition introduction is required")
    edition["summary"] = data["intro"].strip()
    edition["study"] = checked_study(data["study"])
    return edition


def reviewed_edition(edition, root, today, history):
    if edition["date"] != str(today) or len(edition["items"]) != 1:
        raise ValueError("A daily edition has one question")
    question = prepare_question(edition["items"][0], today)
    result = question_edition(question, root, today, history)
    if today.weekday() == 2:
        result["study"] = checked_study(edition.get("study"))
        if isinstance(edition.get("summary"), str) and edition["summary"].strip():
            result["summary"] = edition["summary"].strip()
    return result


def generate(root, now, remote_history=(), researcher=None):
    today = now.astimezone(SHANGHAI).date()
    history = read_history(root, today) + list(remote_history)
    last_use = {}
    for day, old in history:
        if old.get("kind") == "question" and old.get("title"):
            key = question_key(old["title"])
            last_use[key] = max(day, last_use.get(key, date.min))
    draft = root / "content/news-drafts" / (str(today) + ".json")
    if draft.is_file():
        try:
            edition = json.loads(draft.read_text(encoding="utf-8"))
            result = reviewed_edition(edition, root, today, history)
            if question_key(result["title"]) not in last_use:
                return result
        except (ValueError, KeyError, TypeError):
            pass  # The reviewed bank still supplies a complete edition.
    if today.weekday() == 2:
        return weekly_edition(root, today, history, researcher)
    bank = json.loads((root / "content/packaging-questions.json").read_text(encoding="utf-8"))
    choices = []
    for item in bank:
        try:
            choices.append(prepare_question(item, today))
        except (ValueError, TypeError):
            continue
    available = [q for q in choices if question_key(q["title"]) not in last_use]
    if not available:
        choices.extend(archive_questions(root, today))
        available = [q for q in choices if question_key(q["title"]) not in last_use]
    if not available:
        return question_edition(new_question(choices, history, today), root, today, history)
    question = min(available, key=lambda q: hashlib.sha256((str(today) + question_key(q["title"])).encode()).digest())
    return question_edition(question, root, today, history)


def publish(root, now, **kwargs):
    today = now.astimezone(SHANGHAI).date()
    target = root / "content/news" / f"{today}.json"
    if target.exists():
        print(f"Edition already present: {today}")
        return target
    edition = generate(root, now, **kwargs)
    edition["publishedAt"] = now.astimezone(SHANGHAI).isoformat(timespec="seconds")
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=target.parent, delete=False) as stream:
        temp = Path(stream.name)
        try:
            json.dump(edition, stream, indent=2, ensure_ascii=False)
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
            try:
                os.link(temp, target)  # Do not replace a completed concurrent edition.
            except FileExistsError:
                pass
        finally:
            temp.unlink(missing_ok=True)
    print(f"Edition ready: {today}")
    return target


if __name__ == "__main__":
    argparse.ArgumentParser(description=__doc__).parse_args()
    publish(ROOT, datetime.now(timezone.utc))
