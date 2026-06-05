# Code Review

Review the code the user specifies against the patterns established in this codebase.

## Review Checklist

### 1. Correctness
- Does it handle edge cases (empty states, errors, loading)?
- Are there potential bugs or race conditions?
- Does error handling cover likely failure modes?

### 2. Architecture Patterns
Check against @AGENTS.md:
- Does it follow the data flow: Component → Hook → Service → Supabase?
- Are services used correctly (no Inngest or external APIs in services)?
- Are API routes only used when necessary (server-only operations)?

### 3. Security
- Are RLS policies in place and correct?
- Is user data properly scoped (checking user_id)?
- Any sensitive data exposed to the client?
- Input validation with Zod before database operations?

### 4. Type Safety
- Is everything properly typed (no `any` types)?
- Do Zod schemas match TypeScript interfaces?
- Are React Query hooks typed correctly?

### 5. Performance
- Unnecessary re-renders (missing useMemo/useCallback)?
- N+1 query patterns?
- Missing query invalidation after mutations?
- Large components that should be split?

## Reporting Issues

For each issue found:

1. Explain what's wrong and why it matters
2. Show the specific code with the issue
3. Provide the fix
4. Rate severity:
   - **Critical** - Must fix (security vulnerabilities, bugs, broken functionality)
   - **Medium** - Should fix (pattern violations, potential issues)
   - **Low** - Nice to have (style, minor improvements)

## After Reviewing

- Fix all Critical issues immediately
- List Medium and Low issues for the user's review
