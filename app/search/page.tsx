'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TrialRow } from '@/components/TrialRow';
import { PatientProfileChips } from '@/components/PatientProfileChips';
import { InputForm } from '@/components/InputForm';
import { Footer } from '@/components/Footer';
import { HomeSideRails } from '@/components/HomeSideRails';
import { AppNav } from '@/components/AppNav';
import type { MatchResponse } from '@/lib/types';

type State =
  | { status: 'loading' }
  | { status: 'success'; data: MatchResponse }
  | { status: 'error'; message: string };

function RowSkeleton() {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-100/80 bg-white/90 p-5 shadow-sm shadow-teal-900/[0.04] backdrop-blur-sm">
      <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-gradient-to-br from-teal-100 to-slate-100" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') ?? '';
  const country = searchParams.get('country') ?? '';
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!query) {
      router.replace('/');
      return;
    }
    setState({ status: 'loading' });
    fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: query, country: country || undefined }),
    })
      .then((res) => {
        if (!res.ok)
          return res.json().then((e: { error?: string }) => {
            throw new Error(e.error ?? `Server error ${res.status}`);
          });
        return res.json() as Promise<MatchResponse>;
      })
      .then((data) => setState({ status: 'success', data }))
      .catch((err) =>
        setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong' }),
      );
  }, [query, country, router]);

  function handleReSearch(description: string, newCountry: string) {
    const params = new URLSearchParams({ q: description });
    if (newCountry) params.set('country', newCountry);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="relative mx-auto max-w-5xl px-4 pb-14 pt-8 sm:px-6 md:px-8">

      {/* Re-search form at top */}
      <div className="mb-8 rounded-3xl bg-white/90 p-5 shadow-xl shadow-teal-900/[0.07] backdrop-blur-md sm:p-6">
        <InputForm
          onSubmit={handleReSearch}
          isLoading={state.status === 'loading'}
          defaultValue={query}
          defaultCountry={country}
        />
      </div>

      {/* Loading skeleton */}
      {state.status === 'loading' && (
        <div className="space-y-4">
          <div className="h-20 animate-pulse rounded-2xl bg-gradient-to-r from-teal-100/80 via-teal-50 to-blue-50/70" />
          {[1, 2, 3, 4].map((i) => (
            <RowSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {state.status === 'error' && (
        <div className="rounded-2xl border border-red-100 bg-red-50/90 p-8 text-center shadow-sm backdrop-blur-sm">
          <p className="font-display mb-1 text-lg font-semibold text-red-800">Could not fetch results</p>
          <p className="mb-4 text-sm text-red-600/90">{state.message}</p>
          <p className="text-xs text-red-400">Edit your search above and try again.</p>
        </div>
      )}

      {/* Results */}
      {state.status === 'success' && (
        <div className="space-y-6">
          <PatientProfileChips profile={state.data.patient} />

          {state.data.matches.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white/90 p-10 text-center shadow-lg shadow-teal-900/[0.04] backdrop-blur-md">
              <p className="mb-3 text-4xl">🔍</p>
              <p className="font-display mb-2 text-xl font-semibold text-slate-900">No matching trials found</p>
              <p className="mx-auto mb-2 max-w-sm text-sm leading-relaxed text-slate-500">
                Try adding more detail — stage, prior treatments, or age often help narrow the match.
              </p>
              <p className="text-xs text-slate-400">Edit your description in the search box above.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-100/90 pb-3">
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                    {state.data.matches.length} trial{state.data.matches.length !== 1 ? 's' : ''} found
                  </h2>
                  {state.data.meta?.trialSource && (
                    <p className="mt-1 text-xs text-slate-500">
                      {state.data.meta.trialSource === 'clinicaltrials.gov'
                        ? 'Pulled from live recruiting studies on ClinicalTrials.gov.'
                        : 'Showing demo fallback — live registry unavailable for this query.'}
                    </p>
                  )}
                </div>
                <span className="text-[11px] font-medium uppercase tracking-wider text-teal-600/75">
                  Sorted by match strength
                </span>
              </div>
              <div className="space-y-3">
                {state.data.matches.map((match, i) => (
                  <TrialRow key={match.nctId} match={match} index={i} />
                ))}
              </div>
            </>
          )}

          <p className="pt-6 text-center text-xs text-slate-400">
            For informational purposes only. Consult a healthcare provider before enrolling in any trial.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-teal-50/25 to-gray-50">
      <HomeSideRails />
      <AppNav />

      <Suspense
        fallback={
          <div className="relative mx-auto max-w-5xl space-y-4 px-4 pb-14 pt-8 sm:px-6 md:px-8">
            <div className="mb-8 h-40 animate-pulse rounded-3xl bg-white/80 shadow-xl shadow-teal-900/[0.06]" />
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </div>
        }
      >
        <SearchResults />
      </Suspense>

      <Footer />
    </div>
  );
}
