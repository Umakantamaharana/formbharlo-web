import React from 'react';
import { MessageCircle, Send, Bell, ShieldCheck } from 'lucide-react';

interface CommunityBannerProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const CommunityBanner: React.FC<CommunityBannerProps> = ({ variant = 'full', className = '' }) => {
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/career135';
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://whatsapp.com/channel/career135';

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-4 shadow-md ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bell size={18} className="text-amber-300 animate-bounce" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Instant Job Alerts</h4>
            <p className="text-xs text-blue-100">Get updates directly on WhatsApp &amp; Telegram</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all shadow-sm"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all shadow-sm"
          >
            <Send size={14} /> Telegram
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/50 text-white rounded-2xl p-6 sm:p-8 shadow-xl ${className}`}>
      {/* Subtle Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <ShieldCheck size={14} className="text-emerald-400" />
            100% Free &bull; Zero Spam &bull; Daily Notifications
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Never Miss a <span className="text-amber-400">Govt Job Notification</span> Again!
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            Join 50,000+ job aspirants receiving instant admit card releases, exam syllabus PDFs, answer keys, and direct official application links on mobile.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 text-sm"
          >
            <MessageCircle size={18} />
            Join WhatsApp Channel
          </a>
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-sky-500/25 hover:-translate-y-0.5 text-sm"
          >
            <Send size={18} />
            Join Telegram Group
          </a>
        </div>
      </div>
    </div>
  );
};

export default CommunityBanner;
