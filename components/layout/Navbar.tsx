"use client";

import Link from "next/link";
import { Stethoscope, Upload, Search, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand logo & tagline */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-600 to-teal-500 shadow-md shadow-cyan-900/40 group-hover:scale-105 transition-transform">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Clinic<span className="text-cyan-400">OCR</span>
              </span>
              <span className="hidden sm:inline-block ml-2 rounded bg-sky-950 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-sky-800/60">
                Phase 1 & 2 AI
              </span>
            </div>
          </Link>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-3">
          <Link href="/prescriptions">
            <Button variant="outline" size="sm" className="gap-2 text-slate-300 hidden md:flex">
              <Search className="h-4 w-4 text-cyan-400" />
              <span>Search Records</span>
            </Button>
          </Link>

          <Link href="/upload">
            <Button size="sm" className="gap-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 shadow-lg shadow-cyan-900/30">
              <Upload className="h-4 w-4" />
              <span>Digitize Prescription</span>
            </Button>
          </Link>

          {/* Active Doctor badge */}
          <div className="hidden lg:flex items-center gap-2 border-l border-slate-800 pl-4 ml-1">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
              DR
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">Dr. Sarah Jenkins</p>
              <p className="text-[10px] text-teal-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 inline" />
                Clinic Verified
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
