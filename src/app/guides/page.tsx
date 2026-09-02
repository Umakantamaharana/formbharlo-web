import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, Sparkles, User, Tag, ShieldCheck, Award } from 'lucide-react';
import { GUIDE_ARTICLES } from '@/data/guides';
import AdBanner from '@/components/AdBanner';

export const metadata = {
  title: 'Government Exam Preparation & Career Guides 2026 | FormBharlo',
  description:
    'Comprehensive, in-depth career comparisons, syllabus breakdowns, and preparation strategies for SSC, UPSC, Railways, Banking, Police, and State PSC examinations.',
  keywords: [
    'Sarkari Exam Preparation Guides',
    'SSC CGL vs RRB NTPC',
    'Odisha Police Preparation',
    'AIIMS NORCET Guide',
    'Govt Jobs After 12th',
    'UPSC OTR Registration',
  ],
  alternates: {
    canonical: 'https://formbharlo.in/guides',
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Ad Unit */}
        <AdBanner format="leaderboard" slot="guides-top-leaderboard" />

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 border border-blue-200/80 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <Award size={14} className="text-blue-600 dark:text-blue-400" />
            Authoritative Career Research &bull; FormBharlo Editorial Desk
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Government Exam Strategy &amp; Career Guides
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            In-depth analytical guides, syllabus breakdowns, physical standards, pay scale comparisons, and expert exam strategies written by experienced recruitment researchers.
          </p>
        </div>

        {/* Featured Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDE_ARTICLES.map((guide) => (
            <article
              key={guide.slug}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-blue-500/40 dark:hover:border-indigo-500/40 transition-all duration-200 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <Clock size={12} /> {guide.readTime}
                  </span>
                </div>

                <Link href={`/guides/${guide.slug}`} className="block">
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-3">
                    {guide.title}
                  </h2>
                </Link>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {guide.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-black text-xs flex items-center justify-center">
                    {guide.author.name.charAt(0)}
                  </div>
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                      {guide.author.name}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {guide.publishedAt}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform"
                >
                  Read Guide <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* E-E-A-T Editorial Commitment Card */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={18} className="text-emerald-400" />
            FormBharlo Editorial &amp; Fact-Checking Standards
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Independent, Research-Backed Guidance for Aspirants
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Every guide published on FormBharlo is cross-verified against official Central Government Gazettes, Staff Selection Commission (SSC) notifications, UPSC guidelines, and State PSC notifications. We do not accept paid placements from private coaching institutes or charge fees for application guidance.
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold py-2.5 px-5 rounded-xl transition-all shadow-md"
            >
              Learn More About Our Team &amp; Methodology &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom In-Feed Ad Unit */}
        <AdBanner format="in-feed" slot="guides-bottom-infeed" />
      </div>
    </div>
  );
}
