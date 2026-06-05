"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, BookOpen, Copy, Check, Terminal } from "lucide-react";
import { useState } from "react";

export function CTASection() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const commands = `git clone https://github.com/zphelps/next-launch-ts.git my-app
cd my-app && npm install
npm run db:start && npm run dev`;
        navigator.clipboard.writeText(commands);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="get-started" className="container mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:py-24">
            <div className="text-center space-y-8 sm:space-y-10">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                    Ready to launch your SaaS?
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Clone the repository and start building in minutes.
                    Everything is configured and ready to go.
                </p>

                {/* Quick start commands */}
                <div className="bg-muted/40 border border-border/50 rounded-xl p-5 sm:p-6 max-w-2xl mx-auto">
                    <div className="text-left">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                <Terminal className="h-4 w-4" />
                                Quick Start
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-xs"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                        <div className="bg-background border border-border rounded-lg p-4 font-mono text-sm space-y-2 overflow-x-auto">
                            <div className="flex">
                                <span className="text-muted-foreground select-none mr-3">$</span>
                                <span>git clone https://github.com/zphelps/next-launch-ts.git my-app</span>
                            </div>
                            <div className="flex">
                                <span className="text-muted-foreground select-none mr-3">$</span>
                                <span>cd my-app && npm install</span>
                            </div>
                            <div className="flex">
                                <span className="text-muted-foreground select-none mr-3">$</span>
                                <span>npm run db:start && npm run dev</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button size="lg" asChild className="w-full sm:w-auto min-w-[180px] h-12 text-base">
                        <Link href="https://github.com/zphelps/next-launch-ts" target="_blank">
                            <Github className="mr-2 h-4 w-4" />
                            View on GitHub
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild className="w-full sm:w-auto min-w-[180px] h-12 text-base">
                        <Link href="https://github.com/zphelps/next-launch-ts#readme" target="_blank">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Documentation
                        </Link>
                    </Button>
                </div>

                {/* Additional info */}
                <div className="pt-4 sm:pt-6">
                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <span className="text-green-500">✓</span>
                            Local Supabase included
                        </div>
                        <div className="text-muted-foreground/30">•</div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-green-500">✓</span>
                            Deploy in minutes
                        </div>
                        <div className="text-muted-foreground/30">•</div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-green-500">✓</span>
                            Free forever
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
