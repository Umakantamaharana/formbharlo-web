import React from 'react';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface AuthorProps {
  author?: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  reviewedBy?: string;
  lastUpdated?: string;
}

export default function AuthorCard({ author, reviewedBy, lastUpdated }: AuthorProps) {
  const authorData = author || {
    name: 'Umakanta Maharana',
    role: 'Founder & Lead Recruitment Analyst',
    avatar: '/logo.svg',
    bio: 'Public sector recruitment policy researcher and developer. Analyzes official employment gazettes, Staff Selection Commission (SSC) notifications, and State PSC examination frameworks.',
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 space-y-4 my-6">
      {/* E-E-A-T Editorial Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck size={15} />
          <span>Verified against Official Govt Gazette &amp; Employment News</span>
        </div>
        {lastUpdated && (
          <span className="text-slate-500">Last Reviewed: {lastUpdated}</span>
        )}
      </div>

      {/* Author Profile */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
          {authorData.name.charAt(0)}
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {authorData.name}
            </span>
            <span className="inline-flex items-center gap-0.5 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              <CheckCircle2 size={10} /> Verified Author
            </span>
          </div>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {authorData.role}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
            {authorData.bio}
          </p>
        </div>
      </div>

      {/* Editorial Disclaimer */}
      <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
        <span>Editorial Policy: FormBharlo adheres to strict fact-checking protocols.</span>
        <Link href="/about" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
          Our Methodology &rarr;
        </Link>
      </div>
    </div>
  );
}
