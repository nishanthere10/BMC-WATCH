"use client";

import { useTranslations } from "@/app/components/I18nProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { locale, setLocale } = useTranslations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 bg-white dark:bg-[#0D1424] border-2 border-slate-200 dark:border-slate-700 rounded-xl transition-colors duration-150 shadow-[2px_2px_0_0_rgba(0,0,0,0.04)] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center h-[38px] w-[38px]"
          aria-label="Toggle language"
        >
          <Languages size={18} />
          <span className="sr-only">Toggle language</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-slate-800 shadow-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl min-w-[120px]">
        <DropdownMenuItem 
          onClick={() => setLocale("en")}
          className={cn("cursor-pointer font-medium py-2", locale === "en" && "text-[#0055A4] dark:text-[#38BDF8] bg-slate-50 dark:bg-slate-800/50")}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLocale("mr")}
          className={cn("cursor-pointer font-medium py-2", locale === "mr" && "text-[#0055A4] dark:text-[#38BDF8] bg-slate-50 dark:bg-slate-800/50")}
        >
          मराठी
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLocale("hi")}
          className={cn("cursor-pointer font-medium py-2", locale === "hi" && "text-[#0055A4] dark:text-[#38BDF8] bg-slate-50 dark:bg-slate-800/50")}
        >
          हिंदी
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
