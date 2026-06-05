import { createSupabaseClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Message } from '../types';

export class ChatService {
    private clientFactory: () => Promise<SupabaseClient> | SupabaseClient;

    constructor(clientFactory?: () => Promise<SupabaseClient> | SupabaseClient) {
        this.clientFactory = clientFactory ?? createSupabaseClient;
    }

    private async getClient(): Promise<SupabaseClient> {
        return await this.clientFactory();
    }

    async saveMessage(
        userId: string,
        role: Message['role'],
        content: string,
        toolCalls?: unknown[]
    ): Promise<Message> {
        const client = await this.getClient();
        const { data, error } = await client
            .from('messages')
            .insert({
                user_id: userId,
                role,
                content,
                tool_calls: toolCalls ?? null,
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to save message: ${error.message}`);
        return data as Message;
    }

    async getMessages(
        userId: string,
        limit = 50,
        before?: string
    ): Promise<Message[]> {
        const client = await this.getClient();
        let query = client
            .from('messages')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (before) {
            query = query.lt('created_at', before);
        }

        const { data, error } = await query;
        if (error) throw new Error(`Failed to get messages: ${error.message}`);

        // Return in chronological order
        return ((data ?? []) as Message[]).reverse();
    }

    async getRecentContext(userId: string, limit = 20): Promise<Message[]> {
        return this.getMessages(userId, limit);
    }

    async clearConversation(userId: string): Promise<void> {
        const client = await this.getClient();
        const { error } = await client
            .from('messages')
            .delete()
            .eq('user_id', userId);

        if (error) throw new Error(`Failed to clear conversation: ${error.message}`);
    }

    subscribeToMessages(
        userId: string,
        callback: (message: Message) => void,
        client: SupabaseClient
    ) {
        return client
            .channel(`messages:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => callback(payload.new as Message)
            )
            .subscribe();
    }
}

export const chatService = new ChatService();
