import { createSupabaseClient } from '@/lib/supabase/client';
import {
    Todo,
    TodoCategory,
    CreateTodoData,
    UpdateTodoData,
    CreateCategoryData,
    UpdateCategoryData,
    TodoFilters,
    TodoStats,
} from '../types';

export class TodoService {
    /**
     * Get all todos for the current user with optional filtering
     */
    async getTodos(filters?: TodoFilters): Promise<Todo[]> {
        const supabase = await createSupabaseClient();

        let query = supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });

        // Apply filters
        if (filters?.completed !== undefined) {
            query = query.eq('completed', filters.completed);
        }

        if (filters?.priority) {
            query = query.eq('priority', filters.priority);
        }

        if (filters?.category) {
            query = query.eq('category', filters.category);
        }

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        if (filters?.due_date) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            switch (filters.due_date) {
                case 'overdue':
                    query = query.lt('due_date', today.toISOString());
                    break;
                case 'today':
                    const tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    query = query.gte('due_date', today.toISOString()).lt('due_date', tomorrow.toISOString());
                    break;
                case 'week':
                    const nextWeek = new Date(today);
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    query = query.gte('due_date', today.toISOString()).lt('due_date', nextWeek.toISOString());
                    break;
                case 'month':
                    const nextMonth = new Date(today);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    query = query.gte('due_date', today.toISOString()).lt('due_date', nextMonth.toISOString());
                    break;
            }
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data as Todo[];
    }

    /**
     * Get a single todo by ID
     */
    async getTodoById(id: string): Promise<Todo> {
        const supabase = await createSupabaseClient();

        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Todo;
    }

    /**
     * Create a new todo
     */
    async createTodo(todoData: CreateTodoData): Promise<Todo> {
        const supabase = await createSupabaseClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('todos')
            .insert({
                ...todoData,
                user_id: user.id,
                due_date: todoData.due_date || null,
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Todo;
    }

    /**
     * Update an existing todo
     */
    async updateTodo(id: string, todoData: UpdateTodoData): Promise<Todo> {
        const supabase = await createSupabaseClient();

        const updateData = {
            ...todoData,
            due_date: todoData.due_date === '' ? null : todoData.due_date,
        };

        const { data, error } = await supabase
            .from('todos')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Todo;
    }

    /**
     * Delete a todo
     */
    async deleteTodo(id: string): Promise<void> {
        const supabase = await createSupabaseClient();

        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Toggle todo completion status
     */
    async toggleTodo(id: string): Promise<Todo> {
        const supabase = await createSupabaseClient();

        // First get the current todo to toggle its status
        const { data: currentTodo, error: fetchError } = await supabase
            .from('todos')
            .select('completed')
            .eq('id', id)
            .single();

        if (fetchError) {
            throw new Error(fetchError.message);
        }

        // Update with opposite completion status
        const { data, error } = await supabase
            .from('todos')
            .update({ completed: !currentTodo.completed })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as Todo;
    }

    /**
     * Get todo statistics for the current user
     */
    async getTodoStats(): Promise<TodoStats> {
        const supabase = await createSupabaseClient();

        const { data: todos, error } = await supabase
            .from('todos')
            .select('*');

        if (error) {
            throw new Error(error.message);
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const stats: TodoStats = {
            total: todos.length,
            completed: todos.filter(t => t.completed).length,
            pending: todos.filter(t => !t.completed).length,
            overdue: todos.filter(t =>
                !t.completed &&
                t.due_date &&
                new Date(t.due_date) < today
            ).length,
            due_today: todos.filter(t => {
                if (!t.due_date || t.completed) return false;
                const dueDate = new Date(t.due_date);
                return dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
            }).length,
            due_this_week: todos.filter(t => {
                if (!t.due_date || t.completed) return false;
                const dueDate = new Date(t.due_date);
                return dueDate >= today && dueDate < nextWeek;
            }).length,
            by_priority: {
                low: todos.filter(t => t.priority === 'low').length,
                medium: todos.filter(t => t.priority === 'medium').length,
                high: todos.filter(t => t.priority === 'high').length,
                urgent: todos.filter(t => t.priority === 'urgent').length,
            },
            by_category: todos.reduce((acc, todo) => {
                const category = todo.category || 'Uncategorized';
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
        };

        return stats;
    }

    /**
     * Get all categories for the current user
     */
    async getCategories(): Promise<TodoCategory[]> {
        const supabase = await createSupabaseClient();

        const { data, error } = await supabase
            .from('todo_categories')
            .select('*')
            .order('name');

        if (error) {
            throw new Error(error.message);
        }

        return data as TodoCategory[];
    }

    /**
     * Create a new category
     */
    async createCategory(categoryData: CreateCategoryData): Promise<TodoCategory> {
        const supabase = await createSupabaseClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('todo_categories')
            .insert({
                ...categoryData,
                user_id: user.id,
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as TodoCategory;
    }

    /**
     * Update an existing category
     */
    async updateCategory(id: string, categoryData: UpdateCategoryData): Promise<TodoCategory> {
        const supabase = await createSupabaseClient();

        const { data, error } = await supabase
            .from('todo_categories')
            .update(categoryData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as TodoCategory;
    }

    /**
     * Delete a category
     */
    async deleteCategory(id: string): Promise<void> {
        const supabase = await createSupabaseClient();

        const { error } = await supabase
            .from('todo_categories')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Subscribe to real-time todo updates
     */
    async subscribeToTodos(callback: (payload: unknown) => void) {
        const supabase = await createSupabaseClient();

        return supabase
            .channel('todos')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'todos'
                },
                callback
            )
            .subscribe();
    }

    /**
     * Subscribe to real-time category updates
     */
    async subscribeToCategories(callback: (payload: unknown) => void) {
        const supabase = await createSupabaseClient();

        return supabase
            .channel('todo_categories')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'todo_categories'
                },
                callback
            )
            .subscribe();
    }
}

// Export singleton instance
export const todoService = new TodoService();
