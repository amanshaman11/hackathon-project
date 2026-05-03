'use client';

import { useRouter } from 'next/navigation';
import { InputForm } from '@/components/InputForm';
import { Footer } from '@/components/Footer';
import { HomeSideRails } from '@/components/HomeSideRails';
import { AppNav } from '@/components/AppNav';

const STEPS = [
  {
    number: '01',
    title: 'Describe in plain language',
    description:
      'Type your condition, age, and any prior treatments in everyday words — no medical jargon needed.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI scans real trials',
    description:
      'Our AI reads thousands of currently recruiting trials from ClinicalTrials.gov and scores each one against your profile.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Understand and act',
    description:
      'Get a ranked list of matches with plain-English explanations, eligibility reasons, and a clear next step for each trial.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const PAIN_POINTS = [
  {
    stat: '400,000+',
    label: 'active trials on ClinicalTrials.gov',
    detail: 'Most are irrelevant to any given patient — finding the right ones manually takes hours.',
  },
  {
    stat: '68%',
    label: 'of trials fail due to poor enrollment',
    detail: 'Patients who could benefit never hear about trials that need them.',
  },
  {
    stat: '3+ hrs',
    label: 'average time to find one relevant trial',
    detail: 'Eligibility criteria are written in dense medical language most patients cannot parse.',
  },
];

const FEATURES = [
  {
    title: 'AI reasoning, not keyword search',
    description:
      'We don\'t just match words. The AI reads full eligibility criteria and explains exactly why you may or may not qualify.',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: 'Real, recruiting trials only',
    description:
      'All results come directly from ClinicalTrials.gov and are filtered to currently recruiting studies — no outdated listings.',
    color: 'bg-green-50 text-green-600 border-green-100',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Plain English, always',
    description:
      'Complex medical protocols are summarized in simple language. You\'ll know what a trial is about in seconds.',
    color: 'bg-teal-50 text-teal-700 border-teal-100',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
];

export default function Home() {
  const router = useRouter();

  function handleSubmit(description: string, country: string) {
    const params = new URLSearchParams({ q: description });
    if (country) params.set('country', country);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-teal-50/25 to-gray-50">
      <HomeSideRails />

      <AppNav />

      <main>
        {/* ── Hero + input ── */}
        <section className="relative isolate overflow-hidden">
          {/* Drifting mesh + noise (purely decorative) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[-20%] h-[620px] -z-10 hero-surface-noise"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_-10%,rgba(45,212,191,0.22),transparent_52%),radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.18),transparent_46%),linear-gradient(to_bottom,rgba(255,255,255,0.95),transparent)]" />
            <div className="absolute -left-24 top-20 h-[min(560px,90vw)] w-[min(560px,90vw)] rounded-[40%] bg-teal-400/35 blur-[100px] mix-blend-multiply animate-blob-drift-a" />
            <div className="absolute -right-16 top-32 h-[min(480px,75vw)] w-[min(480px,75vw)] rounded-[45%] bg-blue-500/28 blur-[90px] mix-blend-multiply animate-blob-drift-b" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-20">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-teal-200/70 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-800 shadow-sm shadow-teal-900/5 backdrop-blur-sm animate-hero-rise [animation-delay:40ms]"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.9)]" />
                AI-powered matching
              </div>
              <h1 className="mt-8 font-display text-[2.1rem] font-semibold tracking-tight text-slate-900 sm:text-[2.85rem] sm:leading-[1.1] leading-[1.15]">
                <span className="block animate-hero-rise [animation-delay:90ms]">Find Clinical Trials</span>
                <span className="mt-3 block animate-hero-rise [animation-delay:160ms]">
                  <span className="text-gradient-shift pb-1">that fit you.</span>
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-slate-600 sm:text-lg animate-hero-rise [animation-delay:240ms]">
                Describe your condition in plain language — our AI finds real recruiting studies and explains why you might qualify.
              </p>
            </div>

            <div className="mx-auto max-w-2xl rounded-3xl bg-white/90 p-1 shadow-xl shadow-teal-900/[0.07] backdrop-blur-md animate-hero-rise [animation-delay:300ms]">
              <div className="rounded-[1.35rem] bg-white/98 p-5 sm:p-6">
                <InputForm onSubmit={handleSubmit} isLoading={false} />
              </div>
            </div>
          </div>
        </section>

        {/* ── The Problem ── */}
        <section className="bg-gray-900 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">The Problem</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Finding clinical trials is broken
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
                Patients who could benefit from cutting-edge treatments are left navigating a system built for researchers, not people.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {PAIN_POINTS.map((p) => (
                <div key={p.stat} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <p className="text-3xl font-bold text-blue-400 mb-1">{p.stat}</p>
                  <p className="text-sm font-semibold text-white mb-2">{p.label}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="bg-white py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">How It Works</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                From description to decision in seconds
              </h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                No forms. No filters. Just describe your situation and let the AI do the work.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {STEPS.map((step, idx) => (
                <div
                  key={step.number}
                  className="animate-step-in flex flex-col items-start"
                  style={{ animationDelay: `${320 + idx * 95}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shadow-sm shadow-teal-900/5">
                      {step.icon}
                    </div>
                    <span className="text-xs font-bold text-teal-400 tracking-widest">{step.number}</span>
                  </div>
                  <h3 className="font-display font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            {/* Connector line (desktop only) */}
            <div className="hidden sm:flex items-center justify-between mt-8 px-16">
              {[0, 1].map((i) => (
                <div key={i} className="flex-1 h-px bg-gradient-to-r from-blue-100 to-blue-200 mx-4" />
              ))}
            </div>
          </div>
        </section>

        {/* ── Why TrialMatch AI ── */}
        <section className="bg-blue-50 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Why TrialMatch AI</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Not a search engine — a decision assistant
              </h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                Traditional tools give you a list. We give you answers.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-4 ${f.color}`}>
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="bg-white py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to find your match?</h2>
            <p className="text-gray-500 text-sm mb-8">
              Takes 30 seconds. No account needed. Completely free.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
            >
              Search clinical trials
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
