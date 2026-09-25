import { NextRequest, NextResponse } from 'next/server';
import { fetchJobsServer } from '@/services/serverJobService';
import { Job } from '@/types';
import { handleCors, handleOptionsCors } from '@/lib/cors';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 minutes cache

export async function OPTIONS(request: NextRequest) {
  return handleOptionsCors(request);
}

export async function GET(request: NextRequest) {
  const corsResult = handleCors(request);
  if (!corsResult.isAllowed && corsResult.response) {
    return corsResult.response;
  }
  try {
    const jobs = await fetchJobsServer();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search')?.toLowerCase().trim();
    const category = searchParams.get('category')?.trim();
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const rawFormat = searchParams.get('raw'); // if raw=true, returns raw array

    let filtered: Job[] = jobs;

    // Filter by Category
    if (category && category !== 'All') {
      filtered = filtered.filter(
        (j) => j.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by Search query (title, organization, qualification, content, tags)
    if (search) {
      filtered = filtered.filter((j) => {
        const title = j.website_content?.title?.toLowerCase() || '';
        const org = j.organization?.toLowerCase() || '';
        const qual = j.qualification?.toLowerCase() || '';
        const summary = j.website_content?.summary?.toLowerCase() || '';
        const tags = (j.tags || []).join(' ').toLowerCase();

        return (
          title.includes(search) ||
          org.includes(search) ||
          qual.includes(search) ||
          summary.includes(search) ||
          tags.includes(search)
        );
      });
    }

    // If no pagination requested and raw=true or legacy call, return full array
    if (!pageParam && !limitParam && (!search && !category || rawFormat === 'true')) {
      return NextResponse.json(filtered, {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
          ...corsResult.headers,
        },
      });
    }

    // Pagination
    const page = Math.max(1, parseInt(pageParam || '1', 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(limitParam || '20', 10) || 20));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedJobs = filtered.slice(offset, offset + limit);

    // Available categories with counts
    const categoryCounts: Record<string, number> = {};
    jobs.forEach((j) => {
      const cat = j.category || 'Government';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    return NextResponse.json(
      {
        jobs: paginatedJobs,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        category_counts: categoryCounts,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
          ...corsResult.headers,
        },
      }
    );
  } catch (error) {
    console.error('API Error reading jobs:', error);
    return NextResponse.json(
      { error: 'Failed to load jobs' },
      { status: 500, headers: corsResult.headers }
    );
  }
}
