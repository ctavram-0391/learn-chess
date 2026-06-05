'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
    useTasksNeedingAttention,
    useActiveTasks,
    useCompletedTasks,
    useTasksRealtime,
} from '../hooks/useTasks';
import { TaskCard } from './task-card';
import { AlertTriangle, Loader2, CheckCircle2, Inbox } from 'lucide-react';

interface KanbanColumnProps {
    title: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    columnBg: string;
    count: number;
    children: React.ReactNode;
    isLoading: boolean;
    emptyMessage: string;
    emptyIcon: React.ElementType;
}

function KanbanColumn({
    title,
    icon: Icon,
    iconBg,
    iconColor,
    columnBg,
    count,
    children,
    isLoading,
    emptyMessage,
    emptyIcon: EmptyIcon,
}: KanbanColumnProps) {
    return (
        <div className={cn('rounded-xl border', columnBg)}>
            {/* Column Header */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b">
                <div className={cn('flex items-center justify-center h-6 w-6 rounded-md', iconBg)}>
                    <Icon className={cn('h-3.5 w-3.5', iconColor)} />
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <Badge variant="secondary" className="ml-auto text-xs tabular-nums">
                    {count}
                </Badge>
            </div>

            {/* Column Content */}
            <div className="p-3 max-h-[calc(100vh-16rem)] overflow-y-auto">
                <div className="space-y-2.5">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-[88px] w-full rounded-lg" />
                            <Skeleton className="h-[72px] w-full rounded-lg" />
                            <Skeleton className="h-[88px] w-full rounded-lg" />
                        </>
                    ) : count === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <EmptyIcon className="h-8 w-8 text-muted-foreground/40 mb-2" />
                            <p className="text-xs text-muted-foreground/60">
                                {emptyMessage}
                            </p>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
}

export function TaskBoard() {
    useTasksRealtime();

    const { data: attentionTasks = [], isLoading: loadingAttention } = useTasksNeedingAttention();
    const { data: activeTasks = [], isLoading: loadingActive } = useActiveTasks();
    const { data: completedTasks = [], isLoading: loadingCompleted } = useCompletedTasks(10);

    // Filter active tasks that don't need attention (to avoid duplicates)
    const attentionIds = new Set(attentionTasks.map(t => t.id));
    const filteredActive = activeTasks.filter(t => !attentionIds.has(t.id));

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KanbanColumn
                title="Needs Attention"
                icon={AlertTriangle}
                iconBg="bg-orange-100 dark:bg-orange-900/30"
                iconColor="text-orange-600 dark:text-orange-400"
                columnBg="bg-orange-50/40 dark:bg-orange-950/10"
                count={attentionTasks.length}
                isLoading={loadingAttention}
                emptyMessage="All clear — no tasks need attention"
                emptyIcon={Inbox}
            >
                {attentionTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </KanbanColumn>

            <KanbanColumn
                title="Active"
                icon={Loader2}
                iconBg="bg-blue-100 dark:bg-blue-900/30"
                iconColor="text-blue-600 dark:text-blue-400 animate-spin"
                columnBg="bg-blue-50/40 dark:bg-blue-950/10"
                count={filteredActive.length}
                isLoading={loadingActive}
                emptyMessage="No active tasks right now"
                emptyIcon={Inbox}
            >
                {filteredActive.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </KanbanColumn>

            <KanbanColumn
                title="Recently Completed"
                icon={CheckCircle2}
                iconBg="bg-green-100 dark:bg-green-900/30"
                iconColor="text-green-600 dark:text-green-400"
                columnBg="bg-green-50/40 dark:bg-green-950/10"
                count={completedTasks.length}
                isLoading={loadingCompleted}
                emptyMessage="No completed tasks yet"
                emptyIcon={CheckCircle2}
            >
                {completedTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </KanbanColumn>
        </div>
    );
}
