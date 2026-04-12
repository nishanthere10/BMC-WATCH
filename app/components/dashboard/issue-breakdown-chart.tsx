"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

// Professional color palette for civic issues
const COLORS = [
  "#ef4444", // Red (Safety)
  "#f59e0b", // Amber (Quality)
  "#3b82f6", // Blue (Delay)
  "#8b5cf6", // Violet (Debris)
  "#64748b", // Slate (Others)
];

interface IssueBreakdownChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export default function IssueBreakdownChart({ data }: IssueBreakdownChartProps) {
  // If no data is present yet, show a clean empty state
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl border-slate-100 bg-slate-50/50">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          No Audit Data Available
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical" // Makes it a horizontal bar chart
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            horizontal={true} 
            vertical={false} 
            stroke="#f1f5f9" 
          />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 11, 
              fontWeight: 700, 
              fill: "#475569",
              width: 100 
            }}
            width={100}
          />
          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{ 
              borderRadius: "12px", 
              border: "none", 
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              fontSize: "12px",
              fontWeight: "600"
            }}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]} 
            barSize={20}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}