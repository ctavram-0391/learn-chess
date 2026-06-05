'use client';

import { ChatInterface } from '@/modules/jarvis/components/chat-interface';

export default function ChatPage() {
    return (
        <div className="h-[calc(100vh-3.5rem)]">
            <ChatInterface />
        </div>
    );
}
