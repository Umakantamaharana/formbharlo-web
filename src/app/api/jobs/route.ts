import { NextResponse } from 'next/server';
import { fetchJobsServer } from '@/services/serverJobService';

export const dynamic = 'force-dynamic';
export const revalidate = 1800; // 30 minutes cache

export async function GET() {
  try {
    const jobs = await fetchJobsServer();
    return NextResponse.json(jobs, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('API Error reading jobs:', error);
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 });
  }
}
