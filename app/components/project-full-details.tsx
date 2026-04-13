"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  ChevronDown,
  Tag,
  MapPin,
  HardHat,
  IndianRupee,
  Ruler,
  Calendar,
  ShieldCheck,
  FileText,
  ExternalLink,
  Phone,
} from "lucide-react";
import type { Project } from "@/types/project";

function formatINR(amount: number | null | undefined): string {
  if (amount == null) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function fmtDate(dateStr: string | null | undefined): string {
  if (!dateStr || dateStr === "Invalid date") return "";
  try {
    return format(new Date(dateStr), "dd MMM yyyy");
  } catch {
    return dateStr;
  }
}

/** A single row in a detail group */
function DetailRow({ label, value, href }: { label: string; value: string; href?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
      <dt className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 sm:w-40">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#0055A4] dark:text-[#38BDF8] hover:underline inline-flex items-center gap-1">
            {value} <ExternalLink size={11} />
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function PhoneRow({ label, name, phone }: { label: string; name?: string | null; phone?: string | null }) {
  if (!name) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
      <dt className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 sm:w-40">
        {label}
      </dt>
      <dd className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {name}
        {phone && (
          <a href={`tel:${phone}`} className="ml-2 inline-flex items-center gap-1 text-xs text-[#0055A4] dark:text-[#38BDF8] hover:underline font-mono">
            <Phone size={10} /> {phone}
          </a>
        )}
      </dd>
    </div>
  );
}

interface DetailGroupProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function DetailGroup({ icon, title, children }: DetailGroupProps) {
  // Only render if at least one child is not null
  const hasContent = Array.isArray(children)
    ? children.some((c) => c != null)
    : children != null;
  if (!hasContent) return null;

  return (
    <div className="space-y-1">
      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0055A4] dark:text-[#38BDF8] mb-2 pt-4 first:pt-0">
        {icon} {title}
      </h4>
      <dl>{children}</dl>
    </div>
  );
}

export default function ProjectFullDetails({ project }: { project: Project }) {
  const [isOpen, setIsOpen] = useState(false);

  const p = project;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-[#0055A4] dark:text-[#38BDF8] hover:bg-[#0055A4]/5 dark:hover:bg-[#38BDF8]/5 rounded-xl transition-colors"
      >
        {isOpen ? "Hide Full Details" : "View Full Project Details"}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-2 divide-y divide-slate-100 dark:divide-slate-800/30">
              {/* Identity & Classification */}
              <DetailGroup icon={<Tag size={13} />} title="Identity & Classification">
                <DetailRow label="Work Code" value={p.work_code || ""} />
                <DetailRow label="Type" value={p.type || ""} />
                <DetailRow label="Subtype" value={p.subtype || ""} />
                <DetailRow label="Data Source" value={p.data_source || ""} />
              </DetailGroup>

              {/* Location & Jurisdiction */}
              <DetailGroup icon={<MapPin size={13} />} title="Location & Jurisdiction">
                <DetailRow label="Location" value={p.location || ""} />
                <DetailRow label="Ward" value={p.ward || ""} />
                <DetailRow label="Zone" value={p.zone || ""} />
                {p.latitude && p.longitude && (
                  <DetailRow
                    label="Coordinates"
                    value={`${p.latitude.toFixed(5)}, ${p.longitude.toFixed(5)}`}
                    href={`https://www.google.com/maps?q=${p.latitude},${p.longitude}`}
                  />
                )}
              </DetailGroup>

              {/* Contractor & Personnel */}
              <DetailGroup icon={<HardHat size={13} />} title="Contractor & Personnel">
                <DetailRow label="Contractor" value={p.contractor || ""} />
                <PhoneRow label="Contractor Rep" name={p.contractor_rep} phone={p.contractor_rep_mobile} />
                <PhoneRow label="QMA Rep" name={p.qma_rep} phone={p.qma_rep_mobile} />
              </DetailGroup>

              {/* Budget & Dimensions */}
              <DetailGroup icon={<IndianRupee size={13} />} title="Budget & Dimensions">
                <DetailRow label="Sanctioned Budget" value={p.sanctioned_budget_display || (p.sanctioned_budget ? formatINR(p.sanctioned_budget) : "")} />
                <DetailRow label="Spent Budget" value={p.spent_budget ? formatINR(p.spent_budget) : ""} />
                <DetailRow label="Budget Note" value={p.budget_note || ""} />
                <DetailRow label="Area" value={p.area_sqm ? `${p.area_sqm} sq.m` : ""} />
                <DetailRow label="Length" value={p.length_meters ? `${p.length_meters} m` : ""} />
                <DetailRow label="Width" value={p.width_meters ? `${p.width_meters} m` : ""} />
              </DetailGroup>

              {/* Timeline & Schedules */}
              <DetailGroup icon={<Calendar size={13} />} title="Timeline & Schedules">
                <DetailRow label="Start Date" value={fmtDate(p.start_date)} />
                <DetailRow label="Expected End" value={fmtDate(p.expected_end)} />
                <DetailRow label="Excavation" value={
                  [fmtDate(p.excavation_start), fmtDate(p.excavation_end)].filter(Boolean).join(" → ") || ""
                } />
                <DetailRow label="SWD" value={
                  [fmtDate(p.swd_start), fmtDate(p.swd_end)].filter(Boolean).join(" → ") || ""
                } />
                <DetailRow label="PQC" value={
                  [fmtDate(p.pqc_start), fmtDate(p.pqc_end)].filter(Boolean).join(" → ") || ""
                } />
                <DetailRow label="Duct Laying" value={
                  [fmtDate(p.duct_laying_start), fmtDate(p.duct_laying_end)].filter(Boolean).join(" → ") || ""
                } />
                <DetailRow label="PQC Completed" value={fmtDate(p.completion_date_pqc)} />
              </DetailGroup>

              {/* Approvals & NOCs */}
              <DetailGroup icon={<ShieldCheck size={13} />} title="Approvals & NOCs">
                <DetailRow label="Traffic NOC Applied" value={fmtDate(p.traffic_noc_applied)} />
                <DetailRow label="Traffic NOC Received" value={fmtDate(p.traffic_noc_received)} />
                <DetailRow label="PQC Status" value={p.pqc_status || ""} />
                <DetailRow label="Phase 2" value={p.is_phase2 != null ? (p.is_phase2 ? "Yes" : "No") : ""} />
              </DetailGroup>

              {/* Quarterly Deadlines */}
              {p.quarter_deadlines && (
                <DetailGroup icon={<Calendar size={13} />} title="Quarterly Deadlines">
                  {Object.entries(p.quarter_deadlines).map(([q, date]) => (
                    <DetailRow key={q} label={q.toUpperCase()} value={fmtDate(date)} />
                  ))}
                </DetailGroup>
              )}

              {/* Notes */}
              {p.remarks && (
                <DetailGroup icon={<FileText size={13} />} title="Notes & Remarks">
                  <div className="py-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{p.remarks}&rdquo;
                  </div>
                </DetailGroup>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
