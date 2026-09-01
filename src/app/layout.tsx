import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import AdSenseScript from '@/components/AdSenseScript';
import Link from 'next/link';
import { Briefcase, ShieldCheck } from 'lucide-react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://career135.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Career135 - Sarkari Result, Latest Govt Jobs, Admit Cards & Exam Dates 2026',
    template: '%s | Career135',
  },
  description:
    'Find instant updates on latest Central & State Govt recruitment, SSC, RRB, UPSC, Banking, Defence, Teaching jobs, Admit Cards, and Results 2026.',
  keywords: [
    'Sarkari Result',
    'Govt Jobs 2026',
    'Sarkari Naukri',
    'Free Job Alert',
    'Admit Card 2026',
    'Exam Dates',
    'SSC CGL',
    'RRB NTPC',
    'UPSC Recruitment',
    'Bank PO Jobs',
  ],
  authors: [{ name: 'Career135 Editorial Team' }],
  creator: 'Career135',
  publisher: 'Career135',
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': [{ url: `${siteUrl}/feed.xml`, title: 'Career135 RSS Feed' }],
    },
  },
  openGraph: {
    title: 'Career135 - Sarkari Result, Latest Govt Jobs & Exam Dates 2026',
    description: 'Instant notification on Latest Govt Jobs, Exam Dates, Results, Admit Cards & Sarkari Alerts.',
    url: siteUrl,
    siteName: 'Career135',
    images: [
      {
        url: `${siteUrl}/globe.svg`,
        width: 1200,
        height: 630,
        alt: 'Career135 Sarkari Job Portal',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career135 | Latest Govt Jobs & Career Updates',
    description: 'Instant notification on Latest Govt Jobs, Exam Dates, Results, Admit Cards & Tech Careers.',
    creator: '@career135',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Career135',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Career135',
    url: siteUrl,
    logo: `${siteUrl}/globe.svg`,
    sameAs: [
      'https://whatsapp.com/channel/career135',
      'https://t.me/career135',
      'https://twitter.com/career135',
      'https://facebook.com/career135',
    ],
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
        <AdSenseScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
        <Header />

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto text-slate-600 dark:text-slate-400 transition-colors">
          {/* Upper Footer Links */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Brand Col */}
              <div className="md:span-1 space-y-4">
                <Link href="/" className="flex items-center gap-2">
                  <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
                    <Briefcase size={20} />
                  </div>
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Career135</span>
                </Link>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Career135 is a dedicated job aggregation and informational portal bringing the latest government exam notices, hall tickets, results, and direct apply links across India.
                </p>
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck size={16} /> Verified Official Notifications
                </div>
              </div>

              {/* Quick Categories */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">Job Categories</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/?cat=Government" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Central Govt Jobs</Link></li>
                  <li><Link href="/?cat=Banking" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Banking &amp; Insurance</Link></li>
                  <li><Link href="/?cat=Engineering" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Engineering &amp; IT</Link></li>
                  <li><Link href="/?cat=Healthcare" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Healthcare &amp; Nursing</Link></li>
                  <li><Link href="/?cat=Defence" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Defence &amp; Police</Link></li>
                  <li><Link href="/?cat=Teaching" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Teaching &amp; Faculty</Link></li>
                </ul>
              </div>

              {/* Resources & Feeds */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">Quick Resources</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/tools/image-resizer" className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-colors">Photo &amp; Signature Resizer</Link></li>
                  <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Career135</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</Link></li>
                  <li><Link href="/feed.xml" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">RSS Feed (XML)</Link></li>
                  <li><Link href="/sitemap.xml" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">HTML / XML Sitemap</Link></li>
                </ul>
              </div>

              {/* Legal & Compliance */}
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">Legal &amp; Policy</h4>
                <ul className="space-y-2 text-xs">
                  <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service &amp; Disclaimer</Link></li>
                  <li><Link href="/ads.txt" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Authorized Sellers (ads.txt)</Link></li>
                </ul>
                <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-[11px] leading-tight text-slate-600 dark:text-slate-400">
                  <strong>Disclaimer:</strong> Career135 is an independent job portal and is not associated with any government department or agency.
                </div>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>&copy; {new Date().getFullYear()} Career135. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms</Link>
                <Link href="/contact" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
