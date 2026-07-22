import { NextRequest, NextResponse } from 'next/server';
import { containsHiringDecisionLanguage, audit } from '@/lib/constitution';
import { callLLM, LLMMessage } from '@/lib/ai/llm';
import { getPortfolioSystemPrompt } from '@/lib/ai/portfolioContext';

const CHAT_UNAVAILABLE_MESSAGES = [
  'I can\'t respond right now. Please try again shortly.',
  'I\'m temporarily unavailable. Please explore the site and retry in a moment.',
  'I\'m unable to answer right now. Please check About, Projects, or Referrals for now.',
  'I\'m having trouble responding at the moment. Please try again soon.',
];

let lastUnavailableMessageIndex = -1;

function getUnavailableMessage() {
  if (CHAT_UNAVAILABLE_MESSAGES.length === 1) return CHAT_UNAVAILABLE_MESSAGES[0];

  let nextIndex = Math.floor(Math.random() * CHAT_UNAVAILABLE_MESSAGES.length);
  while (nextIndex === lastUnavailableMessageIndex) {
    nextIndex = Math.floor(Math.random() * CHAT_UNAVAILABLE_MESSAGES.length);
  }

  lastUnavailableMessageIndex = nextIndex;
  return CHAT_UNAVAILABLE_MESSAGES[nextIndex];
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 400 });
    }

    // Build complete dynamic system prompt from profile.ts
    const systemPrompt = getPortfolioSystemPrompt();

    // Format conversation history for universal LLM client
    const formattedMessages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content,
      })),
    ];

    try {
      const result = await callLLM(formattedMessages, {
        temperature: 0.7,
        maxTokens: 1000,
      });

      let message = result.text || 'Sorry, I couldn\'t generate a response.';

      // Constitution guard: strip responses that imply hiring decisions
      if (containsHiringDecisionLanguage(message)) {
        message = 'I can help you with information about Shashi and the referral process, but I\'m not able to speak to hiring decisions or outcomes. For specific questions about your application, please email Shashi at shashisa.cse@gmail.com.';
      }

      audit('chat.response', { model: result.model, provider: result.provider });
      return NextResponse.json({ message });
    } catch (err) {
      console.error('[chat] LLM call failed:', err);
      return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 });
    }
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: getUnavailableMessage() }, { status: 503 });
  }
}
