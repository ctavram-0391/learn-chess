'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useAuth } from '@/modules/auth/context';
import { AttentionService } from '../services/attention';

const supabase = createBrowserSupabaseClient();
const attentionService = new AttentionService(() => supabase);

export const notificationKeys = {
    all: ['jarvis-notifications'] as const,
    unresolved: () => [...notificationKeys.all, 'unresolved'] as const,
};

export function useUnresolvedNotifications() {
    const { user } = useAuth();

    return useQuery({
        queryKey: notificationKeys.unresolved(),
        queryFn: () => attentionService.getUnresolvedNotifications(user!.id),
        enabled: !!user?.id,
        refetchInterval: 10000,
    });
}

export function useResolveNotification() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            notificationId,
            resolvedVia,
        }: {
            notificationId: string;
            resolvedVia: 'dashboard' | 'conversation';
        }) => {
            await attentionService.resolveNotification(notificationId, resolvedVia);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
    });
}
