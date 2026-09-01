import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-0000000000000000';
  const cleanPubId = publisherId.replace(/^ca-/, '');

  // Standard IAB ads.txt format for Google AdSense & direct authorized sellers
  const adsTxtContent = `# FormBharlo Authorized Digital Sellers (ads.txt)
google.com, ${cleanPubId}, DIRECT, f08c47fec0942fa0
`;

  return new NextResponse(adsTxtContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
