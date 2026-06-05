# AGENTS.md

This document provides AI agents with essential context about this **[APPLICATION_NAME]** and its architectural patterns. This application is built with scalable, enterprise-grade features and follows modern development best practices.

## 🎯 Application Context

<!-- 
📝 UPDATE THIS SECTION: Replace with your specific application context
Describe your application's domain and business logic:
- The specific domain/industry of your application
- Core business logic and workflows
- Key user types and their roles
- Domain-specific terminology and concepts
- Business rules and constraints
- Integration requirements with external services

Example:
This is a project management SaaS for construction teams. Key concepts include:
- Projects with phases, tasks, and milestones
- Team roles: Project Manager, Contractor, Client
- Integration with scheduling and invoicing systems
- Compliance with industry safety standards
-->

> **Update this section** with your application's specific domain context, business logic, user types, and key workflows to help AI systems understand your business domain.

---

## Architecture Philosophy

This architecture emphasizes **scalability, maintainability, and developer experience** through:

### Modular Design
- **Feature-based organization**: Each feature is self-contained with its own components, logic, and types
- **Clear separation of concerns**: UI, business logic, and data access are separated into distinct layers
- **Reusability**: Shared components and utilities are centralized for easy reuse

### Type Safety
- **TypeScript strict mode**: Catch errors at compile time
- **End-to-end typing**: From database to UI, types flow through the application
- **Zod validation**: Runtime validation that generates TypeScript types

### Performance
- **React Query caching**: Intelligent data caching and background updates
- **Server-side rendering**: Next.js App Router for optimal performance
- **Optimistic updates**: Immediate UI feedback with background synchronization

---

## Tech Stack

### Core Technologies
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Database**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack React Query v5
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **Background Jobs**: Inngest (durable workflows, queues, cron jobs)
- **Testing**: Jest + React Testing Library

### Production Features
- **Analytics**: Vercel Analytics & Speed Insights
- **SEO**: Dynamic metadata generation and sitemaps
- **Environment Validation**: Zod-based environment variable validation
- **Error Handling**: React error boundaries

---

## Project Structure

```
/
├── supabase/              # Supabase configuration (root level)
│   ├── config.toml        # Supabase CLI configuration
│   └── migrations/        # Database migration files
├── docs/
│   └── supabase/          # Supabase development prompts
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (dashboard)/  # Protected dashboard routes
│   │   ├── api/          # API route handlers
│   │   └── providers.tsx # App-wide providers
│   ├── components/       # Shared UI components
│   │   ├── ui/          # shadcn/ui components
│   │   └── layout/      # Layout components
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication system
│   │   ├── todos/       # Example feature module
│   │   └── users/       # User management
│   ├── lib/             # Utility functions
│   │   ├── supabase/    # Supabase client configuration
│   │   └── inngest/     # Inngest client and functions
│   ├── hooks/           # Shared custom hooks
│   └── middleware.ts    # Route protection
```

---

## Module Architecture Pattern

Every module follows a consistent structure:

```
/src/modules/{feature}/
├── components/           # Feature-specific React components
├── hooks/               # Custom React Query hooks
├── services/            # Business logic and data access
├── types.ts             # TypeScript interfaces
└── validations.ts       # Zod validation schemas
```

---

## Key Patterns

### Data Fetching Pattern
**Flow**: Component → Custom Hook → Service → Supabase

```typescript
// 1. Define Types (types.ts)
export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    user_id: string;
    created_at: string;
}

// 2. Create Service (services/todos.ts)
export class TodoService {
    async getTodos(userId: string): Promise<Todo[]> {
        const supabase = await createSupabaseClient();
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw new Error(error.message);
        return data as Todo[];
    }
}

// 3. Create Hook (hooks/useTodos.ts)
export function useTodos() {
    const { user } = useAuth();
    
    return useQuery({
        queryKey: ['todos', user?.id],
        queryFn: () => todoService.getTodos(user!.id),
        enabled: !!user?.id,
    });
}

// 4. Use in Component
export function TodoList() {
    const { data: todos, isLoading } = useTodos();
    
    if (isLoading) return <div>Loading...</div>;
    
    return (
        <div className="space-y-4">
            {todos?.map(todo => (
                <TodoCard key={todo.id} todo={todo} />
            ))}
        </div>
    );
}
```

### Form Validation Pattern

```typescript
// validations.ts
export const createTodoSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

export type CreateTodoFormData = z.infer<typeof createTodoSchema>;

// Component with form
const form = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
});
```

### Authentication Pattern

