"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Download, FileCheck, Loader2 } from "lucide-react";
import { Prescription } from "@/types";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFExportButtonProps {
  prescription: Prescription;
  elementIdToExport?: string;
}

export function PDFExportButton({ prescription, elementIdToExport }: PDFExportButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleExportPDF = async () => {
    setDownloading(true);
    try {
      if (elementIdToExport) {
        const element = document.getElementById(elementIdToExport);
        if (element) {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#0f172a",
          });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Prescription_${prescription.patientName || "Patient"}_${prescription.id}.pdf`);
          toast.success("Prescription PDF downloaded successfully!");
          setDownloading(false);
          return;
        }
      }

      // Standalone PDF Generator fallback
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("ClinicOCR Medical Prescription", 14, 20);

      doc.setFontSize(10);
      doc.text(`Patient Name: ${prescription.patientName || "N/A"}`, 14, 30);
      doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, 14, 36);
      doc.text(`Record ID: ${prescription.id}`, 14, 42);

      doc.setFontSize(14);
      doc.text("Prescribed Medicines:", 14, 55);

      let y = 65;
      prescription.medicinesJson.forEach((med, idx) => {
        doc.setFontSize(11);
        doc.text(`${idx + 1}. ${med.name} - ${med.dosage} (${med.frequency})`, 18, y);
        y += 8;
      });

      y += 10;
      doc.setFontSize(14);
      doc.text("AI Summary:", 14, y);
      y += 8;
      doc.setFontSize(10);
      const splitSummary = doc.splitTextToSize(prescription.aiSummary, 180);
      doc.text(splitSummary, 14, y);

      if (prescription.doctorNotes) {
        y += splitSummary.length * 6 + 10;
        doc.setFontSize(14);
        doc.text("Doctor Notes:", 14, y);
        y += 8;
        doc.setFontSize(10);
        doc.text(prescription.doctorNotes, 14, y);
      }

      doc.save(`Prescription_${prescription.id}.pdf`);
      toast.success("Prescription PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleExportPDF}
      disabled={downloading}
      variant="outline"
      className="gap-2 border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-300"
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4 text-cyan-400" />
          <span>Export PDF Report</span>
        </>
      )}
    </Button>
  );
}
