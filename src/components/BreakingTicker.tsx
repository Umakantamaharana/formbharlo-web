import React from 'react';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { Job } from '../types';

interface BreakingTickerProps {
  jobs: Job[];
}

export default function BreakingTicker({ jobs }: BreakingTickerProps) {
  const topAlerts = jobs.slice(0, 8);
  if (!topAlerts.length) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-2.5 overflow-hidden transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        {/* Urgent Badge */}
        <div className="shrink-0 flex items-center gap-1.5 bg-rose-600 text-white font-black text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
          <Flame size={14} className="animate-pulse" />
          <span>Latest Alerts</span>
        </div>

        {/* Ticker Feed */}
        <div className="overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-4 text-xs">
          {topAlerts.map((job, idx) => (
            <Link
              key={job.id}
              href={`/job/${job.id}`}
              className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>{job.website_content?.title || 'Govt Recruitment Notice'}</span>
              {idx < topAlerts.length - 1 && <span className="text-slate-300 dark:text-slate-700 ml-2">|</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
