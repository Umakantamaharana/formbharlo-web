import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchJobsServer } from '@/services/serverJobService';
import JobCard from '@/components/JobCard';
import AdBanner from '@/components/AdBanner';
import { ChevronRight, Sparkles, MapPin, Layers, Briefcase } from 'lucide-react';

interface Props {
  params: Promise<{ category: string; state: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formbharlo.in';

function formatParam(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const categoryName = formatParam(p.category);
  const stateName = formatParam(p.state);

  const title = `Latest ${categoryName} Jobs in ${stateName} 2026 - Vacancies, Eligibility & Online Form`;
  const description = `Find all active ${categoryName} recruitment notifications, admit cards, and exam dates in ${stateName} 2026. 100% verified direct official application links on FormBharlo.`;
  const canonicalUrl = `${siteUrl}/jobs/${p.category}/${p.state}`;

  return {
    title: `${title} | FormBharlo`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function ProgrammaticCategoryStatePage({ params }: Props) {
  const p = await params;
  const categoryParam = decodeURIComponent(p.category).toLowerCase().replace(/-/g, ' ');
  const stateParam = decodeURIComponent(p.state).toLowerCase().replace(/-/g, ' ');

  const categoryName = formatParam(p.category);
  const stateName = formatParam(p.state);

  const allJobs = await fetchJobsServer();

  // Filter jobs matching category and state
  const matchingJobs = allJobs.filter((job) => {
    const fullText = `${job.category} ${job.location} ${job.organization} ${job.website_content?.title} ${job.website_content?.markdown_content}`.toLowerCase();
    const matchesCategory = categoryParam === 'all' || fullText.includes(categoryParam);
    const matchesState = stateParam === 'all india' || fullText.includes(stateParam);
    return matchesCategory && matchesState;
  });

  const displayJobs = matchingJobs.length > 0 ? matchingJobs : allJobs.slice(0, 18);

  const jsonLdBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: `${categoryName} Jobs`, item: `${siteUrl}/?cat=${encodeURIComponent(categoryName)}` },
      { '@type': 'ListItem', position: 3, name: `${categoryName} in ${stateName}`, item: `${siteUrl}/jobs/${p.category}/${p.state}` },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
          <Link href={`/?cat=${encodeURIComponent(categoryName)}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {categoryName}
          </Link>
          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
          <span className="text-slate-800 dark:text-slate-300 font-medium">
            {stateName}
          </span>
        </nav>

        {/* Top Ad Unit */}
        <AdBanner format="leaderboard" slot="pseo-top-leaderboard" />

        {/* Hero Header */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles size={13} className="text-amber-500" />
            <span>Targeted Recruitment Archive 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Latest <span className="text-blue-600 dark:text-blue-400">{categoryName} Jobs</span> in {stateName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Explore all verified government vacancies, police recruitment drives, admit cards, and application forms in {stateName}. Direct access to official registration links with zero intermediary fees.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              <Briefcase size={13} className="text-blue-500" /> {displayJobs.length} Notifications Available
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              <MapPin size={13} className="text-emerald-500" /> {stateName} &bull; India
            </span>
          </div>
        </section>

        {/* Job Listings Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={18} className="text-blue-600" />
              Active Notices ({displayJobs.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {displayJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Bottom In-Feed Ad */}
        <AdBanner format="in-feed" slot="pseo-bottom-infeed" />
      </div>
    </div>
  );
}
