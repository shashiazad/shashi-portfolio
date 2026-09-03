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
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type ChatMode = 'text' | 'voice';

const SUGGESTION_CHIPS = [
  'Tell me about Shashi.',
  "What are Shashi's key skills?",
  "What is Shashi's current role?",
  'How do I request a referral?',
];

const CHAT_FALLBACK_MESSAGES = [
  "I can't respond right now. Please try again shortly.",
  "I'm temporarily unavailable. Please explore the site and retry in a moment.",
  "I'm unable to answer right now. Please check About, Projects, or Referrals for now.",
  "I'm having trouble responding at the moment. Please try again soon.",
];

const GREETING =
  "Hi! I'm Siya, Shashi's personal AI assistant. Ask me anything about his skills, background, projects, or job referrals.";

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

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const renderMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;
    const parts: Array<string | JSX.Element> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkRegex.exec(content)) !== null) {
      const [fullMatch, label, href] = match;
      if (match.index > lastIndex) parts.push(content.slice(lastIndex, match.index));
      parts.push(
        <a
          key={`link-${match.index}-${href}`}
          href={href}
          className="underline decoration-[#2997ff] underline-offset-2 hover:text-[#2997ff] font-medium"
        >
          {label}
        </a>
      );
      lastIndex = match.index + fullMatch.length;
    }
    if (lastIndex < content.length) parts.push(content.slice(lastIndex));
    return parts.length ? parts : content;
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
      if (!text || loading) return;

      const speak = modeRef.current === 'voice';
      const userMsg: Message = { role: 'user', content: text };
      const newMessages = [...messagesRef.current, userMsg];
      setMessages(newMessages);
      setInput('');
      setLoading(true);

      const pushAssistant = (content: string) => {
        setMessages((prev) => [...prev, { role: 'assistant', content }]);
        if (speak) void speakText(content);
      };

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
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
        setLoading(false);
      }
    },
    [loading, speakText]
  );

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

  const switchMode = (next: ChatMode) => {
    setMode(next);
    setMicError(null);
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
      <div className="fixed bottom-6 right-6 z-[9999]">
        <motion.button
          onClick={() => setOpen(!open)}
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
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-[400px] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/[0.12] bg-[#1d1d1f]/95 backdrop-blur-2xl"
            style={{ height: '560px', maxHeight: 'calc(100vh - 7rem)' }}
          >
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
                    {isListening
                      ? 'Listening…'
                      : isSpeaking
                      ? 'Speaking…'
                      : mode === 'voice'
                      ? 'Voice mode · speaks replies aloud'
                      : "Shashi's AI Assistant"}
                  </p>
                </div>

                <div className="ml-auto flex items-center gap-1.5">
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
                      {renderMessageContent(msg.content)}
                    </div>
                    {msg.role === 'assistant' && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-[52px] top-2 flex items-center gap-1">
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
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[14px] text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#2997ff]/30 focus:border-[#2997ff]/50 transition-all"
                  disabled={loading}
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
