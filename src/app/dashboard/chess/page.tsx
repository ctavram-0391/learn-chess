'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { DEFAULT_POSITION } from 'chess.js';
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
import { TutorChat } from '@/modules/games/components/tutor-chat';
import { useStockfish } from '@/modules/games/hooks/useStockfish';
import { Difficulty } from '@/modules/games/types';

// Load the board client-only: it uses the Web Worker engine and react-chessboard
// touches the DOM, so it must never render during SSR.
const ChessBoard = dynamic(
    () => import('@/modules/games/components/chess-board').then((m) => m.ChessBoard),
    {
        ssr: false,
        loading: () => <Skeleton className="mx-auto aspect-square w-full max-w-[480px]" />,
    },
);

export default function ChessPage() {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [fen, setFen] = useState(DEFAULT_POSITION);
    const [history, setHistory] = useState<string[]>([]);
    const [bestMoveArrow, setBestMoveArrow] = useState<{ from: string; to: string } | null>(null);

    // One shared engine for both the board (Black's replies) and the tutor (best move).
    const engine = useStockfish();

    // Stable handler so the board's position-change effect doesn't re-fire each render.
    // Clearing the arrow here removes the suggestion once the position changes.
    const handlePositionChange = useCallback((nextFen: string, moves: string[]) => {
        setFen(nextFen);
        setHistory(moves);
        setBestMoveArrow(null);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Play Chess</h1>
                    <p className="text-muted-foreground">
                        Play against Stockfish and ask the AI tutor for help as you go.
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

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Moves — left */}
                <Card className="order-2 lg:order-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Moves</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MoveTracker history={history} />
                    </CardContent>
                </Card>

                {/* Board — center */}
                <Card className="order-1 lg:order-2 lg:col-span-5">
                    <CardHeader>
                        <CardTitle>Board</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChessBoard
                            difficulty={difficulty}
                            engine={engine}
                            highlightMove={bestMoveArrow}
                            onPositionChange={handlePositionChange}
                        />
                    </CardContent>
                </Card>

                {/* AI tutor — right */}
                <Card className="order-3 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>AI Tutor</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TutorChat
                            fen={fen}
                            history={history}
                            engine={engine}
                            onBestMove={setBestMoveArrow}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
