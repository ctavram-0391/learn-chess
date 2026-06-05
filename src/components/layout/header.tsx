'use client';

import { Badge } from '@/components/ui/badge';
import { useTasksNeedingAttention, useActiveTasks } from '@/modules/jarvis/hooks/useTasks';
import {
    AlertTriangle,
    Loader2,
} from 'lucide-react';

export function Header() {
    const { data: attentionTasks } = useTasksNeedingAttention();
    const { data: activeTasks } = useActiveTasks();

    const attentionCount = attentionTasks?.length ?? 0;
    const activeCount = activeTasks?.length ?? 0;

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">

            <div className="ml-auto flex items-center gap-4 px-4">
                <div className="hidden sm:flex items-center gap-3">
                    {activeCount > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                            <span className="text-muted-foreground">Active:</span>
                            <Badge variant="secondary">{activeCount}</Badge>
                        </div>
                    )}
                    {attentionCount > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="text-muted-foreground">Attention:</span>
                            <Badge variant="destructive">{attentionCount}</Badge>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
