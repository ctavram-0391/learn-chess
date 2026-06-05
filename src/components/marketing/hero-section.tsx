import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Github, Star, Zap, Shield } from "lucide-react";

export function HeroSection() {
    return (
        <section className="container mx-auto max-w-7xl px-4 py-20 sm:py-28 lg:py-36 text-center">
            <div className="mx-auto max-w-4xl space-y-8 sm:space-y-10">
                <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium">
                    <Zap className="mr-1.5 h-3.5 w-3.5" />
                    Production Ready Starter
                </Badge>

                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                    Ship your SaaS in{" "}
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        days, not months
                    </span>
                </h1>

                <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                    A production-ready SaaS starter with Next.js 15, Supabase, React Query, Inngest, and shadcn/ui.
                    Skip the boilerplate and focus on building your product.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button size="lg" asChild className="w-full sm:w-auto min-w-[180px] h-12 text-base">
                        <Link href="#get-started">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="w-full sm:w-auto min-w-[180px] h-12 text-base">
                        <Link href="https://github.com/zphelps/next-launch-ts" target="_blank">
                            <Github className="mr-2 h-4 w-4" />
                            View on GitHub
                        </Link>
                    </Button>
                </div>

                {/* Tech logos */}
                <div className="pt-8 sm:pt-12">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 uppercase tracking-wider font-medium">Built with modern technologies</p>
                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 lg:gap-10">
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-muted-foreground/70 hover:text-foreground transition-colors">Next.js 15</div>
                        <div className="text-muted-foreground/30">|</div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-muted-foreground/70 hover:text-foreground transition-colors">TypeScript</div>
                        <div className="text-muted-foreground/30">|</div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-muted-foreground/70 hover:text-foreground transition-colors">Supabase</div>
                        <div className="text-muted-foreground/30">|</div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-muted-foreground/70 hover:text-foreground transition-colors">Inngest</div>
                        <div className="text-muted-foreground/30">|</div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-muted-foreground/70 hover:text-foreground transition-colors">Tailwind</div>
                    </div>
                </div>

                {/* Stats */}
                <div className="pt-6 sm:pt-8">
                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>Open Source</span>
                        </div>
                        <div className="text-muted-foreground/30">•</div>
                        <div className="flex items-center gap-1.5">
                            <Shield className="h-4 w-4 text-green-500" />
                            <span>MIT License</span>
                        </div>
                        <div className="text-muted-foreground/30">•</div>
                        <div>Free Forever</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
