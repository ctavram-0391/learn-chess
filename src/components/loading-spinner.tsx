'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <Loader2
            className={cn(
                'animate-spin text-muted-foreground',
                sizeClasses[size],
                className
            )}
        />
    );
}

interface LoadingStateProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingState({
    message = 'Loading...',
    size = 'md',
    className
}: LoadingStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center gap-2 p-6', className)}>
            <LoadingSpinner size={size} />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

export function PageLoadingSpinner() {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <LoadingState message="Loading page..." size="lg" />
        </div>
    );
}
