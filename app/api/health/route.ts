import { NextResponse } from 'next/server';
import { isGeminiConfigured } from '@/lib/ai';

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'trialmatch-api',
      geminiConfigured: isGeminiConfigured(),
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
