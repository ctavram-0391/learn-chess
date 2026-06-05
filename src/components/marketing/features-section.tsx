import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Lock,
    Database,
    Palette,
    Code2,
    Zap,
    Shield,
    Smartphone,
    Globe,
    Workflow
} from "lucide-react";

const features = [
    {
        icon: Lock,
        title: "Complete Authentication",
        description: "Login, signup, password reset, and session management with Supabase Auth. Ready out of the box."
    },
    {
        icon: Database,
        title: "Database & Real-time",
        description: "PostgreSQL with real-time subscriptions, Row Level Security, and version-controlled migrations."
    },
    {
        icon: Workflow,
        title: "Background Jobs",
        description: "Durable workflows, queues, and scheduled tasks with Inngest. Automatic retries and step functions."
    },
    {
        icon: Code2,
        title: "End-to-End Type Safety",
        description: "TypeScript strict mode throughout, Zod validation, and fully typed API responses."
    },
    {
        icon: Zap,
        title: "Performance Optimized",
        description: "React Query caching, optimistic updates, Turbopack dev server, and automatic code splitting."
    },
    {
        icon: Palette,
        title: "Beautiful UI Components",
        description: "40+ accessible components from shadcn/ui built with Radix UI and Tailwind CSS v4."
    },
    {
        icon: Shield,
        title: "Production Ready",
        description: "Vercel Analytics, error boundaries, comprehensive testing setup, and security best practices."
    },
    {
        icon: Smartphone,
        title: "Mobile First Design",
        description: "Fully responsive design that works beautifully on all devices from mobile to desktop."
    },
    {
        icon: Globe,
        title: "SEO Optimized",
        description: "Dynamic metadata, automatic sitemaps, Open Graph images, and Core Web Vitals optimization."
    }
];

export function FeaturesSection() {
    return (
        <section id="features" className="container mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:py-24">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                    Everything you need to launch
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Skip months of setup and configuration. Focus on building your unique features while we handle the foundation.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {features.map((feature) => {
                    const IconComponent = feature.icon;
                    return (
                        <Card key={feature.title} className="h-full border-border/50">
                            <CardHeader className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                        <IconComponent className="h-4 w-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                                </div>
                                <CardDescription className="text-sm leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}
