import { z } from 'zod';

export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const taskStatusSchema = z.enum([
    'pending', 'queued', 'running', 'needs_input',
    'completed', 'failed', 'cancelled',
]);

export const dispatchRequestSchema = z.object({
    description: z.string().min(1, 'Task description is required').max(5000),
    priority: taskPrioritySchema.optional().default('medium'),
    context: z.string().max(10000).optional(),
    budget_usd: z.number().positive().optional(),
});

export const taskResponseSchema = z.object({
    task_id: z.string().uuid('Invalid task ID'),
    response: z.string().min(1, 'Response is required').max(10000),
});

export const chatMessageSchema = z.object({
    message: z.string().min(1, 'Message is required').max(10000),
});

export const taskFiltersSchema = z.object({
    status: taskStatusSchema.optional(),
    needs_attention: z.coerce.boolean().optional(),
    priority: taskPrioritySchema.optional(),
    limit: z.coerce.number().int().positive().max(100).optional().default(50),
});
