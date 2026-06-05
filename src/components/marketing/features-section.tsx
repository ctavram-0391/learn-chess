import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Cpu, History, Compass, Gauge, MessageSquare } from "lucide-react";

const features = [
    {
        icon: Bot,
        title: "AI chess tutor",
        description:
            "Ask for the best move, get a position analyzed, or see the idea behind any move — explained in plain language as you play.",
    },
    {
        icon: Cpu,
        title: "Play Stockfish",
        description:
            "Face one of the strongest engines in the world. Dial the strength up or down so every game is a fair fight.",
    },
    {
        icon: Compass,
        title: "On-board guidance",
        description:
            "The tutor draws arrows right on the board to show threats, plans, and the move it would play in your shoes.",
    },
    {
        icon: History,
        title: "Game history & review",
        description:
            "Every game is saved. Step back through your moves to find the turning points and learn from your mistakes.",
    },
    {
        icon: Gauge,
        title: "Pick your difficulty",
        description:
            "Choose your side and the engine's level before each game, from gentle practice to a serious challenge.",
    },
    {
        icon: MessageSquare,
        title: "Move-by-move tracking",
        description:
            "A live move tracker keeps the full game in view so you always know where you are and what just happened.",
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="border-t border-border bg-muted/30">
            <div className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need to get better
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                        A practice partner, a coach, and a review tool in one place — built to
                        turn every game into a lesson.
                    </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card key={feature.title} className="border-border/60 transition-colors hover:border-border">
                            <CardHeader>
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                    <feature.icon className="h-5 w-5" />
                                </span>
                                <CardTitle className="mt-4 text-lg">{feature.title}</CardTitle>
                                <CardDescription className="leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
