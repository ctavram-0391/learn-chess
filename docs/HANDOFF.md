# Session Handoff

This file tracks work in progress across AI coding sessions. Update it when ending a session with incomplete work. Clear it when a task is complete.

---

## Current Task

**Goal**: (None - ready for new work)

**Status**: Idle

---

## Template

When you have work in progress, update this file:

```markdown
## Current Task

**Goal**: Brief description of what you're building

**Status**: In Progress | Blocked | Ready for Review

**Branch**: feature/branch-name (if applicable)

## Progress

- [x] Completed step
- [x] Another completed step
- [ ] **Current step** ← IN PROGRESS
- [ ] Next step
- [ ] Future step

## Files Modified

- `path/to/file.tsx` - What was done
- `path/to/another.ts` - What was done

## Decisions Made

- Chose approach X because Y
- Using library Z for reason W

## Blockers / Questions

- Any issues encountered
- Questions that need answers

## Next Steps (for resuming)

1. First thing to do when resuming
2. Second thing
3. What to verify after resuming
```

---

## How to Use

### Starting a Session

1. Check this file for any work in progress
2. If there's a current task, review the progress and next steps
3. Check `git status` and `git log --oneline -5` for recent changes
4. Ask the user if they want to continue or start fresh

### Ending a Session

If work is incomplete:
1. Commit work-in-progress: `git commit -m "WIP: description"`
2. Update this file with current status
3. Add TODO comments in code for context

### Completing a Task

1. Clear the "Current Task" section
2. Set Status back to "Idle"
3. Remove or archive the progress details

---

## Quick Commands

```bash
# Check recent work
git log --oneline -10
git status

# See what files changed recently  
git diff --stat HEAD~5

# Find TODO comments
grep -r "TODO" src/
```
