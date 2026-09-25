import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://formbharlo.in',
  'https://www.formbharlo.in',
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : []),
];

export function handleCors(request: NextRequest): {
  isAllowed: boolean;
  headers: HeadersInit;
  response?: NextResponse;
} {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // Same-origin server-side SSR calls or curl/direct internal requests (no origin header)
  if (!origin) {
    // If referer is present and from a different untrusted external domain, block it
    if (referer) {
      try {
        const refUrl = new URL(referer);
        const refOrigin = refUrl.origin;
        if (!ALLOWED_ORIGINS.includes(refOrigin) && !refUrl.hostname.endsWith('formbharlo.in')) {
          return {
            isAllowed: false,
            headers: {},
            response: NextResponse.json(
              { error: 'Forbidden: Unauthorized referer origin' },
              { status: 403 }
            ),
          };
        }
      } catch {
        // Ignore parsing errors for malformed referers
      }
    }

    return {
      isAllowed: true,
      headers: {
        'Vary': 'Origin',
      },
    };
  }

  // Check if browser origin is allowed
  const isOriginAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('formbharlo.in');

  if (!isOriginAllowed) {
    return {
      isAllowed: false,
      headers: {},
      response: NextResponse.json(
        { error: 'Forbidden: Cross-origin requests from this origin are not allowed.' },
        { status: 403 }
      ),
    };
  }

  const corsHeaders: HeadersInit = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };

  return {
    isAllowed: true,
    headers: corsHeaders,
  };
}

export function handleOptionsCors(request: NextRequest): NextResponse {
  const corsResult = handleCors(request);
  if (!corsResult.isAllowed) {
    return NextResponse.json({ error: 'CORS Preflight Forbidden' }, { status: 403 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsResult.headers,
  });
}