```typescript
// Check authentication status
const { user, isAuthenticated } = useAuth();

if (!isAuthenticated) {
    return <div>Please log in</div>;
}
```

---

## Data Access Patterns

### The Data Flow Hierarchy

```
CLIENT (Browser)
    │
    ▼
React Query Hooks
    │
    ├─────────────────────┬─────────────────────────────┐
    ▼                     ▼                             ▼
Service Methods       API Routes                   (Supabase
(direct - FAST)       (server-only ops)             Realtime)
    │                     │
    ▼                     ├──────────┬────────────────┐
Supabase              Services   inngest.send()   External APIs
                                 (background)     (with secrets)
```

### Pattern 1: Simple CRUD (80-90% of Operations)

**Flow**: `Hook → Service → Supabase` (fastest path, no server hop)

```typescript
// Most operations use this pattern - direct to Supabase via services
export function useCreateTodo() {
    return useMutation({
        mutationFn: (data: CreateTodoData) => todoService.createTodo(data),
    });
}
```

### Pattern 2: Operations Requiring Server-Only Code

**Flow**: `Hook → API Route → Service + Inngest/External APIs`

Use API routes when you need: Inngest events, external APIs with secrets, or server env vars.

```typescript
// API Route - orchestrates server-only operations
export async function POST(request: NextRequest) {
    const data = await request.json();
    
    // Business logic via service
    const order = await orderService.createOrder(data);
    
    // Server-only: external API + background job
    const payment = await stripe.paymentIntents.create({...});
    await inngest.send({ name: 'order/created', data: { orderId: order.id } });
    
    return NextResponse.json({ order, clientSecret: payment.client_secret });
}
```

### Pattern 3: Inngest Functions

**Flow**: `Inngest → Service Methods` (reuse business logic)

```typescript
export const processOrder = inngest.createFunction(
    { id: "process-order" },
    { event: "order/created" },
    async ({ event, step }) => {
        // Reuse services - don't duplicate logic
        await step.run("fulfill", () => orderService.fulfill(event.data.orderId));
    }
);
```

### Decision Matrix

| Scenario | Pattern |
|----------|---------|
| Read/write data (Supabase only) | Hook → Service → Supabase |
| Mutation + Inngest/email/notifications | Hook → API Route → Service + `inngest.send()` |
| Mutation + external API (Stripe, etc.) | Hook → API Route → Service + External API |
| External webhook (Stripe calls you) | API Route → Service + Inngest |
| Scheduled/cron job | Inngest cron → Service |

### Anti-Patterns

```typescript
// ❌ NEVER: Service calling inngest.send() - services may run client-side
class OrderService {
    async createOrder(data) {
        const order = await this.insert(data);
        await inngest.send({...}); // WRONG - won't work on client
    }
}

// ❌ NEVER: Hook calling inngest.send() directly - runs on client
export function useCreateOrder() {
    return useMutation({
        mutationFn: async (data) => {
            const order = await orderService.createOrder(data);
            await inngest.send({...}); // WRONG
        },
    });
}

// ❌ NEVER: Component calling Supabase directly - bypasses service layer
function TodoList() {
    useEffect(() => {
        supabase.from('todos').select('*')... // WRONG
    }, []);
}
```

### Key Principles

1. **Services are universal** - They run on client OR server, so no server-only code
2. **Keep the fast path fast** - Most CRUD goes Hook → Service → Supabase
3. **API routes orchestrate** - They coordinate services + server-only operations
4. **Inngest reuses services** - Background functions call service methods for logic

---

## Cursor Commands

Pre-built commands optimized for AI-assisted development are available via Cursor's `/` menu. These commands help AI understand this codebase and produce higher-quality code.

### Available Commands

Type `/` in Cursor's chat to see these commands:

| Command | When to Use |
|---------|-------------|
| `/explore-and-plan` | Before implementing significant features - explores codebase, considers options, creates implementation plan |
| `/new-module` | Creating a new feature module from scratch following the established patterns |
| `/code-review` | After implementing a feature to catch issues before they reach production |
| `/cleanup` | Reducing tech debt without changing behavior |

### Usage

1. Type `/` in Cursor's chat input
2. Select a command from the dropdown
3. Add your context after the command

**Example:**
```
/explore-and-plan Add a notifications system that sends emails when todos are due
```

### Session Continuity

For tracking work across sessions, see `@docs/HANDOFF.md`. Update it when ending a session with incomplete work.

### Command Details

For detailed documentation on each command, see `docs/prompts/`

---

## Common Workflows

### Adding a New Feature Module

1. **Create module structure**:
   ```bash
   mkdir -p src/modules/my-feature/{components,hooks,services}
   ```

