import { neon } from '@neondatabase/serverless';
import { Patient, Prescription } from '@/types';

// Proper UUIDs for local fallback seed data
const SEED_P1_ID = "a1b2c3d4-0001-0001-0001-000000000001";
const SEED_P2_ID = "a1b2c3d4-0001-0001-0001-000000000002";
const SEED_P3_ID = "a1b2c3d4-0001-0001-0001-000000000003";
const SEED_RX1_ID = "b2c3d4e5-0002-0002-0002-000000000001";
const SEED_RX2_ID = "b2c3d4e5-0002-0002-0002-000000000002";
const SEED_RX3_ID = "b2c3d4e5-0002-0002-0002-000000000003";

// Simple UUID v4 generator (browser/server safe)
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ─── Local In-Memory Fallback Store ─────────────────────────────────────────
// All IDs here are valid UUID strings so they are safe to use as Neon FK values
class LocalStore {
  private patients: Patient[] = [
    {
      id: SEED_P1_ID,
      name: "Eleanor Vance",
      age: 42,
      gender: "Female",
      phone: "+1 (555) 234-5678",
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: SEED_P2_ID,
      name: "Marcus Thorne",
      age: 58,
      gender: "Male",
      phone: "+1 (555) 987-6543",
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    },
    {
      id: SEED_P3_ID,
      name: "Sophia Chen",
      age: 29,
      gender: "Female",
      phone: "+1 (555) 456-7890",
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    }
  ];

  private prescriptions: Prescription[] = [
    {
      id: SEED_RX1_ID,
      patientId: SEED_P1_ID,
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
      rawOcr: "Rx\nParacetamol 500mg tab 1-0-1 after food x 5 days\nAmoxicillin 500mg cap 1-1-1 x 7 days\nPt complains of high fever & dry cough.\nAdvice: Rest & warm fluids.",
      correctedText: "Rx:\n- Paracetamol 500mg Tablet (1-0-1) after food for 5 days\n- Amoxicillin 500mg Capsule (1-1-1) for 7 days\nPatient complains of high fever and dry cough. Advised rest and warm fluids.",
      aiSummary: "Patient presenting with fever and dry cough. Prescribed anti-pyretic and 7-day antibiotic course.",
      medicinesJson: [
        { name: "Paracetamol", dosage: "500mg", frequency: "1-0-1 after food" },
        { name: "Amoxicillin", dosage: "500mg", frequency: "1-1-1" }
      ],
      importantFindings: ["High fever reported (102°F)", "Dry cough for 3 days"],
      doctorNotes: "Follow-up if fever persists after 3 days. Monitor hydration.",
      tags: ["Fever", "Antibiotic", "Respiratory"],
      important: true,
      confidenceScore: "Excellent",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      patientName: "Eleanor Vance",
      patientPhone: "+1 (555) 234-5678"
    },
    {
      id: SEED_RX2_ID,
      patientId: SEED_P1_ID,
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      rawOcr: "Rx\nParacetamol 500mg 1-0-1\nLevolin syrup 5ml 1-0-1\nCough & fever since 2 days.",
      correctedText: "Rx:\n- Paracetamol 500mg (1-0-1)\n- Possibly Levolin Syrup 5ml (1-0-1)\nCough & fever since 2 days.",
      aiSummary: "Recurrent fever and respiratory cough. Prescribed antipyretic and bronchodilator syrup.",
      medicinesJson: [
        { name: "Paracetamol", dosage: "500mg", frequency: "1-0-1" },
        { name: "Possibly Levolin Syrup", dosage: "5ml", frequency: "1-0-1", isUncertain: true }
      ],
      importantFindings: ["Recurrent cough episode"],
      doctorNotes: "Check chest clear on auscultation.",
      tags: ["Fever", "Cold", "Bronchodilator"],
      important: false,
      confidenceScore: "Good",
      createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
      patientName: "Eleanor Vance",
      patientPhone: "+1 (555) 234-5678"
    },
    {
      id: SEED_RX3_ID,
      patientId: SEED_P2_ID,
      imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
      rawOcr: "Rx\nPantoprazole 40mg 1-0-0 before breakfast\nAntacid syrup 10ml t.i.d.\nAcidity & heartburn.",
      correctedText: "Rx:\n- Pantoprazole 40mg (1-0-0) before breakfast\n- Antacid Gel/Syrup 10ml thrice daily\nHistory of severe heartburn and GERD symptoms.",
      aiSummary: "Patient with GERD symptoms. Prescribed PPI therapy for 14 days.",
      medicinesJson: [
        { name: "Pantoprazole", dosage: "40mg", frequency: "1-0-0 before food" },
        { name: "Antacid Gel", dosage: "10ml", frequency: "TID" }
      ],
      importantFindings: ["GERD / Gastric reflux"],
      doctorNotes: "Avoid spicy food, dinner 2 hrs before bed.",
      tags: ["Gastro", "Acid Relief"],
      important: false,
      confidenceScore: "Excellent",
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      patientName: "Marcus Thorne",
      patientPhone: "+1 (555) 987-6543"
    }
  ];

