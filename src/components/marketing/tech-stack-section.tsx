import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const techStack = [
    { name: "Next.js 15", description: "React framework with App Router & Turbopack", category: "Framework" },
    { name: "TypeScript 5", description: "Type-safe JavaScript with strict mode", category: "Language" },
    { name: "Supabase", description: "PostgreSQL + Auth + Real-time + RLS", category: "Backend" },
    { name: "React Query v5", description: "Data fetching, caching & sync", category: "State" },
    { name: "Inngest", description: "Durable workflows & background jobs", category: "Jobs" },
    { name: "shadcn/ui", description: "Beautiful, accessible components", category: "UI" },
    { name: "Tailwind CSS v4", description: "Utility-first styling", category: "Styling" },
    { name: "Zod", description: "Runtime schema validation", category: "Validation" },
    { name: "React Hook Form", description: "Performant form management", category: "Forms" },
    { name: "Jest + RTL", description: "Testing framework & utilities", category: "Testing" },
    { name: "Vercel", description: "Deployment, analytics & hosting", category: "Deploy" },
    { name: "ESLint", description: "Code quality & formatting", category: "Quality" }
];

export function TechStackSection() {
    return (
        <section id="tech-stack" className="bg-muted/30 py-16 sm:py-20 lg:py-24">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                        Built with modern technologies
                    </h2>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Carefully selected tools that work seamlessly together for maximum developer productivity.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {techStack.map((tech) => (
                        <Card key={tech.name} className="text-center h-full border-border/50">
                            <CardHeader className="p-4">
                                <Badge variant="outline" className="w-fit mx-auto mb-2 text-xs font-medium">
                                    {tech.category}
                                </Badge>
                                <CardTitle className="text-sm font-semibold">{tech.name}</CardTitle>
                                <CardDescription className="text-xs leading-snug">{tech.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
