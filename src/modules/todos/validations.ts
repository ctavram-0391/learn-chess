import { z } from 'zod';

export const todoPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export const createTodoSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters'),
    description: z
        .string()
        .max(1000, 'Description must be less than 1000 characters')
        .optional(),
    priority: todoPrioritySchema,
    category: z
        .string()
        .max(50, 'Category must be less than 50 characters')
        .optional(),
    due_date: z
        .union([
            z.string().datetime('Please enter a valid date and time'),
            z.date(),
            z.literal(''),
        ])
        .optional(),
});

export const updateTodoSchema = z.object({
    title: z
        .string()
        .min(1, 'Title is required')
        .max(200, 'Title must be less than 200 characters')
        .optional(),
    description: z
        .string()
        .max(1000, 'Description must be less than 1000 characters')
        .optional(),
    completed: z.boolean().optional(),
    priority: todoPrioritySchema.optional(),
    category: z
        .string()
        .max(50, 'Category must be less than 50 characters')
        .optional(),
    due_date: z
        .union([
            z.string().datetime('Please enter a valid date and time'),
            z.date(),
            z.literal(''),
        ])
        .optional(),
});

export const createCategorySchema = z.object({
    name: z
        .string()
        .min(1, 'Category name is required')
        .max(50, 'Category name must be less than 50 characters')
        .regex(/^[a-zA-Z0-9\s-_]+$/, 'Category name can only contain letters, numbers, spaces, hyphens, and underscores'),
    color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
});

export const updateCategorySchema = z.object({
    name: z
        .string()
        .min(1, 'Category name is required')
        .max(50, 'Category name must be less than 50 characters')
        .regex(/^[a-zA-Z0-9\s-_]+$/, 'Category name can only contain letters, numbers, spaces, hyphens, and underscores')
        .optional(),
    color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color')
        .optional(),
});

export const todoFiltersSchema = z.object({
    completed: z.boolean().optional(),
    priority: todoPrioritySchema.optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    due_date: z.enum(['overdue', 'today', 'week', 'month']).optional(),
});

// Type exports
export type CreateTodoFormData = z.infer<typeof createTodoSchema>;
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
export type TodoFiltersFormData = z.infer<typeof todoFiltersSchema>;

