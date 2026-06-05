import { AuthError, Session, User } from "@supabase/supabase-js";

export interface AuthState {
    user: User | null;  // Supabase user
    session: Session | null;
    isInitialized: boolean;
    isAuthenticated: boolean;
}

export interface SignInCredentials {
    email: string;
    password: string;
}

export interface SignUpCredentials {
    name: string;
    email: string;
    password: string;
}

export interface AuthFunctions {
    signIn: (credentials: SignInCredentials) => Promise<{ user: User | null; error: AuthError | null }>;
    signUp: (credentials: SignUpCredentials) => Promise<{ user: User | null; error: AuthError | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
    signInWithGoogle: () => Promise<{ data: unknown | null; error: AuthError | null }>;
}