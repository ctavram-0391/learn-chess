import { createSupabaseClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Task, TaskStatus, TaskPriority, TaskFilters, ExecutorType } from '../types';

const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
    pending: ['queued', 'cancelled'],
    queued: ['running', 'cancelled'],
    running: ['completed', 'failed', 'needs_input', 'cancelled'],
    needs_input: ['running', 'cancelled'],
    completed: [],
    failed: ['queued'],
    cancelled: [],
};

export interface CreateTaskParams {
    user_id: string;
    description: string;
    originating_dispatch: string;
    priority?: TaskPriority;
    parent_id?: string;
    executor_type?: ExecutorType;
    context_summary?: string;
    budget_usd?: number;
}

export class TaskService {
    private clientFactory: () => Promise<SupabaseClient> | SupabaseClient;

    constructor(clientFactory?: () => Promise<SupabaseClient> | SupabaseClient) {
        this.clientFactory = clientFactory ?? createSupabaseClient;
    }

    private async getClient(): Promise<SupabaseClient> {
        return await this.clientFactory();
    }

    async createTask(params: CreateTaskParams): Promise<Task> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('tasks')
            .insert({
                user_id: params.user_id,
                description: params.description,
                originating_dispatch: params.originating_dispatch,
                priority: params.priority ?? 'medium',
                parent_id: params.parent_id ?? null,
                executor_type: params.executor_type ?? null,
                context_summary: params.context_summary ?? null,
                budget_usd: params.budget_usd ?? null,
                status: 'pending',
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to create task: ${error.message}`);
        return data as Task;
    }

    async getTaskById(id: string): Promise<Task | null> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw new Error(`Failed to get task: ${error.message}`);
        }
        return data as Task;
    }

    async getTasks(userId: string, filters?: TaskFilters): Promise<Task[]> {
        const client = await this.getClient();
        let query = client
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.needs_attention !== undefined) {
            query = query.eq('requires_attention', filters.needs_attention);
        }
        if (filters?.priority) {
            query = query.eq('priority', filters.priority);
        }
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;
        if (error) throw new Error(`Failed to get tasks: ${error.message}`);
        return (data ?? []) as Task[];
    }

    async getTasksNeedingAttention(userId: string): Promise<Task[]> {
        return this.getTasks(userId, { needs_attention: true });
    }

    async getActiveTasks(userId: string): Promise<Task[]> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .in('status', ['running', 'queued', 'pending', 'needs_input'])
            .order('created_at', { ascending: false });

        if (error) throw new Error(`Failed to get active tasks: ${error.message}`);
        return (data ?? []) as Task[];
    }

    async getCompletedTasks(userId: string, limit = 20): Promise<Task[]> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .in('status', ['completed', 'failed', 'cancelled'])
            .order('completed_at', { ascending: false })
            .limit(limit);

        if (error) throw new Error(`Failed to get completed tasks: ${error.message}`);
        return (data ?? []) as Task[];
    }

    async updateTaskStatus(
        taskId: string,
        newStatus: TaskStatus,
        metadata?: Partial<Pick<Task, 'result_json' | 'error_json' | 'session_id' | 'executor_type'>>
    ): Promise<Task> {
        const client = await this.getClient();

        // Get current task to validate transition
        const current = await this.getTaskById(taskId);
        if (!current) throw new Error(`Task ${taskId} not found`);

        const allowed = VALID_TRANSITIONS[current.status];
        if (!allowed.includes(newStatus)) {
            throw new Error(
                `Invalid status transition: ${current.status} → ${newStatus}. ` +
                `Allowed: ${allowed.join(', ')}`
            );
        }

        const updates: Record<string, unknown> = {
            status: newStatus,
            ...metadata,
        };

        if (['completed', 'failed', 'cancelled'].includes(newStatus)) {
            updates.completed_at = new Date().toISOString();
        }

        const { data, error } = await client
            .from('tasks')
            .update(updates)
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw new Error(`Failed to update task status: ${error.message}`);
        return data as Task;
    }

    async flagForAttention(
        taskId: string,
        reason: string,
        priority: TaskPriority
    ): Promise<Task> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('tasks')
            .update({
                requires_attention: true,
                attention_reason: reason,
                attention_priority: priority,
            })
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw new Error(`Failed to flag task: ${error.message}`);
        return data as Task;
    }

    async resolveAttention(taskId: string): Promise<Task> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('tasks')
            .update({
                requires_attention: false,
                attention_reason: null,
                attention_priority: null,
            })
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw new Error(`Failed to resolve attention: ${error.message}`);
        return data as Task;
    }

    async getSubtasks(parentId: string): Promise<Task[]> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('tasks')
            .select('*')
            .eq('parent_id', parentId)
            .order('created_at', { ascending: true });

        if (error) throw new Error(`Failed to get subtasks: ${error.message}`);
        return (data ?? []) as Task[];
    }

    async addDependency(taskId: string, dependsOn: string): Promise<void> {
        const client = await this.getClient();
        const { error } = await client
            .from('task_dependencies')
            .insert({ task_id: taskId, depends_on: dependsOn });

        if (error) throw new Error(`Failed to add dependency: ${error.message}`);
    }

    async areDependenciesMet(taskId: string): Promise<boolean> {
        const client = await this.getClient();

        // Get all dependencies for this task
        const { data: deps, error: depsError } = await client
            .from('task_dependencies')
            .select('depends_on')
            .eq('task_id', taskId);

        if (depsError) throw new Error(`Failed to check dependencies: ${depsError.message}`);
        if (!deps || deps.length === 0) return true;

        // Check if all dependency tasks are completed
        const depIds = deps.map(d => d.depends_on);
        const { data: depTasks, error: tasksError } = await client
            .from('tasks')
            .select('id, status')
            .in('id', depIds);

        if (tasksError) throw new Error(`Failed to check dependency tasks: ${tasksError.message}`);
        return depTasks?.every(t => t.status === 'completed') ?? false;
    }

    async getNextRunnableTasks(userId: string): Promise<Task[]> {
        const client = await this.getClient();

        // Get all queued tasks
        const { data: queued, error } = await client
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'queued');

        if (error) throw new Error(`Failed to get queued tasks: ${error.message}`);
        if (!queued || queued.length === 0) return [];

        // Filter to those with met dependencies
        const runnable: Task[] = [];
        for (const task of queued) {
            const met = await this.areDependenciesMet(task.id);
            if (met) runnable.push(task as Task);
        }
        return runnable;
    }

    async updateCost(taskId: string, tokensUsed: number, costUsd: number): Promise<Task> {
        const client = await this.getClient();

        const current = await this.getTaskById(taskId);
        if (!current) throw new Error(`Task ${taskId} not found`);

        const { data, error } = await client
            .from('tasks')
            .update({
                tokens_used: current.tokens_used + tokensUsed,
                spent_usd: current.spent_usd + costUsd,
            })
            .eq('id', taskId)
            .select()
            .single();

        if (error) throw new Error(`Failed to update cost: ${error.message}`);
        return data as Task;
    }

    subscribeToTasks(
        userId: string,
        callback: (payload: { new: Task; old: Task; eventType: string }) => void,
        client: SupabaseClient
    ) {
        return client
            .channel(`tasks:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => callback(payload as unknown as { new: Task; old: Task; eventType: string })
            )
            .subscribe();
    }
}

export const taskService = new TaskService();