  getPatients() { return this.patients; }

  addPatient(patient: Omit<Patient, "id" | "createdAt"> & { id?: string; createdAt?: string }): Patient {
    const newP: Patient = {
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      id: patient.id || generateUUID(),
      createdAt: patient.createdAt || new Date().toISOString(),
    };
    this.patients.unshift(newP);
    return newP;
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const idx = this.patients.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.patients[idx] = { ...this.patients[idx], ...updates };
    return this.patients[idx];
  }

  deletePatient(id: string): boolean {
    const before = this.patients.length;
    this.patients = this.patients.filter(p => p.id !== id);
    this.prescriptions = this.prescriptions.filter(r => r.patientId !== id);
    return this.patients.length < before;
  }

  getPrescriptions() { return this.prescriptions; }

  addPrescription(rx: Omit<Prescription, "id" | "createdAt"> & { id?: string; createdAt?: string }): Prescription {
    const pat = this.patients.find(p => p.id === rx.patientId);
    const newRx: Prescription = {
      ...rx,
      id: rx.id || generateUUID(),
      createdAt: rx.createdAt || new Date().toISOString(),
      patientName: rx.patientName || pat?.name || "Unknown Patient",
      patientPhone: rx.patientPhone || pat?.phone || "",
    };
    this.prescriptions.unshift(newRx);
    return newRx;
  }

  updatePrescription(id: string, updates: Partial<Prescription>): Prescription | null {
    const idx = this.prescriptions.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.prescriptions[idx] = { ...this.prescriptions[idx], ...updates };
    return this.prescriptions[idx];
  }
}

export const localDb = new LocalStore();

// ─── Neon PostgreSQL Connection ──────────────────────────────────────────────

let _neonSql: ReturnType<typeof neon> | null = null;

function getNeonSql() {
  if (_neonSql) return _neonSql;
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.startsWith("postgres")) {
    _neonSql = neon(dbUrl);
    return _neonSql;
  }
  return null;
}

// ─── Seeding — Promise-based singleton (process-level cache) ─────────────────
// Avoids redundant seed-check round-trips within a single server process.
// The DB-level COUNT > 0 guard inside seedNeonIfEmpty remains the authoritative
// correctness check — safe across multiple concurrent instances.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _seedPromise: Promise<void> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureSeeded(sql: any): Promise<void> {
  if (!_seedPromise) {
    _seedPromise = seedNeonIfEmpty(sql).catch((e) => {
      // Reset so a transient failure does not permanently block seeding
      _seedPromise = null;
      console.warn("[ClinicOCR] ensureSeeded error:", e);
    });
  }
  return _seedPromise;
}

// Helper to map a Neon prescription row → Prescription type
function mapRxRow(r: any): Prescription {
  return {
    id: r.id,
    patientId: r.patientId,
    imageUrl: r.imageUrl,
    rawOcr: r.rawOcr,
    correctedText: r.correctedText,
    aiSummary: r.aiSummary,
    medicinesJson: Array.isArray(r.medicinesJson) ? r.medicinesJson : (JSON.parse(r.medicinesJson || "[]")),
    importantFindings: Array.isArray(r.importantFindings) ? r.importantFindings : (JSON.parse(r.importantFindings || "[]")),
    doctorNotes: r.doctorNotes || "",
    tags: Array.isArray(r.tags) ? r.tags : (JSON.parse(r.tags || "[]")),
    important: Boolean(r.important),
    confidenceScore: (r.confidenceScore as "Excellent" | "Good" | "Needs Review") || "Good",
    createdAt: new Date(r.createdAt).toISOString(),
    patientName: r.patientName || "",
    patientPhone: r.patientPhone || "",
  };
}

