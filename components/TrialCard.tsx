'use client';

import { useState } from 'react';
import type { MatchResult } from '@/lib/types';
import { MatchScore } from './MatchScore';

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

export function TrialCard({ match }: { match: MatchResult }) {
  const [expanded, setExpanded] = useState(false);
  const { trial } = match;

  const primaryLocation = trial.locations[0];
  const locationStr = primaryLocation
    ? [primaryLocation.facility, primaryLocation.city, primaryLocation.state ?? primaryLocation.country]
        .filter(Boolean)
        .join(', ')
    : null;

  const phaseLabel = trial.phases.length > 0 ? trial.phases.join(', ') : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Header */}
      <div className="p-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
            Recruiting
          </span>
          {phaseLabel && (
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
              {phaseLabel}
            </span>
          )}
        </div>
        <MatchScore score={match.matchScore} />
      </div>

      {/* Title */}
      <div className="px-5 pb-4">
        <h3 className="font-semibold text-gray-900 leading-snug text-[15px]">{trial.title}</h3>
      </div>

      {/* Summary */}
      <div className="px-5 pb-4">
        <p className="text-sm text-gray-500 leading-relaxed">{match.simplifiedSummary}</p>
      </div>

      {/* Why you qualify */}
      {match.whyEligible.length > 0 && (
        <div className="px-5 pb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-2"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            Why you may qualify
          </button>
          {expanded && (
            <ul className="space-y-1.5">
              {match.whyEligible.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckIcon />
                  {reason}
                </li>
              ))}
              {match.whyNotEligible.map((concern, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <WarnIcon />
                  {concern}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Location */}
      {locationStr && (
        <div className="px-5 pb-3 flex items-center gap-1.5 text-xs text-gray-400">
          <LocationIcon />
          {locationStr}
          {trial.locations.length > 1 && (
            <span className="text-gray-300">+{trial.locations.length - 1} more</span>
          )}
        </div>
      )}

      {/* Next step */}
      <div className="mx-5 mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-0.5">Next step</p>
        <p className="text-sm text-blue-900">{match.nextStep}</p>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <a
          href={trial.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          View full study on ClinicalTrials.gov
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>
    </div>
  );
}
