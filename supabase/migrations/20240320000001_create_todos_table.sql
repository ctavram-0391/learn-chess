-- Create todos table
CREATE TABLE IF NOT EXISTS public.todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT false,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own todos
CREATE POLICY "Users can view own todos" ON public.todos
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own todos
CREATE POLICY "Users can insert own todos" ON public.todos
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own todos
CREATE POLICY "Users can update own todos" ON public.todos
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own todos
CREATE POLICY "Users can delete own todos" ON public.todos
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON public.todos (user_id);
CREATE INDEX IF NOT EXISTS todos_completed_idx ON public.todos (completed);
CREATE INDEX IF NOT EXISTS todos_priority_idx ON public.todos (priority);
CREATE INDEX IF NOT EXISTS todos_due_date_idx ON public.todos (due_date);
CREATE INDEX IF NOT EXISTS todos_created_at_idx ON public.todos (created_at);

-- Create updated_at trigger
CREATE TRIGGER set_todos_updated_at
    BEFORE UPDATE ON public.todos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create categories table for better organization
CREATE TABLE IF NOT EXISTS public.todo_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#6b7280',
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(name, user_id)
);

-- Enable Row Level Security for categories
ALTER TABLE public.todo_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can view own categories" ON public.todo_categories
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON public.todo_categories
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON public.todo_categories
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON public.todo_categories
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for categories
CREATE INDEX IF NOT EXISTS todo_categories_user_id_idx ON public.todo_categories (user_id);
CREATE INDEX IF NOT EXISTS todo_categories_name_idx ON public.todo_categories (name);

-- Create updated_at trigger for categories
CREATE TRIGGER set_todo_categories_updated_at
    BEFORE UPDATE ON public.todo_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert default categories for new users (optional)
-- This would typically be done via a trigger or application logic
-- For now, we'll handle this in the application code