// Helper to map a Neon patient row → Patient type
function mapPatientRow(r: any): Patient {
  return {
    id: r.id,
    name: r.name,
    age: Number(r.age),
    gender: r.gender,
    phone: r.phone,
    createdAt: new Date(r.createdAt).toISOString(),
  };
}

/**
 * Seed initial sample patients/prescriptions into Neon if empty.
 * Uses gen_random_uuid() from PostgreSQL so IDs are always valid UUIDs.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedNeonIfEmpty(sql: any) {
  try {
    const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM patients` as any[];
    if (count > 0) return; // Already seeded

    console.log("[ClinicOCR] Seeding initial records into Neon PostgreSQL...");

    const [p1] = await sql`
      INSERT INTO patients (name, age, gender, phone)
      VALUES ('Eleanor Vance', 42, 'Female', '+1 (555) 234-5678')
      RETURNING id;
    ` as any[];

    const [p2] = await sql`
      INSERT INTO patients (name, age, gender, phone)
      VALUES ('Marcus Thorne', 58, 'Male', '+1 (555) 987-6543')
      RETURNING id;
    ` as any[];

    await sql`
      INSERT INTO patients (name, age, gender, phone)
      VALUES ('Sophia Chen', 29, 'Female', '+1 (555) 456-7890');
    `;

    if (p1?.id) {
      await sql`
        INSERT INTO prescriptions
          (patient_id, image_url, raw_ocr, corrected_text, ai_summary,
           medicines_json, important_findings, doctor_notes, tags, important, confidence_score)
        VALUES (
          ${p1.id},
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
          ${'Rx\nParacetamol 500mg tab 1-0-1 after food x 5 days\nAmoxicillin 500mg cap 1-1-1 x 7 days\nPt complains of high fever & dry cough.\nAdvice: Rest & warm fluids.'},
          ${'Rx:\n- Paracetamol 500mg Tablet (1-0-1) after food for 5 days\n- Amoxicillin 500mg Capsule (1-1-1) for 7 days\nPatient complains of high fever and dry cough. Advised rest and warm fluids.'},
          'Patient presenting with fever and dry cough. Prescribed anti-pyretic and 7-day antibiotic course.',
          ${JSON.stringify([{ name: "Paracetamol", dosage: "500mg", frequency: "1-0-1 after food" }, { name: "Amoxicillin", dosage: "500mg", frequency: "1-1-1" }])},
          ${JSON.stringify(["High fever reported (102°F)", "Dry cough for 3 days"])},
          'Follow-up if fever persists after 3 days. Monitor hydration.',
          ${JSON.stringify(["Fever", "Antibiotic", "Respiratory"])},
          true,
          'Excellent'
        );
      `;

      await sql`
        INSERT INTO prescriptions
          (patient_id, image_url, raw_ocr, corrected_text, ai_summary,
           medicines_json, important_findings, doctor_notes, tags, important, confidence_score)
        VALUES (
          ${p1.id},
          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
          ${'Rx\nParacetamol 500mg 1-0-1\nLevolin syrup 5ml 1-0-1\nCough & fever since 2 days.'},
          ${'Rx:\n- Paracetamol 500mg (1-0-1)\n- Possibly Levolin Syrup 5ml (1-0-1)\nCough & fever since 2 days.'},
          'Recurrent fever and respiratory cough. Prescribed antipyretic and bronchodilator syrup.',
          ${JSON.stringify([{ name: "Paracetamol", dosage: "500mg", frequency: "1-0-1" }, { name: "Possibly Levolin Syrup", dosage: "5ml", frequency: "1-0-1", isUncertain: true }])},
          ${JSON.stringify(["Recurrent cough episode"])},
          'Check chest clear on auscultation.',
          ${JSON.stringify(["Fever", "Cold", "Bronchodilator"])},
          false,
          'Good'
        );
      `;
    }

    if (p2?.id) {
      await sql`
        INSERT INTO prescriptions
          (patient_id, image_url, raw_ocr, corrected_text, ai_summary,
           medicines_json, important_findings, doctor_notes, tags, important, confidence_score)
        VALUES (
          ${p2.id},
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
          ${'Rx\nPantoprazole 40mg 1-0-0 before breakfast\nAntacid syrup 10ml t.i.d.\nAcidity & heartburn.'},
          ${'Rx:\n- Pantoprazole 40mg (1-0-0) before breakfast\n- Antacid Gel/Syrup 10ml thrice daily\nHistory of severe heartburn and GERD symptoms.'},
          'Patient with GERD symptoms. Prescribed PPI therapy for 14 days.',
          ${JSON.stringify([{ name: "Pantoprazole", dosage: "40mg", frequency: "1-0-0 before food" }, { name: "Antacid Gel", dosage: "10ml", frequency: "TID" }])},
          ${JSON.stringify(["GERD / Gastric reflux"])},
          'Avoid spicy food, dinner 2 hrs before bed.',
          ${JSON.stringify(["Gastro", "Acid Relief"])},
          false,
          'Excellent'
        );
      `;
    }

    console.log("[ClinicOCR] Neon seeding complete.");
  } catch (e) {
    console.warn("[ClinicOCR] Neon seed warning:", e);
  }
}

// ─── Patient DB Functions ────────────────────────────────────────────────────

export async function dbGetPatients(): Promise<Patient[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureSeeded(sql);
      const rows = await sql`
        SELECT id, name, age, gender, phone, created_at as "createdAt"
        FROM patients ORDER BY created_at DESC;
      ` as any[];
      return rows.map(mapPatientRow);
    } catch (e) {
      console.error("[ClinicOCR] dbGetPatients error, fallback to local:", e);
    }
  }
  return localDb.getPatients();
}

export async function dbGetPatientById(id: string): Promise<Patient | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT id, name, age, gender, phone, created_at as "createdAt"
        FROM patients WHERE id = ${id}::uuid;
      ` as any[];
      return rows.length > 0 ? mapPatientRow(rows[0]) : null;
    } catch (e) {
      console.error("[ClinicOCR] dbGetPatientById error:", e);
    }
  }
  return localDb.getPatients().find(p => p.id === id) || null;
}

export async function dbAddPatient(data: { name: string; age: number; gender: string; phone: string }): Promise<Patient> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        INSERT INTO patients (name, age, gender, phone)
        VALUES (${data.name}, ${data.age}, ${data.gender}, ${data.phone})
        RETURNING id, name, age, gender, phone, created_at as "createdAt";
      ` as any[];
      const newP = mapPatientRow(rows[0]);
      // Also keep local cache in sync (using the real UUID from Neon)
      localDb.addPatient(newP);
      return newP;
    } catch (e) {
      console.error("[ClinicOCR] dbAddPatient error:", e);
    }
  }
  return localDb.addPatient(data);
}

export async function dbUpdatePatient(id: string, data: Partial<Patient>): Promise<Patient | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        UPDATE patients
        SET
          name    = COALESCE(${data.name    ?? null}, name),
          age     = COALESCE(${data.age     ?? null}, age),
          gender  = COALESCE(${data.gender  ?? null}, gender),
          phone   = COALESCE(${data.phone   ?? null}, phone)
        WHERE id = ${id}::uuid
        RETURNING id, name, age, gender, phone, created_at as "createdAt";
      ` as any[];
      if (rows.length > 0) {
        const updated = mapPatientRow(rows[0]);
        localDb.updatePatient(id, updated);
        return updated;
      }
    } catch (e) {
      console.error("[ClinicOCR] dbUpdatePatient error:", e);
    }
  }
  return localDb.updatePatient(id, data);
}

export async function dbDeletePatient(id: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`DELETE FROM patients WHERE id = ${id}::uuid;`;
      localDb.deletePatient(id);
      return true;
    } catch (e) {
      console.error("[ClinicOCR] dbDeletePatient error:", e);
    }
  }
  return localDb.deletePatient(id);
}


// ─── Prescription DB Functions ───────────────────────────────────────────────

export async function dbGetPrescriptions(): Promise<Prescription[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureSeeded(sql);
      const rows = await sql`
        SELECT
          r.id,
          r.patient_id     AS "patientId",
          r.image_url      AS "imageUrl",
          r.raw_ocr        AS "rawOcr",
          r.corrected_text AS "correctedText",
          r.ai_summary     AS "aiSummary",
          r.medicines_json AS "medicinesJson",
          r.important_findings AS "importantFindings",
          r.doctor_notes   AS "doctorNotes",
          r.tags,
          r.important,
          r.confidence_score AS "confidenceScore",
          r.created_at     AS "createdAt",
          p.name           AS "patientName",
          p.phone          AS "patientPhone"
        FROM prescriptions r
        JOIN patients p ON r.patient_id = p.id
        ORDER BY r.created_at DESC;
      ` as any[];
      return rows.map(mapRxRow);
    } catch (e) {
      console.error("[ClinicOCR] dbGetPrescriptions error, fallback to local:", e);
    }
  }
  return localDb.getPrescriptions();
}

export async function dbGetPrescriptionById(id: string): Promise<Prescription | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT
          r.id,
          r.patient_id     AS "patientId",
          r.image_url      AS "imageUrl",
          r.raw_ocr        AS "rawOcr",
          r.corrected_text AS "correctedText",
          r.ai_summary     AS "aiSummary",
          r.medicines_json AS "medicinesJson",
          r.important_findings AS "importantFindings",
          r.doctor_notes   AS "doctorNotes",
          r.tags,
          r.important,
          r.confidence_score AS "confidenceScore",
          r.created_at     AS "createdAt",
          p.name           AS "patientName",
          p.phone          AS "patientPhone"
        FROM prescriptions r
        JOIN patients p ON r.patient_id = p.id
        WHERE r.id = ${id}::uuid;
      ` as any[];
      return rows.length > 0 ? mapRxRow(rows[0]) : null;
    } catch (e) {
      console.error("[ClinicOCR] dbGetPrescriptionById error:", e);
    }
  }
  return localDb.getPrescriptions().find(r => r.id === id) || null;
}

export async function dbGetPrescriptionsByPatientId(patientId: string): Promise<Prescription[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT
          r.id,
          r.patient_id     AS "patientId",
          r.image_url      AS "imageUrl",
          r.raw_ocr        AS "rawOcr",
          r.corrected_text AS "correctedText",
          r.ai_summary     AS "aiSummary",
          r.medicines_json AS "medicinesJson",
          r.important_findings AS "importantFindings",
          r.doctor_notes   AS "doctorNotes",
          r.tags,
          r.important,
          r.confidence_score AS "confidenceScore",
          r.created_at     AS "createdAt",
          p.name           AS "patientName",
          p.phone          AS "patientPhone"
        FROM prescriptions r
        JOIN patients p ON r.patient_id = p.id
        WHERE r.patient_id = ${patientId}::uuid
        ORDER BY r.important DESC, r.created_at DESC;
      ` as any[];
      return rows.map(mapRxRow);
    } catch (e) {
      console.error("[ClinicOCR] dbGetPrescriptionsByPatientId error:", e);
    }
  }
  return localDb.getPrescriptions().filter(r => r.patientId === patientId);
}

/**
 * Optimized: retrieves patient name/phone via subqueries in the same
 * RETURNING clause — eliminates the previous dbGetPatientById follow-up call.
 */
