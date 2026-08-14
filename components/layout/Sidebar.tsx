"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileScan,
  Search,
  Sparkles,
  BookmarkCheck,
  Activity,
  HeartPulse
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Patient Records",
    href: "/patients",
    icon: Users,
  },
  {
    label: "Digitize Studio",
    href: "/upload",
    icon: FileScan,
    badge: "AI Powered",
  },
  {
    label: "Search History",
    href: "/prescriptions",
    icon: Search,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-900/60 hidden md:block min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        {/* Navigation links */}
        <div>
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Main Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 group",
                    isActive
                      ? "bg-slate-800/90 text-cyan-400 border border-slate-700/80 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-cyan-400"
                          : "text-slate-500 group-hover:text-slate-300"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-800/50">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Phase Features & Health Insights badge */}
        <div className="pt-4 border-t border-slate-800/60">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Platform Capabilities
          </p>
          <div className="rounded-xl glass-card p-3 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <Sparkles className="h-4 w-4 text-teal-400" />
              <span>Smart OCR Engine</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tesseract OCR + Gemini 1.5 Flash structured correction for zero missed meds.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-cyan-300">
              <HeartPulse className="h-3.5 w-3.5 text-cyan-400" />
              <span>Phase 3 Health Warnings active</span>
            </div>
          </div>
        </div>

        {/* Quick Help footer */}
        <div className="rounded-xl bg-gradient-to-b from-sky-950/40 to-slate-900 border border-sky-900/30 p-3.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-sky-400 font-medium mb-1">
            <BookmarkCheck className="h-4 w-4" />
            <span>Doctor Authority</span>
          </div>
          <p className="text-[11px] text-slate-400">
            All AI extractions require doctor verification before saving to database.
          </p>
        </div>
      </div>
    </aside>
  );
}
