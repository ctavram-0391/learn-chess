# Code Cleanup

Clean up the code the user specifies. Reduce tech debt without changing behavior.

## Goals

- Remove dead code (unused imports, functions, variables)
- Extract components that exceed 200 lines
- Consolidate duplicate logic into shared utilities
- Improve type safety (remove `any`, add missing types)
- Add missing error handling where needed

## Constraints

- Do NOT change any existing behavior
- Do NOT add new features
- Do NOT refactor working code "just because it could be better"
- Keep changes minimal and focused
- Preserve all existing functionality

## Process

1. **First, list what you plan to change and why** - Wait for approval before making changes
2. Make changes one at a time
3. After each change, verify the code still works
4. Summarize what was changed

## For Each Proposed Change

Explain:
- **What**: The specific change
- **Why**: The problem it solves
- **Risk**: Low / Medium (High risk changes need explicit approval)

## Risk Levels

- **Low**: Removing obviously unused imports, fixing typos
- **Medium**: Extracting components, consolidating logic
- **High**: Changing shared utilities, modifying data flow (requires explicit approval)
