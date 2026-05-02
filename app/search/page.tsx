'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TrialRow } from '@/components/TrialRow';
import { PatientProfileChips } from '@/components/PatientProfileChips';
import { getMockResults } from '@/lib/mockData';
import { Footer } from '@/components/Footer';
import type { MatchResponse } from '@/lib/types';

type State =
  | { status: 'loading' }
  | { status: 'success'; data: MatchResponse }
  | { status: 'error'; message: string };

function RowSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
      </div>
    </div>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') ?? '';
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!query) {
      router.replace('/');
      return;
    }
    setState({ status: 'loading' });
    // TODO: swap getMockResults for a real fetch once /api/match is ready
    setTimeout(() => {
      setState({ status: 'success', data: getMockResults(query) });
    }, 1200);
  }, [query, router]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back + query */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          New search
        </button>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Searching for</p>
          <p className="text-gray-800 text-sm">{query}</p>
        </div>
      </div>

      {/* Loading */}
      {state.status === 'loading' && (
        <div className="space-y-4">
          <div className="h-16 bg-blue-50 rounded-xl animate-pulse" />
          {[1, 2, 3, 4].map((i) => <RowSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {state.status === 'error' && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
          <p className="font-semibold text-red-700 mb-1">Could not fetch results</p>
          <p className="text-sm text-red-500 mb-4">{state.message}</p>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-red-600 hover:underline"
          >
            Go back and try again
          </button>
        </div>
      )}

      {/* Results */}
      {state.status === 'success' && (
        <div className="space-y-5">
          <PatientProfileChips profile={state.data.patient} />

          {state.data.matches.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-xl p-10 text-center shadow-sm">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-gray-900 mb-1">No matching trials found</p>
              <p className="text-sm text-gray-400 max-w-xs mx-auto mb-4">
                Try adding more detail — stage, prior treatments, or age often help narrow the match.
              </p>
              <button onClick={() => router.push('/')} className="text-sm text-blue-600 hover:underline">
                Try a new search
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  {state.data.matches.length} trial{state.data.matches.length !== 1 ? 's' : ''} found
                </h2>
                <span className="text-xs text-gray-400">Sorted by match score</span>
              </div>
              <div className="space-y-3">
                {state.data.matches.map((match, i) => (
                  <TrialRow key={match.nctId} match={match} index={i} />
                ))}
              </div>
            </>
          )}

          <p className="text-center text-xs text-gray-300 pt-4">
            For informational purposes only. Consult a healthcare provider before enrolling in any trial.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-sm">TrialMatch AI</span>
        </div>
      </nav>

      <Suspense fallback={
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-4">
          {[1, 2, 3, 4].map((i) => <RowSkeleton key={i} />)}
        </div>
      }>
        <SearchResults />
      </Suspense>
      <Footer />
    </div>
  );
}
