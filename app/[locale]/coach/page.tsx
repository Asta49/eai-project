'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { getVoiceProvider } from '@/lib/voice';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Sparkles,
  BookOpen,
  Wrench,
  ShieldCheck,
  User,
  Heart,
  AlertTriangle,
} from 'lucide-react';

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: { title: string; source: string; slug: string }[];
  toolsUsed?: { toolName: string }[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  'What are the best Indian snacks for PCOS?',
  'How does insulin resistance cause cravings?',
  'Explain my active Myo-Inositol trial',
  'When should I schedule my next lab test?',
];

export default function CoachPage() {
  const t = useTranslations('coach');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [stopListeningFn, setStopListeningFn] = useState<(() => void) | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: '1',
      sender: 'assistant',
      text:
        locale === 'hi'
          ? 'नमस्ते प्रिया! मैं आपकी व्यक्तिगत PCOS स्वास्थ्य कोच हूँ। आप मुझसे अपने आहार, लक्षणों, सक्रिय मायो-इनोसिटोल प्रयोग या टेस्ट रिपोर्ट के बारे में कुछ भी पूछ सकती हैं।'
          : locale === 'te'
          ? 'నమస్కారం ప్రియ! నేను మీ వ్యక్తిగత PCOS హెల్త్ కోచ్. మీ ఆహారం, లక్షణాలు, లేదా మీ ఇన్సులిన్ రిపోర్టుల గురించి ఏదైనా అడగవచ్చు.'
          : locale === 'ta'
          ? 'வணக்கம் பிரியா! நான் உங்கள் PCOS நல்வாழ்வு பயிற்சியாளர். உணவு, அறிகுறிகள் அல்லது பரிசோதனைகள் பற்றி எதையும் கேட்கலாம்.'
          : 'Hello Priya! I am your personal PCOS health coach. Feel free to ask about your diet, symptoms, active trial (Myo-Inositol), or lab reports.',
      citations: [
        {
          title: 'Understanding PCOS & Rotterdam Phenotypes',
          source: 'Monash 2023 Guidelines',
          slug: 'pcos-basics',
        },
      ],
      timestamp: 'Just now',
    },
  ]);

  const handleToggleVoiceInput = () => {
    if (isListening) {
      if (stopListeningFn) stopListeningFn();
      setIsListening(false);
      setStopListeningFn(null);
    } else {
      const voice = getVoiceProvider();
      const stop = voice.startListening(
        locale,
        (result) => {
          setInputMessage(result.transcript);
        },
        (error) => {
          console.warn('Voice recognition error:', error);
          setIsListening(false);
        }
      );
      setStopListeningFn(() => stop);
      setIsListening(true);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    setEmergencyAlert(null);
    const userMsg: ChatMessageItem = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, locale }),
      });
      const data = await response.json();

      if (data.redFlag?.hasRedFlag) {
        setEmergencyAlert(data.redFlag.emergencyMessageLocale);
      }

      if (data.data) {
        const assistantMsg: ChatMessageItem = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: data.data.answer,
          citations: data.data.citations,
          toolsUsed: data.data.toolsUsed,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Card in Forest Green */}
      <div className="rounded-4xl bg-forest p-6 text-white text-center shadow-soft relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-forest-light px-3 py-1 text-xs font-semibold text-sage-light">
          <Bot className="w-3.5 h-3.5 text-sage" />
          RAG Knowledge Engine &amp; Clinical Safety
        </span>
        <h1 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          AI PCOS Health Coach
        </h1>
        <p className="mt-1 text-xs text-sage-light max-w-md mx-auto">
          Grounded in peer-reviewed clinical guidelines and your structured personal trial records.
        </p>
      </div>

      {/* Emergency Red Flag Notice if triggered */}
      {emergencyAlert && (
        <DisclaimerBanner type="emergency" customMessage={emergencyAlert} />
      )}

      {/* Chat Messages Stream */}
      <div className="space-y-3 min-h-[300px]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl font-bold text-xs ${
                  isUser
                    ? 'bg-forest text-white'
                    : 'bg-pastel-mint text-pastel-mintText border border-emerald-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-3xl p-4 shadow-card text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-forest text-white'
                    : 'bg-white border border-slate-200/80 text-slate-800'
                }`}
              >
                <p className="font-body">{msg.text}</p>

                {/* Citations if available */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Clinical Sources:
                    </span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="text-[11px] text-forest font-semibold flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-sage" />
                        <span>{c.title} ({c.source})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-forest border-t-transparent" />
            <span>Consulting PCOS clinical guidelines...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips (s4.avif style) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 whitespace-nowrap hover:bg-slate-50 shadow-xs transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field with Mic & Send */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask anything about your PCOS, diet, or trial..."
          className="w-full rounded-full border border-slate-200 bg-white pl-5 pr-24 py-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-forest focus:outline-none"
        />

        <div className="absolute right-2 flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
              isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Speech to text"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-forest text-white hover:bg-forest-light disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
