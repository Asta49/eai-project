import { NextRequest, NextResponse } from 'next/server';
import { explainExperimentResult } from '@/lib/ai/verdict-explainer';
import { ExperimentResult } from '@/lib/engine/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { result, interventionName, locale, userId } = body as {
      result: ExperimentResult;
      interventionName: string;
      locale: 'en' | 'hi' | 'te' | 'ta';
      userId?: string;
    };
    const response = await explainExperimentResult(result, interventionName, locale, userId);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Verdict explain API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
