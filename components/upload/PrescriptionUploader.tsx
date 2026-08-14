"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Patient, Medicine, ImageQualityCheck } from "@/types";
import { getPatientsAction } from "@/actions/patient-actions";
import { processUploadOCRAndGeminiAction, savePrescriptionAction } from "@/actions/prescription-actions";
import { PatientModal } from "@/components/patient/PatientModal";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  Upload,
  User,
  Plus,
  Sparkles,
  FileScan,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Edit3,
  Star,
  Save,
  Pill,
  ShieldCheck,
  RotateCw,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

// Preset sample prescription images for instant testing
const SAMPLE_PRESETS = [
  {
    name: "Prescription 1: Fever & Antibiotic",
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
  },
  {
    name: "Prescription 2: Acidity & GERD",
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
  },
];

export function PrescriptionUploader() {
  const router = useRouter();

  // Patients state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // Upload & Process state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>("");

  // Quality & OCR Results
  const [qualityCheck, setQualityCheck] = useState<ImageQualityCheck | null>(null);
  const [rawOcr, setRawOcr] = useState<string>("");
  const [ocrConfidence, setOcrConfidence] = useState<"Excellent" | "Good" | "Needs Review">("Good");

  // Editable Doctor State
  const [correctedText, setCorrectedText] = useState<string>("");
  const [aiSummary, setAiSummary] = useState<string>("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [importantFindings, setImportantFindings] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [doctorNotes, setDoctorNotes] = useState<string>("");
  const [isImportant, setIsImportant] = useState<boolean>(false);

  // New Medicine input form state
  const [newMedName, setNewMedName] = useState("");
  const [newMedDosage, setNewMedDosage] = useState("");
  const [newMedFreq, setNewMedFreq] = useState("");

  // Active view tab in review mode
  const [activeTab, setActiveTab] = useState<"corrected" | "raw" | "medicines">("corrected");

  // Load patients on mount
  useEffect(() => {
    getPatientsAction().then((res) => {
      setPatients(res);
      if (res.length > 0) setSelectedPatientId(res[0].id);
    });
  }, []);

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load sample preset
  const handleSelectPreset = (url: string) => {
    setImagePreview(url);
  };

  // Run OCR + Gemini pipeline
  const handleStartAnalysis = async () => {
    if (!imagePreview) {
      toast.error("Please upload or select a prescription image first.");
      return;
    }
    if (!selectedPatientId) {
      toast.error("Please select a patient to associate with this prescription.");
      return;
    }

    setIsProcessing(true);
    setProcessingStep("Analyzing image quality & pre-processing...");

    try {
      setProcessingStep("Running Tesseract OCR text extraction...");
      const result = await processUploadOCRAndGeminiAction(imagePreview);

      setProcessingStep("Refining text with Google Gemini Flash...");
      setQualityCheck(result.qualityCheck);
      setRawOcr(result.rawOcr);
      setOcrConfidence(result.confidenceScore);
      setCorrectedText(result.correctedText);
      setAiSummary(result.aiSummary);
      setMedicines(result.medicinesJson || []);
      setImportantFindings(result.importantFindings || []);
      setTags(result.tags || ["Prescription"]);
      setDoctorNotes("Follow-up as required.");

      toast.success("AI Digitization complete! Ready for Doctor review.");
    } catch (err) {
      console.error(err);
      toast.error("Error processing prescription image.");
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  // Add medicine handler
  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    setMedicines((prev) => [
      ...prev,
      {
        name: newMedName.trim(),
        dosage: newMedDosage.trim() || "As directed",
        frequency: newMedFreq.trim() || "1-0-1",
      },
    ]);
    setNewMedName("");
    setNewMedDosage("");
    setNewMedFreq("");
  };

  // Remove medicine handler
  const handleRemoveMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  // Save record to DB
  const handleSaveRecord = async () => {
    if (!selectedPatientId) return;

    try {
      const saved = await savePrescriptionAction({
        patientId: selectedPatientId,
        imageUrl: imagePreview || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
        rawOcr,
        correctedText,
        aiSummary,
        medicinesJson: medicines,
        importantFindings,
        doctorNotes,
        tags,
        important: isImportant,
        confidenceScore: ocrConfidence,
      });

      toast.success("Prescription saved to patient profile!");
      router.push(`/patients/${selectedPatientId}`);
    } catch (err) {
      toast.error("Failed to save prescription record.");
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Patient Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={(newP) => {
          setPatients((prev) => [newP, ...prev]);
          setSelectedPatientId(newP.id);
        }}
      />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
            <Sparkles className="h-4 w-4" />
            <span>AI Digitization Studio</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Upload & Convert Prescription
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload handwritten doctor prescription scans. Tesseract OCR & Gemini AI extract structured medicines & summaries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Patient Selector */}
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 p-2 rounded-xl">
            <User className="h-4 w-4 text-cyan-400 ml-1" />
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none pr-4"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-100">
                  {p.name} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsPatientModalOpen(true)}
            className="gap-1.5 border-slate-700 hover:border-cyan-500 text-xs"
          >
            <Plus className="h-4 w-4 text-cyan-400" />
            <span>New Patient</span>
          </Button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Smart Quality Check */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="glass-card border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-cyan-400" />
                  Prescription Scan
                </span>
                {qualityCheck && (
                  <Badge
                    variant={
                      qualityCheck.qualityGrade === "Excellent"
                        ? "emerald"
                        : qualityCheck.qualityGrade === "Good"
                        ? "default"
                        : "amber"
                    }
                    className="text-[10px]"
                  >
                    Quality: {qualityCheck.qualityGrade}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Select or upload a clear handwritten prescription image
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Dropzone area */}
              <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500/80 rounded-2xl p-4 text-center transition-colors bg-slate-950/50 group">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {imagePreview ? (
                  <div className="relative h-64 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img
                      src={imagePreview}
                      alt="Uploaded Prescription"
                      className="object-contain w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white pointer-events-none">
                      Click or drag to replace image
                    </div>
                  </div>
                ) : (
                  <div className="py-8 space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mx-auto">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200">
                        Drag & Drop prescription image
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports JPG, JPEG, PNG (Up to 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Presets picker */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Or Test Sample Prescription Presets:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(preset.url)}
                      className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-cyan-500 text-left text-xs text-slate-300 transition-colors"
                    >
                      <span className="font-semibold block truncate text-cyan-300">{preset.name}</span>
                      <span className="text-[10px] text-slate-400">Sample #{idx + 1}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Analysis Warnings (Phase 2 Smart Image Check) */}
              {qualityCheck && (
                <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-cyan-400" />
                      Smart Image Quality Metrics
                    </span>
                    <span className="text-slate-400 text-[11px]">Blur Score: {qualityCheck.blurScore}/100</span>
                  </div>

                  {qualityCheck.warnings.length > 0 ? (
                    <div className="space-y-1">
                      {qualityCheck.warnings.map((w, i) => (
                        <p key={i} className="text-amber-400 text-[11px] flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span>{w}</span>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-400 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Optimal image contrast & clarity for OCR extraction.</span>
                    </p>
                  )}
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={handleStartAnalysis}
                disabled={isProcessing || !imagePreview}
                className="w-full h-11 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-sm font-semibold shadow-lg shadow-cyan-900/30 gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{processingStep}</span>
                  </>
                ) : (
                  <>
                    <FileScan className="h-4 w-4" />
                    <span>Analyze & Extract Digital Data</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Doctor Review & Verification Studio */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="glass-card border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-cyan-400" />
                  Doctor Verification & Editor
                </CardTitle>
                <CardDescription>
                  Review AI extracted details. You have full authority to modify before saving.
                </CardDescription>
              </div>

              {rawOcr && (
                <Badge variant={ocrConfidence === "Excellent" ? "emerald" : "default"} className="text-[10px]">
                  OCR Confidence: {ocrConfidence}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-5 space-y-5">
              {!correctedText && !isProcessing && (
                <div className="py-16 text-center text-slate-500 space-y-3">
                  <FileScan className="h-12 w-12 text-slate-600 mx-auto" />
                  <p className="text-sm">
                    No prescription analyzed yet. Select a patient and image on the left, then click <strong>Analyze & Extract</strong>.
                  </p>
                </div>
              )}

              {isProcessing && (
                <div className="py-16 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-200">{processingStep}</p>
                  <p className="text-xs text-slate-400">Preprocessing image • Tesseract OCR • Gemini Flash structured extraction</p>
                </div>
              )}

              {correctedText && !isProcessing && (
                <>
                  {/* Tab Navigation */}
                  <div className="flex border-b border-slate-800 text-xs font-semibold">
                    <button
                      onClick={() => setActiveTab("corrected")}
                      className={`px-4 py-2 border-b-2 transition-colors ${
                        activeTab === "corrected"
                          ? "border-cyan-400 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Corrected Text & Summary
                    </button>
                    <button
                      onClick={() => setActiveTab("medicines")}
                      className={`px-4 py-2 border-b-2 transition-colors ${
                        activeTab === "medicines"
                          ? "border-cyan-400 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Medicines ({medicines.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("raw")}
                      className={`px-4 py-2 border-b-2 transition-colors ${
                        activeTab === "raw"
                          ? "border-cyan-400 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Original Raw OCR
                    </button>
                  </div>

                  {/* Tab 1: Corrected Text & AI Summary */}
                  {activeTab === "corrected" && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Corrected Prescription Text
                        </label>
                        <textarea
                          rows={4}
                          value={correctedText}
                          onChange={(e) => setCorrectedText(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          AI Medical Summary
                        </label>
                        <Input
                          value={aiSummary}
                          onChange={(e) => setAiSummary(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Doctor Notes & Follow-up Instructions
                        </label>
                        <Input
                          value={doctorNotes}
                          onChange={(e) => setDoctorNotes(e.target.value)}
                          placeholder="e.g. Follow-up after 5 days, observe fever trends"
                        />
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Medicines List (Phase 2 Smart Recognition) */}
                  {activeTab === "medicines" && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-300">
                          Extracted Medicines Badges
                        </label>

                        {medicines.map((med, idx) => {
                          const isUncertain = med.isUncertain || med.name.toLowerCase().startsWith("possibly");
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <Pill className="h-4 w-4 text-cyan-400 shrink-0" />
                                <div>
                                  <span className="font-bold text-white">{med.name}</span>
                                  {isUncertain && (
                                    <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] border border-amber-800/60">
                                      Possibly Uncertain
                                    </span>
                                  )}
                                  <p className="text-[11px] text-slate-400">
                                    Dosage: {med.dosage} • Frequency: {med.frequency}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveMedicine(idx)}
                                className="text-xs text-rose-400 hover:text-rose-300 p-1"
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Medicine form */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <p className="text-[11px] font-semibold text-slate-300">Add Medication</p>
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            placeholder="Med Name"
                            value={newMedName}
                            onChange={(e) => setNewMedName(e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Dosage (500mg)"
                            value={newMedDosage}
                            onChange={(e) => setNewMedDosage(e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Frequency (1-0-1)"
                            value={newMedFreq}
                            onChange={(e) => setNewMedFreq(e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleAddMedicine}
                          className="h-7 text-xs w-full mt-1 border-slate-700"
                        >
                          + Add Medicine Badge
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Raw OCR verbatim output */}
                  {activeTab === "raw" && (
                    <div className="space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span>Original Tesseract OCR Unfiltered Result:</span>
                        <Badge variant="secondary" className="text-[10px]">Verbatim Text</Badge>
                      </div>
                      <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {rawOcr}
                      </pre>
                    </div>
                  )}

                  {/* Options & Flags */}
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-semibold text-amber-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isImportant}
                        onChange={(e) => setIsImportant(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 h-4 w-4"
                      />
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>Mark as ⭐ Important Record</span>
                    </label>

                    <Button
                      onClick={handleSaveRecord}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2 px-6 shadow-lg shadow-emerald-900/30"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Structured Prescription</span>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
