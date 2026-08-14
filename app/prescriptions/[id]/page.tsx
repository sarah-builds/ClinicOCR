import { notFound } from "next/navigation";
import Link from "next/link";
import { getPrescriptionByIdAction } from "@/actions/prescription-actions";
import { PrescriptionDetailView } from "@/components/prescription/PrescriptionDetailView";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface PrescriptionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrescriptionDetailPage({ params }: PrescriptionDetailPageProps) {
  const { id } = await params;
  const prescription = await getPrescriptionByIdAction(id);

  if (!prescription) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <Link href="/prescriptions">
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Search Records</span>
          </Button>
        </Link>
      </div>

      <PrescriptionDetailView prescription={prescription} />
    </div>
  );
}
