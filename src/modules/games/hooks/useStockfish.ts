'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Difficulty } from '../types';

interface DifficultySetting {
    /** UCI "Skill Level" (0-20). Lower = weaker / more mistakes. */
    skill: number;
    /** Search depth. Lower = shallower / weaker. */
    depth: number;
}

/**
 * Difficulty -> engine strength mapping.
 * We use Skill Level + depth (NOT UCI_Elo): Stockfish's Elo limiter floors
 * around ~1320, which is far too strong for a true-beginner "Easy".
 */
export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySetting> = {
    easy: { skill: 1, depth: 4 },
    medium: { skill: 8, depth: 10 },
    hard: { skill: 18, depth: 14 },
};

/**
 * Loads Stockfish (single-threaded WASM build from /public/stockfish) inside a
 * Web Worker and exposes a promise-based `getBestMove`.
 *
 * Client-only: the worker is created inside useEffect so it never runs during SSR.
 * The single-threaded "lite" build needs no COOP/COEP cross-origin-isolation headers.
 */
export function useStockfish() {
    const workerRef = useRef<Worker | null>(null);
    // Serializes engine requests so the single shared worker handles one
    // `go` at a time (the board's reply and the tutor's "best move" can't interleave).
    const queueRef = useRef<Promise<unknown>>(Promise.resolve());
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let cancelled = false;
        // The build resolves its wasm as `<dir>/stockfish.wasm` relative to this script.
        const worker = new Worker('/stockfish/stockfish.js');
        workerRef.current = worker;

        const onMessage = (event: MessageEvent) => {
            const line = typeof event.data === 'string' ? event.data : '';
            // UCI handshake: uci -> uciok -> isready -> readyok
            if (line === 'uciok') {
                worker.postMessage('isready');
            } else if (line === 'readyok') {
                if (!cancelled) setReady(true);
            }
        };

        worker.addEventListener('message', onMessage);
        worker.postMessage('uci');

        return () => {
            cancelled = true;
            worker.removeEventListener('message', onMessage);
            try {
                worker.postMessage('quit');
            } catch {
                // worker may already be terminating
            }
            worker.terminate();
            workerRef.current = null;
        };
    }, []);

    /**
     * Ask the engine for the best move from a FEN at the given difficulty.
     * Resolves a UCI move string (e.g. "e7e5", or "e7e8q" for a promotion),
     * or null if the engine has no move / isn't available.
     */
    const getBestMove = useCallback(
        (fen: string, difficulty: Difficulty): Promise<string | null> => {
            const run = () =>
                new Promise<string | null>((resolve) => {
                    const worker = workerRef.current;
                    if (!worker) {
                        resolve(null);
                        return;
                    }

                    const { skill, depth } = DIFFICULTY_SETTINGS[difficulty];

                    const handler = (event: MessageEvent) => {
                        const line = typeof event.data === 'string' ? event.data : '';
                        if (line.startsWith('bestmove')) {
                            worker.removeEventListener('message', handler);
                            const best = line.split(' ')[1];
                            resolve(best && best !== '(none)' ? best : null);
                        }
                    };

                    worker.addEventListener('message', handler);
                    worker.postMessage(`setoption name Skill Level value ${skill}`);
                    worker.postMessage(`position fen ${fen}`);
                    worker.postMessage(`go depth ${depth}`);
                });

            // Chain onto the queue so requests never overlap on the shared worker.
            const result = queueRef.current.then(run, run);
            queueRef.current = result.catch(() => undefined);
            return result;
        },
        [],
    );

    return { ready, getBestMove };
}

/** Shape returned by useStockfish, for passing the shared engine via props. */
export type StockfishEngine = ReturnType<typeof useStockfish>;
