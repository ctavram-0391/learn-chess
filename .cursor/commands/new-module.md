# New Module

The user wants to create a new feature module. Follow the established module architecture pattern from this codebase.

## Before Writing Code

1. Read @src/modules/todos as a reference implementation
2. Read @AGENTS.md for data flow patterns (Component → Hook → Service → Supabase)
3. Propose the database schema for this feature, including:
   - Table name and columns
   - Foreign keys and relationships
   - RLS policies needed

**Wait for approval of the schema before proceeding.**

## Module Structure

Follow this pattern from @AGENTS.md:

```
/src/modules/{feature}/
├── components/           # Feature-specific React components
├── hooks/               # Custom React Query hooks
├── services/            # Business logic and data access
├── types.ts             # TypeScript interfaces
└── validations.ts       # Zod validation schemas
```

## Implementation Order

After schema approval, implement in this order:

1. **types.ts** - Define TypeScript interfaces matching the database schema
2. **validations.ts** - Create Zod schemas for create/update operations
3. **Migration** - Create the database migration in `supabase/migrations/`
4. **services/{feature}.ts** - Create the service class with CRUD operations
5. **hooks/use{Feature}.ts** - Create React Query hooks for data fetching
6. **components/** - Build the UI components
7. **Page route** - Create the page at `app/dashboard/{feature}/page.tsx`
8. **Navigation** - Add to the sidebar in `components/layout/app-sidebar.tsx`

## After Each Step

- Run `npm run db:reset` after creating the migration
- Check for TypeScript errors
- Verify components render without errors
