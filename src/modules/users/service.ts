import { createSupabaseClient } from "@/lib/supabase/client";
import { User } from "./types";

class UserService {
    async insertUser(user: Partial<User>): Promise<User | null> {
        const supabase = await createSupabaseClient();

        try {
            const { data, error } = await supabase
                .from('users')
                .insert(user)
                .select()
                .single();

            if (error) {
                throw error;
            }
            return data as User;
        } catch (error) {
            console.error("Error inserting user: ", error);
            return null;
        }
    }

    async getUserById(id: string): Promise<User | null> {
        const supabase = await createSupabaseClient();
        const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
        if (error) {
            throw error;
        }
        return data;
    }
}

export const userService = new UserService();