"use client";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Clock, 
  AlertTriangle, 
  Droplets, 
  Trash2, 
  Construction 
} from "lucide-react";

interface IssueTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const issueTypes = [
  { value: "Delay", label: "Project Delay", icon: Clock, color: "text-blue-500" },
  { value: "Poor Quality", label: "Poor Quality Work", icon: Construction, color: "text-amber-500" },
  { value: "Safety Hazard", label: "Safety Hazard", icon: AlertTriangle, color: "text-red-500" },
  { value: "Waterlogging Risk", label: "Waterlogging Risk", icon: Droplets, color: "text-cyan-500" },
  { value: "Garbage / Debris", label: "Garbage / Debris", icon: Trash2, color: "text-slate-500" },
];

export default function IssueTypeSelect({ value, onChange, error }: IssueTypeSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
        What is the issue?
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 w-full bg-white border-slate-200">
          <SelectValue placeholder="Select issue type" />
        </SelectTrigger>
        <SelectContent>
          {issueTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex items-center gap-3">
                <type.icon size={18} className={type.color} />
                <span className="font-medium">{type.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}