"use client";

import { useState } from "react";
import { PatternInsight } from "@/types";
import { getPatientPatternInsightsAction } from "@/actions/prescription-actions";
import { AlertTriangle, Sparkles, Activity, ShieldAlert, CheckCircle2, Brain, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface HealthInsightsWidgetProps {
  patientId: string;
  patientName: string;
}

export function HealthInsightsWidget({ patientId, patientName }: HealthInsightsWidgetProps) {
  const [insight, setInsight] = useState<PatternInsight | null | "idle">("idle");
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await getPatientPatternInsightsAction(patientId);
      setInsight(result);
    } catch {
      setInsight(null);
    } finally {
      setAnalyzing(false);
    }
  };

  // Idle state — show prompt button
  if (insight === "idle") {
    return (
      <div className="rounded-xl glass-card p-4 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-cyan-400" />
          <span>
            <strong className="text-slate-300">Phase 3 AI Health Insights</strong> — analyze {patientName}&apos;s prescription history for recurring symptom patterns.
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAnalyze}
          disabled={analyzing}
          className="shrink-0 ml-4 gap-2 border-cyan-800 text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300 text-xs"
        >
          {analyzing ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Analyzing...</span></>
          ) : (
            <><Sparkles className="h-3.5 w-3.5" /><span>Analyze Health Patterns</span></>
          )}
        </Button>
      </div>
    );
  }

  // Analysis complete — no pattern detected
  if (!insight || !insight.hasPattern) {
    return (
      <div className="rounded-xl glass-card p-4 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>No recurring high-risk symptom patterns detected in {patientName}&apos;s medical history.</span>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          Phase 3 Clean
        </Badge>
      </div>
    );
  }

  // Analysis complete — pattern found
  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 p-5 shadow-2xl space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base text-amber-200">
                {insight.title}
              </h3>
              <Badge variant="amber" className="text-[10px] gap-1">
                <Sparkles className="h-3 w-3 inline" />
                Phase 3 Early Warning
              </Badge>
            </div>
            <p className="text-xs text-amber-300/80 mt-0.5">
              Symptom: <strong className="text-white">{insight.symptom}</strong> ({insight.occurrences} recorded episodes)
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] text-slate-400">Relevant visits:</span>
          <div className="flex gap-1 mt-1">
            {insight.dates?.map((d, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 font-mono border border-amber-900/40">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        {insight.message}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs border-t border-amber-500/20">
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <ShieldAlert className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Assistive Tool Notice:</strong> ClinicOCR provides insights for clinical reference only. Doctor retains final diagnostic authority.
          </span>
        </div>
      </div>
    </div>
  );
}
