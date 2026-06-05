import { createBrowserClient, createServerClient } from '@supabase/ssr';

// Client-side Supabase client
export const createBrowserSupabaseClient = () => {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};

// Server-side Supabase client
export const createServerSupabaseClient = async () => {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored since I have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
};

// Unified function that works in both environments
export const createSupabaseClient = async () => {
    if (typeof window === 'undefined') {
        return createServerSupabaseClient();
    }

    return createBrowserSupabaseClient();
};
