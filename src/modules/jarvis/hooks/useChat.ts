'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAuth } from '@/modules/auth/context';
import { ChatService } from '../services/chat';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { Message } from '../types';

const transport = new DefaultChatTransport({
    api: '/api/jarvis/chat',
});

const supabase = createBrowserSupabaseClient();
const chatService = new ChatService(() => supabase);

/**
 * Convert a stored DB message to a UIMessage for the AI SDK.
 */
function dbMessageToUIMessage(msg: Message): UIMessage {
    return {
        id: msg.id,
        role: msg.role as UIMessage['role'],
        parts: [{ type: 'text' as const, text: msg.content }],
    };
}

export function useJarvisChat() {
    const { user } = useAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [initialMessages, setInitialMessages] = useState<UIMessage[] | undefined>(undefined);
    const lastSavedCountRef = useRef(0);
    const isSavingRef = useRef(false);

    // Load history from Supabase on mount
    useEffect(() => {
        if (!user?.id) {
            setIsLoadingHistory(false);
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const dbMessages = await chatService.getMessages(user.id, 50);
                if (cancelled) return;

                if (dbMessages.length > 0) {
                    const uiMessages = dbMessages
                        .filter(m => m.role === 'user' || m.role === 'assistant')
                        .map(dbMessageToUIMessage);
                    setInitialMessages(uiMessages);
                    lastSavedCountRef.current = uiMessages.length;
                } else {
                    setInitialMessages([]);
                    lastSavedCountRef.current = 0;
                }
            } catch (err) {
                console.error('Failed to load chat history:', err);
                setInitialMessages([]);
            } finally {
                if (!cancelled) setIsLoadingHistory(false);
            }
        })();

        return () => { cancelled = true; };
    }, [user?.id]);

    const chat = useChat({
        transport,
        ...(initialMessages !== undefined ? { messages: initialMessages } : {}),
        onFinish: useCallback(async ({ messages: finishedMessages }: { messages: UIMessage[] }) => {
            if (!user?.id || isSavingRef.current) return;
            isSavingRef.current = true;

            try {
                // Save any new messages that haven't been saved yet
                for (let i = lastSavedCountRef.current; i < finishedMessages.length; i++) {
                    const msg = finishedMessages[i];
                    if (msg.role !== 'user' && msg.role !== 'assistant') continue;

                    const textContent = msg.parts
                        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                        .map(p => p.text)
                        .join('');

                    if (textContent) {
                        await chatService.saveMessage(user.id, msg.role, textContent);
                    }
                }
                lastSavedCountRef.current = finishedMessages.length;
            } catch (err) {
                console.error('Failed to save messages:', err);
            } finally {
                isSavingRef.current = false;
            }
        }, [user?.id]),
    });

    // Wrap sendMessage to save user messages immediately
    const originalSendMessage = chat.sendMessage;
    const sendMessage = useCallback(async (opts: { text: string }) => {
        if (user?.id && opts.text.trim()) {
            try {
                await chatService.saveMessage(user.id, 'user', opts.text.trim());
                lastSavedCountRef.current += 1;
            } catch (err) {
                console.error('Failed to save user message:', err);
            }
        }
        return originalSendMessage(opts);
    }, [user?.id, originalSendMessage]);

    return useMemo(() => ({
        ...chat,
        sendMessage,
        isLoadingHistory,
    }), [chat, sendMessage, isLoadingHistory]);
}
