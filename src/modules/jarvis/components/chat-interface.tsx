'use client';

import { Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Conversation,
    ConversationContent,
    ConversationEmptyState,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
    PromptInput,
    PromptInputTextarea,
    PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import type { PromptInputMessage } from '@/components/ai-elements/prompt-input';
import { useJarvisChat } from '../hooks/useChat';
import { ChatMessage } from './chat-message';

export function ChatInterface() {
    const { messages, sendMessage, status, error, stop, isLoadingHistory } = useJarvisChat();

    const handleSubmit = (message: PromptInputMessage) => {
        if (!message.text?.trim()) return;
        sendMessage({ text: message.text.trim() });
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages area with auto-scroll */}
            <Conversation className="flex-1">
                <ConversationContent className="max-w-3xl mx-auto w-full py-6">
                    {isLoadingHistory ? (
                        <div className="space-y-6 py-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className={`flex gap-3 ${i % 2 === 0 ? '' : 'justify-end'}`}>
                                    <Skeleton className={`h-16 rounded-2xl ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`} />
                                </div>
                            ))}
                        </div>
                    ) : messages.length === 0 ? (
                        <ConversationEmptyState
                            title="Hey, I'm Jarvis"
                            description="Ask me anything, or give me a task to work on in the background. I can research topics, analyze information, and more."
                            icon={<Bot className="h-10 w-10" />}
                        />
                    ) : (
                        messages.map(message => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                isStreaming={
                                    status === 'streaming' &&
                                    message === messages[messages.length - 1] &&
                                    message.role === 'assistant'
                                }
                            />
                        ))
                    )}

                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            Something went wrong. Please try again.
                        </p>
                    )}
                </ConversationContent>

                <ConversationScrollButton />
            </Conversation>

            {/* Input area */}
            <div className="border-t bg-background px-4 py-3">
                <div className="max-w-3xl mx-auto">
                    <PromptInput onSubmit={handleSubmit}>
                        <PromptInputTextarea placeholder="Message Jarvis..." />
                        <PromptInputSubmit status={status} onStop={stop} />
                    </PromptInput>
                </div>
            </div>
        </div>
    );
}
