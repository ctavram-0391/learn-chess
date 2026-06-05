import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.url;

    // Static routes that should be included in sitemap
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        // Add more static routes as needed
        // {
        //   url: `${baseUrl}/pricing`,
        //   lastModified: new Date(),
        //   changeFrequency: 'weekly' as const,
        //   priority: 0.9,
        // },
        // {
        //   url: `${baseUrl}/blog`,
        //   lastModified: new Date(),
        //   changeFrequency: 'daily' as const,
        //   priority: 0.7,
        // },
    ];

    // TODO: Add dynamic routes here
    // For example, if you have blog posts or other dynamic content:
    // const dynamicRoutes = await getDynamicRoutes();

    return [
        ...staticRoutes,
        // ...dynamicRoutes,
    ];
}

// Example function for dynamic routes (uncomment and modify as needed)
// async function getDynamicRoutes() {
//   try {
//     // Fetch your dynamic content (e.g., blog posts, products, etc.)
//     // const posts = await getBlogPosts();
//     
//     // return posts.map((post) => ({
//     //   url: `${env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
//     //   lastModified: new Date(post.updatedAt),
//     //   changeFrequency: 'weekly' as const,
//     //   priority: 0.6,
//     // }));
//   } catch (error) {
//     console.error('Error generating dynamic sitemap routes:', error);
//     return [];
//   }
// }
