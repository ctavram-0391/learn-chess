import { NextRequest, NextResponse } from 'next/server';
import { authConfig, publicPaths } from './config';
import { createSupabaseClient } from '@/lib/supabase/client';
import { matchPath } from '@/lib/utils';

export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname;

    // Skip middleware for public paths, non-protected paths and static assets
    if (
        matchPath(path, publicPaths) ||
        !matchPath(path, authConfig.protectedPaths) ||
        path.startsWith('/_next') ||
        path.startsWith('/api') ||
        path.includes('.')
    ) {
        console.log('Skipping middleware for public/non-protected paths and static assets');
        return NextResponse.next();
    }

    const supabase = await createSupabaseClient();

    // Create a response object that we'll modify and return
    const response = NextResponse.next({
        request,
    });

    // IMPORTANT: Get the user session - this is required for the cookie handling to work properly
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If no user and path is protected, redirect to login
    if (!user && matchPath(path, authConfig.protectedPaths) && !matchPath(path, [authConfig.loginPath, authConfig.signupPath])) {
        console.log('No authenticated user, redirecting to login');
        const redirectUrl = new URL(authConfig.loginPath, request.url);
        redirectUrl.searchParams.set('returnTo', path);
        return NextResponse.redirect(redirectUrl);
    }

    if (user && matchPath(path, [authConfig.loginPath, authConfig.signupPath])) {
        console.log('User is authenticated, redirecting to default path');
        const urlRedirectPath = request.nextUrl.searchParams.get('returnTo');
        if (urlRedirectPath) {
            const redirectUrl = new URL(urlRedirectPath, request.url);
            return NextResponse.redirect(redirectUrl);
        }
        else {
            const redirectUrl = new URL(authConfig.defaultRedirectPath, request.url);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // User is authenticated, continue
    return response;
}

export { authConfig };