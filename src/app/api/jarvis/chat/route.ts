import { streamText, tool, stepCountIs, convertToModelMessages } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { inngest } from '@/lib/inngest/client';
import { TaskService } from '@/modules/jarvis/services/tasks';
import { EventService } from '@/modules/jarvis/services/events';
import { AttentionService } from '@/modules/jarvis/services/attention';

const JARVIS_SYSTEM_PROMPT = `You are Jarvis, a proactive personal AI assistant. You help the user with anything they need — answering questions, doing research, managing tasks, and more.

You have three special tools for managing background work:

1. **dispatch** — Send a task to run in the background. Use this for research, analysis, or any work that takes more than a few seconds. Tell the user you're kicking it off.

2. **check_tasks** — See what's happening with background tasks. Use this when the user asks about task status, or proactively when you sense they want an update.

3. **respond_to_task** — Send the user's answer to a task that's waiting for input.

Guidelines:
- Be conversational and natural. You're a helpful assistant, not a command executor.
- For quick questions, just answer directly — don't dispatch everything.
- For substantial research, analysis, or multi-step work, dispatch it to run in the background.
- When dispatching, briefly acknowledge what you're starting and suggest what to do while waiting.
- Keep responses concise but warm.`;

export async function POST(request: Request) {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { messages } = await request.json();
    const taskService = new TaskService(() => supabase);
    const eventService = new EventService(() => supabase);
    const attentionService = new AttentionService(() => supabase);

    // Get pending notifications to include as context
    const notifications = await attentionService.getUnresolvedNotifications(user.id);
    let systemPrompt = JARVIS_SYSTEM_PROMPT;

    if (notifications.length > 0) {
        const notifSummary = notifications
            .slice(0, 5)
            .map(n => `- [Task ${n.task_id}]: ${n.conversation_decision.reason}`)
            .join('\n');
        systemPrompt += `\n\n[BACKGROUND UPDATES — ${notifications.length} pending]\n${notifSummary}`;
    }

    // Convert UIMessage[] (from useChat client) → ModelMessage[] (for streamText)
    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
        model: anthropic('claude-sonnet-4-5-20250929'),
        system: systemPrompt,
        messages: modelMessages,
        tools: {
            dispatch: tool({
                description: 'Dispatch a task to run in the background. Use for research, analysis, or any substantial work.',
                inputSchema: z.object({
                    description: z.string().describe('What the task should accomplish'),
                    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium')
                        .describe('Task priority'),
                    context: z.string().optional()
                        .describe('Additional context from the conversation'),
                }),
                execute: async ({ description, priority, context }) => {
                    const task = await taskService.createTask({
                        user_id: user.id,
                        description,
                        originating_dispatch: description,
                        priority,
                        context_summary: context,
                    });

                    await eventService.publish({
                        source_kind: 'jarvis',
                        type: 'task.created',
                        task_id: task.id,
                        user_id: user.id,
                        payload: { description, priority },
                    });

                    await inngest.send({
                        name: 'jarvis/task.decompose',
                        data: {
                            taskId: task.id,
                            userId: user.id,
                            request: { description, priority, context },
                        },
                    });

                    return {
                        success: true,
                        task_id: task.id,
                        message: `Task dispatched: "${description}"`,
                    };
                },
            }),

            check_tasks: tool({
                description: 'Check the status of background tasks. Returns a summary of active and recent tasks.',
                inputSchema: z.object({
                    filter: z.enum(['needs_attention', 'active', 'completed', 'all']).default('all')
                        .describe('Filter tasks by category'),
                }),
                execute: async ({ filter }) => {
                    let tasks;
                    switch (filter) {
                        case 'needs_attention':
                            tasks = await taskService.getTasksNeedingAttention(user.id);
                            break;
                        case 'active':
                            tasks = await taskService.getActiveTasks(user.id);
                            break;
                        case 'completed':
                            tasks = await taskService.getCompletedTasks(user.id, 10);
                            break;
                        default:
                            tasks = await taskService.getTasks(user.id, { limit: 20 });
                    }

                    if (tasks.length === 0) {
                        return { message: 'No tasks found.', tasks: [] };
                    }

                    const summary = tasks.map(t => ({
                        id: t.id,
                        description: t.description,
                        status: t.status,
                        priority: t.priority,
                        requires_attention: t.requires_attention,
                        attention_reason: t.attention_reason,
                        result_summary: t.result_json?.summary?.slice(0, 200),
                        created_at: t.created_at,
                    }));

                    return { message: `Found ${tasks.length} tasks.`, tasks: summary };
                },
            }),

            respond_to_task: tool({
                description: 'Send user input to a task that is waiting for a response.',
                inputSchema: z.object({
                    task_id: z.string().describe('The ID of the task to respond to'),
                    response: z.string().describe("The user's response or decision"),
                }),
                execute: async ({ task_id, response }) => {
                    const task = await taskService.getTaskById(task_id);
                    if (!task || task.user_id !== user.id) {
                        return { success: false, error: 'Task not found' };
                    }
                    if (task.status !== 'needs_input') {
                        return { success: false, error: 'Task is not waiting for input' };
                    }

                    await eventService.publish({
                        source_kind: 'user',
                        type: 'task.input_received',
                        task_id: task.id,
                        user_id: user.id,
                        payload: { response },
                    });

                    await taskService.resolveAttention(task.id);
                    await attentionService.resolveTaskNotifications(task.id, 'conversation');

                    await inngest.send({
                        name: 'jarvis/task.execute',
                        data: { taskId: task.id, userId: user.id },
                    });

                    return { success: true, message: 'Response sent, task resuming.' };
                },
            }),
        },
        stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
}
