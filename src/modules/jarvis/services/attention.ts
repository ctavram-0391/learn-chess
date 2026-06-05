import { createSupabaseClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
    JarvisEvent,
    Task,
    Notification,
    ConversationDecision,
    TaskPriority,
} from '../types';

export class AttentionService {
    private clientFactory: () => Promise<SupabaseClient> | SupabaseClient;

    constructor(clientFactory?: () => Promise<SupabaseClient> | SupabaseClient) {
        this.clientFactory = clientFactory ?? createSupabaseClient;
    }

    private async getClient(): Promise<SupabaseClient> {
        return await this.clientFactory();
    }

    evaluateEvent(event: JarvisEvent, task: Task): ConversationDecision {
        // Task failed — always surface immediately
        if (event.type === 'task.failed') {
            return {
                shouldSurface: true,
                priority: 'interrupt',
                reason: `Task failed: ${task.description}`,
            };
        }

        // Task needs input — surface based on priority
        if (event.type === 'task.needs_input') {
            const priority = task.priority === 'urgent' || task.priority === 'high'
                ? 'interrupt' as const
                : 'next_turn' as const;
            return {
                shouldSurface: true,
                priority,
                reason: `Task needs your input: ${task.description}`,
            };
        }

        // Task completed — surface at next turn
        if (event.type === 'task.completed') {
            return {
                shouldSurface: true,
                priority: 'next_turn',
                reason: `Task completed: ${task.description}`,
            };
        }

        // Budget warning (>80% spent)
        if (task.budget_usd && task.spent_usd > task.budget_usd * 0.8) {
            return {
                shouldSurface: true,
                priority: 'next_turn',
                reason: `Task approaching budget limit (${Math.round((task.spent_usd / task.budget_usd) * 100)}% used)`,
            };
        }

        // Default: don't surface in conversation
        return {
            shouldSurface: false,
            priority: 'background',
            reason: 'No action required',
        };
    }

    async createNotification(
        taskId: string,
        eventId: string,
        userId: string,
        decision: ConversationDecision
    ): Promise<Notification> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('notifications')
            .insert({
                task_id: taskId,
                event_id: eventId,
                user_id: userId,
                conversation_decision: decision,
                conversation_surfaced: false,
                resolved: false,
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to create notification: ${error.message}`);
        return data as Notification;
    }

    async getUnresolvedNotifications(userId: string): Promise<Notification[]> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .eq('resolved', false)
            .order('dashboard_surfaced_at', { ascending: false });

        if (error) throw new Error(`Failed to get notifications: ${error.message}`);
        return (data ?? []) as Notification[];
    }

    async markDashboardActioned(notificationId: string): Promise<void> {
        const client = await this.getClient();
        const { error } = await client
            .from('notifications')
            .update({ dashboard_actioned: true })
            .eq('id', notificationId);

        if (error) throw new Error(`Failed to mark notification actioned: ${error.message}`);
    }

    async resolveNotification(
        notificationId: string,
        resolvedVia: 'dashboard' | 'conversation'
    ): Promise<void> {
        const client = await this.getClient();
        const { error } = await client
            .from('notifications')
            .update({
                resolved: true,
                resolved_via: resolvedVia,
                resolved_at: new Date().toISOString(),
            })
            .eq('id', notificationId);

        if (error) throw new Error(`Failed to resolve notification: ${error.message}`);
    }

    async resolveTaskNotifications(
        taskId: string,
        resolvedVia: 'dashboard' | 'conversation'
    ): Promise<void> {
        const client = await this.getClient();
        const { error } = await client
            .from('notifications')
            .update({
                resolved: true,
                resolved_via: resolvedVia,
                resolved_at: new Date().toISOString(),
            })
            .eq('task_id', taskId)
            .eq('resolved', false);

        if (error) throw new Error(`Failed to resolve task notifications: ${error.message}`);
    }

    async flagTaskAndNotify(
        task: Task,
        event: JarvisEvent,
        reason: string,
        priority: TaskPriority
    ): Promise<Notification | null> {
        const decision = this.evaluateEvent(event, task);
        if (!decision.shouldSurface) return null;

        return this.createNotification(
            task.id,
            event.id,
            task.user_id,
            decision
        );
    }
}

export const attentionService = new AttentionService();
