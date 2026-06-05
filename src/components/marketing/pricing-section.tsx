import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

const features = [
    "Complete source code access",
    "Next.js 15 with App Router",
    "Supabase Auth & Database",
    "Inngest background jobs",
    "40+ shadcn/ui components",
    "React Query data layer",
    "TypeScript strict mode",
    "Testing setup included",
    "Production deployment guide",
    "MIT License - use anywhere"
];

export function PricingSection() {
    return (
        <section id="pricing" className="bg-muted/30 py-20 sm:py-28 lg:py-32">
            <div className="container mx-auto max-w-screen-2xl px-4">
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
                        Start building for free
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Everything you need to launch your SaaS. No hidden fees, no subscriptions, no vendor lock-in.
                    </p>
                </div>

                <div className="max-w-md mx-auto">
                    <Card className="relative border-primary/50 shadow-lg">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-primary text-primary-foreground px-4 py-1">
                                <Sparkles className="h-3 w-3 mr-1.5" />
                                Open Source
                            </Badge>
                        </div>
                        <CardHeader className="text-center pb-4 pt-10 sm:pt-12">
                            <CardTitle className="text-2xl sm:text-3xl font-bold">Free Forever</CardTitle>
                            <div className="flex items-baseline justify-center gap-1 mt-2">
                                <span className="text-5xl sm:text-6xl font-bold">$0</span>
                            </div>
                            <CardDescription className="text-base mt-2">Clone, customize, and ship</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2">
                            <ul className="space-y-3">
                                {features.map((feature) => (
                                    <li key={feature} className="flex items-center">
                                        <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                                            <Check className="h-3 w-3 text-green-600" />
                                        </div>
                                        <span className="text-sm sm:text-base">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4">
                                <Button className="w-full h-12 text-base" size="lg" asChild>
                                    <Link href="#get-started">
                                        Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Value proposition */}
                <div className="text-center mt-10 sm:mt-14">
                    <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                        Save weeks of development time. Focus on building your unique features 
                        while we handle the boilerplate.
                    </p>
                </div>
            </div>
        </section>
    );
}
