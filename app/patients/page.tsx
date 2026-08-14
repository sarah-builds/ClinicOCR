"use client";

import { useState, useEffect } from "react";
import { Patient } from "@/types";
import { getPatientsAction, deletePatientAction } from "@/actions/patient-actions";
import { getPatientRxCountsAction } from "@/actions/prescription-actions";
import { PatientCard } from "@/components/patient/PatientCard";
import { PatientModal } from "@/components/patient/PatientModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Users, UserPlus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [rxCounts, setRxCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Parallel: patients list + GROUP BY count query (no full prescription load)
      const [pList, counts] = await Promise.all([
        getPatientsAction(),
        getPatientRxCountsAction(),
      ]);
      setPatients(pList);
      setRxCounts(counts);
    } catch (e) {
      toast.error("Failed to load patient records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const handleOpenAdd = () => {
    setPatientToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Patient) => {
    setPatientToEdit(p);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this patient record?")) {
      const ok = await deletePatientAction(id);
      if (ok) {
        toast.success("Patient record removed");
        loadData();
      }
    }
  };

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return p.name.toLowerCase().includes(q) || p.phone.includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patientToEdit={patientToEdit}
        onSuccess={() => loadData()}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
            <Users className="h-4 w-4" />
            <span>Clinic Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Patient Records</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage patient profiles, view prescription history, and add new patients.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-xs shadow-lg shadow-cyan-900/30"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register New Patient</span>
        </Button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by patient name or phone number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-slate-900 border-slate-800 text-xs h-10"
        />
      </div>

      {/* Patient Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto" />
          <p className="text-xs">Loading patient registry...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="p-12 glass-card rounded-2xl text-center text-slate-400 space-y-3">
          <Users className="h-10 w-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold">No patients found matching filter.</p>
          <Button size="sm" variant="outline" onClick={handleOpenAdd}>
            Add First Patient
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              prescriptionCount={rxCounts[patient.id] || 0}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
