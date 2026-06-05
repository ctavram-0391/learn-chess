import { NextResponse } from 'next/server';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { createServerSupabaseClient } from '@/lib/supabase/client';

const bodySchema = z.object({
    fen: z.string().min(1),
    history: z.array(z.string()).default([]),
    question: z.string().min(1).max(2000),
    /** Optional engine-recommended move (SAN) for the "best move" button. */
    bestMove: z.string().max(16).optional(),
});

const SYSTEM_PROMPT = `You are a patient, encouraging chess coach helping a beginner improve.

You are given the current position as a FEN and the moves played so far in SAN.
The learner plays White; Black is the Stockfish engine.

Guidelines:
- Explain ideas, plans, and threats in plain language a beginner can follow.
- Point out concrete tactics or threats that are clearly present, but NEVER invent
  moves or lines you are unsure about. If you are unsure of an exact line, speak in
  general terms (pawn structure, king safety, piece activity, development, the center).
- Keep answers short and focused — a few sentences, not long variations.
- Refer to moves in standard algebraic notation (e.g., Nf3, e4, O-O).
- Be supportive and constructive; you are teaching, not just evaluating.`;

export async function POST(request: Request) {
    try {
        // Require an authenticated user (matches the rest of the API surface).
        const supabase = await createServerSupabaseClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const parsed = bodySchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
        const { fen, history, question, bestMove } = parsed.data;

        // Graceful degrade: the game works fully without a key.
        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json({
                reply:
                    "The AI tutor is offline because no Anthropic API key is configured. " +
                    "You can still play and review your games — add ANTHROPIC_API_KEY to .env.local to enable coaching.",
                offline: true,
            });
        }

        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const userContent = [
            `Position (FEN): ${fen}`,
            `Moves so far: ${history.length ? history.join(' ') : 'No moves played yet.'}`,
            bestMove ? `Engine's recommended move for the side to move: ${bestMove}` : null,
            ``,
            `Learner's request: ${question}`,
        ]
            .filter((line) => line !== null)
            .join('\n');

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 600,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: userContent }],
        });

        const reply = message.content
            .map((block) => (block.type === 'text' ? block.text : ''))
            .join('')
            .trim();

        return NextResponse.json({
            reply: reply || 'Sorry, I could not come up with a response. Try rephrasing.',
        });
    } catch (error) {
        console.error('Tutor chat error:', error);
        return NextResponse.json(
            { error: 'The tutor ran into a problem. Please try again.' },
            { status: 500 },
        );
    }
}
