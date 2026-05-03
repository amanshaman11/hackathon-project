import { NextResponse } from 'next/server';
import { MAX_DESCRIPTION_LENGTH } from '@/lib/limits';
import { rateLimitResponse } from '@/lib/rateLimit';
import { buildMatches, extractPatientProfile } from '@/lib/matchEngine';
import { MOCK_TRIALS } from '@/lib/mockTrials';
import {
  analyzeMatchesWithGemini,
  extractPatientProfileWithGemini,
  isGeminiConfigured,
} from '@/lib/ai';
import { fetchStudiesFromCtGov } from '@/lib/clinicalTrialsGovClient';
import { buildMatchListSearchParams } from '@/lib/clinicalTrialsGovSearch';
import { mapCtgovStudiesToTrials } from '@/lib/mapCtgovStudyToTrial';
import type { PatientProfile, Trial } from '@/lib/types';

export const dynamic = 'force-dynamic';

type MatchRequestBody = {
  description?: string;
  country?: string;
};

async function loadCandidateTrialsFromClinicalTrialsGov(
  profile: PatientProfile,
  country?: string,
): Promise<{ trials: Trial[]; source: 'clinicaltrials.gov' | 'mock_fallback' }> {
  const primaryParams = buildMatchListSearchParams(profile, country);

  try {
    const first = await fetchStudiesFromCtGov(primaryParams);
    let trials = mapCtgovStudiesToTrials(first.studies);

    if (trials.length === 0 && primaryParams.has('query.cond')) {
      const fallback = new URLSearchParams(primaryParams);
      fallback.delete('query.cond');
      fallback.set('pageSize', '40');
      const second = await fetchStudiesFromCtGov(fallback);
      trials = mapCtgovStudiesToTrials(second.studies);
    }

    if (trials.length === 0) {
      return { trials: MOCK_TRIALS, source: 'mock_fallback' };
    }

    return { trials, source: 'clinicaltrials.gov' };
  } catch (error) {
    console.warn('ClinicalTrials.gov fetch failed; using mock trials.', error);
    return { trials: MOCK_TRIALS, source: 'mock_fallback' };
  }
}

export async function POST(request: Request) {
  const limited = rateLimitResponse(request, 'match');
  if (limited) return limited;

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

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return NextResponse.json(
      { error: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters.` },
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

    const { trials: candidateTrials, source: trialSource } =
      await loadCandidateTrialsFromClinicalTrialsGov(patient, body.country?.trim() || undefined);

    const baseMatches = buildMatches(patient, candidateTrials);
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
          trialSource,
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
