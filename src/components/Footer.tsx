import Link from "next/link";

export function Footer() {
  return (
    <footer className="hm-footer">
      <div className="hm-footer-inner">
        <div className="hm-footer-top">
          <div className="brand">
            <div className="lat">Huamei</div>
            <img
              src="/huamei-mark-512.png"
              alt="華美"
              width={72}
              height={72}
              className="brand-seal"
            />
            <div className="rule" />
            <p className="voice">
              A box is not a container. It is the first sentence a brand speaks to a
              buyer who has never heard its voice.
            </p>
            <div className="signature">
              <span>Est. 1992</span>
              <span className="dot">&middot;</span>
              <span>Four Provinces</span>
              <span className="dot">&middot;</span>
              <span>Sonia Sun, Founder</span>
            </div>
          </div>

          <div className="hm-footer-cols">
            <div>
              <h5><span className="roman">i.</span>Craft</h5>
              <ul>
                <li><Link href="/craft/rigid">Rigid &amp; telescoping</Link></li>
                <li><Link href="/craft/magnetic">Magnetic closure</Link></li>
                <li><Link href="/craft/drawer">Drawer &amp; slipcase</Link></li>
                <li><Link href="/craft/folding">Folding cartons</Link></li>
                <li><Link href="/craft/inserts">Inserts &amp; cradles</Link></li>
                <li><Link href="/craft/shoppers">Shoppers</Link></li>
                <li><Link href="/industry/seasonal">Seasonal &amp; gifting</Link></li>
              </ul>
            </div>
            <div>
              <h5><span className="roman">ii.</span>The House</h5>
              <ul>
                <li><Link href="/house/philosophy">Our philosophy</Link></li>
                <li><Link href="/house/factory">Factory &amp; floor</Link></li>
                <li><Link href="/house/certifications">Certifications</Link></li>
                <li><Link href="/house/people">People</Link></li>
                <li><Link href="/house#contact">Contact</Link></li>
                <li><Link href="/blogs">Blogs</Link></li>
              </ul>
            </div>
            <div>
              <h5><span className="roman">iii.</span>Begin</h5>
              <ul>
                <li><Link href="/begin">Start your design</Link></li>
                <li><Link href="/begin">Begin a project</Link></li>
                <li><Link href="/begin#samples">Request samples</Link></li>
                <li><Link href="/volumes">Case studies</Link></li>
                <li><Link href="/craft#materials">Material library</Link></li>
                <li><Link href="/portal">Client portal</Link></li>
              </ul>
            </div>
            <div>
              <h5><span className="roman">iv.</span>Elsewhere</h5>
              <ul>
                <li><a href="mailto:info@huamei.io">info@huamei.io</a></li>
                <li>
                  <a href="https://instagram.com/huamei_inc" target="_blank" rel="noreferrer">
                    Instagram <span className="tag">@huamei_inc</span>
                  </a>
                </li>
                <li>
                  <a href="https://cnhuameiprint.en.alibaba.com" target="_blank" rel="noreferrer">
                    Alibaba <span className="tag">cnhuameiprint</span>
                  </a>
                </li>
                <li><a href="#" target="_blank" rel="noreferrer">LinkedIn</a></li>
                <li><a href="#">WeChat &amp; 小红书</a></li>
                <li><Link href="/house#contact">Contact us</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="hm-certs">
          <Link href="/house/certifications" className="label">Verified &middot; Compliance</Link>
          <Link href="/house/certifications" className="cert">ISO <span className="num">9001</span></Link>
          <span className="sep">&middot;</span>
          <Link href="/house/certifications" className="cert">ISO <span className="num">14001</span></Link>
          <span className="sep">&middot;</span>
          <Link href="/house/certifications" className="cert">ISO <span className="num">45001</span></Link>
          <span className="sep">&middot;</span>
          <Link href="/house/certifications" className="cert">FSC<span className="num">®</span></Link>
          <span className="sep">&middot;</span>
          <Link href="/house/certifications" className="cert">PEFC</Link>
          <span className="sep">&middot;</span>
          <Link href="/house/certifications" className="cert">SGS</Link>
          <span className="sep">&middot;</span>
          <Link href="/house/certifications" className="cert">BSCI</Link>
          <span className="sep">&middot;</span>
          <Link href="/house/certifications" className="cert">SEDEX</Link>
          <span className="sep">&middot;</span>
          <Link href="/house/certifications" className="cert">CE</Link>
          <span className="sep">&middot;</span>
          <Link href="/house/certifications" className="cert">REACH</Link>
        </div>

        <div className="hm-contact">
          <div className="tile">
            <div className="k">Factories &amp; floors</div>
            <div className="v">
              <em>Henan</em> &middot; Zhejiang &middot; Sichuan &middot; Guizhou
            </div>
            <div className="sub">
              22,000 m² &nbsp;&middot;&nbsp; 3,000+ people &nbsp;&middot;&nbsp; Open 24 / 7
            </div>
          </div>
          <div className="tile">
            <div className="k">Projects</div>
            <div className="v">
              <a href="mailto:info@huamei.io" style={{ color: "inherit", textDecoration: "none" }}>
                <em>info@</em>huamei.io
              </a>
            </div>
            <div className="sub">
              Founder-led enquiries only &nbsp;&middot;&nbsp; 300 pcs minimum
            </div>
          </div>
          <div className="tile">
            <div className="k">Schedule</div>
            <div className="v">
              Fastest <em>delivery</em> in 2 wks
            </div>
            <div className="sub">
              DDP on request &nbsp;&middot;&nbsp; Corrections are free
            </div>
          </div>
        </div>

        <div className="hm-colophon">
          <div className="copy">
            © <span className="gold">MM</span>XXVI &middot; Huamei 華美 Packaging Co. Ltd.
          </div>
          <div className="mark" aria-hidden="true">
            <span className="rule" />
            <span className="char">藝</span>
            <span className="rule" />
          </div>
          <div className="links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/accessibility">Accessibility</Link>
            <Link href="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
