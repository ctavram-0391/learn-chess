'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCategories, useDeleteCategory } from '../hooks/useCategories';
import { CreateCategoryDialog } from './create-category-dialog';
import { EditCategoryDialog } from './edit-category-dialog';
import { LoadingState } from '@/components/loading-spinner';
import { TodoCategory } from '../types';
import {
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Tag,
    Palette
} from 'lucide-react';

export function CategoryManager() {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<TodoCategory | null>(null);

    const { data: categories, isLoading } = useCategories();
    const deleteCategory = useDeleteCategory();

    const handleDelete = (category: TodoCategory) => {
        if (confirm(`Are you sure you want to delete the "${category.name}" category?`)) {
            deleteCategory.mutate(category.id);
        }
    };

    if (isLoading) {
        return <LoadingState message="Loading categories..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    <span className="text-lg font-medium">
                        {categories?.length || 0} Categories
                    </span>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {/* Categories Grid */}
            {categories && categories.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <Card key={category.id} className="relative">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full border"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        <CardTitle className="text-base">
                                            {category.name}
                                        </CardTitle>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => setEditingCategory(category)}
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(category)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Palette className="h-4 w-4" />
                                        <span>{category.color}</span>
                                    </div>

                                    <div className="text-xs text-muted-foreground">
                                        Created {new Date(category.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No categories yet</h3>
                        <p className="text-muted-foreground text-center mb-4">
                            Create categories to organize your todos better.
                        </p>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Category
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Dialogs */}
            <CreateCategoryDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
            />

            {editingCategory && (
                <EditCategoryDialog
                    category={editingCategory}
                    open={!!editingCategory}
                    onOpenChange={(open) => !open && setEditingCategory(null)}
                />
            )}
        </div>
    );
}
