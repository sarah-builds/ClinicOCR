export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  createdAt: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  isUncertain?: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  imageUrl: string;
  rawOcr: string;
  correctedText: string;
  aiSummary: string;
  medicinesJson: Medicine[];
  importantFindings?: string[];
  doctorNotes: string;
  tags: string[];
  important: boolean;
  confidenceScore?: "Excellent" | "Good" | "Needs Review";
  createdAt: string;
  patientName?: string;
  patientPhone?: string;
}

export interface ImageQualityCheck {
  isBlurry: boolean;
  blurScore: number;
  isLowLight: boolean;
  isCropped: boolean;
  isTilted: boolean;
  qualityGrade: "Excellent" | "Good" | "Needs Review";
  warnings: string[];
}

export interface PatternInsight {
  hasPattern: boolean;
  title: string;
  symptom: string;
  occurrences: number;
  message: string;
  severity: "low" | "medium" | "high";
  recommendation: string;
  dates: string[];
}
