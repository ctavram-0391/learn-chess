-- ═══════════════════════════════════════════
-- JARVIS: Tasks
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'queued', 'running', 'needs_input', 'completed', 'failed', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    executor_type TEXT
        CHECK (executor_type IS NULL OR executor_type IN ('research')),
    session_id TEXT,
    description TEXT NOT NULL,
    context_summary TEXT,
    originating_dispatch TEXT NOT NULL,
    requires_attention BOOLEAN NOT NULL DEFAULT false,
    attention_reason TEXT,
    attention_priority TEXT
        CHECK (attention_priority IS NULL OR attention_priority IN ('low', 'medium', 'high', 'urgent')),
    budget_usd NUMERIC,
    spent_usd NUMERIC NOT NULL DEFAULT 0,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    result_json JSONB,
    error_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all tasks" ON public.tasks
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_attention ON public.tasks(requires_attention) WHERE requires_attention = true;
CREATE INDEX idx_tasks_parent ON public.tasks(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at);

CREATE TRIGGER set_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════
-- JARVIS: Task Dependencies
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.task_dependencies (
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    depends_on UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, depends_on)
);

ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task dependencies" ON public.task_dependencies
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.task_id AND tasks.user_id = auth.uid())
    );
CREATE POLICY "Users can insert own task dependencies" ON public.task_dependencies
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.task_id AND tasks.user_id = auth.uid())
    );
CREATE POLICY "Users can delete own task dependencies" ON public.task_dependencies
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = task_dependencies.task_id AND tasks.user_id = auth.uid())
    );
CREATE POLICY "Service role can manage all task dependencies" ON public.task_dependencies
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- ═══════════════════════════════════════════
-- JARVIS: Events (Event Bus)
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    source_kind TEXT NOT NULL
        CHECK (source_kind IN ('user', 'jarvis', 'executor', 'system')),
    source_id TEXT,
    type TEXT NOT NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payload JSONB NOT NULL DEFAULT '{}',
    correlation_id TEXT,
    parent_event_id TEXT REFERENCES public.events(id) ON DELETE SET NULL
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events" ON public.events
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage all events" ON public.events
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE INDEX idx_events_task_id ON public.events(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_events_type ON public.events(type);
CREATE INDEX idx_events_timestamp ON public.events(timestamp);
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_correlation ON public.events(correlation_id) WHERE correlation_id IS NOT NULL;

-- ═══════════════════════════════════════════
-- JARVIS: Notifications
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    dashboard_surfaced_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    dashboard_actioned BOOLEAN NOT NULL DEFAULT false,
    conversation_decision JSONB NOT NULL DEFAULT '{}',
    conversation_surfaced BOOLEAN NOT NULL DEFAULT false,
    resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_via TEXT
        CHECK (resolved_via IS NULL OR resolved_via IN ('dashboard', 'conversation', 'timeout')),
    resolved_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage all notifications" ON public.notifications
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE INDEX idx_notifications_unresolved ON public.notifications(resolved) WHERE resolved = false;
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_task ON public.notifications(task_id);

-- ═══════════════════════════════════════════
-- JARVIS: Messages (Conversation Memory)
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL
        CHECK (role IN ('user', 'assistant', 'system', 'tool')),
    content TEXT NOT NULL,
    tool_calls JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON public.messages
    FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage all messages" ON public.messages
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE INDEX idx_messages_user ON public.messages(user_id);
CREATE INDEX idx_messages_created ON public.messages(created_at);

-- ═══════════════════════════════════════════
-- JARVIS: Executor Sessions
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.executor_sessions (
    session_id TEXT PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    executor_type TEXT NOT NULL
        CHECK (executor_type IN ('research')),
    status TEXT NOT NULL DEFAULT 'running',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    tokens_used INTEGER NOT NULL DEFAULT 0,
    cost_usd NUMERIC NOT NULL DEFAULT 0
);

ALTER TABLE public.executor_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own executor sessions" ON public.executor_sessions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.tasks WHERE tasks.id = executor_sessions.task_id AND tasks.user_id = auth.uid())
    );
CREATE POLICY "Service role can manage all executor sessions" ON public.executor_sessions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
