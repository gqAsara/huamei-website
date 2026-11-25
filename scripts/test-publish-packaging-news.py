import importlib.util
import json
import tempfile
import unittest
from datetime import date, datetime, timezone
from pathlib import Path
from unittest.mock import Mock, patch

file = Path(__file__).with_name('publish-packaging-news.py')
spec = importlib.util.spec_from_file_location('packaging_news', file)
news = importlib.util.module_from_spec(spec)
spec.loader.exec_module(news)

NOW = datetime(2026, 11, 24, 23, 40, tzinfo=timezone.utc)  # Nov 25 in Shanghai


def report(title="Recycling test for coated folding cartons", url="https://www.procarton.com/coated-carton-test/"):
    return {"title": title, "summary": "The association describes a test for a coated carton.",
            "sourceName": "Pro Carton", "sourceDate": "2026-11-24", "sourceUrl": url,
            "buyerNote": "Has the supplier tested the converted board?", "kind": "news"}


class PublisherTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.feeds = lambda pair, now: [report()] if pair[0] == "Pro Carton" else []
        self.verify = lambda url, day: url

    def write_blog(self, slug="paperboard-buyer", day="2026-06-01"):
        path = self.root / "content/blogs" / (slug + ".md")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text('---\ntitle: "Specify a folding carton"\ndescription: "A guide to board choice."\npublishedAt: "' + day + 'T09:00:00+08:00"\n---\nBody\n')

    def write_issue(self, folder, stamp, items):
        path = self.root / "content" / folder / (stamp + ".json")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps({"date": stamp, "title": "Coated paper", "summary": "A material update.", "items": items}))
        return path

    def test_today_only_once(self):
        target = news.publish(self.root, NOW, feed_reader=self.feeds, verify=self.verify)
        self.assertEqual(target.name, "2026-11-25.json")
        before = target.read_bytes()
        news.publish(self.root, NOW, feed_reader=lambda *args: self.fail(), verify=self.verify)
        self.assertEqual(before, target.read_bytes())
        self.assertEqual("2026-11-25", json.loads(before)["date"])

    def test_valid_draft_takes_precedence(self):
        self.write_issue("news-drafts", "2026-11-25", [report()])
        out = news.generate(self.root, NOW, feed_reader=lambda *a: self.fail(), verify=self.verify)
        self.assertEqual("Coated paper", out["title"])

    def test_future_and_unknown_urls_never_become_news(self):
        bogus = report(url="https://rogue.example.com/a")
        self.write_issue("news-drafts", "2026-11-25", [bogus])
        self.write_blog(); self.write_blog("future-only", "2026-12-01")
        bad = {**report(), "sourceDate": "2026-11-26"}
        out = news.generate(self.root, NOW, feed_reader=lambda *a: [bad], verify=self.verify)
        self.assertEqual("reference", out["items"][0]["kind"])
        self.assertEqual("2026-06-01", out["items"][0]["sourceDate"])

    def test_duplicate_syndicated_story_falls_back(self):
        old = report(url="https://paperbox.org/different-path/")
        self.write_issue("news", "2026-11-23", [old])
        self.write_blog()
        out = news.generate(self.root, NOW, self.feeds, self.verify)
        self.assertEqual("reference", out["items"][0]["kind"])

    def test_final_canonical_duplicate_falls_back(self):
        old=report("A previous report with a different headline")
        self.write_issue("news", "2026-11-22", [old]); self.write_blog()
        item=report(url="https://www.procarton.com/updated-path/")
        verify=lambda u,d: old["sourceUrl"] if "updated-path" in u else u
        result=news.generate(self.root,NOW,lambda *a:[item],verify)
        self.assertEqual("reference",result["items"][0]["kind"])

    def test_recent_guides_not_reused(self):
        self.write_blog("old-guide"); self.write_blog("unused-guide")
        self.write_issue("news", "2026-11-24", [{**report(), "sourceUrl":"https://huamei.io/blogs/old-guide", "kind":"reference"}])
        out=news.generate(self.root,NOW,lambda *a:[],self.verify)
        self.assertTrue(out["items"][0]["sourceUrl"].endswith("/unused-guide"))

    def test_unreachable_sources_fail_without_creating_issue(self):
        self.write_blog()
        def fail(*a): raise OSError("source offline")
        with self.assertRaises(ValueError):
            news.publish(self.root,NOW,feed_reader=self.feeds,verify=fail)
        self.assertFalse((self.root/"content/news/2026-11-25.json").exists())

    def test_links_filtered_before_redirect(self):
        with self.assertRaises(ValueError): news.checked_url("https://attacker.com/a",{"paperbox.org"})
        with self.assertRaises(ValueError): news.SafeRedirects({"paperbox.org"}).redirect_request(news.urllib.request.Request("https://paperbox.org/a"),None,302,"",{},"http://bad/")
        self.assertEqual("https://paperbox.org/x/",news.checked_url("https://paperbox.org/x/?utm_source=rss#fragment",{"paperbox.org"}))

    def test_feed_requires_recent_dated_relevant_stories(self):
        entries=[("Folding carton shipment forecast","Tue, 24 Nov 2026 20:00:00 +0000"),("Foil awards ceremony","Tue, 24 Nov 2026 20:00:00 +0000"),("Recycling report","Thu, 26 Nov 2026 00:00:00 +0000"),("Undated Rigid box",""),("Press appointments","Tue, 24 Nov 2026 20:00:00 +0000"),("Industry leaders express regret over barriers to investment","Tue, 24 Nov 2026 20:00:00 +0000")]
        url=news.FEEDS["Pro Carton"]
        rss="<rss><channel>"+''.join(f"<item><title>{t}</title><link>{url}article/</link><pubDate>{d}</pubDate></item>" for t,d in entries)+"</channel></rss>"
        with patch.object(news,"download",return_value=(url,"application/rss+xml",rss.encode())):
            res=news.fetch_feed(("Pro Carton",url),NOW)
        self.assertEqual(['Pro Carton: “Folding carton shipment forecast”'],[i["title"] for i in res])

