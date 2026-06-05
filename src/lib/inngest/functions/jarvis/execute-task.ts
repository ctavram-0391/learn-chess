import { inngest } from '../../client';
import { createServiceRoleClient } from '@/lib/supabase/service-role-client';
import { TaskService } from '@/modules/jarvis/services/tasks';
import { EventService } from '@/modules/jarvis/services/events';
import { AttentionService } from '@/modules/jarvis/services/attention';
import { researchAgent } from '@/modules/jarvis/services/research-agent';

export const executeTask = inngest.createFunction(
    { id: 'jarvis-execute-task', retries: 2 },
    { event: 'jarvis/task.execute' },
    async ({ event, step }) => {
        const { taskId, userId } = event.data as {
            taskId: string;
            userId: string;
        };

        const serviceClient = createServiceRoleClient();
        const taskService = new TaskService(() => serviceClient);
        const eventService = new EventService(() => serviceClient);
        const attentionService = new AttentionService(() => serviceClient);

        // Step 1: Load task and validate
        const task = await step.run('load-task', async () => {
            const t = await taskService.getTaskById(taskId);
            if (!t) throw new Error(`Task ${taskId} not found`);
            return t;
        });

        // Step 2: Check dependencies
        await step.run('check-dependencies', async () => {
            const met = await taskService.areDependenciesMet(taskId);
            if (!met) {
                throw new Error('Dependencies not yet met — will be retried when dependencies complete');
            }
        });

        // Step 3: Execute via research agent
        const result = await step.run('execute', async () => {
            return researchAgent.execute(task, {
                userId,
                parentTaskId: task.parent_id ?? undefined,
            });
        });

        // Step 4: Handle result
        await step.run('handle-result', async () => {
            if (result.needsInput) {
                await taskService.updateTaskStatus(taskId, 'needs_input');
                await taskService.flagForAttention(
                    taskId,
                    result.inputRequest?.question ?? 'Task needs your input',
                    task.priority
                );

                const needsInputEvent = await eventService.publish({
                    source_kind: 'executor',
                    type: 'task.needs_input',
                    task_id: taskId,
                    user_id: userId,
                    payload: {
                        question: result.inputRequest?.question,
                        options: result.inputRequest?.options,
                    },
                });

                await attentionService.flagTaskAndNotify(
                    { ...task, status: 'needs_input' },
                    needsInputEvent,
                    result.inputRequest?.question ?? 'Task needs your input',
                    task.priority
                );
            } else if (result.success) {
                await taskService.updateTaskStatus(taskId, 'completed', {
                    result_json: result.result ?? null,
                });

                const completedEvent = await eventService.publish({
                    source_kind: 'executor',
                    type: 'task.completed',
                    task_id: taskId,
                    user_id: userId,
                    payload: {
                        summary: result.result?.summary?.slice(0, 500),
                        tokens_used: result.tokensUsed,
                        cost_usd: result.costUsd,
                    },
                });

                await attentionService.flagTaskAndNotify(
                    { ...task, status: 'completed' },
                    completedEvent,
                    'Task completed',
                    task.priority
                );
            } else {
                await taskService.updateTaskStatus(taskId, 'failed', {
                    error_json: result.error ?? null,
                });

                const failedEvent = await eventService.publish({
                    source_kind: 'executor',
                    type: 'task.failed',
                    task_id: taskId,
                    user_id: userId,
                    payload: {
                        error: result.error?.message,
                        recoverable: result.error?.recoverable,
                    },
                });

                await taskService.flagForAttention(
                    taskId,
                    result.error?.message ?? 'Task failed',
                    'high'
                );

                await attentionService.flagTaskAndNotify(
                    { ...task, status: 'failed' },
                    failedEvent,
                    result.error?.message ?? 'Task failed',
                    'high'
                );
            }
        });

        // Step 5: Check for next runnable dependent tasks
        if (result.success) {
            await step.run('trigger-dependents', async () => {
                const runnableTasks = await taskService.getNextRunnableTasks(userId);
                for (const nextTask of runnableTasks) {
                    await inngest.send({
                        name: 'jarvis/task.execute',
                        data: { taskId: nextTask.id, userId },
                    });
                }
            });
        }

        return { success: result.success, taskId };
    }
);
