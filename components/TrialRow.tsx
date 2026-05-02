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
      ? 'text-green-700 bg-green-50 border-green-300'
      : score >= 45
      ? 'text-amber-700 bg-amber-50 border-amber-300'
      : 'text-gray-500 bg-gray-50 border-gray-300';
  return (
    <div className={`w-16 h-16 shrink-0 rounded-full border-2 flex flex-col items-center justify-center ${style}`}>
      <span className="text-xl font-bold leading-none">{score}</span>
      <span className="text-[10px] font-medium opacity-60 mt-0.5">/100</span>
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
    <div className="relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {/* View study — always top-right */}
      <a
        href={trial.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-100 hover:border-blue-300 bg-white rounded-lg px-3 py-1.5 transition-colors z-10"
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
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
              Recruiting
            </span>
            {trial.phases.length > 0 && (
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {trial.phases.join(', ')}
              </span>
            )}
            {locationStr && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {locationStr}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-[15px] leading-snug">
            {trial.title}
          </h3>

          {/* Why it matches */}
          {match.whyEligible.length > 0 && (
            <div className="mt-3">
              <ul className="space-y-1">
                {(expanded ? match.whyEligible : match.whyEligible.slice(0, 2)).map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {reason}
                  </li>
                ))}
                {!expanded && match.whyNotEligible.length > 0 && (
                  <li className="flex items-start gap-2 text-sm text-gray-500">
                    <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    {match.whyNotEligible[0]}
                  </li>
                )}
              </ul>

              {(match.whyEligible.length > 2 || match.whyNotEligible.length > 0) && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-700 font-medium"
                >
                  {expanded ? 'Show less' : `Show ${match.whyEligible.length - 2 + match.whyNotEligible.length} more details`}
                </button>
              )}
            </div>
          )}

          {/* Next step — visible when expanded */}
          {expanded && (
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">Next step · </span>
              <span className="text-sm text-blue-900">{match.nextStep}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
