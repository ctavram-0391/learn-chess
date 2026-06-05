'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-6">
                        {/* 404 Illustration */}
                        <div className="relative">
                            <h1 className="text-9xl font-bold text-primary/10 select-none">
                                404
                            </h1>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-6xl">🔍</div>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Page Not Found
                            </h2>
                            <p className="text-muted-foreground">
                                The page you&apos;re looking for doesn&apos;t exist or has been moved.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <Button asChild variant="default" className="w-full sm:w-auto">
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go Home
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => window.history.back()}
                            >
                                <button type="button">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Go Back
                                </button>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

