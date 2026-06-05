'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock,
    MessageSquare,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import type { Task } from '../types';

const STATUS_CONFIG: Record<string, {
    icon: React.ElementType;
    color: string;
    bg: string;
    label: string;
}> = {
    pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Pending' },
    queued: { icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Queued' },
    running: { icon: Loader2, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Running' },
    needs_input: { icon: MessageSquare, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', label: 'Needs Input' },
    completed: { icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Completed' },
    failed: { icon: AlertCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Failed' },
    cancelled: { icon: XCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Cancelled' },
};

const PRIORITY_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    low: 'outline',
    medium: 'secondary',
    high: 'default',
    urgent: 'destructive',
};

export function TaskCard({ task }: { task: Task }) {
    const config = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.pending;
    const StatusIcon = config.icon;
    const isAttention = task.requires_attention && task.attention_reason;

    return (
        <Link href={`/dashboard/tasks/${task.id}`}>
            <Card className={cn(
                'transition-all cursor-pointer hover:shadow-sm',
                isAttention && 'border-orange-400/50 bg-orange-50/30 dark:bg-orange-950/10',
            )}>
                <CardContent className="p-3.5">
                    <div className="flex items-start gap-3">
                        {/* Status icon with colored background */}
                        <div className={cn(
                            'flex items-center justify-center h-7 w-7 rounded-lg shrink-0',
                            config.bg,
                        )}>
                            <StatusIcon
                                className={cn(
                                    'h-3.5 w-3.5',
                                    config.color,
                                    task.status === 'running' && 'animate-spin',
                                )}
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2 leading-snug">
                                {task.description}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                                <Badge variant={PRIORITY_VARIANT[task.priority]} className="text-[10px] px-1.5 py-0">
                                    {task.priority}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                    {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Attention reason */}
                    {isAttention && (
                        <div className="flex items-start gap-1.5 mt-2.5 pt-2.5 border-t border-orange-200/50 dark:border-orange-800/30">
                            <AlertTriangle className="h-3 w-3 text-orange-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-orange-600 dark:text-orange-400 line-clamp-2">
                                {task.attention_reason}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
