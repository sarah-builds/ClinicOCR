"use client";

import { useState, useEffect } from "react";
import { Prescription } from "@/types";
import { getPrescriptionsAction } from "@/actions/prescription-actions";
import { PrescriptionCard } from "@/components/prescription/PrescriptionCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Search, Filter, Star, Loader2, FileText, Pill, Tag } from "lucide-react";
import { toast } from "sonner";

const TAG_FILTERS = ["All", "Fever", "Antibiotic", "Cold", "Respiratory", "Gastro", "Acid Relief"];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [importantOnly, setImportantOnly] = useState(false);

  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce text search by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Query database when debounced query, tag filter, or important flag changes
  useEffect(() => {
    let isMounted = true;
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await getPrescriptionsAction(debouncedQuery, selectedTag, importantOnly);
        if (isMounted) {
          setPrescriptions(data);
        }
      } catch (e) {
        if (isMounted) {
          toast.error("Failed to search prescriptions");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrescriptions();
    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, selectedTag, importantOnly]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
            <Search className="h-4 w-4" />
            <span>Searchable Archives</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Search Prescriptions & Medicines
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Phase 2 Search: Filter by patient name, phone number, medicine name, tags, or prescription date.
          </p>
        </div>

        <button
          onClick={() => setImportantOnly(!importantOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            importantOnly
              ? "bg-amber-950/80 border-amber-500/80 text-amber-300 shadow-md shadow-amber-950"
              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Star className={`h-4 w-4 ${importantOnly ? "fill-amber-400 text-amber-400" : ""}`} />
          <span>⭐ Important Records Only</span>
        </button>
      </div>

      {/* Search Input & Tags Bar */}
      <div className="space-y-3">
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search patient, phone (+1...), medicine name (e.g. Paracetamol), or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900 border-slate-800 text-xs h-11 shadow-inner"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-semibold text-[11px] mr-1">
            <Tag className="h-3.5 w-3.5 text-cyan-400" />
            Filter Tags:
          </span>
          {TAG_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedTag === t
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Prescription Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
          <p className="text-xs">Searching prescription archives...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="p-12 glass-card rounded-2xl text-center text-slate-400 space-y-3">
          <FileText className="h-10 w-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold">No prescription records found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prescriptions.map((rx) => (
            <PrescriptionCard key={rx.id} prescription={rx} />
          ))}
        </div>
      )}
    </div>
  );
}
