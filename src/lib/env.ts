import { z } from 'zod';

/**
 * Environment variables schema with validation
 * This ensures all required environment variables are present and valid
 */
const envSchema = z.object({
    // Required - Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),

    // Required - Site Configuration
    NEXT_PUBLIC_SITE_URL: z.string().url('Invalid site URL'),

    // Optional - SEO
    NEXT_PUBLIC_SITE_NAME: z.string().optional(),
    NEXT_PUBLIC_SITE_DESCRIPTION: z.string().optional(),

    // Server-only - Jarvis AI (optional at build time, required at runtime for AI features)
    ANTHROPIC_API_KEY: z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

    // Node Environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Validated environment variables
 * This will throw an error if any required variables are missing or invalid
 */
function validateEnv() {
    try {
        return envSchema.parse(process.env);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.errors
                .map((err) => `${err.path.join('.')}: ${err.message}`)
                .join('\n');

            throw new Error(
                `❌ Invalid environment variables:\n${missingVars}\n\n` +
                `Please check your .env.local file and ensure all required variables are set.\n` +
                `See .env.example for reference.`
            );
        }
        throw error;
    }
}

export const env = validateEnv();

/**
 * Type-safe environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Helper functions for checking feature availability
 */
export const features = {
    // Vercel Analytics work automatically when deployed to Vercel
    analytics: true,
} as const;

/**
 * Development helpers
 */
export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
