"use client";

import { useState } from "react";
import Link from "next/link";
import { Prescription } from "@/types";
import { updateDoctorNotesAction, togglePrescriptionImportantAction } from "@/actions/prescription-actions";
import { PDFExportButton } from "@/components/prescription/PDFExportButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  FileText,
  User,
  Phone,
  Calendar,
  Star,
  Pill,
  Save,
  CheckCircle2,
  AlertCircle,
  Tag,
  Eye,
  FileCode,
  Sparkles
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface PrescriptionDetailViewProps {
  prescription: Prescription;
}

export function PrescriptionDetailView({ prescription: initialRx }: PrescriptionDetailViewProps) {
  const [prescription, setPrescription] = useState<Prescription>(initialRx);
  const [doctorNotes, setDoctorNotes] = useState(initialRx.doctorNotes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<"structured" | "raw">("structured");

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const updated = await updateDoctorNotesAction(prescription.id, doctorNotes);
      if (updated) {
        setPrescription(updated);
        toast.success("Doctor notes updated!");
      }
    } catch (e) {
      toast.error("Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleToggleImportant = async () => {
    try {
      const newStatus = await togglePrescriptionImportantAction(prescription.id);
      setPrescription((prev) => ({ ...prev, important: newStatus }));
      toast.success(newStatus ? "Marked as ⭐ Important" : "Unmarked from Important");
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <FileText className="h-4 w-4" />
            <span>Prescription Record Details</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {prescription.patientName || "Patient Record"}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Digitized on {formatDate(prescription.createdAt)} • OCR Confidence Grade:{" "}
            <strong className="text-cyan-300">{prescription.confidenceScore || "Good"}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleImportant}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              prescription.important
                ? "bg-amber-950/80 border-amber-500/80 text-amber-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
          >
            <Star className={`h-4 w-4 ${prescription.important ? "fill-amber-400 text-amber-400" : ""}`} />
            <span>{prescription.important ? "⭐ Pinned Important" : "Mark Important"}</span>
          </button>

          <PDFExportButton prescription={prescription} elementIdToExport="prescription-export-container" />
        </div>
      </div>

      {/* Grid: Left Image Viewer, Right Details & PDF Export Printable Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Original Scan */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="glass-card border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  Prescription Image Scan
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Original Document
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
                <img
                  src={prescription.imageUrl}
                  alt="Original Doctor Prescription"
                  className="max-h-[500px] w-full object-contain rounded-lg shadow-xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Structured Medical Output & PDF Container */}
        <div className="lg:col-span-7 space-y-4">
          <div id="prescription-export-container" className="space-y-4">
            <Card className="glass-card border-slate-800">
              <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    AI Structured Medical Intelligence
                  </CardTitle>
                  <CardDescription>
                    Refined by Google Gemini Flash • Verified by Doctor
                  </CardDescription>
                </div>

                <div className="flex gap-1 text-xs">
                  <button
                    onClick={() => setActiveTab("structured")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === "structured"
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Structured Output
                  </button>
                  <button
                    onClick={() => setActiveTab("raw")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      activeTab === "raw"
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Raw OCR
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                {activeTab === "structured" ? (
                  <>
                    {/* Patient Bio Summary */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white text-sm">{prescription.patientName}</p>
                        <p className="text-slate-400 mt-0.5">{prescription.patientPhone}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-slate-500 block">Date Digitized</span>
                        <span className="text-slate-300 font-medium">{formatDate(prescription.createdAt)}</span>
                      </div>
                    </div>

                    {/* Prescribed Medicines (Phase 2 Badges) */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Pill className="h-4 w-4 text-cyan-400" />
                        <span>Prescribed Medicines ({prescription.medicinesJson?.length || 0})</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {prescription.medicinesJson?.map((med, idx) => {
                          const isUncertain = med.isUncertain || med.name.toLowerCase().startsWith("possibly");
                          return (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border text-xs ${
                                isUncertain
                                  ? "bg-amber-950/50 border-amber-800/80 text-amber-200"
                                  : "bg-slate-950 border-slate-800 text-slate-200"
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold text-sm text-white">
                                <span className="flex items-center gap-1.5">
                                  {isUncertain && <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />}
                                  {med.name}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                Dosage: <strong className="text-cyan-300">{med.dosage}</strong> • Frequency: <strong className="text-cyan-300">{med.frequency}</strong>
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* AI Summary */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Clinical AI Summary
                      </h4>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                        {prescription.aiSummary}
                      </div>
                    </div>

                    {/* Corrected Prescription Text */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Cleaned Prescription Text
                      </h4>
                      <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-100/90 whitespace-pre-wrap leading-relaxed">
                        {prescription.correctedText}
                      </pre>
                    </div>

                    {/* Important Findings */}
                    {prescription.importantFindings && prescription.importantFindings.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                          Key Clinical Findings
                        </h4>
                        <ul className="space-y-1">
                          {prescription.importantFindings.map((finding, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                              <CheckCircle2 className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Prescription Tags
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {prescription.tags?.map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-sky-950 border border-sky-800/60 text-xs text-cyan-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Raw Tesseract OCR Text Output
                    </h4>
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {prescription.rawOcr}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Doctor Notes Live Editor */}
            <Card className="glass-card border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-400" />
                  Doctor Personal Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <textarea
                  rows={3}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Add private clinical notes e.g., Follow-up in 5 days, observe fever..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="bg-cyan-600 hover:bg-cyan-500 text-xs gap-1.5"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{isSavingNotes ? "Saving..." : "Save Doctor Notes"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
