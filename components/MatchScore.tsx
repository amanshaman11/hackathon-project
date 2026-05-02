import type { MatchResult } from '@/lib/types';

const config = {
  high: {
    label: 'High Match',
    className: 'bg-green-100 text-green-800 border border-green-200',
    dot: 'bg-green-500',
  },
  medium: {
    label: 'Medium Match',
    className: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    dot: 'bg-yellow-500',
  },
  low: {
    label: 'Low Match',
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
    dot: 'bg-gray-400',
  },
} as const;

export function MatchScore({ score }: { score: MatchResult['matchScore'] }) {
  const { label, className, dot } = config[score];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
