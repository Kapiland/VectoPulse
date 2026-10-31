import Link from "next/link";
import { Sparkles, ExternalLink, ShieldCheck, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060912]/90 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#0a0e1a] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-white text-base">CampusSignal AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              &quot;Never Miss an Opportunity. Find Your People. Build Something Real.&quot;
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Prompt Injection Safe Pipeline</span>
            </div>
          </div>

          {/* Core Features */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/notice-intelligence" className="hover:text-cyan-400 transition-colors">
                  AI Notice Intelligence (Gemini)
                </Link>
              </li>
              <li>
                <Link href="/radar" className="hover:text-cyan-400 transition-colors">
                  Smart Opportunity Radar
                </Link>
              </li>
              <li>
                <Link href="/team-matcher" className="hover:text-cyan-400 transition-colors">
                  AI Team Matcher (Gemma)
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-cyan-400 transition-colors">
                  Student Skills Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Tech Specs */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">AI Architecture</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>Gemini 2.5 Flash Multimodal OCR</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Gemma 4 / 2-9B-IT Rationales</span>
              </li>
              <li>Deterministic Jaccard Match Engine</li>
              <li>Multi-college PostgreSQL Schema</li>
            </ul>
          </div>

          {/* Hackathon Docs & Deliverables */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Hackathon Docs</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <span className="text-slate-300 font-mono text-[11px]">CAMPUSSIGNAL_PRODUCT_ANALYSIS.md</span>
              </li>
              <li>
                <span className="text-slate-300 font-mono text-[11px]">ARCHITECTURE.md</span>
              </li>
              <li>
                <span className="text-slate-300 font-mono text-[11px]">DEPLOYMENT_GUIDE.md</span>
              </li>
              <li>
                <span className="text-slate-300 font-mono text-[11px]">supabase/schema.sql</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 CampusSignal AI. Built for Indian Engineering & Degree Campuses.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
