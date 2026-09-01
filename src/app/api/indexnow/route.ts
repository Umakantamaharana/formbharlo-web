import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'formbharloindexnowkey2026';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://formbharlo.in';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const urlList: string[] = body.urlList || [];

    if (!urlList.length) {
      return NextResponse.json({ error: 'urlList array is required' }, { status: 400 });
    }

    const host = new URL(SITE_URL).host;

    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList,
    };

    // Push to IndexNow API endpoint (Bing, Yahoo, Yandex, Seznam)
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: true,
      status: response.status,
      submittedCount: urlList.length,
      host,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit IndexNow ping', details: String(error) },
      { status: 500 }
    );
  }
}
