import { proxyCtGovStudiesGet } from '@/lib/proxyCtGovStudiesGet';

export const dynamic = 'force-dynamic';

/**
 * Alias for the official ClinicalTrials.gov "studies" list resource shape.
 * Same behavior as GET /api/trials — forwards query params to registry v2 /studies.
 */
export async function GET(request: Request) {
  return proxyCtGovStudiesGet(request);
}
