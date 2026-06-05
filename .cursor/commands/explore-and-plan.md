# Explore and Plan

The user wants to implement a feature or make changes. Before writing any code, you must explore the codebase and create a plan.

## Step 1: Explore

Read the relevant files and understand current patterns:

- Check @AGENTS.md for architecture patterns and data flow
- Find similar existing implementations in the codebase
- Identify which module(s) this affects
- Note any database tables, API routes, or services involved

## Step 2: Consider Options

Present 2-3 approaches with tradeoffs:

- What's the simplest approach that works?
- What's the most flexible/scalable approach?
- What aligns best with existing patterns in this codebase?

For each option, explain: effort level, pros, cons, and when you'd choose it.

## Step 3: Recommend

Pick one approach and explain:

- Why this approach over the others
- Any risks or things to watch out for
- Dependencies or prerequisites

## Step 4: Plan

Create a numbered implementation checklist:

- List specific files to create or modify
- Note any database migrations needed
- Identify the order of operations
- Include verification steps between major changes

## Important

**Do NOT start implementing yet.** Present your findings and wait for the user's approval of the plan before writing any code.
