// ---------------------------------------------------------------------------
// Privacy + intent helpers for Siya.
//
// Siya talks to recruiters and hiring managers on Shashi's behalf, so it may
// share professional details and city-level location, but never anything
// sensitive. The system prompt tells the model this; the functions below are the
// deterministic backstop: they catch a reply that leaked something it shouldn't
// and provide guaranteed answers for the highest-value requests (address,
// resume) even if the model slips or is unavailable.
// ---------------------------------------------------------------------------

import { profile } from '@/data/profile';

export const RESUME_PATH = '/resume.pdf';
export const RESUME_LINK_MARKDOWN = `[Download Resume (PDF)](${RESUME_PATH})`;

// ----- sensitive-data guard -------------------------------------------------

const SENSITIVE_PATTERNS: RegExp[] = [
  // Phone numbers: Indian mobiles (with/without +91) and international +CC numbers.
  /(?<![\d.])(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?!\d)/,
  /(?<![\w])\+\d{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}(?!\d)/,
  // Government / financial identifiers.
  /\b\d{4}\s\d{4}\s\d{4}\b/, // Aadhaar
  /\b[A-Z]{5}\d{4}[A-Z]\b/, // PAN
  /\b(?:[Pp]assport|[Aa]adhaa?r|PAN|SSN)\b[^\n]{0,25}?\b(?=[A-Za-z0-9]*\d)[A-Za-z0-9]{6,}\b/,
  // Street-level addresses: "12/3, 4th Cross Road", "Flat 204", "plot no. 5".
  /\b(?:flat|apt|apartment|house|plot|door)\s*(?:no\.?|number|#)?\s*[\w-]*\d[\w-]*/i,
  /\b\d{1,4}[A-Za-z]?(?:\/\d+)?[,\s]+(?:[\p{L}\p{N}.]+\s+){0,4}(?:road|rd\.?|street|st\.|lane|nagar|layout|colony|cross|main|sector|block|avenue|marg|gali|apartments?|enclave)\b/iu,
  /\b(?:pin\s*code|postal\s*code|zip(?:\s*code)?|pin)\b\s*[:\-]?\s*\d{5,6}\b/i,
  // Date of birth with an actual date (refusals that merely say "date of birth" are fine).
  /\b(?:date\s+of\s+birth|dob|born(?:\s+on)?)\s*(?:is|was|:|-|=)?\s*(?:the\s+)?(?:\d|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b)/i,
  // Compensation figures: the keyword must be followed directly by an amount.
  /\b(?:ctc|salary|compensation|stipend|pay)\b\s*(?:is|was|of|around|about|approximately|expectation\s+is|:|-|=)?\s*(?:rs\.?|inr|₹|\$|usd|eur|£)?\s*\d/i,
  /\b\d+(?:\.\d+)?\s*(?:lpa|lakhs?|lacs?|crores?)\b/i,
];

/** True when a reply appears to contain private details Siya must never share. */
export function containsSensitiveData(text: string): boolean {
  return SENSITIVE_PATTERNS.some((p) => p.test(text));
}

export function buildPrivacyRedirect(): string {
  return `I keep personal details like phone numbers, street addresses, ID numbers, and compensation private. I'm happy to help with anything professional about Shashi, and for anything else please email him at ${profile.contact.email} or message him on [LinkedIn](${profile.contact.linkedin}).`;
}

// ----- intents ---------------------------------------------------------------

export interface Intents {
  resume: boolean;
  address: boolean;
}

const RESUME_RE = /\b(?:resume|cv|curriculum\s+vitae)\b|résumé/i;
const ADDRESS_RE =
  /\b(?:address|addr|residen(?:ce|tial|t)|where\s+(?:does|do|is|are)\s+(?:he|you|shashi)\s+(?:live|stay|reside|located|based|from)|home\s*town|native\s+(?:place|city)|permanent\s+(?:location|place|city|home)|which\s+city|where\s+is\s+he\s+(?:based|located|from))\b/i;

export function detectIntents(text: string): Intents {
  return { resume: RESUME_RE.test(text), address: ADDRESS_RE.test(text) };
}

// ----- deterministic replies -------------------------------------------------

/** Cities only, never a street address. */
export function buildAddressReply(): string {
  return `I don't share full street addresses, but at city level: his present location is ${profile.contact.location}, and his hometown (permanent base) is ${profile.contact.hometown}. If you need a full address for something like background verification, please email Shashi at ${profile.contact.email}.`;
}

function yearsOfExperience(): string | null {
  return /(\d+\+?\s+years)/i.exec(profile.summary)?.[1] ?? null;
}

/** A short, factual résumé blurb built from the profile, plus the download link. */
export function buildResumeReply(): string {
  const years = yearsOfExperience();
  const stack = [
    ...profile.skills.languages.slice(0, 3),
    ...profile.skills.backend.slice(0, 2),
    ...profile.skills.aiTools.slice(0, 2),
  ].join(', ');
  const degree = profile.education[0];
  const experience = years ? ` with ${years} of experience` : '';

  return (
    `Here's a quick snapshot: Shashi is a ${profile.title} at ${profile.company}${experience}, working across backend services, distributed systems, and agentic AI. ` +
    `Core skills include ${stack}. He holds an ${degree.degree.replace(' in Computer Science and Engineering', ' (CSE)')} from ${degree.school}.\n\n` +
    `The full resume has the details, and you can download it here: ${RESUME_LINK_MARKDOWN}`
  );
}

/**
 * Make sure a résumé answer links to the real file: drop any made-up résumé /
 * PDF links the model produced, then append the correct one if it's missing.
 */
export function ensureResumeLink(reply: string): string {
  const cleaned = reply.replace(
    /\[([^\]]+)\]\((?!\/resume\.pdf\))[^)]*(?:resume|\.pdf)[^)]*\)/gi,
    '$1'
  );
  if (cleaned.includes(`](${RESUME_PATH})`)) return cleaned;
  return `${cleaned.trimEnd()}\n\n${RESUME_LINK_MARKDOWN}`;
}
