'use client';

import React, { useState, useMemo, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Layers, ChevronLeft, ChevronRight, Archive, RotateCcw } from 'lucide-react';
import { Job } from '../types';
import JobCard from './JobCard';
import AdBanner from './AdBanner';

interface JobFilterFeedProps {
  initialJobs: Job[];
  initialCategory?: string;
  initialQuery?: string;
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

const ITEMS_PER_PAGE = 18;

function JobFilterFeedInner({ initialJobs, initialCategory, initialQuery }: JobFilterFeedProps) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') || initialQuery || '';
  const urlCategory = searchParams.get('cat') || initialCategory || 'All Notifications';

  const [userCategory, setUserCategory] = useState<string | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const selectedCategory = userCategory !== null ? userCategory : urlCategory;
  const searchQuery = userSearchQuery !== null ? userSearchQuery : urlQuery;

  // Extract unique available years from jobs
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    initialJobs.forEach((job) => {
      if (job.date) {
        const y = job.date.split('-')[0];
        if (y && y.length === 4) years.add(y);
      }
    });
    return Array.from(years).sort().reverse();
  }, [initialJobs]);

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      // Category Filter
      const matchesCategory =
        selectedCategory === 'All Notifications' || job.category === selectedCategory;

      // Year/Archive Filter
      const matchesYear =
        selectedYear === 'ALL' || (job.date && job.date.startsWith(selectedYear));

      // Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.website_content?.title?.toLowerCase().includes(q) ||
        job.organization?.toLowerCase().includes(q) ||
        job.location?.toLowerCase().includes(q) ||
        job.category?.toLowerCase().includes(q) ||
        job.website_content?.action?.toLowerCase().includes(q);

      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [initialJobs, selectedCategory, selectedYear, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedJobs = useMemo(() => {
    const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredJobs, validPage]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Notifications': initialJobs.length };
    initialJobs.forEach((job) => {
      const cat = job.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [initialJobs]);

  const scrollTags = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const goToPage = (p: number) => {
    setCurrentPage(p);
    const feedElement = document.getElementById('recruitment-feed-top');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPaginationButtons = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = Math.max(2, validPage - delta); i <= Math.min(totalPages - 1, validPage + delta); i++) {
      range.push(i);
    }
    if (validPage - delta > 2) {
      range.unshift('...');
    }
    if (validPage + delta < totalPages - 1) {
      range.push('...');
    }
    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }
    return range;
  };

  return (
    <section className="space-y-6" id="recruitment-feed-top">
      {/* Search & Category Filter Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-3xl shadow-xs space-y-4 transition-colors">
        {/* Search Bar & Archive Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setUserSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Exam Name, SSC, RRB, Bank, Teacher, State Police..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Archive / Year Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Archive size={15} />
              </div>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto pl-9 pr-8 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer appearance-none transition-colors"
                aria-label="Filter by Notification Year"
              >
                <option value="ALL">📅 All Archives</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills with Left / Right Scroll Buttons (No Scrollbar) */}
        <div className="relative flex items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => scrollTags('left')}
            className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
            aria-label="Scroll Categories Left"
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-hidden no-scrollbar scroll-smooth w-full px-1"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setUserCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-750 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
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

          <button
            type="button"
            onClick={() => scrollTags('right')}
            className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors cursor-pointer"
            aria-label="Scroll Categories Right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Result Status & Page Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-600 dark:text-slate-400">
        <span>
          Showing page <strong className="text-slate-900 dark:text-white">{validPage}</strong> of{' '}
          <strong className="text-slate-900 dark:text-white">{totalPages}</strong> ({filteredJobs.length} active notices)
        </span>
        {(searchQuery || selectedCategory !== 'All Notifications' || selectedYear !== 'ALL') && (
          <button
            type="button"
            onClick={() => {
              setUserSearchQuery('');
              setUserCategory('All Notifications');
              setSelectedYear('ALL');
              setCurrentPage(1);
            }}
            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw size={12} /> Reset Filters
          </button>
        )}
      </div>

      {/* Jobs Grid with Interleaved In-Feed Ads */}
      {paginatedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {paginatedJobs.map((job, index) => {
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
            Try adjusting your search keywords or select another archive year / category.
          </p>
          <button
            type="button"
            onClick={() => {
              setUserCategory('All Notifications');
              setSelectedYear('ALL');
              setUserSearchQuery('');
              setCurrentPage(1);
            }}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Numbered Pagination Controls: 1, 2, 3, ... N */}
      {totalPages > 1 && (
        <nav
          className="flex flex-wrap items-center justify-center gap-1.5 pt-6 pb-2"
          aria-label="Recruitment pagination"
        >
          <button
            type="button"
            onClick={() => goToPage(validPage - 1)}
            disabled={validPage === 1}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
              validPage === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer'
            }`}
          >
            <ChevronLeft size={14} /> Prev
          </button>

          {getPaginationButtons().map((btn, idx) => {
            if (btn === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-400 text-xs font-bold select-none"
                >
                  ...
                </span>
              );
            }
            const isCurrent = validPage === btn;
            return (
              <button
                key={`page-${btn}`}
                type="button"
                onClick={() => goToPage(Number(btn))}
                className={`min-w-[36px] h-9 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-xs'
                }`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {btn}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => goToPage(validPage + 1)}
            disabled={validPage === totalPages}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
              validPage === totalPages
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer'
            }`}
          >
            Next <ChevronRight size={14} />
          </button>
        </nav>
      )}
    </section>
  );
}

export default function JobFilterFeed(props: JobFilterFeedProps) {
  return (
    <Suspense fallback={<div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800/40 animate-pulse" />}>
      <JobFilterFeedInner {...props} />
    </Suspense>
  );
}
