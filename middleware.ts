import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected paths
  const protectedPaths = ['/profile', '/dashboard', '/admin'];
  const isPathProtected = protectedPaths.some((protectedPath) =>
    path.startsWith(protectedPath)
  );

  // Define admin-only paths
  const isAdminPath = path.startsWith('/admin');

  // Check if the path is protected
  if (isPathProtected) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // If no token, redirect to login
      if (!token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(path));
        return NextResponse.redirect(url);
      }

      // For admin paths, check isAdmin
      if (isAdminPath && !token.isAdmin) {
        const url = new URL('/dashboard', request.url);
        return NextResponse.redirect(url);
      }
    } catch (error: any) {
      console.error(`Middleware error: ${error?.message}`);
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(path));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};