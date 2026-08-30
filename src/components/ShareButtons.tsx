'use client';

import React, { useState } from 'react';
import { Share2, MessageCircle, Send, Check, Copy, Twitter } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const getActiveUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return url;
  };

  const handleShare = async () => {
    const activeUrl = getActiveUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: activeUrl,
        });
      } catch {
        // Ignored if user cancels share dialog
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const activeUrl = getActiveUrl();
    navigator.clipboard.writeText(`${title} - ${activeUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const activeUrl = getActiveUrl();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔔 ${title}\n\nApply here: ${activeUrl}`)}`, '_blank');
  };

  const shareTelegram = () => {
    const activeUrl = getActiveUrl();
    window.open(`https://t.me/share/url?url=${encodeURIComponent(activeUrl)}&text=${encodeURIComponent(`🔔 ${title}`)}`, '_blank');
  };

  const shareTwitter = () => {
    const activeUrl = getActiveUrl();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔔 ${title}`)}&url=${encodeURIComponent(activeUrl)}`, '_blank');
  };

  return (
    <div className="flex gap-2.5 flex-wrap items-center">
      <button
        onClick={shareWhatsApp}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
      >
        <MessageCircle size={15} /> WhatsApp
      </button>

      <button
        onClick={shareTelegram}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors shadow-sm"
      >
        <Send size={15} /> Telegram
      </button>

      <button
        onClick={shareTwitter}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
      >
        <Twitter size={15} /> X / Twitter
      </button>

      <button
        onClick={copyToClipboard}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
        title="Copy URL"
      >
        {copied ? (
          <>
            <Check size={15} className="text-emerald-400" />
            <span className="text-emerald-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy size={15} />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
        aria-label="Native Share"
        title="More Share Options"
      >
        <Share2 size={16} />
      </button>
    </div>
  );
};

export default ShareButtons;
