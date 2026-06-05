'use client';

import { useMemo, useRef, useState } from 'react';
import { Chess, type Square } from 'chess.js';
import { Lightbulb, Sparkles, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StockfishEngine } from '../hooks/useStockfish';
import { Side } from '../types';

interface TutorChatProps {
    fen: string;
    history: string[];
    humanColor: Side;
    engine: StockfishEngine;
    /** Reports the engine's best move so the board can draw it as an arrow. */
    onBestMove?: (move: { from: string; to: string } | null) => void;
}

interface ChatMessage {
    id: number;
    role: 'user' | 'assistant';
    content: string;
}

const WELCOME: ChatMessage = {
    id: 0,
    role: 'assistant',
    content:
        "Hi! I'm your chess tutor. Ask me anything about the position, or use the buttons above — " +
        '“Analyze board” to think it through together, or “Best move” for a concrete suggestion with the reasoning.',
};

const ANALYZE_PROMPT =
    'Help me analyze this position WITHOUT telling me the best move. Point out the key features ' +
    '(threats, weak squares, undeveloped pieces, king safety, the center) and ask me one or two ' +
    'guiding questions so I can decide my move myself.';

const BEST_MOVE_PROMPT =
    'What is the best move for me here, and why is it strong? Explain the idea in simple terms a ' +
    'beginner can follow.';

export function TutorChat({ fen, history, humanColor, engine, onBestMove }: TutorChatProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const idRef = useRef(1);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const isHumanTurn = useMemo(() => {
        try {
            return new Chess(fen).turn() === (humanColor === 'white' ? 'w' : 'b');
        } catch {
            return false;
        }
    }, [fen, humanColor]);

    const pushMessage = (role: ChatMessage['role'], content: string) => {
        setMessages((prev) => [...prev, { id: idRef.current++, role, content }]);
        // Scroll to the bottom on the next tick.
        requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    };

    const ask = async (displayText: string, apiQuestion: string, bestMove?: string) => {
        if (loading) return;
        pushMessage('user', displayText);
        setLoading(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fen, history, question: apiQuestion, bestMove }),
            });
            const data = await res.json();
            if (!res.ok) {
                pushMessage(
                    'assistant',
                    data?.error || 'Sorry, something went wrong. Please try again.',
                );
            } else {
                pushMessage('assistant', data.reply);
            }
        } catch {
            pushMessage('assistant', 'Could not reach the tutor. Check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const text = input.trim();
        if (!text) return;
        setInput('');
        void ask(text, text);
    };

    const handleAnalyze = () => {
        void ask('Analyze the board for me', ANALYZE_PROMPT);
    };

    const handleBestMove = async () => {
        if (loading) return;
        if (!engine.ready) {
            pushMessage('assistant', 'The engine is still loading — give it a moment and try again.');
            return;
        }
        setLoading(true);
        let bestSan: string | undefined;
        try {
            const uci = await engine.getBestMove(fen, 'hard');
            if (uci) {
                onBestMove?.({ from: uci.slice(0, 2), to: uci.slice(2, 4) });
                const tmp = new Chess(fen);
                const move = tmp.move({
                    from: uci.slice(0, 2) as Square,
                    to: uci.slice(2, 4) as Square,
                    promotion: uci.length > 4 ? uci[4] : 'q',
                });
                bestSan = move?.san ?? uci;
            } else {
                onBestMove?.(null);
            }
        } catch {
            // fall through; we'll still ask generally
        } finally {
            setLoading(false);
        }
        void ask("What's the best move?", BEST_MOVE_PROMPT, bestSan);
    };

    return (
        <div className="flex h-[460px] flex-col">
            <div className="flex gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    <Lightbulb className="size-4" />
                    Analyze board
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={handleBestMove}
                    disabled={loading || !isHumanTurn}
                    title={!isHumanTurn ? 'Wait for your turn' : undefined}
                >
                    <Sparkles className="size-4" />
                    Best move
                </Button>
            </div>

            <ScrollArea className="my-3 min-h-0 flex-1 pr-3">
                <div className="space-y-3">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                        >
                            <div
                                className={
                                    m.role === 'user'
                                        ? 'max-w-[85%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground'
                                        : 'max-w-[85%] whitespace-pre-wrap rounded-lg bg-muted px-3 py-2 text-sm'
                                }
                            >
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                                <Loader2 className="size-4 animate-spin" />
                                Thinking…
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about the position…"
                    disabled={loading}
                />
                <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                    <Send className="size-4" />
                </Button>
            </form>
        </div>
    );
}
