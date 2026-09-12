"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react'; // Added 'Send' icon
import { askPortfolioAI } from '@/lib/portfolioBrain';
import { usePathname } from 'next/navigation';

interface Message {
  role: 'user' | 'model';
  content: string;
  isOfflineFallback?: boolean;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hi! I'm Rithish's Virtual Twin. Ask me about his tech stack, projects, or freelance availability!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // New ref for the input bar
  
  const pathname = usePathname();

  // === HOISTED FUNCTIONS ===
  function flushSyncQueue() {
    syncMessagesToDB([]);
  }

  async function syncMessagesToDB(newMessages: Message[]) {
    if (typeof window === 'undefined') return;
    const sessionId = localStorage.getItem('chat_session_id');
    const unsynced = JSON.parse(localStorage.getItem('unsynced_chat') || '[]');
    const toSync = [...unsynced, ...newMessages];

    if (toSync.length === 0) return;

    if (!navigator.onLine) {
      localStorage.setItem('unsynced_chat', JSON.stringify(toSync));
      return;
    }

    try {
      const res = await fetch('/api/chat/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, messages: toSync })
      });
      if (res.ok) localStorage.removeItem('unsynced_chat');
      else localStorage.setItem('unsynced_chat', JSON.stringify(toSync));
    } catch (e) {
      localStorage.setItem('unsynced_chat', JSON.stringify(toSync));
    }
  }
  // =========================

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('chat_session_id')) {
      localStorage.setItem('chat_session_id', crypto.randomUUID());
    }
    if (navigator.onLine) flushSyncQueue();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-focus the input bar when the chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150); // 150ms delay waits for the popup animation to finish
    }
  }, [isOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setIsLoading(true);

    let finalResponse = "";
    let usedOfflineFallback = false;

    if (navigator.onLine) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query, history: messages }), 
        });
        
        if (!res.ok) throw new Error("API failed");
        
        const data = await res.json();
        finalResponse = data.reply;
      } catch (err) {
        finalResponse = askPortfolioAI(query);
        usedOfflineFallback = true;
      }
    } else {
      finalResponse = askPortfolioAI(query);
      usedOfflineFallback = true;
    }

    setMessages(prev => [...prev, { 
      role: 'model', 
      content: finalResponse,
      isOfflineFallback: usedOfflineFallback 
    }]);
    
    setIsLoading(false);

    // Auto-focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    syncMessagesToDB([
      { role: 'user', content: query },
      { role: 'model', content: finalResponse }
    ]);
  };

  const openChat = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-4 w-72 bg-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden relative"
          >
            <div className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-800 shrink-0 border border-white/10 overflow-hidden flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
              <div className="pr-4">
                <h4 className="text-sm font-medium text-white mb-1">Chat with my Virtual Twin</h4>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  AI Hybrid Engine
                </div>
              </div>
            </div>
            {/* FIXED: Increased padding (p-2) to make the hitbox larger and guarantee one-click close */}
            <button 
              type="button"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                setShowTooltip(false); 
              }}
              className="absolute top-2 right-2 p-2 text-neutral-500 hover:text-white transition-colors cursor-pointer z-50"
              aria-label="Close tooltip"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 h-[450px] bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                    <span className="text-sm">✨</span>
                 </div>
                 <div>
                   <span className="text-sm font-medium text-white block">Virtual Twin</span>
                   <span className="text-[10px] flex items-center gap-1 text-green-400">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> AI Assistant
                   </span>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-white text-black rounded-br-sm' 
                      : 'bg-zinc-800 text-zinc-300 rounded-bl-sm border border-zinc-700'
                  }`}>
                    {formatText(msg.content)}
                  </div>
                  
                  {/* Explicit Online/Offline Tagging */}
                  {msg.role === 'model' && msg.isOfflineFallback !== undefined && (
                    <span className="text-[10px] text-zinc-500 mt-1.5 flex items-center gap-1 ml-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${msg.isOfflineFallback ? 'bg-yellow-500' : 'bg-green-500'}`} /> 
                      Answered by {msg.isOfflineFallback ? 'offline model' : 'online model'}
                    </span>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 text-neutral-400 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form with Send Button */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-black/50">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my skills..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isOpen ? () => setIsOpen(false) : openChat}
        className="relative h-14 w-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:shadow-white/20 transition-shadow"
      >
        <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-black rounded-full" />
        <MessageSquare size={24} className="fill-black text-black" />
      </motion.button>
    </div>
  );
}