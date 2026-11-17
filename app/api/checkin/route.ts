import { NextRequest, NextResponse } from 'next/server';
import { extractCheckInFromText } from '@/lib/ai/checkin-extractor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, locale, userId } = body;
    const response = await extractCheckInFromText(text || '', locale || 'en', userId);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Checkin API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
