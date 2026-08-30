import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Career135',
  description: 'Career135 Privacy Policy, Google AdSense cookie consent, data practices, and user rights.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/40 text-blue-300 px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <ShieldCheck size={14} className="text-emerald-400" />
            Transparency &amp; Privacy
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Last Updated: August 2026 &bull; Compliant with Google AdSense Policies
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-300 text-sm leading-relaxed shadow-xl">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock size={18} className="text-blue-400" />
              1. Overview
            </h2>
            <p>
              At <strong>Career135</strong> (accessible from <code className="text-blue-300">https://career135.com</code>), protecting the privacy of our visitors is of utmost priority. This document details the types of information collected and recorded by Career135 and how we utilize it.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye size={18} className="text-blue-400" />
              2. Cookies and Web Beacons
            </h2>
            <p>
              Like most professional portals, Career135 uses standard &quot;cookies&quot;. These cookies store visitor preferences, user sessions, and pages accessed to personalize content and improve site performance.
            </p>
          </section>

          <section className="space-y-3 bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-amber-400" />
              3. Google DoubleClick DART Cookie &amp; AdSense
            </h2>
            <p>
              Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.career135.com and other sites on the internet.
            </p>
            <p className="text-xs text-slate-400">
              Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://policies.google.com/technologies/ads</a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Log Files</h2>
            <p>
              Career135 follows standard procedure of using log files. These files log visitors when they visit websites. The information collected includes IP addresses, browser types, Internet Service Providers (ISP), date/time stamps, referring/exit pages, and number of clicks. These are not linked to any personally identifiable information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Third-Party Privacy Policies</h2>
            <p>
              Career135&apos;s Privacy Policy does not apply to other advertisers or external employment websites linked on our portal. We strongly advise consulting the respective Privacy Policies of these third-party ad servers and government portals for more detailed information.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">6. Consent &amp; Contact</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you have additional questions, please reach us at <a href="mailto:support@career135.com" className="text-blue-400 hover:underline">support@career135.com</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
