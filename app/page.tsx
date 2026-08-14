import Link from "next/link";
import { getDashboardStatsAction } from "@/actions/prescription-actions";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PrescriptionCard } from "@/components/prescription/PrescriptionCard";
import {
  Users,
  FileText,
  Upload,
  UserPlus,
  Star,
  Activity,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  // Single call: aggregate COUNT queries + LIMIT 6 prescriptions in parallel
  const { patientCount, prescriptionCount, importantCount, recentPrescriptions } =
    await getDashboardStatsAction();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
            <Activity className="h-4 w-4" />
            <span>Clinic OCR Intelligence Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Welcome back, Dr. Sarah
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Digitize handwritten prescriptions in seconds using Tesseract OCR &amp; Google Gemini Flash.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/patients">
            <Button variant="outline" className="gap-2 border-slate-700 hover:border-cyan-500 text-xs">
              <UserPlus className="h-4 w-4 text-cyan-400" />
              <span>Add Patient</span>
            </Button>
          </Link>

          <Link href="/upload">
            <Button className="gap-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-xs shadow-lg shadow-cyan-900/30">
              <Upload className="h-4 w-4" />
              <span>Quick Upload</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: Total Patients */}
        <Card className="glass-card-hover border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Patients
              </p>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                {patientCount}
              </h3>
              <p className="text-[11px] text-cyan-400 mt-1">Registered in Clinic</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Widget 2: Total Prescriptions */}
        <Card className="glass-card-hover border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Prescriptions
              </p>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                {prescriptionCount}
              </h3>
              <p className="text-[11px] text-emerald-400 mt-1">Digitized &amp; Saved</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
              <FileText className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Widget 3: Important Records */}
        <Card className="glass-card-hover border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ⭐ Important
              </p>
              <h3 className="text-2xl font-extrabold text-amber-300 mt-1">
                {importantCount}
              </h3>
              <p className="text-[11px] text-amber-400/80 mt-1">Flagged Records</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <Star className="h-6 w-6 fill-amber-400" />
            </div>
          </CardContent>
        </Card>

        {/* Widget 4: Processing Time */}
        <Card className="glass-card-hover border-slate-800">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                OCR Speed
              </p>
              <h3 className="text-2xl font-extrabold text-teal-300 mt-1">
                &lt; 5 sec
              </h3>
              <p className="text-[11px] text-teal-400 mt-1">Average Refinement</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <Sparkles className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Uploads Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Recent Digitized Prescriptions</span>
              <Badge variant="secondary" className="text-[10px]">Phase 1 &amp; 2 Live</Badge>
            </h2>
            <p className="text-xs text-slate-400">
              Review recent patient digitizations and AI structured outputs
            </p>
          </div>

          <Link href="/prescriptions">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-cyan-400 hover:text-cyan-300">
              <span>View All Records</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {recentPrescriptions.length === 0 ? (
          <Card className="glass-card p-12 text-center text-slate-400 space-y-3">
            <FileText className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No prescription records yet.</p>
            <Link href="/upload">
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                Upload First Prescription
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPrescriptions.map((rx) => (
              <PrescriptionCard key={rx.id} prescription={rx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
