// ---------------------------------------------------------------------------
// Shared LLM API caller with automatic fallback
// Wraps callLLM for unified multi-provider support across all AI features
// ---------------------------------------------------------------------------

import { callLLM, LLMMessage } from './llm';

export interface GeminiOptions {
  temperature?: number;
  maxOutputTokens?: number;
  jsonMode?: boolean;
}

export interface GeminiResult {
  text: string;
  model: string;
}

/** Content part format compatibility wrapper */
export interface ContentPart {
  role: string;
  parts: { text: string }[];
}

/**
 * Single-turn LLM call for AI features (Job extraction, Resume analysis, Feedback generation)
 */
export async function callGemini(
  systemPrompt: string,
  userContent: string,
  options?: GeminiOptions,
): Promise<GeminiResult> {
  const messages: LLMMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ];

  const result = await callLLM(messages, {
    temperature: options?.temperature,
    maxTokens: options?.maxOutputTokens,
    jsonMode: options?.jsonMode,
  });

  return { text: result.text, model: result.model };
}

/**
 * Multi-turn LLM call compatibility wrapper
 */
export async function callGeminiWithContents(
  contents: ContentPart[],
  options?: GeminiOptions,
): Promise<GeminiResult> {
  const messages: LLMMessage[] = [];

  for (const item of contents) {
    const rawRole = item.role;
    const text = item.parts.map((p) => p.text).join('\n');

    if (text.startsWith('System instructions: ')) {
      messages.push({ role: 'system', content: text.replace(/^System instructions:\s*/, '') });
    } else if (rawRole === 'user') {
      messages.push({ role: 'user', content: text });
    } else if (rawRole === 'model' || rawRole === 'assistant') {
      messages.push({ role: 'assistant', content: text });
    }
  }

  const result = await callLLM(messages, {
    temperature: options?.temperature,
    maxTokens: options?.maxOutputTokens,
    jsonMode: options?.jsonMode,
  });

  return { text: result.text, model: result.model };
}

// ---------------------------------------------------------------------------
// JSON extraction from LLM text responses
// ---------------------------------------------------------------------------

/**
 * Extract a JSON object from an LLM text response.
 */
export function extractJson(raw: string): unknown {
  const trimmed = raw.trim();

  // 1. Direct parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  // 2. Markdown fence
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // fall through
    }
  }

  // 3. First { to last }
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch {
      // fall through
    }
  }

  throw new Error('Failed to extract JSON from LLM response');
}
