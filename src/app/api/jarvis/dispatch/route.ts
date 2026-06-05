import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { inngest } from '@/lib/inngest/client';
import { TaskService } from '@/modules/jarvis/services/tasks';
import { EventService } from '@/modules/jarvis/services/events';
import { dispatchRequestSchema } from '@/modules/jarvis/validations';

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const parsed = dispatchRequestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid request', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const taskService = new TaskService(() => supabase);
        const eventService = new EventService(() => supabase);

        // Create parent task
        const task = await taskService.createTask({
            user_id: user.id,
            description: parsed.data.description,
            originating_dispatch: parsed.data.description,
            priority: parsed.data.priority,
            context_summary: parsed.data.context,
            budget_usd: parsed.data.budget_usd,
        });

        // Publish task.created event
        await eventService.publish({
            source_kind: 'jarvis',
            type: 'task.created',
            task_id: task.id,
            user_id: user.id,
            payload: {
                description: parsed.data.description,
                priority: parsed.data.priority,
            },
        });

        // Trigger decomposition via Inngest
        await inngest.send({
            name: 'jarvis/task.decompose',
            data: {
                taskId: task.id,
                userId: user.id,
                request: parsed.data,
            },
        });

        return NextResponse.json({ task });
    } catch (error) {
        console.error('Dispatch error:', error);
        return NextResponse.json(
            { error: 'Failed to dispatch task' },
            { status: 500 }
        );
    }
}