export async function dbAddPrescription(data: Omit<Prescription, "id" | "createdAt">): Promise<Prescription> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        INSERT INTO prescriptions
          (patient_id, image_url, raw_ocr, corrected_text, ai_summary,
           medicines_json, important_findings, doctor_notes, tags, important, confidence_score)
        VALUES (
          ${data.patientId}::uuid,
          ${data.imageUrl},
          ${data.rawOcr},
          ${data.correctedText},
          ${data.aiSummary},
          ${JSON.stringify(data.medicinesJson || [])},
          ${JSON.stringify(data.importantFindings || [])},
          ${data.doctorNotes || ""},
          ${JSON.stringify(data.tags || [])},
          ${data.important || false},
          ${data.confidenceScore || "Good"}
        )
        RETURNING
          id,
          created_at AS "createdAt",
          (SELECT name  FROM patients WHERE id = patient_id) AS "patientName",
          (SELECT phone FROM patients WHERE id = patient_id) AS "patientPhone";
      ` as any[];
      const row = rows[0];
      const newRx: Prescription = {
        ...data,
        id: row.id,
        createdAt: new Date(row.createdAt).toISOString(),
        patientName: row.patientName || data.patientName || "Patient",
        patientPhone: row.patientPhone || data.patientPhone || "",
      };
      localDb.addPrescription(newRx);
      return newRx;
    } catch (e) {
      console.error("[ClinicOCR] dbAddPrescription error:", e);
    }
  }
  return localDb.addPrescription(data);
}

export async function dbTogglePrescriptionImportant(id: string): Promise<boolean> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        UPDATE prescriptions
        SET important = NOT important
        WHERE id = ${id}::uuid
        RETURNING important;
      ` as any[];
      if (rows.length > 0) {
        const imp = Boolean(rows[0].important);
        localDb.updatePrescription(id, { important: imp });
        return imp;
      }
    } catch (e) {
      console.error("[ClinicOCR] dbTogglePrescriptionImportant error:", e);
    }
  }
  const current = localDb.getPrescriptions().find(r => r.id === id);
  if (!current) return false;
  return localDb.updatePrescription(id, { important: !current.important })?.important ?? false;
}

