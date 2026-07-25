import { NextResponse } from 'next/server';

/**
 * POST /api/tts
 * Converts text to speech using Microsoft Edge's neural TTS engine
 * with the en-IN-NeerjaNeural voice (Indian English female).
 * No API key required — uses the free Edge Read Aloud service.
 */
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Truncate to prevent abuse (max ~2000 chars)
    const cleanedText = text.trim().slice(0, 2000);

    const { EdgeTTS } = await import('edge-tts-universal');

    const tts = new EdgeTTS(cleanedText, 'en-IN-NeerjaNeural', {
      rate: '+5%',
      pitch: '+15Hz',
    });

    const result = await tts.synthesize();

    // Convert Blob to ArrayBuffer then to Node Buffer
    const arrayBuffer = await result.audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('[TTS] Edge TTS synthesis failed:', error);
    return NextResponse.json(
      { error: 'Voice synthesis failed' },
      { status: 500 }
    );
  }
}
