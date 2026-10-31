"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  Users, 
  Search, 
  CheckCircle2, 
  UserPlus, 
  Mail, 
  Send, 
  Flame, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  RefreshCw,
  ExternalLink,
  Award,
  Layers,
  HeartHandshake
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Student, TeamMatchCandidate } from "@/types";

async function requestTeamMatches(query: string): Promise<TeamMatchCandidate[]> {
  const res = await fetch("/api/team-match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || "Could not find teammates.");
  return json.data ?? [];
}

function TeamMatcherContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query");

  return <TeamMatcherForm key={initialQuery} initialQuery={initialQuery} />;
}

function TeamMatcherForm({ initialQuery }: { initialQuery: string | null }) {
  const [activeRequester, setActiveRequester] = useState<Student | null>(null);
  const [requirementQuery, setRequirementQuery] = useState(initialQuery || "");
  const [isMatching, setIsMatching] = useState(false);
  const [matchedCandidates, setMatchedCandidates] = useState<TeamMatchCandidate[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sharedStudentIds, setSharedStudentIds] = useState<Record<string, boolean>>({});
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "hi">("en");

  const handleFindMatches = async (queryText = requirementQuery) => {
    if (!queryText.trim()) return;

    setIsMatching(true);
    try {
      setErrorMessage("");
      const candidates = await requestTeamMatches(queryText);
      setMatchedCandidates(candidates);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not find teammates.");
    } finally {
      setIsMatching(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;

    async function loadProfileAndMatches() {
      try {
        const response = await fetch("/api/students");
        const result = await response.json();
        if (!response.ok || !result.success || !result.data) throw new Error(result.error || "Complete your profile first.");
        if (isCurrent) setActiveRequester(result.data);
        if (initialQuery) {
          const matches = await requestTeamMatches(initialQuery);
          if (isCurrent) setMatchedCandidates(matches);
        }
      } catch (error) {
        if (isCurrent) setErrorMessage(error instanceof Error ? error.message : "Could not load your profile.");
      }
    }

    void loadProfileAndMatches();
    return () => {
      isCurrent = false;
    };
  }, [initialQuery]);

  const handleShareInvite = async (studentId: string, studentName: string) => {
    const inviteUrl = new URL("/team-matcher", window.location.origin);
    inviteUrl.searchParams.set("query", requirementQuery);
    const shareData = {
      title: `Join ${activeRequester?.display_name || "me"} on CampusSignal`,
      text: `${studentName}, let's collaborate on this project: ${requirementQuery}`,
      url: inviteUrl.toString(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
      setSharedStudentIds((prev) => ({ ...prev, [studentId]: true }));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setErrorMessage("Could not share the project invite. Check browser sharing permissions and try again.");
    }
  };

  const PRESET_QUERIES = [
    {
      label: "AI Hackathon: Frontend + UI/UX",
      query: "Looking for a Next.js frontend developer and Figma UI/UX designer for Smart India Hackathon.",
    },
    {
      label: "Cloud Project: DevOps + Go",
      query: "Need a DevOps engineer with Docker, Kubernetes, and Go for high-scale distributed backend.",
    },
    {
      label: "Mobile Campus App: Flutter",
      query: "Seeking a Flutter & mobile developer to build cross-platform campus student utility tools.",
    },
    {
      label: "ML Research: PyTorch + Math",
      query: "Need an AI/ML developer with strong PyTorch and mathematical foundations for research competition.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {errorMessage && <div role="alert" className="mb-5 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-sm text-red-300">{errorMessage} <Link href="/profile" className="font-semibold underline">Open your profile</Link></div>}
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              FEATURE 3: AI TEAM MATCHER
            </span>
            <span className="text-xs text-purple-400 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" /> Gemma Natural Language Rationale
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Connect with Compatible Hackathon & Project Teammates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Stop spamming WhatsApp groups. Our deterministic engine computes mathematical skill and role overlap, 
            while Gemma synthesizes human-friendly collaboration synergy.
          </p>
        </div>

        {/* ACTIVE REQUESTER PROFILE BAR & PERSONA SWITCHER */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={activeRequester?.avatar_url || "/avatar-placeholder.svg"}
              alt={activeRequester?.display_name || "Student profile"}
              className="w-11 h-11 rounded-xl object-cover border border-blue-500/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Your profile:</span>
                <span className="text-sm font-bold text-white">{activeRequester?.display_name || "Loading profileâ€¦"}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-cyan-300">
                  {activeRequester?.preferred_roles?.[0] || "Add a preferred role"}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Skills: {(activeRequester?.skills ?? []).slice(0, 3).join(", ")} â€¢ {activeRequester?.college || "Add your college"}
              </div>
            </div>
          </div>

        </div>

        {/* REQUIREMENT SEARCH & INPUT CARD */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 via-blue-950/20 to-purple-950/20 border border-blue-500/20 shadow-xl mb-8 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              What kind of teammates do you need for your project?
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={requirementQuery}
                onChange={(e) => setRequirementQuery(e.target.value)}
                placeholder="Describe your project needs (e.g. 'I need a Python backend developer and UI/UX designer for an AI hackathon project')..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Quick Preset Suggestion Chips */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              Try 1-Click Collaboration Prompts:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_QUERIES.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setRequirementQuery(preset.query);
                    handleFindMatches(preset.query);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700/80 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            {/* Language toggle for Gemma explanations */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Explanation Language:</span>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setSelectedLanguage("en")}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    selectedLanguage === "en" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setSelectedLanguage("hi")}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    selectedLanguage === "hi" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  à¤¹à¤¿à¤¨à¥à¤¦à¥€ / Hinglish
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                handleFindMatches();
              }}
              disabled={isMatching || !requirementQuery.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              {isMatching ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculating Matching Scores...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Find Compatible Teammates</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CANDIDATES RESULTS LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Recommended Teammates ({matchedCandidates.length})</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                Ranked by Compatibility
              </span>
            </h2>
            <span className="text-[11px] text-slate-400">
              Deterministic Jaccard Formula + Gemma AI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matchedCandidates.map((candidate) => {
              const student = candidate.student;
              const isShared = sharedStudentIds[student.id];

              return (
                <div
                  key={student.id}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border-slate-800 hover:border-cyan-500/40 transition-all"
                >
                  {/* Top: Student Header & Compatibility Gauge */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar_url || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"}
                          alt={student.display_name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight">
                            {student.display_name}
                          </h3>
                          <div className="text-[11px] text-slate-400 mt-0.5">{student.course}</div>
                          <div className="text-[10px] text-cyan-400">{student.college}</div>
                        </div>
                      </div>

                      {/* Compatibility Gauge Badge */}
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300">
                          <Flame className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                          <span className="text-sm font-extrabold">{candidate.compatibility_score}%</span>
                        </div>
                        <span className="text-[9px] text-slate-500 mt-0.5">Compatibility</span>
                      </div>
                    </div>

                    {/* Roles & Experience Level */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {student.experience_level}
                      </span>
                      {student.preferred_roles.map((role) => (
                        <span
                          key={role}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/25"
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    {/* Matching Skills vs Complementary Skills */}
                    <div className="space-y-2 mb-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold text-emerald-400 block mb-1">
                          âœ“ Direct Matching Skills:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {candidate.matching_skills.map((s) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-semibold text-cyan-400 block mb-1">
                          + Complementary Superpowers:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {candidate.missing_skills.map((s) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* GEMMA NATURAL LANGUAGE EXPLANATION BOX */}
                    <div className="p-3.5 rounded-xl bg-purple-950/25 border border-purple-500/25 mb-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          Gemma Synergy Analysis
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                          Explainable AI
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed">
                        {selectedLanguage === "en"
                          ? candidate.explanation.english
                          : candidate.explanation.hindi_simple || candidate.explanation.english}
                      </p>

                      <div className="text-[11px] text-slate-400 pt-1 border-t border-purple-500/20">
                        <span className="text-slate-500 text-[10px] block">Suggested Team Synergy:</span>
                        <span className="text-cyan-300 font-medium">{candidate.explanation.suggested_synergy}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Connect / Invite Action */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400 truncate">
                      Interests: {student.interests.slice(0, 2).join(", ")}
                    </span>

                    <button
                      onClick={() => void handleShareInvite(student.id, student.display_name)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isShared
                          ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 cursor-pointer"
                      }`}
                    >
                      {isShared ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Invite link shared</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Share project invite</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {requirementQuery.trim() && !isMatching && matchedCandidates.length === 0 && !errorMessage && (
            <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/60 p-6 text-center">
              <Users className="mx-auto mb-3 h-7 w-7 text-cyan-300" />
              <h3 className="text-sm font-semibold text-white">No teammate profiles are discoverable yet</h3>
              <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-slate-400">
                Recommendations use real student profiles. Ask teammates to create an account and enable profile discovery, or enable it in your own profile so other students can find you.
              </p>
              <Link href="/profile" className="mt-4 inline-flex rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500">
                Manage profile discovery
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TeamMatcherPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-400 text-xs">Loading Team Matcher...</div>}>
      <TeamMatcherContent />
    </Suspense>
  );
}

