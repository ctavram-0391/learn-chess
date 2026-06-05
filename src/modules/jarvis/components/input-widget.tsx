'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Send } from 'lucide-react';
import { useRespondToTask } from '../hooks/useTasks';
import { toast } from 'sonner';
import type { Task } from '../types';

export function InputWidget({ task }: { task: Task }) {
    const [response, setResponse] = useState('');
    const respondMutation = useRespondToTask();

    const handleSubmit = async () => {
        if (!response.trim()) return;

        try {
            await respondMutation.mutateAsync({
                task_id: task.id,
                response: response.trim(),
            });
            setResponse('');
            toast.success('Response sent');
        } catch {
            toast.error('Failed to send response');
        }
    };

    if (task.status !== 'needs_input') return null;

    return (
        <Card className="border-orange-500/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-orange-500" />
                    Input Needed
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {task.attention_reason && (
                    <Alert>
                        <AlertDescription className="text-sm">
                            {task.attention_reason}
                        </AlertDescription>
                    </Alert>
                )}
                <Textarea
                    placeholder="Type your response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={3}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            handleSubmit();
                        }
                    }}
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!response.trim() || respondMutation.isPending}
                    size="sm"
                    className="w-full"
                >
                    <Send className="h-4 w-4 mr-2" />
                    {respondMutation.isPending ? 'Sending...' : 'Send Response'}
                </Button>
            </CardContent>
        </Card>
    );
}
