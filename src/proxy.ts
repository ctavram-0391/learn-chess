
import type { NextRequest } from 'next/server';
import { authMiddleware } from '@/modules/auth/middleware';

export async function proxy(request: NextRequest) {
    return authMiddleware(request);
}

// Define protected paths statically for proxy matcher
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes
         */
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
};
