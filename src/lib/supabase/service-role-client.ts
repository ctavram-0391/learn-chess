import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the service role key.
 * This client bypasses Row Level Security — use with caution.
 * Only use in server-side contexts (API routes, Inngest functions).
 */
export const createServiceRoleClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error(
            'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
            'These are required for service role operations.'
        );
    }

    return createClient(url, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};
