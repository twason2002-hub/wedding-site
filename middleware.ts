import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/invitation')) {
    const url = new URL(request.nextUrl.pathname.replace('/invitation', '/dynamic-invitation'), request.url);
    url.search = request.nextUrl.search;
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: '/invitation/:path*'
};