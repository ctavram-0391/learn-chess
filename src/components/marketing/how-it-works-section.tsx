import { UserPlus, Swords, LineChart } from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        title: "Create your free account",
        description:
            "Sign up in seconds with email or Google. No credit card, no setup — your progress saves automatically.",
    },
    {
        icon: Swords,
        title: "Play & get coached",
        description:
            "Pick your side and the engine's strength, then play. Ask the tutor for the best move or an explanation any time.",
    },
    {
        icon: LineChart,
        title: "Review & improve",
        description:
            "Revisit every saved game, study the key moments, and watch your play sharpen over time.",
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="container mx-auto max-w-7xl px-4 py-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Start improving in three steps
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                    From first move to post-game review — here&apos;s how it works.
                </p>
            </div>

            <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
                {steps.map((step, i) => (
                    <div key={step.title} className="relative text-center sm:text-left">
                        <div className="mb-5 flex items-center justify-center gap-3 sm:justify-start">
                            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background text-primary shadow-sm">
                                <step.icon className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-semibold text-muted-foreground">
                                Step {i + 1}
                            </span>
                        </div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                        <p className="mt-2 text-muted-foreground leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
