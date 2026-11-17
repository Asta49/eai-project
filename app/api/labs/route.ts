import { NextRequest, NextResponse } from 'next/server';
import { extractLabReport } from '@/lib/ai/lab-extractor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sampleId, locale, userId } = body;
    const response = await extractLabReport(sampleId || 'sample1', locale || 'en', userId);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Labs API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
