"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Bookmark, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  Plus, 
  ArrowUpDown,
  Radio,
  FileText,
  BookmarkCheck
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoModal from "@/components/DemoModal";
import GemmaRelevanceModal from "@/components/GemmaRelevanceModal";
import { Opportunity, OpportunityCategory, VerificationStatus, ApplicationStatus } from "@/types";
import { INITIAL_OPPORTUNITIES } from "@/lib/data/mock-data";
import { formatTimeRemaining } from "@/lib/utils";

const CATEGORY_TABS = [
  "All",
  "Hackathons",
  "Internships",
  "Workshops",
  "Scholarships",
  "Competitions",
  "Campus events",
  "Tech conferences",
];

const VERIFICATION_OPTIONS = ["All", "Officially sourced", "User submitted", "Unverified"];

export default function OpportunityRadarPage() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVerification, setSelectedVerification] = useState("All");
  const [sortBy, setSortBy] = useState<"deadline" | "newest">("deadline");
  const [selectedOpportunityForGemma, setSelectedOpportunityForGemma] = useState<Opportunity | null>(null);

  // Application status mapping: opportunityId -> status
  const [applicationStatuses, setApplicationStatuses] = useState<Record<string, ApplicationStatus>>({
    "opp-sih-2026": "Interested",
    "opp-msr-intern-2026": "Applied",
  });

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (selectedVerification !== "All") params.append("verification", selectedVerification);
      if (searchQuery) params.append("q", searchQuery);
      params.append("sort", sortBy);

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setOpportunities(json.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCategory, selectedVerification, sortBy, searchQuery]);

  // Handle status update (Interested -> Applied -> Completed)
  const handleUpdateStatus = async (oppId: string, newStatus: ApplicationStatus) => {
    setApplicationStatuses((prev) => ({
      ...prev,
      [oppId]: newStatus,
    }));

    try {
      await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          student_id: "11111111-1111-1111-1111-111111111111",
          opportunity_id: oppId,
          status: newStatus,
        }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenDemo={() => setDemoModalOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                FEATURE 2: SMART OPPORTUNITY RADAR
              </span>
              <span className="text-xs text-slate-400">Deterministic Filter + Gemma Insights</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Campus Opportunity Radar
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live feed of hackathons, internships, scholarships, and campus workshops prioritized by deadline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/notice-intelligence"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Notice</span>
            </Link>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, organization, or required skills (e.g. SIH, Python, Next.js)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Verification Status Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 whitespace-nowrap">Source:</span>
              <select
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {VERIFICATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All" ? "All Sources" : opt}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <button
                onClick={() => setSortBy(sortBy === "deadline" ? "newest" : "deadline")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 whitespace-nowrap transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sort: {sortBy === "deadline" ? "Closing Soon" : "Newest"}</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-purple-600/30 text-purple-200 border border-purple-500/50 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
          <div>
            Showing <span className="font-semibold text-white">{opportunities.length}</span> opportunities
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Officially Sourced
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> User Submitted
            </span>
          </div>
        </div>

        {/* OPPORTUNITY CARDS GRID */}
        {opportunities.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400">
            <Radio className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-1">No opportunities match your filter</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Try adjusting your search query, selecting &quot;All&quot; categories, or upload a new notice.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedVerification("All");
                setSearchQuery("");
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {opportunities.map((opp) => {
              const remaining = formatTimeRemaining(opp.deadline);
              const currentStatus = applicationStatuses[opp.id];

              return (
                <div
                  key={opp.id}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between border-slate-800/80 hover:border-purple-500/40 transition-all group"
                >
                  {/* Card Top: Badges */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                        {opp.category}
                      </span>

                      {/* Verification Status Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                          opp.verification_status === "Officially sourced"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : opp.verification_status === "User submitted"
                            ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {opp.verification_status}
                      </span>
                    </div>

                    {/* Title & Organization */}
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-1.5">
                      {opp.title}
                    </h3>
                    <div className="text-xs text-slate-400 font-medium mb-3">{opp.organization}</div>

                    {/* Deadline Countdown & Location */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-3 text-[11px]">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-semibold">{remaining.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                        <span className="truncate">{opp.location}</span>
                      </div>
                    </div>

                    {/* Description snippet */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                      {opp.description}
                    </p>

                    {/* Eligibility */}
                    <div className="text-[11px] text-slate-400 mb-3">
                      <span className="text-slate-500 font-semibold block text-[10px] uppercase tracking-wider">
                        Eligibility:
                      </span>
                      <span className="line-clamp-1 text-slate-300">{opp.eligibility}</span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {opp.required_skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {opp.required_skills.length > 4 && (
                        <span className="text-[10px] text-slate-500 self-center">
                          +{opp.required_skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Status Tracker & Action Buttons */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                    {/* Application Status Toggle */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">My Status:</span>
                      <div className="flex gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                        {(["Interested", "Applied", "Completed"] as ApplicationStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleUpdateStatus(opp.id, status)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                              currentStatus === status
                                ? "bg-purple-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-300"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Gemma Insights & External Link */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOpportunityForGemma(opp)}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Gemma AI Rationale</span>
                      </button>

                      <a
                        href={opp.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 transition-all"
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
        )}
      </main>

      <Footer />
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
      <GemmaRelevanceModal
        opportunity={selectedOpportunityForGemma}
        isOpen={Boolean(selectedOpportunityForGemma)}
        onClose={() => setSelectedOpportunityForGemma(null)}
      />
    </div>
  );
}
