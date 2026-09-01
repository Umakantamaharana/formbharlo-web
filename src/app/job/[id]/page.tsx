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
} from 'lucide-react';
import { getJobByIdServer, fetchJobsServer, getRelatedJobsServer, normalizeExternalUrl } from '@/services/serverJobService';
import AdBanner from '@/components/AdBanner';
import CommunityBanner from '@/components/CommunityBanner';
import SocialLinks from '@/components/SocialLinks';
import ShareButtons from '@/components/ShareButtons';
import JobCard from '@/components/JobCard';
import MarkdownContent from '@/components/MarkdownContent';

interface Props {
  params: Promise<{ id: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formbharlo.in';

function getActionContext(actionText: string, titleText: string) {
  const combined = `${actionText} ${titleText}`.toLowerCase();

  if (/result|scorecard|merit|cutoff|cut-off|panel/i.test(combined)) {
    return {
      type: 'RESULT',
      ctaTitle: 'Ready to check your result or scorecard?',
      ctaSubtitle: 'Access the official score portal and merit list directly.',
      sidebarTitle: 'Official Result Portal',
      sidebarDesc: 'Official link to check your marks, scorecard, or selection list.',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30',
    };
  }
  if (/admit|hall ticket|call letter/i.test(combined)) {
    return {
      type: 'ADMIT_CARD',
      ctaTitle: 'Ready to download your admit card?',
      ctaSubtitle: 'Access the official hall ticket download portal directly.',
      sidebarTitle: 'Admit Card Portal',
      sidebarDesc: 'Official link to download your examination hall ticket and instructions.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
    };
  }
  if (/answer key|response sheet|objection/i.test(combined)) {
    return {
      type: 'ANSWER_KEY',
      ctaTitle: 'Ready to verify the answer key?',
      ctaSubtitle: 'Access the official question paper, answer key, and response sheet.',
      sidebarTitle: 'Official Answer Key',
      sidebarDesc: 'Official link to check the answer key and submit any representations.',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
    };
  }
  return {
    type: 'JOB',
    ctaTitle: 'Ready to submit your application?',
    ctaSubtitle: 'Access the official recruitment and online registration portal directly.',
    sidebarTitle: 'Official Application',
    sidebarDesc: 'Official registration link for this recruitment opportunity.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30',
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const job = await getJobByIdServer(p.id);

  if (!job) {
    return { title: 'Job Not Found | FormBharlo' };
  }

  const title = `${job.website_content?.title || 'Govt Job Notification 2026'}`;
  const description =
    job.website_content?.summary ||
    job.website_content?.markdown_content?.substring(0, 160).replace(/[#*`]/g, '') + '...';
  const canonicalUrl = `${siteUrl}/job/${job.id}`;

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
      type: 'article',
      publishedTime: job.date ? new Date(job.date).toISOString() : new Date().toISOString(),
      images: job.image_url ? [{ url: job.image_url }] : [{ url: `${siteUrl}/globe.svg` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: job.image_url ? [job.image_url] : [`${siteUrl}/globe.svg`],
    },
  };
}

export async function generateStaticParams() {
  const jobs = await fetchJobsServer();
  return jobs.map((job) => ({
    id: String(job.id),
  }));
}

export default async function JobPage({ params }: Props) {
  const p = await params;
  const job = await getJobByIdServer(p.id);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Notification Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            The job or exam notification you are looking for might have expired, closed, or moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 px-6 rounded-xl transition-colors w-full"
          >
            <ArrowLeft size={16} /> Explore All Active Jobs
          </Link>
        </div>
      </div>
    );
  }

  const relatedJobs = await getRelatedJobsServer(job, 3);
  const canonicalUrl = `${siteUrl}/job/${job.id}`;
  const directLink = normalizeExternalUrl(job.website_content?.actual_link);
  const actionText = job.website_content?.action || 'Apply Online';
  const actionContext = getActionContext(actionText, job.website_content?.title || '');

  // Google Jobs JSON-LD Schema
  const datePosted = job.date ? job.date : '2026-01-01';
  const postedTimestamp = new Date(datePosted).getTime();
  const expiryTimestamp = isNaN(postedTimestamp) ? Date.parse('2026-12-31') : postedTimestamp + 60 * 24 * 60 * 60 * 1000;
  const expiryDate = new Date(expiryTimestamp).toISOString().split('T')[0];

  const jsonLdJobPosting = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.website_content?.title || 'Job Listing',
    description: job.website_content?.markdown_content || job.website_content?.summary || '',
    identifier: {
      '@type': 'PropertyValue',
      name: job.organization || 'FormBharlo',
      value: `FORMBHARLO-${job.id}`,
    },
    datePosted,
    validThrough: expiryDate,
    employmentType: job.type === 'Part-time' ? 'PART_TIME' : 'FULL_TIME',
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

  // High-CTR Google SERP FAQ Schema
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 transition-colors">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-5 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
          <Link
            href={`/?cat=${encodeURIComponent(job.category || 'Government')}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {job.category || 'Government'}
          </Link>
          <ChevronRight size={14} className="text-slate-400 dark:text-slate-600" />
          <span className="text-slate-800 dark:text-slate-300 font-medium truncate max-w-xs sm:max-w-md">
            {job.website_content?.title}
          </span>
        </nav>

        {/* Top Leaderboard Ad Unit */}
        <div className="mb-6">
          <AdBanner format="leaderboard" slot="job-detail-top-leaderboard" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">
            <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs transition-colors">
              {/* Header Box */}
              <div className="p-6 sm:p-8 bg-slate-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/40 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${actionContext.badgeColor}`}>
                    {job.category || 'Government'}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    {job.type || 'Full-time'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug mb-4">
                  {job.website_content?.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {job.organization && (
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                      <Building2 size={16} />
                      <span>{job.organization}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-slate-400" />
                    <span>{job.location || 'India'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-slate-400" />
                    <span>Posted on {job.date || 'Recent'}</span>
                  </div>
                </div>
              </div>

              {/* 4-Box Structured Overview Matrix (The "Sarkari Table") */}
              <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
                <h3 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={15} className="text-amber-500" />
                  Key Recruitment Details At-a-Glance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Box 1: Important Dates */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 border-b border-slate-200 dark:border-slate-700/50 pb-1.5">
                      <Clock size={15} />
                      <span>Important Dates</span>
                    </div>
                    <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Notification Released:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{job.date || 'Active'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Application Mode:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Online Form</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Exam / Result Date:</span>
                        <span className="font-semibold text-amber-700 dark:text-amber-300">Check Official Notice</span>
                      </div>
                    </div>
                  </div>

                  {/* Box 2: Vacancy & Authority */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 border-b border-slate-200 dark:border-slate-700/50 pb-1.5">
                      <UserCheck size={15} />
                      <span>Post &amp; Vacancy Summary</span>
                    </div>
                    <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Total Posts:</span>
                        <span className="font-bold text-amber-700 dark:text-amber-300">{job.vacancies || 'Multiple Posts'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Recruiting Body:</span>
                        <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">{job.organization || 'Govt Authority'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Job Location:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{job.location || 'All India'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formatted Markdown Body */}
              <div className="p-6 sm:p-8 text-slate-800 dark:text-slate-200 space-y-6">
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

                {/* High-CTR Pre-Links Ad Unit */}
                <div className="my-6">
                  <AdBanner format="in-feed" slot="job-detail-pre-links" />
                </div>

                {/* Important Official Links Table */}
                <div className="border border-slate-200 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-xs bg-white dark:bg-slate-900">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/60 dark:to-indigo-900/60 px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-black text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-2">
                      <FileText size={18} className="text-blue-600 dark:text-blue-400" />
                      Useful Important Links
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                      Official Links
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                    {/* Row 1: Direct Action / Apply Link */}
                    {directLink ? (
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{actionText}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Direct official registration &amp; notification link</span>
                        </div>
                        <a
                          href={directLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-xs shrink-0"
                        >
                          <span>Click Here</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    ) : null}

                    {/* Row 2: Official Authority Website */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">Official Website</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Visit recruiting authority official homepage</span>
                      </div>
                      <a
                        href={directLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-bold text-xs py-2.5 px-5 rounded-xl border border-slate-700 shrink-0"
                      >
                        <span>Official Portal</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-3">
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
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers size={18} className="text-blue-600 dark:text-blue-400" />
                    Related Exam Notifications
                  </h3>
                  <Link
                    href={`/?cat=${encodeURIComponent(job.category || 'Government')}`}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                  >
                    View All &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedJobs.map((rJob) => (
                    <JobCard key={rJob.id} job={rJob} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Action Widget */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4 sticky top-20 transition-colors">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{actionContext.sidebarTitle}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {actionContext.sidebarDesc}
              </p>

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
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Verified Direct Official Portal Link</span>
              </div>

              {/* Compact WhatsApp/Telegram Channel */}
              <div className="pt-2">
                <CommunityBanner variant="compact" />
              </div>

              {/* High Yield Sticky Skyscraper Ad */}
              <div className="pt-2">
                <AdBanner
                  format="vertical"
                  slot="job-detail-sidebar-skyscraper"
                  className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                />
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
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
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 px-4 flex items-center justify-between gap-4 shadow-2xl">
          <div className="truncate">
            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">{job.website_content?.title}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{job.organization || 'Govt Notification'}</span>
          </div>
          <a
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shrink-0 shadow-md"
          >
            {actionText} <ExternalLink size={13} />
          </a>
        </div>
      )}
    </div>
  );
}
