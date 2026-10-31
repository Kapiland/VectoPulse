"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  Clock,
  Compass,
  LoaderCircle,
} from "lucide-react";
import { Opportunity } from "@/types";
import { z } from "zod";

const RelevanceResultSchema = z.object({
  summary_en: z.string(),
  summary_hi: z.string().optional(),
  recommended_for: z.string(),
  urgency_level: z.enum(["High", "Medium", "Low"]),
  model_used: z.string(),
  is_live_ai: z.boolean(),
});

type RelevanceResult = z.infer<typeof RelevanceResultSchema>;

interface GemmaRelevanceModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GemmaRelevanceModal({
  opportunity,
  isOpen,
  onClose,
}: GemmaRelevanceModalProps) {
  const [languageMode, setLanguageMode] = useState<"en" | "hi">("en");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gemmaData, setGemmaData] = useState<RelevanceResult | null>(null);

  const handleGenerate = async () => {
    if (!opportunity) return;

    setLoading(true);
    setErrorMessage(null);
    setGemmaData(null);

    try {
      const response = await fetch("/api/ai/classify-opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: opportunity.title,
          category: opportunity.category,
          organization: opportunity.organization,
          eligibility: opportunity.eligibility,
          skills: opportunity.required_skills,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || "Could not generate the AI relevance analysis.");
      }

      const parsed = RelevanceResultSchema.safeParse(result.data);
      if (!parsed.success) {
        throw new Error("The AI service returned an invalid relevance response.");
      }

      setGemmaData(parsed.data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not reach the AI service.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-purple-500/30 bg-[#0a0e1c] p-6 shadow-2xl shadow-purple-500/20 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[7px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Gemma Relevance Intelligence</h3>
              <p className="text-[11px] text-slate-400">Contextual evaluation & student career fit</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setLanguageMode("en")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  languageMode === "en" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguageMode("hi")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                  languageMode === "hi" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                हिन्दी / Hinglish
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Opportunity Summary Card */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            {opportunity.category} • {opportunity.organization}
          </div>
          <h4 className="text-sm font-bold text-white mb-2 leading-snug">{opportunity.title}</h4>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Location: {opportunity.location}</span>
            </div>
          </div>
        </div>

        {/* Gemma AI Explanation Box */}
        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/25 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Gemma AI Career Rationale</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {gemmaData?.is_live_ai ? `Live · ${gemmaData.model_used}` : "Not generated"}
            </span>
          </div>

          {errorMessage && (
            <p role="alert" className="flex items-start gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </p>
          )}

          <p className="text-xs text-slate-200 leading-relaxed">
            {gemmaData
              ? languageMode === "en"
                ? gemmaData.summary_en
                : gemmaData.summary_hi || gemmaData.summary_en
              : "Generate an analysis to see how this opportunity fits student skills and goals."}
          </p>

          {gemmaData && (
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-300">
              <span>Recommended for: {gemmaData.recommended_for}</span>
              <span>Urgency: {gemmaData.urgency_level}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                {gemmaData ? "Regenerate analysis" : "Generate AI analysis"}
              </>
            )}
          </button>

          <div className="pt-2 border-t border-purple-500/20 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">Eligibility Summary:</span>
              <span className="text-slate-300 font-medium truncate block">{opportunity.eligibility}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Required Tech Stack:</span>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {opportunity.required_skills.slice(0, 3).map((s) => (
                  <span key={s} className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-cyan-300 border border-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verification: {opportunity.verification_status}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <a
              href={opportunity.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
            >
              <span>Visit Official Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
