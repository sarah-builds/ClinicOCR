export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-40 rounded bg-slate-700" />
          <div className="h-7 w-56 rounded bg-slate-700" />
          <div className="h-3 w-80 rounded bg-slate-800" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-28 rounded-xl bg-slate-800" />
          <div className="h-9 w-28 rounded-xl bg-slate-700" />
        </div>
      </div>

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-2.5 w-24 rounded bg-slate-700" />
              <div className="h-7 w-12 rounded bg-slate-600" />
              <div className="h-2.5 w-20 rounded bg-slate-800" />
            </div>
            <div className="h-12 w-12 rounded-xl bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Recent prescriptions skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-64 rounded bg-slate-700" />
            <div className="h-3 w-48 rounded bg-slate-800" />
          </div>
          <div className="h-8 w-28 rounded-xl bg-slate-800" />
        </div>
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
    </div>
  );
}
