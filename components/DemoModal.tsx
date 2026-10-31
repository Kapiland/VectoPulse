"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Radio, 
  Users, 
  Play,
  Zap,
  ExternalLink
} from "lucide-react";
import { DEMO_NOTICES } from "@/lib/data/mock-data";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNoticeType, setSelectedNoticeType] = useState<"hackathon" | "internship" | "workshop">("hackathon");

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: "Notice Intelligence",
      desc: "Gemini multimodal extraction on raw circulars & WhatsApp forwards.",
      actionLabel: "Load Demo Notice into Gemini",
      route: `/notice-intelligence?demo=${selectedNoticeType}`,
      icon: FileText,
    },
    {
      num: 2,
      title: "Review & Validate",
      desc: "Zod-validated schema preview with untrusted prompt injection guard.",
      actionLabel: "Inspect Form & Save to Radar",
      route: "/notice-intelligence",
      icon: Zap,
    },
    {
      num: 3,
      title: "Opportunity Radar",
      desc: "Explore closing deadlines, category tags & Gemma AI explanations.",
      actionLabel: "Open Opportunity Radar",
      route: "/radar",
      icon: Radio,
    },
    {
      num: 4,
      title: "AI Team Matcher",
      desc: "Deterministic compatibility scoring + Gemma natural language rationale.",
      actionLabel: "Match Teammates Now",
      route: "/team-matcher?query=Need+Python+FastAPI+developer+and+UI%2FUX+designer+for+AI+hackathon",
      icon: Users,
    },
  ];

  const handleStepNavigate = (step: typeof steps[0]) => {
    onClose();
    router.push(step.route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-blue-500/30 bg-[#0a0f1d] p-6 shadow-2xl shadow-blue-500/20 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full bg-[#0a0e1a] rounded-[7px] flex items-center justify-center">
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                Judge Fast-Track Demo
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  &lt; 60 Seconds Flow
                </span>
              </h3>
              <p className="text-xs text-slate-400">Walk through the three core product journeys end-to-end.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample Notice Selection */}
        <div className="my-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Sample Notice to Pre-Load:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "hackathon", label: "DevSprint Hackathon", type: "WhatsApp Forward" },
              { id: "internship", label: "Zomato SDE Intern", type: "Official Circular" },
              { id: "workshop", label: "Kubernetes Workshop", type: "GDG Poster" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedNoticeType(item.id as "hackathon" | "internship" | "workshop")}
                className={`p-2.5 rounded-lg text-left transition-all text-xs border ${
                  selectedNoticeType === item.id
                    ? "bg-blue-600/20 border-cyan-400 text-white shadow-sm shadow-blue-500/20"
                    : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="font-medium text-white truncate">{item.label}</div>
                <div className="text-[10px] text-cyan-400/80">{item.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Guide */}
        <div className="space-y-3 mb-6">
          {steps.map((step) => {
            const Icon = step.icon;
            const isSelected = currentStep === step.num;
            return (
              <div
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-950/40 border-blue-500/50 shadow-md"
                    : "bg-slate-900/30 border-slate-800/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-xs font-semibold text-white">{step.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{step.desc}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStepNavigate(step);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                >
                  <span>Launch</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Transparently distinguishes live AI and sample demo profiles
          </span>
          <button
            onClick={() => handleStepNavigate(steps[0])}
            className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            Start from Step 1 <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
