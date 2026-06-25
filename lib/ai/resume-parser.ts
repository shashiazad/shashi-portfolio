// ---------------------------------------------------------------------------
// PDF text extraction using pdfjs-dist (server-side)
// ---------------------------------------------------------------------------

import type { TextItem } from 'pdfjs-dist/types/src/display/api';

const DEFAULT_MAX_CHARS = 15_000;

/**
 * Extract text from a PDF buffer using pdfjs-dist.
 * Returns concatenated page text, truncated to maxChars.
 *
 * Handles empty/corrupted PDFs gracefully — returns empty string instead of throwing.
 */
export async function extractTextFromPdf(
  buffer: Buffer,
  maxChars: number = DEFAULT_MAX_CHARS,
): Promise<string> {
  try {
    // Force Vercel/Next.js to copy/bundle the pdf.worker.js file in production builds
    // @ts-ignore
    await import('pdfjs-dist/legacy/build/pdf.worker.js');

    // Dynamic import to avoid issues with server-side module resolution
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');

    if (pdfjsLib.GlobalWorkerOptions) {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.js');
      } catch {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '';
      }
    }

    const data = new Uint8Array(buffer);
    const doc = await pdfjsLib.getDocument({ data, isEvalSupported: false }).promise;

    const pages: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .filter((item): item is TextItem => 'str' in item)
        .map((item) => item.str)
        .join(' ');
      pages.push(text);
    }

    const fullText = pages.join('\n\n').trim();
    return fullText.length > maxChars ? fullText.slice(0, maxChars) : fullText;
  } catch (err) {
    console.error('[resume-parser] Failed to extract text from PDF:', err);
    return '';
  }
}
