import { z, ZodType } from 'zod';
import { generateObject, generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { detectRedFlags, RedFlagDetection } from './red-flags';
import { prisma } from '../prisma';

export interface AIRequestOptions<T> {
  endpoint: string; // e.g., 'checkin_extract', 'lab_ocr', 'coach_chat', 'verdict_explain'
  prompt: string;
  schema?: ZodType<T, any, any>;
  systemPrompt?: string;
  userLanguage?: 'en' | 'hi' | 'te' | 'ta';
  userId?: string;
  imageBufferOrBase64?: string;
  fallbackGenerator?: (prompt: string, locale: string) => T;
}

export interface AIResponse<T> {
  data: T;
  rawText?: string;
  redFlag: RedFlagDetection;
  tokensUsed: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  disclaimer: string;
  provider: string;
  model: string;
}

export const DISCLAIMERS: Record<string, string> = {
  en: 'Wellness & Decision Support: This information is not a medical diagnosis or prescription. Always consult your doctor.',
  hi: 'कल्याण एवं निर्णय समर्थन: यह जानकारी कोई चिकित्सीय निदान या नुस्खा नहीं है। हमेशा अपने डॉक्टर से परामर्श लें।',
  te: 'ఆరోగ్య & నిర్ణయ మద్దతు మాత్రమే: ఈ సమాచారం వైద్య నిర్ధారణ లేదా ప్రిస్క్రిప్షన్ కాదు. ఎల్లప్పుడూ వైద్యుడిని సంప్రదించండి.',
  ta: 'நல்வாழ்வு மற்றும் முடிவெடுக்கும் ஆதரவு மட்டுமே: இந்தத் தகவல் மருத்துவ நோயறிதல் அல்லது மருந்துச் சீட்டு அல்ல. மருத்துவரை அணுகவும்.',
};

/**
 * Returns configured AI Model instance based on AI_PROVIDER env
 */
function getModel(isVision: boolean = false) {
  const provider = (process.env.AI_PROVIDER || 'mock').toLowerCase();
  const textModel = process.env.AI_MODEL || 'gpt-4o-mini';
  const visionModel = process.env.AI_VISION_MODEL || 'gpt-4o';
  const modelName = isVision ? visionModel : textModel;

  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return { model: openai(modelName), provider: 'openai', modelName };
  }

  if (provider === 'google' && process.env.GEMINI_API_KEY) {
    const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
    return { model: google(modelName), provider: 'google', modelName };
  }

  return { model: null, provider: 'mock', modelName: 'deterministic-mock-v1' };
}

/**
 * Logs token usage to AiUsage table for course unit economics tracking
 */
async function logAiUsage(params: {
  userId?: string;
  endpoint: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}) {
  try {
    const pricePer1MInput = parseFloat(process.env.LLM_PRICE_PER_1M_INPUT_TOKENS_INR || '12.5');
    const pricePer1MOutput = parseFloat(process.env.LLM_PRICE_PER_1M_OUTPUT_TOKENS_INR || '50.0');

    const costINR =
      (params.inputTokens / 1_000_000) * pricePer1MInput +
      (params.outputTokens / 1_000_000) * pricePer1MOutput;

    await prisma.aiUsage.create({
      data: {
        userId: params.userId,
        endpoint: params.endpoint,
        provider: params.provider,
        model: params.model,
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
        totalTokens: params.inputTokens + params.outputTokens,
        estimatedCostINR: Number(costINR.toFixed(4)),
        latencyMs: params.latencyMs,
      },
    });
  } catch (_) {
    // Non-blocking in case of DB connection issues
  }
}

/**
 * Primary Unified AI Invocation Wrapper
 */
