import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, CheckCircle2, Award, Key, Clock, Radio } from 'lucide-react';
import { Job } from '../types';

interface BreakingTickerProps {
  jobs: Job[];
}

function getTickerBadge(job: Job, index: number) {
  const title = (job.website_content?.title || '').toLowerCase();
  const action = (job.website_content?.action || '').toLowerCase();

  if (title.includes('result') || title.includes('scorecard') || title.includes('merit') || action.includes('result')) {
    return {
      label: 'RESULT',
      icon: <CheckCircle2 size={11} />,
      badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
    };
  }
  if (title.includes('admit') || title.includes('hall ticket') || action.includes('admit')) {
    return {
      label: 'ADMIT CARD',
      icon: <Award size={11} />,
      badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    };
  }
  if (title.includes('answer key') || title.includes('syllabus') || action.includes('key')) {
    return {
      label: 'ANSWER KEY',
      icon: <Key size={11} />,
      badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    };
  }
  if (job.deadline && (job.deadline.includes('2026') || job.deadline.includes('Soon'))) {
    return {
      label: 'CLOSING SOON',
      icon: <Clock size={11} />,
      badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30',
    };
  }
  if (index < 3) {
    return {
      label: 'NEW',
      icon: <Sparkles size={11} />,
      badgeClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
    };
  }
  return {
    label: 'LIVE',
    icon: <Radio size={11} className="animate-pulse" />,
    badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
  };
}

export default function BreakingTicker({ jobs }: BreakingTickerProps) {
  const topAlerts = jobs.slice(0, 10);
  if (!topAlerts.length) return null;

  // Double the list to ensure seamless 360-degree marquee loop
  const tickerItems = [...topAlerts, ...topAlerts];

  return (
    <div className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-2 overflow-hidden transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Urgent Badge Header */}
        <div className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-md shadow-xs z-10">
          <Flame size={14} className="animate-bounce" />
          <span className="hidden sm:inline">Breaking Alerts</span>
          <span className="sm:hidden">Alerts</span>
        </div>

        {/* Continuous Smooth Marquee Track */}
        <div className="relative flex-1 overflow-hidden">
          {/* Subtle Fade Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

          <div className="ticker-track flex items-center gap-6 whitespace-nowrap cursor-pointer">
            {tickerItems.map((job, idx) => {
              const badge = getTickerBadge(job, idx % topAlerts.length);
              return (
                <Link
                  key={`${job.id}-${idx}`}
                  href={`/job/${job.id}`}
                  className="inline-flex items-center gap-2 group text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs font-semibold py-0.5"
                >
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-extrabold border ${badge.badgeClass}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <span className="group-hover:underline underline-offset-2">
                    {job.website_content?.title || 'Govt Recruitment Notice 2026'}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700 ml-3 select-none">&bull;</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
