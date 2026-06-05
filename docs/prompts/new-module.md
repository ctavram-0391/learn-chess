# New Module

Use this prompt when creating a new feature module from scratch. It ensures the AI follows the established module architecture pattern.

## When to Use

- Adding a major new feature (e.g., "products", "invoices", "comments")
- The feature needs its own data model, services, and UI components
- You want a self-contained module following project conventions

## The Prompt

Copy and paste, replacing `{FEATURE_NAME}` and `{DESCRIPTION}`:

---

Create a new module for: **{FEATURE_NAME}**

Description: {DESCRIPTION}

Follow the module pattern from @AGENTS.md:

```
/src/modules/{feature}/
├── components/           # Feature-specific React components
├── hooks/               # Custom React Query hooks
├── services/            # Business logic and data access
├── types.ts             # TypeScript interfaces
└── validations.ts       # Zod validation schemas
```

**Before writing any code:**

1. Read @src/modules/todos as a reference implementation
2. Read @AGENTS.md for data flow patterns (Component → Hook → Service → Supabase)
3. Propose the database schema for this feature, including:
   - Table name and columns
   - Foreign keys and relationships
   - RLS policies needed

Wait for my approval of the schema before proceeding.

**Implementation order** (after schema approval):

1. **types.ts** - Define TypeScript interfaces matching the database schema
2. **validations.ts** - Create Zod schemas for create/update operations
3. **Migration** - Create the database migration in `supabase/migrations/`
4. **services/{feature}.ts** - Create the service class with CRUD operations
5. **hooks/use{Feature}.ts** - Create React Query hooks for data fetching
6. **components/** - Build the UI components
7. **Page route** - Create the page at `app/dashboard/{feature}/page.tsx`
8. **Navigation** - Add to the sidebar in `components/layout/app-sidebar.tsx`

**After each step:**
- Run `npm run db:reset` after creating the migration
- Check for TypeScript errors
- Verify the component renders without errors

---

## What the AI Will Create

Following the todos module pattern, you'll get:

```
/src/modules/{feature}/
├── components/
│   ├── {feature}-list.tsx        # List view component
│   ├── {feature}-card.tsx        # Individual item card
│   ├── create-{feature}-dialog.tsx   # Create form dialog
│   └── edit-{feature}-dialog.tsx     # Edit form dialog
├── hooks/
│   └── use{Feature}.ts           # React Query hooks
├── services/
│   └── {feature}.ts              # Service class
├── types.ts                      # TypeScript interfaces
└── validations.ts                # Zod schemas
```

Plus:
- Database migration with RLS policies
- Dashboard page route
- Sidebar navigation entry

## Tips

- **Describe relationships** - "Products belong to a user and have many variants"
- **Mention special requirements** - "Needs soft delete" or "Should support file uploads"
- **Reference existing patterns** - "Similar to how todos work, but with categories"
