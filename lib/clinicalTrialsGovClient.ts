import type { CtgovStudiesListResponse } from '@/lib/clinicalTrialsGovTypes';

const CTGOV_V2_STUDIES_URL = 'https://clinicaltrials.gov/api/v2/studies';

/**
 * Calls the official ClinicalTrials.gov v2 studies endpoint.
 * Pass query params exactly as documented (e.g. filter.overallStatus, query.cond, pageToken).
 */
export async function fetchStudiesFromCtGov(
  params: URLSearchParams,
  init?: RequestInit,
): Promise<CtgovStudiesListResponse> {
  const url = `${CTGOV_V2_STUDIES_URL}?${params.toString()}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
    next: { revalidate: 120 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ClinicalTrials.gov API error ${response.status}: ${body.slice(0, 500)}`);
  }

  return (await response.json()) as CtgovStudiesListResponse;
}
