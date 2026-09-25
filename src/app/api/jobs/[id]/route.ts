import { NextRequest, NextResponse } from 'next/server';
import { getJobByIdServer, getRelatedJobsServer } from '@/services/serverJobService';
import { handleCors, handleOptionsCors } from '@/lib/cors';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 mins cache

export async function OPTIONS(request: NextRequest) {
  return handleOptionsCors(request);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const corsResult = handleCors(request);
  if (!corsResult.isAllowed && corsResult.response) {
    return corsResult.response;
  }

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400, headers: corsResult.headers }
      );
    }

    const job = await getJobByIdServer(id);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404, headers: corsResult.headers }
      );
    }

    const relatedJobs = await getRelatedJobsServer(job, 4);

    return NextResponse.json(
      {
        job,
        related_jobs: relatedJobs,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
          ...corsResult.headers,
        },
      }
    );
  } catch (error) {
    console.error(`API Error fetching job:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsResult.headers }
    );
  }
}
