'use client';

import { useParams } from 'next/navigation';
import { TaskDetail } from '@/modules/jarvis/components/task-detail';

export default function TaskDetailPage() {
    const { id } = useParams<{ id: string }>();
    return <TaskDetail taskId={id} />;
}
