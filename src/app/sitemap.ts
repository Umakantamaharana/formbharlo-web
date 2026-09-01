import { MetadataRoute } from 'next';
import { fetchJobsServer } from '@/services/serverJobService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://formbharlo.in';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  try {
    const jobs = await fetchJobsServer();
    const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${siteUrl}/job/${job.id}`,
      lastModified: job.date ? new Date(job.date) : new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

    return [...staticPages, ...jobPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
