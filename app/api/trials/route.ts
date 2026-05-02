import { proxyCtGovStudiesGet } from '@/lib/proxyCtGovStudiesGet';

export const dynamic = 'force-dynamic';

/**
 * Proxies ClinicalTrials.gov GET /api/v2/studies with the same response shape:
 * { studies, nextPageToken?, totalCount? }.
 *
 * Forwards all query parameters from the request URL (e.g. query.cond, filter.overallStatus,
 * pageToken, pageSize, countTotal, fields).
 */
export async function GET(request: Request) {
  return proxyCtGovStudiesGet(request);
}
