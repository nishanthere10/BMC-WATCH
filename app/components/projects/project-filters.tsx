"use client";

import { Search, Filter } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ProjectFiltersProps {
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function ProjectFilters({
  onSearchChange,
  onTypeChange,
  onStatusChange,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card p-4 rounded-xl border shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search by project name or ward..."
          className="pl-10 h-11"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select onValueChange={onTypeChange}>
          <SelectTrigger className="w-[160px] h-11">
            <SelectValue placeholder="Project Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Road Work">Road Work</SelectItem>
            <SelectItem value="Drain Work">Drain Work</SelectItem>
            <SelectItem value="Water Line Repair">Water Line Repair</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px] h-11">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Delayed">Delayed</SelectItem>
            <SelectItem value="Planned">Planned</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}