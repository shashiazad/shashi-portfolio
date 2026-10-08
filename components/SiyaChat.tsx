'use client';

import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  User,
  Loader2,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  Volume2,
  Square,
  Mic,
  MicOff,
  Keyboard,
  AudioLines,
  Maximize2,
  Minimize2,
  Download,
} from 'lucide-react';
import {
  DEFAULT_GREETING,
  FORGOT_REPLY,
  SEEN_STORAGE_KEY,
  SIZE_STORAGE_KEY,
  VISITOR_STORAGE_KEY,
  buildGreeting,
  buildIdentityReply,
  extractVisitorInfo,
  firstName,
  isForgetRequest,
  isIdentityQuestion,
  mergeVisitor,
  sanitizeVisitor,
  type Visitor,
} from '@/lib/visitor';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type ChatMode = 'text' | 'voice';

const SUGGESTION_CHIPS = [
  'Tell me about Shashi.',
  "What are Shashi's key skills?",
  'Is Shashi available to join?',
  'How do I request a referral?',
];

const CHAT_FALLBACK_MESSAGES = [
  "I can't respond right now. Please try again shortly.",
  "I'm temporarily unavailable. Please explore the site and retry in a moment.",
  "I'm unable to answer right now. Please check About, Projects, or Referrals for now.",
  "I'm having trouble responding at the moment. Please try again soon.",
];

const GREETING = DEFAULT_GREETING;

// Chat window geometry (the window is anchored bottom-right and grows up/left).
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 560;
const MIN_WIDTH = 340;
const MIN_HEIGHT = 420;
const MAX_WIDTH = 960;
const BOTTOM_OFFSET = 96; // matches `bottom-24`
const TOP_MARGIN = 16;
const KEY_STEP = 24;

interface WindowSize {
  w: number;
  h: number;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function getLimits(viewportW: number, viewportH: number) {
  const rightGap = viewportW >= 640 ? 24 : 16;
  const maxW = Math.min(viewportW - rightGap - 16, MAX_WIDTH);
  const maxH = viewportH - BOTTOM_OFFSET - TOP_MARGIN;
  return {
    minW: Math.min(MIN_WIDTH, maxW),
    maxW,
    minH: Math.min(MIN_HEIGHT, maxH),
    maxH,
  };
}

// ---------------------------------------------------------------------------
// Lightweight, safe markdown rendering for chat bubbles.
// Builds React nodes directly (no dangerouslySetInnerHTML) and supports the
// small subset the assistant actually emits: bold, italic, inline code,
// links, and bullet / numbered lists.
// ---------------------------------------------------------------------------
const INLINE_TOKEN_RE =
  /(\*\*[^*\n]+\*\*|__[^_\n]+__|`[^`\n]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*\n]*\*)/g;

