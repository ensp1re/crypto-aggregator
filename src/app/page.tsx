import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Scale } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <p className="eyebrow">Evidence-led crypto card research</p>
            <h1>Find a card that is actually scoped to you.</h1>
            <p className="lede">
              Start with residency, compare disclosed economics, and inspect the evidence behind every critical term.
            </p>
            <div className="button-row">
              <Link className="button primary" href="/programs/atlas-card">Explore the fixture <ArrowRight aria-hidden="true" size={18} /></Link>
              <Link className="button secondary" href="/compare">Compare offerings</Link>
            </div>
          </div>
          <aside className="scope-card" aria-labelledby="scope-title">
            <p className="status-line"><BadgeCheck aria-hidden="true" size={18} /> Synthetic and reviewed</p>
            <h2 id="scope-title">Representative slice scope</h2>
            <dl className="metric-list">
              <div><dt>Program</dt><dd>1</dd></div>
              <div><dt>Regional offerings</dt><dd>2</dd></div>
              <div><dt>Plans per offering</dt><dd>2</dd></div>
              <div><dt>Source type</dt><dd>License-safe fixture</dd></div>
            </dl>
          </aside>
        </div>
      </section>
      <section className="shell section" aria-labelledby="method-title">
        <p className="eyebrow">How the slice works</p>
        <h2 id="method-title">Decision first, database second.</h2>
        <div className="feature-grid">
          <article><MapPin aria-hidden="true" /><h3>Scope eligibility</h3><p>Germany and France remain distinct legal offerings with their own issuers and terms.</p></article>
          <article><Scale aria-hidden="true" /><h3>Compare real conditions</h3><p>Fees, reward caps, funding, and unknown values travel with plan and country context.</p></article>
          <article><BadgeCheck aria-hidden="true" /><h3>Inspect evidence</h3><p>Published values retain source authority, locator, observed date, and audit history.</p></article>
        </div>
      </section>
    </>
  );
}