2. **Define types** (`types.ts`)
3. **Create validation schemas** (`validations.ts`)
4. **Build service class** (`services/my-feature.ts`)
5. **Create React Query hooks** (`hooks/useMyFeature.ts`)
6. **Build components** (`components/`)
7. **Create pages** (`app/(dashboard)/my-feature/page.tsx`)
8. **Update navigation** (`components/layout/app-sidebar.tsx`)

### When to Create API Routes

**Most data operations should use direct Supabase calls via React Query hooks.** Only create API routes when you need:

**✅ Use API Routes For:**
- **Server-side operations** that shouldn't expose credentials to client
- **Webhook handlers** from external services (Stripe, SendGrid, etc.)
- **Complex server-side processing** that requires multiple database operations
- **Third-party API calls** that require secret keys
- **File uploads** to cloud storage with server-side validation
- **Scheduled jobs** or cron-like functionality

**❌ Avoid API Routes For:**
- **Simple CRUD operations** - use Supabase client directly
- **User authentication** - handled by Supabase Auth
- **Real-time subscriptions** - use Supabase realtime
- **Basic data fetching** - React Query + Supabase is more efficient

**Important: Keep API Routes Thin**
- **API routes should be minimal** - handle request/response only
- **Delegate to service methods** - all business logic belongs in services
- **Services are reusable** - can be called from hooks, API routes, or server components

**Example: When to Use Each Approach**

```typescript
// ✅ Direct Supabase call via service (preferred for most cases)
// services/todos.ts
export class TodoService {
  async getTodos(userId: string): Promise<Todo[]> {
    const supabase = await createSupabaseClient();
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw new Error(error.message);
    return data as Todo[];
  }
}

// hooks/useTodos.ts
export function useTodos() {
  const { user } = useAuth();
  const todoService = new TodoService();
  
  return useQuery({
    queryKey: ['todos', user?.id],
    queryFn: () => todoService.getTodos(user!.id),
    enabled: !!user?.id,
  });
}

// ✅ API route (when server-side processing needed)
// /app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.text();
  
  // Verify webhook signature with secret key
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  // Delegate business logic to service
  const paymentService = new PaymentService();
  await paymentService.processStripeWebhook(event);
  
  return Response.json({ received: true });
}
```

### Inngest Background Jobs Pattern

Inngest is used for background jobs, scheduled tasks, and multi-step durable workflows. Functions are defined with steps that automatically retry on failure.

**When to Use Inngest:**
- **Background processing** - Email sending, file processing, data sync
- **Multi-step workflows** - User onboarding, order fulfillment
- **Scheduled/cron jobs** - Cleanup tasks, report generation
- **Event-driven tasks** - React to user actions, webhooks
- **Long-running operations** - AI processing, data migrations

**Creating Inngest Functions:**

```typescript
// src/lib/inngest/functions/notifications.ts
import { inngest } from "../client";

export const sendWelcomeEmail = inngest.createFunction(
  {
    id: "send-welcome-email",
    retries: 3, // Automatic retries on failure
  },
  { event: "user/signed.up" }, // Event trigger
  async ({ event, step }) => {
    // Step 1: Get user details (automatically retried)
    const user = await step.run("get-user", async () => {
      return await db.users.findById(event.data.userId);
    });

    // Step 2: Send email
    await step.run("send-email", async () => {
      await emailService.send({
        to: user.email,
        template: "welcome",
      });
    });

    // Step 3: Wait 1 day, then send follow-up
    await step.sleep("wait-for-follow-up", "1d");

    await step.run("send-follow-up", async () => {
      await emailService.send({
        to: user.email,
        template: "getting-started",
      });
    });

    return { success: true };
  }
);
```

**Registering Functions:**

```typescript
// src/lib/inngest/functions/index.ts
import { sendWelcomeEmail } from "./notifications";

export const functions = [
  sendWelcomeEmail,
  // Add more functions here
];
```

**Triggering Events (Server-Side Only):**

```typescript
// From API routes ONLY - inngest.send() requires server-side execution
// app/api/users/route.ts
import { inngest } from "@/lib/inngest/client";

export async function POST(request: NextRequest) {
  const user = await userService.createUser(data);
  
  // Safe to call inngest here - we're on the server
  await inngest.send({
    name: "user/signed.up",
    data: { userId: user.id, email: user.email },
  });
  
  return NextResponse.json(user);
}
```

> ⚠️ **Important**: Never call `inngest.send()` from services or React Query hooks — they may run client-side where Inngest events cannot be sent securely.

### Environment Variables

