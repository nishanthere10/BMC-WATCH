"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function WardRankingTable({ data }: { data: any[] }) {
  return (
    <div className="relative w-full overflow-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-400 uppercase bg-slate-50/50">
          <tr>
            <th className="px-4 py-3 font-black">Ward</th>
            <th className="px-4 py-3 font-black">Progress</th>
            <th className="px-4 py-3 font-black">Reports</th>
            <th className="px-4 py-3 font-black">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr key={row.ward} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-4 py-4">
                <div className="font-bold text-slate-900">{row.ward}</div>
                <div className="text-[10px] text-slate-400">Zone {row.zone}</div>
              </td>
              <td className="px-4 py-4 w-40">
                <div className="flex items-center gap-2">
                  <Progress value={row.avg_progress} className="h-1.5 flex-1" />
                  <span className="text-[10px] font-bold">{row.avg_progress}%</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant="outline" className="font-black bg-slate-50">
                  {row.citizen_reports}
                </Badge>
              </td>
              <td className="px-4 py-4">
                {row.delayed_projects > 3 ? (
                  <Badge className="bg-red-100 text-red-700 border-red-200 uppercase text-[10px]">Critical</Badge>
                ) : (
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 uppercase text-[10px]">Stable</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}