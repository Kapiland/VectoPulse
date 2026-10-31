"use client";

import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Radio, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  TrendingUp, 
  Award, 
  BellRing,
  Share2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-28 overflow-hidden">
          {/* Ambient Gradient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-xs text-cyan-300 mb-8 backdrop-blur-md shadow-sm shadow-blue-500/20 animate-in fade-in duration-500">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Campus Opportunity Intelligence & Collaboration Engine</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-200 text-[10px] font-mono font-semibold">
                Dual AI: Gemini + Gemma
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
              Never Miss an Opportunity.{" "}
              <span className="gradient-text-hero">
                Find Your People.
              </span>{" "}
              Build Something Real.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              Find campus opportunities in one place, keep your applications organized, and meet students with skills your projects need.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/auth?mode=signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Create your account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/notice-intelligence"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Parse Notice with Gemini</span>
              </Link>

              <Link
                href="/radar"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 text-slate-300 hover:text-white text-sm font-medium transition-all"
              >
                <Radio className="w-4 h-4 text-purple-400" />
                <span>Explore Radar</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Core product capabilities */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80 text-left">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-lg font-bold text-white mb-1">Your account</div>
                <div className="text-xs text-slate-400">Email sign in</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-lg font-bold text-cyan-400 mb-1">Live data</div>
                <div className="text-xs text-slate-400">Saved in Supabase</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-lg font-bold text-purple-400 mb-1">AI assisted</div>
                <div className="text-xs text-slate-400">Notice and opportunity analysis</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="text-lg font-bold text-emerald-400 mb-1">Student profiles</div>
                <div className="text-xs text-slate-400">Find collaborators by skills</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 CORE FEATURES SECTION */}
        <section className="py-20 relative border-t border-slate-800/60 bg-[#060913]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                Engineered for Student Velocity
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2 mb-4">
                Three Purpose-Built AI Superpowers
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Strictly focused on the three essential workflows college builders need to discover, track, and win.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: AI Notice Intelligence */}
              <div className="glass-panel glass-panel-hover rounded-2xl p-7 flex flex-col justify-between border-blue-500/20">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-5 text-blue-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                      Gemini 2.5 Flash
                    </span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Prompt-Safe
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">AI Notice Intelligence</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Converts blurry notice board photos, dense HOD PDFs, and messy WhatsApp forwards into clean, structured opportunities. 
                    Extracts deadlines, eligibility criteria, tech stacks, and registration links with zero manual transcription.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      Multimodal image & PDF OCR comprehension
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      Untrusted payload prompt-injection sandbox
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      Interactive editable review before saving
                    </li>
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-800">
                  <Link
                    href="/notice-intelligence"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Launch Notice Extractor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Feature 2: Smart Opportunity Radar */}
              <div className="glass-panel glass-panel-hover rounded-2xl p-7 flex flex-col justify-between border-purple-500/20">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400">
                    <Radio className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Gemma 4 AI Insights
                    </span>
                    <span className="text-[11px] text-purple-300 font-mono">Hindi + English</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Smart Opportunity Radar</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    A centralized, prioritized feed of hackathons, internships, scholarships, and campus workshops. 
                    Includes live deadline countdowns, verification status badges, and Gemma-powered career relevance explanations.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      7 distinct categories with real-time filters
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      Officially Sourced vs User-Submitted badges
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      Application lifecycle (Interested, Applied, Done)
                    </li>
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-800">
                  <Link
                    href="/radar"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>Browse Opportunity Radar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Feature 3: AI Team Matcher */}
              <div className="glass-panel glass-panel-hover rounded-2xl p-7 flex flex-col justify-between border-cyan-500/20">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center mb-5 text-cyan-400">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Deterministic + Gemma
                    </span>
                    <span className="text-[11px] text-slate-400">Mathematical Fit</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">AI Team Matcher</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Find complementary hackathon partners without spamming college WhatsApp groups. 
                    Uses a transparent mathematical scoring algorithm paired with Gemma natural-language explanations of synergy.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      Calculates exact skill overlap & complementary roles
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      Conversational Hindi/Hinglish synergy summary
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      Instant 1-click collaboration invites
                    </li>
                  </ul>
                </div>
                <div className="pt-6 mt-6 border-t border-slate-800">
                  <Link
                    href="/team-matcher"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Match Teammates Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                How CampusSignal Works in 4 Steps
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                From an obscure WhatsApp forward to a registered team on the podium.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Ingest Unstructured Notice",
                  desc: "Paste WhatsApp text or upload a poster/PDF circular from your phone.",
                  tag: "Multi-Source",
                },
                {
                  step: "02",
                  title: "Gemini Structured Extraction",
                  desc: "Gemini decrypts deadlines, eligibility rules, and tech stacks into verified JSON.",
                  tag: "Prompt-Guarded",
                },
                {
                  step: "03",
                  title: "Radar Priority Tracking",
                  desc: "Opportunity is categorized, deadline-sorted, and enriched with Gemma relevance.",
                  tag: "Zero Missed Dates",
                },
                {
                  step: "04",
                  title: "Algorithmic Team Assembly",
                  desc: "Describe your project vision to discover complementary peer teammates instantly.",
                  tag: "Synergy Matched",
                },
              ].map((item) => (
                <div key={item.step} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 relative group hover:border-blue-500/40 transition-colors">
                  <div className="text-3xl font-extrabold text-slate-800 group-hover:text-blue-500/30 transition-colors mb-3 font-mono">
                    {item.step}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 mb-2 inline-block">
                    {item.tag}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAST-TRACK JUDGE CTA BANNER */}
        <section className="py-16 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 border border-blue-500/30 bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-purple-950/70 shadow-2xl shadow-blue-500/10">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 inline-block mb-3">
                    Hackathon Evaluation Ready
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Create your student workspace
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                    Sign up to save opportunities, build your profile, and find collaborators from the student community.
                  </p>
                </div>
                <Link
                  href="/auth?mode=signup"
                  className="shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Create account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
