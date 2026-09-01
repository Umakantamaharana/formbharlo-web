import React from 'react';
import { Mail, MessageSquare, Send, Clock } from 'lucide-react';
import SocialLinks from '@/components/SocialLinks';

export const metadata = {
  title: 'Contact Us | FormBharlo Support & Queries',
  description: 'Reach out to the FormBharlo team for feedback, correction requests, advertisements, or job alert inquiries.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700/40 text-blue-300 px-3.5 py-1 rounded-full text-xs font-semibold mb-4">
            <MessageSquare size={14} className="text-blue-400" />
            Support &amp; Inquiries
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            We’d Love to Hear From You
          </h1>
          <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have a question about a job post, found a broken link, or want to partner with FormBharlo? Our support team is here to assist.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Mail className="text-blue-400" size={20} />
              Email &amp; Direct Support
            </h2>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
                <Mail className="text-blue-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Official Contact Email</span>
                  <a href="mailto:support@formbharlo.in" className="text-white font-bold hover:text-blue-400 transition-colors">
                    support@formbharlo.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/60 border border-slate-700/60 p-4 rounded-2xl">
                <Clock className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Response SLA</span>
                  <span className="text-white font-bold">Within 24-48 Business Hours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Send className="text-sky-400" size={20} />
              Community &amp; Social
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect with our moderators directly on our official Telegram channel and social media handles for instant broadcast notifications.
            </p>
            <div className="pt-2">
              <SocialLinks />
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200">
              💡 <strong>Job Notification Queries:</strong> Please include the Notification ID or URL when reporting broken links.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
