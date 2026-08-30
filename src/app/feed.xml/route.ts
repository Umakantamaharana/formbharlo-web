import { NextResponse } from 'next/server';
import { fetchJobsServer } from '@/services/serverJobService';

export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://career135.com';
  const jobs = await fetchJobsServer();

  const itemsXml = jobs
    .slice(0, 50)
    .map((job) => {
      const title = escapeXml(job.website_content?.title || 'Job Opportunity');
      const link = `${siteUrl}/job/${job.id}`;
      const description = escapeXml(
        job.website_content?.summary ||
        job.website_content?.markdown_content?.substring(0, 300) ||
        'Check details and apply online.'
      );
      const pubDate = job.date ? new Date(job.date).toUTCString() : new Date().toUTCString();
      const category = escapeXml(job.category || 'Government Jobs');

      return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>
      <category>${category}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Career135 - Latest Govt Jobs, Exam Dates &amp; Results</title>
    <link>${siteUrl}</link>
    <description>Instant job updates, govt notifications, admit cards, and results in India.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
    },
  });
}
