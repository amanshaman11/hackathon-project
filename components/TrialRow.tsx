'use client';

import { useState } from 'react';
import type { MatchResult } from '@/lib/types';

function getScore(match: MatchResult): number {
  if (match.scoreValue !== undefined) return match.scoreValue;
  return match.matchScore === 'high' ? 82 : match.matchScore === 'medium' ? 61 : 38;
}

function ScoreBadge({ score }: { score: number }) {
  const style =
    score >= 70
      ? 'border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50/80 text-teal-800'
      : score >= 45
        ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/70 text-amber-900'
        : 'border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/80 text-slate-600';
  return (
    <div className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 shadow-sm shadow-teal-900/[0.06] ${style}`}>
      <span className="font-display text-xl font-bold leading-none">{score}</span>
      <span className="mt-0.5 text-[10px] font-medium opacity-70">/100</span>
    </div>
  );
}

export function TrialRow({ match, index }: { match: MatchResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const score = getScore(match);
  const { trial } = match;

  const primaryLocation = trial.locations[0];
  const locationStr = primaryLocation
    ? [primaryLocation.city, primaryLocation.state ?? primaryLocation.country].filter(Boolean).join(', ')
    : null;

  return (
    <div className="relative rounded-2xl border border-slate-100/90 bg-white/95 shadow-lg shadow-teal-900/[0.04] backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-teal-900/[0.07]">
      {/* View study — always top-right */}
      <a
        href={trial.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-xl border border-teal-100 bg-white/95 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:border-teal-200 hover:bg-teal-50/80 hover:text-teal-900"
      >
        View study
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>

      <div className="flex items-start gap-4 p-5 pr-32">
        {/* Score */}
        <ScoreBadge score={score} />

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Badges row */}
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-100 bg-emerald-50/90 px-2 py-0.5 text-xs font-medium text-emerald-800">
              Recruiting
            </span>
            {trial.phases.length > 0 && (
              <span className="rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs text-slate-500">
                {trial.phases.join(', ')}
              </span>
            )}
            {locationStr && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {locationStr}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-[15px] font-semibold leading-snug text-slate-900 sm:text-base">
            {trial.title}
          </h3>

          {match.simplifiedSummary && (
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{match.simplifiedSummary}</p>
          )}

          {/* Why it matches */}
          {match.whyEligible.length > 0 && (
            <div className="mt-3">
              <ul className="space-y-1">
                {(expanded ? match.whyEligible : match.whyEligible.slice(0, 2)).map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {reason}
                  </li>
                ))}
                {!expanded && match.whyNotEligible.length > 0 && (
                  <li className="flex items-start gap-2 text-sm text-slate-500">
                    <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {match.whyNotEligible[0]}
                  </li>
                )}
              </ul>

              {(match.whyEligible.length > 2 || match.whyNotEligible.length > 0) && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-xs font-medium text-teal-600 hover:text-teal-800"
                >
                  {expanded ? 'Show less' : `Show ${match.whyEligible.length - 2 + match.whyNotEligible.length} more details`}
                </button>
              )}
            </div>
          )}

          {/* Next step — visible when expanded */}
          {expanded && (
            <div className="mt-3 rounded-xl border border-teal-100 bg-teal-50/70 px-3 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">Next step · </span>
              <span className="text-sm text-slate-800">{match.nextStep}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
