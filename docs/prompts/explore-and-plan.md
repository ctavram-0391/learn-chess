# Explore and Plan

Use this prompt **before** implementing significant features or changes. It ensures the AI understands your codebase patterns and considers options before writing code.

## When to Use

- New features spanning multiple files
- Unfamiliar parts of the codebase
- Architectural decisions with tradeoffs
- When you're unsure of the best approach
- Complex refactoring or migrations

## The Prompt

Copy and paste, replacing `{YOUR_GOAL}`:

---

I want to: {YOUR_GOAL}

Before implementing, I need you to:

**1. Explore** - Read the relevant files and understand current patterns:
   - Check @AGENTS.md for architecture patterns and data flow
   - Find similar existing implementations in the codebase
   - Identify which module(s) this affects
   - Note any database tables, API routes, or services involved

**2. Consider Options** - Present 2-3 approaches with tradeoffs:
   - What's the simplest approach that works?
   - What's the most flexible/scalable approach?
   - What aligns best with existing patterns in this codebase?
   - For each option: effort level, pros, cons, and when you'd choose it

**3. Recommend** - Pick one approach and explain:
   - Why this approach over the others
   - Any risks or things to watch out for
   - Dependencies or prerequisites

**4. Plan** - Create a numbered implementation checklist:
   - List specific files to create or modify
   - Note any database migrations needed
   - Identify the order of operations
   - Include verification steps between major changes

**Do NOT start implementing yet.** Present your findings and wait for my approval of the plan.

---

## After Planning

Once you approve the plan, start a new message with:

```
Implement the plan above.

After each major step:
1. Verify it works before continuing
2. Run any relevant tests
3. Check for TypeScript errors

If you encounter issues, stop and explain before proceeding.
```

## Example

**Goal**: "Add a notifications system that sends emails when todos are due"

The AI will:
1. Read the todos module to understand the data model
2. Check how Inngest is used for background jobs
3. Present options (polling vs event-driven, email provider choices)
4. Recommend an approach based on existing patterns
5. Create a step-by-step plan: migration → service → Inngest function → UI

## Tips

- **Be specific about constraints** - If you need it done a certain way, say so upfront
- **Provide context** - "This is for a multi-tenant app" or "Performance is critical" changes the recommendations
- **It's okay to iterate** - Ask follow-up questions about the plan before approving
