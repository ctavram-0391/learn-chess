'use client';

import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageResponse } from '@/components/ai-elements/message';
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock,
    MessageSquare,
    XCircle,
    Coins,
    Hash,
    ArrowLeft,
} from 'lucide-react';
import { useTask, useSubtasks } from '../hooks/useTasks';
import { useTaskEvents, useEventsRealtime } from '../hooks/useEvents';
import { InputWidget } from './input-widget';
import { TaskCard } from './task-card';

const STATUS_ICON: Record<string, React.ElementType> = {
    pending: Clock,
    queued: Clock,
    running: Loader2,
    needs_input: MessageSquare,
    completed: CheckCircle2,
    failed: AlertCircle,
    cancelled: XCircle,
};

const EVENT_LABELS: Record<string, string> = {
    'task.created': 'Task Created',
    'task.decomposed': 'Decomposed',
    'task.queued': 'Queued',
    'task.started': 'Started',
    'task.progress': 'Progress',
    'task.needs_input': 'Needs Input',
    'task.input_received': 'Input Received',
    'task.completed': 'Completed',
    'task.failed': 'Failed',
    'task.cancelled': 'Cancelled',
    'executor.log': 'Log',
};

const EVENT_COLORS: Record<string, string> = {
    'task.created': 'bg-blue-500',
    'task.decomposed': 'bg-purple-500',
    'task.started': 'bg-yellow-500',
    'task.progress': 'bg-yellow-400',
    'task.needs_input': 'bg-orange-500',
    'task.input_received': 'bg-blue-400',
    'task.completed': 'bg-green-500',
    'task.failed': 'bg-red-500',
    'task.cancelled': 'bg-gray-500',
    'executor.log': 'bg-gray-400',
};

export function TaskDetail({ taskId }: { taskId: string }) {
    const { data: task, isLoading: taskLoading } = useTask(taskId);
    const { data: subtasks = [] } = useSubtasks(taskId);
    const { data: events = [] } = useTaskEvents(taskId);
    useEventsRealtime(taskId);

    if (taskLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-40 w-full" />
            </div>
        );
    }

    if (!task) {
        return <p className="text-muted-foreground">Task not found.</p>;
    }

    const StatusIcon = STATUS_ICON[task.status] ?? Clock;

    return (
        <div className="space-y-6">
            {/* Back navigation */}
            <Link
                href="/dashboard/mission-control"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Mission Control
            </Link>

            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <StatusIcon
                        className={`h-5 w-5 ${task.status === 'running' ? 'animate-spin text-yellow-500' : task.status === 'completed' ? 'text-green-500' : task.status === 'failed' ? 'text-red-500' : 'text-muted-foreground'}`}
                    />
                    <h1 className="text-2xl font-bold tracking-tight">{task.description}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Badge>{task.status}</Badge>
                    <Badge variant="outline">{task.priority}</Badge>
                    {task.executor_type && (
                        <Badge variant="secondary">{task.executor_type}</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                        Created {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                    </span>
                </div>
            </div>

            {/* Input widget if needed */}
            {task.status === 'needs_input' && <InputWidget task={task} />}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Hash className="h-3.5 w-3.5" />
                        Tokens
                    </div>
                    <p className="text-lg font-semibold tabular-nums">
                        {task.tokens_used.toLocaleString()}
                    </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Coins className="h-3.5 w-3.5" />
                        Cost
                    </div>
                    <p className="text-lg font-semibold tabular-nums">
                        ${task.spent_usd.toFixed(4)}
                    </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Clock className="h-3.5 w-3.5" />
                        Duration
                    </div>
                    <p className="text-lg font-semibold">
                        {task.completed_at
                            ? formatDistanceToNow(new Date(task.created_at), { includeSeconds: true })
                            : 'In progress'}
                    </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        Subtasks
                    </div>
                    <p className="text-lg font-semibold tabular-nums">{subtasks.length}</p>
                </div>
            </div>

            {/* Tabs: Result / Subtasks / Events */}
            <Tabs defaultValue={task.result_json ? 'result' : 'events'}>
                <TabsList>
                    {task.result_json && <TabsTrigger value="result">Result</TabsTrigger>}
                    {subtasks.length > 0 && <TabsTrigger value="subtasks">Subtasks</TabsTrigger>}
                    <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
                </TabsList>

                {task.result_json && (
                    <TabsContent value="result">
                        <Card>
                            <CardContent className="p-6">
                                <MessageResponse mode="static">
                                    {task.result_json.summary}
                                </MessageResponse>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                {subtasks.length > 0 && (
                    <TabsContent value="subtasks">
                        <div className="space-y-2">
                            {subtasks.map(subtask => (
                                <TaskCard key={subtask.id} task={subtask} />
                            ))}
                        </div>
                    </TabsContent>
                )}

                <TabsContent value="events">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Event Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-80 overflow-y-auto">
                                {events.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No events yet
                                    </p>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute left-[52px] top-1 bottom-1 w-px bg-border" />
                                        <div className="space-y-2">
                                            {events.map(event => (
                                                <div key={event.id} className="flex items-start gap-2.5 text-sm relative">
                                                    <span className="text-xs text-muted-foreground tabular-nums w-[44px] shrink-0 mt-0.5">
                                                        {format(new Date(event.timestamp), 'HH:mm')}
                                                    </span>
                                                    <div
                                                        className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ring-2 ring-background ${EVENT_COLORS[event.type] ?? 'bg-gray-400'}`}
                                                    />
                                                    <Badge variant="outline" className="text-xs shrink-0">
                                                        {EVENT_LABELS[event.type] ?? event.type}
                                                    </Badge>
                                                    <span className="text-muted-foreground truncate">
                                                        {event.payload.message as string ??
                                                         event.payload.summary as string ??
                                                         event.payload.error as string ??
                                                         event.type}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Error display */}
            {task.error_json && (
                <Card className="border-red-500/30">
                    <CardHeader>
                        <CardTitle className="text-sm text-red-500 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{task.error_json.message}</p>
                        {task.error_json.suggestedAction && (
                            <p className="text-sm text-muted-foreground mt-2">
                                Suggestion: {task.error_json.suggestedAction}
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