cloud_file = Path(__file__).resolve().parents[1] / "api/packaging-news.py"
cloud_spec = importlib.util.spec_from_file_location("packaging_news_cron", cloud_file)
cloud = importlib.util.module_from_spec(cloud_spec)
cloud_spec.loader.exec_module(cloud)


class CloudPublisherTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.store = Mock()
        self.store.exists.return_value = False
        self.store.create_once.return_value = "create"
        self.store.history.return_value = []

    def seed(self, item=None, day="2026-11-25"):
        path = self.root / "content/news" / (day + ".json")
        path.parent.mkdir(parents=True, exist_ok=True)
        issue = {"date": day, "publishedAt": NOW.isoformat(), "title": "A packaging report", "summary": "Two materials compared.", "items": [item or report()]}
        path.write_text(json.dumps(issue))
        return issue

    def test_secret_required_and_constant_time_comparison(self):
        self.assertFalse(cloud.authorized(None, None))
        self.assertFalse(cloud.authorized("Bearer missing", ""))
        self.assertFalse(cloud.authorized("Bearer wrong", "right"))
        self.assertFalse(cloud.authorized("right", "right"))
        self.assertTrue(cloud.authorized("Bearer correct", "correct"))

    def test_duplicate_does_no_network_or_write(self):
        self.store.exists.return_value = True
        result = cloud.publish_edition(self.store, NOW, self.root, editorial_generator=lambda *a, **k: self.fail())
        self.assertEqual("already-published", result["status"])
        self.store.history.assert_not_called()
        self.store.create_once.assert_not_called()
        self.store.exists.assert_called_once_with("packagingNews-2026-11-25")

    def test_vetted_seed_is_mirrored_exactly_and_once(self):
        seed = self.seed(report(url="https://www.tetrapak.com/news/archive/paper-package"))
        result = cloud.publish_edition(self.store, NOW, self.root, editorial_generator=lambda *a, **k: self.fail())
        self.assertEqual("published", result["status"])
        self.store.history.assert_not_called()
        doc = self.store.create_once.call_args.args[0]
        self.assertEqual("packagingNews-2026-11-25", doc.pop("_id"))
        self.assertEqual("packagingNewsEdition", doc.pop("_type"))
        self.assertEqual("packagingNewsStory", doc["items"][0].pop("_type"))
        self.assertEqual(20, len(doc["items"][0].pop("_key")))
        self.assertEqual(seed, doc)

    def test_malicious_or_future_seed_rejected_without_write(self):
        for item in (report(url="https://unauthorized.example/a"), {**report(), "sourceDate": "2026-11-26"}):
            self.seed(item)
            with self.assertRaises(ValueError):
                cloud.publish_edition(self.store,NOW,self.root)
        self.store.create_once.assert_not_called()

    def test_race_keeps_preexisting_record_and_uses_remote_history(self):
        history = [(date(2026,11,22), report())]
        self.store.history.return_value = history
        self.store.create_once.return_value = "none"
        def issue(root, now, verify, remote_history):
            self.assertEqual(history, remote_history)
            return {"date": "2026-11-25", "title": "Inside the carton", "summary": "A new brief.", "items": [report()]}
        result = cloud.publish_edition(self.store,NOW,self.root,issue)
        self.assertEqual("already-published", result["status"])
        self.store.create_once.assert_called_once()

    def test_cannot_write_yesterday_after_local_midnight(self):
        self.seed()
        with self.assertRaises(cloud.PublicationDeadline):
            cloud.publish_edition(self.store,NOW,self.root,clock=lambda:NOW+news.timedelta(days=1))
        self.store.create_once.assert_not_called()

    def test_missing_service_credentials_fail_closed(self):
        with self.assertRaises(ValueError): cloud.Store({})
        with self.assertRaises(ValueError):
            cloud.Store({"NEXT_PUBLIC_SANITY_PROJECT_ID":"bad.host/secret","NEXT_PUBLIC_SANITY_DATASET":"production","SANITY_WRITE_TOKEN":"test-only"})

    def test_service_mutation_is_create_if_absent(self):
        store = cloud.Store({"NEXT_PUBLIC_SANITY_PROJECT_ID":"example","NEXT_PUBLIC_SANITY_DATASET":"production","SANITY_WRITE_TOKEN":"test-only"})
        doc = {"_id":"packagingNews-2026-11-25","_type":"packagingNewsEdition"}
        with patch.object(store, "request", return_value={"results":[{"operation":"create"}]}) as request:
            self.assertEqual("create",store.create_once(doc))
        url,body=request.call_args.args
        self.assertIn("/data/mutate/production?",url)
        self.assertEqual({"mutations":[{"createIfNotExists":doc}]},body)


if __name__ == "__main__":
    unittest.main()
