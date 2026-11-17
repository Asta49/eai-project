import { NextRequest, NextResponse } from 'next/server';
import { askCoach } from '@/lib/ai/coach';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, locale, userId } = body;
    const response = await askCoach(message || '', locale || 'en', userId || 'priya_sharma_demo');
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Coach API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
