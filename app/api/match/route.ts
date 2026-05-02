import { NextResponse } from 'next/server';
import { buildMatches, extractPatientProfile } from '@/lib/matchEngine';
import { MOCK_TRIALS } from '@/lib/mockTrials';
import {
  analyzeMatchesWithGemini,
  extractPatientProfileWithGemini,
  isGeminiConfigured,
} from '@/lib/ai';

type MatchRequestBody = {
  description?: string;
};

export async function POST(request: Request) {
  let body: MatchRequestBody;

  try {
    body = (await request.json()) as MatchRequestBody;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    );
  }

  const description = body.description?.trim();
  if (!description) {
    return NextResponse.json(
      { error: 'description is required.' },
      { status: 400 },
    );
  }

  if (description.length < 10) {
    return NextResponse.json(
      { error: 'Please provide a bit more clinical context.' },
      { status: 400 },
    );
  }

  try {
    const heuristicPatient = extractPatientProfile(description);
    const aiPatient = isGeminiConfigured()
      ? await extractPatientProfileWithGemini(description).catch((error) => {
          console.warn('Gemini patient extraction failed; using heuristic parser.', error);
          return null;
        })
      : null;
    const patient = aiPatient ?? heuristicPatient;

    const baseMatches = buildMatches(patient, MOCK_TRIALS);
    const aiMatches = isGeminiConfigured()
      ? await analyzeMatchesWithGemini(patient, baseMatches).catch((error) => {
          console.warn('Gemini trial analysis failed; using deterministic output.', error);
          return null;
        })
      : null;
    const matches = aiMatches ?? baseMatches;

    return NextResponse.json(
      {
        patient,
        matches,
        meta: {
          aiUsed: Boolean(aiPatient || aiMatches),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('POST /api/match failed', error);
    return NextResponse.json(
      { error: 'Failed to match trials.' },
      { status: 500 },
    );
  }
}
