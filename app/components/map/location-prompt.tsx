"use client";

import { useState } from "react";
import { MapPin, Locate, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const RADIUS_OPTIONS = [5, 10, 20] as const;

interface LocationPromptProps {
  userLocation: { lat: number; lon: number } | null;
  radius: number;
  onLocationFound: (lat: number, lon: number) => void;
  onRadiusChange: (km: number) => void;
  onShowAll: () => void;
  showAll: boolean;
  nearbyCount: number;
}

export default function LocationPrompt({
  userLocation,
  radius,
  onLocationFound,
  onRadiusChange,
  onShowAll,
  showAll,
  nearbyCount,
}: LocationPromptProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationFound(pos.coords.latitude, pos.coords.longitude);
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === 1
            ? "Location access denied. Please enable location in browser settings."
            : "Unable to determine your location. Try again."
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="mb-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 md:p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-[#0055A4]/10 dark:bg-[#38BDF8]/10 flex items-center justify-center">
            <MapPin size={20} className="text-[#0055A4] dark:text-[#38BDF8]" />
          </div>
          <div>
            {userLocation ? (
              <>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  Showing {showAll ? "all" : nearbyCount} projects
                  {!showAll && <span className="text-slate-500 font-medium"> within {radius} km</span>}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {userLocation.lat.toFixed(4)}°N, {userLocation.lon.toFixed(4)}°E
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  Share your location
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  See only nearby road works on the map
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right side */}
        {!userLocation ? (
          <button
            onClick={requestLocation}
            disabled={loading}
            className="cr-btn-primary text-sm shrink-0"
          >
            <Locate size={15} className={loading ? "animate-spin" : ""} />
            {loading ? "Locating…" : "Share Location"}
          </button>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap">
            {RADIUS_OPTIONS.map((km) => (
              <button
                key={km}
                onClick={() => onRadiusChange(km)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all duration-150",
                  !showAll && radius === km
                    ? "bg-[#0055A4] dark:bg-[#38BDF8] text-white border-[#0055A4] dark:border-[#38BDF8]"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0055A4] dark:hover:border-[#38BDF8]"
                )}
              >
                {km} km
              </button>
            ))}
            <button
              onClick={onShowAll}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all duration-150",
                showAll
                  ? "bg-[#0055A4] dark:bg-[#38BDF8] text-white border-[#0055A4] dark:border-[#38BDF8]"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0055A4] dark:hover:border-[#38BDF8]"
              )}
            >
              All
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
          <AlertCircle size={13} /> {error}
        </div>
      )}
    </div>
  );
}
