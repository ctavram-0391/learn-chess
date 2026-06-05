import { todoService } from '../todos'
import { createSupabaseClient } from '@/lib/supabase/client'
import { createMockTodo } from '@/lib/test-utils'

// Mock Supabase client
jest.mock('@/lib/supabase/client')

const mockSupabaseClient = createSupabaseClient as jest.MockedFunction<typeof createSupabaseClient>

describe('TodoService', () => {
    let mockSupabase: any

    beforeEach(() => {
        mockSupabase = {
            from: jest.fn(() => ({
                select: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockReturnThis(),
                single: jest.fn(),
                or: jest.fn().mockReturnThis(),
                lt: jest.fn().mockReturnThis(),
                gte: jest.fn().mockReturnThis(),
            })),
            auth: {
                getUser: jest.fn(() => ({
                    data: { user: { id: 'user-1' } },
                })),
            },
        }

        mockSupabaseClient.mockResolvedValue(mockSupabase)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getTodos', () => {
        it('fetches todos successfully', async () => {
            const mockTodos = [createMockTodo(), createMockTodo({ id: '2' })]
            mockSupabase.from().single.mockResolvedValue({ data: mockTodos, error: null })

            const result = await todoService.getTodos()

            expect(mockSupabase.from).toHaveBeenCalledWith('todos')
            expect(result).toEqual(mockTodos)
        })

        it('applies filters correctly', async () => {
            const filters = {
                completed: false,
                priority: 'high' as const,
                category: 'Work',
                search: 'test',
            }

            mockSupabase.from().single.mockResolvedValue({ data: [], error: null })

            await todoService.getTodos(filters)

            expect(mockSupabase.from().eq).toHaveBeenCalledWith('completed', false)
            expect(mockSupabase.from().eq).toHaveBeenCalledWith('priority', 'high')
            expect(mockSupabase.from().eq).toHaveBeenCalledWith('category', 'Work')
            expect(mockSupabase.from().or).toHaveBeenCalledWith('title.ilike.%test%,description.ilike.%test%')
        })

        it('throws error when fetch fails', async () => {
            const error = new Error('Database error')
            mockSupabase.from().single.mockResolvedValue({ data: null, error })

            await expect(todoService.getTodos()).rejects.toThrow('Database error')
        })
    })

    describe('createTodo', () => {
        it('creates todo successfully', async () => {
            const todoData = {
                title: 'New Todo',
                description: 'Description',
                priority: 'medium' as const,
            }
            const createdTodo = createMockTodo(todoData)

            mockSupabase.from().single.mockResolvedValue({ data: createdTodo, error: null })

            const result = await todoService.createTodo(todoData)

            expect(mockSupabase.from).toHaveBeenCalledWith('todos')
            expect(mockSupabase.from().insert).toHaveBeenCalledWith({
                ...todoData,
                user_id: 'user-1',
                due_date: null,
            })
            expect(result).toEqual(createdTodo)
        })

        it('throws error when user is not authenticated', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

            await expect(todoService.createTodo({ title: 'Test' })).rejects.toThrow('User not authenticated')
        })
    })

    describe('updateTodo', () => {
        it('updates todo successfully', async () => {
            const updateData = { title: 'Updated Title' }
            const updatedTodo = createMockTodo(updateData)

            mockSupabase.from().single.mockResolvedValue({ data: updatedTodo, error: null })

            const result = await todoService.updateTodo('1', updateData)

            expect(mockSupabase.from).toHaveBeenCalledWith('todos')
            expect(mockSupabase.from().update).toHaveBeenCalledWith(updateData)
            expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', '1')
            expect(result).toEqual(updatedTodo)
        })
    })

    describe('deleteTodo', () => {
        it('deletes todo successfully', async () => {
            mockSupabase.from().delete.mockResolvedValue({ error: null })

            await todoService.deleteTodo('1')

            expect(mockSupabase.from).toHaveBeenCalledWith('todos')
            expect(mockSupabase.from().delete).toHaveBeenCalled()
            expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', '1')
        })
    })

    describe('toggleTodo', () => {
        it('toggles todo completion status', async () => {
            const currentTodo = createMockTodo({ completed: false })
            const toggledTodo = createMockTodo({ completed: true })

            mockSupabase.from().single
                .mockResolvedValueOnce({ data: currentTodo, error: null })
                .mockResolvedValueOnce({ data: toggledTodo, error: null })

            const result = await todoService.toggleTodo('1')

            expect(mockSupabase.from().update).toHaveBeenCalledWith({ completed: true })
            expect(result).toEqual(toggledTodo)
        })
    })

    describe('getTodoStats', () => {
        it('calculates stats correctly', async () => {
            const mockTodos = [
                createMockTodo({ completed: true, priority: 'high' }),
                createMockTodo({ completed: false, priority: 'medium', due_date: '2020-01-01T00:00:00Z' }),
                createMockTodo({ completed: false, priority: 'low', category: 'Personal' }),
            ]

            mockSupabase.from().select.mockResolvedValue({ data: mockTodos, error: null })

            const stats = await todoService.getTodoStats()

            expect(stats.total).toBe(3)
            expect(stats.completed).toBe(1)
            expect(stats.pending).toBe(2)
            expect(stats.overdue).toBe(1)
            expect(stats.by_priority.high).toBe(1)
            expect(stats.by_priority.medium).toBe(1)
            expect(stats.by_priority.low).toBe(1)
        })
    })
})
