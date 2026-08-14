"use client";

import Link from "next/link";
import { Patient } from "@/types";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { User, Phone, Calendar, FileText, ChevronRight, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PatientCardProps {
  patient: Patient;
  prescriptionCount?: number;
  onEdit?: (patient: Patient) => void;
  onDelete?: (id: string) => void;
}

export function PatientCard({ patient, prescriptionCount = 0, onEdit, onDelete }: PatientCardProps) {
  return (
    <Card className="glass-card-hover border-slate-800 relative group overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-base shadow-inner">
              {patient.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                {patient.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{patient.age} yrs</span>
                <span>•</span>
                <span>{patient.gender}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(patient)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                title="Edit Patient"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(patient.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete Patient"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-800/80 py-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate">{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
            <span>{prescriptionCount} prescription(s)</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Calendar className="h-3 w-3 inline" />
            Joined {formatDate(patient.createdAt)}
          </span>

          <Link href={`/patients/${patient.id}`}>
            <Button size="sm" variant="outline" className="h-8 gap-1 text-xs border-slate-700 hover:border-cyan-500 hover:text-cyan-300">
              <span>View History</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
