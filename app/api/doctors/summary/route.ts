import { NextRequest, NextResponse } from 'next/server';
import { generatePreConsultSummary } from '@/lib/ai/doctor-summary';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { patientData, doctorSpecialty, locale, userId } = body;
    const response = await generatePreConsultSummary(patientData, doctorSpecialty, locale, userId);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Doctor summary API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
