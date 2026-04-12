"use client";

import { Search, Filter, Calendar } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function DashboardFilters() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search projects by name or work code..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Select defaultValue="all-wards">
          <SelectTrigger className="w-full md:w-[160px] rounded-2xl bg-white/50 border-white/60 font-semibold text-xs">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-blue-500" />
              <SelectValue placeholder="Ward" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-2xl">
            <SelectItem value="all-wards">All Wards</SelectItem>
            <SelectItem value="h-west">H-West</SelectItem>
            <SelectItem value="g-north">G-North</SelectItem>
            <SelectItem value="k-east">K-East</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="7d">
          <SelectTrigger className="w-full md:w-[160px] rounded-2xl bg-white/50 border-white/60 font-semibold text-xs">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-blue-500" />
              <SelectValue placeholder="Timeframe" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none shadow-2xl">
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}