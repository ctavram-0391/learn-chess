'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Hash, Coins } from 'lucide-react';
import { useActiveTasks, useCompletedTasks } from '../hooks/useTasks';

export function ResourcePanel() {
    const { data: activeTasks = [] } = useActiveTasks();
    const { data: completedTasks = [] } = useCompletedTasks(50);

    const allTasks = [...activeTasks, ...completedTasks];
    const totalTokens = allTasks.reduce((sum, t) => sum + t.tokens_used, 0);
    const totalCost = allTasks.reduce((sum, t) => sum + t.spent_usd, 0);
    const activeCount = activeTasks.length;

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Resources
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1.5">
                            <Activity className="h-3 w-3" />
                            <span className="text-xs">Active</span>
                        </div>
                        <p className="text-lg font-semibold tabular-nums text-blue-600 dark:text-blue-400">
                            {activeCount}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1.5">
                            <Hash className="h-3 w-3" />
                            <span className="text-xs">Tokens</span>
                        </div>
                        <p className="text-lg font-semibold tabular-nums">
                            {totalTokens > 1000 ? `${(totalTokens / 1000).toFixed(1)}k` : totalTokens}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1.5">
                            <Coins className="h-3 w-3" />
                            <span className="text-xs">Cost</span>
                        </div>
                        <p className="text-lg font-semibold tabular-nums">
                            ${totalCost.toFixed(2)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
