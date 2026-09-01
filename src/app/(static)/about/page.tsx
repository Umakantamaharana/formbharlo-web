import React from 'react';
import { Target, Zap, CheckCircle2, Award, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About FormBharlo - India\'s Trusted Govt & Sarkari Job Alerts',
  description: 'Learn about FormBharlo, our mission to deliver fast, verified, and direct recruitment notifications across Central & State departments in India.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/40 text-blue-300 px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <Award size={14} className="text-blue-400" />
            About FormBharlo
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Har Sarkari Bharti, Ek Jagah
          </h1>
          <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We simplify the career search landscape by aggregating authentic job openings, entrance tests, hall tickets, answer keys, and official notification PDFs in one unified place.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-300 shadow-xl">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="text-blue-400" size={20} />
              Our Mission
            </h2>
            <p className="text-sm leading-relaxed">
              Every day, thousands of public sector and career notices are scattered across hundreds of municipal, state, and central departmental websites. Our mission at <strong>FormBharlo</strong> is to eliminate information asymmetry by providing clean, clutter-free, and real-time alerts directly linked to official application portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Direct Official Links</h3>
              <p className="text-xs text-slate-400">
                We never charge fees or act as brokers. All application buttons redirect to authenticated govt portals.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Zap size={20} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Instant Notifications</h3>
              <p className="text-xs text-slate-400">
                Real-time updates delivered through our Telegram channel and WhatsApp broadcast groups.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Curated &amp; Verified</h3>
              <p className="text-xs text-slate-400">
                Our editorial team checks notifications against official gazettes before syndicating listings.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              Have questions or partnership inquiries?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors shadow-md"
            >
              Contact Editorial Team
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
