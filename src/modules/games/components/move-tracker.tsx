'use client';

import { ScrollArea } from '@/components/ui/scroll-area';

interface MoveTrackerProps {
    /** SAN move history of the current game, e.g. ["e4", "e5", "Bc4", ...]. */
    history: string[];
}

/**
 * Scoresheet-style tracker for the moves of the in-progress game.
 * White and Black moves are paired by move number; the latest move is highlighted.
 */
export function MoveTracker({ history }: MoveTrackerProps) {
    if (history.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No moves yet. Make your first move to start the game.
            </p>
        );
    }

    const rows = [];
    for (let i = 0; i < history.length; i += 2) {
        rows.push({
            number: i / 2 + 1,
            white: { san: history[i], index: i },
            black: history[i + 1]
                ? { san: history[i + 1], index: i + 1 }
                : null,
        });
    }

    const lastIndex = history.length - 1;

    return (
        <ScrollArea className="h-[320px] pr-3">
            <ol className="space-y-0.5 text-sm">
                {rows.map((row) => (
                    <li
                        key={row.number}
                        className="grid grid-cols-[2.5rem_1fr_1fr] items-center gap-2 rounded-md px-2 py-1 odd:bg-muted/40"
                    >
                        <span className="tabular-nums text-muted-foreground">{row.number}.</span>
                        <span
                            className={
                                row.white.index === lastIndex
                                    ? 'rounded bg-primary/15 px-1 font-semibold'
                                    : 'font-medium'
                            }
                        >
                            {row.white.san}
                        </span>
                        <span
                            className={
                                row.black?.index === lastIndex
                                    ? 'rounded bg-primary/15 px-1 font-semibold'
                                    : 'font-medium text-muted-foreground'
                            }
                        >
                            {row.black?.san ?? ''}
                        </span>
                    </li>
                ))}
            </ol>
        </ScrollArea>
    );
}