export async function executeAIRequest<T>(
  options: AIRequestOptions<T>
): Promise<AIResponse<T>> {
  const startTime = Date.now();
  const locale = options.userLanguage || 'en';
  const disclaimer = DISCLAIMERS[locale] || DISCLAIMERS.en;

  // 1. Mandatory Red-Flag Pre-Check
  const redFlag = detectRedFlags(options.prompt, locale);

  const { model, provider, modelName } = getModel(Boolean(options.imageBufferOrBase64));

  // If red-flag detected, we do NOT execute wellness LLM advice!
  if (redFlag.hasRedFlag) {
    const latency = Date.now() - startTime;
    await logAiUsage({
      userId: options.userId,
      endpoint: `${options.endpoint}_redflag`,
      provider,
      model: modelName,
      inputTokens: 30,
      outputTokens: 50,
      latencyMs: latency,
    });

    // Provide emergency response
    const emergencyData = (options.fallbackGenerator
      ? options.fallbackGenerator(options.prompt, locale)
      : ({
          emergency: true,
          redFlagNotice: redFlag.emergencyMessageLocale,
        } as unknown as T));

    return {
      data: emergencyData,
      redFlag,
      tokensUsed: { inputTokens: 30, outputTokens: 50, totalTokens: 80 },
      disclaimer,
      provider,
      model: modelName,
    };
  }

  // 2. Structured Object Generation vs Mock Generator
  if (provider === 'mock' || !model) {
    // Execute deterministic realistic fallback generator
    let mockResult: T;
    if (options.fallbackGenerator) {
      mockResult = options.fallbackGenerator(options.prompt, locale);
    } else {
      mockResult = {} as T;
    }

    const estimatedInput = Math.max(20, Math.round(options.prompt.length / 4));
    const estimatedOutput = Math.max(30, Math.round(JSON.stringify(mockResult).length / 4));
    const latency = Date.now() - startTime;

    await logAiUsage({
      userId: options.userId,
      endpoint: options.endpoint,
      provider: 'mock',
      model: 'deterministic-mock-v1',
      inputTokens: estimatedInput,
      outputTokens: estimatedOutput,
      latencyMs: latency,
    });

    return {
      data: mockResult,
      redFlag,
      tokensUsed: {
        inputTokens: estimatedInput,
        outputTokens: estimatedOutput,
        totalTokens: estimatedInput + estimatedOutput,
      },
      disclaimer,
      provider: 'mock',
      model: 'deterministic-mock-v1',
    };
  }

  // 3. Real Vercel AI SDK execution
  try {
    const systemPromptWithLang = `${options.systemPrompt || 'You are an evidence-based clinical PCOS research assistant.'}\nRespond strictly in language: ${locale}. Always remember you give NO medical diagnosis and NO prescriptions.`;

    if (options.schema) {
      const { object, usage } = await generateObject({
        model,
        schema: options.schema,
        system: systemPromptWithLang,
        prompt: options.prompt,
      });

      const latency = Date.now() - startTime;
      const inTok = usage?.promptTokens ?? Math.round(options.prompt.length / 4);
      const outTok = usage?.completionTokens ?? 150;

      await logAiUsage({
        userId: options.userId,
        endpoint: options.endpoint,
        provider,
        model: modelName,
        inputTokens: inTok,
        outputTokens: outTok,
        latencyMs: latency,
      });

      return {
        data: object,
        redFlag,
        tokensUsed: {
          inputTokens: inTok,
          outputTokens: outTok,
          totalTokens: inTok + outTok,
        },
        disclaimer,
        provider,
        model: modelName,
      };
    } else {
      const { text, usage } = await generateText({
        model,
        system: systemPromptWithLang,
        prompt: options.prompt,
      });

      const latency = Date.now() - startTime;
      const inTok = usage?.promptTokens ?? Math.round(options.prompt.length / 4);
      const outTok = usage?.completionTokens ?? Math.round(text.length / 4);

      await logAiUsage({
        userId: options.userId,
        endpoint: options.endpoint,
        provider,
        model: modelName,
        inputTokens: inTok,
        outputTokens: outTok,
        latencyMs: latency,
      });

      return {
        data: text as unknown as T,
        rawText: text,
        redFlag,
        tokensUsed: {
          inputTokens: inTok,
          outputTokens: outTok,
          totalTokens: inTok + outTok,
        },
        disclaimer,
        provider,
        model: modelName,
      };
    }
  } catch (err) {
    console.warn('Real AI SDK call failed; falling back to deterministic generator:', err);
    if (options.fallbackGenerator) {
      const mockResult = options.fallbackGenerator(options.prompt, locale);
      return {
        data: mockResult,
        redFlag,
        tokensUsed: { inputTokens: 50, outputTokens: 100, totalTokens: 150 },
        disclaimer,
        provider: 'mock-fallback',
        model: 'deterministic-mock-v1',
      };
    }
    throw err;
  }
}
