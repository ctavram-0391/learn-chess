'use client';

import type { UIMessage } from 'ai';
import {
    Message,
    MessageContent,
    MessageResponse,
} from '@/components/ai-elements/message';
import {
    Tool,
    ToolHeader,
    ToolContent,
    ToolInput,
    ToolOutput,
} from '@/components/ai-elements/tool';

const TOOL_TITLES: Record<string, string> = {
    dispatch: 'Dispatching task',
    check_tasks: 'Checking tasks',
    respond_to_task: 'Responding to task',
};

/**
 * Extract the tool name from a part type like "tool-dispatch" or "tool-check_tasks".
 */
function getToolName(partType: string): string {
    return partType.startsWith('tool-') ? partType.slice(5) : partType;
}

export function ChatMessage({
    message,
    isStreaming = false,
}: {
    message: UIMessage;
    isStreaming?: boolean;
}) {
    return (
        <Message from={message.role}>
            {message.parts.map((part, i) => {
                if (part.type === 'text') {
                    if (!part.text) return null;

                    if (message.role === 'user') {
                        return (
                            <MessageContent key={i}>
                                <div className="whitespace-pre-wrap">{part.text}</div>
                            </MessageContent>
                        );
                    }

                    return (
                        <MessageContent key={i}>
                            <MessageResponse>
                                {part.text}
                            </MessageResponse>
                        </MessageContent>
                    );
                }

                // Handle tool invocations (type is "tool-dispatch", "tool-check_tasks", etc.)
                if (part.type.startsWith('tool-')) {
                    const toolName = getToolName(part.type);
                    const toolPart = part as {
                        type: string;
                        state: string;
                        toolCallId: string;
                        input?: unknown;
                        output?: unknown;
                        errorText?: string;
                    };

                    return (
                        <Tool key={i}>
                            <ToolHeader
                                title={TOOL_TITLES[toolName] ?? toolName}
                                type={toolPart.type as `tool-${string}`}
                                state={toolPart.state as 'input-streaming' | 'input-available' | 'output-available' | 'output-error'}
                            />
                            <ToolContent>
                                {toolPart.input !== undefined && (
                                    <ToolInput input={toolPart.input} />
                                )}
                                {(toolPart.output !== undefined || toolPart.errorText) && (
                                    <ToolOutput
                                        output={toolPart.output}
                                        errorText={toolPart.errorText}
                                    />
                                )}
                            </ToolContent>
                        </Tool>
                    );
                }

                return null;
            })}
        </Message>
    );
}
