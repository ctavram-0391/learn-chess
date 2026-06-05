import { createSupabaseClient } from "@/lib/supabase/client";
import { SignInCredentials, SignUpCredentials } from "./types";
import { User } from "@supabase/supabase-js";

class AuthService {

    static getURL = () => {
        let url =
            process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            'http://localhost:3000/'
        // Make sure to include `https://` when not localhost.
        url = url.startsWith('http') ? url : `https://${url}`
        // Make sure to include a trailing `/`.
        url = url.endsWith('/') ? url : `${url}/`
        return url
    }

    static async getAuthUser(): Promise<User | null> {
        const supabase = await createSupabaseClient();

        const { data, error } = await supabase.auth.getUser();

        if (error) throw new Error(error.message)
        return data.user || null
    }

    static async signIn(credentials: SignInCredentials) {
        try {
            const supabase = await createSupabaseClient();
            const { data, error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });

            if (error) {
                console.error('Supabase error signing in user: ', error);
                throw new Error(error.message);
            }

            if (!data.user) {
                throw new Error('No user data returned');
            }

            return {
                user: data.user as User,
                error: null
            };
        } catch (err) {
            console.error(err);
            return {
                user: null,
                error: {
                    message: err instanceof Error ? err.message : 'An unexpected error occurred'
                }
            };
        }
    }

    static async signUp(credentials: SignUpCredentials) {
        const supabase = await createSupabaseClient();

        try {
            // Create the user account
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: credentials.email,
                password: credentials.password,
                options: {
                    data: {
                        name: credentials.name,
                    }
                }
            });

            if (signUpError) {
                throw new Error(signUpError.message);
            }

            if (!signUpData.user) {
                throw new Error('No user data returned');
            }

            return { user: signUpData.user as User, error: null };

        } catch (err) {
            console.error("Error signing up user: ", err);
            return {
                user: null,
                error: {
                    message: err instanceof Error ? err.message : 'An unexpected error occurred'
                }
            };
        }
    }

    static async signOut() {
        try {
            const supabase = await createSupabaseClient();
            const { error } = await supabase.auth.signOut();
            if (error) {
                return { error: { message: error.message } };
            }
            return { error: null };
        } catch (err) {
            return {
                error: {
                    message: err instanceof Error ? err.message : 'An unexpected error occurred'
                }
            };
        }
    }

    static async resetPassword(email: string) {
        try {
            const supabase = await createSupabaseClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: AuthService.getURL() + '/auth/reset-password',
            });

            if (error) {
                return { error: { message: error.message } };
            }

            return { error: null };
        } catch (err) {
            return {
                error: {
                    message: err instanceof Error ? err.message : 'An unexpected error occurred'
                }
            };
        }
    }

    static async signInWithGoogle() {
        try {
            const supabase = await createSupabaseClient();
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${AuthService.getURL()}/api/auth/callback`,
                }
            });

            if (error) {
                console.error('Supabase error signing in with Google: ', error);
                throw new Error(error.message);
            }

            return { data, error: null };
        } catch (err) {
            console.error(err);
            return {
                data: null,
                error: {
                    message: err instanceof Error ? err.message : 'An unexpected error occurred'
                }
            };
        }
    }

    static async handleGoogleCallback(code: string) {
        try {
            const supabase = await createSupabaseClient();
            const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);


            if (error) {
                console.error('Error exchanging code for session: ', error);
                throw new Error(error.message);
            }

            if (!user || !user.email) {
                throw new Error('No user data returned');
            }

            return {
                user,
                error: null
            };
        } catch (err) {
            console.error('Error handling Google callback: ', err);
            return {
                user: null,
                error: {
                    message: err instanceof Error ? err.message : 'An unexpected error occurred'
                }
            };
        }
    }
}

export default AuthService