import Link from "next/link";
import "./imprint.css";

export const metadata = {
  title: "Imprint · Huamei",
  description: "Publisher, registration, contact, and editorial responsibility for huamei.io.",
};

export default function ImprintPage() {
  return (
    <main className="lg-wrap">
      <section className="lg-mast">
        <div>
          <div className="crumbs">
            <Link href="/">Huamei</Link>
            <span className="sep">&middot;</span>
            <Link href="/imprint">Colophon</Link>
            <span className="sep">&middot;</span>
            Imprint
          </div>
          <div className="rn">iii.</div>
          <h1>
            <em>Imprint</em> &amp; notice.
          </h1>
        </div>
        <div className="meta">
          <span>Vol. I</span>
          <span className="dot">&middot;</span>
          <span>Rev. 2026 iv &middot; 24</span>
          <span className="dot">&middot;</span>
          <span>PRC &amp; EU</span>
        </div>
      </section>

      <section className="lg-layout">
        <aside className="lg-toc">
          <div className="kicker">On this page</div>
          <ol>
            <li><a href="#pub">Publisher</a></li>
            <li><a href="#reg">Registration</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#editorial">Editorial responsibility</a></li>
            <li><a href="#liability">Liability</a></li>
            <li><a href="#copyright">Copyright &amp; imagery</a></li>
            <li><a href="#resolution">Dispute resolution</a></li>
            <li><a href="#colophon">Colophon</a></li>
          </ol>
        </aside>

        <article className="lg-prose">
          <h2 id="pub">
            <span>The <em>publisher.</em></span>
            <span className="n">i.</span>
          </h2>
          <p>
            Huamei Packaging &amp; Print Co., Ltd. (&ldquo;Huamei&rdquo;, &ldquo;we&rdquo;)
            publishes this website at huamei.io. The house has operated continuously
            across four provinces of the People&rsquo;s Republic of China — Henan,
            Zhejiang, Sichuan and Guizhou — since 1992.
          </p>
          <address>
            <span className="lbl">Registered office</span>
            Huamei Packaging &amp; Print Co., Ltd.
            <br />
            No. 1188, Jianshe Road
            <br />
            Zhongyuan District, Zhengzhou, Henan 450000
            <br />
            People&rsquo;s Republic of China
          </address>

          <h2 id="reg">
            <span>Registration.</span>
            <span className="n">ii.</span>
          </h2>
          <dl className="definition"><dt>Company no.</dt><dd>913100001137XXXXXX</dd></dl>
          <dl className="definition"><dt>VAT / tax</dt><dd>3100001137XXXXXX</dd></dl>
          <dl className="definition"><dt>ICP filing</dt><dd>豫ICP备 XXXXXXXX 号</dd></dl>
          <dl className="definition"><dt>Legal rep.</dt><dd>Sun, Sonia — Founder &amp; Director</dd></dl>
          <dl className="definition"><dt>Incorporated</dt><dd>Zhengzhou, Henan, 12 iii. 1992</dd></dl>

          <h2 id="contact">
            <span>Written <em>to us.</em></span>
            <span className="n">iii.</span>
          </h2>
          <p>
            For projects, visit enquiries, or trade — please use the{" "}
            <Link href="/begin">project form</Link>. For legal correspondence, write
            to the office:
          </p>
          <address>
            <span className="lbl">General</span>
            info@huamei.io
            <br />
            +1 310 896 6923
          </address>
          <address>
            <span className="lbl">Legal &amp; privacy</span>
            info@huamei.io
            <br />
            Attn: Data Protection Officer
          </address>

          <h2 id="editorial">
            <span>Editorial <em>responsibility.</em></span>
            <span className="n">iv.</span>
          </h2>
          <p>
            Content on this site is prepared by the Huamei factory under the editorial
            direction of the founder. Responsibility for the content as defined under
            §55 Abs. 2 RStV, and equivalent jurisdictions, lies with:
          </p>
          <address>
            Sun, Sonia
            <br />
            c/o Huamei Packaging &amp; Print Co., Ltd.
            <br />
            No. 1188, Jianshe Road, Zhongyuan District, Zhengzhou, Henan
          </address>

          <h2 id="liability">
            <span>Liability.</span>
            <span className="n">v.</span>
          </h2>
          <h3>For content</h3>
          <p>
            Pages on huamei.io are authored with care. We do not, however, guarantee
            the accuracy, completeness, or currency of information beyond the date of
            publication. Commercial terms are binding only once a written project
            agreement has been issued and countersigned by both parties.
          </p>
          <h3>For links</h3>
          <p>
            Our site may reference external pages — press coverage, supplier credits,
            or archive entries. The content of such pages lies solely with their
            respective authors. We check linked pages at the time of linking; we do not
            police them thereafter, but we remove any that come to our attention as
            unlawful.
          </p>

          <h2 id="copyright">
            <span>Copyright &amp; <em>imagery.</em></span>
            <span className="n">vi.</span>
          </h2>
          <p>
            Photography, wordmarks, case studies, and typographic compositions on this
            site are copyright Huamei Packaging &amp; Print Co., Ltd. or their respective
            rights-holders. Individual projects remain the property of the client
            brand and are reproduced here with written consent.
          </p>
          <div className="callout">
            &ldquo;The house owns the press; the client owns the mark. Both are named on
            the colophon.&rdquo;
          </div>
          <p>
            Specimen photography in the catalogue and on the site is produced in-house
            by the Huamei studio unless a credit appears beneath the plate. Use of any
            image for purposes beyond editorial citation requires written permission
            from info@huamei.io.
          </p>

          <h2 id="resolution">
            <span>Dispute <em>resolution.</em></span>
            <span className="n">vii.</span>
          </h2>
          <p>
            Huamei is not obliged, and does not intend, to participate in
            dispute-resolution proceedings before a consumer arbitration board. In
            matters requiring adjudication, the courts of Zhengzhou, Henan hold jurisdiction
            unless the client&rsquo;s trade agreement names another forum.
          </p>
          <p>
            For European clients: in accordance with EU Regulation 524/2013, a platform
            for online dispute resolution is available at{" "}
            <em>ec.europa.eu/consumers/odr</em>.
          </p>

          <h2 id="colophon">
            <span>A brief <em>colophon.</em></span>
            <span className="n">viii.</span>
          </h2>
          <p>
            This site is typeset in Cormorant Garamond (display), Lora (body), and
            Inter (labels), with Noto Serif SC for Chinese. The catalogue itself is set
            in a licensed cut of Caslon and Meridien; the substitution on the web is
            deliberate.
          </p>
          <p>
            The palette is drawn from the papers, inks, and foils of the Henan
            press floor. Design and engineering by the Huamei factory. Hand-set
            initials — like the drop-caps on this page — are a nod to the first
            catalogue, <em>Vol. I</em>, bound 2026.
          </p>

          <div className="lg-sign">
            <span>© 1992–2026 Huamei &middot; All rights reserved</span>
            <span className="italic">Rev. iv &middot; 24 April 2026</span>
          </div>
        </article>
      </section>
    </main>
  );
}
