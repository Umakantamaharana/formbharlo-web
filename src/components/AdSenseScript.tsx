'use client';

import Script from 'next/script';

export default function AdSenseScript() {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!adClientId) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
