import { NextResponse } from 'next/server';
import { fetchStudiesFromCtGov } from '@/lib/clinicalTrialsGovClient';

const MAX_PAGE_SIZE = 100;

/**
 * Shared handler: returns ClinicalTrials.gov v2 list JSON
 * `{ studies?, nextPageToken?, totalCount? }` from GET /api/v2/studies.
 */
export async function proxyCtGovStudiesGet(request: Request): Promise<Response> {
  const incoming = new URL(request.url).searchParams;
  const params = new URLSearchParams(incoming);

  if (!params.has('pageSize')) {
    params.set('pageSize', '20');
  }

  const pageSize = Number(params.get('pageSize'));
  if (Number.isFinite(pageSize) && pageSize > MAX_PAGE_SIZE) {
    params.set('pageSize', String(MAX_PAGE_SIZE));
  }

  try {
    const data = await fetchStudiesFromCtGov(params);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('ClinicalTrials.gov studies proxy failed', error);
    const message = error instanceof Error ? error.message : 'Upstream request failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
