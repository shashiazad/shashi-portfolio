// ---------------------------------------------------------------------------
// Visitor memory for Siya.
//
// Siya can remember who a visitor is (name / role / company) so it can greet
// them properly and answer "do you know who I am?". Everything here is pure and
// dependency-free so it runs identically in the browser (where the memory is
// stored, in localStorage only) and on the server (where it is re-sanitised
// before being placed in the prompt).
// ---------------------------------------------------------------------------

export interface Visitor {
  name?: string;
  role?: string;
  company?: string;
}

export const VISITOR_STORAGE_KEY = 'siya.visitor.v1';
export const SEEN_STORAGE_KEY = 'siya.seen.v1';
export const SIZE_STORAGE_KEY = 'siya.size.v1';

// ----- sanitising ----------------------------------------------------------

const NAME_DISALLOWED = /[^\p{L}\p{M}\s.'’-]/gu;
const FREE_TEXT_DISALLOWED = /[^\p{L}\p{N}\p{M}\s.,&'’()/+#-]/gu;

function clean(value: unknown, disallowed: RegExp, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const out = value.replace(disallowed, '').replace(/\s+/g, ' ').trim().slice(0, max).trim();
  return out || undefined;
}

/**
 * Coerce untrusted input (localStorage contents, request bodies) into a safe
 * Visitor: short plain strings with a restricted character set, so nothing a
 * visitor stores can smuggle instructions into the system prompt.
 */
export function sanitizeVisitor(input: unknown): Visitor | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  const name = clean(raw.name, NAME_DISALLOWED, 40);
  const role = clean(raw.role, FREE_TEXT_DISALLOWED, 60);
  const company = clean(raw.company, FREE_TEXT_DISALLOWED, 60);

  const visitor: Visitor = {};
  if (name && /\p{L}{2}/u.test(name)) visitor.name = name;
  if (role) visitor.role = role;
  if (company) visitor.company = company;
  return Object.keys(visitor).length ? visitor : null;
}

export function mergeVisitor(prev: Visitor | null, found: Visitor): Visitor | null {
  return sanitizeVisitor({ ...(prev ?? {}), ...found });
}

export function firstName(visitor: Visitor | null): string | undefined {
  return visitor?.name?.split(' ')[0];
}

// ----- extraction ----------------------------------------------------------

const NAME_STOPWORDS = new Set(
  (
    'a an the and or but so of to in on at for with from by as is are was were be been am i me my we our us you your ' +
    'hi hii hello hey hola namaste yo good morning afternoon evening night thanks thank please ok okay yes no sure yeah yep nope ' +
    'here there just also really very currently actually still only already now new not sorry happy glad fine great well back ready ' +
    'looking hiring interested trying wondering curious working recruiting searching hunting reaching checking visiting asking writing ' +
    'using going doing having being wanting needing planning coming available ' +
    'recruiter manager engineer developer student hr founder director lead leader head ceo cto vp intern freelancer consultant ' +
    'talent technical senior junior software hiring team ' +
    'who which that this these those what when where why how if then than'
  ).split(' ')
);

const COMPANY_STOPWORDS = new Set(
  (
    'and or but so to who which that this these those i we my our you your is are was were be been am it its ' +
    'looking hiring interested trying wondering curious working recruiting searching hunting reaching checking visiting asking ' +
    'for a an the in on of by as if then than because since while where when how what why ' +
    'currently actually just also really very still only already now'
  ).split(' ')
);

const NOT_A_COMPANY = new Set(
  (
    'bangalore bengaluru mumbai delhi hyderabad pune chennai kolkata noida gurgaon gurugram ahmedabad jaipur lucknow ' +
    'india usa us uk europe asia america canada australia singapore germany remote home'
  ).split(' ')
);

function toTitleCase(value: string): string {
  return value
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ');
}

const WORD = /^[\p{L}][\p{L}\p{M}'’.-]*$/u;

/** Take up to 3 leading words that look like a person's name. */
function takeName(raw: string): string | undefined {
  const out: string[] = [];
  for (const token of raw.trim().split(/\s+/)) {
    if (!token) continue;
    const endsClause = /[.,!?;:]$/.test(token);
    const word = token.replace(/[.,!?;:]+$/g, '');
    if (!WORD.test(word) || NAME_STOPWORDS.has(word.toLowerCase())) break;
    out.push(word);
    if (out.length === 3 || endsClause) break;
  }
  const name = out.join(' ').trim();
  if (name.length < 2 || name.length > 40) return undefined;
  return toTitleCase(name);
}

/** Take up to 4 leading words that look like a company name. */
function takeCompany(raw: string): string | undefined {
  const out: string[] = [];
  for (const token of raw.trim().split(/\s+/)) {
    if (!token) continue;
    const endsClause = /[.,!?;:]$/.test(token);
    const word = token.replace(/[.,!?;:]+$/g, '');
    if (!/^[\p{L}\p{N}][\p{L}\p{N}\p{M}&'’.-]*$/u.test(word)) break;
    if (COMPANY_STOPWORDS.has(word.toLowerCase())) break;
    out.push(word);
    if (out.length === 4 || endsClause) break;
  }
  const company = out.join(' ').trim();
  if (company.length < 2 || NOT_A_COMPANY.has(company.toLowerCase())) return undefined;
  return company === company.toLowerCase() ? company[0].toUpperCase() + company.slice(1) : company;
}

const ROLE_RULES: Array<{ label: string; src: string }> = [
  { label: 'Hiring Manager', src: 'hiring\\s+manager' },
  { label: 'Recruiter', src: '(?:technical\\s+|senior\\s+)?recruiter|talent\\s+(?:acquisition|partner)|sourcer' },
  { label: 'Engineering Manager', src: 'engineering\\s+manager' },
  { label: 'Team Lead', src: 'team\\s+lead(?:er)?|tech(?:nical)?\\s+lead' },
  { label: 'HR', src: 'hr|human\\s+resources' },
  { label: 'Founder', src: 'co-?founder|founder' },
  { label: 'CEO', src: 'ceo' },
  { label: 'CTO', src: 'cto' },
  { label: 'Director', src: 'director' },
  { label: 'Manager', src: 'manager' },
  { label: 'Student', src: 'student' },
  { label: 'Engineer', src: '(?:software\\s+)?(?:engineer|developer)' },
];

const FIRST_PERSON = "(?:i\\s+am|i['’]m|im|i\\s+work\\s+as|i\\s+am\\s+working\\s+as|working\\s+as|my\\s+(?:role|title|designation)\\s+is)";

// "I'm Priya, a technical recruiter…" — a short name clause, then the role.
const INTRO_LEAD = "(?:i\\s+am|i['’]m|im|this\\s+is|it['’]s)";
const NAME_CLAUSE = "[\\p{L}'’.-]+(?:\\s+[\\p{L}'’.-]+)?\\s*,\\s*";

function extractRole(text: string, awaiting: boolean): string | undefined {
  for (const { label, src } of ROLE_RULES) {
    const anchored = new RegExp(`\\b${FIRST_PERSON}\\s+(?:an?\\s+|the\\s+)?(?:[\\w-]+\\s+){0,2}(?:${src})\\b`, 'i');
    if (anchored.test(text)) return label;
    const afterName = new RegExp(
      `\\b${INTRO_LEAD}\\s+${NAME_CLAUSE}(?:(?:an?|the)\\s+)?(?:[\\w-]+\\s+){0,2}(?:${src})\\b`,
      'iu'
    );
    if (afterName.test(text)) return label;
    // A short reply to "who are you?" may just be "Priya, recruiter at Acme".
    if (awaiting && text.split(/\s+/).length <= 12 && new RegExp(`\\b(?:${src})\\b`, 'i').test(text)) return label;
  }
  return undefined;
}

function extractCompany(text: string): string | undefined {
  const roleSrc = ROLE_RULES.map((r) => r.src).join('|');
  const patterns: RegExp[] = [
    /\b(?:work(?:s|ing)?|employed|recruit(?:ing|er)?|hiring)\s+(?:as\s+[^.,;]{0,40}?\s+)?(?:at|for|with)\s+([^.,;!?]+)/i,
    new RegExp(`\\b(?:${roleSrc})\\s+(?:at|from|with|for)\\s+([^.,;!?]+)`, 'i'),
    /\b(?:i['’]m|i\s+am|im|this\s+is)\s+[^,.;!?]{1,40}?\s+(?:from|with|at)\s+([^.,;!?]+)/i,
  ];
  for (const re of patterns) {
    const m = re.exec(text);
    const company = m ? takeCompany(m[1]) : undefined;
    if (company) return company;
  }
  return undefined;
}

/**
 * Pull a name / role / company out of a visitor's message.
 *
 * Deliberately conservative: a missed detail just means Siya asks again, while
 * a wrong one would be remembered. Outside of "awaiting" mode (right after
 * Siya asked who they are) only explicit introductions are accepted.
 */
export function extractVisitorInfo(text: string, opts: { awaitingIdentity?: boolean } = {}): Visitor {
  const awaiting = !!opts.awaitingIdentity;
  const input = text.trim();
  if (!input || input.length > 300) return {};

  const found: Visitor = {};

  // 1) Explicit, unambiguous name statements.
  const strong =
    /\b(?:my\s+name\s+is|my\s+name['’]s|name\s+is|name['’]s|call\s+me|you\s+can\s+call\s+me|i\s+go\s+by)\s+(.+)/i.exec(input);
  if (strong) {
    const name = takeName(strong[1]);
    if (name) found.name = name;
  }

  // 2) "I'm Priya", "this is Priya" — weaker, so require capitalisation unless
  //    we just asked who they are.
  if (!found.name) {
    const weak = /\b(?:i\s+am|i['’]m|im|this\s+is|it['’]s|it\s+is)\s+(.+)/i.exec(input);
    if (weak && (awaiting || /^[\p{Lu}]/u.test(weak[1].trim()))) {
      const name = takeName(weak[1]);
      if (name) found.name = name;
    }
  }

  // 3) A bare reply right after "may I know your name?" — e.g. "Priya" or
  //    "Priya, recruiter at Acme".
  if (!found.name && awaiting) {
    const stripped = input.replace(/^(?:hi+|hello|hey|namaste|hola)[\s,!.-]*/i, '');
    if (stripped.split(/\s+/).length <= 8 && !stripped.includes('?')) {
      const name = takeName(stripped);
      if (name) found.name = name;
    }
  }

  const role = extractRole(input, awaiting);
  if (role) found.role = role;

  const company = extractCompany(input);
  if (company) found.company = company;

  return found;
}

// ----- intents -------------------------------------------------------------

/** "Do you know who I am?", "who am I", "remember me", "what's my name"… */
export function isIdentityQuestion(text: string): boolean {
  return (
    /\bknow\s+who\s+(?:i\s+am|am\s+i)\b/i.test(text) ||
    /\bwho\s+am\s+i\b/i.test(text) ||
    /\b(?:do\s+you\s+)?(?:know|remember|recognise|recognize)\s+me\b/i.test(text) ||
    /\bwhat(?:['’]s|\s+is)\s+my\s+name\b/i.test(text)
  );
}

export function isForgetRequest(text: string): boolean {
  return /\b(?:forget\s+me|forget\s+my\s+(?:name|details|info)|clear\s+my\s+(?:details|info|data|name)|delete\s+my\s+(?:details|info|data)|erase\s+my)\b/i.test(
    text
  );
}

// ----- copy ---------------------------------------------------------------

export function describeVisitor(visitor: Visitor | null): string {
  if (!visitor) return '';
  const { name, role, company } = visitor;
  const who = [name, role && company ? `${role} at ${company}` : role ?? (company ? `from ${company}` : undefined)]
    .filter(Boolean)
    .join(', ');
  return who;
}

export const DEFAULT_GREETING =
  "Hi! I'm Siya, Shashi's personal AI assistant. Ask me anything about his skills, background, projects, or job referrals.";

export function buildGreeting(visitor: Visitor | null, firstVisit: boolean): { text: string; asksIdentity: boolean } {
  const name = firstName(visitor);
  if (name) {
    return {
      text: `Welcome back, ${name}! Good to see you again. I'm Siya, Shashi's AI assistant. Ask me about his experience, skills, projects, or how to get in touch with him.`,
      asksIdentity: false,
    };
  }
  if (firstVisit) {
    return {
      text:
        "Hello and welcome! I'm Siya, Shashi's personal AI assistant. We haven't met yet, so may I know your name and what brings you here (hiring, collaboration, a referral, or just exploring)? Or go ahead and ask me anything about Shashi.",
      asksIdentity: true,
    };
  }
  return { text: DEFAULT_GREETING, asksIdentity: false };
}

export function buildIdentityReply(visitor: Visitor | null): { text: string; asksIdentity: boolean } {
  if (visitor?.name) {
    const who = describeVisitor(visitor);
    return {
      text: `Yes, you're ${who}. I only keep this in your own browser (never on a server) so I can recognise you when you come back. Just say "forget me" and I'll clear it.`,
      asksIdentity: false,
    };
  }
  if (visitor?.role || visitor?.company) {
    return {
      text: `I know you're ${describeVisitor(visitor)}, but I don't have your name yet. What should I call you?`,
      asksIdentity: true,
    };
  }
  return {
    text:
      "We haven't been introduced yet. Who am I chatting with? Tell me your name (and your role or company if you like) and I'll remember you on this device for next time.",
    asksIdentity: true,
  };
}

export const FORGOT_REPLY =
  "Done. I've forgotten your details on this device. It was nice meeting you, and feel free to introduce yourself again any time.";
