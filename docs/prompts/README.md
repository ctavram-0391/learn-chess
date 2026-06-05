# Prompt Library

These prompts are available as **Cursor commands** - type `/` in Cursor's chat to use them.

## Quick Start

1. Type `/` in Cursor's chat input
2. Select a command from the dropdown
3. Add your context after the command

**Example:**
```
/explore-and-plan Add user authentication with OAuth
```

## Available Commands

| Command | When to Use |
|---------|-------------|
| `/explore-and-plan` | Before implementing significant features or changes |
| `/new-module` | Creating a new feature module from scratch |
| `/code-review` | After implementing a feature to catch issues |
| `/cleanup` | Reducing tech debt without changing behavior |

Commands are stored in `.cursor/commands/` and automatically appear in Cursor's `/` menu.

## Detailed Documentation

The files in this directory provide detailed documentation for each command:

- [`explore-and-plan.md`](./explore-and-plan.md) - Full workflow for planning features
- [`new-module.md`](./new-module.md) - Module creation guide with examples
- [`code-review.md`](./code-review.md) - Review checklist and variants
- [`cleanup.md`](./cleanup.md) - Cleanup strategies and variants

## Best Practices

### Explore Before Implementing

For any non-trivial task, use `/explore-and-plan` first. This ensures the AI:
- Understands existing patterns in the codebase
- Considers multiple approaches
- Creates a clear implementation plan before writing code

### Add Context After Commands

The more context you provide, the better the results:

```
/new-module products - e-commerce products with variants, pricing, and inventory tracking
```

### Verify Each Step

All commands encourage verification after changes. This catches issues early.

## Creating New Commands

To add a new command:

1. Create a `.md` file in `.cursor/commands/`
2. Write direct instructions to the AI (not copy/paste templates)
3. The command name is the filename (e.g., `my-command.md` → `/my-command`)

Optionally add detailed documentation in `docs/prompts/` for reference.

## Session Continuity

For tracking work across sessions, see [`../HANDOFF.md`](../HANDOFF.md).
