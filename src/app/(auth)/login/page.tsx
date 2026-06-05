import { LoginForm } from "@/modules/auth/components/login-form";
import { pageMetadata } from "@/lib/seo";
import { Rocket } from "lucide-react";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

// Use the predefined metadata for consistent SEO
export const metadata = pageMetadata.login;

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <Rocket className="size-4" />
                    </div>
                    Next Launch TS
                </a>
                <Suspense fallback={<LoadingSpinner size="lg" />}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}