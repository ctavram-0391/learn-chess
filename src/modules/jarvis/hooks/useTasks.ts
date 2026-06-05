'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/modules/auth/context';
import { TaskService } from '../services/tasks';
import type { Task, TaskFilters } from '../types';

const supabase = createBrowserSupabaseClient();
const taskService = new TaskService(() => supabase);

export const taskKeys = {
    all: ['jarvis-tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (filters?: TaskFilters) => [...taskKeys.lists(), filters] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: string) => [...taskKeys.details(), id] as const,
    needsAttention: () => [...taskKeys.all, 'needs-attention'] as const,
    active: () => [...taskKeys.all, 'active'] as const,
    completed: () => [...taskKeys.all, 'completed'] as const,
    subtasks: (parentId: string) => [...taskKeys.all, 'subtasks', parentId] as const,
};

export function useTasksRealtime() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!user?.id) return;

        const channel = taskService.subscribeToTasks(
            user.id,
            () => {
                queryClient.invalidateQueries({ queryKey: taskKeys.all });
            },
            supabase
        );

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, queryClient]);
}

export function useTasks(filters?: TaskFilters) {
    const { user } = useAuth();

    return useQuery({
        queryKey: taskKeys.list(filters),
        queryFn: () => taskService.getTasks(user!.id, filters),
        enabled: !!user?.id,
    });
}

export function useTask(id: string) {
    return useQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => taskService.getTaskById(id),
        enabled: !!id,
    });
}

export function useTasksNeedingAttention() {
    const { user } = useAuth();

    return useQuery({
        queryKey: taskKeys.needsAttention(),
        queryFn: () => taskService.getTasksNeedingAttention(user!.id),
        enabled: !!user?.id,
    });
}

export function useActiveTasks() {
    const { user } = useAuth();

    return useQuery({
        queryKey: taskKeys.active(),
        queryFn: () => taskService.getActiveTasks(user!.id),
        enabled: !!user?.id,
    });
}

export function useCompletedTasks(limit = 20) {
    const { user } = useAuth();

    return useQuery({
        queryKey: taskKeys.completed(),
        queryFn: () => taskService.getCompletedTasks(user!.id, limit),
        enabled: !!user?.id,
    });
}

export function useSubtasks(parentId: string) {
    return useQuery({
        queryKey: taskKeys.subtasks(parentId),
        queryFn: () => taskService.getSubtasks(parentId),
        enabled: !!parentId,
    });
}

export function useDispatchTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { description: string; priority?: string; context?: string }) => {
            const res = await fetch('/api/jarvis/dispatch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to dispatch task');
            return res.json() as Promise<{ task: Task }>;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
}

export function useRespondToTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { task_id: string; response: string }) => {
            const res = await fetch('/api/jarvis/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to respond to task');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.all });
        },
    });
}
