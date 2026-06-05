import { createSupabaseClient } from '@/lib/supabase/client';
import { Game, CreateGameData } from '../types';

/**
 * Data-access layer for chess games.
 * Mirrors the structure of the todos service (TodoService): a class with a
 * singleton export, all Supabase access funnelled through createSupabaseClient().
 * RLS guarantees a user can only read/write their own rows.
 */
export class GameService {
    /**
     * Get the current user's most recent games, newest first.
     */
    async getRecentGames(limit = 10): Promise<Game[]> {
        const supabase = await createSupabaseClient();

        const { data, error } = await supabase
            .from('games')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw new Error(error.message);
        }

        return data as Game[];
    }

    /**
     * Persist a finished game for the current user.
     */
    async saveGame(gameData: CreateGameData): Promise<Game> {
        const supabase = await createSupabaseClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('games')
            .insert({
                ...gameData,
                user_id: user.id,
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Game;
    }
}

// Export singleton instance (mirrors `todoService`)
export const gameService = new GameService();
