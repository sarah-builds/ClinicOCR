import { neon } from '@neondatabase/serverless';

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_7lxZFvuLB1nI@ep-damp-river-axh96i28-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function initNeonDb() {
  try {
    console.log("Connecting to Neon PostgreSQL...");
    const sql = neon(dbUrl);

    await sql`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
        phone TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        raw_ocr TEXT NOT NULL,
        corrected_text TEXT NOT NULL,
        ai_summary TEXT NOT NULL,
        medicines_json JSONB NOT NULL,
        important_findings JSONB,
        doctor_notes TEXT DEFAULT '',
        tags JSONB NOT NULL,
        important BOOLEAN DEFAULT FALSE NOT NULL,
        confidence_score TEXT DEFAULT 'Good',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`;
    console.log("Neon Database Connected & Tables Verified:", tables.map(t => t.table_name));
  } catch (err) {
    console.error("Neon DB Initialization Error:", err);
  }
}

initNeonDb();
