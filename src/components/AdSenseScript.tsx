export default function AdSenseScript() {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-7508464610086212';

  if (!adClientId) {
    return null;
  }

  return (
    <>
      <meta name="google-adsense-account" content={adClientId} />
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
        crossOrigin="anonymous"
      />
    </>
  );
}
