export default function PatientDetailLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      {/* Back button skeleton */}
      <div className="h-8 w-44 rounded-lg bg-slate-800" />

      {/* Patient profile header skeleton */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-700" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-44 rounded bg-slate-600" />
              <div className="h-5 w-24 rounded-full bg-slate-700" />
            </div>
            <div className="flex gap-4">
              <div className="h-3 w-28 rounded bg-slate-800" />
              <div className="h-3 w-24 rounded bg-slate-800" />
              <div className="h-3 w-20 rounded bg-slate-800" />
            </div>
          </div>
        </div>
        <div className="h-9 w-44 rounded-xl bg-slate-700" />
      </div>

      {/* AI insights widget skeleton */}
      <div className="h-14 rounded-xl glass-card border border-slate-800" />

      {/* Section header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-56 rounded bg-slate-700" />
        <div className="h-4 w-36 rounded bg-slate-800" />
      </div>

      {/* Prescription card grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
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