function renderInline(text: string, keyPrefix: string): Array<string | JSX.Element> {
  const nodes: Array<string | JSX.Element> = [];
  let last = 0;
  let i = 0;
  let match: RegExpExecArray | null;
  INLINE_TOKEN_RE.lastIndex = 0;

  while ((match = INLINE_TOKEN_RE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;

    if (token.startsWith('**') || token.startsWith('__')) {
      nodes.push(
        <strong key={key} className="font-semibold text-[#f5f5f7]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`')) {
      nodes.push(
        <code key={key} className="rounded bg-white/[0.14] px-1 py-0.5 font-mono text-[12.5px]">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('[')) {
      const link = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(token);
      if (link) {
        const href = link[2];
        const external = /^https?:\/\//.test(href);
        if (!external && /\.pdf(?:$|\?)/i.test(href)) {
          // Same-origin PDF (the resume): render as a clear download button.
          nodes.push(
            <a
              key={key}
              href={href}
              download
              className="my-1 inline-flex items-center gap-1.5 rounded-full bg-[#0071e3] px-3.5 py-1.5 text-[12.5px] font-semibold text-white no-underline shadow-sm transition-colors hover:bg-[#0077ED]"
            >
              <Download size={13} />
              {link[1]}
            </a>
          );
        } else {
          nodes.push(
            <a
              key={key}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="font-medium underline decoration-[#2997ff] underline-offset-2 hover:text-[#2997ff]"
            >
              {link[1]}
            </a>
          );
        }
      } else {
        nodes.push(token);
      }
    } else {
      nodes.push(
        <em key={key} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function renderRichText(content: string): JSX.Element {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: JSX.Element[] = [];
  let listItems: string[] | null = null;
  let listOrdered = false;
  let key = 0;

  const flushList = () => {
    if (!listItems || listItems.length === 0) {
      listItems = null;
      return;
    }
    const items = listItems;
    const k = `list-${key++}`;
    blocks.push(
      listOrdered ? (
        <ol key={k} className="my-1 list-decimal space-y-1 pl-4 marker:text-[#86868b]">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `${k}-${idx}`)}</li>
          ))}
        </ol>
      ) : (
        <ul key={k} className="my-1 list-disc space-y-1 pl-4 marker:text-[#86868b]">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it, `${k}-${idx}`)}</li>
          ))}
        </ul>
      )
    );
    listItems = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    const heading = /^\s*#{1,6}\s+(.*)$/.exec(line);

    if (bullet) {
      if (listItems && listOrdered) flushList();
      listOrdered = false;
      listItems = listItems ?? [];
      listItems.push(bullet[1]);
      continue;
    }
    if (ordered) {
      if (listItems && !listOrdered) flushList();
      listOrdered = true;
      listItems = listItems ?? [];
      listItems.push(ordered[1]);
      continue;
    }

    flushList();
    if (!line.trim()) continue;

    if (heading) {
      blocks.push(
        <p key={`h-${key++}`} className="font-semibold text-[#f5f5f7]">
          {renderInline(heading[1], `h-${key}`)}
        </p>
      );
    } else {
      blocks.push(<p key={`p-${key++}`}>{renderInline(line, `p-${key}`)}</p>);
    }
  }
  flushList();

  return <div className="space-y-1.5">{blocks.length ? blocks : content}</div>;
}

