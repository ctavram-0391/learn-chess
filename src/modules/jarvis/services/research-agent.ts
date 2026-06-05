import 'server-only';

import { anthropic } from '@/lib/anthropic';
import { createServiceRoleClient } from '@/lib/supabase/service-role-client';
import { EventService } from './events';
import { TaskService } from './tasks';
import { ulid } from 'ulid';
import type { Task, ExecutionContext, ExecutionResult, TaskResult } from '../types';

const RESEARCH_SYSTEM_PROMPT = `You are a research assistant for Jarvis, a personal AI assistant. Your job is to thoroughly research the given topic and produce a comprehensive, well-organized summary.

Guidelines:
- Be thorough but concise
- Cite key findings and sources when available
- Structure your response with clear sections
- If the task is ambiguous, do your best interpretation and note any assumptions
- Focus on actionable, useful information`;

export class ResearchAgentExecutor {
    private getServiceClient() {
        return createServiceRoleClient();
    }

    async execute(task: Task, context: ExecutionContext): Promise<ExecutionResult> {
        const serviceClient = this.getServiceClient();
        const eventService = new EventService(() => serviceClient);
        const taskService = new TaskService(() => serviceClient);

        const sessionId = `research-${ulid()}`;

        // Create executor session
        await serviceClient.from('executor_sessions').insert({
            session_id: sessionId,
            task_id: task.id,
            executor_type: 'research',
            status: 'running',
        });

        // Update task with session info
        await taskService.updateTaskStatus(task.id, 'running', {
            session_id: sessionId,
            executor_type: 'research',
        });

        // Publish start event
        await eventService.publish({
            source_kind: 'executor',
            source_id: sessionId,
            type: 'task.started',
            task_id: task.id,
            user_id: context.userId,
            payload: { executor_type: 'research', session_id: sessionId },
            correlation_id: context.correlationId,
        });

        try {
            // Publish progress event
            await eventService.publish({
                source_kind: 'executor',
                source_id: sessionId,
                type: 'task.progress',
                task_id: task.id,
                user_id: context.userId,
                payload: { message: 'Researching...' },
                correlation_id: context.correlationId,
            });

            // Execute research via Claude API
            const prompt = task.context_summary
                ? `${task.description}\n\nAdditional context: ${task.context_summary}`
                : task.description;

            const response = await anthropic.messages.create({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 4096,
                system: RESEARCH_SYSTEM_PROMPT,
                messages: [{ role: 'user', content: prompt }],
            });

            const resultText = response.content
                .filter(block => block.type === 'text')
                .map(block => block.text)
                .join('');

            const tokensUsed = (response.usage.input_tokens + response.usage.output_tokens);
            const costUsd = (response.usage.input_tokens * 0.003 + response.usage.output_tokens * 0.015) / 1000;

            const result: TaskResult = {
                summary: resultText,
                metrics: {
                    tokensUsed,
                    costUsd,
                    durationMs: 0, // Will be calculated by caller
                },
            };

            // Update executor session
            await serviceClient.from('executor_sessions').update({
                status: 'completed',
                ended_at: new Date().toISOString(),
                tokens_used: tokensUsed,
                cost_usd: costUsd,
            }).eq('session_id', sessionId);

            // Update task cost
            await taskService.updateCost(task.id, tokensUsed, costUsd);

            return {
                success: true,
                needsInput: false,
                result,
                tokensUsed,
                costUsd,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // Update executor session
            await serviceClient.from('executor_sessions').update({
                status: 'failed',
                ended_at: new Date().toISOString(),
            }).eq('session_id', sessionId);

            // Publish failure event
            await eventService.publish({
                source_kind: 'executor',
                source_id: sessionId,
                type: 'task.failed',
                task_id: task.id,
                user_id: context.userId,
                payload: { error: errorMessage },
                correlation_id: context.correlationId,
            });

            return {
                success: false,
                needsInput: false,
                error: {
                    code: 'RESEARCH_FAILED',
                    message: errorMessage,
                    recoverable: true,
                    suggestedAction: 'Retry the task',
                },
                tokensUsed: 0,
                costUsd: 0,
            };
        }
    }
}

export const researchAgent = new ResearchAgentExecutor();
