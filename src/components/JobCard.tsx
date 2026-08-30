import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Building2, ExternalLink, ArrowRight, Users } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

function normalizeUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function formatShortAction(action?: string): string {
  if (!action) return 'Apply';
  const lower = action.toLowerCase();
  if (lower.includes('admit') || lower.includes('hall ticket')) return 'Admit Card';
  if (lower.includes('result') || lower.includes('scorecard') || lower.includes('merit')) return 'Check Result';
  if (lower.includes('key') || lower.includes('answer')) return 'Answer Key';
  if (lower.includes('apply')) return 'Apply Online';
  return action.length > 14 ? `${action.slice(0, 12)}...` : action;
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Government: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-500/30' },
  Banking: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-500/30' },
  Engineering: { bg: 'bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-500/30' },
  Healthcare: { bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-500/30' },
  Defence: { bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-500/30' },
  Teaching: { bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-500/30' },
  'State Exams': { bg: 'bg-cyan-500/10', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-500/30' },
  General: { bg: 'bg-slate-500/10', text: 'text-slate-700 dark:text-slate-400', border: 'border-slate-500/30' },
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const category = job.category || 'Government';
  const colorScheme = categoryColors[category] || categoryColors.General;
  const directLink = normalizeUrl(job.website_content?.actual_link);
  const actionLabel = formatShortAction(job.website_content?.action);

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500/50 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-950/30 flex flex-col justify-between h-full overflow-hidden">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border}`}
          >
            {category}
          </span>

          <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded">
            <Calendar size={12} className="text-slate-400 shrink-0" />
            <span className="truncate">{job.date || 'Recent'}</span>
          </span>
        </div>

        {/* Authority / Organization */}
        {job.organization && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">
            <Building2 size={13} className="shrink-0" />
            <span className="truncate">{job.organization}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors line-clamp-2 mb-3 leading-snug">
          <Link href={`/job/${job.id}`}>
            {job.website_content?.title || 'Govt Recruitment Notification'}
          </Link>
        </h3>

        {/* Key Quick Matrix Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-3">
          {job.vacancies && (
            <span className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded font-semibold text-[11px]">
              <Users size={11} className="shrink-0" /> {job.vacancies} Posts
            </span>
          )}
          <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-[11px] text-slate-600 dark:text-slate-300">
            <MapPin size={11} className="text-slate-400 shrink-0" /> {job.location || 'India'}
          </span>
          <span className="bg-emerald-50 dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700/60 px-2 py-0.5 rounded text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Online Form
          </span>
        </div>
      </div>

      {/* Card Action Buttons (Responsive Layout with zero overflow) */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 mt-auto">
        <Link
          href={`/job/${job.id}`}
          className="inline-flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold py-2.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-center truncate"
        >
          <span>View Notice</span>
          <ArrowRight size={12} className="shrink-0" />
        </Link>

        {directLink ? (
          <a
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-2 rounded-xl transition-colors shadow-xs text-center truncate"
            title={job.website_content?.action || 'Direct Portal Link'}
          >
            <span className="truncate">{actionLabel}</span>
            <ExternalLink size={11} className="shrink-0" />
          </a>
        ) : (
          <Link
            href={`/job/${job.id}`}
            className="inline-flex items-center justify-center gap-1 bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold py-2.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 text-center truncate"
          >
            <span>Full Details</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;
