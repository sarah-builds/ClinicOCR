"use server";

import {
  dbGetPrescriptions,
  dbGetPrescriptionById,
  dbGetPrescriptionsByPatientId,
  dbAddPrescription,
  dbTogglePrescriptionImportant,
  dbUpdateDoctorNotes,
  dbGetDashboardStats,
  dbSearchPrescriptions,
  dbGetPatientRxCounts,
} from "@/db";
import { Prescription, PatternInsight } from "@/types";
import { analyzePatientHistoryPatterns } from "@/lib/ocr/gemini";
import { analyzeImageQuality, preprocessImage } from "@/lib/ocr/preprocess";
import { runTesseractOCR } from "@/lib/ocr/tesseract";
import { refinePrescriptionWithGemini } from "@/lib/ocr/gemini";
import { revalidatePath } from "next/cache";

/**
 * Dashboard stats: aggregate COUNT queries + LIMIT 6 recent prescriptions.
 * No full table scan — returns only what the dashboard needs.
 */
export async function getDashboardStatsAction() {
  return dbGetDashboardStats();
}

/**
 * Prescription search: delegates filtering to PostgreSQL via ILIKE / JSONB @>
 * rather than fetching all rows and filtering in JavaScript.
 */
export async function getPrescriptionsAction(
  searchQuery?: string,
  tagFilter?: string,
  importantOnly?: boolean
): Promise<Prescription[]> {
  return dbSearchPrescriptions(searchQuery, tagFilter, importantOnly);
}

export async function getPrescriptionByIdAction(id: string): Promise<Prescription | null> {
  return dbGetPrescriptionById(id);
}

export async function getPrescriptionsByPatientIdAction(patientId: string): Promise<Prescription[]> {
  return dbGetPrescriptionsByPatientId(patientId);
}

/**
 * Per-patient prescription counts via GROUP BY — avoids loading all prescriptions
 * just to count them on the Patients list page.
 */
export async function getPatientRxCountsAction(): Promise<Record<string, number>> {
  return dbGetPatientRxCounts();
}

/**
 * Executes full AI pipeline:
 * 1. Image Quality Check
 * 2. Preprocessing (grayscale, contrast)
 * 3. Tesseract OCR → raw text & confidence grade
 * 4. Gemini AI → corrected text, medicines, summary, tags, findings
 */
export async function processUploadOCRAndGeminiAction(base64Image: string) {
  console.log("STEP 1: Server Action started");

  const qualityCheck = await analyzeImageQuality(base64Image);
  console.log("STEP 2: Image quality check completed");

  const enhancedImage = await preprocessImage(base64Image);
  console.log("STEP 3: Image preprocessing completed");

  const ocrResult = await runTesseractOCR(enhancedImage);
  console.log("STEP 4: Tesseract completed", {
    confidence: ocrResult.avgConfidence,
    textLength: ocrResult.rawText.length,
  });

  const geminiRefined = await refinePrescriptionWithGemini(ocrResult.rawText);
  console.log("STEP 5: Gemini completed");

  return {
    enhancedImage,
    qualityCheck,
    rawOcr: ocrResult.rawText,
    confidenceScore: ocrResult.confidenceScore,
    avgConfidence: ocrResult.avgConfidence,
    correctedText: geminiRefined.corrected_text,
    aiSummary: geminiRefined.summary,
    medicinesJson: geminiRefined.medicines,
    importantFindings: geminiRefined.important_findings,
    tags: geminiRefined.tags,
  };
}

export async function savePrescriptionAction(
  data: Omit<Prescription, "id" | "createdAt">
): Promise<Prescription> {
  const saved = await dbAddPrescription(data);
  revalidatePath("/");
  revalidatePath("/prescriptions");
  revalidatePath(`/patients/${data.patientId}`);
  return saved;
}

export async function togglePrescriptionImportantAction(id: string): Promise<boolean> {
  const result = await dbTogglePrescriptionImportant(id);
  revalidatePath("/");
  return result;
}

export async function updateDoctorNotesAction(id: string, notes: string): Promise<Prescription | null> {
  const updated = await dbUpdateDoctorNotes(id, notes);
  revalidatePath(`/prescriptions/${id}`);
  return updated;
}

/**
 * Phase 3: AI Health Pattern Analysis.
 * Called ONLY on explicit user request (button click) — never during page render.
 */
export async function getPatientPatternInsightsAction(patientId: string): Promise<PatternInsight | null> {
  const patientRxs = await getPrescriptionsByPatientIdAction(patientId);
  return analyzePatientHistoryPatterns(patientRxs);
}
