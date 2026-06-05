import { inngest } from '../../client';
import { createServiceRoleClient } from '@/lib/supabase/service-role-client';
import { DecompositionService } from '@/modules/jarvis/services/decomposition';
import { TaskService } from '@/modules/jarvis/services/tasks';
import { EventService } from '@/modules/jarvis/services/events';
import type { DispatchRequest } from '@/modules/jarvis/types';

export const decomposeTask = inngest.createFunction(
    { id: 'jarvis-decompose-task', retries: 2 },
    { event: 'jarvis/task.decompose' },
    async ({ event, step }) => {
        const { taskId, userId, request } = event.data as {
            taskId: string;
            userId: string;
            request: DispatchRequest;
        };

        const serviceClient = createServiceRoleClient();
        const taskService = new TaskService(() => serviceClient);
        const eventService = new EventService(() => serviceClient);
        const decompositionService = new DecompositionService();

        // Step 1: Decompose the task
        const result = await step.run('decompose', async () => {
            return decompositionService.decompose(request);
        });

        // Step 2: Create subtasks and set up dependencies
        const subtaskIds = await step.run('create-subtasks', async () => {
            const ids: string[] = [];

            // Create all subtasks first
            for (const subtask of result.subtasks) {
                const created = await taskService.createTask({
                    user_id: userId,
                    description: subtask.description,
                    originating_dispatch: request.description,
                    priority: request.priority ?? 'medium',
                    parent_id: taskId,
                    executor_type: subtask.executor_type,
                    context_summary: request.context,
                });
                ids.push(created.id);
            }

            // Set up dependencies
            for (let i = 0; i < result.subtasks.length; i++) {
                for (const depIndex of result.subtasks[i].depends_on_indices) {
                    if (depIndex >= 0 && depIndex < ids.length && depIndex !== i) {
                        await taskService.addDependency(ids[i], ids[depIndex]);
                    }
                }
            }

            // Mark tasks without dependencies as queued
            for (let i = 0; i < result.subtasks.length; i++) {
                if (result.subtasks[i].depends_on_indices.length === 0) {
                    await taskService.updateTaskStatus(ids[i], 'queued');
                }
            }

            return ids;
        });

        // Step 3: Publish decomposition event
        await step.run('publish-event', async () => {
            await eventService.publish({
                source_kind: 'system',
                type: 'task.decomposed',
                task_id: taskId,
                user_id: userId,
                payload: {
                    subtask_count: subtaskIds.length,
                    subtask_ids: subtaskIds,
                    reasoning: result.reasoning,
                },
            });

            // Update parent task status
            await taskService.updateTaskStatus(taskId, 'queued');
        });

        // Step 4: Trigger execution of ready tasks
        await step.run('trigger-execution', async () => {
            const runnableTasks = await taskService.getNextRunnableTasks(userId);
            for (const task of runnableTasks) {
                await inngest.send({
                    name: 'jarvis/task.execute',
                    data: { taskId: task.id, userId },
                });
            }
        });

        return { subtaskIds, reasoning: result.reasoning };
    }
);
