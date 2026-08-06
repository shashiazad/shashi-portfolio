import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware: Basic Auth guard for /referrals/admin and /api/admin/* routes.
 * Uses AUTH_ADMIN_USER and AUTH_ADMIN_PASS environment variables.
 */
function isLocalRequest(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0];
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function middleware(req: NextRequest) {
  const user = process.env.AUTH_ADMIN_USER?.trim();
  const pass = process.env.AUTH_ADMIN_PASS?.trim();

  if (!user || !pass) {
    if (process.env.NODE_ENV !== 'production' || isLocalRequest(req)) {
      return NextResponse.next();
    }

    return new NextResponse('Admin credentials not configured', { status: 503 });
  }

  const authHeader = req.headers.get('authorization');

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
      const [u, p] = decoded.split(':');
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
  }

  // Prompt for Basic Auth
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  });
}

export const config = {
  matcher: ['/admin', '/api/admin/:path*', '/api/ai/:path*'],
};
