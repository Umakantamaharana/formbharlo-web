import React from 'react';
import { AlertTriangle, ShieldCheck, ExternalLink, FileCheck } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service & Disclaimer | Career135',
  description: 'Terms and conditions of using Career135 recruitment information portal and official disclaimers.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/40 text-blue-300 px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <FileCheck size={14} className="text-blue-400" />
            Terms &amp; Disclaimers
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Last Updated: August 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-300 text-sm leading-relaxed shadow-xl">
          <section className="space-y-3 bg-amber-950/30 border border-amber-800/40 p-5 rounded-2xl">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <AlertTriangle size={18} />
              1. Non-Affiliation Disclaimer (Important)
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              <strong>Career135 is an independent informational and news aggregation portal.</strong> We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with the Government of India, any State Government, Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), or any other recruitment board or PSU.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-400" />
              2. Accuracy of Information
            </h2>
            <p>
              While we make every effort to ensure that the notices, admit cards, eligibility criteria, exam schedules, and results published on Career135 are accurate and up-to-date, candidates are strongly advised to cross-verify all notifications with the original official recruitment gazettes and websites before taking any action or making payments.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ExternalLink size={18} className="text-blue-400" />
              3. External Links
            </h2>
            <p>
              Career135 contains links to external portals for application forms and recruitment documents. We have no control over the content, security, or privacy policies of third-party websites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Intellectual Property</h2>
            <p>
              All trademarks, logos, and recruitment names belong to their respective statutory owners. Use of these names on Career135 is strictly for informational and identification purposes.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">5. Revisions &amp; Inquiries</h2>
            <p>
              Career135 may revise these terms of service at any time without notice. If you have questions regarding these terms, contact us at <a href="mailto:support@career135.com" className="text-blue-400 hover:underline">support@career135.com</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
