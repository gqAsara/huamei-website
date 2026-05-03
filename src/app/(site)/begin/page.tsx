import Link from "next/link";
import "./begin.css";

export const metadata = {
  title: "Begin a project · Huamei",
  description:
    "A short, considered intake form. Our team will reply asap. 300 piece minimum, 2–4 weeks lead time on demand.",
};

export default function BeginPage() {
  return (
    <main className="bg-wrap">
      {/* Masthead */}
      <section className="bg-mast">
        <div>
          <div className="rn">i. &middot; Project intake</div>
          <h1>
            Begin a <em>project.</em>
          </h1>
          <div className="cn">開 始 一 件</div>
        </div>
      </section>

      <div className="bg-body">
        {/* ============ FORM ============ */}
        <form
          className="bg-form"
          method="post"
          action="/api/commission"
          autoComplete="off"
          encType="multipart/form-data"
        >
          {/* Progress rail */}
          <div className="bg-steps">
            <div className="step on"><span className="n">i.</span><span className="t">You</span></div>
            <div className="step on"><span className="n">ii.</span><span className="t">Project</span></div>
            <div className="step on"><span className="n">iii.</span><span className="t">Specification</span></div>
            <div className="step on"><span className="n">iv.</span><span className="t">Attachments</span></div>
            <div className="step on"><span className="n">v.</span><span className="t">Submit</span></div>
          </div>

          {/* I. Who */}
          <fieldset
            className="bg-group"
            style={{ border: 0, paddingTop: 0, paddingBottom: 36, borderBottom: ".5px solid var(--rule-soft)" }}
          >
            <div className="head">
              <div className="rn">i.</div>
              <h3>Who is <em>writing.</em></h3>
              <p>How to address the reply, and where to send it.</p>
            </div>
            <div>
              <div className="bg-row">
                <div className="bg-field">
                  <label htmlFor="f-name">Your name</label>
                  <input id="f-name" name="name" type="text" placeholder="Ex. Mei Zhang" required />
                </div>
                <div className="bg-field">
                  <label htmlFor="f-role">Role <span className="opt">· optional</span></label>
                  <input id="f-role" name="role" type="text" placeholder="Ex. Founder · Creative director" />
                </div>
              </div>
              <div className="bg-row">
                <div className="bg-field">
                  <label htmlFor="f-email">Email</label>
                  <input id="f-email" name="email" type="email" placeholder="mei@house.com" required />
                </div>
                <div className="bg-field">
                  <label htmlFor="f-brand">Brand <span className="opt">· optional</span></label>
                  <input id="f-brand" name="brand" type="text" placeholder="Ex. Souverain" />
                </div>
              </div>
              <div className="bg-field">
                <label htmlFor="f-site">Website <span className="opt">· optional — helps us read your voice</span></label>
                <input id="f-site" name="website" type="url" placeholder="https://" />
              </div>
            </div>
          </fieldset>

          {/* II. Industry */}
          <fieldset className="bg-group">
            <div className="head">
              <div className="rn">ii.</div>
              <h3>What <em>kind</em> of work.</h3>
              <p>Pick the closest. A project rarely fits only one, but this tells us who on the floor to send your brief to first.</p>
            </div>
            <div className="bg-cards" role="radiogroup">
              <label className="bg-card">
                <input type="radio" name="industry" value="cosmetic" defaultChecked />
                <span className="f"><span className="rn">i.</span><span className="t"><em>Cosmetic</em></span><span className="d">Skincare · make-up</span></span>
              </label>
              <label className="bg-card">
                <input type="radio" name="industry" value="spirits" />
                <span className="f"><span className="rn">ii.</span><span className="t"><em>Spirits</em></span><span className="d">Baijiu · wine · tea</span></span>
              </label>
              <label className="bg-card">
                <input type="radio" name="industry" value="seasonal" />
                <span className="f"><span className="rn">iii.</span><span className="t"><em>Seasonal</em></span><span className="d">CNY · Mid-Autumn · gifting</span></span>
              </label>
              <label className="bg-card">
                <input type="radio" name="industry" value="wellness" />
                <span className="f"><span className="rn">iv.</span><span className="t"><em>Wellness</em></span><span className="d">Botanicals · soap · supplement</span></span>
              </label>
              <label className="bg-card">
                <input type="radio" name="industry" value="other" />
                <span className="f"><span className="rn">v.</span><span className="t"><em>Other</em></span><span className="d">Tell us below</span></span>
              </label>
            </div>
          </fieldset>

          {/* III. Brief */}
          <fieldset className="bg-group">
            <div className="head">
              <div className="rn">iii.</div>
              <h3>The <em>brief.</em></h3>
              <p>A paragraph is enough. Tell us what it is, who it is for, and when it needs to ship.</p>
            </div>
            <div>
              <div className="bg-field">
                <label htmlFor="f-brief">In plain words</label>
                <textarea
                  id="f-brief"
                  name="brief"
                  placeholder="Ex. A rigid coffret for the launch of a new EDP, cream Gmund stock, champagne foil. Velvet insert for a 100ml flacon. Launch September."
                  required
                />
                <div className="hint">No decks required. Plain words are read most carefully.</div>
              </div>

              <div className="bg-row">
                <div className="bg-field">
                  <label>Quantity</label>
                  <div className="bg-chips">
                    <label className="bg-chip"><input type="radio" name="qty" value="300-1k" defaultChecked /><span className="f"><span className="rn">i.</span>300 – 1k</span></label>
                    <label className="bg-chip"><input type="radio" name="qty" value="1k-5k" /><span className="f"><span className="rn">ii.</span>1k – 5k</span></label>
                    <label className="bg-chip"><input type="radio" name="qty" value="5k-25k" /><span className="f"><span className="rn">iii.</span>5k – 25k</span></label>
                    <label className="bg-chip"><input type="radio" name="qty" value="25k-100k" /><span className="f"><span className="rn">iv.</span>25k – 100k</span></label>
                    <label className="bg-chip"><input type="radio" name="qty" value="100k-500k" /><span className="f"><span className="rn">v.</span>100k – 500k</span></label>
                    <label className="bg-chip"><input type="radio" name="qty" value="500k+" /><span className="f"><span className="rn">vi.</span>500k +</span></label>
                  </div>
                </div>
                <div className="bg-field">
                  <label>Need by</label>
                  <div className="bg-chips">
                    <label className="bg-chip"><input type="radio" name="ship" value="lt4" /><span className="f"><span className="rn">i.</span>Under 4 wks</span></label>
                    <label className="bg-chip"><input type="radio" name="ship" value="4-8" defaultChecked /><span className="f"><span className="rn">ii.</span>4 – 8 wks</span></label>
                    <label className="bg-chip"><input type="radio" name="ship" value="8+" /><span className="f"><span className="rn">iii.</span>8 wks +</span></label>
                    <label className="bg-chip"><input type="radio" name="ship" value="exploratory" /><span className="f"><span className="rn">iv.</span>Exploratory</span></label>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          {/* IV. Specification */}
          <fieldset className="bg-group">
            <div className="head">
              <div className="rn">iv.</div>
              <h3>A first <em>spec.</em></h3>
              <p>Rough is fine. We will firm these up on a call — nothing here is binding.</p>
            </div>
            <div>
              <div className="bg-field">
                <label>Structure <span className="opt">· optional</span></label>
                <div className="bg-chips">
                  <label className="bg-chip"><input type="checkbox" name="structure" value="rigid" /><span className="f">Rigid</span></label>
                  <label className="bg-chip"><input type="checkbox" name="structure" value="folding" /><span className="f">Folding</span></label>
                  <label className="bg-chip"><input type="checkbox" name="structure" value="drawer" /><span className="f">Drawer</span></label>
                  <label className="bg-chip"><input type="checkbox" name="structure" value="slipcase" /><span className="f">Slipcase</span></label>
                  <label className="bg-chip"><input type="checkbox" name="structure" value="book" /><span className="f">Book-style</span></label>
                  <label className="bg-chip"><input type="checkbox" name="structure" value="magnetic" /><span className="f">Magnetic</span></label>
                  <label className="bg-chip"><input type="checkbox" name="structure" value="cloth" /><span className="f">Cloth-bound</span></label>
                  <label className="bg-chip"><input type="checkbox" name="structure" value="not-sure" /><span className="f">Not sure</span></label>
                </div>
              </div>
              <div className="bg-field">
                <label>Finishing you are considering <span className="opt">· optional</span></label>
                <div className="bg-chips">
                  <label className="bg-chip"><input type="checkbox" name="finishing" value="hot-foil" /><span className="f">Hot-foil</span></label>
                  <label className="bg-chip"><input type="checkbox" name="finishing" value="emboss" /><span className="f">Emboss / deboss</span></label>
                  <label className="bg-chip"><input type="checkbox" name="finishing" value="soft-touch" /><span className="f">Soft-touch</span></label>
                  <label className="bg-chip"><input type="checkbox" name="finishing" value="uv" /><span className="f">Spot UV</span></label>
                  <label className="bg-chip"><input type="checkbox" name="finishing" value="screen" /><span className="f">Screen print</span></label>
                  <label className="bg-chip"><input type="checkbox" name="finishing" value="ribbon" /><span className="f">Ribbon / tassel</span></label>
                  <label className="bg-chip"><input type="checkbox" name="finishing" value="velvet" /><span className="f">Velvet insert</span></label>
                  <label className="bg-chip"><input type="checkbox" name="finishing" value="not-sure" /><span className="f">Not sure</span></label>
                </div>
              </div>
            </div>
          </fieldset>

          {/* V. Attachments */}
          <fieldset className="bg-group" style={{ borderBottom: 0 }}>
            <div className="head">
              <div className="rn">v.</div>
              <h3>Attach <em>anything.</em></h3>
              <p>Design files, dielines, similar boxes for reference, ideas. Five files, 50 MB total.</p>
            </div>
            <div>
              <label className="bg-drop">
                <div className="l">
                  <div className="t">Drop files here, or browse.</div>
                  <div className="d">PDF · AI · INDD · PNG · JPG · 50 MB total</div>
                </div>
                <div className="r">Browse</div>
                <input type="file" name="attachments" multiple hidden />
              </label>

              <div className="bg-field" style={{ marginTop: 22 }}>
                <label htmlFor="f-notes">Caveats or context <span className="opt">· optional</span></label>
                <textarea
                  id="f-notes"
                  name="notes"
                  rows={4}
                  placeholder="Ex. We are presenting to retail buyers in June; we prefer not to send print-ready artwork until after contract."
                />
              </div>
            </div>
          </fieldset>

          {/* Submit */}
          <div className="bg-submit">
            <label className="agree">
              <input type="checkbox" name="agree" defaultChecked />
              <span>
                Huamei may hold my enquiry on file for twelve months. We will not share
                details with third parties.{" "}
                <Link href="/privacy" style={{ borderBottom: ".5px solid var(--rule)" }}>
                  Privacy
                </Link>
                .
              </span>
            </label>
            <div className="actions">
              <a className="save" href="#">Save &amp; finish later</a>
              <button className="hm-plate" type="submit">
                <span className="roman">→</span> Send project
              </button>
            </div>
          </div>
        </form>

        {/* ============ ASIDE ============ */}
        <aside className="bg-aside">
          <div className="card">
            <h5>What to expect <span className="rn">i.</span></h5>
            <div className="t">
              Our team will <em>reply</em> asap.
            </div>
            <p>
              Every brief is read carefully. We respond with an initial thought
              and, usually, one or two sample requests.
            </p>
          </div>

          <div className="card">
            <h5>House minimums <span className="rn">ii.</span></h5>
            <dl>
              <div className="r"><dt>Run</dt><dd><em>300</em> pieces</dd></div>
              <div className="r"><dt>Lead time</dt><dd><em>2 — 4</em> wks on demand</dd></div>
              <div className="r"><dt>Samples</dt><dd>Free on large quantities</dd></div>
              <div className="r"><dt>Studio fee</dt><dd>None</dd></div>
            </dl>
          </div>

          <div className="card">
            <h5>Or write <em>directly</em> <span className="rn">iii.</span></h5>
            <div className="direct">
              <a href="mailto:info@huamei.io">info@huamei.io</a>
              <span className="sub">All projects &middot; reads every email</span>
            </div>
            <div className="direct" style={{ marginTop: 6 }}>
              <a href="tel:+13108966923">+1 310 896 6923</a>
              <span className="sub">24 / 7</span>
            </div>
          </div>
        </aside>
      </div>

      {/* What happens next */}
      <section className="bg-next">
        <h3>
          What happens <em>next.</em>
        </h3>
        <div className="steps">
          <div className="s">
            <span className="n">i.</span>
            <span className="d">Day 1 — 2</span>
            <span className="h"><em>Read</em> &amp; reply</span>
            <p>Our team reads the brief and replies asap with an initial thought and any clarifying questions.</p>
          </div>
          <div className="s">
            <span className="n">ii.</span>
            <span className="d">Week 1</span>
            <span className="h">A <em>call</em></span>
            <p>Thirty minutes with the design lead. We agree structure, foil, and a rough price band.</p>
          </div>
          <div className="s">
            <span className="n">iii.</span>
            <span className="d">Week 2 — 3</span>
            <span className="h"><em>Samples</em> posted</span>
            <p>Dielines, foil swatches, and a mock-up sent by courier. First round is free of charge.</p>
          </div>
          <div className="s">
            <span className="n">iv.</span>
            <span className="d">Week 4 +</span>
            <span className="h"><em>Floor</em> begins</span>
            <p>On contract, your job is scheduled on the press floor. You receive a weekly note from production.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
