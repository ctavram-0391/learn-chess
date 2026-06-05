'use client';

import { CategoryManager } from '@/modules/todos/components/category-manager';

export default function CategoriesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <p className="text-muted-foreground">
                    Organize your todos with custom categories.
                </p>
            </div>

            <CategoryManager />
        </div>
    );
}
