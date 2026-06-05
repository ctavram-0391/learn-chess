import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { TaskService } from '@/modules/jarvis/services/tasks';
import { taskFiltersSchema } from '@/modules/jarvis/validations';

export async function GET(request: Request) {
    try {
        const supabase = await createServerSupabaseClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filters = taskFiltersSchema.parse({
            status: searchParams.get('status') ?? undefined,
            needs_attention: searchParams.get('needs_attention') ?? undefined,
            priority: searchParams.get('priority') ?? undefined,
            limit: searchParams.get('limit') ?? undefined,
        });

        const taskService = new TaskService(() => supabase);
        const tasks = await taskService.getTasks(user.id, filters);

        return NextResponse.json({ tasks });
    } catch (error) {
        console.error('Tasks fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}
