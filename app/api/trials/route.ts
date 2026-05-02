import { NextResponse } from 'next/server';
import { MOCK_TRIALS } from '@/lib/mockTrials';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const condition = searchParams.get('condition')?.trim();
  const ageParam = searchParams.get('age')?.trim();
  const limitParam = searchParams.get('limit')?.trim();

  const age = ageParam ? Number(ageParam) : undefined;
  const limit = limitParam ? Number(limitParam) : 20;
  const cappedLimit =
    Number.isFinite(limit) && limit > 0 ? Math.min(Math.floor(limit), 100) : 20;

  if (ageParam && !Number.isFinite(age)) {
    return NextResponse.json(
      { error: 'age must be a valid number.' },
      { status: 400 },
    );
  }

  const filtered = MOCK_TRIALS.filter((trial) => {
    if (trial.status.toUpperCase() !== 'RECRUITING') return false;

    if (condition) {
      const target = normalize(condition);
      const hasConditionMatch = trial.conditions
        .map(normalize)
        .some((trialCondition) => trialCondition.includes(target) || target.includes(trialCondition));
      if (!hasConditionMatch) return false;
    }

    if (typeof age === 'number') {
      if (typeof trial.minAge === 'number' && age < trial.minAge) return false;
      if (typeof trial.maxAge === 'number' && age > trial.maxAge) return false;
    }

    return true;
  }).slice(0, cappedLimit);

  return NextResponse.json(
    {
      count: filtered.length,
      trials: filtered,
    },
    { status: 200 },
  );
}
