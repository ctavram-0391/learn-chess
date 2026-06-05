# Code Review

Use this prompt after implementing a feature to catch issues before they reach production. The AI reviews code against the patterns established in this codebase.

## When to Use

- After completing a feature implementation
- Before creating a pull request
- When you want a second opinion on your approach
- Periodic review of critical modules

## The Prompt

Copy and paste, replacing `{FEATURE_OR_FILES}`:

---

Review the code for: **{FEATURE_OR_FILES}**

Check against the patterns in @AGENTS.md and look for:

**1. Correctness**
- Does it handle edge cases (empty states, errors, loading)?
- Are there potential bugs or race conditions?
- Does error handling cover likely failure modes?

**2. Architecture Patterns**
- Does it follow the data flow: Component → Hook → Service → Supabase?
- Are services used correctly (no Inngest or external APIs in services)?
- Are API routes only used when necessary (server-only operations)?

**3. Security**
- Are RLS policies in place and correct?
- Is user data properly scoped (checking user_id)?
- Any sensitive data exposed to the client?
- Input validation with Zod before database operations?

**4. Type Safety**
- Is everything properly typed (no `any` types)?
- Do Zod schemas match TypeScript interfaces?
- Are React Query hooks typed correctly?

**5. Performance**
- Unnecessary re-renders (missing useMemo/useCallback)?
- N+1 query patterns?
- Missing query invalidation after mutations?
- Large components that should be split?

**For each issue found:**
1. Explain what's wrong and why it matters
2. Show the specific code with the issue
3. Provide the fix
4. Rate severity: **Critical** (must fix) | **Medium** (should fix) | **Low** (nice to have)

**After reviewing:**
- Fix all Critical issues immediately
- List Medium and Low issues for my review

---

## Quick Review Variant

For a faster review focused on critical issues only:

---

Quick review: **{FILE_PATH}**

Focus only on:
- Security vulnerabilities
- Obvious bugs
- Pattern violations from @AGENTS.md

Skip style/formatting issues. Only report Critical or Medium severity issues.

---

## Module-Specific Review

For reviewing an entire module:

---

Review the entire **{MODULE_NAME}** module at `src/modules/{module}/`

Check:
- All components, hooks, and services follow project patterns
- Types and validations are complete and consistent
- Database operations have proper error handling
- React Query hooks use correct query keys and invalidation

Provide a summary with:
- Overall assessment (Good / Needs Work / Major Issues)
- List of issues by severity
- Suggested improvements (optional, not required changes)

---

## Tips

- **Be specific about focus areas** - "Pay special attention to the auth flow"
- **Provide context** - "This handles payment data, so security is critical"
- **Ask for alternatives** - "If there's a better pattern, show me"
