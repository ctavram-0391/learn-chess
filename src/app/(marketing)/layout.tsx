import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Crown, Menu } from "lucide-react";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it works" },
];

function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" className={`flex items-center space-x-2 ${className ?? ""}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Crown className="h-[18px] w-[18px]" />
            </div>
            <span className="text-xl font-bold">Learn Chess</span>
        </Link>
    );
}

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur">
                <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <Logo />

                    <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-foreground/60 transition-colors hover:text-foreground/80"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" className="hidden sm:inline-flex" asChild>
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button className="hidden sm:inline-flex" asChild>
                            <Link href="/signup">Sign up</Link>
                        </Button>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] p-6 sm:w-[400px]">
                                <nav className="flex flex-col space-y-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="text-lg font-medium transition-colors hover:text-primary"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <div className="space-y-2 pt-4">
                                        <Button className="w-full" asChild>
                                            <Link href="/signup">Sign up</Link>
                                        </Button>
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href="/login">Log in</Link>
                                        </Button>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/30">
                <div className="container mx-auto max-w-7xl px-4 py-10">
                    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="space-y-2">
                            <Logo />
                            <p className="max-w-xs text-sm text-muted-foreground">
                                Learn chess with an AI tutor — play, get coached, and review every game.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Sign up</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} Learn Chess. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <Link href="#features" className="transition-colors hover:text-foreground">
                                Features
                            </Link>
                            <Link href="#how-it-works" className="transition-colors hover:text-foreground">
                                How it works
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