Required variables (`.env.local`):

```bash
# Supabase - Local Development (default)
# Get these from: npm run db:start
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from-db-start-output>

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="[YOUR_APP_NAME]"
NEXT_PUBLIC_SITE_DESCRIPTION="[YOUR_APP_DESCRIPTION]"
```

---

## Local Development Workflow

This project uses **local Supabase development** for faster iteration and version-controlled schema changes.

### Initial Setup (One-Time)

```bash
# 1. Install dependencies
npm install

# 2. Start local Supabase (requires Docker)
npm run db:start

# 3. Copy local credentials to .env.local
# The db:start command outputs API URL and anon key

# 4. Run your Next.js app
npm run dev
```

### Daily Development Workflow

```bash
# Start local Supabase stack
npm run db:start

# In another terminal, start Inngest Dev Server
npx inngest-cli@latest dev

# In another terminal, run your Next.js app
npm run dev

# When done for the day
npm run db:stop
```

### Creating Database Schema Changes

**Option 1: Create Migration Files (Recommended)**

```bash
# Create a new migration file
npm run db:migration add_products_table

# Edit the generated file in supabase/migrations/
# Then apply it locally
npm run db:reset
```

**Option 2: Use Studio Dashboard**

```bash
# Access local Studio at http://127.0.0.1:54323
# Make changes in the UI
# Generate migration from changes:
npx supabase db diff -f add_products_table
```

### Migration Best Practices

- **Always enable RLS** on new tables
- **Create granular policies** (separate for select, insert, update, delete)
- **Use descriptive comments** explaining the purpose
- **Test migrations locally** with `npm run db:reset` before pushing

### Example Migration Structure

```sql
-- Migration: Create products table
-- Purpose: Add product management functionality
-- Affected: products table, RLS policies

create table public.products (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  user_id uuid references auth.users(id) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.products enable row level security;

-- RLS Policies
create policy "Users can view their own products"
  on public.products for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own products"
  on public.products for insert
  to authenticated
  with check (auth.uid() = user_id);
```

---

## CI/CD & Deployment

### Deployment Pipeline

**Application Deployment (Vercel):**
- **Platform**: Vercel (optimized for Next.js)
- **Auto-deployment**: Connected to main branch
- **Preview Deployments**: Automatic for all branches
- **Environment**: Production variables managed in Vercel dashboard

**Database Deployment (Supabase):**
- **Local Development**: Run `npm run db:start` for local PostgreSQL
- **Branching**: Supabase can create preview databases per Git branch
- **Migration Deployment**: Migrations auto-apply on deployment
- **Production**: Migrations pushed via `npm run db:push` or CI/CD

### Branching & Preview Environments

When using Supabase branching (optional but recommended):

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make schema changes locally**:
   ```bash
   npm run db:migration add_new_table
   # Edit migration file
   npm run db:reset  # Test locally
   ```

3. **Push to GitHub**:
   ```bash
   git add supabase/migrations/
   git commit -m "Add new table migration"
   git push origin feature/new-feature
   ```

4. **Automatic Preview Environment**:
   - Supabase creates a preview database for this branch
   - Vercel creates a preview deployment
   - Preview deployment connects to preview database
   - Test your changes in isolated environment

5. **Merge to main**:
   - Migrations automatically apply to production database
   - Production deployment goes live

### Manual Migration Deployment

If not using Supabase branching:

```bash
# Push migrations to production
npm run db:push

# Or link to specific project
npx supabase link --project-ref your-project-id
npm run db:push
```

### Environment Management

```bash
# Local Development
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key-from-db-start>

# Production (set in Vercel dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-production-anon-key>
```

---

## UI & Component Development

### Component Architecture Principles

**Extract Components Early:**
- **Single Responsibility**: Each component should have one clear purpose
- **Reusability**: Extract common patterns into shared components
- **Composition over Inheritance**: Build complex UIs by combining simple components
- **Keep Files Small**: Aim for <200 lines per component file

**Component Extraction Guidelines:**
```typescript
// ❌ Bloated component (400+ lines)
export function UserDashboard() {
  // Profile section (50 lines)
  // Settings section (100 lines)  
  // Activity feed (150 lines)
  // Notifications (100 lines)
  return (/* massive JSX */);
}

// ✅ Extracted components
export function UserDashboard() {
  return (
    <div className="space-y-6">
      <UserProfile />
      <UserSettings />
      <ActivityFeed />
      <NotificationPanel />
    </div>
  );
}
```

**When to Extract:**
- **Repeated patterns** across multiple components
- **Complex logic** that can be isolated
- **Large components** (>200 lines)
- **Independent functionality** that could be reused

