# Code Cleanup

Use this prompt to reduce tech debt without changing behavior. The AI makes targeted improvements while preserving functionality.

## When to Use

- Files have grown too large (>200 lines)
- Duplicate code across components
- Dead code that's no longer used
- Type safety improvements needed
- Before adding new features to messy code

## The Prompt

Copy and paste, replacing `{FILE_OR_MODULE}`:

---

Clean up: **{FILE_OR_MODULE}**

**Goals:**
- Remove dead code (unused imports, functions, variables)
- Extract components that exceed 200 lines
- Consolidate duplicate logic into shared utilities
- Improve type safety (remove `any`, add missing types)
- Add missing error handling where needed

**Constraints:**
- Do NOT change any existing behavior
- Do NOT add new features
- Do NOT refactor working code "just because it could be better"
- Keep changes minimal and focused
- Preserve all existing functionality

**Process:**
1. List what you plan to change and why (wait for approval)
2. Make changes one at a time
3. After each change, verify the code still works
4. Summarize what was changed

**For each proposed change, explain:**
- What: The specific change
- Why: The problem it solves
- Risk: Low/Medium (High risk changes need explicit approval)

---

## Targeted Cleanup Variants

### Extract Components

---

The file **{FILE_PATH}** is too large. Extract logical sections into separate components.

Rules:
- Each new component should have a single responsibility
- Keep related state and logic together
- Use composition, not prop drilling
- Maintain the same external behavior

Show me the proposed component boundaries before extracting.

---

### Remove Dead Code

---

Find and remove dead code in **{FILE_OR_DIRECTORY}**:

- Unused imports
- Unused functions and variables
- Commented-out code blocks
- Unreachable code paths
- Unused type definitions

List everything you plan to remove. Only remove code that is definitively unused (not code that might be used dynamically).

---

### Type Safety

---

Improve type safety in **{FILE_OR_MODULE}**:

- Replace `any` types with proper types
- Add missing return types to functions
- Ensure Zod schemas match TypeScript interfaces
- Add type guards where needed

Do NOT change runtime behavior. Only improve compile-time type checking.

---

### Consolidate Duplicates

---

Find and consolidate duplicate code in **{DIRECTORY}**:

1. Identify patterns that appear in multiple files
2. Propose a shared utility or component
3. Show where it would be used
4. Wait for approval before refactoring

Only consolidate if:
- The pattern appears 3+ times
- The abstraction is clear and simple
- It reduces total code without adding complexity

---

## Tips

- **Start small** - Clean up one file at a time, not entire modules
- **Verify after each change** - Catch regressions immediately
- **Be conservative** - When in doubt, leave it alone
- **Document decisions** - If you keep code that looks dead, add a comment explaining why
