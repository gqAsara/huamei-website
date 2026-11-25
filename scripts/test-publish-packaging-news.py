import importlib.util
import io
import json
import tempfile
import unittest
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import Mock, patch


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


ROOT = Path(__file__).resolve().parents[1]
desk = load("packaging_questions", ROOT / "scripts/publish-packaging-news.py")
cloud = load("packaging_cron", ROOT / "api/packaging-news.py")
NOW = datetime(2026, 11, 26, 3, 0, tzinfo=timezone.utc)
DAY = date(2026, 11, 26)


def photo(name="folded-box"):
    return {"url": "/news-media/" + name + ".jpg", "alt": "An open shipping box.",
            "credit": "Original photographer", "sourceUrl": "https://example.org/photos/" + name,
            "license": "Pexels License", "licenseUrl": "https://www.pexels.com/license/"}


def question(title="Can I reuse a shipping box?"):
    return {"title": title, "summary": "Choose a clean box whose corners are firm and whose flaps close flat.",
            "buyerNote": "Remove old labels before taping the new shipping label in place.",
            "sourceName": "Packing guide", "sourceDate": "2026-06-20",
            "sourceUrl": "https://example.org/packing/shipping-boxes", "kind": "question"}


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data))


class QuestionsTest(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.root = Path(tmp.name)
        self.bank = self.root / "content/packaging-questions.json"
        self.stored = question()
        save(self.bank, [self.stored])
        save(self.root / "content/news-photo-library.json", [
            {"topics": ["packaging", "shipping box"], "image": photo()},
            {"topics": ["shipping box"], "image": photo("flat-box")}])
        self.store = Mock()
        self.store.exists.return_value = False
        self.store.history.return_value = []
        self.store.create_once.return_value = "create"

    def issue(self, q, folder="news-drafts"):
        edition = {"date": str(DAY), "publishedAt": NOW.isoformat(), "title": q["title"],
                   "summary": q["summary"], "items": [q]}
        save(self.root / f"content/{folder}/{DAY}.json", edition)
        return edition

    def blog(self, heading="How can I keep a gift box from opening in transit?"):
        f = self.root / "content/blogs/gift-closures.md"
        f.parent.mkdir(exist_ok=True)
        f.write_text('---\npublishedAt: "2026-06-01T12:00:00Z"\n---\n## ' + heading +
                     '\n\nTie a ribbon around the box and place it in a separate shipping carton to protect the lid.\n\n'
                     'Check the fitted lid with the product inside before tying the ribbon.\n')

    def test_daily_edition_has_one_distinct_answer_and_a_licensed_photo(self):
        out = desk.generate(self.root, NOW)
        self.assertEqual(out["title"], self.stored["title"])
        self.assertEqual(1, len(out["items"]))
        self.assertIn(out["items"][0]["image"]["url"], [photo()["url"], photo("flat-box")["url"]])
        self.assertEqual(out["items"][0]["kind"], "question")

    def test_draft_keeps_specific_photo_and_private_evidence(self):
        selected = {**question("Can I mail a gift box without an outer carton?"), "image": photo("gift")}
        self.issue(selected)
        self.assertEqual(selected, desk.generate(self.root, NOW)["items"][0])

    def test_draft_with_news_translation_or_several_questions_falls_back(self):
        for wrong in ({**question(), "kind":"news"}, {**question(), "title":"Paper shipping statistics"},
                      {**question(), "summary":"纸箱该如何打包"}, {**question(), "sourceDate":"2026-12-01"},
                      {**question(), "sourceUrl":"javascript:alert(1)"}):
            self.issue(wrong)
            self.assertEqual(self.stored["sourceUrl"], desk.generate(self.root, NOW)["items"][0]["sourceUrl"])
        ed = self.issue(question("Can this box be reused?")); ed["items"].append(question())
        save(self.root / f"content/news-drafts/{DAY}.json", ed)
        self.assertEqual(self.stored["title"], desk.generate(self.root, NOW)["title"])

    def test_reuse_same_reference_for_distinct_questions_and_skip_duplicate_title(self):
        next_item = question("How do I close a box without crushing it?")
        save(self.bank,[self.stored, next_item])
        history = [(DAY-timedelta(days=1),question("Can I REUSE a shipping box?!"))]
        self.issue(self.stored)
        self.assertEqual(next_item["title"], desk.generate(self.root,NOW,remote_history=history)["title"])

    def test_reference_archive_supplies_unused_question_after_bank_exhausted(self):
        self.blog()
        history = [(DAY-timedelta(days=1),self.stored)]
        out=desk.generate(self.root,NOW,remote_history=history)["items"][0]
        self.assertIn("gift box",out["title"])
        self.assertEqual("https://huamei.io/blogs/gift-closures",out["sourceUrl"])
        self.assertTrue(out["buyerNote"].startswith("Check the fitted lid"))
        for wrong in ("What are rigid box MOQ and lead times?", "What are the gift box trends for 2026?",
                      "How do manufacturers audit packaging in China?"):
            self.blog(wrong)
            self.assertEqual([], list(desk.archive_questions(self.root, DAY)))

    def test_exhaustion_never_reposts_and_new_answer_needs_evidence(self):
        q = question("Can a cardboard box be recycled?")
        save(self.bank, [self.stored, q])
        history = [(DAY-timedelta(days=1),self.stored), (DAY-timedelta(days=200),q)]
        with patch.dict(desk.os.environ, {"OPENROUTER_API_KEY": ""}):
            with self.assertRaises(ValueError):
                desk.generate(self.root,NOW,remote_history=history)
        def reply(*args, **kwargs):
            sample = {**question("What should I check on the flaps of a used box?"), "index":0, "evidence":q["summary"]}
            return io.BytesIO(json.dumps({"choices":[{"message":{"content":json.dumps({"candidates":[sample]})}}]}).encode())
        with patch.dict(desk.os.environ, {"OPENROUTER_API_KEY": "fixture"}), patch.object(desk.urllib.request,"urlopen",side_effect=reply):
            out = desk.generate(self.root,NOW,remote_history=history)
        self.assertEqual("What should I check on the flaps of a used box?",out["title"])

    def test_photos_rotate_and_check_rights(self):
        history=[(DAY-timedelta(days=1), {**question("Where should I put the return label?"), "image":photo()})]
        self.assertEqual(photo("flat-box"), desk.generate(self.root,NOW,remote_history=history)["items"][0]["image"])
        for bad in ({**photo(),"license":"CC BY 4.0"}, {**photo(),"url":"/news-media/../escape.jpg"},
                    {**photo(),"url":"https://outside.example/image.jpg"}, {**photo(),"licenseUrl":"javascript:x"}):
            with self.assertRaises(ValueError):desk.checked_photo(bad)

    def test_wednesday_uses_dated_research_without_local_editor(self):
        wednesday = NOW - timedelta(days=1)
        study = {"title": "How much space is left around a parcel?", "method": "Subtract product volume from box volume.",
                 "columns":["Internal side (cm)", "Volume (L)"], "rows":[["10","1"],["20","8"]],
                 "findings":["Doubling all sides multiplies volume by eight."], "limitations":"Dimensions are nominal and ignore the thickness of the board."}
        report = {"question":"What does doubling a box size do to its volume?", "specificQuestion":"How does a 20 cm box compare with a 10 cm box?", "intro":"A two-box comparison.",
                  "answer":"Doubling every dimension makes the internal volume eight times larger.",
                  "check":"Measure internal dimensions before doing the calculation.", "study":study}
        build=Mock(return_value=report)
        out=desk.generate(self.root,wednesday,researcher=build)
        build.assert_called_once_with(wednesday.date())
        self.assertEqual({"cells":["10","1"]}, out["study"]["rows"][0])
        self.assertEqual(report["intro"],out["summary"])
        self.assertEqual("question",out["items"][0]["kind"])
        other = desk.generate(self.root,wednesday,researcher=build,remote_history=[(wednesday.date()-timedelta(days=7),out["items"][0])])
        self.assertEqual(report["specificQuestion"],other["title"])
        draft={**out,"study":{**study,"rows":[["bad"],["20","8"]]}}
        save(self.root/f"content/news-drafts/{wednesday.date()}.json",draft)
        self.assertEqual(out, desk.generate(self.root,wednesday,researcher=build))
        save(self.root/f"content/news-drafts/{wednesday.date()}.json",out)
        self.assertEqual(out,desk.generate(self.root,wednesday,researcher=lambda *a:self.fail()))
        save(self.root/f"content/news/{wednesday.date()}.json",out)
        cloud.publish_edition(self.store, wednesday, self.root)
        san=self.store.create_once.call_args.args[0]["study"]
        self.assertEqual("object",san["_type"])
        self.assertEqual({"_key":"row-1","_type":"packagingResearchRow","cells":["10","1"]},san["rows"][0])

    def test_todays_local_edition_is_immutable(self):
        target = desk.publish(self.root, NOW)
        original = target.read_bytes()
        save(self.bank, [])
        desk.publish(self.root, NOW)
        self.assertEqual(original, target.read_bytes())

    def test_exact_11_am_gate(self):
        early = NOW-timedelta(seconds=1)
        self.assertEqual("scheduled", cloud.publish_edition(self.store, early, self.root)["status"])
        self.store.history.assert_not_called()
        self.store.create_once.assert_not_called()
        self.assertEqual("published",cloud.publish_edition(self.store,NOW,self.root)["status"])

    def test_reviewed_seed_date_and_nested_types_preserved(self):
        seed = self.issue({**question(), "image":photo("sample")}, "news")
        self.assertEqual("published",cloud.publish_edition(self.store, NOW, self.root)["status"])
        doc = self.store.create_once.call_args.args[0]
        self.assertEqual(seed["publishedAt"], doc["publishedAt"])
        self.assertEqual("packagingNews-2026-11-26",doc["_id"])
        self.assertEqual("packagingNewsStory",doc["items"][0]["_type"])
        self.assertEqual("object",doc["items"][0]["image"]["_type"])
        self.assertEqual(photo("sample")["url"],doc["items"][0]["image"]["url"])

    def test_legacy_news_seed_never_becomes_new_article(self):
        self.issue({**question(), "kind":"news", "title":"Industry shipping figures"}, "news")
        cloud.publish_edition(self.store, NOW, self.root)
        self.assertEqual(self.stored["title"], self.store.create_once.call_args.args[0]["title"])

    def test_duplicate_and_midnight_are_safe(self):
        self.store.exists.return_value = True
        self.assertEqual("already-published",cloud.publish_edition(self.store, NOW,self.root)["status"])
        self.store.create_once.assert_not_called()
        self.store.exists.return_value = False
        with self.assertRaises(ValueError):cloud.publish_edition(self.store,NOW,self.root,clock=lambda:NOW+timedelta(days=1))
        self.store.create_once.assert_not_called()

    def test_auth_fail_closed_and_idempotent_atomic_write(self):
        self.assertFalse(cloud.authorized(None, None))
        self.assertFalse(cloud.authorized("Bearer wrong", "right"))
        self.assertTrue(cloud.authorized("Bearer correct", "correct"))
        with self.assertRaises(ValueError):cloud.Store({})
        store=cloud.Store({"NEXT_PUBLIC_SANITY_PROJECT_ID":"valid","NEXT_PUBLIC_SANITY_DATASET":"production","SANITY_WRITE_TOKEN":"test"})
        with patch.object(store, "request", return_value={"results":[{"operation":"create"}]}) as request:
            doc={"_id":"packagingNews-2026-11-25"}
            store.create_once(doc)
            self.assertEqual({"mutations":[{"createIfNotExists":doc}]}, request.call_args.args[1])


if __name__ == "__main__":
    unittest.main()
