'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { MoveTracker } from '@/modules/games/components/move-tracker';
import { Difficulty } from '@/modules/games/types';

// Load the board client-only: it spins up a Web Worker (Stockfish) and
// react-chessboard touches the DOM, so it must never render during SSR.
const ChessBoard = dynamic(
    () => import('@/modules/games/components/chess-board').then((m) => m.ChessBoard),
    {
        ssr: false,
        loading: () => <Skeleton className="mx-auto aspect-square w-full max-w-[480px]" />,
    },
);

export default function ChessPage() {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [history, setHistory] = useState<string[]>([]);

    // Stable handler so the board's position-change effect doesn't re-fire each render.
    const handlePositionChange = useCallback((_fen: string, moves: string[]) => {
        setHistory(moves);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Play Chess</h1>
                    <p className="text-muted-foreground">
                        Play against the Stockfish engine and sharpen your game.
                    </p>
                </div>
                <div className="w-44">
                    <label className="mb-1 block text-sm font-medium">Difficulty</label>
                    <Select
                        value={difficulty}
                        onValueChange={(value) => setDifficulty(value as Difficulty)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Board</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChessBoard
                            difficulty={difficulty}
                            onPositionChange={handlePositionChange}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Moves</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MoveTracker history={history} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
