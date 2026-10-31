"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Radio, 
  Users, 
  TrendingUp, 
  Calendar, 
  Bookmark, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Filter,
  UserCheck
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal from "@/components/DemoModal";
import GemmaRelevanceModal from "@/components/GemmaRelevanceModal";
import { INITIAL_OPPORTUNITIES, INITIAL_STUDENTS } from "@/lib/data/mock-data";
import { Opportunity, Student } from "@/types";
import { formatTimeRemaining } from "@/lib/utils";

export default function DashboardPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<Student>(INITIAL_STUDENTS[0]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [savedCount, setSavedCount] = useState(2);

  // Fetch live opportunities from API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/opportunities");
        const json = await res.json();
        if (json.success && json.data) {
          setOpportunities(json.data);
        }
      } catch {
        // use fallback initial
      }
    }
    loadData();
  }, []);

  const urgentOpportunities = opportunities.filter((opp) => {
    const remaining = new Date(opp.deadline).getTime() - Date.now();
    return remaining > 0 && remaining < 6 * 24 * 60 * 60 * 1000;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Student Welcome Banner & Persona Switcher */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-purple-950/60 border border-blue-500/25 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
                <img
                  src={activeStudent.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt={activeStudent.display_name}
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0e1a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Welcome back, {activeStudent.display_name}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  {activeStudent.experience_level}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeStudent.college} • <span className="text-slate-300">{activeStudent.course}</span>
              </p>
            </div>
          </div>

          {/* Quick Persona Switcher for Hackathon Judges */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 px-2 font-medium flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Switch Demo Profile:
            </span>
            <div className="flex gap-1">
              {INITIAL_STUDENTS.slice(0, 3).map((student) => (
                <button
                  key={student.id}
                  onClick={() => setActiveStudent(student)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeStudent.id === student.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {student.display_name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* METRIC CARDS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Discovered Opportunities</span>
              <Radio className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{opportunities.length}</div>
            <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Filtered for campus eligibility
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Closing in &lt; 5 Days</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400">{urgentOpportunities.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Requires immediate registration</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Active Applications</span>
              <Bookmark className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">{savedCount} Tracked</div>
            <div className="text-[11px] text-slate-400 mt-1">1 Interested • 1 Applied</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Compatible Teammates</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400">{INITIAL_STUDENTS.length - 1}</div>
            <div className="text-[11px] text-slate-400 mt-1">With &gt; 70% skill complementarity</div>
          </div>
        </div>

        {/* QUICK ACTIONS BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/notice-intelligence"
            className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/30 hover:border-blue-400/60 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Parse New Notice with Gemini
                </div>
                <div className="text-[11px] text-slate-400">Upload poster or paste WhatsApp forward</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/radar"
            className="p-4 rounded-xl bg-gradient-to-br from-purple-950/40 to-slate-900/60 border border-purple-500/30 hover:border-purple-400/60 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  Explore Opportunity Radar
                </div>
                <div className="text-[11px] text-slate-400">Search hackathons & internships</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/team-matcher"
            className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900/60 border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Find Project Teammates
                </div>
                <div className="text-[11px] text-slate-400">Deterministic scoring + Gemma rationale</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* TWO-COLUMN GRID: Urgent Deadlines & Recommended Teammates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 spans): Closing Deadlines */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Deadlines Closing Soon
              </h2>
              <Link href="/radar" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                View All on Radar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {urgentOpportunities.slice(0, 3).map((opp) => {
                const remaining = formatTimeRemaining(opp.deadline);
                return (
                  <div
                    key={opp.id}
                    className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                          {opp.category}
                        </span>
                        <span className="text-[10px] text-slate-400">• {opp.organization}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white leading-snug">{opp.title}</h3>
                      <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                        <span>Eligibility: {opp.eligibility.slice(0, 65)}...</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:flex-col sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{remaining.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedOpportunity(opp)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition-colors"
                        >
                          Gemma Insights
                        </button>
                        <a
                          href={opp.registration_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] text-white font-medium flex items-center gap-1"
                        >
                          <span>Apply</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (1 span): Recommended Peers for Collaboration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Recommended Peers
              </h2>
              <Link href="/team-matcher" className="text-xs text-cyan-400 hover:underline">
                Match Engine
              </Link>
            </div>

            <div className="space-y-3">
              {INITIAL_STUDENTS.filter((s) => s.id !== activeStudent.id)
                .slice(0, 3)
                .map((peer) => (
                  <div key={peer.id} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={peer.avatar_url || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"}
                          alt={peer.display_name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white">{peer.display_name}</div>
                          <div className="text-[10px] text-slate-400">{peer.preferred_roles[0]}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        88% Fit
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {peer.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/team-matcher?query=Need+${encodeURIComponent(peer.preferred_roles[0])}+and+${encodeURIComponent(peer.skills[0])}`}
                      className="block text-center py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-cyan-300 transition-colors"
                    >
                      View Compatibility Rationale →
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <GemmaRelevanceModal
        opportunity={selectedOpportunity}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}
