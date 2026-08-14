export default function PatientsLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-slate-700" />
          <div className="h-7 w-48 rounded bg-slate-700" />
          <div className="h-3 w-72 rounded bg-slate-800" />
        </div>
        <div className="h-9 w-40 rounded-xl bg-slate-700" />
      </div>

      {/* Search bar skeleton */}
      <div className="h-10 max-w-md rounded-xl bg-slate-800" />

      {/* Patient card grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-slate-700" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-36 rounded bg-slate-600" />
                <div className="h-3 w-24 rounded bg-slate-800" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-slate-800" />
              <div className="h-3 w-3/4 rounded bg-slate-800" />
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-7 w-20 rounded-lg bg-slate-700" />
              <div className="h-7 w-20 rounded-lg bg-slate-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
