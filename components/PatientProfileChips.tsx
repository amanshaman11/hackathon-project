import type { PatientProfile } from '@/lib/types';

export function PatientProfileChips({ profile }: { profile: PatientProfile }) {
  const chips: { label: string; value: string }[] = [];

  profile.conditions.forEach((c) => chips.push({ label: 'condition', value: c }));
  if (profile.age) chips.push({ label: 'age', value: `${profile.age} years old` });
  if (profile.sex) chips.push({ label: 'sex', value: profile.sex });
  profile.priorTreatments.forEach((t) => chips.push({ label: 'prior treatment', value: t }));
  if (profile.notes) chips.push({ label: 'notes', value: profile.notes });

  if (chips.length === 0) return null;

  return (
    <div className="rounded-2xl border border-teal-200/70 bg-teal-50/50 p-4 shadow-inner shadow-teal-900/[0.03] backdrop-blur-sm">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-700/90">AI understood</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/70 bg-white/90 px-3 py-1.5 text-sm text-slate-800 shadow-sm shadow-teal-900/[0.04]"
          >
            <span className="text-xs font-medium lowercase text-teal-600">{chip.label}:</span>
            {chip.value}
          </span>
        ))}
      </div>
    </div>
  );
}
