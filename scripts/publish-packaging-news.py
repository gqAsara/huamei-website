"""Publish one Shanghai-dated packaging brief from attributed, checked sources."""
import argparse
import hashlib
import html
import json
import os
import re
import sys
import tempfile
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urljoin, urlsplit, urlunsplit
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
SHANGHAI = ZoneInfo("Asia/Shanghai")
FEEDS = {
    "Atlantic Packaging": "https://www.atlanticpkg.com/feed/",
    "Paperboard Packaging Council": "https://paperbox.org/feed/",
    "Cepi": "https://www.cepi.org/feed/",
    "Pro Carton": "https://www.procarton.com/feed/",
    "4evergreen": "https://4evergreenforum.eu/feed/",
}
# A draft may cite an additional official source. Changes to this list are reviewed in Git.
OFFICIAL_HOSTS = {
    "huamei.io", "fsc.org", "us.fsc.org", "connect.fsc.org", "pefc.org",
    "environment.ec.europa.eu", "commission.europa.eu", "eur-lex.europa.eu",
    "epa.gov", "gov.uk", "ista.org", "afandpa.org", "fefco.org",
    "mondigroup.com", "metsagroup.com", "storaenso.com", "smurfitwestrock.com",
    "internationalpaper.com", "holmen.com", "prnewswire.com", "packagingeurope.com",
    "tetrapak.com", "nfinite.ca", "ds-smith.com", "dssmith.com", "billerud.com", "sappi.com",
}
MAX_BYTES = 4_000_000
LOOKBACK = timedelta(days=14)
RECYCLE_AFTER = timedelta(days=180)

# Match the headline itself so a news site's boilerplate cannot qualify a story.
TOPICS = [
    (r"barrier[- ](?:paper|film|board|layer|performance|properties|coating|packaging)|high.barrier|oxygen barrier|food.contact|greaseproof|water.vapou?r|coating", "barrier performance", "Which barrier and food-contact tests cover the actual paper grade, product and storage conditions?"),
    (r"recycl|repulp|circular|macrostick|recovered paper", "paper recovery", "Can the converter share the recycling assessment for the finished pack, including its coatings and adhesives?"),
    (r"epr|eco.modulation|ppwr|regulation|labelling|labeling|producer responsibility", "packaging requirements", "Which market, effective date and party responsible for reporting apply to this packaging specification?"),
    (r"shipment|forecast|paperboard demand|production volume|capacity|lead time|supply", "paperboard supply", "What lead time and price-validity window will the supplier commit to for the required board grade?"),
    (r"corrugat|transit|shipper|shipping|transport|drop.test|box seal|compression", "transit packaging", "Which drop, vibration or compression test will the supplier run on a sample packed with the actual product?"),
    (r"folding carton|cartonboard|paperboard|board grade|kraft|greyboard|fiber.based|fibre.based", "board specification", "Which board grade, caliper and grain direction should be locked into the approved production sample?"),
    (r"paper carrier|bottle carrier|paper bag|paper.based|paper packaging|fibre packaging|fiber packaging", "paper packaging structures", "Can the supplier provide a filled sample to check the opening, handle strength and product fit?"),
    (r"foil|emboss|\bprint|colour|color|\bproof|finish|laminat", "print and finishing", "Which physical proofs will show the final colour, finish and registration on the specified stock?"),
    (r"drawer|rigid box|gift box|insert|fitment|gift set|unboxing|presentation box", "box construction", "What are the product clearances, insert dimensions and tolerances on the approved physical sample?"),
]
BUYER_CONTEXT = {
    "barrier performance": "A coating on a flat sheet can behave differently after creasing or sealing. Ask for test results on a converted sample.",
    "paper recovery": "A mill test on unprinted board does not cover a finished box with foil, laminate or glued-in components. Identify exactly which sample was tested.",
    "packaging requirements": "For a buying brief, separate the pack’s destination market, material weights and responsible business. These details determine what to ask suppliers to document.",
    "paperboard supply": "An industry shipment or capacity figure describes a wider market. For an order, compare quotes on the same grade, caliper, delivery window and volume.",
    "transit packaging": "A transport pack is tested as a filled assembly. Include the product weight, inner protection and intended shipping route when comparing test reports.",
    "board specification": "Stock substitutions can change scoring, print appearance and carton fit. Record the grade and caliper alongside the signed-off sample.",
    "paper packaging structures": "Handle placement, gussets and dividers affect how a loaded carrier performs. A filled prototype makes these details visible before tooling.",
    "print and finishing": "A screen proof does not reproduce the feel of a finish or the way stock takes ink. Check a physical sample made with the proposed process.",
    "box construction": "Two packs with the same outer dimensions can have different usable space. Record the internal dimensions and insert allowances for a meaningful quote comparison.",
}
PACKAGING_SUBJECT = re.compile(r"\b(packag\w*|paper\w*|pulp|cartons?|cartonboard|box(?:es)?|corrugat\w*|folding board|fibre|fiber|carrier|epr|ppwr|repulp\w*|macrostick\w*)\b", re.I)
GENERIC_TOPIC = ("packaging specifications", "Which dimensions, material specifications and acceptance checks should appear on the sample approval?")
BLOCKED = re.compile(r"\b(awards?|winners?|nomina\w*|appoint\w*|earnings|dividends?|quarterly results|annual general meeting|register|webinar|conference|summit|workshop|boot camp|symposium|face-to-face|election|obituary|welcomes?|save the date)\b", re.I)
BANNED_PATH = re.compile(r"/(?:feed|tag|category|author|page|search|wp-login)(?:/|$)", re.I)
PII = re.compile(r"\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b")
STOP = set("the of and for its with a to from in on by how as is an about at new it paper packaging reports report announces launch introduces publishes press release news articles www com post".split())


