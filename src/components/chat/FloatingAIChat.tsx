'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Trash2, RotateCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  'Which preservatives do you supply?',
  'Help me find an acidulant for beverage formulations',
  'How do I request a commercial quotation?',
  'What quality documentation comes with shipments?'
];

export function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am PureBlend’s Technical AI Advisor. I can assist you with product specifications, functional food applications (acidulants, preservatives, hydrocolloids), compliance monographs, and RFQ procedures. How can I assist you today?',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    setHasError(false);
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('API server returned an error response');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content: data.reply || 'Thank you for your inquiry. Please reach out to our commercial desk for details.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setHasError(true);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        content:
          'We encountered a communication delay connecting to the advisory service. You may click "Retry" below or reach our commercial desk directly at inquiries@pureblendchemicals.com.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear conversation history?')) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            'Hello! I am PureBlend’s Technical AI Advisor. How can I assist your formulation or procurement team today?',
          timestamp: 'Just now'
        }
      ]);
      setHasError(false);
    }
  };

  const handleRetryLast = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSend(lastUserMessage.content);
    }
  };

  return (
    <aside aria-label="PureBlend AI Technical Advisor" className="fixed bottom-5 right-5 z-40">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group flex items-center gap-2.5 bg-forest text-white py-3 px-4 rounded-full shadow-lg hover:bg-forest-light active:bg-forest-dark border border-[#235848] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
          aria-label="Open PureBlend AI Assistant chat"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold tracking-wide pr-1">Ask AI Advisor</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
        </button>
      )}

      {/* Expanded Chat Widget */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="PureBlend AI Assistant"
          className={`bg-white rounded-xl shadow-2xl border border-border-subtle flex flex-col transition-all duration-200 overflow-hidden ${
            isMinimized
              ? 'w-72 sm:w-80 h-14'
              : 'w-[calc(100vw-2.5rem)] sm:w-[420px] h-[550px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#122c23] text-white p-3.5 flex items-center justify-between border-b border-[#1b3d32] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-primary-green flex items-center justify-center text-white shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold tracking-tight truncate">PureBlend AI Advisor</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[10px] text-[#9ebcb0] truncate">Technical & Formulation Support</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#9ebcb0]">
              {!isMinimized && messages.length > 2 && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors"
                  title="Clear conversation"
                  aria-label="Clear conversation history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors"
                title={isMinimized ? 'Expand window' : 'Minimize window'}
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors"
                title="Close chat"
                aria-label="Close chat window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (hidden if minimized) */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-warm-white text-xs">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded bg-soft-green text-forest flex items-center justify-center shrink-0 mt-0.5 border border-border-subtle">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-lg p-3 leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-forest text-white shadow-xs rounded-tr-none'
                            : 'bg-white text-charcoal border border-border-subtle shadow-xs rounded-tl-none'
                        }`}
                      >
                        <p className="text-xs">{msg.content}</p>
                        <span
                          className={`block text-[9px] mt-1 text-right ${
                            isUser ? 'text-emerald-200/70' : 'text-secondary-text/60'
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>
                      {isUser && (
                        <div className="w-6 h-6 rounded bg-slate-200 text-charcoal flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex gap-2.5 items-center text-secondary-text">
                    <div className="w-6 h-6 rounded bg-soft-green text-forest flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white border border-border-subtle px-3 py-2 rounded-lg text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-green animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-green animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-green animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-secondary-text ml-1">Analyzing monograph...</span>
                    </div>
                  </div>
                )}

                {hasError && (
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={handleRetryLast}
                      className="inline-flex items-center gap-1 text-[11px] text-primary-green hover:underline font-semibold"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Retry last question</span>
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Starter Question Prompts */}
              {messages.length <= 2 && !isLoading && (
                <div className="px-3 py-2 bg-white border-t border-border-subtle space-y-1.5">
                  <p className="text-[10px] font-semibold text-secondary-text uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-primary-green" />
                    <span>Frequently Asked Technical Topics:</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className="text-[11px] text-left bg-warm-white hover:bg-soft-green hover:text-forest text-charcoal border border-border-subtle rounded px-2 py-1 transition-colors leading-tight"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-border-subtle">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about acidulants, preservatives, MOQs..."
                    disabled={isLoading}
                    className="flex-1 bg-warm-white border border-border-subtle rounded-md px-3 py-2 text-xs text-charcoal placeholder:text-secondary-text/60 focus:outline-none focus:ring-1 focus:ring-primary-green focus:border-primary-green"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!input.trim() || isLoading}
                    className="h-8.5 px-3"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-secondary-text">
                  <span>Grounded in PureBlend Technical Dossier</span>
                  <a href="/rfq" className="text-primary-green hover:underline">
                    Submit Formal RFQ →
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
