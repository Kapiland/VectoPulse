"use client";

import { useEffect, useState } from "react";
import { 
  Sparkles, 
  User, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  X, 
  GraduationCap, 
  Building, 
  Code2, 
  Briefcase,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Student } from "@/types";

export default function ProfilePage() {
  const [activeProfile, setActiveProfile] = useState<Student | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadProfiles() {
      try {
        const response = await fetch("/api/students");
        const result = await response.json();
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Could not load student profiles.");
        }
        if (isCurrent) setActiveProfile(result.data);
      } catch (error) {
        if (isCurrent) {
          setErrorMessage(error instanceof Error ? error.message : "Could not load student profiles.");
        }
      }
    }

    void loadProfiles();
    return () => {
      isCurrent = false;
    };
  }, []);

  const handleAddSkill = () => {
    if (!activeProfile || !newSkill.trim() || activeProfile.skills.includes(newSkill.trim())) return;
    setActiveProfile({
      ...activeProfile,
      skills: [...activeProfile.skills, newSkill.trim()],
    });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!activeProfile) return;
    setActiveProfile({
      ...activeProfile,
      skills: activeProfile.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddInterest = () => {
    if (!activeProfile || !newInterest.trim() || activeProfile.interests.includes(newInterest.trim())) return;
    setActiveProfile({
      ...activeProfile,
      interests: [...activeProfile.interests, newInterest.trim()],
    });
    setNewInterest("");
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    if (!activeProfile) return;
    setActiveProfile({
      ...activeProfile,
      interests: activeProfile.interests.filter((i) => i !== interestToRemove),
    });
  };

  const handleSaveProfile = async () => {
    if (!activeProfile) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeProfile),
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || "Could not save your profile.");
      }

      setActiveProfile(result.data);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (error) {
      setSuccessMessage(false);
      setErrorMessage(error instanceof Error ? error.message : "Could not save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeProfile) return <><Navbar /><main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center text-slate-300">{errorMessage || "Loading your profileâ€¦"}</main><Footer /></>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                STUDENT COLLABORATION IDENTITY
              </span>
              <span className="text-xs text-slate-400">Zero PII â€¢ Skills-First</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Profile & Preferences</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your profile powers deterministic teammate scoring and personalized opportunity relevance.
            </p>
          </div>

        </div>

        {/* Success toast banner */}
        {successMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Profile saved to your account.</span>
          </div>
        )}

        {errorMessage && (
          <div role="alert" className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-800">
            <img
              src={activeProfile.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
              alt={activeProfile.display_name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-blue-500/40 shadow-lg"
            />
            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white">{activeProfile.display_name}</h2>
                  <p className="text-xs text-slate-400">{activeProfile.college}</p>
                </div>
                <span className="self-center sm:self-auto text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  {activeProfile.experience_level} Engineer
                </span>
              </div>
              <p className="text-xs text-slate-300 pt-1">{activeProfile.course}</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Display Name:</label>
              <input
                type="text"
                value={activeProfile.display_name}
                onChange={(e) => setActiveProfile({ ...activeProfile, display_name: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level:</label>
              <select
                value={activeProfile.experience_level}
                onChange={(e) =>
                  setActiveProfile({
                    ...activeProfile,
                    experience_level: e.target.value as "Beginner" | "Intermediate" | "Advanced",
                  })
                }
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Beginner">Beginner (1st / 2nd Year)</option>
                <option value="Intermediate">Intermediate (Multiple Projects)</option>
                <option value="Advanced">Advanced (Hackathon Winner / Production)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College / University:</label>
              <input
                type="text"
                value={activeProfile.college}
                onChange={(e) => setActiveProfile({ ...activeProfile, college: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch & Degree:</label>
              <input
                type="text"
                value={activeProfile.course}
                onChange={(e) => setActiveProfile({ ...activeProfile, course: e.target.value })}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Technical Skills Editor */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Technical Skills (Used for Match Compatibility):
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {activeProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/70 text-cyan-300 border border-blue-500/30 text-xs"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add new skill (e.g. Next.js, FastAPI, Docker)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Project Interests */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Interests & Hackathon Themes:
            </label>
            <textarea
              rows={3}
              value={activeProfile.project_interests}
              onChange={(e) => setActiveProfile({ ...activeProfile, project_interests: e.target.value })}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={Boolean(activeProfile.is_discoverable)}
              onChange={(e) => setActiveProfile({ ...activeProfile, is_discoverable: e.target.checked })}
              className="mt-0.5 accent-cyan-500"
            />
            <span><strong className="block">Show my profile in Team Matcher</strong><span className="mt-1 block text-xs text-slate-400">Only signed-in students can see your name, college, skills, and preferred roles. Email and password stay private.</span></span>
          </label>

          {/* Privacy & Security Callout */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-blue-500/20 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-300 font-semibold block mb-0.5">Privacy First Guarantee</span>
              Your email address and password are never shown in student listings. Profile visibility is off until you enable it above.
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Profile"}</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

