import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    usePathname() {
        return '/'
    },
}))

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
    createSupabaseClient: jest.fn(() => Promise.resolve({
        auth: {
            getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
            getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
            signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
            signUp: jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
            signOut: jest.fn(() => Promise.resolve({ error: null })),
            onAuthStateChange: jest.fn(() => ({
                data: { subscription: { unsubscribe: jest.fn() } }
            })),
        },
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
    })),
    createBrowserSupabaseClient: jest.fn(() => ({
        auth: {
            getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
            getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
        },
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
    })),
    createServerSupabaseClient: jest.fn(() => Promise.resolve({
        auth: {
            getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: null })),
        },
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
    })),
}))

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(() => ({
        data: null,
        isLoading: false,
        error: null,
    })),
    useMutation: jest.fn(() => ({
        mutate: jest.fn(),
        mutateAsync: jest.fn(),
        isPending: false,
    })),
    useQueryClient: jest.fn(() => ({
        invalidateQueries: jest.fn(),
        setQueryData: jest.fn(),
        removeQueries: jest.fn(),
    })),
    QueryClient: jest.fn(),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock toast notifications
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
    },
    Toaster: () => null,
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})
