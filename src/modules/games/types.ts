export type GameResult = 'win' | 'loss' | 'draw';

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Which colour the human plays. */
export type Side = 'white' | 'black';

export interface Game {
    id: string;
    user_id: string;
    result: GameResult;
    move_count: number;
    difficulty: Difficulty;
    pgn?: string | null;
    created_at: string;
}

export interface CreateGameData {
    result: GameResult;
    move_count: number;
    difficulty: Difficulty;
    pgn?: string | null;
}
