"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Prescription } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { togglePrescriptionImportantAction } from "@/actions/prescription-actions";
import { Star, Calendar, User, Pill, Tag, FileText, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface PrescriptionCardProps {
  prescription: Prescription;
}

export function PrescriptionCard({ prescription: initialRx }: PrescriptionCardProps) {
  const [prescription, setPrescription] = useState<Prescription>(initialRx);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleImportant = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToggling(true);
    try {
      const newStatus = await togglePrescriptionImportantAction(prescription.id);
      setPrescription(prev => ({ ...prev, important: newStatus }));
      toast.success(newStatus ? "Marked as ⭐ Important" : "Unmarked from Important");
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setIsToggling(false);
    }
  };

  const confidenceVariant =
    prescription.confidenceScore === "Excellent"
      ? "emerald"
      : prescription.confidenceScore === "Good"
      ? "default"
      : "amber";

  return (
    <Card className="glass-card-hover border-slate-800 relative group overflow-hidden">
      {/* Important Banner */}
      {prescription.important && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1 flex items-center justify-between text-[11px] text-amber-300 font-semibold">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ⭐ Important Record (Pinned)
          </span>
          <span className="text-[10px] text-amber-400/80">Priority History</span>
        </div>
      )}

      <CardContent className="p-5 space-y-4">
        {/* Header row: Patient details & star button */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
              <img
                src={prescription.imageUrl}
                alt="Prescription Scan"
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <Link href={`/patients/${prescription.patientId}`} className="hover:underline">
                <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                  <span>{prescription.patientName || "Patient Record"}</span>
                </h3>
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 inline text-slate-500" />
                  {formatDate(prescription.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={confidenceVariant} className="text-[10px]">
              OCR: {prescription.confidenceScore || "Good"}
            </Badge>

            <button
              onClick={handleToggleImportant}
              disabled={isToggling}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title={prescription.important ? "Unstar record" : "Mark as Important"}
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  prescription.important ? "fill-amber-400 text-amber-400" : "text-slate-500 hover:text-amber-300"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Medicines badges (Phase 2 Smart Medicine Recognition) */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Pill className="h-3.5 w-3.5 text-cyan-400" />
            <span>Prescribed Medicines ({prescription.medicinesJson?.length || 0})</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {prescription.medicinesJson?.map((med, idx) => {
              const isUncertain = med.isUncertain || med.name.toLowerCase().startsWith("possibly");
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    isUncertain
                      ? "bg-amber-950/60 border-amber-800/80 text-amber-300"
                      : "bg-slate-800/90 border-slate-700 text-cyan-300"
                  }`}
                >
                  {isUncertain && <AlertCircle className="h-3 w-3 text-amber-400" />}
                  <span>{med.name}</span>
                  <span className="text-[10px] text-slate-400">({med.dosage})</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* AI Summary */}
        <p className="text-xs text-slate-300 line-clamp-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
          {prescription.aiSummary}
        </p>

        {/* Tags */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-1">
            {prescription.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700/60"
              >
                #{tag}
              </span>
            ))}
          </div>

          <Link href={`/prescriptions/${prescription.id}`}>
            <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-slate-800">
              <span>View Full Details</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
