import React from 'react';
import { Metadata } from 'next';
import { fetchJobsServer } from '@/services/serverJobService';
import JobFilterFeed from '@/components/JobFilterFeed';
import AdBanner from '@/components/AdBanner';
import CommunityBanner from '@/components/CommunityBanner';
import BreakingTicker from '@/components/BreakingTicker';
import SarkariMatrix from '@/components/SarkariMatrix';
import SocialLinks from '@/components/SocialLinks';
import { Sparkles, Users, ShieldCheck } from 'lucide-react';

export const revalidate = 1800; // 30 minutes ISR revalidation

export const metadata: Metadata = {
  title: 'Career135 - Sarkari Result, Latest Govt Jobs, Admit Cards & Exam Dates 2026',
  description:
    'Find instant updates on latest Central & State Govt recruitment, SSC, RRB, UPSC, Banking, Defence, Teaching jobs, Admit Cards, and Results 2026.',
  alternates: {
    canonical: 'https://career135.com',
  },
};

interface HomePageProps {
  searchParams: Promise<{ cat?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const initialCategory = params?.cat || 'All Notifications';
  const jobs = await fetchJobsServer();

  // Metrics
  const totalJobs = jobs.length;
  const govtJobs = jobs.filter((j) => j.category === 'Government' || j.category === 'State Exams').length;
  const techJobs = jobs.filter((j) => j.category === 'Engineering' || j.category === 'Banking').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col space-y-6 sm:space-y-8 pb-16 transition-colors">
      {/* 1. Breaking Alert Ticker */}
      <BreakingTicker jobs={jobs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6 sm:space-y-8">
        {/* 2. Top Leaderboard Ad Unit (Zero CLS) */}
        <div className="w-full">
          <AdBanner format="leaderboard" slot="home-top-leaderboard" />
        </div>

        {/* 3. Hero Header with Instant Stats */}
        <section className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                <Sparkles size={13} />
                <span>Verified Government & Tech Job Alerts 2026</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                India’s Cleanest Portal for <span className="text-blue-600 dark:text-blue-400">Govt Job Notifications</span> &amp; Results
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                Direct access to official application forms, exam dates, admit cards, and merit lists. Zero clickbait, 100% verified links.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full md:w-auto shrink-0 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 p-3 sm:p-4 rounded-2xl">
                <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white block">{totalJobs}+</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Active Posts</span>
              </div>
              <div className="bg-emerald-50 dark:bg-slate-800/60 border border-emerald-200 dark:border-slate-700/60 p-3 sm:p-4 rounded-2xl">
                <span className="text-lg sm:text-2xl font-black text-emerald-700 dark:text-emerald-400 block">{govtJobs}+</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Sarkari Exams</span>
              </div>
              <div className="bg-blue-50 dark:bg-slate-800/60 border border-blue-200 dark:border-slate-700/60 p-3 sm:p-4 rounded-2xl">
                <span className="text-lg sm:text-2xl font-black text-blue-700 dark:text-blue-400 block">{techJobs}+</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">Bank &amp; Tech</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. The 4-Box Sarkari Matrix */}
        <SarkariMatrix jobs={jobs} />

        {/* 5. Main Feed & Sticky Ad Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                All Active Recruitment Notices
              </h2>
            </div>
            <JobFilterFeed initialJobs={jobs} initialCategory={initialCategory} />
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Telegram & WhatsApp Channel Capture */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs space-y-4 transition-colors">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-blue-600 dark:text-blue-400" />
                Join 50k+ Aspirants
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Get breaking exam results, admit cards, and recruitment notices delivered instantly to your phone.
              </p>
              <CommunityBanner variant="full" />
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
      </div>
    </div>
  );
}
