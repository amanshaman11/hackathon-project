function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded-full w-24" />
      </div>
      <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
      <div className="h-5 bg-gray-200 rounded w-3/5 mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <div className="h-10 bg-blue-50 rounded-xl" />
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 bg-blue-50 rounded-xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
