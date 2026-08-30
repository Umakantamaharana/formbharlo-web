'use client';

import React, { useEffect, useRef } from 'react';

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
  const isProduction = process.env.NODE_ENV === 'production' && Boolean(adClientId);

  useEffect(() => {
    if (isProduction && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense push error:', e);
      }
    }
  }, [isProduction, slot]);

  // Dimension constraints to guarantee Zero Cumulative Layout Shift (CLS)
  const formatStyles = {
    horizontal: 'min-h-[90px] w-full',
    leaderboard: 'min-h-[90px] max-w-[728px] w-full mx-auto',
    vertical: 'min-h-[250px] lg:min-h-[600px] w-full',
    rectangle: 'min-h-[250px] max-w-[300px] w-full mx-auto',
    'in-feed': 'min-h-[140px] w-full',
  };

  return (
    <div
      className={`my-4 flex flex-col items-center justify-center rounded-2xl overflow-hidden bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-2 text-center transition-colors ${formatStyles[format]} ${className}`}
      aria-label="Advertisement"
      data-ad-unit={slot}
    >
      <div className="flex items-center justify-between w-full px-2 mb-1">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
          Advertisement
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer">
          Sponsored
        </span>
      </div>

      {isProduction ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={adClientId}
          data-ad-slot={slot}
          data-ad-format={responsive ? 'auto' : undefined}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      ) : (
        <div className="w-full flex-grow flex flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-300 dark:border-slate-800 p-4 text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Google AdSense Slot Ready</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Slot ID: {slot} &bull; Format: {format}</span>
        </div>
      )}
    </div>
  );
};

export default AdBanner;