def clean(text):
    return " ".join(html.unescape(str(text or "")).split())


def plain_host(host):
    return (host or "").lower().removeprefix("www.")


ALL_HOSTS = OFFICIAL_HOSTS | {plain_host(urlsplit(url).hostname) for url in FEEDS.values()}


def checked_url(value, hosts):
    u = urlsplit(value)
    if u.scheme != "https" or not u.hostname or u.username is not None or u.password is not None or u.port not in (None, 443) or plain_host(u.hostname) not in hosts:
        raise ValueError("unexpected source origin")
    if not u.path or u.path == "/" or re.search(r"[\x00-\x20\\]", value):
        raise ValueError("invalid article URL")
    args = [(k, v) for k, v in parse_qsl(u.query, keep_blank_values=True)
            if not k.lower().startswith("utm_") and k.lower() not in {"fbclid", "gclid"}]
    return urlunsplit(("https", u.hostname.lower(), u.path, urlencode(args), ""))


class SafeRedirects(urllib.request.HTTPRedirectHandler):
    def __init__(self, hosts):
        self.hosts = hosts

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        target = checked_url(urljoin(req.full_url, newurl), self.hosts)
        return super().redirect_request(req, fp, code, msg, headers, target)


def download(url, hosts, timeout=8):
    opener = urllib.request.build_opener(SafeRedirects(hosts))
    request = urllib.request.Request(checked_url(url, hosts), headers={"User-Agent": "Mozilla/5.0 (compatible; HuameiPackagingDesk/1.0; +https://huamei.io/news)"})
    with opener.open(request, timeout=timeout) as reply:
        raw = reply.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES:
            raise ValueError("source exceeds size limit")
        return checked_url(reply.geturl(), hosts), reply.headers.get_content_type(), raw


