'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/modules/auth/context';
import { EventService } from '../services/events';
import type { JarvisEvent } from '../types';

const supabase = createBrowserSupabaseClient();
const eventService = new EventService(() => supabase);

export const eventKeys = {
    all: ['jarvis-events'] as const,
    forTask: (taskId: string) => [...eventKeys.all, 'task', taskId] as const,
    recent: () => [...eventKeys.all, 'recent'] as const,
};

export function useTaskEvents(taskId: string) {
    const { user } = useAuth();

    return useQuery({
        queryKey: eventKeys.forTask(taskId),
        queryFn: () => eventService.getTaskEvents(taskId, user!.id),
        enabled: !!user?.id && !!taskId,
        refetchInterval: 5000,
    });
}

export function useRecentEvents(limit = 50) {
    const { user } = useAuth();

    return useQuery({
        queryKey: eventKeys.recent(),
        queryFn: () => eventService.getRecentEvents(user!.id, limit),
        enabled: !!user?.id,
    });
}

export function useEventsRealtime(taskId?: string) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user?.id) return;

        let channel;
        if (taskId) {
            channel = eventService.subscribeToTaskEvents(
                taskId,
                () => {
                    queryClient.invalidateQueries({ queryKey: eventKeys.forTask(taskId) });
                    queryClient.invalidateQueries({ queryKey: eventKeys.recent() });
                },
                supabase
            );
        } else {
            channel = eventService.subscribeToEvents(
                user.id,
                () => {
                    queryClient.invalidateQueries({ queryKey: eventKeys.all });
                },
                supabase
            );
        }

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, taskId, queryClient]);
}

export function useEventSubscription(
    callback: (event: JarvisEvent) => void,
    taskId?: string
) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id) return;

        const channel = taskId
            ? eventService.subscribeToTaskEvents(taskId, callback, supabase)
            : eventService.subscribeToEvents(user.id, callback, supabase);

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, taskId, callback]);
}
