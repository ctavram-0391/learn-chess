import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { inngest } from '@/lib/inngest/client';
import { TaskService } from '@/modules/jarvis/services/tasks';
import { EventService } from '@/modules/jarvis/services/events';
import { AttentionService } from '@/modules/jarvis/services/attention';
import { taskResponseSchema } from '@/modules/jarvis/validations';

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const parsed = taskResponseSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const taskService = new TaskService(() => supabase);
        const eventService = new EventService(() => supabase);
        const attentionService = new AttentionService(() => supabase);

        // Verify task exists and belongs to user
        const task = await taskService.getTaskById(parsed.data.task_id);
        if (!task || task.user_id !== user.id) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        if (task.status !== 'needs_input') {
            return NextResponse.json(
                { error: 'Task is not waiting for input' },
                { status: 400 }
            );
        }

        // Publish input received event
        await eventService.publish({
            source_kind: 'user',
            type: 'task.input_received',
            task_id: task.id,
            user_id: user.id,
            payload: { response: parsed.data.response },
        });

        // Resolve attention and notifications
        await taskService.resolveAttention(task.id);
        await attentionService.resolveTaskNotifications(task.id, 'dashboard');

        // Resume execution via Inngest
        await inngest.send({
            name: 'jarvis/task.execute',
            data: { taskId: task.id, userId: user.id },
        });

        return NextResponse.json({ success: true, task_id: task.id });
    } catch (error) {
        console.error('Respond error:', error);
        return NextResponse.json(
            { error: 'Failed to respond to task' },
            { status: 500 }
        );
    }
}
