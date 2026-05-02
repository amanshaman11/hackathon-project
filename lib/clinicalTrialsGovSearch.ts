import type { PatientProfile } from '@/lib/types';

/**
 * Builds an Essie expression for query.cond from extracted conditions.
 * @see ClinicalTrials.gov API docs — query.* parameters use Essie syntax.
 */
export function buildEssieQueryCondFromProfile(profile: PatientProfile): string | undefined {
  const parts = profile.conditions
    .map((c) => c.trim())
    .filter(Boolean)
    .slice(0, 4);
  if (parts.length === 0) return undefined;
  return parts.map((c) => `(${c})`).join(' OR ');
}

/** Default search params for recruiting trials used by POST /api/match. */
export function buildMatchListSearchParams(profile: PatientProfile): URLSearchParams {
  const params = new URLSearchParams();
  params.set('filter.overallStatus', 'RECRUITING');
  params.set('pageSize', '40');
  const cond = buildEssieQueryCondFromProfile(profile);
  if (cond) params.set('query.cond', cond);
  return params;
}
