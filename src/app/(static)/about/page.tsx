import React from 'react';
import { Target, Zap, CheckCircle2, Award, ShieldCheck, UserCheck, BookOpen, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About FormBharlo - Editorial Standards, Mission & Team | FormBharlo.in',
  description:
    'Learn about FormBharlo, our founder Umakanta Maharana, our rigorous fact-checking methodology against official government gazettes, and our mission to simplify Indian public sector recruitment.',
  alternates: {
    canonical: 'https://formbharlo.in/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <Award size={14} className="text-blue-600 dark:text-blue-400" />
            About FormBharlo &bull; Editorial Mission &amp; Standards
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Har Sarkari Bharti, Ek Jagah
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            FormBharlo is an independent recruitment aggregation and career research platform designed to deliver authenticated, direct, and clutter-free public sector job alerts across India.
          </p>
        </div>

        {/* Founder & Lead Analyst Card (E-E-A-T) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <UserCheck size={16} />
            Editorial Leadership &amp; Authorship
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 text-white flex items-center justify-center font-black text-3xl shadow-lg shrink-0">
              U
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Umakanta Maharana
                </h2>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Verified Researcher
                </span>
              </div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Founder, Lead Recruitment Analyst &amp; Software Engineer
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                With a strong technical and public policy analysis background, Umakanta founded FormBharlo to solve the rampant issues of misleading redirect loops, pop-up ad clutter, and predatory fake job alerts that victimize young Indian job seekers. He actively researches Staff Selection Commission (SSC), UPSC, Railway Recruitment Boards (RRB), and State PSC frameworks.
              </p>
            </div>
          </div>
        </div>

        {/* Our Editorial & Fact-Checking Methodology */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-500" size={22} />
              Our 4-Point Verification Methodology
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every job alert, admit card notification, and career guide published on FormBharlo passes through a rigorous fact-checking protocol:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                1. Official Gazette &amp; NIC Domain Verification
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We only source and link to verified government domains (\`.gov.in\`, \`.nic.in\`, \`.ac.in\`, or official gazette notifications).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                2. Direct, Unadulterated Application Links
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We never use deceptive intermediate affiliate link shorteners. Our "Apply Online" and "Official Notification" buttons point directly to the authenticated portal.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                3. Zero User Fee Guarantee
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                FormBharlo is 100% free for all students. We never charge registration fees, interview coaching fees, or sell application forms.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <span className="text-xs font-black text-slate-900 dark:text-white block">
                4. Client-Side Document Privacy
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our Photo &amp; Signature Resizer tool operates 100% locally in your device's browser using HTML5 Canvas. No candidate photos or signatures are ever uploaded to our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Government Non-Affiliation */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-3xl p-6 sm:p-8 space-y-3">
          <h3 className="text-sm font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">
            Important Legal Disclaimer &amp; Non-Affiliation Notice
          </h3>
          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
            <strong>FormBharlo (formbharlo.in)</strong> is an independent educational news and career information aggregation portal operated privately. FormBharlo is <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with the Government of India</strong>, any State Government, Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Board (RRB), or any other municipal or statutory recruitment body.
          </p>
          <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
            All government trademarks, logos, and recruitment names belong to their respective statutory owners. For official confirmations, always verify with the corresponding official government gazette.
          </p>
        </div>

        {/* Contact & Transparency */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Questions, Corrections, or Grievances?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Our editorial team responds to factual correction requests within 24 hours.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 px-6 rounded-2xl shadow-md transition-all shrink-0"
          >
            <Mail size={14} /> Contact Editorial Team
          </Link>
        </div>

      </div>
    </div>
  );
}
