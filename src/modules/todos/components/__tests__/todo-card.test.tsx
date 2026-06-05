import { screen, fireEvent, waitFor } from '@testing-library/react'
import { render, createMockTodo } from '@/lib/test-utils'
import { TodoCard } from '../todo-card'
import { useToggleTodo, useDeleteTodo } from '../../hooks/useTodos'

// Mock the hooks
jest.mock('../../hooks/useTodos', () => ({
    useToggleTodo: jest.fn(),
    useDeleteTodo: jest.fn(),
}))

// Mock the dialogs
jest.mock('../edit-todo-dialog', () => ({
    EditTodoDialog: ({ open }: { open: boolean }) =>
        open ? <div data-testid="edit-dialog">Edit Dialog</div> : null,
}))

const mockToggleTodo = useToggleTodo as jest.MockedFunction<typeof useToggleTodo>
const mockDeleteTodo = useDeleteTodo as jest.MockedFunction<typeof useDeleteTodo>

describe('TodoCard', () => {
    const mockTodo = createMockTodo()

    beforeEach(() => {
        mockToggleTodo.mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
        } as unknown as ReturnType<typeof useToggleTodo>)

        mockDeleteTodo.mockReturnValue({
            mutate: jest.fn(),
            isPending: false,
        } as unknown as ReturnType<typeof useDeleteTodo>)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('renders todo information correctly', () => {
        render(<TodoCard todo={mockTodo} />)

        expect(screen.getByText(mockTodo.title)).toBeInTheDocument()
        expect(screen.getByText(mockTodo.description!)).toBeInTheDocument()
        expect(screen.getByText('medium')).toBeInTheDocument()
        expect(screen.getByText(mockTodo.category!)).toBeInTheDocument()
    })

    it('renders in compact mode', () => {
        render(<TodoCard todo={mockTodo} compact />)

        expect(screen.getByText(mockTodo.title)).toBeInTheDocument()
        // Description should not be visible in compact mode
        expect(screen.queryByText(mockTodo.description!)).not.toBeInTheDocument()
    })

    it('shows completed state correctly', () => {
        const completedTodo = createMockTodo({ completed: true })
        render(<TodoCard todo={completedTodo} />)

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toBeChecked()
    })

    it('handles toggle todo', async () => {
        const mockMutate = jest.fn()
        mockToggleTodo.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as unknown as ReturnType<typeof useToggleTodo>)

        render(<TodoCard todo={mockTodo} />)

        const checkbox = screen.getByRole('checkbox')
        fireEvent.click(checkbox)

        expect(mockMutate).toHaveBeenCalledWith(mockTodo.id)
    })

    it('opens edit dialog when edit is clicked', async () => {
        render(<TodoCard todo={mockTodo} />)

        const menuButton = screen.getByRole('button', { name: /open menu/i })
        fireEvent.click(menuButton)

        const editButton = screen.getByText('Edit')
        fireEvent.click(editButton)

        await waitFor(() => {
            expect(screen.getByTestId('edit-dialog')).toBeInTheDocument()
        })
    })

    it('handles delete todo with confirmation', async () => {
        const mockMutate = jest.fn()
        mockDeleteTodo.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        } as unknown as ReturnType<typeof useDeleteTodo>)

        // Mock window.confirm
        const originalConfirm = window.confirm
        window.confirm = jest.fn(() => true)

        render(<TodoCard todo={mockTodo} />)

        const menuButton = screen.getByRole('button', { name: /open menu/i })
        fireEvent.click(menuButton)

        const deleteButton = screen.getByText('Delete')
        fireEvent.click(deleteButton)

        expect(window.confirm).toHaveBeenCalled()
        expect(mockMutate).toHaveBeenCalledWith(mockTodo.id)

        // Restore original confirm
        window.confirm = originalConfirm
    })

    it('shows overdue status for past due todos', () => {
        const overdueTodo = createMockTodo({
            due_date: '2020-01-01T00:00:00Z',
            completed: false,
        })

        render(<TodoCard todo={overdueTodo} />)

        expect(screen.getByText('Overdue')).toBeInTheDocument()
    })

    it('shows due today status', () => {
        const today = new Date()
        const todayTodo = createMockTodo({
            due_date: today.toISOString(),
            completed: false,
        })

        render(<TodoCard todo={todayTodo} />)

        expect(screen.getByText('Due today')).toBeInTheDocument()
    })
})
