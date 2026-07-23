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
    jsonMode: options?.jsonMode ?? true, // Default to jsonMode true for AI features
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
// Robust JSON extraction from LLM text responses
// ---------------------------------------------------------------------------

function sanitizeJsonString(str: string): string {
  return str
    .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas in arrays/objects
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => (c === '\n' || c === '\r' || c === '\t' ? c : '')); // Remove invalid control chars
}

/**
 * Extract a JSON object from an LLM text response.
 * Handles direct JSON, markdown code fences, trailing commas, and wrapped text.
 */
export function extractJson(raw: string): unknown {
  const trimmed = raw.trim();

  // 1. Direct parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  // 2. Markdown fence parse
  const fenceMatch = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)```/i);
  const candidateText = fenceMatch ? fenceMatch[1].trim() : trimmed;

  try {
    return JSON.parse(candidateText);
  } catch {
    // fall through
  }

  // 3. Extract first { to last } or [ to ]
  const firstBrace = candidateText.indexOf('{');
  const lastBrace = candidateText.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const sliced = candidateText.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(sliced);
    } catch {
      // 4. Try sanitized parse (trailing commas, control chars)
      try {
        return JSON.parse(sanitizeJsonString(sliced));
      } catch {
        // fall through
      }
    }
  }

  // 5. Try array match [ ... ] if root is array
  const firstBracket = candidateText.indexOf('[');
  const lastBracket = candidateText.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const slicedArray = candidateText.slice(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(slicedArray);
    } catch {
      try {
        return JSON.parse(sanitizeJsonString(slicedArray));
      } catch {
        // fall through
      }
    }
  }

  throw new Error('Failed to extract JSON from LLM response');
}
