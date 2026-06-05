'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Chess, DEFAULT_POSITION, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { StockfishEngine } from '../hooks/useStockfish';
import { useSaveGame } from '../hooks/useGames';
import { Difficulty, GameResult } from '../types';

interface ChessBoardProps {
    difficulty: Difficulty;
    /** Shared Stockfish engine (lifted to the page so the tutor can use it too). */
    engine: StockfishEngine;
    /** Optional move to draw as an arrow (e.g. the tutor's "best move" suggestion). */
    highlightMove?: { from: string; to: string } | null;
    /** Reports the live position (FEN) + SAN move history up to the parent (for the tutor). */
    onPositionChange?: (fen: string, history: string[]) => void;
}

export function ChessBoard({
    difficulty,
    engine,
    highlightMove,
    onPositionChange,
}: ChessBoardProps) {
    const gameRef = useRef(new Chess());
    const [fen, setFen] = useState(DEFAULT_POSITION);
    const [thinking, setThinking] = useState(false);
    const [moveFrom, setMoveFrom] = useState<string | null>(null);
    const [endResult, setEndResult] = useState<GameResult | null>(null);
    const savedRef = useRef(false);

    const { ready, getBestMove } = engine;
    const saveGame = useSaveGame();

    const notifyPosition = useCallback(() => {
        onPositionChange?.(gameRef.current.fen(), gameRef.current.history());
    }, [onPositionChange]);

    // Report the starting position once mounted.
    useEffect(() => {
        notifyPosition();
    }, [notifyPosition]);

    const persistIfOver = useCallback((): boolean => {
        const game = gameRef.current;
        if (!game.isGameOver()) return false;

        let result: GameResult;
        if (game.isCheckmate()) {
            // The side to move has been checkmated. Human is White.
            result = game.turn() === 'w' ? 'loss' : 'win';
        } else {
            result = 'draw'; // stalemate, threefold, insufficient material, 50-move
        }

        setEndResult(result);

        if (!savedRef.current) {
            savedRef.current = true;
            saveGame.mutate({
                result,
                move_count: game.history().length,
                difficulty,
                pgn: game.pgn(),
            });
        }
        return true;
    }, [difficulty, saveGame]);

    const makeEngineMove = useCallback(async () => {
        const game = gameRef.current;
        if (game.isGameOver()) return;

        setThinking(true);
        const uci = await getBestMove(game.fen(), difficulty);
        setThinking(false);
        if (!uci) return;

        const from = uci.slice(0, 2);
        const to = uci.slice(2, 4);
        const promotion = uci.length > 4 ? uci[4] : 'q';

        try {
            game.move({ from, to, promotion });
        } catch {
            return; // engine returned a move we couldn't apply; bail gracefully
        }
        setFen(game.fen());
        notifyPosition();
        persistIfOver();
    }, [difficulty, getBestMove, notifyPosition, persistIfOver]);

    /** Attempt a human (White) move; returns true if it was legal and applied. */
    const tryHumanMove = useCallback(
        (from: string, to: string): boolean => {
            const game = gameRef.current;
            if (thinking || game.isGameOver() || game.turn() !== 'w') return false;

            let move;
            try {
                move = game.move({ from, to, promotion: 'q' });
            } catch {
                return false; // illegal move -> reject
            }
            if (!move) return false;

            setFen(game.fen());
            notifyPosition();

            if (!persistIfOver()) {
                void makeEngineMove();
            }
            return true;
        },
        [thinking, notifyPosition, persistIfOver, makeEngineMove],
    );

    // Show legal-move hints while a piece is being dragged.
    const onPieceDrag = useCallback(
        ({ square }: { square: string | null }) => {
            const game = gameRef.current;
            if (thinking || game.isGameOver() || game.turn() !== 'w' || !square) return;
            const piece = game.get(square as Square);
            if (piece && piece.color === 'w') setMoveFrom(square);
        },
        [thinking],
    );

    // Drag-to-move (react-chessboard pointer drag)
    const onPieceDrop = useCallback(
        ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }) => {
            setMoveFrom(null); // clear hints on drop (valid or not)
            if (!targetSquare) return false;
            return tryHumanMove(sourceSquare, targetSquare);
        },
        [tryHumanMove],
    );

    // Click-to-move: first click selects a white piece, second click moves it.
    const onSquareClick = useCallback(
        ({ square }: { square: string }) => {
            const game = gameRef.current;
            if (thinking || game.isGameOver() || game.turn() !== 'w') return;

            if (!moveFrom) {
                const piece = game.get(square as Square);
                if (piece && piece.color === 'w') setMoveFrom(square);
                return;
            }

            if (square === moveFrom) {
                setMoveFrom(null);
                return;
            }

            const applied = tryHumanMove(moveFrom, square);
            if (!applied) {
                // Clicking another of your pieces re-selects it; otherwise clear.
                const piece = game.get(square as Square);
                setMoveFrom(piece && piece.color === 'w' ? square : null);
            } else {
                setMoveFrom(null);
            }
        },
        [moveFrom, thinking, tryHumanMove],
    );

    const newGame = useCallback(() => {
        gameRef.current = new Chess();
        savedRef.current = false;
        setFen(gameRef.current.fen());
        setThinking(false);
        setMoveFrom(null);
        setEndResult(null);
        notifyPosition();
    }, [notifyPosition]);

    const END_COPY: Record<GameResult, { title: string; description: string }> = {
        win: {
            title: 'Checkmate — you won! 🎉',
            description: 'Nicely played. Want to go again?',
        },
        loss: {
            title: 'Checkmate — you lost',
            description: 'Stockfish got you this time. Ready for a rematch?',
        },
        draw: {
            title: 'Game over — draw',
            description: 'Neither side could break through. Play another?',
        },
    };

    // Render-only view of the position derived from `fen` state (never read the
    // mutable gameRef during render — that can produce stale UI).
    const view = useMemo(() => new Chess(fen), [fen]);
    const isOver = view.isGameOver();
    const statusText = isOver
        ? view.isCheckmate()
            ? view.turn() === 'w'
                ? 'Checkmate — you lost'
                : 'Checkmate — you won!'
            : 'Game over — draw'
        : view.turn() === 'w'
            ? view.inCheck()
                ? 'Your move — you are in check'
                : 'Your move (White)'
            : 'Stockfish is replying…';

    // Highlight the selected/held piece and dot its legal destinations.
    const squareStyles = useMemo<Record<string, CSSProperties>>(() => {
        if (!moveFrom) return {};
        const styles: Record<string, CSSProperties> = {
            [moveFrom]: { background: 'rgba(255, 216, 102, 0.55)' },
        };
        for (const move of view.moves({ square: moveFrom as Square, verbose: true })) {
            const isCapture = Boolean(move.captured) || move.flags.includes('e');
            styles[move.to] = isCapture
                ? { background: 'radial-gradient(circle, transparent 68%, rgba(90,90,90,0.45) 69%)' }
                : { background: 'radial-gradient(circle, rgba(90,90,90,0.45) 22%, transparent 23%)' };
        }
        return styles;
    }, [moveFrom, view]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{statusText}</span>
                    {thinking && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                </div>
                <Button variant="outline" size="sm" onClick={newGame}>
                    New Game
                </Button>
            </div>

            <div className="mx-auto w-full max-w-[480px]">
                <Chessboard
                    options={{
                        id: 'learn-chess-board',
                        position: fen,
                        boardOrientation: 'white',
                        allowDragging: ready && !thinking && !isOver,
                        onPieceDrag,
                        onPieceDrop,
                        onSquareClick,
                        squareStyles,
                        arrows: highlightMove
                            ? [
                                  {
                                      startSquare: highlightMove.from,
                                      endSquare: highlightMove.to,
                                      color: 'rgba(21, 128, 61, 0.75)',
                                  },
                              ]
                            : [],
                    }}
                />
            </div>

            {!ready && (
                <p className="text-center text-xs text-muted-foreground">
                    Loading chess engine…
                </p>
            )}
            <div className="flex justify-center">
                <Badge variant="secondary" className="capitalize">
                    Difficulty: {difficulty}
                </Badge>
            </div>

            <AlertDialog
                open={endResult !== null}
                onOpenChange={(open) => {
                    if (!open) setEndResult(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {endResult ? END_COPY[endResult].title : ''}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {endResult ? END_COPY[endResult].description : ''}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Review board</AlertDialogCancel>
                        <AlertDialogAction onClick={newGame}>New Game</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
