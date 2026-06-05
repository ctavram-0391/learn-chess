-- Create games table (chess games played vs the Stockfish opponent)
-- Mirrors the RLS + conventions of the todos table so users only see their own rows.
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    result TEXT NOT NULL CHECK (result IN ('win', 'loss', 'draw')),
    move_count INTEGER NOT NULL DEFAULT 0,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    pgn TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Policies: a user can only access their own games (mirrors the todos policies)
CREATE POLICY "Users can view own games" ON public.games
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own games" ON public.games
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own games" ON public.games
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own games" ON public.games
    FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes for the common access pattern (a user's recent games, newest first)
CREATE INDEX IF NOT EXISTS games_user_id_idx ON public.games (user_id);
CREATE INDEX IF NOT EXISTS games_created_at_idx ON public.games (created_at);
