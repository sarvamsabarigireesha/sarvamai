import logo from "../assets/logo.png";
import hero from "../assets/hero-creator.jpg";
import { Ico } from "../components/Icons.jsx";
import { InstallHint } from "./Tools.jsx";
import {
  FEATURES,
  COMING,
  TESTIMONIALS,
  PLANS,
  PLAN_PERKS,
  FAQ,
  STATS,
} from "../data.js";

const LOGOS = [
  "Startup India",
  "Razorpay Rize",
  "Trustpilot",
  "TiE50",
  "Meta Verified",
  "Google for Startups",
  "Myntra",
  "Nykaa",
  "Plum",
  "AJIO",
  "Flipkart",
  "Amazon",
];

export default function Landing({ onEnter }) {
  return (
    <div className="landing">
      <header className="nav">
        <div className="brand">
          <img src={logo} alt="SarvamAI" />
          SarvamAI
        </div>
        <div className="nav-links">
          <a href="#tools">Tools</a>
          <a href="#store">Store</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-cta">
          <button className="btn btn-ghost" onClick={() => onEnter("login")}>
            Log in
          </button>
          <button className="btn btn-solid" onClick={() => onEnter("signup")}>
            Create free account
          </button>
          <InstallHint toast={() => {}} />
        </div>
      </header>

      <section className="hero">
        <div>
          <div className="kicker">Sarvam · everything, one app</div>
          <h1>
            Create once. Post to <em>IG, FB & YouTube</em>
          </h1>
          <p className="lede">
            Ready unna content bulk queue. Comments ki Auto DM. Instagram,
            Facebook, YouTube — oka login, oka scheduler.
          </p>
          <div className="hero-actions">
            <button className="btn btn-solid" onClick={() => onEnter("login")}>
              Log in
            </button>
            <button className="btn btn-ghost" onClick={() => onEnter("signup")}>
              Sign up free
            </button>
            <a className="btn btn-ghost" href="#tools">
              See tools
            </a>
          </div>
          <div className="trust-row">
            <span>
              <i className="dot" />
              Active now · 1,284 creators online
            </span>
            <span>Under ₹10 / day · No hidden fees</span>
          </div>
        </div>
        <div className="hero-visual">
          <img className="cover" src={hero} alt="Creator filming a reel" />
          <div className="float-card a">
            <div className="t">Auto DM · just now</div>
            <div className="v">₹1,240 earned</div>
            <div className="t">Serum link sent to Priya</div>
          </div>
          <div className="float-card b">
            <div className="t">Priority inbox</div>
            <div className="v">3 brand deals</div>
            <div className="t">Nykaa · Myntra · Plum</div>
          </div>
        </div>
      </section>

      <div className="marquee-wrap">
        <div className="marquee">
          {[...LOGOS, ...LOGOS].map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="section-h">
          <div className="kicker">Trusted across India</div>
          <h2>Creators who create. Software that sells.</h2>
        </div>
        <div className="stat-grid">
          <div className="stat">
            <b>{STATS.creators}</b>
            <span>Creators</span>
          </div>
          <div className="stat">
            <b>{STATS.interactions}</b>
            <span>AI interactions</span>
          </div>
          <div className="stat">
            <b>{STATS.brands}</b>
            <span>Brands on the store</span>
          </div>
          <div className="stat">
            <b>{STATS.collabs}</b>
            <span>Brand collabs</span>
          </div>
        </div>
      </section>

      <section className="section" id="tools">
        <div className="section-h">
          <div className="kicker">One platform</div>
          <h2>Every tool your creator business needs.</h2>
          <p>From DMs to deals to rupees — SarvamAI runs posting while you create.</p>
        </div>
        <div className="feat-grid">
          {FEATURES.map((f) => (
            <article className="feat" key={f.id}>
              <div className="ico">
                <Ico name={f.icon} />
              </div>
              <div className="k">{f.kicker}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
        <div className="feat-grid" style={{ marginTop: 14 }}>
          {COMING.map((c) => (
            <article className="feat" key={c.title} style={{ minHeight: 140, opacity: 0.72 }}>
              <div className="k">Coming soon</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="store">
        <div className="section-h">
          <div className="kicker">132 brands. One storefront.</div>
          <h2>Yours.</h2>
          <p>
            Browse fashion, beauty, tech and lifestyle. Promote what you love.
            Earn commissions automatically — and sell your own PDFs with zero
            platform fee.
          </p>
        </div>
        <div className="compare">
          <article className="bad">
            <h3>Without SarvamAI</h3>
            <ul>
              <li>✗ Miss DMs while you sleep</li>
              <li>✗ Manually reply to every comment</li>
              <li>✗ Lose leads to slow responses</li>
              <li>✗ Chase brand deals yourself</li>
              <li>✗ Share affiliate links by hand</li>
              <li>✗ Burn out doing everything alone</li>
            </ul>
          </article>
          <article className="good">
            <h3>With SarvamAI</h3>
            <ul>
              <li>✓ AI replies 24/7, zero lag</li>
              <li>✓ Auto-comments with smart triggers</li>
              <li>✓ Every lead captured instantly</li>
              <li>✓ Brand deals delivered to you</li>
              <li>✓ Affiliate links sent automatically</li>
              <li>✓ Full autopilot — you just create</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-h">
          <div className="kicker">Real creators. Real results.</div>
          <h2>From 100K to 1M+ followers.</h2>
        </div>
        <div className="quotes">
          {TESTIMONIALS.map((t) => (
            <article className="quote" key={t.name}>
              <div className="kicker">★★★★★ {t.rating}</div>
              <p>“{t.quote}”</p>
              <div className="who">
                @{t.name} · {t.followers} followers
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="section-h">
          <div className="kicker">Simple pricing. Serious results.</div>
          <h2>Under ₹10 a day. Full access.</h2>
          <p>Unlimited features. Instant activation. Cancel anytime.</p>
        </div>
        <div className="price-grid">
          {PLANS.map((p) => (
            <article className={"price" + (p.highlight ? " hi" : "")} key={p.id}>
              <div className="kicker">{p.period}</div>
              <h3>{p.name}</h3>
              <div className="amt">₹{p.price}</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{p.perDay}</div>
              <ul>
                {PLAN_PERKS.map((x) => (
                  <li key={x}>✓ {x}</li>
                ))}
              </ul>
              <button className="btn btn-solid btn-wide" onClick={() => onEnter("signup")}>
                {p.cta}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="faq">
        <div className="section-h">
          <div className="kicker">About SarvamAI</div>
          <h2>Everything you need to know.</h2>
          <p>
            SarvamAI is built for creators who already have the content — and no
            time left to post or reply. One account. Instagram, Facebook, YouTube.
          </p>
        </div>
        <div className="faq">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section" id="install">
        <div className="section-h">
          <div className="kicker">Install SarvamAI</div>
          <h2>Website nundi phone app laaga pettu.</h2>
          <p>
            Chrome / Safari lo Install tap cheste home screen ki vastundi. Login, queue, Bulk DM — app laage open.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <InstallHint toast={() => {}} />
          <button className="btn btn-solid" onClick={() => onEnter("signup")}>
            Create account
          </button>
          <button className="btn btn-ghost" onClick={() => onEnter("login")}>
            Log in
          </button>
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 SarvamAI · Built in Hyderabad</span>
        <span>hello@sarvamai.app</span>
      </footer>
    </div>
  );
}
