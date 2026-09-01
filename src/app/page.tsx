import React from 'react';
import { Metadata } from 'next';
import { fetchJobsServer } from '@/services/serverJobService';
import JobFilterFeed from '@/components/JobFilterFeed';
import AdBanner from '@/components/AdBanner';
import CommunityBanner from '@/components/CommunityBanner';
import BreakingTicker from '@/components/BreakingTicker';
import SarkariMatrix from '@/components/SarkariMatrix';
import SocialLinks from '@/components/SocialLinks';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const revalidate = 1800; // 30 minutes ISR revalidation

export const metadata: Metadata = {
  title: 'FormBharlo - Sarkari Result, Latest Govt Jobs, Admit Cards & Online Forms 2026',
  description:
    'Har Sarkari Bharti, Ek Jagah. Instant alerts on latest Central & State Govt recruitment, SSC, RRB, UPSC, Banking, Defence, Teaching jobs, Admit Cards, and Results 2026.',
  alternates: {
    canonical: 'https://formbharlo.in',
  },
};

export default async function HomePage() {
  const jobs = await fetchJobsServer();

  // Metrics
  const totalJobs = jobs.length;
  const govtJobs = jobs.filter((j) => j.category === 'Government' || j.category === 'State Exams').length;
  const techJobs = jobs.filter((j) => j.category === 'Engineering' || j.category === 'Banking').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col space-y-6 pb-16 transition-colors">
      {/* 1. Breaking Alert Ticker */}
      <BreakingTicker jobs={jobs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        {/* 2. Top Leaderboard Ad Unit (Zero CLS) */}
        <div className="w-full">
          <AdBanner format="leaderboard" slot="home-top-leaderboard" />
        </div>

        {/* 3. The 4-Box Sarkari Matrix (Right at top for instant access) */}
        <SarkariMatrix jobs={jobs} />

        {/* 4. Main Feed & Sticky Ad Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                All Active Recruitment Notices
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
                Join 50k+ Aspirants
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Get breaking exam results, admit cards, and recruitment notices delivered instantly to your phone.
              </p>
              <CommunityBanner variant="sidebar" />
            </div>

            {/* Sticky Skyscraper Ad Unit (300x600) */}
            <div className="sticky top-20 space-y-6">
              <AdBanner
                format="vertical"
                slot="home-sidebar-skyscraper"
                className="bg-white/60 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
              />

              {/* Social Channels */}
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

        {/* 5. Compact Bottom Summary & Trust Metrics */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 transition-colors shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1 max-w-xl">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                FormBharlo &bull; Har Sarkari Bharti, Ek Jagah
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Verified Central &amp; State government recruitment announcements, admit card download links, and merit list scorecards across India.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold shrink-0">
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-center">
                <span className="text-blue-600 dark:text-blue-400 block text-base font-black">{totalJobs}+</span>
                <span className="text-slate-500 text-[10px]">Total Notices</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-center">
                <span className="text-emerald-600 dark:text-emerald-400 block text-base font-black">{govtJobs}+</span>
                <span className="text-slate-500 text-[10px]">Govt Exams</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl text-center">
                <span className="text-amber-600 dark:text-amber-400 block text-base font-black">{techJobs}+</span>
                <span className="text-slate-500 text-[10px]">Bank &amp; Tech</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
