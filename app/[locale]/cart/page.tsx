'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import {
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Store,
  Pause,
  Play,
  History,
} from 'lucide-react';

interface CartItem {
  id: string;
  originalName: string;
  store: 'Zepto' | 'Blinkit' | 'Instamart';
  priceINR: number;
  reasonFlagged: string;
  clinicalSource: string;
  suggestedSwap: string;
  swapPriceINR: number;
  swapBenefit: string;
  status: 'pending' | 'swapped' | 'kept';
}

export default function SmartCartPage() {
  const t = useTranslations('common');
  const locale = useLocale();

  const [cartEnabled, setCartEnabled] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [helpLevel, setHelpLevel] = useState<'suggest' | 'swap' | 'autobuild'>('swap');

  const [activeItems, setActiveItems] = useState<CartItem[]>([
    {
      id: 'c1',
      originalName: 'Maggi 2-Minute Instant Noodles (Maida)',
      store: 'Zepto',
      priceINR: 60,
      reasonFlagged: 'High Glycemic Load (Refined Maida) triggers rapid insulin spikes.',
      clinicalSource: 'Dr. Ananya Sen Rule: Avoid Gluten & High Glycemic Carbs',
      suggestedSwap: 'Slurrp Farm Foxtail Millet Instant Noodles',
      swapPriceINR: 75,
      swapBenefit: 'Made with 100% millets, 3x more dietary fiber, zero refined flour.',
      status: 'pending',
    },
    {
      id: 'c2',
      originalName: 'Haldiram Aloo Bhujia (200g)',
      store: 'Zepto',
      priceINR: 55,
      reasonFlagged: 'Contains hydrogenated palm oil and trans fats, aggravating insulin resistance.',
      clinicalSource: 'Dietician Sneha Nair: Eliminate inflammatory trans fats',
      suggestedSwap: 'Farmley Peri Peri Roasted Makhana (Foxnuts)',
      swapPriceINR: 85,
      swapBenefit: 'Zero trans fats, rich in magnesium and plant protein.',
      status: 'pending',
    },
    {
      id: 'c3',
      originalName: 'Amul Full Cream Buffalo Milk (1L)',
      store: 'Zepto',
      priceINR: 68,
      reasonFlagged: 'A1 beta-casein provokes severe bloating in 5 of 6 of your logged meals.',
      clinicalSource: 'Ritu Calibration: Low tolerance learned from your post-meal checks',
      suggestedSwap: 'Raw Pressery Unsweetened Almond Milk (1L)',
      swapPriceINR: 180,
      swapBenefit: '100% plant-based, zero lactose, zero gut distension reported.',
      status: 'pending',
    },
  ]);

  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

  const handleSwapItem = (id: string) => {
    setActiveItems(
      activeItems.map((item) => (item.id === id ? { ...item, status: 'swapped' } : item))
    );
  };

  const handleKeepItem = (id: string) => {
    setActiveItems(
      activeItems.map((item) => (item.id === id ? { ...item, status: 'kept' } : item))
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Header in Berry Rose */}
      <div className="rounded-4xl bg-gradient-to-br from-[#FF7A9A] via-[#F04D7E] to-[#E3386C] p-6 text-white shadow-lg shadow-rose-200/50 relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white">
          <ShoppingCart className="w-3 h-3 text-white" />
          Smart Cart
        </span>

        <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Smart Grocery Swaps
        </h1>
        <p className="mt-1 text-xs text-rose-100 max-w-md">
          Healthy Indian grocery swaps in Zepto &amp; Blinkit based on Dr. Sen&apos;s guidelines.
        </p>

        {/* Status controls */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white px-3 py-1 text-xs font-semibold transition"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-white" /> : <Pause className="w-3.5 h-3.5 text-white" />}
            <span>{isPaused ? 'Resume' : 'Pause Agent'}</span>
          </button>

          <span className="text-[11px] text-rose-100 font-medium">
            Linked to: <strong>Zepto (Hyderabad)</strong>
          </span>
        </div>
      </div>

      {/* Safety & DPDP Transparency Guarantee */}
      <div className="rounded-3xl bg-pastel-mint/40 border border-emerald-300 p-4 text-xs text-emerald-950">
        <div className="flex items-center gap-1.5 font-bold mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Patient Protection Protocol</span>
        </div>
        <p className="text-[11px] text-emerald-900 leading-relaxed">
          • <strong>Approval gate:</strong> Ritu never orders or pays without your explicit &quot;Yes, order&quot; click.<br />
          • <strong>Zero brand sponsored picks:</strong> Every swap is grounded in your medical guidelines, never sold to FMCG brands.<br />
          • <strong>Control:</strong> You can unlink apps or wipe your shopping history anytime.
        </p>
      </div>

      {/* Active Cart Review */}
      <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-forest" />
            <h2 className="font-heading text-base font-bold text-slate-900">
              Live Zepto Cart Items (Review &amp; Swaps)
            </h2>
          </div>
          <span className="rounded-full bg-pastel-yellow px-2.5 py-0.5 text-[10px] font-bold text-pastel-yellowText">
            Help Level: Swap with Approval
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {activeItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-3xl border transition ${
                item.status === 'swapped'
                  ? 'bg-sage-light/30 border-emerald-300'
                  : item.status === 'kept'
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : 'bg-white border-amber-200 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      {item.status === 'swapped' ? item.suggestedSwap : item.originalName}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      ₹{item.status === 'swapped' ? item.swapPriceINR : item.priceINR}
                    </span>
                  </div>

                  {item.status !== 'swapped' && (
                    <div className="mt-1 text-[11px] text-amber-900 font-medium">
                      ⚠️ <strong>Flagged:</strong> {item.reasonFlagged}
                    </div>
                  )}

                  <div className="mt-1 text-[10px] text-slate-400">
                    Rule Source: <strong>{item.clinicalSource}</strong>
                  </div>
                </div>

                {item.status === 'swapped' ? (
                  <span className="rounded-full bg-pastel-mint text-pastel-mintText text-[10px] font-bold px-2.5 py-1 shrink-0">
                    ✓ Swapped
                  </span>
                ) : item.status === 'kept' ? (
                  <span className="rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold px-2.5 py-1 shrink-0">
                    Kept Original
                  </span>
                ) : (
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      type="button"
                      variant="forest"
                      size="sm"
                      onClick={() => handleSwapItem(item.id)}
                      className="rounded-full text-[11px] py-1 px-3"
                    >
                      Swap
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleKeepItem(item.id)}
                      className="text-[11px] text-slate-400 hover:text-slate-700 px-2 font-semibold"
                    >
                      Keep
                    </button>
                  </div>
                )}
              </div>

              {/* Swap Details Drawer if pending */}
              {item.status === 'pending' && (
                <div className="mt-3 p-3 rounded-2xl bg-pastel-mint/30 border border-emerald-200 text-xs">
                  <div className="font-bold text-emerald-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-sage" />
                    <span>Suggested Healthier Pick: {item.suggestedSwap} (₹{item.swapPriceINR})</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 mt-0.5">
                    {item.swapBenefit}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Order Gate Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900">Final Order Gate</div>
            <div className="text-[11px] text-slate-500">
              Ritu never charges your card without confirmation.
            </div>
          </div>

          <Button
            type="button"
            variant="forest"
            size="sm"
            onClick={() => {
              setOrderConfirmed(true);
              setTimeout(() => setOrderConfirmed(false), 3000);
            }}
            className="rounded-full text-xs"
          >
            {orderConfirmed ? '✓ Approved & Sent to Zepto' : 'Yes, Order on Zepto'}
          </Button>
        </div>
      </Card>

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
