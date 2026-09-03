import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CheckCircle2, BookmarkCheck, Info, ExternalLink, ChevronRight, HelpCircle } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

function normalizeMarkdownUrl(url?: string): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/') || trimmed.startsWith('./')) {
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-content text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-6 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="w-1.5 sm:w-2 h-4 sm:h-5 rounded-full bg-blue-600 inline-block shrink-0"></span>
              <span>{children}</span>
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 dark:text-white mt-5 mb-2.5 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-3.5 sm:h-4 rounded-full bg-indigo-600 inline-block shrink-0"></span>
              <span>{children}</span>
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-sm sm:text-base font-bold text-blue-700 dark:text-blue-400 mt-4 mb-2 flex items-center gap-1.5">
              <ChevronRight size={15} className="text-blue-500 shrink-0" />
              <span>{children}</span>
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1.5 uppercase tracking-wide">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 text-xs sm:text-sm md:text-base">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 my-3 pl-1 sm:pl-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 my-3 pl-5 list-decimal text-slate-700 dark:text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="mt-1 shrink-0 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={14} className="sm:w-4 sm:h-4" />
              </span>
              <div className="flex-1 min-w-0">{children}</div>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900 dark:text-white">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 p-3.5 sm:p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border-l-4 border-blue-600 text-blue-950 dark:text-blue-200 text-xs sm:text-sm flex items-start gap-2.5">
              <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{children}</div>
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 space-y-1">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white dark:bg-slate-900 min-w-[320px]">
                  {children}
                </table>
              </div>
              <div className="sm:hidden text-[10px] text-slate-400 text-right pr-1">
                &larr; Swipe horizontally to view full table &rarr;
              </div>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold uppercase text-[10px] sm:text-xs tracking-wider border-b border-slate-200 dark:border-slate-700">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors even:bg-slate-50/50 dark:even:bg-slate-850/50">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-bold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 sm:px-4 py-2 sm:py-3 align-top leading-snug">
              {children}
            </td>
          ),
          a: ({ href, children }) => {
            const safeHref = normalizeMarkdownUrl(href);
            return (
              <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5 break-all"
              >
                <span>{children}</span>
                <ExternalLink size={11} className="inline shrink-0" />
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