export default function SiyaChat() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('text');
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [size, setSize] = useState<WindowSize | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [viewport, setViewport] = useState({ w: 1280, h: 800 });

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const visitorRef = useRef<Visitor | null>(null);
  const awaitingIdentityRef = useRef(false);
  const firstVisitRef = useRef(false);
  const greetedRef = useRef(false);
  const hasQueriedRef = useRef(false);
  const finePointerRef = useRef(true);
  const userLeftChatRef = useRef(false);
  const loadingRef = useRef(false);
  const sizeRef = useRef<WindowSize | null>(null);
  const resizeSessionRef = useRef<{ mode: 'corner' | 'left' | 'top'; x: number; y: number; w: number; h: number } | null>(null);
  const lastFallbackIndexRef = useRef(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');
  const autoSendRef = useRef(false);
  const modeRef = useRef<ChatMode>('text');
  const sendMessageRef = useRef<(text: string) => void>(() => {});

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // ----- Visitor memory + saved window size (browser only) -------------------
  const updateVisitor = useCallback((next: Visitor | null) => {
    visitorRef.current = next;
    setVisitor(next);
    try {
      if (next) window.localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(VISITOR_STORAGE_KEY);
    } catch {
      /* storage unavailable (private mode): memory just lasts for this tab */
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(VISITOR_STORAGE_KEY);
      const stored = raw ? sanitizeVisitor(JSON.parse(raw)) : null;
      visitorRef.current = stored;
      setVisitor(stored);
      firstVisitRef.current = !window.localStorage.getItem(SEEN_STORAGE_KEY);

      const savedSize = JSON.parse(window.localStorage.getItem(SIZE_STORAGE_KEY) ?? 'null');
      if (savedSize && Number.isFinite(savedSize.w) && Number.isFinite(savedSize.h)) {
        sizeRef.current = { w: savedSize.w, h: savedSize.h };
        setSize(sizeRef.current);
      }
    } catch {
      /* ignore corrupt or unavailable storage */
    }

    finePointerRef.current = window.matchMedia?.('(pointer: fine)').matches ?? true;
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // First open of the session: greet the visitor (by name if we know them).
  useEffect(() => {
    if (!open || greetedRef.current) return;
    greetedRef.current = true;
    const { text, asksIdentity } = buildGreeting(visitorRef.current, firstVisitRef.current);
    awaitingIdentityRef.current = asksIdentity;
    setMessages((prev) =>
      prev.length === 1 && prev[0].role === 'assistant' ? [{ role: 'assistant', content: text }] : prev
    );
    try {
      window.localStorage.setItem(SEEN_STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  }, [open]);

  // ----- Keep the cursor in the message box while the visitor is chatting ------
  const focusInput = useCallback((force = false) => {
    const el = inputRef.current;
    if (!el) return;
    if (!force && userLeftChatRef.current) return; // they clicked elsewhere on the page
    if (document.activeElement === el) return;
    const selection = window.getSelection();
    if (
      !force &&
      selection &&
      !selection.isCollapsed &&
      containerRef.current?.contains(selection.anchorNode)
    ) {
      return; // don't clobber text they're selecting to copy
    }
    el.focus({ preventScroll: true });
  }, []);

  // Track whether the visitor has moved on to the rest of the page.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      userLeftChatRef.current = !target?.closest?.('[data-siya-root]');
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open]);

  // ----- Text-to-speech -------------------------------------------------------
  // Primary: Edge neural voice (en-IN Neerja) via /api/tts.
  // Fallback: the browser's built-in speechSynthesis so voice mode always talks.
  const stopSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      try {
        URL.revokeObjectURL(audioRef.current.src);
      } catch {
        /* noop */
      }
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const stripMarkdown = (text: string) =>
    text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_~`#>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const speakWithBrowser = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const preferred =
      voices.find((v) => /en-IN/i.test(v.lang) && /female|neerja|heera|priya/i.test(v.name)) ||
      voices.find((v) => /en-IN/i.test(v.lang)) ||
      voices.find((v) => /en-GB/i.test(v.lang) && /female|libby|sonia/i.test(v.name)) ||
      voices.find((v) => /^en(-|_)/i.test(v.lang)) ||
      null;
    if (preferred) utter.voice = preferred;
    utter.lang = preferred?.lang || 'en-IN';
    utter.rate = 1.02;
    utter.pitch = 1.05;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    synth.speak(utter);
  }, []);

  const speakText = useCallback(
    async (text: string) => {
      stopSpeech();
      const cleaned = stripMarkdown(text);
      if (!cleaned) return;

      setIsSpeaking(true);
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleaned }),
        });

        if (!res.ok) {
          speakWithBrowser(cleaned);
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        const cleanup = () => {
          try {
            URL.revokeObjectURL(url);
          } catch {
            /* noop */
          }
          audioRef.current = null;
          setIsSpeaking(false);
        };

        audio.onended = cleanup;
        audio.onerror = () => {
          cleanup();
          speakWithBrowser(cleaned);
        };
        await audio.play();
      } catch {
        speakWithBrowser(cleaned);
      }
    },
    [stopSpeech, speakWithBrowser]
  );

  // ----- Speech-to-text (Web Speech API) --------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    setSpeechSupported(true);
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setMicError(null);
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = finalTranscriptRef.current;
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += chunk;
        else interim += chunk;
      }
      finalTranscriptRef.current = final;
      setInput((final + interim).trimStart());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setMicError('Microphone access was blocked. Enable it in your browser settings.');
      } else if (event.error === 'no-speech') {
        setMicError("Didn't catch that — try again.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      const text = finalTranscriptRef.current.trim();
      finalTranscriptRef.current = '';
      if (autoSendRef.current && text) {
        autoSendRef.current = false;
        sendMessageRef.current(text);
      }
    };

    recognitionRef.current = recognition;
    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || isListening) return;
    stopSpeech();
    finalTranscriptRef.current = '';
    autoSendRef.current = modeRef.current === 'voice';
    setInput('');
    try {
      recognition.start();
    } catch {
      /* start() throws if already running — ignore */
    }
  }, [isListening, stopSpeech]);

  const stopListening = useCallback((send: boolean) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    autoSendRef.current = send;
    recognition.stop();
  }, []);

  // ----- Lifecycle ----------------------------------------------------------
  useEffect(() => {
    if (!open) {
      stopSpeech();
      if (recognitionRef.current) recognitionRef.current.abort();
      setIsListening(false);
    }
  }, [open, stopSpeech]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };


  const getFallbackMessage = () => {
    if (CHAT_FALLBACK_MESSAGES.length === 1) return CHAT_FALLBACK_MESSAGES[0];
    let nextIndex = Math.floor(Math.random() * CHAT_FALLBACK_MESSAGES.length);
    while (nextIndex === lastFallbackIndexRef.current) {
      nextIndex = Math.floor(Math.random() * CHAT_FALLBACK_MESSAGES.length);
    }
    lastFallbackIndexRef.current = nextIndex;
    return CHAT_FALLBACK_MESSAGES[nextIndex];
  };

  // keep a ref of messages so sendMessage (used by speech onend) always has latest
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = useCallback(
    async (textToSend: string) => {
      const text = textToSend.trim();
      if (!text || loadingRef.current) return;

      hasQueriedRef.current = true;
      const speak = modeRef.current === 'voice';
      const userMsg: Message = { role: 'user', content: text };
      const history = [...messagesRef.current, userMsg];

      // Remember anything the visitor tells us about themselves.
      const awaiting = awaitingIdentityRef.current;
      awaitingIdentityRef.current = false;
      const found = extractVisitorInfo(text, { awaitingIdentity: awaiting });
      if (found.name || found.role || found.company) {
        updateVisitor(mergeVisitor(visitorRef.current, found));
      }

      // Memory questions are answered here, instantly and without the model.
      const replyLocally = (content: string, asksIdentity = false) => {
        awaitingIdentityRef.current = asksIdentity;
        setMessages([...history, { role: 'assistant', content }]);
        setInput('');
        if (speak) void speakText(content);
      };
      if (isForgetRequest(text)) {
        updateVisitor(null);
        replyLocally(FORGOT_REPLY);
        return;
      }
      if (isIdentityQuestion(text)) {
        const reply = buildIdentityReply(visitorRef.current);
        replyLocally(reply.text, reply.asksIdentity);
        return;
      }

      setMessages(history);
      setInput('');
      setLoading(true);
      loadingRef.current = true;

      const pushAssistant = (content: string) => {
        setMessages((prev) => [...prev, { role: 'assistant', content }]);
        if (speak) void speakText(content);
      };

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, visitor: visitorRef.current }),
        });
        const data = await res.json().catch(() => null);

        if (res.ok && typeof data?.message === 'string' && data.message.trim()) {
          pushAssistant(data.message);
        } else {
          pushAssistant(getFallbackMessage());
        }
      } catch {
        pushAssistant(getFallbackMessage());
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [speakText, updateVisitor]
  );

  // Keep the cursor ready for the next message: on open, after every reply,
  // and when voice input ends. Never steals focus once they've left the chat.
  useEffect(() => {
    if (!open || loading || isListening) return;
    if (!hasQueriedRef.current && !finePointerRef.current) return; // don't pop the keyboard on phones
    focusInput();
  }, [open, loading, isListening, messages, focusInput]);

  const forgetVisitor = () => {
    updateVisitor(null);
    awaitingIdentityRef.current = false;
    setMessages((prev) => [...prev, { role: 'assistant', content: FORGOT_REPLY }]);
  };

  useEffect(() => {
    sendMessageRef.current = (text: string) => {
      void sendMessage(text);
    };
  }, [sendMessage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isListening) stopListening(true);
    else void sendMessage(input);
  };

  // ----- Resizable window ----------------------------------------------------
  const isNarrow = viewport.w < 640;
  const limits = getLimits(viewport.w, viewport.h);
  const preferred: WindowSize =
    !isNarrow && size
      ? size
      : expanded
      ? { w: Math.min(limits.maxW, 760), h: limits.maxH }
      : { w: isNarrow ? viewport.w - 32 : DEFAULT_WIDTH, h: Math.min(DEFAULT_HEIGHT, limits.maxH) };
  const dims: WindowSize = {
    w: clamp(preferred.w, limits.minW, limits.maxW),
    h: clamp(preferred.h, limits.minH, limits.maxH),
  };

  const applySize = (w: number, h: number, persist: boolean) => {
    const l = getLimits(window.innerWidth, window.innerHeight);
    const next = { w: Math.round(clamp(w, l.minW, l.maxW)), h: Math.round(clamp(h, l.minH, l.maxH)) };
    sizeRef.current = next;
    setSize(next);
    setExpanded(false);
    if (persist) {
      try {
        window.localStorage.setItem(SIZE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    }
  };

  const resetSize = () => {
    sizeRef.current = null;
    setSize(null);
    setExpanded(false);
    try {
      window.localStorage.removeItem(SIZE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const toggleExpanded = () => {
    sizeRef.current = null;
    setSize(null);
    try {
      window.localStorage.removeItem(SIZE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setExpanded((v) => !v);
    focusInput(true);
  };

  const startResize = (mode: 'corner' | 'left' | 'top') => (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    resizeSessionRef.current = { mode, x: e.clientX, y: e.clientY, w: el.offsetWidth, h: el.offsetHeight };
    setResizing(true);
  };

  const onResizeMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const session = resizeSessionRef.current;
    if (!session) return;
    // The window is anchored bottom-right, so dragging left/up makes it bigger.
    const w = session.mode === 'top' ? session.w : session.w - (e.clientX - session.x);
    const h = session.mode === 'left' ? session.h : session.h - (e.clientY - session.y);
    applySize(w, h, false);
  };

  const endResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeSessionRef.current) return;
    resizeSessionRef.current = null;
    setResizing(false);
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (sizeRef.current) applySize(sizeRef.current.w, sizeRef.current.h, true);
    focusInput(true);
  };

  const onHandleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const step = e.shiftKey ? KEY_STEP * 3 : KEY_STEP;
    let { offsetWidth: w, offsetHeight: h } = el;
    if (e.key === 'ArrowLeft') w += step;
    else if (e.key === 'ArrowRight') w -= step;
    else if (e.key === 'ArrowUp') h += step;
    else if (e.key === 'ArrowDown') h -= step;
    else if (e.key === 'Enter' || e.key === ' ') {
      resetSize();
      e.preventDefault();
      return;
    } else return;
    e.preventDefault();
    applySize(w, h, true);
  };

  const switchMode = (next: ChatMode) => {
    setMode(next);
    setMicError(null);
    queueMicrotask(() => focusInput(true));
    if (next === 'text') {
      stopSpeech();
      if (isListening) stopListening(false);
    } else {
      // entering voice mode: speak the most recent assistant message so it feels alive
      const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
      if (lastAssistant && !isSpeaking) void speakText(lastAssistant.content);
    }
  };

  return (
    <>
      {/* Floating toggle */}
      <div className="fixed bottom-6 right-6 z-[9999]" data-siya-root>
        <motion.button
          onClick={() => {
            userLeftChatRef.current = false;
            setOpen(!open);
          }}
          className="siri-orb shadow-2xl relative"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Chat with Siya AI Assistant"
        >
          {open ? (
            <X size={22} className="text-[#f5f5f7] relative z-10" />
          ) : (
            <MessageSquare size={22} className="text-[#f5f5f7] relative z-10" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={containerRef}
            data-siya-root
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`fixed bottom-24 right-4 sm:right-6 z-[9999] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/[0.12] bg-[#1d1d1f]/95 backdrop-blur-2xl ${
              resizing ? 'select-none' : ''
            }`}
            style={{ width: dims.w, height: dims.h }}
          >
            {/* Resize handles (desktop): drag the left edge, top edge, or corner */}
            {!isNarrow && (
              <>
                <div
                  aria-hidden
                  onPointerDown={startResize('left')}
                  onPointerMove={onResizeMove}
                  onPointerUp={endResize}
                  onPointerCancel={endResize}
                  onDoubleClick={resetSize}
                  className="absolute bottom-0 left-0 top-7 z-20 w-1.5 cursor-ew-resize touch-none transition-colors hover:bg-[#2997ff]/40"
                />
                <div
                  aria-hidden
                  onPointerDown={startResize('top')}
                  onPointerMove={onResizeMove}
                  onPointerUp={endResize}
                  onPointerCancel={endResize}
                  onDoubleClick={resetSize}
                  className="absolute left-7 right-0 top-0 z-20 h-1.5 cursor-ns-resize touch-none transition-colors hover:bg-[#2997ff]/40"
                />
                <div
                  role="separator"
                  tabIndex={0}
                  aria-label="Resize chat window. Drag, or use the arrow keys. Press Enter to reset."
                  title="Drag to resize · double-click to reset"
                  onPointerDown={startResize('corner')}
                  onPointerMove={onResizeMove}
                  onPointerUp={endResize}
                  onPointerCancel={endResize}
                  onDoubleClick={resetSize}
                  onKeyDown={onHandleKeyDown}
                  className="group/grip absolute left-0 top-0 z-30 h-7 w-7 cursor-nwse-resize touch-none rounded-br-lg text-[#6e6e73] transition-colors hover:text-[#2997ff] focus-visible:text-[#2997ff]"
                >
                  <svg viewBox="0 0 28 28" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M9 17 17 9" />
                    <path d="M9 22 22 9" />
                  </svg>
                </div>
              </>
            )}

            {/* Header */}
            <div className="shrink-0 border-b border-white/[0.08] bg-white/[0.02] px-5 pt-4 pb-3">
              <div className="flex items-center gap-3">
                <div className="siri-orb-mini">
                  <span className="relative z-10 text-[11px] font-bold text-[#f5f5f7]">S</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-[15px] text-[#f5f5f7] leading-tight">Siya</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2997ff]/20 text-[#2997ff] font-semibold">
                      AI
                    </span>
                  </div>
                  <p className="text-[11px] text-[#86868b] truncate">
                    {isListening ? (
                      'Listening…'
                    ) : isSpeaking ? (
                      'Speaking…'
                    ) : visitor?.name ? (
                      <>
                        Chatting with {firstName(visitor)} ·{' '}
                        <button
                          type="button"
                          onClick={forgetVisitor}
                          className="underline decoration-dotted underline-offset-2 hover:text-[#f5f5f7]"
                          title="Clear what Siya remembers about you on this device"
                        >
                          Not you?
                        </button>
                      </>
                    ) : mode === 'voice' ? (
                      'Voice mode · speaks replies aloud'
                    ) : (
                      "Shashi's AI Assistant"
                    )}
                  </p>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleExpanded}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.06] text-[#a1a1a6] transition-colors hover:bg-white/[0.14] hover:text-[#f5f5f7]"
                    title={expanded ? 'Restore window size' : 'Expand window'}
                    aria-label={expanded ? 'Restore chat window size' : 'Expand chat window'}
                  >
                    {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  </button>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
              </div>

              {/* Mode segmented control */}
              <div className="mt-3 flex items-center gap-1 rounded-full bg-white/[0.05] p-1 border border-white/[0.06]">
                {([
                  { key: 'text', label: 'Text', icon: <Keyboard size={13} /> },
                  { key: 'voice', label: 'Voice', icon: <AudioLines size={13} /> },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => switchMode(opt.key)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-[12px] font-semibold transition-all ${
                      mode === opt.key
                        ? 'bg-[#0071e3] text-white shadow'
                        : 'text-[#a1a1a6] hover:text-[#f5f5f7]'
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#2997ff]/20 border border-[#2997ff]/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={13} className="text-[#2997ff]" />
                    </div>
                  )}
                  <div className="relative group max-w-[82%]">
                    <div
                      className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-[#0071e3] text-white rounded-br-sm'
                          : 'bg-white/[0.08] border border-white/[0.08] text-[#f5f5f7] rounded-bl-sm'
                      }`}
                    >
                      {msg.role === 'assistant' ? renderRichText(msg.content) : msg.content}
                    </div>
                    {msg.role === 'assistant' && (
                      <div className="mt-1 flex items-center gap-2 pl-1 opacity-60 transition-opacity group-hover:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100">
                        <button
                          onClick={() => (isSpeaking ? stopSpeech() : speakText(msg.content))}
                          className="text-[#86868b] hover:text-[#2997ff] transition-colors p-0.5"
                          title={isSpeaking ? 'Stop' : 'Listen'}
                          aria-label={isSpeaking ? 'Stop speaking' : 'Listen to response'}
                        >
                          {isSpeaking ? <Square size={13} /> : <Volume2 size={14} />}
                        </button>
                        <button
                          onClick={() => copyToClipboard(msg.content, i)}
                          className="text-[#86868b] hover:text-[#f5f5f7] transition-colors p-0.5"
                          title="Copy message"
                          aria-label="Copy message"
                        >
                          {copiedIdx === i ? (
                            <Check size={14} className="text-emerald-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-white/[0.1] flex items-center justify-center shrink-0 mt-0.5">
                      <User size={13} className="text-[#f5f5f7]" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-[#2997ff]/20 border border-[#2997ff]/30 flex items-center justify-center shrink-0">
                    <Sparkles size={13} className="text-[#2997ff]" />
                  </div>
                  <div className="bg-white/[0.08] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                    <Loader2 size={15} className="animate-spin text-[#2997ff]" />
                    <span className="text-[13px] text-[#86868b]">Thinking…</span>
                  </div>
                </div>
              )}
            </div>

            {/* Voice orb / speaking indicator */}
            <AnimatePresence>
              {(isSpeaking || isListening) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="shrink-0 px-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-end gap-[2px] h-4">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.span
                            key={i}
                            className="w-[3px] rounded-full bg-[#2997ff]"
                            animate={{ height: isListening || isSpeaking ? [4, 14, 6, 12, 4] : 4 }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
                          />
                        ))}
                      </span>
                      <span className="text-[12px] font-medium text-[#a1a1a6]">
                        {isListening ? 'Listening…' : 'Siya is speaking'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (isListening) stopListening(false);
                        if (isSpeaking) stopSpeech();
                      }}
                      className="flex items-center gap-1 rounded-full bg-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-[#f5f5f7] hover:bg-white/[0.16] transition-colors"
                    >
                      <Square size={11} />
                      Stop
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Suggestion chips */}
            {messages.length < 4 && !isListening && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    disabled={loading}
                    className="text-[11px] px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-[#a1a1a6] hover:text-[#f5f5f7] transition-all disabled:opacity-40"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {micError && (
              <p className="px-4 pb-1.5 text-[11px] text-amber-400 shrink-0">{micError}</p>
            )}

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="shrink-0 px-4 py-3 border-t border-white/[0.08] bg-white/[0.01]"
            >
              <div className="flex items-center gap-2">
                {speechSupported && (
                  <button
                    type="button"
                    onClick={() => (isListening ? stopListening(mode === 'voice') : startListening())}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isListening
                        ? 'bg-red-500/90 border-red-400 text-white animate-pulse'
                        : 'bg-white/[0.06] border-white/[0.1] text-[#a1a1a6] hover:text-[#f5f5f7] hover:bg-white/[0.12]'
                    }`}
                    title={isListening ? 'Stop recording' : mode === 'voice' ? 'Speak your question' : 'Dictate your question'}
                    aria-label={isListening ? 'Stop recording' : 'Start voice input'}
                  >
                    {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isListening
                      ? 'Listening — speak now…'
                      : mode === 'voice'
                      ? 'Tap the mic and speak, or type…'
                      : "Ask Siya about Shashi's experience…"
                  }
                  className="min-w-0 flex-1 px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[14px] text-[#f5f5f7] caret-[#2997ff] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#2997ff]/60 focus:border-[#2997ff] focus:bg-white/[0.09] transition-all"
                  autoComplete="off"
                  enterKeyHint="send"
                  aria-label="Message Siya"
                />
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !isListening)}
                  className="w-10 h-10 rounded-full bg-[#0071e3] hover:bg-[#0077ED] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shrink-0 shadow-md"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
              {mode === 'voice' && !speechSupported && (
                <p className="mt-1.5 text-[11px] text-[#86868b]">
                  Voice input isn&apos;t supported in this browser — you can still type and Siya will reply aloud.
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
