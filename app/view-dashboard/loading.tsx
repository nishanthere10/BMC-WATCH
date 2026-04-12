export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 space-y-8 pt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-sm animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 h-80 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-sm animate-pulse" />
        <div className="lg:col-span-2 h-80 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 shadow-sm animate-pulse" />
      </div>
    </main>
  );
}
