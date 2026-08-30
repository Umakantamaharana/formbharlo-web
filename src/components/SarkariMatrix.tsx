import React from 'react';
import Link from 'next/link';
import { Briefcase, Award, CheckCircle2, Key, ArrowRight } from 'lucide-react';
import { Job } from '../types';

interface SarkariMatrixProps {
  jobs: Job[];
}

export default function SarkariMatrix({ jobs }: SarkariMatrixProps) {
  // Classify jobs into 4 Sarkari categories
  const latestJobs = jobs.filter((j) => {
    const title = (j.website_content?.title || '').toLowerCase();
    const action = (j.website_content?.action || '').toLowerCase();
    return !title.includes('result') && !title.includes('admit') && !title.includes('answer key') && !action.includes('result');
  }).slice(0, 6);

  const results = jobs.filter((j) => {
    const title = (j.website_content?.title || '').toLowerCase();
    const action = (j.website_content?.action || '').toLowerCase();
    return title.includes('result') || title.includes('scorecard') || title.includes('merit') || action.includes('result');
  }).slice(0, 6);

  const admitCards = jobs.filter((j) => {
    const title = (j.website_content?.title || '').toLowerCase();
    const action = (j.website_content?.action || '').toLowerCase();
    return title.includes('admit') || title.includes('hall ticket') || title.includes('call letter') || action.includes('admit');
  }).slice(0, 6);

  const answerKeys = jobs.filter((j) => {
    const title = (j.website_content?.title || '').toLowerCase();
    const action = (j.website_content?.action || '').toLowerCase();
    return title.includes('answer key') || title.includes('syllabus') || title.includes('pattern') || action.includes('key');
  }).slice(0, 6);

  const columns = [
    {
      title: 'Top Online Forms',
      icon: <Briefcase size={18} className="text-blue-600 dark:text-blue-400" />,
      headerBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-500/20 text-blue-900 dark:text-blue-300',
      badgeBg: 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300',
      jobs: latestJobs,
      catFilter: 'Government',
    },
    {
      title: 'Admit Cards',
      icon: <Award size={18} className="text-emerald-600 dark:text-emerald-400" />,
      headerBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-300',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300',
      jobs: admitCards.length > 0 ? admitCards : jobs.slice(6, 12),
      catFilter: 'State Exams',
    },
    {
      title: 'Results & Scorecards',
      icon: <CheckCircle2 size={18} className="text-rose-600 dark:text-rose-400" />,
      headerBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/20 text-rose-900 dark:text-rose-300',
      badgeBg: 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300',
      jobs: results.length > 0 ? results : jobs.slice(12, 18),
      catFilter: 'Banking',
    },
    {
      title: 'Answer Keys & Syllabus',
      icon: <Key size={18} className="text-amber-600 dark:text-amber-400" />,
      headerBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-300',
      badgeBg: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300',
      jobs: answerKeys.length > 0 ? answerKeys : jobs.slice(18, 24),
      catFilter: 'Engineering',
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Quick Recruitment Matrix</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Instant 1-click access to top active notifications and results
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            {/* Column Header */}
            <div className={`px-4 py-3 border-b flex items-center justify-between ${col.headerBg}`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {col.icon}
                <span>{col.title}</span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${col.badgeBg}`}>
                {col.jobs.length} Active
              </span>
            </div>

            {/* Job Items List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 p-2 space-y-1">
              {col.jobs.map((item) => (
                <Link
                  key={item.id}
                  href={`/job/${item.id}`}
                  className="group block p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug mb-1">
                    {item.website_content?.title || 'Govt Recruitment 2026'}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[130px] font-medium text-slate-600 dark:text-slate-400">
                      {item.organization || item.location || 'India'}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-[10px] shrink-0 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      View &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Column Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-center mt-auto">
              <Link
                href={`/?cat=${encodeURIComponent(col.catFilter)}`}
                className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1 transition-colors"
              >
                View More {col.title} <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
