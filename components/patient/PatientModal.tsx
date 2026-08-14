"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Patient } from "@/types";
import { addPatientAction, updatePatientAction } from "@/actions/patient-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UserPlus, UserCheck, X } from "lucide-react";
import { toast } from "sonner";

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(0, "Age must be valid").max(130, "Age must be realistic"),
  gender: z.string().min(1, "Please select gender"),
  phone: z.string().min(5, "Phone number is required"),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientToEdit?: Patient | null;
  onSuccess?: (patient: Patient) => void;
}

export function PatientModal({ isOpen, onClose, patientToEdit, onSuccess }: PatientModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: patientToEdit
      ? {
          name: patientToEdit.name,
          age: patientToEdit.age,
          gender: patientToEdit.gender,
          phone: patientToEdit.phone,
        }
      : {
          name: "",
          age: 35,
          gender: "Female",
          phone: "+1 (555) ",
        },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: PatientFormValues) => {
    setLoading(true);
    try {
      if (patientToEdit) {
        const updated = await updatePatientAction(patientToEdit.id, data);
        if (updated) {
          toast.success("Patient updated successfully");
          if (onSuccess) onSuccess(updated);
        }
      } else {
        const created = await addPatientAction(data);
        toast.success(`Patient ${created.name} added successfully`);
        if (onSuccess) onSuccess(created);
      }
      reset();
      onClose();
    } catch (err) {
      toast.error("Failed to save patient record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md glass-card rounded-2xl border border-slate-700 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="h-10 w-10 rounded-xl bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            {patientToEdit ? <UserCheck className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {patientToEdit ? "Edit Patient Details" : "Register New Patient"}
            </h2>
            <p className="text-xs text-slate-400">
              Enter patient demographical info for clinic records
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name *
            </label>
            <Input {...register("name")} placeholder="e.g. Eleanor Vance" />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Age *
              </label>
              <Input type="number" {...register("age")} placeholder="e.g. 42" />
              {errors.age && <p className="text-xs text-rose-400 mt-1">{errors.age.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gender *
              </label>
              <select
                {...register("gender")}
                className="flex h-10 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-xs text-rose-400 mt-1">{errors.gender.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Phone Number *
            </label>
            <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
            {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800/80">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500">
              {loading ? "Saving..." : patientToEdit ? "Save Changes" : "Create Patient"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
