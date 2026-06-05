import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const perks = ["Free to start", "No credit card", "Play in seconds"];

export function CTASection() {
    return (
        <section id="get-started" className="border-t border-border bg-muted/30">
            <div className="container mx-auto max-w-7xl px-4 py-20 sm:py-24">
                <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-background px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Your next game is a lesson
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground leading-relaxed">
                        Create a free account and start learning with a coach that&apos;s always
                        ready to play — and explain.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                        <Button size="lg" asChild className="h-12 min-w-[200px] text-base">
                            <Link href="/signup">
                                Create free account <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild className="h-12 min-w-[140px] text-base">
                            <Link href="/login">Log in</Link>
                        </Button>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        {perks.map((perk) => (
                            <div key={perk} className="flex items-center gap-1.5">
                                <Check className="h-4 w-4 text-green-500" />
                                {perk}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
