import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CodeExamplesSection() {
    return (
        <section id="examples" className="container mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:py-24">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                    Built for developers
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Clean, maintainable code that follows best practices and scales with your application.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* React Query Hook Example */}
                <Card className="h-full border-border/50 overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs font-medium">React Query</Badge>
                        </div>
                        <CardTitle className="text-lg sm:text-xl">Type-safe data fetching</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            End-to-end type safety from database to UI with automatic caching
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                            <div className="text-zinc-500">{`// hooks/useTodos.ts`}</div>
                            <div className="mt-3 text-zinc-100">
                                <span className="text-purple-400">export function</span> <span className="text-blue-400">useTodos</span><span className="text-zinc-400">()</span> {"{"}
                            </div>
                            <div className="ml-4 text-zinc-100">
                                <span className="text-purple-400">const</span> {"{"} <span className="text-zinc-100">user</span> {"}"} = <span className="text-blue-400">useAuth</span>();
                            </div>
                            <div className="ml-4 mt-2 text-zinc-100">
                                <span className="text-purple-400">return</span> <span className="text-blue-400">useQuery</span>({"{"}
                            </div>
                            <div className="ml-8 text-zinc-100">
                                <span className="text-green-400">queryKey</span>: [<span className="text-amber-400">&apos;todos&apos;</span>, user?.id],
                            </div>
                            <div className="ml-8 text-zinc-100">
                                <span className="text-green-400">queryFn</span>: () =&gt; <span className="text-zinc-100">todoService</span>.<span className="text-blue-400">getTodos</span>(user!.id),
                            </div>
                            <div className="ml-8 text-zinc-100">
                                <span className="text-green-400">enabled</span>: !!user?.id,
                            </div>
                            <div className="ml-4 text-zinc-100">{"});"}</div>
                            <div className="text-zinc-100">{"}"}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Inngest Example */}
                <Card className="h-full border-border/50 overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs font-medium">Inngest</Badge>
                        </div>
                        <CardTitle className="text-lg sm:text-xl">Durable background jobs</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Multi-step workflows with automatic retries and scheduling
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                            <div className="text-zinc-500">{`// lib/inngest/functions/welcome.ts`}</div>
                            <div className="mt-3 text-zinc-100">
                                <span className="text-purple-400">export const</span> <span className="text-blue-400">sendWelcome</span> = inngest.<span className="text-blue-400">createFunction</span>(
                            </div>
                            <div className="ml-4 text-zinc-100">
                                {"{"} <span className="text-green-400">id</span>: <span className="text-amber-400">&quot;send-welcome&quot;</span>, <span className="text-green-400">retries</span>: <span className="text-amber-400">3</span> {"}"},
                            </div>
                            <div className="ml-4 text-zinc-100">
                                {"{"} <span className="text-green-400">event</span>: <span className="text-amber-400">&quot;user/signed.up&quot;</span> {"}"},
                            </div>
                            <div className="ml-4 text-zinc-100">
                                <span className="text-purple-400">async</span> ({"{"} event, step {"}"}) =&gt; {"{"}
                            </div>
                            <div className="ml-8 text-zinc-100">
                                <span className="text-purple-400">await</span> step.<span className="text-blue-400">run</span>(<span className="text-amber-400">&quot;send-email&quot;</span>, ...);
                            </div>
                            <div className="ml-8 text-zinc-100">
                                <span className="text-purple-400">await</span> step.<span className="text-blue-400">sleep</span>(<span className="text-amber-400">&quot;wait&quot;</span>, <span className="text-amber-400">&quot;1d&quot;</span>);
                            </div>
                            <div className="ml-8 text-zinc-100">
                                <span className="text-purple-400">await</span> step.<span className="text-blue-400">run</span>(<span className="text-amber-400">&quot;follow-up&quot;</span>, ...);
                            </div>
                            <div className="ml-4 text-zinc-100">{"}"})</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Modular Architecture */}
                <Card className="h-full border-border/50 overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs font-medium">Architecture</Badge>
                        </div>
                        <CardTitle className="text-lg sm:text-xl">Modular feature structure</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Feature-based organization that scales with your team
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg p-4 font-mono text-xs sm:text-sm">
                            <div className="text-zinc-500">{`src/modules/`}</div>
                            <div className="mt-3 space-y-1 text-zinc-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-400">📁</span> <span className="text-blue-400">todos/</span>
                                </div>
                                <div className="ml-6 text-zinc-400">├── components/</div>
                                <div className="ml-6 text-zinc-400">├── hooks/</div>
                                <div className="ml-6 text-zinc-400">├── services/</div>
                                <div className="ml-6 text-zinc-400">├── types.ts</div>
                                <div className="ml-6 text-zinc-400">└── validations.ts</div>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className="text-amber-400">📁</span> <span className="text-blue-400">auth/</span>
                                </div>
                                <div className="ml-6 text-zinc-400">├── components/</div>
                                <div className="ml-6 text-zinc-400">├── context.tsx</div>
                                <div className="ml-6 text-zinc-400">└── service.ts</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* RLS Example */}
                <Card className="h-full border-border/50 overflow-hidden">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs font-medium">Supabase</Badge>
                        </div>
                        <CardTitle className="text-lg sm:text-xl">Row Level Security</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Secure, scalable PostgreSQL with automatic authorization
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-zinc-950 dark:bg-zinc-900 rounded-lg p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                            <div className="text-zinc-500">{`-- supabase/migrations/`}</div>
                            <div className="mt-3 text-zinc-100">
                                <span className="text-purple-400">create policy</span> <span className="text-amber-400">&quot;Users view own data&quot;</span>
                            </div>
                            <div className="ml-4 text-zinc-100">
                                <span className="text-purple-400">on</span> <span className="text-zinc-400">public</span>.<span className="text-green-400">todos</span>
                            </div>
                            <div className="ml-4 text-zinc-100">
                                <span className="text-purple-400">for select to</span> <span className="text-blue-400">authenticated</span>
                            </div>
                            <div className="ml-4 text-zinc-100">
                                <span className="text-purple-400">using</span> (<span className="text-blue-400">auth.uid</span>() = <span className="text-green-400">user_id</span>);
                            </div>
                            <div className="mt-4 text-zinc-500">{`-- Automatic per-user data isolation`}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
