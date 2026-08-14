"use server";

import {
  dbGetPatients,
  dbGetPatientById,
  dbAddPatient,
  dbUpdatePatient,
  dbDeletePatient,
} from "@/db";
import { Patient } from "@/types";
import { revalidatePath } from "next/cache";

export async function getPatientsAction(): Promise<Patient[]> {
  return dbGetPatients();
}

export async function getPatientByIdAction(id: string): Promise<Patient | null> {
  return dbGetPatientById(id);
}

export async function addPatientAction(formData: {
  name: string;
  age: number;
  gender: string;
  phone: string;
}): Promise<Patient> {
  const newPatient = await dbAddPatient(formData);
  revalidatePath("/patients");
  revalidatePath("/");
  revalidatePath("/upload");
  return newPatient;
}

export async function updatePatientAction(
  id: string,
  data: Partial<Patient>
): Promise<Patient | null> {
  const updated = await dbUpdatePatient(id, data);
  revalidatePath(`/patients/${id}`);
  revalidatePath("/patients");
  return updated;
}

export async function deletePatientAction(id: string): Promise<boolean> {
  const success = await dbDeletePatient(id);
  revalidatePath("/patients");
  revalidatePath("/");
  return success;
}