class PageInfo(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = None
        self.in_title = False
        self.title = ""
        self.published = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "link" and "canonical" in (attrs.get("rel") or "").lower().split():
            self.canonical = attrs.get("href")
        if tag == "meta" and (attrs.get("property") or attrs.get("name") or "").lower() in {"article:published_time", "datepublished", "citation_publication_date"}:
            self.published = attrs.get("content")

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def article_url(url, source_date, timeout=8):
    hosts = {plain_host(urlsplit(checked_url(url, ALL_HOSTS)).hostname)}
    final, mime, raw = download(url, hosts, timeout)
    if mime not in {"text/html", "application/xhtml+xml"}:
        raise ValueError("article is not HTML")
    page = PageInfo()
    page.feed(raw.decode("utf-8", "replace"))
    if not clean(page.title) or re.search(r"page not found|just a moment|access denied|captcha|404 not found", page.title, re.I):
        raise ValueError("publisher did not return an article")
    canonical = checked_url(urljoin(final, page.canonical or final), hosts)
    final_path = urlsplit(canonical).path
    if BANNED_PATH.search(final_path):
        raise ValueError("not an article permalink")
    original_path = urlsplit(url).path
    if original_path.rstrip("/") != final_path.rstrip("/") and not tokens(original_path) & tokens(final_path):
        raise ValueError("source redirected to a different subject")
    if page.published and re.match(r"^\d{4}-\d\d-\d\d", page.published):
        # Publisher feeds and HTML can show different time zones near midnight.
        if abs((source_date - date.fromisoformat(page.published[:10])).days) > 1:
            raise ValueError("article date disagrees with the publisher")
    return canonical


def topic_for(title):
    return next(((name, question) for pattern, name, question in TOPICS if re.search(pattern, title, re.I)), None)


def tokens(s):
    return set(re.findall(r"[a-z0-9]+", s.lower())) - STOP


def same_report(item, previous):
    link, other = urlsplit(item["sourceUrl"]), urlsplit(previous["sourceUrl"])
    def fingerprint(parts):
        params = sorted((k, v) for k, v in parse_qsl(parts.query) if not k.lower().startswith("utm_") and k.lower() not in {"fbclid", "gclid"})
        return plain_host(parts.hostname), parts.path.rstrip("/"), params
    if fingerprint(link) == fingerprint(other):
        return True
    if item["kind"] == previous.get("kind", "news") == "news":
        left = [tokens(item["title"].removeprefix(item["sourceName"] + ": ")), tokens(link.path.rsplit("/", 2)[-2] if link.path.endswith("/") else link.path.split("/")[-1])]
        right = [tokens(previous["title"].removeprefix(previous["sourceName"] + ": ")), tokens(other.path.rsplit("/", 2)[-2] if other.path.endswith("/") else other.path.split("/")[-1])]
        return any(a and a == b or len(a & b) >= 4 and len(a & b) / len(a | b) >= .72 for a in left for b in right)
    return False


def fetch_feed(pair, now):
    name, url = pair
    allowed = {plain_host(urlsplit(url).hostname)}
    _, _, raw = download(url, allowed)
    if b"<!ENTITY" in raw.upper():
        raise ValueError("unexpected XML declaration")
    result = []
    for entry in ET.fromstring(raw).findall("./channel/item"):
        title = clean(entry.findtext("title"))
        try:
            stamp = parsedate_to_datetime(clean(entry.findtext("pubDate")))
            if stamp.tzinfo is None or stamp > now or now - stamp > LOOKBACK:
                continue
            link = checked_url(clean(entry.findtext("link")), allowed)
        except (ValueError, TypeError, IndexError):
            continue
        topic = topic_for(title)
        if not topic or not PACKAGING_SUBJECT.search(title) or BLOCKED.search(title) or len(title.split()) > 23 or len(title) > 200 or PII.search(title):
            continue
        day = stamp.date().isoformat()
        subject, note = topic
        headline = re.sub(r"^(?:press release|deep dive|podcast)\s*:\s*", "", title, flags=re.I)
        result.append({"title": f'{name}: “{headline}”', "summary": BUYER_CONTEXT[subject],
                       "sourceUrl": link, "sourceName": name, "sourceDate": day, "kind": "news", "buyerNote": note})
    return result


def check_candidate(item, older, today, verify):
    fields = ("title", "summary", "sourceName", "sourceUrl", "sourceDate", "buyerNote", "kind")
    if not isinstance(item, dict) or not all(isinstance(item.get(k), str) and clean(item[k]) for k in fields):
        raise ValueError("item has missing fields")
    if item["kind"] not in {"news", "reference"} or any(PII.search(item[k]) for k in fields):
        raise ValueError("unexpected item classification or personal contact information")
    source_day = date.fromisoformat(item["sourceDate"])
    if source_day > today or (item["kind"] == "news" and today - source_day > LOOKBACK):
        raise ValueError("source date is out of range")
    item = {k: item[k].strip() for k in fields}
    url = checked_url(item["sourceUrl"], ALL_HOSTS)
    if plain_host(urlsplit(url).hostname) == "huamei.io" and (item["kind"] != "reference" or not re.fullmatch(r"/blogs/[a-z0-9-]+", urlsplit(url).path)):
        raise ValueError("internal source must be an existing reference article")
    if any(same_report(item, old) for old in older):
        raise ValueError("already covered")
    item["sourceUrl"] = verify(url, source_day)
    if any(same_report(item, old) for old in older):
        raise ValueError("canonical source already covered")
    return item


def frontmatter(markdown):
    # Only the four single-line plain/quoted scalars used by our blog archive.
    fields = {}
    lines = markdown.splitlines()
    if not lines or lines[0] != "---":
        return fields
    for line in lines[1:]:
        if line == "---":
            break
        match = re.fullmatch(r"(title|description|slug|publishedAt):\s*(.+)", line)
        if match:
            key, value = match.groups()
            if value.startswith('"'):
                try:
                    value = json.loads(value)
                except ValueError:
                    continue
            elif value.startswith("'"):
                value = value.strip("'").replace("''", "'")
            fields[key] = clean(value)
    return fields


def reference(root, today, history, verify):
    articles = []
    for path in sorted((root / "content/blogs").glob("*.md")):
        meta = frontmatter(path.read_text(encoding="utf-8"))
        if not all(meta.get(key) for key in ("title", "description", "publishedAt")):
            continue
        try:
            day = date.fromisoformat(meta["publishedAt"][:10])
        except ValueError:
            continue
        if day >= today or not re.fullmatch(r"[a-z0-9-]+", path.stem):
            continue
        item = {"kind": "reference", "title": meta["title"], "summary": meta["description"], "buyerNote": (topic_for(meta["title"]) or GENERIC_TOPIC)[1],
                "sourceDate": day.isoformat(), "sourceName": "Huamei buyer guides", "sourceUrl": f"https://huamei.io/blogs/{path.stem}"}
        prior = max((when for when, older in history if same_report(item, older)), default=date.min)
        if prior != date.min and today - prior < RECYCLE_AFTER:
            continue
        lottery = hashlib.sha256(f"{today}:{path.stem}".encode()).hexdigest()
        articles.append((prior, lottery, item))
    # Unused guides always come before repeats, even when over 180 days old.
    consecutive_service_failures = 0
    for _, _, item in sorted(articles, key=lambda row: row[:2]):
        try:
            return check_candidate(item, [], today, verify)
        except urllib.error.HTTPError as error:
            # A missing article is not a reason to skip the remaining archive.
            if error.code in (404, 410):
                consecutive_service_failures = 0
                continue
            consecutive_service_failures += 1
        except OSError:
            consecutive_service_failures += 1
        except ValueError:
            consecutive_service_failures = 0
        if consecutive_service_failures >= 3:
            break
    raise ValueError("No eligible buyer guide with a reachable source page")


def read_history(root, today):
    result = []
    for file in sorted((root / "content/news").glob("????-??-??.json")):
        day = date.fromisoformat(file.stem)
        if day < today:
            issue = json.loads(file.read_text(encoding="utf-8"))
            result.extend((day, item) for item in issue["items"])
    return result


def generate(root, now, feed_reader=fetch_feed, verify=article_url, remote_history=()):
    today = now.astimezone(SHANGHAI).date()
    history = read_history(root, today) + list(remote_history)
    older = [item for _, item in history]
    draft = root / "content/news-drafts" / f"{today}.json"
    if draft.is_file():
        try:
            edition = json.loads(draft.read_text(encoding="utf-8"))
            if edition["date"] != str(today) or not all(isinstance(edition[k], str) and clean(edition[k]) and not PII.search(edition[k]) for k in ("title", "summary")) or not isinstance(edition["items"], list) or not 1 <= len(edition["items"]) <= 3:
                raise ValueError("invalid draft fields or issue date")
            items = []
            for item in edition["items"]:
                items.append(check_candidate(item, older + items, today, verify))
            return {"date": str(today), "title": edition["title"], "summary": edition["summary"], "items": items}
        except (OSError, ValueError, KeyError, TypeError) as error:
            print(f"Draft not published: {error}. Trying the verified feeds.", file=sys.stderr)

    def gather(pair):
        try:
            return feed_reader(pair, now)
        except (OSError, ValueError, ET.ParseError) as error:
            print(f"Feed unavailable: {pair[0]} ({type(error).__name__})", file=sys.stderr)
            return []

    with ThreadPoolExecutor(max_workers=len(FEEDS)) as workers:
        candidates = [item for batch in workers.map(gather, FEEDS.items()) for item in batch]
    items = []
    for candidate in sorted(candidates, key=lambda i: i["sourceDate"], reverse=True):
        if any(i["sourceName"] == candidate["sourceName"] for i in items):
            continue
        try:
            items.append(check_candidate(candidate, older + items, today, verify))
        except (OSError, ValueError):
            continue
        if len(items) == 3:
            break
    if items:
        topics = list(dict.fromkeys(topic_for(i["title"])[0] for i in items))
        title = "Packaging update: " + ", ".join(topics)
        summary = "Coverage from " + ", ".join(i["sourceName"] for i in items) + ". The quoted headlines are the publishers’ own. Huamei’s notes explain what to check with a supplier."
    else:
        item = reference(root, today, history, verify)
        items = [item]
        title = "From the reference desk: " + item["title"]
        summary = "Today’s selection is a previously published Huamei buyer guide. Its original date and a question for your next packaging brief are included below."
    return {"date": str(today), "title": title, "summary": summary, "items": items}


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
