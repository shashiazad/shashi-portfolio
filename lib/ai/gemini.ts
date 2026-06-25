// ---------------------------------------------------------------------------
// Shared Gemini API caller with automatic model fallback
// Extracted from app/api/chat/route.ts and generalised for all AI features
// ---------------------------------------------------------------------------

export interface GeminiOptions {
  temperature?: number;
  maxOutputTokens?: number;
  jsonMode?: boolean;
}

export interface GeminiResult {
  text: string;
  model: string;
}

/** Content part sent to the Gemini API. */
interface ContentPart {
  role: string;
  parts: { text: string }[];
}

const MODEL_CHAIN = [
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-pro',
];

/**
 * Call Gemini API with automatic model fallback.
 *
 * Two calling conventions:
 * 1. `callGemini(systemPrompt, userContent, options)` — single-turn (AI features)
 * 2. `callGeminiWithContents(contents, options)` — multi-turn (chat route)
 */
export async function callGemini(
  systemPrompt: string,
  userContent: string,
  options?: GeminiOptions,
): Promise<GeminiResult> {
  const contents: ContentPart[] = [
    { role: 'user', parts: [{ text: `System instructions: ${systemPrompt}` }] },
    { role: 'model', parts: [{ text: 'Understood. I will follow the instructions.' }] },
    { role: 'user', parts: [{ text: userContent }] },
  ];
  return callGeminiWithContents(contents, options);
}

/**
 * Call Gemini with a pre-built contents array (used by the chat route
 * which manages its own multi-turn conversation history).
 */
export async function callGeminiWithContents(
  contents: ContentPart[],
  options?: GeminiOptions,
): Promise<GeminiResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const temperature = options?.temperature ?? 0.7;
  const maxOutputTokens = options?.maxOutputTokens ?? 1000;

  const generationConfig: Record<string, unknown> = { temperature, maxOutputTokens };
  if (options?.jsonMode) {
    generationConfig.responseMimeType = 'application/json';
  }

  let lastError = '';

  for (const modelName of MODEL_CHAIN) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig }),
    });

    if (response.ok) {
      const data = await response.json();
      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) {
        throw new Error(`Gemini (${modelName}) returned an empty response`);
      }
      return { text, model: modelName };
    }

    const errorText = await response.text();
    console.error(`[gemini] Model ${modelName} failed:`, response.status, errorText);
    lastError = errorText;

    // Only retry on 404 (model not found); other errors are not transient
    if (response.status !== 404) {
      throw new Error(`Gemini API error (${response.status}): ${lastError}`);
    }
  }

  throw new Error(`No available Gemini model. Last error: ${lastError}`);
}

// ---------------------------------------------------------------------------
// JSON extraction from Gemini text responses
// ---------------------------------------------------------------------------

/**
 * Extract a JSON value from a Gemini text response.
 *
 * Strategy:
 * 1. Direct `JSON.parse`
 * 2. Extract from ```json ``` markdown fence
 * 3. Extract from first `{` to last `}`
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

  throw new Error('Failed to extract JSON from Gemini response');
}
