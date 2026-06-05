import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Sparkles, Bot, Star } from "lucide-react";

// Starting-position glyphs for a decorative, non-interactive board.
const BACK_RANK = ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"];

function DecorativeBoard() {
    const squares = [];
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const dark = (rank + file) % 2 === 1;
            let piece = "";
            let pieceClass = "";
            if (rank === 0) {
                piece = BACK_RANK[file];
                pieceClass = "text-neutral-900";
            } else if (rank === 1) {
                piece = "♟";
                pieceClass = "text-neutral-900";
            } else if (rank === 6) {
                piece = "♙";
                pieceClass = "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]";
            } else if (rank === 7) {
                piece = BACK_RANK[file];
                pieceClass = "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45)]";
            }
            squares.push(
                <div
                    key={`${rank}-${file}`}
                    className={`flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl leading-none ${dark ? "bg-neutral-700" : "bg-neutral-200"}`}
                >
                    <span className={pieceClass}>{piece}</span>
                </div>
            );
        }
    }
    return (
        <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 blur-2xl" />
            <div className="grid aspect-square grid-cols-8 overflow-hidden rounded-2xl border border-border shadow-2xl ring-1 ring-black/5">
                {squares}
            </div>
            {/* Floating tutor callout */}
            <div className="absolute -bottom-5 -right-3 sm:-right-6 flex items-center gap-2 rounded-xl border border-border bg-background/95 px-3.5 py-2.5 shadow-lg backdrop-blur">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                </span>
                <div className="text-left">
                    <p className="text-xs font-semibold leading-tight">AI Tutor</p>
                    <p className="text-[11px] leading-tight text-muted-foreground">Try 1. e4 — control the center</p>
                </div>
            </div>
        </div>
    );
}

export function HeroSection() {
    return (
        <section className="container mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                {/* Copy */}
                <div className="space-y-7 text-center lg:text-left">
                    <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-sm font-medium">
                        <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                        Your personal AI chess coach
                    </Badge>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Learn chess the{" "}
                        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                            smart way
                        </span>
                    </h1>

                    <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed lg:mx-0">
                        Play against Stockfish at any level, get move-by-move coaching from an
                        AI tutor, and review every game to see exactly where you improved — and
                        where you slipped.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                        <Button size="lg" asChild className="h-12 min-w-[180px] text-base">
                            <Link href="/signup">
                                Start playing free <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild className="h-12 min-w-[140px] text-base">
                            <Link href="/login">Log in</Link>
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-muted-foreground lg:justify-start">
                        <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="hidden text-muted-foreground/30 sm:block">•</div>
                        <div>Beginner to club level</div>
                    </div>
                </div>

                {/* Visual */}
                <div className="px-2 sm:px-6 lg:px-0">
                    <DecorativeBoard />
                </div>
            </div>
        </section>
    );
}
