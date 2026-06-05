'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from 'lucide-react';
import { useRecentEvents, useEventsRealtime } from '../hooks/useEvents';

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

export function EventTimeline() {
    const { data: events = [], isLoading } = useRecentEvents(30);
    useEventsRealtime();

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Event Timeline
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="max-h-72 overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-5 w-full" />
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No events yet. Dispatch a task to get started.
                        </p>
                    ) : (
                        <div className="relative">
                            {/* Vertical connector line */}
                            <div className="absolute left-[52px] top-1 bottom-1 w-px bg-border" />

                            <div className="space-y-1.5">
                                {events.map(event => (
                                    <div key={event.id} className="flex items-start gap-2 text-xs relative">
                                        <span className="text-muted-foreground tabular-nums w-[44px] shrink-0 mt-0.5">
                                            {format(new Date(event.timestamp), 'HH:mm')}
                                        </span>
                                        <div
                                            className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ring-2 ring-background ${EVENT_COLORS[event.type] ?? 'bg-gray-400'}`}
                                        />
                                        <div className="flex-1 min-w-0 mt-0.5">
                                            <Badge variant="outline" className="text-[10px] mr-1 px-1 py-0">
                                                {event.type.split('.')[1]}
                                            </Badge>
                                            <span className="text-muted-foreground">
                                                {(event.payload.message as string) ??
                                                 (event.payload.description as string) ??
                                                 (event.payload.error as string) ??
                                                 ''}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
