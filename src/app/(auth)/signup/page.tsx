import { SignupForm } from "@/modules/auth/components/signup-form";
import { pageMetadata } from "@/lib/seo";
import { Crown } from "lucide-react";
import Link from "next/link";

// Use the predefined metadata for consistent SEO
export const metadata = pageMetadata.signup;

export default function SignupPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <Crown className="size-4" />
                    </div>
                    Learn Chess
                </Link>
                <SignupForm />
                <p className="text-muted-foreground text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-foreground font-medium underline underline-offset-4">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
