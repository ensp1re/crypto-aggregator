import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, SearchCheck } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CardStats", template: "%s · CardStats" },
  description: "Compare crypto cards by eligibility, real cost, funding, and current evidence.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <header className="site-header">
          <div className="shell header-inner">
            <Link className="brand" href="/" aria-label="CardStats home">
              <BarChart3 aria-hidden="true" size={24} />
              <span>CardStats</span>
            </Link>
            <nav aria-label="Primary navigation">
              <Link href="/programs/atlas-card">Program</Link>
              <Link href="/compare">Compare</Link>
              <Link href="/research"><SearchCheck aria-hidden="true" size={18} /> Research</Link>
            </nav>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="shell footer-inner">
            <p><strong>CardStats synthetic vertical slice.</strong> No live card claims or financial advice.</p>
            <p>Commercial status never affects ranking or evidence.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
