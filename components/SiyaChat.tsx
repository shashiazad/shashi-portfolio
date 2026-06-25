'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
      content: "Hi! I'm Siya, Shashi's AI assistant. Ask me anything about his skills, experience, or projects. I can also help with job referrals at Dell, Intel, NVIDIA, and Qualcomm!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastFallbackIndexRef = useRef(-1);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

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
          className="underline decoration-[#0071e3]/70 underline-offset-2 hover:text-[#0071e3]"
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
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

  return (
    <>
      {/* Siri Orb Toggle Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 siri-orb shadow-apple-lg"
        style={{ animation: open ? 'none' : 'siriPulse 2s ease-in-out infinite' }}
        whileTap={{ scale: 0.92 }}
        aria-label="Chat with Siya"
      >
        {open ? (
          <X size={20} className="text-[#f5f5f7] relative z-10" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="relative z-10">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l7 4.5-7 4.5z"
              fill="#f5f5f7"
              opacity="0.9"
            />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[380px] rounded-2xl overflow-hidden shadow-apple-lg flex flex-col"
            style={{
              height: '500px',
              maxHeight: 'calc(100vh - 8rem)',
              backgroundColor: 'rgba(29, 29, 31, 0.85)',
              backdropFilter: 'saturate(180%) blur(40px)',
              WebkitBackdropFilter: 'saturate(180%) blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] shrink-0">
              <div className="siri-orb-mini">
                <span className="relative z-10 text-[10px] font-bold text-[#f5f5f7]">S</span>
              </div>
              <div>
                <p className="font-semibold text-[14px] text-[#f5f5f7] leading-tight">Siya</p>
                <p className="text-[11px] text-[#86868b]">AI Assistant</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-[11px] text-[#86868b]">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#86868b]">S</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#0071e3] text-white rounded-br-md'
                        : 'bg-white/[0.08] text-[#f5f5f7] rounded-bl-md'
                    }`}
                  >
                    {renderMessageContent(msg.content)}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} className="text-[#86868b]" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#86868b]">S</span>
                  </div>
                  <div className="bg-white/[0.08] px-4 py-3 rounded-2xl rounded-bl-md">
                    <Loader2 size={16} className="animate-spin text-[#0071e3]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="shrink-0 px-4 py-3 border-t border-white/[0.08]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Siya about Shashi..."
                  className="flex-1 px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[14px] text-[#f5f5f7] placeholder:text-[#424245] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/30 focus:border-[#0071e3]/40 transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-[#0071e3] hover:bg-[#0077ED] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shrink-0"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
