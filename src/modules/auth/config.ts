export interface AuthConfig {
    defaultRedirectPath: string;
    defaultUnauthorizedPath: string;
    protectedPaths: string[];
    loginPath: string;
    signupPath: string;
}

export const authConfig: AuthConfig = {
    defaultRedirectPath: '/dashboard/chess',
    defaultUnauthorizedPath: '/unauthorized',
    protectedPaths: [
        '/dashboard**',
    ],
    loginPath: '/login',
    signupPath: '/signup'
};

// Public paths that don't require authentication
export const publicPaths = [
    '/',
    '/login',
    '/signup'
];