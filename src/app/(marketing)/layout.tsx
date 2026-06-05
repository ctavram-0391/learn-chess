import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Github, Menu } from "lucide-react";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
                <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                            NL
                        </div>
                        <span className="font-bold text-xl">Next Launch</span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60 scroll-smooth">
                            Features
                        </Link>
                        <Link href="#tech-stack" className="transition-colors hover:text-foreground/80 text-foreground/60 scroll-smooth">
                            Tech Stack
                        </Link>
                        <Link href="#examples" className="transition-colors hover:text-foreground/80 text-foreground/60 scroll-smooth">
                            Examples
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="hidden sm:inline-flex" asChild>
                            <Link href="https://github.com/zphelps/next-launch-ts" target="_blank">
                                <Github className="h-4 w-4" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </Button>
                        <Button className="hidden sm:inline-flex" asChild>
                            <Link href="#get-started">Get Started</Link>
                        </Button>

                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col space-y-4">
                                    <Link href="#features" className="text-lg font-medium hover:text-primary transition-colors">
                                        Features
                                    </Link>
                                    <Link href="#tech-stack" className="text-lg font-medium hover:text-primary transition-colors">
                                        Tech Stack
                                    </Link>
                                    <Link href="#examples" className="text-lg font-medium hover:text-primary transition-colors">
                                        Examples
                                    </Link>
                                    <div className="pt-4 space-y-2">
                                        <Button className="w-full" asChild>
                                            <Link href="#get-started">Get Started</Link>
                                        </Button>
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href="https://github.com/zphelps/next-launch-ts" target="_blank">
                                                <Github className="mr-2 h-4 w-4" />
                                                GitHub
                                            </Link>
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs">
                                    NL
                                </div>
                                <span className="font-semibold">Next Launch</span>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                A production-ready SaaS starter for shipping fast.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="https://github.com/zphelps/next-launch-ts" target="_blank">
                                    <Github className="h-4 w-4" />
                                    <span className="sr-only">GitHub</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} Next Launch. MIT License.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <Link href="https://github.com/zphelps/next-launch-ts#readme" target="_blank" className="hover:text-foreground transition-colors">
                                Documentation
                            </Link>
                            <Link href="https://github.com/zphelps/next-launch-ts" target="_blank" className="hover:text-foreground transition-colors">
                                GitHub
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
