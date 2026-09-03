import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  ExternalLink,
  ShieldCheck,
  Layers,
  ChevronRight,
  Sparkles,
  UserCheck,
  FileText,
  Clock,
  Briefcase,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { getJobByIdServer, fetchJobsServer, getRelatedJobsServer, normalizeExternalUrl } from '@/services/serverJobService';
import AdBanner from '@/components/AdBanner';
import CommunityBanner from '@/components/CommunityBanner';
import SocialLinks from '@/components/SocialLinks';
import ShareButtons from '@/components/ShareButtons';
import JobCard from '@/components/JobCard';
import MarkdownContent from '@/components/MarkdownContent';
import AuthorCard from '@/components/AuthorCard';

interface Props {
  params: Promise<{ id: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formbharlo.in';

function getActionContext(actionText: string, titleText: string) {
  const combined = `${actionText} ${titleText}`.toLowerCase();

  if (/result|scorecard|merit|cutoff|cut-off|panel/i.test(combined)) {
    return {
      type: 'RESULT',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      bannerBg: 'from-emerald-600 to-teal-700',
      actionVerb: 'Check Result',
      icon: '🏆',
      statusText: 'Results Declared / Scorecard Available',
    };
  }
  if (/admit|hall ticket|call letter|city intimation|admit card/i.test(combined)) {
    return {
      type: 'ADMIT_CARD',
      badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
      bannerBg: 'from-blue-600 to-indigo-700',
      actionVerb: 'Download Admit Card',
      icon: '🎫',
      statusText: 'Admit Card / Exam City Live',
    };
  }
  if (/answer key|key|response sheet|objection/i.test(combined)) {
    return {
      type: 'ANSWER_KEY',
      badgeColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      bannerBg: 'from-amber-600 to-orange-700',
      actionVerb: 'Download Answer Key',
      icon: '🔑',
      statusText: 'Official Answer Key & Response Sheet',
    };
  }
  return {
    type: 'RECRUITMENT',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    bannerBg: 'from-blue-600 to-indigo-700',
    actionVerb: 'Apply Online',
    icon: '📝',
    statusText: 'Online Application Active',
  };
}

export async function generateStaticParams() {
  const jobs = await fetchJobsServer();
  return jobs.slice(0, 50).map((job) => ({
    id: job.id.toString(),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobByIdServer(id);

  if (!job) {
    return {
      title: 'Job Notification Not Found | FormBharlo',
    };
  }

  const jobTitle = job.website_content?.title || 'Govt Recruitment Notification';
  const description =
    job.website_content?.summary ||
    `Apply online for ${jobTitle}. Get verified notification PDF, eligibility, syllabus, admit card, and direct application links at FormBharlo.`;
  const canonicalUrl = `${siteUrl}/job/${job.id}`;

  return {
    title: `${jobTitle} | FormBharlo`,
    description,
    keywords: [
      job.category || 'Government',
      job.organization || 'Govt Jobs',
      'Sarkari Result',
      'Govt Job Alert',
      'Recruitment Notification 2026',
      jobTitle,
    ],
    authors: [{ name: 'FormBharlo Recruitment Desk' }],
    creator: 'FormBharlo',
    publisher: 'FormBharlo',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: jobTitle,
      description,
      url: canonicalUrl,
      siteName: 'FormBharlo',
      images: [
        {
          url: job.image_url || `${siteUrl}/api/og?title=${encodeURIComponent(jobTitle)}`,
          width: 1200,
          height: 630,
          alt: jobTitle,
        },
      ],
      type: 'article',
      publishedTime: job.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: jobTitle,
      description,
      images: [job.image_url || `${siteUrl}/api/og?title=${encodeURIComponent(jobTitle)}`],
    },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobByIdServer(id);

  if (!job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-slate-50 dark:bg-slate-950">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
          <Briefcase size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Notification Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm max-w-md">
          This job alert might have expired, been updated, or moved to our archives.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md"
        >
          <ArrowLeft size={16} />
          Back to Latest Jobs
        </Link>
      </div>
    );
  }

  const directLink = normalizeExternalUrl(job.website_content?.actual_link);
  const actionText = job.website_content?.action || 'Apply Online / Check Notice';
  const canonicalUrl = `${siteUrl}/job/${job.id}`;
  const jobTitle = job.website_content?.title || 'Govt Recruitment Notification';
  const actionContext = getActionContext(actionText, jobTitle);

  // Fetch related jobs
  const relatedJobs = await getRelatedJobsServer(job, 4);

  // Structured Data (JSON-LD) for Google Jobs Rich Results
  const jsonLdJobPosting = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: jobTitle,
    description: job.website_content?.summary || jobTitle,
    datePosted: job.date ? new Date(job.date).toISOString() : new Date().toISOString(),
    validThrough: job.deadline ? new Date(job.deadline).toISOString() : undefined,
    employmentType: 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organization || 'FormBharlo Job Updates',
      sameAs: siteUrl,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'India',
        addressRegion: job.location || 'India',
        addressCountry: 'IN',
      },
    },
    directApply: true,
  };

  // Breadcrumbs Schema
  const jsonLdBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: job.category || 'Jobs',
        item: `${siteUrl}/?cat=${encodeURIComponent(job.category || 'Government')}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: job.website_content?.title || 'Notification',
        item: canonicalUrl,
      },
    ],
  };

  // Google SERP FAQ Schema
  const jsonLdFAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the application deadline for ${job.website_content?.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The deadline to apply is ${job.deadline || 'as specified in the official notification. Candidates are advised to apply early.'}`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the total vacancies for ${job.website_content?.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Total vacancies: ${job.vacancies || 'Multiple posts'} with recruiting body ${job.organization || 'Govt Authority'}. Location: ${job.location || 'All India'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Where can I find the official direct apply link for ${job.website_content?.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can access the verified direct application link and official authority portal in the Useful Important Links table on FormBharlo.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-4 sm:py-8 transition-colors">
      {/* Schema Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdJobPosting) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-4 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-slate-400 dark:text-slate-600 shrink-0" />
          <Link
            href={`/?cat=${encodeURIComponent(job.category || 'Government')}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {job.category || 'Government'}
          </Link>
          <ChevronRight size={12} className="text-slate-400 dark:text-slate-600 shrink-0" />
          <span className="text-slate-800 dark:text-slate-300 font-medium truncate max-w-[200px] sm:max-w-md">
            {job.website_content?.title}
          </span>
        </nav>

        {/* Top Leaderboard Ad Unit */}
        <div className="mb-4 sm:mb-6">
          <AdBanner format="leaderboard" slot="job-detail-top-leaderboard" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs transition-colors">
              
              {/* Header Box */}
              <div className="p-4 sm:p-6 md:p-8 bg-slate-50/80 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/40 border-b border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-0.5 rounded-full border ${actionContext.badgeColor}`}>
                    {job.category || 'Government'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {job.type || 'Full-time'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 ml-auto">
                    {job.date || 'Recent'}
                  </span>
                </div>

                <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {job.website_content?.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-1">
                  {job.organization && (
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                      <Building2 size={15} className="shrink-0" />
                      <span>{job.organization}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-slate-400 shrink-0" />
                    <span>{job.location || 'All India'}</span>
                  </div>
                </div>
              </div>

              {/* Redesigned Clean Snapshot Grid (Mobile-First) */}
              <div className="p-4 sm:p-6 bg-slate-50/40 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500" />
                  Key Recruitment Details
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {/* Item 1: Post Date */}
                  <div className="bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3 space-y-0.5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 block uppercase tracking-tight">
                      Post Date
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate">
                      {job.date || 'Active'}
                    </span>
                  </div>

                  {/* Item 2: Vacancies */}
                  <div className="bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3 space-y-0.5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 block uppercase tracking-tight">
                      Total Posts
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-amber-600 dark:text-amber-400 block truncate">
                      {job.vacancies || 'Multiple'}
                    </span>
                  </div>

                  {/* Item 3: Job Location */}
                  <div className="bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3 space-y-0.5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 block uppercase tracking-tight">
                      Location
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate">
                      {job.location || 'All India'}
                    </span>
                  </div>

                  {/* Item 4: Application Mode */}
                  <div className="bg-white dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3 space-y-0.5">
                    <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 block uppercase tracking-tight">
                      Apply Mode
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block truncate">
                      Online Portal
                    </span>
                  </div>
                </div>
              </div>

              {/* Formatted Markdown Body with Enhanced Typography */}
              <div className="p-4 sm:p-6 md:p-8 text-slate-800 dark:text-slate-200 space-y-6">
                {job.image_url && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={job.image_url}
                      alt={job.website_content?.title || 'Job Notice'}
                      className="w-full h-auto max-h-[450px] object-cover"
                    />
                  </div>
                )}

                <MarkdownContent content={job.website_content?.markdown_content || ''} />

                {/* In-Feed Ad Unit */}
                <div className="my-4 sm:my-6">
                  <AdBanner format="in-feed" slot="job-detail-pre-links" />
                </div>

                {/* Important Official Links Table */}
                <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-slate-900">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/60 dark:to-indigo-900/60 px-4 sm:px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                      <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                      Useful Important Links
                    </h3>
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                      Official Links
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                    {/* Row 1: Direct Action / Apply Link */}
                    {directLink ? (
                      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{actionText}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Direct official registration &amp; notification link</span>
                        </div>
                        <a
                          href={directLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs shrink-0 min-h-[40px]"
                        >
                          <span>Click Here</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    ) : null}

                    {/* Row 2: Official Authority Website */}
                    <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-white dark:bg-slate-900">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Official Website</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Visit recruiting authority official homepage</span>
                      </div>
                      <a
                        href={directLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-bold text-xs py-2.5 px-5 rounded-xl border border-slate-700 shrink-0 min-h-[40px]"
                      >
                        <span>Official Portal</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* E-E-A-T Author & Fact-Checking Badge */}
                <AuthorCard lastUpdated={job.date || 'August 2026'} />

                {/* Social Share Buttons */}
                <div className="pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2.5">
                    Share this notification with friends
                  </h4>
                  <ShareButtons
                    title={job.website_content?.title || 'Job Update'}
                    url={`${siteUrl}/job/${job.id}`}
                  />
                </div>
              </div>
            </article>

            {/* In-article Ad Placement directly after article */}
            <AdBanner format="in-feed" slot="job-detail-after-content" />

            {/* Related Jobs Section */}
            {relatedJobs.length > 0 && (
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers size={17} className="text-blue-600 dark:text-blue-400" />
                    Related Exam Notifications
                  </h3>
                  <Link
                    href={`/?cat=${encodeURIComponent(job.category || 'Government')}`}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    View All &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {relatedJobs.map((rJob) => (
                    <JobCard key={rJob.id} job={rJob} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (Desktop Sticky) */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 space-y-4 shadow-xs sticky top-20">
              
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Quick Action
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2">
                  {job.website_content?.title}
                </h3>
              </div>

              {directLink ? (
                <a
                  href={directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-md text-center"
                >
                  {actionText}
                  <ExternalLink size={15} />
                </a>
              ) : (
                <div className="text-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  Link in Detailed Notification
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Verified Direct Official Portal Link</span>
              </div>

              {/* Compact WhatsApp/Telegram Channel */}
              <div className="pt-1">
                <CommunityBanner variant="compact" />
              </div>

              {/* Sticky Skyscraper Ad */}
              <div className="pt-1">
                <AdBanner
                  format="vertical"
                  slot="job-detail-sidebar-skyscraper"
                  className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                />
              </div>

              {/* Social Channels */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Follow for Updates
                </h4>
                <SocialLinks />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Bottom Quick Apply Bar on Mobile */}
      {directLink && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 px-3 flex items-center justify-between gap-3 shadow-2xl">
          <div className="truncate flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate leading-tight">
              {job.website_content?.title}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
              {job.organization || 'Govt Notification'}
            </span>
          </div>
          <a
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3.5 rounded-xl shrink-0 shadow-md min-h-[38px]"
          >
            <span>{actionText.length > 15 ? 'Apply / View' : actionText}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
