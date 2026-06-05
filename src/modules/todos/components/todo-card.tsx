'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToggleTodo, useDeleteTodo } from '../hooks/useTodos';
import { Todo, TodoPriority } from '../types';
import { cn } from '@/lib/utils';
import {
    Calendar,
    MoreHorizontal,
    Edit,
    Trash2,
    Clock,
    Tag
} from 'lucide-react';
import { format, isBefore, isToday } from 'date-fns';
import { EditTodoDialog } from './edit-todo-dialog';

interface TodoCardProps {
    todo: Todo;
    compact?: boolean;
    className?: string;
}

const priorityVariants: Record<TodoPriority, "default" | "secondary" | "destructive" | "outline"> = {
    low: 'outline',
    medium: 'secondary',
    high: 'default',
    urgent: 'destructive',
};

export function TodoCard({ todo, compact = false, className }: TodoCardProps) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const toggleTodo = useToggleTodo();
    const deleteTodo = useDeleteTodo();

    const handleToggle = () => {
        toggleTodo.mutate(todo.id);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this todo?')) {
            deleteTodo.mutate(todo.id);
        }
    };

    const getDueDateStatus = () => {
        if (!todo.due_date) return null;

        const dueDate = new Date(todo.due_date);
        const now = new Date();

        if (isBefore(dueDate, now) && !todo.completed) {
            return { label: 'Overdue', color: 'text-red-600' };
        }

        if (isToday(dueDate)) {
            return { label: 'Due today', color: 'text-orange-600' };
        }

        return { label: format(dueDate, 'MMM d'), color: 'text-muted-foreground' };
    };

    const dueDateStatus = getDueDateStatus();

    if (compact) {
        return (
            <div className={cn(
                "flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
                todo.completed && "opacity-60",
                className
            )}>
                <Checkbox
                    checked={todo.completed}
                    onCheckedChange={handleToggle}
                    disabled={toggleTodo.isPending}
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "font-medium truncate",
                            todo.completed && "line-through text-muted-foreground"
                        )}>
                            {todo.title}
                        </span>
                        <Badge
                            variant={priorityVariants[todo.priority]}
                            className="text-xs capitalize"
                        >
                            {todo.priority}
                        </Badge>
                    </div>

                    {(todo.category || dueDateStatus) && (
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            {todo.category && (
                                <div className="flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    {todo.category}
                                </div>
                            )}
                            {dueDateStatus && (
                                <div className={cn("flex items-center gap-1", dueDateStatus.color)}>
                                    <Calendar className="h-3 w-3" />
                                    {dueDateStatus.label}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <EditTodoDialog
                    todo={todo}
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                />
            </div>
        );
    }

    return (
        <Card className={cn(
            "transition-all duration-200 hover:shadow-md",
            todo.completed && "opacity-75",
            className
        )}>
            <CardContent className="p-4">
                <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start gap-3">
                        <Checkbox
                            checked={todo.completed}
                            onCheckedChange={handleToggle}
                            disabled={toggleTodo.isPending}
                            className="mt-0.5"
                        />

                        <div className="flex-1 min-w-0">
                            <h3 className={cn(
                                "font-semibold text-base leading-tight",
                                todo.completed && "line-through text-muted-foreground"
                            )}>
                                {todo.title}
                            </h3>

                            {todo.description && (
                                <p className={cn(
                                    "text-sm text-muted-foreground mt-1 line-clamp-2",
                                    todo.completed && "line-through"
                                )}>
                                    {todo.description}
                                </p>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleDelete}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={priorityVariants[todo.priority]}
                                className="text-xs capitalize"
                            >
                                {todo.priority}
                            </Badge>

                            {todo.category && (
                                <Badge variant="outline" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {todo.category}
                                </Badge>
                            )}
                        </div>

                        {dueDateStatus && (
                            <div className={cn(
                                "flex items-center gap-1 text-xs",
                                dueDateStatus.color
                            )}>
                                <Clock className="h-3 w-3" />
                                {dueDateStatus.label}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            <EditTodoDialog
                todo={todo}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
            />
        </Card>
    );
}
