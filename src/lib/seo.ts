import { Metadata } from 'next';
import { env } from './env';

/**
 * Site configuration - centralized SEO settings
 */
export const siteConfig = {
    name: env.NEXT_PUBLIC_SITE_NAME || 'Next Launch TS',
    description: env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Build something awesome 💪 - The ultimate Next.js starter for modern SaaS applications',
    url: env.NEXT_PUBLIC_SITE_URL,
    ogImage: '/og-image.png',
    twitterCreator: '@nextlaunchts',
    keywords: ['Next.js', 'React', 'TypeScript', 'SaaS', 'Starter', 'Supabase', 'Tailwind CSS'],
};

/**
 * Default metadata for the root layout
 * This sets up the base metadata that all pages inherit
 */
export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
        images: [
            {
                url: siteConfig.ogImage,
                width: 1200,
                height: 630,
                alt: siteConfig.name,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        images: [siteConfig.ogImage],
        creator: siteConfig.twitterCreator,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

/**
 * Generate metadata for individual pages
 * This extends the default metadata with page-specific information
 */
export function generateMetadata({
    title,
    description,
    image,
    noIndex = false,
    ...rest
}: {
    title?: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
} & Partial<Metadata> = {}): Metadata {
    return {
        title,
        description: description || siteConfig.description,
        openGraph: {
            title,
            description: description || siteConfig.description,
            images: image ? [{ url: image }] : undefined,
        },
        twitter: {
            title,
            description: description || siteConfig.description,
            images: image ? [image] : undefined,
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
        },
        ...rest,
    };
}

/**
 * Common page metadata configurations
 * Use these for consistent SEO across common page types
 */
export const pageMetadata = {
    dashboard: generateMetadata({
        title: 'Dashboard',
        description: 'Manage your account and access all features',
        noIndex: true, // Don't index authenticated pages
    }),

    login: generateMetadata({
        title: 'Sign In',
        description: 'Sign in to your account to access all features',
    }),

    signup: generateMetadata({
        title: 'Sign Up',
        description: 'Create your account and start building something awesome',
    }),
} as const;
