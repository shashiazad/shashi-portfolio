'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Loader2, Sparkles, Copy, Check, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTION_CHIPS = [
  "What are Shashi's key skills?",
  "Tell me about DISA STIG AI project",
  "How do I request a referral?",
  "What is Shashi's current role?",
];

const CHAT_FALLBACK_MESSAGES = [
  'I can\'t respond right now. Please try again shortly.',
  'I\'m temporarily unavailable. Please explore the site and retry in a moment.',
  'I\'m unable to answer right now. Please check About, Projects, or Referrals for now.',
  'I\'m having trouble responding at the moment. Please try again soon.',
];

export default function SiyaChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Siya, Shashi's personal AI assistant. Ask me anything about his technical skills, background, projects, or job referrals!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastFallbackIndexRef = useRef(-1);

  // Close on Escape
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
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
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

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

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

  async function sendMessage(textToSend: string) {
    const text = textToSend.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (res.ok) {
        const fallbackMessage = getFallbackMessage();
        const safeMessage = typeof data?.message === 'string' && data.message.trim()
          ? data.message
          : fallbackMessage;
        setMessages((prev) => [...prev, { role: 'assistant', content: safeMessage }]);
      } else {
        const fallbackMessage = getFallbackMessage();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: fallbackMessage },
        ]);
      }
    } catch {
      const fallbackMessage = getFallbackMessage();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fallbackMessage },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Siri Orb Floating Toggle Button Container */}
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

      {/* Chat Window Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[calc(100vw-2rem)] sm:w-[380px] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-white/[0.12] bg-[#1d1d1f]/95 backdrop-blur-2xl"
            style={{
              height: '500px',
              maxHeight: 'calc(100vh - 7rem)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
              <div className="siri-orb-mini">
                <span className="relative z-10 text-[11px] font-bold text-[#f5f5f7]">S</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-[15px] text-[#f5f5f7] leading-tight">Siya</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2997ff]/20 text-[#2997ff] font-semibold">AI</span>
                </div>
                <p className="text-[11px] text-[#86868b]">Shashi&apos;s Portfolio Assistant</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] text-[#86868b]">Ready</span>
              </div>
            </div>

            {/* Messages Area */}
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
                      <button
                        onClick={() => copyToClipboard(msg.content, i)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-7 top-2 text-[#86868b] hover:text-[#f5f5f7]"
                        title="Copy message"
                      >
                        {copiedIdx === i ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
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
                    <span className="text-[13px] text-[#86868b]">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length < 5 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    disabled={loading}
                    className="text-[11px] px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-[#a1a1a6] hover:text-[#f5f5f7] transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="shrink-0 px-4 py-3 border-t border-white/[0.08] bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Siya about Shashi's experience..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[14px] text-[#f5f5f7] placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#2997ff]/30 focus:border-[#2997ff]/50 transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-[#0071e3] hover:bg-[#0077ED] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shrink-0 shadow-md"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
