// ---------------------------------------------------------------------------
// Universal LLM Client & Provider Abstraction
// Easily switch between OpenAI, Groq, OpenRouter, Ollama, Anthropic, or Gemini
// ---------------------------------------------------------------------------

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface LLMResult {
  text: string;
  model: string;
  provider: string;
}

/** Content part for Gemini API fallback format */
export interface GeminiContentPart {
  role: string;
  parts: { text: string }[];
}

const GEMINI_MODEL_CHAIN = [
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-pro',
];

/**
 * Default model fallback chain for OpenAI-compatible providers.
 *
 * Tuned for Groq (https://console.groq.com/docs/models) as of 2026: the older
 * `llama-3.x-*-versatile` models were decommissioned, so we default to the
 * OpenAI OSS models which are the current production replacements. The primary
 * model can be overridden with `LLM_MODEL` and the backups with
 * `LLM_MODEL_FALLBACKS` (comma-separated).
 */
const GROQ_MODEL_CHAIN = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'llama-3.1-8b-instant'];
const OPENAI_MODEL_CHAIN = ['gpt-4o-mini'];

/**
 * Build the ordered list of models to try for an OpenAI-compatible endpoint.
 * `LLM_MODEL` (if set) is always tried first, followed by `LLM_MODEL_FALLBACKS`
 * and then a provider-appropriate default chain. Duplicates are removed.
 */
function resolveModelChain(baseUrl: string): string[] {
  const primary = process.env.LLM_MODEL?.trim();
  const explicitFallbacks = (process.env.LLM_MODEL_FALLBACKS || '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);

  const defaultChain = baseUrl.includes('groq')
    ? GROQ_MODEL_CHAIN
    : baseUrl.includes('openai')
    ? OPENAI_MODEL_CHAIN
    : primary
    ? []
    : OPENAI_MODEL_CHAIN;

  const chain = [primary, ...explicitFallbacks, ...defaultChain].filter(
    (m): m is string => Boolean(m)
  );

  return Array.from(new Set(chain));
}

/**
 * Universal callLLM function.
 * Supports OpenAI-compatible endpoints (OpenAI, Groq, OpenRouter, Ollama, LocalAI, vLLM)
 * and Google Gemini.
 *
 * Configuration via environment variables:
 * - `LLM_API_KEY` or `OPENAI_API_KEY`: API key for OpenAI-compatible services.
 * - `LLM_MODEL`: Primary model name (e.g. "openai/gpt-oss-120b", "gpt-4o-mini").
 * - `LLM_MODEL_FALLBACKS`: Comma-separated backup models tried if the primary fails.
 * - `LLM_BASE_URL`: Base URL for the OpenAI-compatible endpoint
 *   (e.g. "https://api.groq.com/openai/v1", "https://openrouter.ai/api/v1").
 * - `GEMINI_API_KEY`: Final fallback if the OpenAI-compatible chain is exhausted.
 */
export async function callLLM(
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<LLMResult> {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  // If an OpenAI-compatible API key or custom non-OpenAI base URL (like local Ollama)
  // is configured, use the OpenAI protocol with an automatic model fallback chain.
  if (apiKey || process.env.LLM_BASE_URL) {
    const models = resolveModelChain(baseUrl);
    let lastError: unknown = null;

    for (const model of models) {
      try {
        return await callOpenAICompatible(messages, {
          apiKey: apiKey || 'no-key-required',
          baseUrl,
          model,
          temperature: options?.temperature ?? 0.7,
          maxTokens: options?.maxTokens ?? 1000,
          jsonMode: options?.jsonMode ?? false,
        });
      } catch (err) {
        lastError = err;
        console.warn(`[LLM] Model "${model}" failed, trying next fallback...`, err instanceof Error ? err.message : err);
      }
    }

    // OpenAI-compatible chain exhausted — fall through to Gemini if available.
    if (!hasGemini) {
      throw lastError instanceof Error
        ? lastError
        : new Error('All configured LLM models failed and no GEMINI_API_KEY fallback is set.');
    }
    console.warn('[LLM] OpenAI-compatible chain exhausted — falling back to Gemini.');
  }

  // Otherwise (or as a last resort), use the Gemini API with GEMINI_API_KEY.
  return callGeminiFallback(messages, options);
}

/**
 * Call OpenAI-compatible REST endpoint (/chat/completions)
 */
async function callOpenAICompatible(
  messages: LLMMessage[],
  config: {
    apiKey: string;
    baseUrl: string;
    model: string;
    temperature: number;
    maxTokens: number;
    jsonMode: boolean;
  }
): Promise<LLMResult> {
  const endpoint = `${config.baseUrl}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (config.apiKey && config.apiKey !== 'no-key-required') {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  const payload: Record<string, unknown> = {
    model: config.model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    temperature: config.temperature,
    max_tokens: config.maxTokens,
  };

  if (config.jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[LLM] API call to ${endpoint} (${config.model}) failed:`, response.status, errorText);
    throw new Error(`LLM API error (${response.status}) for model ${config.model}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  if (!text) {
    throw new Error(`LLM (${config.model}) returned an empty response`);
  }

  return {
    text,
    model: config.model,
    provider: config.baseUrl.includes('openai') && !config.baseUrl.includes('groq')
      ? 'openai'
      : config.baseUrl.includes('groq')
      ? 'groq'
      : config.baseUrl.includes('openrouter')
      ? 'openrouter'
      : 'custom',
  };
}

/**
 * Fallback implementation using Gemini API
 */
async function callGeminiFallback(
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<LLMResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'No LLM API key configured. Please set LLM_API_KEY (for OpenAI/Groq/OpenRouter) or GEMINI_API_KEY in your environment.'
    );
  }

  // Convert LLMMessage array to Gemini contents format
  const contents: GeminiContentPart[] = [];

  // Extract system prompt if present
  const systemMsg = messages.find((m) => m.role === 'system');
  const nonSystemMsgs = messages.filter((m) => m.role !== 'system');

  if (systemMsg) {
    contents.push({ role: 'user', parts: [{ text: `System instructions: ${systemMsg.content}` }] });
    contents.push({ role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] });
  }

  for (const m of nonSystemMsgs) {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    });
  }

  const temperature = options?.temperature ?? 0.7;
  const maxOutputTokens = options?.maxTokens ?? 1000;

  const generationConfig: Record<string, unknown> = { temperature, maxOutputTokens };
  if (options?.jsonMode) {
    generationConfig.responseMimeType = 'application/json';
  }

  let lastError = '';

  for (const modelName of GEMINI_MODEL_CHAIN) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) {
        throw new Error(`Gemini (${modelName}) returned an empty response`);
      }
      return { text, model: modelName, provider: 'gemini' };
    }

    const errorText = await response.text();
    console.error(`[gemini] Model ${modelName} failed:`, response.status, errorText);
    lastError = errorText;

    if (response.status !== 404) {
      throw new Error(`Gemini API error (${response.status}): ${lastError}`);
    }
  }

  throw new Error(`No available Gemini model. Last error: ${lastError}`);
}
