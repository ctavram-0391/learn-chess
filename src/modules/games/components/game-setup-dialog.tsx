'use client';

import { useState } from 'react';
import { Crown, Dices } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Difficulty, Side } from '../types';

interface GameSetupDialogProps {
    open: boolean;
    defaultDifficulty: Difficulty;
    defaultSide: Side;
    onStart: (difficulty: Difficulty, side: Side) => void;
}

const DIFFICULTIES: { value: Difficulty; label: string; hint: string }[] = [
    { value: 'easy', label: 'Easy', hint: 'Beginner' },
    { value: 'medium', label: 'Medium', hint: 'Challenging' },
    { value: 'hard', label: 'Hard', hint: 'Strong' },
];

const SIDES: { value: Side | 'random'; label: string; hint: string }[] = [
    { value: 'white', label: 'White', hint: 'You move first' },
    { value: 'black', label: 'Black', hint: 'Engine first' },
    { value: 'random', label: 'Random', hint: 'Surprise me' },
];

export function GameSetupDialog({
    open,
    defaultDifficulty,
    defaultSide,
    onStart,
}: GameSetupDialogProps) {
    const [difficulty, setDifficulty] = useState<Difficulty>(defaultDifficulty);
    const [side, setSide] = useState<Side | 'random'>(defaultSide);

    // Reset selections to the current settings whenever the dialog (re)opens.
    // Adjusting state during render on a prop change is the React-recommended
    // pattern here, rather than an effect.
    const [wasOpen, setWasOpen] = useState(open);
    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) {
            setDifficulty(defaultDifficulty);
            setSide(defaultSide);
        }
    }

    const start = () => {
        const resolved: Side =
            side === 'random' ? (Math.random() < 0.5 ? 'white' : 'black') : side;
        onStart(difficulty, resolved);
    };

    return (
        <Dialog open={open}>
            <DialogContent
                showCloseButton={false}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-md"
            >
                <DialogHeader>
                    <DialogTitle>New game</DialogTitle>
                    <DialogDescription>
                        Choose your difficulty and which side you&apos;ll play.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div>
                        <p className="mb-2 text-sm font-medium">Difficulty</p>
                        <div className="grid grid-cols-3 gap-2">
                            {DIFFICULTIES.map((d) => (
                                <button
                                    key={d.value}
                                    type="button"
                                    onClick={() => setDifficulty(d.value)}
                                    className={cn(
                                        'rounded-lg border p-3 text-center transition-colors',
                                        difficulty === d.value
                                            ? 'border-primary bg-primary/10'
                                            : 'hover:bg-muted',
                                    )}
                                >
                                    <div className="text-sm font-semibold">{d.label}</div>
                                    <div className="text-xs text-muted-foreground">{d.hint}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-sm font-medium">Play as</p>
                        <div className="grid grid-cols-3 gap-2">
                            {SIDES.map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    onClick={() => setSide(s.value)}
                                    className={cn(
                                        'flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors',
                                        side === s.value
                                            ? 'border-primary bg-primary/10'
                                            : 'hover:bg-muted',
                                    )}
                                >
                                    {s.value === 'random' ? (
                                        <Dices className="size-5" />
                                    ) : (
                                        <Crown
                                            className={cn(
                                                'size-5',
                                                s.value === 'white'
                                                    ? 'text-amber-500'
                                                    : 'text-foreground',
                                            )}
                                        />
                                    )}
                                    <div className="text-sm font-semibold">{s.label}</div>
                                    <div className="text-[11px] text-muted-foreground">{s.hint}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button className="w-full" onClick={start}>
                        Start game
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
