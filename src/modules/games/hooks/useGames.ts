'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gameService } from '../services/games';
import { CreateGameData } from '../types';
import { toast } from 'sonner';

// Query keys (mirrors todoKeys)
export const gameKeys = {
    all: ['games'] as const,
    lists: () => [...gameKeys.all, 'list'] as const,
    list: (limit?: number) => [...gameKeys.lists(), limit] as const,
};

/**
 * Hook to fetch the current user's recent games.
 */
export function useRecentGames(limit = 10) {
    return useQuery({
        queryKey: gameKeys.list(limit),
        queryFn: () => gameService.getRecentGames(limit),
        staleTime: 30 * 1000, // 30 seconds
    });
}

/**
 * Hook to persist a finished game.
 */
export function useSaveGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateGameData) => gameService.saveGame(data),
        onSuccess: () => {
            // Refresh the recent-games list once a new game is saved
            queryClient.invalidateQueries({ queryKey: gameKeys.lists() });
            toast.success('Game saved to your history');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to save game');
        },
    });
}
