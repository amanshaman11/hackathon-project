'use client';

import { useState } from 'react';

const EXAMPLES = [
  'My dad is 62, has non-small cell lung cancer stage III, already did chemotherapy',
  'Type 2 diabetes, age 45, on metformin for 3 years',
  'Breast cancer survivor, age 54, post-mastectomy, estrogen receptor positive',
];

type Props = {
  onSubmit: (description: string) => void;
  isLoading: boolean;
};

export function InputForm({ onSubmit, isLoading }: Props) {
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe the patient's condition in plain language — age, diagnosis, prior treatments, anything relevant..."
        rows={4}
        disabled={isLoading}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm disabled:opacity-60"
      />

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-400 self-center">Try an example:</span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setValue(ex)}
            disabled={isLoading}
            className="text-xs bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200 text-gray-600 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            {ex.length > 45 ? ex.slice(0, 45) + '…' : ex}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            Find Matching Trials
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
