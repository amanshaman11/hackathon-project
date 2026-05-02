import type { MatchResult, PatientProfile, Trial } from '@/lib/types';

const CONDITION_KEYWORDS = [
  'non-small cell lung cancer',
  'lung cancer',
  'breast cancer',
  'type 2 diabetes',
  'diabetes',
  'heart failure',
  'asthma',
  'parkinson',
  'alzheimer',
  'depression',
];

const TREATMENT_KEYWORDS = [
  'chemotherapy',
  'radiation',
  'surgery',
  'immunotherapy',
  'metformin',
  'insulin',
  'mastectomy',
];

function toLower(value: string): string {
  return value.trim().toLowerCase();
}

export function extractPatientProfile(description: string): PatientProfile {
  const normalized = toLower(description);

  const conditions = CONDITION_KEYWORDS.filter((keyword) =>
    normalized.includes(keyword),
  );

  const priorTreatments = TREATMENT_KEYWORDS.filter((keyword) =>
    normalized.includes(keyword),
  );

  const ageMatch =
    normalized.match(/\bage\s*(\d{1,3})\b/) ??
    normalized.match(/\b(\d{1,3})\s*(?:years old|year old|yo)\b/) ??
    normalized.match(/\b(\d{1,3})\b/);

  const age = ageMatch ? Number(ageMatch[1]) : undefined;
  const sex: PatientProfile['sex'] = normalized.includes('female') || normalized.includes('woman')
    ? 'female'
    : normalized.includes('male') || normalized.includes('man')
      ? 'male'
      : undefined;

  return {
    conditions,
    age,
    sex,
    priorTreatments,
    notes: description.length > 300 ? `${description.slice(0, 297)}...` : description,
  };
}

function isConditionMatch(profile: PatientProfile, trial: Trial): boolean {
  if (profile.conditions.length === 0) {
    return true;
  }

  const trialConditions = trial.conditions.map(toLower);
  return profile.conditions.some((condition) =>
    trialConditions.some(
      (trialCondition) =>
        trialCondition.includes(condition) || condition.includes(trialCondition),
    ),
  );
}

function isAgeMatch(profile: PatientProfile, trial: Trial): boolean {
  if (typeof profile.age !== 'number') return true;
  if (typeof trial.minAge === 'number' && profile.age < trial.minAge) return false;
  if (typeof trial.maxAge === 'number' && profile.age > trial.maxAge) return false;
  return true;
}

function scoreForTrial(profile: PatientProfile, trial: Trial): {
  scoreValue: number;
  whyEligible: string[];
  whyNotEligible: string[];
} {
  let scoreValue = 0;
  const whyEligible: string[] = [];
  const whyNotEligible: string[] = [];

  if (isConditionMatch(profile, trial)) {
    scoreValue += 3;
    whyEligible.push('Condition appears to match this study focus.');
  } else {
    whyNotEligible.push('Primary condition may not fully match the study condition.');
  }

  if (isAgeMatch(profile, trial)) {
    scoreValue += 2;
    if (typeof profile.age === 'number') {
      whyEligible.push(`Age ${profile.age} fits the listed eligibility range.`);
    }
  } else {
    whyNotEligible.push('Age may be outside this trial eligibility range.');
  }

  if (profile.priorTreatments.length > 0) {
    scoreValue += 1;
    whyEligible.push(
      `Prior treatment history noted (${profile.priorTreatments.join(', ')}).`,
    );
  } else {
    whyNotEligible.push('No prior treatment details were provided.');
  }

  return { scoreValue, whyEligible, whyNotEligible };
}

function toMatchScore(value: number): MatchResult['matchScore'] {
  if (value >= 5) return 'high';
  if (value >= 3) return 'medium';
  return 'low';
}

export function buildMatches(profile: PatientProfile, trials: Trial[]): MatchResult[] {
  return trials
    .filter((trial) => trial.status.toUpperCase() === 'RECRUITING')
    .filter((trial) => isConditionMatch(profile, trial))
    .filter((trial) => isAgeMatch(profile, trial))
    .map((trial) => {
      const scoring = scoreForTrial(profile, trial);
      return {
        nctId: trial.nctId,
        trial,
        matchScore: toMatchScore(scoring.scoreValue),
        whyEligible: scoring.whyEligible,
        whyNotEligible: scoring.whyNotEligible,
        simplifiedSummary: trial.briefSummary,
        nextStep: `Review eligibility and contact ${trial.locations[0]?.facility ?? 'the study site'} to confirm enrollment steps.`,
      };
    })
    .sort((a, b) => {
      const rank: Record<MatchResult['matchScore'], number> = {
        high: 3,
        medium: 2,
        low: 1,
      };
      return rank[b.matchScore] - rank[a.matchScore];
    })
    .slice(0, 8);
}
