"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Clock,
  ArrowRight,
  FileText,
  Radio,
  Users,
  Bookmark,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GemmaRelevanceModal from "@/components/GemmaRelevanceModal";
import DeadlineReminderPanel from "@/components/DeadlineReminderPanel";
import { Opportunity, Student } from "@/types";
import { SavedOpportunity } from "@/types";
import { formatTimeRemaining } from "@/lib/utils";

export default function DashboardPage() {
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [savedOpportunities, setSavedOpportunities] = useState<SavedOpportunity[]>([]);

  // Fetch live opportunities from API
  useEffect(() => {
    async function loadData() {
      try {
        const [opportunitiesResponse, profileResponse, studentsResponse, savedResponse] = await Promise.all([
          fetch("/api/opportunities"),
          fetch("/api/students"),
          fetch("/api/students?directory=1"),
          fetch("/api/saved-opportunities"),
        ]);
        const [opportunitiesResult, profileResult, studentsResult, savedResult] = await Promise.all([
          opportunitiesResponse.json(),
          profileResponse.json(),
          studentsResponse.json(),
          savedResponse.json(),
        ]);

        if (opportunitiesResponse.ok && opportunitiesResult.success && opportunitiesResult.data) {
          setOpportunities(opportunitiesResult.data);
        }
        if (profileResponse.ok && profileResult.success && profileResult.data) setActiveStudent(profileResult.data);
        if (studentsResponse.ok && studentsResult.success && Array.isArray(studentsResult.data)) setStudents(studentsResult.data);
        if (savedResponse.ok && savedResult.success) {
          setSavedCount(savedResult.count ?? 0);
          setSavedOpportunities(savedResult.data ?? []);
        }
      } catch {
        setOpportunities([]);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => setCurrentTime(Date.now());
    updateCurrentTime();
    const intervalId = window.setInterval(updateCurrentTime, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const urgentOpportunities = opportunities.filter((opp) => {
    if (currentTime === null) return false;
    const remaining = new Date(opp.deadline).getTime() - currentTime;
    return remaining > 0 && remaining < 6 * 24 * 60 * 60 * 1000;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Student Welcome Banner & Persona Switcher */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900/80 to-purple-950/60 border border-blue-500/25 shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20">
                <Image
                  src={activeStudent?.avatar_url || "/avatar-placeholder.svg"}
                  alt={activeStudent?.display_name || "Student profile"}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0a0e1a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">Welcome back, {activeStudent?.display_name || "Student"}</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  {activeStudent?.experience_level || "Complete your profile"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {activeStudent?.college || "Add your college"} • <span className="text-slate-300">{activeStudent?.course || "Add your course"}</span>
              </p>
            </div>
          </div>

        </div>

        {/* METRIC CARDS ROW */}
        <DeadlineReminderPanel opportunities={opportunities} saved={savedOpportunities} />

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
            <div className="text-2xl font-bold text-cyan-400">{Math.max(0, students.length - 1)}</div>
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
              {students.filter((s) => s.id !== activeStudent?.id)
                .slice(0, 3)
                .map((peer) => (
                  <div key={peer.id} className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={peer.avatar_url || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"}
                          alt={peer.display_name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white">{peer.display_name}</div>
                          <div className="text-[10px] text-slate-400">{peer.preferred_roles[0]}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Student profile
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
      <GemmaRelevanceModal
        opportunity={selectedOpportunity}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
      />
    </div>
  );
}
