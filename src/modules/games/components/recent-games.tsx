'use client';

import { formatDistanceToNow } from 'date-fns';
import { Trophy, Flag, Handshake, Hash, Gauge } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentGames } from '../hooks/useGames';
import { GameResult } from '../types';

const RESULT_META: Record<
    GameResult,
    { label: string; icon: typeof Trophy; iconClass: string; ring: string }
> = {
    win: {
        label: 'Win',
        icon: Trophy,
        iconClass: 'text-emerald-600',
        ring: 'bg-emerald-500/10',
    },
    loss: {
        label: 'Loss',
        icon: Flag,
        iconClass: 'text-red-600',
        ring: 'bg-red-500/10',
    },
    draw: {
        label: 'Draw',
        icon: Handshake,
        iconClass: 'text-amber-600',
        ring: 'bg-amber-500/10',
    },
};

export function RecentGames({ limit = 20 }: { limit?: number }) {
    const { data: games, isLoading } = useRecentGames(limit);

    if (isLoading) {
        return (
            <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                ))}
            </div>
        );
    }

    if (!games || games.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                <Trophy className="mb-3 size-8 text-muted-foreground/60" />
                <p className="font-medium">No games yet</p>
                <p className="text-sm text-muted-foreground">
                    Finish a game on the Play Chess page and it will show up here.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {games.map((game) => {
                const meta = RESULT_META[game.result];
                const Icon = meta.icon;
                return (
                    <div
                        key={game.id}
                        className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/40"
                    >
                        <div
                            className={`flex size-11 shrink-0 items-center justify-center rounded-full ${meta.ring}`}
                        >
                            <Icon className={`size-5 ${meta.iconClass}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold">{meta.label}</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(game.created_at), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1 capitalize">
                                    <Gauge className="size-3.5" />
                                    {game.difficulty}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Hash className="size-3.5" />
                                    {game.move_count} moves
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
