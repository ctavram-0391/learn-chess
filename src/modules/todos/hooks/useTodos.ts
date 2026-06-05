'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/todos';
import { TodoFilters, CreateTodoData, UpdateTodoData, Todo } from '../types';
import { toast } from 'sonner';

// Query keys
export const todoKeys = {
    all: ['todos'] as const,
    lists: () => [...todoKeys.all, 'list'] as const,
    list: (filters?: TodoFilters) => [...todoKeys.lists(), filters] as const,
    details: () => [...todoKeys.all, 'detail'] as const,
    detail: (id: string) => [...todoKeys.details(), id] as const,
    stats: () => [...todoKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch todos with optional filtering
 */
export function useTodos(filters?: TodoFilters) {
    return useQuery({
        queryKey: todoKeys.list(filters),
        queryFn: () => todoService.getTodos(filters),
        staleTime: 30 * 1000, // 30 seconds
    });
}

/**
 * Hook to fetch a single todo by ID
 */
export function useTodo(id: string) {
    return useQuery({
        queryKey: todoKeys.detail(id),
        queryFn: () => todoService.getTodoById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to fetch todo statistics
 */
export function useTodoStats() {
    return useQuery({
        queryKey: todoKeys.stats(),
        queryFn: () => todoService.getTodoStats(),
        staleTime: 60 * 1000, // 1 minute
    });
}

/**
 * Hook to create a new todo
 */
export function useCreateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTodoData) => todoService.createTodo(data),
        onSuccess: () => {
            // Invalidate and refetch todos
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
            queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
            toast.success('Todo created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create todo');
        },
    });
}

/**
 * Hook to update an existing todo
 */
export function useUpdateTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTodoData }) =>
            todoService.updateTodo(id, data),
        onSuccess: (updatedTodo, variables) => {
            // Update the specific todo in cache
            queryClient.setQueryData(
                todoKeys.detail(variables.id),
                updatedTodo
            );

            // Invalidate lists to ensure consistency
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
            queryClient.invalidateQueries({ queryKey: todoKeys.stats() });

            toast.success('Todo updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update todo');
        },
    });
}

/**
 * Hook to delete a todo
 */
export function useDeleteTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => todoService.deleteTodo(id),
        onSuccess: (_, deletedId) => {
            // Remove from cache
            queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) });

            // Invalidate lists
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
            queryClient.invalidateQueries({ queryKey: todoKeys.stats() });

            toast.success('Todo deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete todo');
        },
    });
}

/**
 * Hook to toggle todo completion status
 */
export function useToggleTodo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => todoService.toggleTodo(id),
        onMutate: async (id: string) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) });

            // Snapshot the previous value
            const previousTodo = queryClient.getQueryData(todoKeys.detail(id));

            // Optimistically update the cache
            queryClient.setQueryData(todoKeys.detail(id), (old: Todo | undefined) => {
                if (old) {
                    return { ...old, completed: !old.completed };
                }
                return old;
            });

            // Return context with previous and new todo
            return { previousTodo, id };
        },
        onError: (error: Error, id: string, context) => {
            // Rollback on error
            if (context?.previousTodo) {
                queryClient.setQueryData(todoKeys.detail(id), context.previousTodo);
            }
            toast.error(error.message || 'Failed to update todo');
        },
        onSettled: (data, error, id) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: todoKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
            queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
        },
    });
}
