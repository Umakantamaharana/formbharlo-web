import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchJobsServer } from '@/services/serverJobService';
import JobFilterFeed from '@/components/JobFilterFeed';
import AdBanner from '@/components/AdBanner';
import CommunityBanner from '@/components/CommunityBanner';
import BreakingTicker from '@/components/BreakingTicker';
import SarkariMatrix from '@/components/SarkariMatrix';
import SocialLinks from '@/components/SocialLinks';
import { ShieldCheck, Sparkles, CheckCircle2, BookOpen, Compass, Zap, MapPin } from 'lucide-react';

export const revalidate = 1800; // 30 minutes ISR revalidation

export const metadata: Metadata = {
  title: 'FormBharlo - Sarkari Result, Latest Govt Jobs, Admit Cards & Online Forms 2026',
  description:
    'Har Sarkari Bharti, Ek Jagah. Instant alerts on latest Central & State Govt recruitment, Odisha Govt Jobs, SSC, RRB, UPSC, Banking, Defence, Teaching jobs, Admit Cards, and Results 2026.',
  alternates: {
    canonical: 'https://formbharlo.in',
  },
};

const POPULAR_HUBS = [
  { label: '🌟 Odisha Govt Jobs', query: 'odisha', color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  { label: '🎓 12th Pass Jobs', query: '12th', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  { label: '👮 Police & Defence', query: 'police', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
  { label: '🚆 Railway (RRB)', query: 'railway', color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
  { label: '🏛️ SSC (CGL/CHSL/GD)', query: 'ssc', color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  { label: '🏦 Banking & IBPS', query: 'bank', color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' },
  { label: '🩺 Healthcare & Nursing', query: 'nursing', color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
];

export default async function HomePage() {
  const jobs = await fetchJobsServer();

  // Dynamic Live Metrics
  const totalJobs = jobs.length;
  const govtJobs = jobs.filter((j) => j.category === 'Government' || j.category === 'State Exams').length;
  const techJobs = jobs.filter((j) => j.category === 'Engineering' || j.category === 'Banking').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col space-y-6 pb-16 transition-colors">
      {/* 1. Breaking Alert Ticker */}
      <BreakingTicker jobs={jobs} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full space-y-6">
        
        {/* 2. Top Promotional / Announcement Banner */}
        <div className="w-full">
          <AdBanner format="leaderboard" slot="home-top-leaderboard" />
        </div>

        {/* 3. High-Intent Regional & Category Hubs (Niche SEO Shortcuts) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Compass size={14} className="text-blue-500" />
              High-Intent Focus Categories &bull; Fast Search
            </span>
            <Link
              href="/guides"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <BookOpen size={12} /> Exam Guides &rarr;
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {POPULAR_HUBS.map((hub) => (
              <Link
                key={hub.label}
                href={`/?q=${encodeURIComponent(hub.query)}#recruitment-feed-top`}
                className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all hover:scale-105 shadow-2xs ${hub.color}`}
              >
                {hub.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 4. The 4-Box Sarkari Matrix (Instant Access to Forms, Admit Cards, Results) */}
        <SarkariMatrix jobs={jobs} />

        {/* 5. Main Feed & Sticky Community Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between" id="recruitment-feed-top">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Zap size={18} className="text-amber-500" />
                Latest Verified Recruitment Notices
              </h2>
            </div>
            <JobFilterFeed initialJobs={jobs} />
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Telegram & WhatsApp Channel Capture */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-4 transition-colors">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-blue-600 dark:text-blue-400" />
                Never Miss an Application Deadline
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Join our official WhatsApp &amp; Telegram channels to get instant notifications when new vacancies and admit cards release.
              </p>
              <CommunityBanner variant="sidebar" />
            </div>

            {/* Sidebar Promo / Tool Unit */}
            <div className="sticky top-20 space-y-6">
              <AdBanner
                format="vertical"
                slot="home-sidebar-skyscraper"
                className="bg-white/60 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
              />

              {/* Official Social Channels */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl text-center space-y-3 transition-colors shadow-xs">
                <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Official Channels
                </h4>
                <SocialLinks />
                <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>100% Free Public Exam Alerts</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* 6. Refined Authority & Fact-Checking Trust Box */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 transition-colors shadow-xs">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={13} />
                <span>Zero Fake Alerts &bull; Direct Official Gazette Links</span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                FormBharlo &bull; Har Sarkari Bharti, Ek Jagah
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                FormBharlo eliminates misleading redirect loops by delivering direct, authentic application links for Central &amp; State government recruitments, admit cards, and merit lists.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold shrink-0">
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 p-3.5 rounded-2xl text-center min-w-[90px]">
                <span className="text-blue-600 dark:text-blue-400 block text-lg font-black">{totalJobs}+</span>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Active Posts</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 p-3.5 rounded-2xl text-center min-w-[90px]">
                <span className="text-emerald-600 dark:text-emerald-400 block text-lg font-black">{govtJobs}+</span>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">State &amp; Centre</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 p-3.5 rounded-2xl text-center min-w-[90px]">
                <span className="text-amber-600 dark:text-amber-400 block text-lg font-black">{techJobs}+</span>
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Bank &amp; Police</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
