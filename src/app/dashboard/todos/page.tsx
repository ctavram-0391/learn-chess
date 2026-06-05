'use client';

import { TodoList } from '@/modules/todos/components/todo-list';

export default function TodosPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Todos</h1>
                    <p className="text-muted-foreground">
                        Manage and organize all your tasks in one place.
                    </p>
                </div>
            </div>
            <TodoList />
        </div>
    );
}
