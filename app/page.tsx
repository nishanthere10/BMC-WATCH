import Link from "next/link";
import { ArrowRight, MapPin, Activity, ShieldAlert } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <div className="mb-6 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
          <Activity className="w-3 h-3 mr-1" /> Live Updates from BMC Active Sites
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Mumbai <span className="text-blue-600">Civic Watch</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Real-time transparency into Brihanmumbai Municipal Corporation (BMC) projects across the city. Track your taxes, one road at a time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/nearby" 
            className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <MapPin className="mr-2 h-4 w-4" />
            View Nearby Projects
          </Link>
          <Link 
            href="/nearby" 
            className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Explore Map <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl w-full">
          <div className="border rounded-xl p-6 bg-slate-50">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
              <MapPin className="text-blue-600 h-5 w-5" /> Local Awareness
            </h3>
            <p className="text-muted-foreground text-sm">See exactly what is being built in your ward and who the contractor is.</p>
          </div>
          <div className="border rounded-xl p-6 bg-slate-50">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
              <Activity className="text-emerald-600 h-5 w-5" /> Live Tracking
            </h3>
            <p className="text-muted-foreground text-sm">Follow timeline updates, budget expenditures, and project completion status.</p>
          </div>
          <div className="border rounded-xl p-6 bg-slate-50">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
              <ShieldAlert className="text-amber-600 h-5 w-5" /> Accountability
            </h3>
            <p className="text-muted-foreground text-sm">Report discrepancies, view delays, and hold authorities accountable for your tax money.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
