import { ulid } from 'ulid';
import { createSupabaseClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { JarvisEvent, EventType, EventSourceKind } from '../types';

export interface PublishEventParams {
    source_kind: EventSourceKind;
    source_id?: string;
    type: EventType;
    task_id?: string;
    user_id: string;
    payload?: Record<string, unknown>;
    correlation_id?: string;
    parent_event_id?: string;
}

export interface EventFilters {
    task_id?: string;
    type?: EventType;
    types?: EventType[];
    user_id: string;
    limit?: number;
    after?: string;
}

export class EventService {
    private clientFactory: () => Promise<SupabaseClient> | SupabaseClient;

    constructor(clientFactory?: () => Promise<SupabaseClient> | SupabaseClient) {
        this.clientFactory = clientFactory ?? createSupabaseClient;
    }

    private async getClient(): Promise<SupabaseClient> {
        return await this.clientFactory();
    }

    async publish(params: PublishEventParams): Promise<JarvisEvent> {
        const client = await this.getClient();
        const event: Omit<JarvisEvent, 'timestamp'> & { timestamp?: string } = {
            id: ulid(),
            source_kind: params.source_kind,
            source_id: params.source_id ?? null,
            type: params.type,
            task_id: params.task_id ?? null,
            user_id: params.user_id,
            payload: params.payload ?? {},
            correlation_id: params.correlation_id ?? null,
            parent_event_id: params.parent_event_id ?? null,
        };

        const { data, error } = await client
            .from('events')
            .insert(event)
            .select()
            .single();

        if (error) throw new Error(`Failed to publish event: ${error.message}`);
        return data as JarvisEvent;
    }

    async getEvents(filters: EventFilters): Promise<JarvisEvent[]> {
        const client = await this.getClient();
        let query = client
            .from('events')
            .select('*')
            .eq('user_id', filters.user_id)
            .order('timestamp', { ascending: false });

        if (filters.task_id) {
            query = query.eq('task_id', filters.task_id);
        }
        if (filters.type) {
            query = query.eq('type', filters.type);
        }
        if (filters.types && filters.types.length > 0) {
            query = query.in('type', filters.types);
        }
        if (filters.after) {
            query = query.gt('timestamp', filters.after);
        }
        if (filters.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;
        if (error) throw new Error(`Failed to get events: ${error.message}`);
        return (data ?? []) as JarvisEvent[];
    }

    async getTaskEvents(taskId: string, userId: string): Promise<JarvisEvent[]> {
        return this.getEvents({ task_id: taskId, user_id: userId, limit: 100 });
    }

    async getRecentEvents(userId: string, limit = 50): Promise<JarvisEvent[]> {
        return this.getEvents({ user_id: userId, limit });
    }

    subscribeToEvents(
        userId: string,
        callback: (event: JarvisEvent) => void,
        client: SupabaseClient
    ) {
        return client
            .channel(`events:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'events',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => callback(payload.new as JarvisEvent)
            )
            .subscribe();
    }

    subscribeToTaskEvents(
        taskId: string,
        callback: (event: JarvisEvent) => void,
        client: SupabaseClient
    ) {
        return client
            .channel(`task-events:${taskId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'events',
                    filter: `task_id=eq.${taskId}`,
                },
                (payload) => callback(payload.new as JarvisEvent)
            )
            .subscribe();
    }
}

export const eventService = new EventService();
