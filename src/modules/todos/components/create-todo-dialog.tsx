'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useCreateTodo } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import { createTodoSchema, type CreateTodoFormData } from '../validations';
import { TodoPriority } from '../types';
import { Loader2, CalendarIcon, Clock } from 'lucide-react';

interface CreateTodoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const priorityOptions: { value: TodoPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
];

export function CreateTodoDialog({ open, onOpenChange }: CreateTodoDialogProps) {
    const createTodo = useCreateTodo();
    const { data: categories } = useCategories();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CreateTodoFormData>({
        resolver: zodResolver(createTodoSchema),
        defaultValues: {
            priority: 'medium',
        },
    });

    const priority = watch('priority');
    const category = watch('category');
    const dueDate = watch('due_date');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const onSubmit = async (data: CreateTodoFormData) => {
        await createTodo.mutateAsync({
            ...data,
            due_date: data.due_date instanceof Date
                ? data.due_date.toISOString()
                : data.due_date || undefined,
        });
        reset();
        onOpenChange(false);
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Todo</DialogTitle>
                    <DialogDescription>
                        Add a new task to your todo list. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            placeholder="What needs to be done?"
                            {...register('title')}
                            className={errors.title ? 'border-destructive' : ''}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Add more details about this task..."
                            rows={3}
                            {...register('description')}
                            className={errors.description ? 'border-destructive' : ''}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Priority and Category Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Priority */}
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                                value={priority}
                                onValueChange={(value: TodoPriority) => setValue('priority', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={category || undefined}
                                onValueChange={(value) => setValue('category', value === 'none' ? undefined : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No category</SelectItem>
                                    {categories?.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${!dueDate ? 'text-muted-foreground' : ''
                                        } ${errors.due_date ? 'border-destructive' : ''}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {dueDate instanceof Date ? (
                                        <>
                                            {format(dueDate, 'PPP')}
                                            <Clock className="ml-2 h-4 w-4" />
                                            {format(dueDate, 'p')}
                                        </>
                                    ) : dueDate ? (
                                        format(new Date(dueDate), 'PPP p')
                                    ) : (
                                        'Pick a date and time'
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={dueDate instanceof Date ? dueDate : dueDate ? new Date(dueDate) : undefined}
                                    onSelect={(date) => {
                                        if (date) {
                                            // Set time to current time if no time is set
                                            const now = new Date();
                                            date.setHours(now.getHours());
                                            date.setMinutes(now.getMinutes());
                                            setValue('due_date', date);
                                        } else {
                                            setValue('due_date', undefined);
                                        }
                                        setIsCalendarOpen(false);
                                    }}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    initialFocus
                                />
                                <div className="p-3 border-t">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <Input
                                            type="time"
                                            value={dueDate instanceof Date ? format(dueDate, 'HH:mm') : ''}
                                            onChange={(e) => {
                                                const time = e.target.value;
                                                if (time && dueDate instanceof Date) {
                                                    const [hours, minutes] = time.split(':');
                                                    const newDate = new Date(dueDate);
                                                    newDate.setHours(parseInt(hours), parseInt(minutes));
                                                    setValue('due_date', newDate);
                                                }
                                            }}
                                            className="flex-1"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full mt-2"
                                        onClick={() => {
                                            setValue('due_date', undefined);
                                            setIsCalendarOpen(false);
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        {errors.due_date && (
                            <p className="text-sm text-destructive">{errors.due_date.message}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={createTodo.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createTodo.isPending}>
                            {createTodo.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create Todo
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
