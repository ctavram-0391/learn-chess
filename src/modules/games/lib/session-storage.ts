import { ChatMessage, Difficulty, Side } from '../types';

/**
 * Client-side persistence for the *in-progress* game so it survives a reload or
 * navigating away. Completed games are saved to the database separately; this is
 * only the live session (board position as PGN + tutor chat).
 */
const KEY = 'learn-chess:session:v1';

export interface GameSession {
    difficulty: Difficulty;
    side: Side;
    /** Full movetext of the current game; '' for a fresh, unmoved game. */
    pgn: string;
    messages: ChatMessage[];
}

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const SIDES: Side[] = ['white', 'black'];

export function loadSession(): GameSession | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<GameSession>;
        if (
            !parsed ||
            typeof parsed.pgn !== 'string' ||
            !DIFFICULTIES.includes(parsed.difficulty as Difficulty) ||
            !SIDES.includes(parsed.side as Side)
        ) {
            return null;
        }
        return {
            difficulty: parsed.difficulty as Difficulty,
            side: parsed.side as Side,
            pgn: parsed.pgn,
            messages: Array.isArray(parsed.messages) ? (parsed.messages as ChatMessage[]) : [],
        };
    } catch {
        return null;
    }
}

export function saveSession(session: GameSession): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(KEY, JSON.stringify(session));
    } catch {
        // Quota or serialization failure — non-fatal; the game keeps working in memory.
    }
}

export function clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.removeItem(KEY);
    } catch {
        // ignore
    }
}