export async function dbUpdateDoctorNotes(id: string, notes: string): Promise<Prescription | null> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        UPDATE prescriptions
        SET doctor_notes = ${notes}
        WHERE id = ${id}::uuid;
      `;
      return dbGetPrescriptionById(id);
    } catch (e) {
      console.error("[ClinicOCR] dbUpdateDoctorNotes error:", e);
    }
  }
  return localDb.updatePrescription(id, { doctorNotes: notes });
}

// ─── Optimized Aggregate / Search / Count Functions ──────────────────────────

export interface DashboardStats {
  patientCount: number;
  prescriptionCount: number;
  importantCount: number;
  recentPrescriptions: Prescription[];
}

/**
 * Returns aggregate counts + the 6 most recent prescriptions in a single combined
 * SQL query with JSON aggregation — eliminates extra round-trips and full table scans.
 */
export async function dbGetDashboardStats(): Promise<DashboardStats> {
  const sql = getNeonSql();
  if (sql) {
    try {
      await ensureSeeded(sql);

      const rows = await sql`
        SELECT
          (SELECT COUNT(*)::int FROM patients) AS "patientCount",
          (SELECT COUNT(*)::int FROM prescriptions) AS "prescriptionCount",
          (SELECT COUNT(*)::int FROM prescriptions WHERE important = true) AS "importantCount",
          (
            SELECT COALESCE(json_agg(recent_r), '[]'::json)
            FROM (
              SELECT
                r.id,
                r.patient_id     AS "patientId",
                r.image_url      AS "imageUrl",
                r.raw_ocr        AS "rawOcr",
                r.corrected_text AS "correctedText",
                r.ai_summary     AS "aiSummary",
                r.medicines_json AS "medicinesJson",
                r.important_findings AS "importantFindings",
                r.doctor_notes   AS "doctorNotes",
                r.tags,
                r.important,
                r.confidence_score AS "confidenceScore",
                r.created_at     AS "createdAt",
                p.name           AS "patientName",
                p.phone          AS "patientPhone"
              FROM prescriptions r
              JOIN patients p ON r.patient_id = p.id
              ORDER BY r.created_at DESC
              LIMIT 6
            ) recent_r
          ) AS "recentPrescriptions"
      ` as any[];

      const row = rows[0] || {};
      const recentList = Array.isArray(row.recentPrescriptions)
        ? row.recentPrescriptions
        : (typeof row.recentPrescriptions === "string" ? JSON.parse(row.recentPrescriptions) : []);

      return {
        patientCount:        Number(row.patientCount) || 0,
        prescriptionCount:   Number(row.prescriptionCount) || 0,
        importantCount:      Number(row.importantCount) || 0,
        recentPrescriptions: recentList.map(mapRxRow),
      };
    } catch (e) {
      console.error("[ClinicOCR] dbGetDashboardStats error, fallback to local:", e);
    }
  }

  // Local in-memory fallback
  const patients      = localDb.getPatients();
  const prescriptions = localDb.getPrescriptions();
  return {
    patientCount:        patients.length,
    prescriptionCount:   prescriptions.length,
    importantCount:      prescriptions.filter(r => r.important).length,
    recentPrescriptions: prescriptions.slice(0, 6),
  };
}

/**
 * Performs search and filtering entirely in PostgreSQL.
 * Tags are JSONB — uses @> containment operator for exact tag matching
 * and ILIKE on text columns for full-text search.
 */
export async function dbSearchPrescriptions(
  searchQuery?: string,
  tagFilter?: string,
  importantOnly?: boolean,
): Promise<Prescription[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const q      = searchQuery?.trim() || null;
      const tag    = (tagFilter && tagFilter !== "All") ? tagFilter : null;
      const impOnly = importantOnly === true;
      // Build a JSONB literal for tag containment check, or null sentinel
      const tagJsonb = tag !== null ? JSON.stringify([tag]) : null;

      const rows = await sql`
        SELECT
          r.id,
          r.patient_id     AS "patientId",
          r.image_url      AS "imageUrl",
          r.raw_ocr        AS "rawOcr",
          r.corrected_text AS "correctedText",
          r.ai_summary     AS "aiSummary",
          r.medicines_json AS "medicinesJson",
          r.important_findings AS "importantFindings",
          r.doctor_notes   AS "doctorNotes",
          r.tags,
          r.important,
          r.confidence_score AS "confidenceScore",
          r.created_at     AS "createdAt",
          p.name           AS "patientName",
          p.phone          AS "patientPhone"
        FROM prescriptions r
        JOIN patients p ON r.patient_id = p.id
        WHERE
          (${impOnly} = false  OR  r.important = true)
          AND (${tagJsonb}::jsonb IS NULL  OR  r.tags @> ${tagJsonb}::jsonb)
          AND (
            ${q}::text IS NULL
            OR p.name           ILIKE '%' || ${q} || '%'
            OR p.phone          ILIKE '%' || ${q} || '%'
            OR r.corrected_text ILIKE '%' || ${q} || '%'
            OR r.doctor_notes   ILIKE '%' || ${q} || '%'
            OR r.medicines_json::text ILIKE '%' || ${q} || '%'
            OR r.tags::text     ILIKE '%' || ${q} || '%'
            OR TO_CHAR(r.created_at, 'MM/DD/YYYY') ILIKE '%' || ${q} || '%'
          )
        ORDER BY r.created_at DESC
      ` as any[];

      return rows.map(mapRxRow);
    } catch (e) {
      console.error("[ClinicOCR] dbSearchPrescriptions error, fallback to local:", e);
    }
  }

  // Local in-memory fallback
  let list = localDb.getPrescriptions();
  if (importantOnly)                    list = list.filter(r => r.important);
  if (tagFilter && tagFilter !== "All") list = list.filter(r => r.tags.includes(tagFilter));
  if (searchQuery?.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(r => {
      const matchPatient  = r.patientName?.toLowerCase().includes(q) || r.patientPhone?.includes(q);
      const matchMedicine = r.medicinesJson.some(m => m.name.toLowerCase().includes(q));
      const matchTag      = r.tags.some(t => t.toLowerCase().includes(q));
      const matchText     = r.correctedText.toLowerCase().includes(q) || (r.doctorNotes || "").toLowerCase().includes(q);
      const matchDate     = new Date(r.createdAt).toLocaleDateString().includes(q);
      return matchPatient || matchMedicine || matchTag || matchText || matchDate;
    });
  }
  return list;
}

/**
 * Returns a per-patient prescription count map using a single GROUP BY query
 * rather than fetching every prescription row.
 */
export async function dbGetPatientRxCounts(): Promise<Record<string, number>> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT patient_id::text AS "patientId", COUNT(*)::int AS count
        FROM prescriptions
        GROUP BY patient_id
      ` as any[];

      const counts: Record<string, number> = {};
      rows.forEach((r: any) => { counts[r.patientId] = r.count; });
      return counts;
    } catch (e) {
      console.error("[ClinicOCR] dbGetPatientRxCounts error, fallback to local:", e);
    }
  }

  // Local fallback
  const counts: Record<string, number> = {};
  localDb.getPrescriptions().forEach(r => {
    counts[r.patientId] = (counts[r.patientId] || 0) + 1;
  });
  return counts;
}
