'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTodos } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import { TodoCard } from './todo-card';
import { CreateTodoDialog } from './create-todo-dialog';
import { LoadingState } from '@/components/loading-spinner';
import { TodoFilters } from '../types';
import {
    Plus,
    Search,
    Filter,
    CheckSquare,
    Clock,
    AlertCircle,
    Calendar
} from 'lucide-react';

export function TodoList() {
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [filters, setFilters] = useState<TodoFilters>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const { data: categories } = useCategories();

    // Get todos based on active tab and filters
    const getTabFilters = (tab: string): TodoFilters => {
        const baseFilters = { ...filters, search: searchQuery || undefined };

        switch (tab) {
            case 'pending':
                return { ...baseFilters, completed: false };
            case 'completed':
                return { ...baseFilters, completed: true };
            case 'overdue':
                return { ...baseFilters, completed: false, due_date: 'overdue' };
            case 'today':
                return { ...baseFilters, completed: false, due_date: 'today' };
            default:
                return baseFilters;
        }
    };

    const { data: todos, isLoading } = useTodos(getTabFilters(activeTab));

    const handleFilterChange = (key: keyof TodoFilters, value: string | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    const clearFilters = () => {
        setFilters({});
        setSearchQuery('');
    };

    const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery;

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search todos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Todo
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            <CardTitle className="text-base">Filters</CardTitle>
                        </div>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                Clear all
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-4">
                        {/* Priority Filter */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Priority</label>
                            <Select
                                value={filters.priority || undefined}
                                onValueChange={(value) => handleFilterChange('priority', value === 'all' ? undefined : value)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Category</label>
                            <Select
                                value={filters.category || undefined}
                                onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    {categories?.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all" className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        All
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Pending
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Completed
                    </TabsTrigger>
                    <TabsTrigger value="overdue" className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Overdue
                    </TabsTrigger>
                    <TabsTrigger value="today" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Today
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {todos && todos.length > 0 ? (
                        <div className="grid gap-4">
                            {todos.map((todo) => (
                                <TodoCard key={todo.id} todo={todo} />
                            ))}
                        </div>
                    ) : (
                        isLoading ? (
                            <LoadingState message="Loading todos..." />
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium mb-2">
                                        {activeTab === 'all' && 'No todos found'}
                                        {activeTab === 'pending' && 'No pending todos'}
                                        {activeTab === 'completed' && 'No completed todos'}
                                        {activeTab === 'overdue' && 'No overdue todos'}
                                        {activeTab === 'today' && 'No todos due today'}
                                    </h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        {activeTab === 'all' && hasActiveFilters
                                            ? 'Try adjusting your filters or search terms.'
                                            : activeTab === 'all'
                                                ? 'Get started by creating your first todo.'
                                                : 'Great job! Keep up the good work.'}
                                    </p>
                                    {activeTab === 'all' && (
                                        <Button onClick={() => setShowCreateDialog(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Todo
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    )}
                </TabsContent>
            </Tabs>

            {/* Create Todo Dialog */}
            <CreateTodoDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
            />
        </div>
    );
}
