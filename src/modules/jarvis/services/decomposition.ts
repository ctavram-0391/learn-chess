import 'server-only';

import { anthropic } from '@/lib/anthropic';
import type { DispatchRequest, DecompositionResult } from '../types';

const DECOMPOSITION_PROMPT = `You are a task decomposition engine for a personal AI assistant called Jarvis.

Given a user's task request, decide whether it should be:
1. Executed as a single task (simple requests)
2. Decomposed into multiple subtasks with dependencies (complex requests)

For the MVP, the only available executor type is "research" — which uses Claude with web search to research topics, synthesize information, and produce written outputs.

Respond with a JSON object matching this schema:
{
  "subtasks": [
    {
      "description": "Clear description of what this subtask should accomplish",
      "executor_type": "research",
      "depends_on_indices": [],  // indices of subtasks this depends on (0-based)
      "estimated_tokens": 5000   // rough estimate
    }
  ],
  "reasoning": "Brief explanation of why you decomposed it this way"
}

Rules:
- For simple requests (single search, one question), return a single subtask with no dependencies
- For complex requests, break into 2-5 subtasks maximum
- Dependencies form a DAG — no circular dependencies
- Each subtask should be independently executable once its dependencies are met
- Be practical — don't over-decompose`;

export class DecompositionService {
    async decompose(request: DispatchRequest): Promise<DecompositionResult> {
        const userMessage = request.context
            ? `Task: ${request.description}\n\nAdditional context: ${request.context}`
            : `Task: ${request.description}`;

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-5-20250929',
            max_tokens: 2000,
            system: DECOMPOSITION_PROMPT,
            messages: [{ role: 'user', content: userMessage }],
        });

        const text = response.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('');

        // Extract JSON from response (may be wrapped in markdown code block)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            // Fallback: single task, no decomposition
            return {
                subtasks: [{
                    description: request.description,
                    executor_type: 'research',
                    depends_on_indices: [],
                    estimated_tokens: 5000,
                }],
                reasoning: 'Could not decompose — treating as single task.',
            };
        }

        try {
            const parsed = JSON.parse(jsonMatch[0]) as DecompositionResult;

            // Validate structure
            if (!parsed.subtasks || parsed.subtasks.length === 0) {
                throw new Error('No subtasks returned');
            }

            // Ensure all subtasks have required fields
            for (const subtask of parsed.subtasks) {
                subtask.executor_type = subtask.executor_type ?? 'research';
                subtask.depends_on_indices = subtask.depends_on_indices ?? [];
            }

            return parsed;
        } catch {
            return {
                subtasks: [{
                    description: request.description,
                    executor_type: 'research',
                    depends_on_indices: [],
                    estimated_tokens: 5000,
                }],
                reasoning: 'Failed to parse decomposition — treating as single task.',
            };
        }
    }
}

export const decompositionService = new DecompositionService();
