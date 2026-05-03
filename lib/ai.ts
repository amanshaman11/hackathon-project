import { decodeHtmlEntities } from '@/lib/decodeHtmlEntities';
import type { MatchResult, PatientProfile } from '@/lib/types';

const GEMINI_MODEL = 'gemini-2.0-flash';

function getApiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY?.trim();
  return key ? key : undefined;
}

async function runGeminiPrompt(prompt: string): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${text}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}

function safeJsonParse<T>(input: string): T | null {
  try {
    return JSON.parse(input) as T;
  } catch {
    return null;
  }
}

export function isGeminiConfigured(): boolean {
  return Boolean(getApiKey());
}

export async function extractPatientProfileWithGemini(
  description: string,
): Promise<PatientProfile | null> {
  const prompt = `
Extract a structured patient profile from this free-text description.
Return ONLY valid JSON with this exact schema:
{
  "conditions": string[],
  "age": number | null,
  "sex": "male" | "female" | "other" | null,
  "priorTreatments": string[],
  "notes": string
}

Rules:
- Keep conditions concise and clinical.
- If age is unknown, use null.
- If sex is unknown, use null.
- Include important staging/context in notes.

Patient description:
"""${description}"""
`;

  const raw = await runGeminiPrompt(prompt);
  const parsed = safeJsonParse<{
    conditions?: unknown;
    age?: unknown;
    sex?: unknown;
    priorTreatments?: unknown;
    notes?: unknown;
  }>(raw);

  if (!parsed) return null;

  const conditions = Array.isArray(parsed.conditions)
    ? parsed.conditions
        .filter((v): v is string => typeof v === 'string')
        .map(decodeHtmlEntities)
    : [];
  const priorTreatments = Array.isArray(parsed.priorTreatments)
    ? parsed.priorTreatments
        .filter((v): v is string => typeof v === 'string')
        .map(decodeHtmlEntities)
    : [];
  const age = typeof parsed.age === 'number' ? parsed.age : undefined;
  const sex =
    parsed.sex === 'male' || parsed.sex === 'female' || parsed.sex === 'other'
      ? parsed.sex
      : undefined;
  const notesRaw = typeof parsed.notes === 'string' ? parsed.notes : description;
  const notes = decodeHtmlEntities(notesRaw);

  return {
    conditions,
    age,
    sex,
    priorTreatments,
    notes,
  };
}

export async function analyzeMatchesWithGemini(
  profile: PatientProfile,
  matches: MatchResult[],
): Promise<MatchResult[] | null> {
  if (matches.length === 0) return [];

  const trialsPayload = matches.map((match) => ({
    nctId: match.nctId,
    title: match.trial.title,
    conditions: match.trial.conditions,
    eligibilityCriteria: match.trial.eligibilityCriteria,
    minAge: match.trial.minAge ?? null,
    maxAge: match.trial.maxAge ?? null,
    phases: match.trial.phases,
    status: match.trial.status,
  }));

  const prompt = `
You are assisting with clinical trial matching for a demo app.
Given one patient profile and candidate trials, return plain-language explanations.
Return ONLY valid JSON as an array with this schema for every trial:
[
  {
    "nctId": string,
    "matchScore": "high" | "medium" | "low",
    "whyEligible": string[],
    "whyNotEligible": string[],
    "simplifiedSummary": string,
    "nextStep": string
  }
]

Patient profile JSON:
${JSON.stringify(profile)}

Candidate trials JSON:
${JSON.stringify(trialsPayload)}
`;

  const raw = await runGeminiPrompt(prompt);
  const parsed = safeJsonParse<
    Array<{
      nctId?: unknown;
      matchScore?: unknown;
      whyEligible?: unknown;
      whyNotEligible?: unknown;
      simplifiedSummary?: unknown;
      nextStep?: unknown;
    }>
  >(raw);

  if (!parsed || !Array.isArray(parsed)) return null;

  const enrichedById = new Map<
    string,
    {
      matchScore: MatchResult['matchScore'];
      whyEligible: string[];
      whyNotEligible: string[];
      simplifiedSummary: string;
      nextStep: string;
    }
  >();

  for (const item of parsed) {
    if (typeof item.nctId !== 'string') continue;
    const matchScore =
      item.matchScore === 'high' || item.matchScore === 'medium' || item.matchScore === 'low'
        ? item.matchScore
        : 'medium';
    const whyEligible = Array.isArray(item.whyEligible)
      ? item.whyEligible
          .filter((v): v is string => typeof v === 'string')
          .map(decodeHtmlEntities)
      : [];
    const whyNotEligible = Array.isArray(item.whyNotEligible)
      ? item.whyNotEligible
          .filter((v): v is string => typeof v === 'string')
          .map(decodeHtmlEntities)
      : [];
    const simplifiedSummary = decodeHtmlEntities(
      typeof item.simplifiedSummary === 'string'
        ? item.simplifiedSummary
        : 'This trial may align with the patient profile based on available data.',
    );
    const nextStep = decodeHtmlEntities(
      typeof item.nextStep === 'string'
        ? item.nextStep
        : 'Contact the study site to verify eligibility and enrollment details.',
    );

    enrichedById.set(item.nctId, {
      matchScore,
      whyEligible,
      whyNotEligible,
      simplifiedSummary,
      nextStep,
    });
  }

  return matches.map((match) => {
    const enriched = enrichedById.get(match.nctId);
    if (!enriched) return match;
    return {
      ...match,
      ...enriched,
    };
  });
}