### Clean Code Principles

**Less Code = Less Tech Debt:**
- **Avoid premature abstraction** - extract only when you have 2+ use cases
- **Delete unused code** immediately - don't leave "just in case" code
- **Use built-in solutions** - leverage Next.js, React Query, and shadcn/ui features
- **Prefer composition** over complex prop drilling

**Code Quality Guidelines:**
```typescript
// ❌ Overengineered
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  // ... 15 more props
}

// ✅ Simple and focused
interface CreateTodoButtonProps {
  onCreateTodo: () => void;
  isLoading?: boolean;
}
```

**Lean Development:**
- **Start simple** - add complexity only when needed
- **Use TypeScript** to catch errors early
- **Leverage existing patterns** from the codebase
- **Write tests** for complex business logic only

---

## Maintaining This Document

### AI Guidelines for Updating AGENTS.md

**When to Update:**
- New feature modules are added
- Architecture patterns change or evolve
- New technologies or dependencies are introduced
- Database schema changes significantly
- New development workflows are established

**What to Update:**
1. **Application Context** - Add new domain concepts, user types, or business rules
2. **Tech Stack** - Update versions, add new dependencies, remove unused ones
3. **Project Structure** - Reflect new directories or organizational changes
4. **Patterns** - Document new architectural patterns or modify existing ones
5. **Workflows** - Add new development processes or update existing ones

**How to Update:**
1. **Read the current state** of AGENTS.md before making changes
2. **Verify accuracy** by checking actual file structure and dependencies
3. **Keep it concise** - Add essential information, remove outdated content
4. **Use placeholders** - Maintain [APPLICATION_NAME] and similar placeholders
5. **Update examples** - Ensure code examples reflect current patterns
6. **Test references** - Verify all file paths and imports are correct

**Update Triggers:**
- After adding a new module: Update project structure and add pattern examples
- After changing database schema: Update migration examples and RLS patterns  
- After adding new dependencies: Update tech stack section
- After establishing new conventions: Update best practices and patterns

**Example Update Process:**
```typescript
// When adding a new feature module, update:
// 1. Project structure section
// 2. Add example following the established pattern
// 3. Update navigation workflow if needed
// 4. Add any new best practices discovered
```

---

## Best Practices

### 🏗️ Architecture
1. **Use the module pattern** - Keep features self-contained in `/src/modules`
2. **Follow the data flow** - Component → Hook → Service → Supabase
3. **Update application context** - Keep domain context current

### 💻 Development
4. **Use local Supabase** - Develop with `npm run db:start` for faster iteration
5. **Version control schema** - All database changes go in migration files
6. **Mobile-first styling** - Start with mobile (320px+), enhance for desktop
7. **Type everything** - Leverage TypeScript strict mode and Zod validation
8. **Environment validation** - Use `src/lib/env.ts` for type-safe variables
9. **Invalidate queries** - Keep UI in sync after mutations
10. **Business logic in services** - Keep hooks and API routes thin, delegate to service methods

### 🎨 UI/UX
11. **Extract components early** - Keep files <200 lines, extract reusable patterns
12. **Use shadcn/ui components** - Pre-styled, accessible components
13. **Show user feedback** - Use toast notifications for actions
14. **Handle loading states** - Always show loading indicators

### 🔒 Security & Performance
15. **Protect routes** - Use middleware for authentication
16. **Enable RLS** - Row Level Security on all Supabase tables
17. **Optimize queries** - Use React Query caching and stale time

### 🛣️ Data Access
18. **Use the fast path for CRUD** - Hook → Service → Supabase (no server hop)
19. **API routes for server-only ops** - Inngest, external APIs, webhooks, secrets
20. **Services stay universal** - No Inngest calls, no external APIs, no server secrets
21. **API routes orchestrate** - Call services for logic, add server-only operations

### ⚡ Background Jobs (Inngest)
22. **Trigger from API routes only** - Never call `inngest.send()` from services or hooks
23. **Reuse services in functions** - Inngest functions call service methods for business logic
24. **Break work into steps** - Each step is independently retried
25. **Use step.sleep for delays** - Durable delays without blocking

### 🧹 Code Quality
26. **Less code = less tech debt** - Start simple, add complexity only when needed
27. **Delete unused code** - Remove dead code immediately
28. **Avoid premature abstraction** - Extract only when you have 2+ use cases
29. **Leverage existing solutions** - Use built-in Next.js, React Query, and shadcn/ui features

---

**This is a living document.** Keep the "Application Context" section updated with your current business domain and logic.