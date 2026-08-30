import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle2, BookmarkCheck, Info, ExternalLink } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown-content text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
              <span className="w-2.5 h-6 rounded-full bg-blue-600 inline-block"></span>
              <span>{children}</span>
            </h2>
          ),
          h2: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-indigo-600 inline-block"></span>
              <span>{children}</span>
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-300 mt-6 mb-3 flex items-center gap-2">
              <BookmarkCheck size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{children}</span>
            </h4>
          ),
          h4: ({ children }) => (
            <h5 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2 uppercase tracking-wide">
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 text-sm sm:text-base">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2.5 my-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2.5 my-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 list-decimal list-inside text-slate-700 dark:text-slate-300 text-sm">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="mt-1 shrink-0 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={15} />
              </span>
              <div className="flex-1">{children}</div>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900 dark:text-white bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700/60 px-1.5 py-0.5 rounded text-[13px] sm:text-sm mx-0.5">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 p-4 rounded-2xl bg-blue-50 dark:bg-gradient-to-r dark:from-blue-950/60 dark:to-indigo-950/40 border-l-4 border-blue-600 text-blue-900 dark:text-blue-200 text-sm flex items-start gap-3">
              <Info size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1">{children}</div>
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm border-collapse bg-white dark:bg-slate-900">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white font-bold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700/50 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-800 last:border-r-0 font-medium">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-colors"
            >
              <span>{children}</span>
              <ExternalLink size={12} />
            </a>
          ),
          hr: () => <hr className="my-8 border-slate-200 dark:border-slate-800" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
