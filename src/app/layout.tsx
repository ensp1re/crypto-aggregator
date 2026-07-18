import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BarChart3, Search } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl, organizationReference } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Compare Crypto Cards, Fees & Rewards | CardStats", template: "%s | CardStats" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "finance",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const identityGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationReference()["@id"],
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
        description: SITE_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: organizationReference(),
        inLanguage: "en",
      },
    ],
  };
  return (
    <html lang="en" data-scroll-behavior="smooth"><body><JsonLd data={identityGraph} />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header"><div className="shell header-inner">
        <Link className="brand" href="/" aria-label="CardStats home"><Image className="brand-mark" src="/icon.svg" alt="" width={34} height={34} priority /><span>CardStats<small>Crypto card intelligence</small></span></Link>
        <nav aria-label="Primary navigation"><Link href="/cards">Cards</Link><Link href="/compare">Compare</Link><Link href="/analytics"><BarChart3 aria-hidden="true" size={16} /> Analytics</Link></nav>
        <Link className="header-search" href="/cards" aria-label="Search card index"><Search aria-hidden="true" size={17} /><span>Search</span><kbd>/</kbd></Link>
      </div></header>
      <main id="main-content">{children}</main>
      <footer className="site-footer"><div className="shell footer-grid"><div><Link className="brand footer-brand" href="/"><Image className="brand-mark" src="/icon.svg" alt="" width={34} height={34} /><span>CardStats</span></Link><p>Independent crypto-card comparison. Commercial status never changes card order.</p></div><div><h2>Explore</h2><Link href="/cards">Card index</Link><Link href="/compare">Compare</Link><Link href="/analytics">Analytics</Link></div><div><h2>Before you apply</h2><p>Card prices, rewards, and benefits can change. Open the linked card website for current terms.</p></div></div></footer>
    </body></html>
  );
}
