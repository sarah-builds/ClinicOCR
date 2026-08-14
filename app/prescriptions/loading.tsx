export default function PrescriptionsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-slate-700" />
          <div className="h-7 w-64 rounded bg-slate-700" />
          <div className="h-3 w-80 rounded bg-slate-800" />
        </div>
        <div className="h-9 w-40 rounded-xl bg-slate-800" />
      </div>

      {/* Search + tag bar skeleton */}
      <div className="space-y-3">
        <div className="h-11 max-w-xl rounded-xl bg-slate-800" />
        <div className="flex flex-wrap gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-6 w-16 rounded-lg bg-slate-800" />
          ))}
        </div>
      </div>

      {/* Prescription card grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="h-3 w-24 rounded bg-slate-700" />
            <div className="h-5 w-40 rounded bg-slate-600" />
            <div className="h-3 w-full rounded bg-slate-800" />
            <div className="h-3 w-4/5 rounded bg-slate-800" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-14 rounded-full bg-slate-700" />
              <div className="h-5 w-16 rounded-full bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
