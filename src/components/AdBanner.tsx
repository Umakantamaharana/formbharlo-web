'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Send, MessageCircle, Crop, Sparkles, ShieldCheck } from 'lucide-react';

interface AdBannerProps {
  className?: string;
  slot?: string;
  format?: 'horizontal' | 'leaderboard' | 'vertical' | 'rectangle' | 'in-feed';
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const AdBanner: React.FC<AdBannerProps> = ({
  className = '',
  slot = '1234567890',
  format = 'horizontal',
  responsive = true,
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isAdSenseActive = Boolean(adClientId && adClientId.startsWith('ca-pub-'));

  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/formbharloin';
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://whatsapp.com/channel/formbharlo';

  useEffect(() => {
    if (isAdSenseActive && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense push error:', e);
      }
    }
  }, [isAdSenseActive, slot]);

  // If AdSense is active with valid Client ID, render real ad code
  if (isAdSenseActive) {
    const formatStyles = {
      horizontal: 'min-h-[90px] w-full',
      leaderboard: 'min-h-[90px] max-w-[728px] w-full mx-auto',
      vertical: 'min-h-[250px] lg:min-h-[600px] w-full',
      rectangle: 'min-h-[250px] max-w-[300px] w-full mx-auto',
      'in-feed': 'min-h-[120px] w-full',
    };

    return (
      <div
        className={`my-3 flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-2 text-center transition-colors ${formatStyles[format]} ${className}`}
        aria-label="Advertisement"
      >
        <div className="flex items-center justify-between w-full px-2 mb-1">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
            Advertisement
          </span>
          <span className="text-[10px] text-slate-400">Sponsored</span>
        </div>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={adClientId}
          data-ad-slot={slot}
          data-ad-format={responsive ? 'auto' : undefined}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    );
  }

  // Pre-approval fallback: Render clean, helpful community & utility promos instead of "AdSense Ready" placeholder
  if (format === 'leaderboard' || format === 'horizontal') {
    return (
      <div className={`my-3 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/50 border border-blue-800/30 p-3.5 sm:p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs ${className}`}>
        <div className="space-y-0.5">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-400 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>Official Community Broadcast</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white">
            Get instant alerts on Telegram &amp; WhatsApp before application deadlines close!
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#229ED9] hover:bg-[#1E88E5] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all"
          >
            <Send size={13} />
            <span>Telegram</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BA5C] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all"
          >
            <MessageCircle size={13} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  if (format === 'vertical') {
    return (
      <div className={`rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 p-5 text-center space-y-4 shadow-xs ${className}`}>
        <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
          <Crop size={24} />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
            Free Online Utility
          </span>
          <h4 className="text-sm font-black text-white">
            Photo &amp; Signature Resizer
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Resize and compress your exam photos to exact 20–50 KB rules with 100% privacy.
          </p>
        </div>
        <Link
          href="/tools/image-resizer"
          className="inline-flex items-center justify-center w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all"
        >
          Open Photo Resizer &rarr;
        </Link>
      </div>
    );
  }

  // For in-feed or rectangle, keep completely invisible if no ads
  return null;
};

export default AdBanner;
