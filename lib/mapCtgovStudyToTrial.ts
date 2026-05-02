import type { CtgovStudy } from '@/lib/clinicalTrialsGovTypes';
import type { Trial, TrialLocation } from '@/lib/types';

/** Parse strings like "18 Years", "6 Months" into approximate years for min/max age. */
export function parseAgeToYears(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const s = raw.trim().toLowerCase();
  if (s.includes('no maximum') || s === 'n/a') return undefined;

  const yearMatch = s.match(/^(\d+)\s*(year|years)\b/);
  if (yearMatch) return Number(yearMatch[1]);

  const monthMatch = s.match(/^(\d+)\s*(month|months)\b/);
  if (monthMatch) return Number(monthMatch[1]) / 12;

  const weekMatch = s.match(/^(\d+)\s*(week|weeks)\b/);
  if (weekMatch) return Number(weekMatch[1]) / 52;

  const dayMatch = s.match(/^(\d+)\s*(day|days)\b/);
  if (dayMatch) return Number(dayMatch[1]) / 365;

  const fallback = s.match(/(\d+)/);
  return fallback ? Number(fallback[1]) : undefined;
}

function formatPhaseLabel(phase: string): string {
  if (phase === 'NA') return 'N/A';
  if (phase === 'EARLY_PHASE1') return 'Early Phase 1';
  const m = phase.match(/^PHASE(\d)$/i);
  if (m) return `Phase ${m[1]}`;
  return phase.replace(/_/g, ' ');
}

function mapSex(
  sex: string | undefined,
): 'ALL' | 'MALE' | 'FEMALE' | undefined {
  if (sex === 'ALL' || sex === 'MALE' || sex === 'FEMALE') return sex;
  return undefined;
}

function locationToTrialLocation(loc: {
  facility?: string;
  city?: string;
  state?: string;
  country?: string;
  contacts?: Array<{ name?: string; phone?: string; email?: string }>;
}): TrialLocation {
  const c = loc.contacts?.[0];
  const contactBits = [c?.name, c?.phone, c?.email].filter(Boolean);
  return {
    facility: loc.facility ?? 'Study site',
    city: loc.city ?? '',
    state: loc.state,
    country: loc.country ?? '',
    contact: contactBits.length > 0 ? contactBits.join(' · ') : undefined,
  };
}

export function mapCtgovStudyToTrial(study: CtgovStudy): Trial | null {
  const ps = study.protocolSection;
  const id = ps.identificationModule?.nctId?.trim();
  if (!id) return null;

  const briefTitle = ps.identificationModule?.briefTitle?.trim();
  const officialTitle = ps.identificationModule?.officialTitle?.trim();
  const title = briefTitle || officialTitle || id;

  const conditions = ps.conditionsModule?.conditions?.filter(Boolean) ?? [];
  const briefSummary = ps.descriptionModule?.briefSummary?.trim() ?? '';
  const eligibilityCriteria = ps.eligibilityModule?.eligibilityCriteria?.trim() ?? '';

  const minAge = parseAgeToYears(ps.eligibilityModule?.minimumAge);
  const maxAge = parseAgeToYears(ps.eligibilityModule?.maximumAge);

  const sex = mapSex(ps.eligibilityModule?.sex);
  const status = ps.statusModule?.overallStatus?.trim() ?? 'UNKNOWN';

  const rawPhases = ps.designModule?.phases ?? [];
  const phases = rawPhases.map(formatPhaseLabel);

  const locs = ps.contactsLocationsModule?.locations ?? [];
  const locations: TrialLocation[] =
    locs.length > 0
      ? locs.map(locationToTrialLocation)
      : [
          {
            facility: 'See ClinicalTrials.gov',
            city: '',
            country: '',
            contact: undefined,
          },
        ];

  return {
    nctId: id,
    title,
    conditions,
    briefSummary,
    eligibilityCriteria,
    minAge,
    maxAge,
    sex,
    status,
    phases,
    locations,
    url: `https://clinicaltrials.gov/study/${id}`,
  };
}

export function mapCtgovStudiesToTrials(studies: CtgovStudy[] | undefined): Trial[] {
  if (!studies?.length) return [];
  return studies.map(mapCtgovStudyToTrial).filter((t): t is Trial => t !== null);
}
