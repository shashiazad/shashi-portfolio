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
 * Universal callLLM function.
 * Supports OpenAI-compatible endpoints (OpenAI, Groq, OpenRouter, Ollama, LocalAI, vLLM)
 * and Google Gemini.
 *
 * Configuration via environment variables:
 * - `LLM_API_KEY` or `OPENAI_API_KEY`: API key for OpenAI-compatible services.
 * - `LLM_MODEL`: Model name (e.g. "gpt-4o-mini", "llama-3.3-70b-versatile", "claude-3-5-haiku-20241022").
 * - `LLM_BASE_URL`: Base URL for OpenAI-compatible endpoint (e.g. "https://api.openai.com/v1", "https://api.groq.com/openai/v1", "https://openrouter.ai/api/v1", "http://localhost:11434/v1").
 * - `GEMINI_API_KEY`: Fallback API key if using Google Gemini.
 */
export async function callLLM(
  messages: LLMMessage[],
  options?: LLMOptions
): Promise<LLMResult> {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = (process.env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const model = process.env.LLM_MODEL || 'gpt-4o-mini';

  // If an OpenAI-compatible API key or custom non-OpenAI base URL (like local Ollama) is configured, use OpenAI protocol
  if (apiKey || process.env.LLM_BASE_URL) {
    return callOpenAICompatible(messages, {
      apiKey: apiKey || 'no-key-required',
      baseUrl,
      model,
      temperature: options?.temperature ?? 0.7,
      maxTokens: options?.maxTokens ?? 1000,
      jsonMode: options?.jsonMode ?? false,
    });
  }

  // Otherwise, fallback to Gemini API using GEMINI_API_KEY
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
    console.error(`[LLM] API call to ${endpoint} failed:`, response.status, errorText);
    throw new Error(`LLM API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  if (!text) {
    throw new Error(`LLM (${config.model}) returned an empty response`);
  }

  return {
    text,
    model: config.model,
    provider: config.baseUrl.includes('openai')
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
