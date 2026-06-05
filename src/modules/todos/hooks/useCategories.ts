'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/todos';
import { CreateCategoryData, UpdateCategoryData } from '../types';
import { toast } from 'sonner';

// Query keys
export const categoryKeys = {
    all: ['categories'] as const,
    lists: () => [...categoryKeys.all, 'list'] as const,
    details: () => [...categoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...categoryKeys.details(), id] as const,
};

/**
 * Hook to fetch all categories
 */
export function useCategories() {
    return useQuery({
        queryKey: categoryKeys.lists(),
        queryFn: () => todoService.getCategories(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook to create a new category
 */
export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategoryData) => todoService.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            toast.success('Category created successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create category');
        },
    });
}

/**
 * Hook to update an existing category
 */
export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
            todoService.updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            toast.success('Category updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update category');
        },
    });
}

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => todoService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
            toast.success('Category deleted successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete category');
        },
    });
}
