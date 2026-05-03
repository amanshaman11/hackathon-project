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

function conditionSpecificity(profile: PatientProfile, trial: Trial): number {
  if (profile.conditions.length === 0) return 15;
  const trialConds = trial.conditions.map(toLower);
  let best = 0;
  for (const pc of profile.conditions) {
    for (const tc of trialConds) {
      if (pc === tc) { best = Math.max(best, 40); continue; }
      if (tc.includes(pc) || pc.includes(tc)) { best = Math.max(best, 28); continue; }
      const pcWords = new Set(pc.split(/\s+/));
      const overlap = tc.split(/\s+/).filter((w) => pcWords.has(w)).length;
      if (overlap > 0) best = Math.max(best, Math.min(20, overlap * 7));
    }
  }
  return best;
}

function ageFitScore(profile: PatientProfile, trial: Trial): number {
  if (typeof profile.age !== 'number') return 10;
  const { minAge, maxAge } = trial;
  if (typeof minAge === 'number' && profile.age < minAge) return 0;
  if (typeof maxAge === 'number' && profile.age > maxAge) return 0;
  if (typeof minAge !== 'number' && typeof maxAge !== 'number') return 15;
  const lo = minAge ?? 0;
  const hi = maxAge ?? 120;
  const span = hi - lo;
  const margin = Math.min(profile.age - lo, hi - profile.age);
  return Math.round(10 + (span > 0 ? margin / span : 1) * 10);
}

function treatmentScore(profile: PatientProfile, trial: Trial): number {
  if (profile.priorTreatments.length === 0) return 5;
  const criteria = toLower(trial.eligibilityCriteria + ' ' + trial.briefSummary);
  const hits = profile.priorTreatments.filter((t) => criteria.includes(toLower(t))).length;
  return hits === 0 ? 8 : Math.min(15, 8 + hits * 4);
}

function phaseScore(trial: Trial): number {
  const phases = trial.phases.map((p) => p.toLowerCase());
  if (phases.some((p) => p.includes('4'))) return 15;
  if (phases.some((p) => p.includes('3'))) return 12;
  if (phases.some((p) => p.includes('2/3') || p.includes('2, 3'))) return 10;
  if (phases.some((p) => p.includes('2'))) return 8;
  if (phases.some((p) => p.includes('1/2') || p.includes('1, 2'))) return 5;
  if (phases.some((p) => p.includes('1'))) return 3;
  return 7;
}

function locationScore(trial: Trial): number {
  const n = trial.locations.length;
  if (n >= 5) return 10;
  if (n >= 3) return 7;
  if (n >= 1) return 4;
  return 0;
}

function scoreForTrial(profile: PatientProfile, trial: Trial): {
  scoreValue: number;
  whyEligible: string[];
  whyNotEligible: string[];
} {
  const whyEligible: string[] = [];
  const whyNotEligible: string[] = [];

  const cond = conditionSpecificity(profile, trial);
  const age  = ageFitScore(profile, trial);
  const treat = treatmentScore(profile, trial);
  const phase = phaseScore(trial);
  const loc   = locationScore(trial);

  const scoreValue = Math.min(100, cond + age + treat + phase + loc);

  if (cond >= 28) whyEligible.push('Condition closely matches the study focus.');
  else if (cond >= 15) whyEligible.push('Condition partially overlaps with study criteria.');
  else whyNotEligible.push('Primary condition may not fully align with this trial.');

  if (age > 0) {
    if (typeof profile.age === 'number') whyEligible.push(`Age ${profile.age} is within the eligibility range.`);
  } else {
    whyNotEligible.push("Age may be outside this trial's eligibility range.");
  }

  if (profile.priorTreatments.length > 0) {
    whyEligible.push(`Prior treatment history noted (${profile.priorTreatments.join(', ')}).`);
  } else {
    whyNotEligible.push('No prior treatment details were provided.');
  }

  return { scoreValue, whyEligible, whyNotEligible };
}

function toMatchScore(value: number): MatchResult['matchScore'] {
  if (value >= 65) return 'high';
  if (value >= 40) return 'medium';
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
        scoreValue: scoring.scoreValue,
        whyEligible: scoring.whyEligible,
        whyNotEligible: scoring.whyNotEligible,
        simplifiedSummary: trial.briefSummary,
        nextStep: `Review eligibility and contact ${trial.locations[0]?.facility ?? 'the study site'} to confirm enrollment steps.`,
      };
    })
    .sort((a, b) => (b.scoreValue ?? 0) - (a.scoreValue ?? 0))
    .slice(0, 8);
}
