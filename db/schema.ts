import { pgTable, uuid, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prescriptions = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  patientId: uuid("patient_id").references(() => patients.id, { onDelete: "cascade" }).notNull(),
  imageUrl: text("image_url").notNull(),
  rawOcr: text("raw_ocr").notNull(),
  correctedText: text("corrected_text").notNull(),
  aiSummary: text("ai_summary").notNull(),
  medicinesJson: jsonb("medicines_json").$type<any[]>().notNull(),
  importantFindings: jsonb("important_findings").$type<string[]>(),
  doctorNotes: text("doctor_notes").default(""),
  tags: jsonb("tags").$type<string[]>().notNull(),
  important: boolean("important").default(false).notNull(),
  confidenceScore: text("confidence_score").default("Good"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
