import Link from "next/link";
import { notFound } from "next/navigation";
import { getPatientByIdAction } from "@/actions/patient-actions";
import { getPrescriptionsByPatientIdAction } from "@/actions/prescription-actions";
import { PrescriptionCard } from "@/components/prescription/PrescriptionCard";
import { HealthInsightsWidget } from "@/components/patient/HealthInsightsWidget";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { User, Phone, Calendar, Upload, FileText, ArrowLeft, Star, HeartPulse } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = await params;

  // Parallel fetch — independent queries, no Gemini call during page render
  const [patient, prescriptions] = await Promise.all([
    getPatientByIdAction(id),
    getPrescriptionsByPatientIdAction(id),
  ]);

  if (!patient) {
    notFound();
  }

  const importantCount = prescriptions.filter(r => r.important).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <div>
        <Link href="/patients">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Patient Directory</span>
          </Button>
        </Link>
      </div>

      {/* Patient Profile Header Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-cyan-900/40">
            {patient.name.charAt(0)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{patient.name}</h1>
              <Badge variant="secondary" className="text-xs">
                {patient.gender}, {patient.age} yrs
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-cyan-400" />
                {patient.phone}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-sky-400" />
                {prescriptions.length} Prescription(s)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                {importantCount} ⭐ Important
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/upload?patientId=${patient.id}`}>
            <Button className="gap-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-xs shadow-lg shadow-cyan-900/30">
              <Upload className="h-4 w-4" />
              <span>Digitize Prescription</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Phase 3 AI Health Insights — on-demand only, no Gemini call at render */}
      <HealthInsightsWidget patientId={patient.id} patientName={patient.name} />

      {/* Prescription History Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <span>Digital Prescription History</span>
          </h2>
          <span className="text-xs text-slate-400">
            Sorted by ⭐ Important flag &amp; date
          </span>
        </div>

        {prescriptions.length === 0 ? (
          <Card className="glass-card p-12 text-center text-slate-400 space-y-3">
            <FileText className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No prescription history yet for {patient.name}.</p>
            <Link href={`/upload?patientId=${patient.id}`}>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                Upload Prescription Scan
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptions.map((rx) => (
              <PrescriptionCard key={rx.id} prescription={rx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
