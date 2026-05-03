'use client';

import { useEffect, useRef, useState } from 'react';
import { COUNTRIES } from '@/lib/countries';

const EXAMPLES = [
  'My dad is 62, has non-small cell lung cancer stage III, already did chemotherapy',
  'Type 2 diabetes, age 45, on metformin for 3 years',
  'Breast cancer survivor, age 54, post-mastectomy, estrogen receptor positive',
];

const TYPING_PHRASES = [
  'My dad is 62, has lung cancer stage III…',
  'Type 2 diabetes, age 45, on metformin…',
  'Breast cancer survivor, post-mastectomy…',
];

type TypingPhase = 'typing' | 'deleting';

function useTypingEffect(phrases: string[], active: boolean) {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<TypingPhase>('typing');
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    if (!active) { setText(''); return; }
    const phrase = phrases[phraseIdx];
    if (phase === 'typing') {
      if (text.length < phrase.length) {
        const t = setTimeout(() => setText(phrase.slice(0, text.length + 1)), 65);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase('deleting'), 1800);
      return () => clearTimeout(t);
    }
    if (phase === 'deleting') {
      if (text.length > 0) {
        const t = setTimeout(() => setText((s) => s.slice(0, -1)), 38);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => { setPhraseIdx((i) => (i + 1) % phrases.length); setPhase('typing'); }, 400);
      return () => clearTimeout(t);
    }
  }, [active, text, phase, phraseIdx, phrases]);

  return text;
}

type Props = {
  onSubmit: (description: string, country: string) => void;
  isLoading: boolean;
  defaultValue?: string;
  defaultCountry?: string;
};

export function InputForm({ onSubmit, isLoading, defaultValue = '', defaultCountry = '' }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [country, setCountry] = useState(defaultCountry);
  const [hasFocused, setHasFocused] = useState(defaultValue !== '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const typingText = useTypingEffect(TYPING_PHRASES, !hasFocused && value === '' && !isLoading);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim(), country);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Rotating conic-gradient border wrapper */}
      <div className="textarea-glow-wrap">
        <div className="textarea-glow-inner relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setHasFocused(true)}
            placeholder={hasFocused ? "Describe the patient's condition — age, diagnosis, prior treatments..." : ''}
            rows={4}
            disabled={isLoading}
            className="w-full rounded-[10px] border-0 bg-transparent px-4 pb-11 pt-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 resize-none disabled:opacity-60"
          />

          {/* Typing-effect overlay — shown only before first focus */}
          {!hasFocused && value === '' && (
            <div
              aria-hidden
              onClick={() => { setHasFocused(true); textareaRef.current?.focus(); }}
              className="pointer-events-auto absolute inset-0 cursor-text rounded-[10px] px-4 pb-11 pt-3 text-sm text-gray-400 select-none"
            >
              {typingText}
              <span className="cursor-blink ml-px font-light text-teal-500">|</span>
            </div>
          )}

          {/* Country dropdown — bottom-left inside textarea */}
          <div className="absolute bottom-2.5 left-2 z-10">
            <div className="relative flex items-center">
              <svg
                className="pointer-events-none absolute left-2 w-3.5 h-3.5 text-teal-500 shrink-0"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.919 17.919 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isLoading}
                className="appearance-none rounded-lg border border-gray-200 bg-white/95 pl-7 pr-6 py-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-400 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-1.5 w-3 h-3 text-gray-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Example pills */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-400 self-center">Try:</span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setValue(ex); setHasFocused(true); }}
            disabled={isLoading}
            className="text-xs bg-gray-50 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-200 text-gray-600 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50"
          >
            {ex.length > 42 ? ex.slice(0, 42) + '…' : ex}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm disabled:cursor-not-allowed"
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
