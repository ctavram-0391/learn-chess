export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: TodoPriority;
    category?: string;
    due_date?: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface TodoCategory {
    id: string;
    name: string;
    color: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTodoData {
    title: string;
    description?: string;
    priority?: TodoPriority;
    category?: string;
    due_date?: string;
}

export interface UpdateTodoData {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: TodoPriority;
    category?: string;
    due_date?: string;
}

export interface CreateCategoryData {
    name: string;
    color?: string;
}

export interface UpdateCategoryData {
    name?: string;
    color?: string;
}

export interface TodoFilters {
    completed?: boolean;
    priority?: TodoPriority;
    category?: string;
    search?: string;
    due_date?: 'overdue' | 'today' | 'week' | 'month';
}

export interface TodoStats {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    due_today: number;
    due_this_week: number;
    by_priority: Record<TodoPriority, number>;
    by_category: Record<string, number>;
}
