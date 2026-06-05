// ── Status & Priority Enums ──────────────────────────────

export type TaskStatus =
    | 'pending'
    | 'queued'
    | 'running'
    | 'needs_input'
    | 'completed'
    | 'failed'
    | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ExecutorType = 'research';

// ── Event Types ──────────────────────────────────────────

export type EventType =
    | 'task.created'
    | 'task.decomposed'
    | 'task.queued'
    | 'task.started'
    | 'task.progress'
    | 'task.needs_input'
    | 'task.input_received'
    | 'task.completed'
    | 'task.failed'
    | 'task.cancelled'
    | 'executor.log'
    | 'attention.flagged'
    | 'attention.resolved';

export type EventSourceKind = 'user' | 'jarvis' | 'executor' | 'system';

// ── Core Data Models ─────────────────────────────────────

export interface Task {
    id: string;
    parent_id: string | null;
    user_id: string;
    status: TaskStatus;
    priority: TaskPriority;
    executor_type: ExecutorType | null;
    session_id: string | null;
    description: string;
    context_summary: string | null;
    originating_dispatch: string;
    requires_attention: boolean;
    attention_reason: string | null;
    attention_priority: TaskPriority | null;
    budget_usd: number | null;
    spent_usd: number;
    tokens_used: number;
    result_json: TaskResult | null;
    error_json: TaskError | null;
    created_at: string;
    updated_at: string;
    completed_at: string | null;
}

export interface TaskResult {
    summary: string;
    outputs?: TaskOutput[];
    metrics?: {
        tokensUsed: number;
        costUsd: number;
        durationMs: number;
    };
}

export interface TaskOutput {
    kind: 'text' | 'link' | 'structured';
    content: string;
    description?: string;
    data?: Record<string, unknown>;
}

export interface TaskError {
    code: string;
    message: string;
    recoverable: boolean;
    suggestedAction?: string;
}

export interface TaskDependency {
    task_id: string;
    depends_on: string;
}

export interface JarvisEvent {
    id: string;
    timestamp: string;
    source_kind: EventSourceKind;
    source_id: string | null;
    type: EventType;
    task_id: string | null;
    user_id: string;
    payload: Record<string, unknown>;
    correlation_id: string | null;
    parent_event_id: string | null;
}

export interface Notification {
    id: string;
    task_id: string;
    event_id: string;
    user_id: string;
    dashboard_surfaced_at: string;
    dashboard_actioned: boolean;
    conversation_decision: ConversationDecision;
    conversation_surfaced: boolean;
    resolved: boolean;
    resolved_via: 'dashboard' | 'conversation' | 'timeout' | null;
    resolved_at: string | null;
}

export interface ConversationDecision {
    shouldSurface: boolean;
    priority: 'interrupt' | 'next_turn' | 'background';
    reason: string;
}

export interface Message {
    id: string;
    user_id: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    tool_calls: unknown[] | null;
    created_at: string;
}

export interface ExecutorSession {
    session_id: string;
    task_id: string;
    executor_type: ExecutorType;
    status: string;
    started_at: string;
    ended_at: string | null;
    tokens_used: number;
    cost_usd: number;
}

// ── API Request/Response Types ───────────────────────────

export interface DispatchRequest {
    description: string;
    priority?: TaskPriority;
    context?: string;
    budget_usd?: number;
}

export interface TaskResponse {
    task_id: string;
    response: string;
}

export interface TaskFilters {
    status?: TaskStatus;
    needs_attention?: boolean;
    priority?: TaskPriority;
    limit?: number;
}

// ── Decomposition Types ──────────────────────────────────

export interface DecompositionSubtask {
    description: string;
    executor_type: ExecutorType;
    depends_on_indices: number[];
    estimated_tokens?: number;
}

export interface DecompositionResult {
    subtasks: DecompositionSubtask[];
    reasoning: string;
}

// ── Executor Types ───────────────────────────────────────

export interface ExecutionContext {
    userId: string;
    parentTaskId?: string;
    correlationId?: string;
}

export interface ExecutionResult {
    success: boolean;
    needsInput: boolean;
    inputRequest?: InputRequest;
    result?: TaskResult;
    error?: TaskError;
    tokensUsed: number;
    costUsd: number;
}

export interface InputRequest {
    question: string;
    options?: InputOption[];
    context: string;
    priority: TaskPriority;
}

export interface InputOption {
    id: string;
    label: string;
    description?: string;
    recommended?: boolean;
}

// ── Inngest Event Types ──────────────────────────────────

export interface JarvisInngestEvents {
    'jarvis/task.decompose': {
        data: {
            taskId: string;
            userId: string;
            request: DispatchRequest;
        };
    };
    'jarvis/task.execute': {
        data: {
            taskId: string;
            userId: string;
        };
    };
}
