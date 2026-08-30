'use client';

import React, { useState, useMemo } from 'react';
import { Search, Layers, ChevronDown } from 'lucide-react';
import { Job } from '../types';
import JobCard from './JobCard';
import AdBanner from './AdBanner';

interface JobFilterFeedProps {
  initialJobs: Job[];
  initialCategory?: string;
}

const CATEGORIES = [
  'All Notifications',
  'Government',
  'State Exams',
  'Banking',
  'Engineering',
  'Healthcare',
  'Defence',
  'Teaching',
];

export default function JobFilterFeed({ initialJobs, initialCategory }: JobFilterFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'All Notifications'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(18);

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      // Category Filter
      const matchesCategory =
        selectedCategory === 'All Notifications' || job.category === selectedCategory;

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.website_content?.title?.toLowerCase().includes(q) ||
        job.organization?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        job.category?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [initialJobs, selectedCategory, searchQuery]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Notifications': initialJobs.length };
    initialJobs.forEach((job) => {
      const cat = job.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [initialJobs]);

  return (
    <section className="space-y-6" id="job-feed">
      {/* Search & Category Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-3xl shadow-xs space-y-4 transition-colors">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(18);
            }}
            placeholder="Search by Exam Name, SSC, RRB, Bank, Teacher, State Police..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(18);
                }}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/50'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Status / Count */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-600 dark:text-slate-400">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{visibleJobs.length}</strong> of{' '}
          <strong className="text-slate-900 dark:text-white">{filteredJobs.length}</strong> active alerts
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Jobs Grid with Interleaved In-Feed Ads */}
      {visibleJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {visibleJobs.map((job, index) => {
            const showInFeedAd = (index + 1) % 6 === 0;
            return (
              <React.Fragment key={job.id}>
                <JobCard job={job} />
                {showInFeedAd && (
                  <div className="md:col-span-2 lg:col-span-3 my-2">
                    <AdBanner format="in-feed" slot={`home-infeed-${index}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3 shadow-xs">
          <Layers size={36} className="mx-auto text-slate-400 dark:text-slate-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No notifications found</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs max-w-sm mx-auto">
            Try adjusting your search keywords or explore another exam category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All Notifications');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredJobs.length && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 18)}
            className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-800 dark:text-white font-bold text-xs sm:text-sm py-3 px-8 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 shadow-xs"
          >
            <span>Load More Notifications</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </section>
  );
}
