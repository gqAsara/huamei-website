"""Authenticated Vercel Cron endpoint for the daily packaging question."""
import hashlib
import hmac
import importlib.util
import json
import logging
import os
import re
import urllib.error
import urllib.request
from datetime import date, datetime, timezone
from http.server import BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("packaging_desk", ROOT / "scripts/publish-packaging-news.py")
desk = importlib.util.module_from_spec(spec)
spec.loader.exec_module(desk)
DOCUMENT_TYPE = "packagingNewsEdition"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        raise ValueError("Document service redirected unexpectedly")


class Store:
    def __init__(self, env):
        project = env.get("NEXT_PUBLIC_SANITY_PROJECT_ID", "")
        dataset = env.get("NEXT_PUBLIC_SANITY_DATASET", "")
        self.token = env.get("SANITY_WRITE_TOKEN", "")
        if not self.token or not re.fullmatch(r"[a-z0-9-]+", project) or not re.fullmatch(r"[a-z0-9_-]+", dataset):
            raise ValueError("Document service is not configured")
        self.base = f"https://{project}.api.sanity.io/v2025-02-19/data"
        self.dataset = dataset

    def request(self, url, body=None):
        req = urllib.request.Request(url, data=json.dumps(body).encode() if body else None,
                                     headers={"Authorization": "Bearer " + self.token, "Content-Type": "application/json"})
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=5) as response:
            return json.load(response)

    def query(self, query, **params):
        args = {"query": query, **{"$" + k: json.dumps(v) for k, v in params.items()}}
        return self.request(self.base + "/query/" + self.dataset + "?" + urlencode(args))["result"]

    def exists(self, document_id):
        return bool(self.query("defined(*[_id == $id][0]._id)", id=document_id))

    def history(self, day):
        rows = self.query('*[_type == "packagingNewsEdition" && date < $day && _id == "packagingNews-" + date]{date,items[]{title,kind,sourceName,sourceUrl,image{url}}}', day=str(day))
        return [(date.fromisoformat(row["date"]), item) for row in rows for item in row["items"]]

    def create_once(self, doc):
        url = self.base + "/mutate/" + self.dataset + "?visibility=sync&returnIds=true"
        result = self.request(url, {"mutations": [{"createIfNotExists": doc}]})
        return result["results"][0]["operation"]


def authorized(header, secret):
    return bool(secret and header and hmac.compare_digest(header.encode(), ("Bearer " + secret).encode()))


def reviewed_seed(path, day, now):
    seed = json.loads(path.read_text(encoding="utf-8"))
    issue = desk.reviewed_edition(seed, path.parents[2], day, [])
    stamp = seed.get("publishedAt", now.isoformat(timespec="seconds"))
    published = datetime.fromisoformat(stamp.replace("Z", "+00:00"))
    if published.tzinfo is None or published > now or published.astimezone(desk.SHANGHAI).date() != day:
        raise ValueError("Invalid checked-in publication time")
    issue["publishedAt"] = stamp
    return issue


def publish_edition(store, now, root=ROOT, editorial_generator=desk.generate, clock=None):
    local_time = now.astimezone(desk.SHANGHAI)
    day = local_time.date()
    doc_id = "packagingNews-" + str(day)
    if store.exists(doc_id):
        return {"status": "already-published", "date": str(day)}
    if local_time.hour < 11:
        return {"status": "scheduled", "date": str(day)}

    seed = root / "content/news" / f"{day}.json"
    issue = None
    if seed.is_file():
        try:
            issue = reviewed_seed(seed, day, now)
        except (KeyError, TypeError, ValueError):
            logging.warning("Checked-in item is not a publishable daily question")
    if issue is None:
        issue = editorial_generator(root, now, remote_history=store.history(day))
        issue["publishedAt"] = local_time.isoformat(timespec="seconds")
    if clock and clock().astimezone(desk.SHANGHAI).date() != day:
        raise ValueError("Local publication date changed")
    for item in issue["items"]:
        item["_type"] = "packagingNewsStory"
        item["_key"] = hashlib.sha256(item["sourceUrl"].encode()).hexdigest()[:20]
        if item.get("image"):
            item["image"]["_type"] = "object"
    if issue.get("study"):
        issue["study"]["_type"] = "object"
        for index, row in enumerate(issue["study"]["rows"]):
            row["_type"] = "packagingResearchRow"
            row["_key"] = "row-" + str(index + 1)
    doc = {"_type": DOCUMENT_TYPE, "_id": doc_id, **issue}
    result = store.create_once(doc)
    return {"status": "published" if result == "create" else "already-published", "date": str(day)}


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if not os.environ.get("CRON_SECRET"):
            status, result = 503, {"error": "Publisher unavailable"}
        elif not authorized(self.headers.get("Authorization"), os.environ.get("CRON_SECRET")):
            status, result = 401, {"error": "Unauthorized"}
        else:
            try:
                clock = lambda: datetime.now(timezone.utc)
                result = publish_edition(Store(os.environ), clock(), clock=clock)
                status = 200
            except Exception as error:
                logging.error("Packaging publication failed (%s)", type(error).__name__)
                status, result = 503, {"error": "No edition was confirmed; retry this request."}
        body = json.dumps(result).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
