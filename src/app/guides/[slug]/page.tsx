import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  BookmarkCheck,
  Send,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { GUIDE_ARTICLES, GuideArticle } from '@/data/guides';
import AuthorCard from '@/components/AuthorCard';
import AdBanner from '@/components/AdBanner';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDE_ARTICLES.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_ARTICLES.find((g) => g.slug === slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | FormBharlo',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formbharlo.in';
  const canonicalUrl = `${siteUrl}/guides/${guide.slug}`;

  return {
    title: `${guide.title} | FormBharlo Guides`,
    description: guide.excerpt,
    keywords: guide.keywords,
    authors: [{ name: guide.author.name }],
    creator: guide.author.name,
    publisher: 'FormBharlo',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: canonicalUrl,
      siteName: 'FormBharlo',
      type: 'article',
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author.name],
      tags: guide.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.excerpt,
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDE_ARTICLES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formbharlo.in';
  const articleUrl = `${siteUrl}/guides/${guide.slug}`;

  // Article Structured Data (JSON-LD)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: {
      '@type': 'Person',
      name: guide.author.name,
      jobTitle: guide.author.role,
      url: `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FormBharlo',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.svg`,
      },
    },
    keywords: guide.keywords.join(', '),
  };

  const otherGuides = GUIDE_ARTICLES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Ad Unit */}
        <AdBanner format="leaderboard" slot="guide-detail-top-leaderboard" />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap py-1">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/guides" className="hover:text-blue-600 dark:hover:text-blue-400">
            Career Guides
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {guide.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {guide.category}
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Clock size={13} /> {guide.readTime}
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Calendar size={13} /> Updated: {guide.updatedAt}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
            {guide.excerpt}
          </p>

          {/* Author Byline at top */}
          <AuthorCard author={guide.author} lastUpdated={guide.updatedAt} />
        </header>

        {/* Article Body */}
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 prose-headings:font-black prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-800 prose-h2:pb-2 prose-h3:text-lg prose-table:text-xs prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:p-3 prose-td:p-3 prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-800 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold leading-relaxed">
            <ReactMarkdown>{guide.content}</ReactMarkdown>
          </div>

          {/* Keywords / Tags */}
          <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">
              Topic Tags &amp; Related Exams:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {guide.keywords.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Free Photo Resizer Utility Promo Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider">
              <Sliders size={12} /> Free Sarkari Utility
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              Applying for this exam? Resize your photo &amp; signature instantly!
            </h3>
            <p className="text-xs text-blue-100 max-w-xl">
              Use our in-browser tool to match exact SSC, UPSC, Railway &amp; Banking 20–50 KB guidelines with zero blur and 100% privacy.
            </p>
          </div>
          <Link
            href="/tools/image-resizer"
            className="shrink-0 bg-white hover:bg-slate-100 text-blue-700 font-extrabold text-xs sm:text-sm py-3 px-6 rounded-2xl shadow-md transition-all hover:scale-105"
          >
            Open Photo Resizer &rarr;
          </Link>
        </div>

        {/* Related Guides Grid */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            More High-Impact Career &amp; Exam Guides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherGuides.map((item) => (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-indigo-500/50 transition-all group block shadow-xs"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {item.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom In-Feed Ad Unit */}
        <AdBanner format="in-feed" slot="guide-detail-bottom-infeed" />
      </div>
    </div>
  );
}
