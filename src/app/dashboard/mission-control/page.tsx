'use client';

import { TaskBoard } from '@/modules/jarvis/components/task-board';
import { EventTimeline } from '@/modules/jarvis/components/event-timeline';
import { ResourcePanel } from '@/modules/jarvis/components/resource-panel';

export default function MissionControlPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
                <p className="text-sm text-muted-foreground">
                    Monitor and manage all background tasks.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3 min-h-0">
                    <TaskBoard />
                </div>
                <div className="space-y-4 min-h-0">
                    <ResourcePanel />
                    <EventTimeline />
                </div>
            </div>
        </div>
    );
}
