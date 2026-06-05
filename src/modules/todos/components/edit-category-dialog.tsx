'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateCategory } from '../hooks/useCategories';
import { updateCategorySchema, type UpdateCategoryFormData } from '../validations';
import { TodoCategory } from '../types';
import { Loader2 } from 'lucide-react';

interface EditCategoryDialogProps {
    category: TodoCategory;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const predefinedColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#6b7280', // gray
    '#1f2937', // dark gray
];

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
    const updateCategory = useUpdateCategory();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<UpdateCategoryFormData>({
        resolver: zodResolver(updateCategorySchema),
    });

    const selectedColor = watch('color');

    // Reset form when category changes or dialog opens
    useEffect(() => {
        if (open && category) {
            reset({
                name: category.name,
                color: category.color,
            });
        }
    }, [open, category, reset]);

    const onSubmit = async (data: UpdateCategoryFormData) => {
        await updateCategory.mutateAsync({
            id: category.id,
            data,
        });
        onOpenChange(false);
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>
                        Make changes to your category. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            placeholder="Enter category name"
                            {...register('name')}
                            className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Color */}
                    <div className="space-y-3">
                        <Label>Color</Label>

                        {/* Color Picker */}
                        <div className="flex items-center gap-3">
                            <div
                                className="w-8 h-8 rounded-full border-2 border-border"
                                style={{ backgroundColor: selectedColor }}
                            />
                            <Input
                                type="color"
                                {...register('color')}
                                className="w-16 h-8 p-1 border rounded cursor-pointer"
                            />
                        </div>

                        {/* Predefined Colors */}
                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Quick Colors</Label>
                            <div className="grid grid-cols-5 gap-2">
                                {predefinedColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setValue('color', color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === color
                                            ? 'border-primary ring-2 ring-primary/20'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        {errors.color && (
                            <p className="text-sm text-destructive">{errors.color.message}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={updateCategory.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateCategory.isPending}>
                            {updateCategory.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
