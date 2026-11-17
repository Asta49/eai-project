'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import { getVoiceProvider } from '@/lib/voice';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  Wrench,
  ShieldCheck,
  User,
} from 'lucide-react';

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: { title: string; source: string; slug: string }[];
  toolsUsed?: { toolName: string }[];
  timestamp: string;
}

export default function CoachPage() {
  const t = useTranslations('coach');
  const tCommon = useTranslations('common');
  const locale = useLocale() as 'en' | 'hi' | 'te' | 'ta';

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
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

  // Voice Speech-to-Text
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
          console.warn(error);
          setIsListening(false);
        }
      );
      setStopListeningFn(() => stop);
      setIsListening(true);
    }
  };

  // Voice Text-to-Speech
  const handleSpeakText = (text: string) => {
    const voice = getVoiceProvider();
    if (isSpeaking) {
      voice.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      voice.speak(text, locale, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    setEmergencyAlert(null);
    const userMsg: ChatMessageItem = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, locale, userId: 'priya_sharma_demo' }),
      });
      const res = await response.json();

      if (res.redFlag?.hasRedFlag) {
        setEmergencyAlert(res.redFlag.emergencyMessageLocale);
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'assistant',
            text: res.redFlag.emergencyMessageLocale,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        const botMsg: ChatMessageItem = {
          id: String(Date.now() + 1),
          sender: 'assistant',
          text: res.data.answer,
          citations: res.data.citations,
          toolsUsed: res.data.toolsUsed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      {/* Title */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              {t('title')}
            </h1>
            <Badge variant="pcos" className="text-[10px]">
              RAG CLINICAL GUIDELINES
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-300">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>Non-Diagnostic Decision Support</span>
        </div>
      </div>

      {/* Emergency Red-Flag Alert if triggered */}
      {emergencyAlert && (
        <div className="mb-6">
          <DisclaimerBanner type="emergency" customMessage={emergencyAlert} />
        </div>
      )}

      {/* Chat Container */}
      <Card className="flex flex-col border-rose-100 shadow-sm dark:border-slate-800 min-h-[520px]">
        {/* Messages Scroll Area */}
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed sm:text-sm sm:max-w-[75%] ${
                    isUser
                      ? 'bg-rose-600 text-white'
                      : 'border border-slate-200 bg-white text-slate-800 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Tools Badge */}
                  {!isUser && m.toolsUsed && m.toolsUsed.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Wrench className="h-3 w-3" /> Consulted:
                      </span>
                      {m.toolsUsed.map((tool, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-mono text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                        >
                          {tool.toolName}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Citations */}
                  {!isUser && m.citations && m.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <BookOpen className="h-3 w-3" /> Sources:
                      </span>
                      {m.citations.map((c, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {c.title} ({c.source})
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Audio Read-Aloud Button */}
                  {!isUser && (
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{m.timestamp}</span>
                      <button
                        onClick={() => handleSpeakText(m.text)}
                        className="flex items-center gap-1 hover:text-purple-600"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="h-3 w-3" /> Stop
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3" /> Listen
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 shadow-xs dark:bg-slate-800 dark:text-slate-300">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bot className="h-4 w-4 animate-spin text-purple-600" />
              <span>Consulting clinical guidelines and health profile...</span>
            </div>
          )}
        </CardContent>

        {/* Input Bar */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          {/* Quick Prompts */}
          <div className="mb-3 flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => handleSendMessage('What do my latest insulin and HOMA-IR lab tests mean?')}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              Analyze my latest labs
            </button>
            <button
              onClick={() => handleSendMessage('Suggest a PCOS friendly Indian breakfast swap for poha')}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              Indian food swap for poha
            </button>
            <button
              onClick={() => handleSendMessage('How does Myo-Inositol work in Phenotype A PCOS?')}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              How Myo-Inositol works
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('askPlaceholder')}
                className="pr-10"
              />
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`absolute right-2.5 top-2.5 p-0.5 transition-colors ${
                  isListening ? 'text-red-600 animate-pulse' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Voice input (Web Speech API)"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="pcos"
              disabled={!inputMessage.trim() || isLoading}
              className="gap-1.5"
            >
              <Send className="h-4 w-4" />
              <span>{t('send')}</span>
            </Button>
          </form>
        </div>
      </Card>

      {/* Footer Disclaimer */}
      <div className="mt-6">
        <DisclaimerBanner type="wellness" />
      </div>
    </div>
  );
}
