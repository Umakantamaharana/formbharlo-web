'use client';

import React from 'react';
import { MessageCircle, Send, ShieldCheck, Sparkles } from 'lucide-react';

interface CommunityBannerProps {
  variant?: 'compact' | 'full' | 'sidebar';
  className?: string;
}

const CommunityBanner: React.FC<CommunityBannerProps> = ({ variant = 'full', className = '' }) => {
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/career135';
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://whatsapp.com/channel/career135';

  if (variant === 'compact' || variant === 'sidebar') {
    return (
      <div className={`w-full flex flex-col gap-2.5 ${className}`}>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer text-center"
        >
          <MessageCircle size={17} className="shrink-0" />
          <span>Join WhatsApp Channel</span>
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer text-center"
        >
          <Send size={17} className="shrink-0" />
          <span>Join Telegram Channel</span>
        </a>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1 text-center">
          <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
          <span>100% Free &bull; Instant Exam &amp; Result Alerts</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 text-white rounded-3xl p-5 sm:p-7 shadow-lg ${className}`}
    >
      {/* Subtle Background Glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5">
        <div className="w-full text-center lg:text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles size={13} className="text-amber-400" />
            100% Free Mobile Alerts
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Never Miss a <span className="text-amber-400">Govt Job Alert</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto lg:mx-0">
            Join 50,000+ aspirants receiving instant admit cards, answer keys, exam dates, and official application links.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md text-xs sm:text-sm shrink-0 text-center"
          >
            <MessageCircle size={17} className="shrink-0" />
            <span>WhatsApp Channel</span>
          </a>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md text-xs sm:text-sm shrink-0 text-center"
          >
            <Send size={17} className="shrink-0" />
            <span>Telegram Channel</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CommunityBanner;
