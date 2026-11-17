import { NextRequest, NextResponse } from 'next/server';
import { extractFoodFromTextOrImage } from '@/lib/ai/food-extractor';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, locale, userId } = body;
    const response = await extractFoodFromTextOrImage(input || '', locale || 'en', userId);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Food API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
