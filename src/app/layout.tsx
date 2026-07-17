import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Search } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CardStats", template: "%s / CardStats" },
  description: "Independent crypto-card comparison, evidence, and market analytics.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth"><body>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header"><div className="shell header-inner">
        <Link className="brand" href="/" aria-label="CardStats home"><span className="brand-mark">CS</span><span>CardStats<small>Crypto card intelligence</small></span></Link>
        <nav aria-label="Primary navigation"><Link href="/cards">Cards</Link><Link href="/compare">Compare</Link><Link href="/analytics"><BarChart3 aria-hidden="true" size={16} /> Analytics</Link></nav>
        <Link className="header-search" href="/cards" aria-label="Search card index"><Search aria-hidden="true" size={17} /><span>Search</span><kbd>/</kbd></Link>
      </div></header>
      <main id="main-content">{children}</main>
      <footer className="site-footer"><div className="shell footer-grid"><div><Link className="brand footer-brand" href="/"><span className="brand-mark">CS</span><span>CardStats</span></Link><p>Independent crypto-card research. No ranking is influenced by commercial status.</p></div><div><h2>Research</h2><Link href="/cards">Card index</Link><Link href="/compare">Compare</Link><Link href="/analytics">Analytics</Link></div><div><h2>Data boundary</h2><p>Discovery observations are not financial advice or verified issuer terms. Confirm before acting.</p></div></div></footer>
    </body></html>
  );
}
