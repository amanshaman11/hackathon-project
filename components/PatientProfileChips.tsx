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
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
      <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">AI understood</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-white border border-blue-200 text-blue-900 rounded-lg px-3 py-1 text-sm"
          >
            <span className="text-blue-400 text-xs font-medium">{chip.label}:</span>
            {chip.value}
          </span>
        ))}
      </div>
    </div>
  );
}
