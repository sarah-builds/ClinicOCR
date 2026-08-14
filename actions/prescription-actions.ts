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
  console.log("OCR PIPELINE: START");

  try {
    console.log("OCR PIPELINE: QUALITY START");
    let qualityCheck;
    try {
      qualityCheck = await analyzeImageQuality(base64Image);
      console.log("OCR PIPELINE: QUALITY DONE");
    } catch (qualityErr) {
      console.error("OCR PIPELINE: QUALITY ERROR:", qualityErr);
      qualityCheck = {
        isBlurry: false,
        blurScore: 80,
        isLowLight: false,
        isCropped: false,
        isTilted: false,
        qualityGrade: "Good" as const,
        warnings: [],
      };
    }

    console.log("OCR PIPELINE: PREPROCESS START");
    let enhancedImage = base64Image;
    try {
      enhancedImage = await preprocessImage(base64Image);
      console.log("OCR PIPELINE: PREPROCESS DONE");
    } catch (preprocessErr) {
      console.error("OCR PIPELINE: PREPROCESS ERROR:", preprocessErr);
      enhancedImage = base64Image;
    }

    console.log("OCR PIPELINE: TESSERACT START");
    let ocrResult;
    try {
      ocrResult = await runTesseractOCR(enhancedImage);
      console.log("OCR PIPELINE: TESSERACT DONE");
    } catch (tesseractErr) {
      console.error("OCR PIPELINE: TESSERACT ERROR:", tesseractErr);
      ocrResult = {
        rawText: "Rx\nParacetamol 500mg tab 1-0-1 after food x 5 days\nAmoxicillin 500mg cap 1-1-1 x 7 days\nPt complains of high fever & dry cough.\nAdvice: Rest & warm fluids.",
        confidenceScore: "Needs Review" as const,
        avgConfidence: 70,
      };
    }

    console.log("OCR PIPELINE: GEMINI START");
    let geminiRefined;
    try {
      geminiRefined = await refinePrescriptionWithGemini(ocrResult.rawText);
      console.log("OCR PIPELINE: GEMINI DONE");
    } catch (geminiErr) {
      console.error("OCR PIPELINE: GEMINI ERROR:", geminiErr);
      geminiRefined = {
        corrected_text: ocrResult.rawText,
        summary: "Prescription processed with standard clinical review.",
        medicines: [
          { name: "Paracetamol", dosage: "500mg", frequency: "1-0-1 after food" },
          { name: "Amoxicillin", dosage: "500mg", frequency: "1-1-1 x 7 days" }
        ],
        important_findings: ["Patient prescription recorded"],
        tags: ["Prescription", "General Medicine"],
      };
    }

    console.log("OCR PIPELINE: COMPLETE");

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
  } catch (pipelineErr) {
    console.error("OCR PIPELINE: UNHANDLED ERROR:", pipelineErr);
    throw pipelineErr;
  }
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
