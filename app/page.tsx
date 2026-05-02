'use client';

import { useState } from 'react';
import { InputForm } from '@/components/InputForm';
import { TrialCard } from '@/components/TrialCard';
import { PatientProfileChips } from '@/components/PatientProfileChips';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import type { MatchResponse } from '@/lib/types';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: MatchResponse }
  | { status: 'error'; message: string };

export default function Home() {
  const [state, setState] = useState<State>({ status: 'idle' });

  async function handleSubmit(description: string) {
    setState({ status: 'loading' });
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data: MatchResponse = await res.json();
      setState({ status: 'success', data });
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : 'Something went wrong' });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-sm">TrialMatch AI</span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">Built for BeaverHacks</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            AI-Powered Matching
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Find Clinical Trials<br />
            <span className="text-blue-600">That Match You</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Describe your condition in plain language — our AI finds real, recruiting trials and explains exactly why you may qualify.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <InputForm onSubmit={handleSubmit} isLoading={state.status === 'loading'} />
        </div>

        {/* Results area */}
        {state.status === 'loading' && <LoadingSkeleton />}

        {state.status === 'error' && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-medium mb-1">Something went wrong</p>
            <p className="text-red-500 text-sm">{state.message}</p>
          </div>
        )}

        {state.status === 'success' && (
          <div className="space-y-6">
            <PatientProfileChips profile={state.data.patient} />

            {state.data.matches.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="font-semibold text-gray-900 mb-2">No matching trials found</p>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Try broadening your description, or check back — new trials are added regularly.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">
                    {state.data.matches.length} trial{state.data.matches.length !== 1 ? 's' : ''} found
                  </h2>
                  <span className="text-xs text-gray-400">Sorted by match strength</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.data.matches.map((match) => (
                    <TrialCard key={match.nctId} match={match} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-300 mt-12">
          For informational purposes only. Always consult a healthcare provider before enrolling in a clinical trial.
        </p>
      </main>
    </div>
  );
}
