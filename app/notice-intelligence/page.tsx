"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  Edit3, 
  Save, 
  Radio, 
  ExternalLink,
  Cpu,
  RefreshCw,
  Plus,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import confetti from "canvas-confetti";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExtractedNoticeResponse, OpportunityCategory } from "@/types";
import { CATEGORIES } from "@/lib/schemas";

function NoticeIntelligenceForm() {

  const [activeTab, setActiveTab] = useState<"text" | "upload">("text");
  const [inputText, setInputText] = useState("");
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractedNoticeResponse | null>(null);
  const [editableForm, setEditableForm] = useState<ExtractedNoticeResponse | null>(null);
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Handle file drag/drop or input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("File exceeds maximum size of 8MB.");
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedImageBase64(base64);
      setActiveTab("upload");
    };
    reader.readAsDataURL(file);
  };

  // Perform Gemini AI Extraction
  const handleExtract = async () => {
    if (!inputText.trim() && !uploadedImageBase64) {
      setErrorMessage("Please paste notice text or upload a poster/circular image.");
      return;
    }

    setIsExtracting(true);
    setErrorMessage(null);
    setSavedSuccessId(null);

    try {
      const response = await fetch("/api/ai/extract-notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          imageBase64: uploadedImageBase64,
          mimeType: uploadedImageBase64?.split(";")[0]?.replace("data:", "") || "image/jpeg",
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || json.message || "Extraction failed");
      }

      setExtractionResult(json.data);
      setEditableForm({ ...json.data });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to extract notice";
      setErrorMessage(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  // Save to Opportunity Radar
  const handleSaveToRadar = async () => {
    if (!editableForm) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const payload = {
        title: editableForm.title,
        organization: editableForm.organization,
        category: editableForm.category,
        description: editableForm.description,
        eligibility: editableForm.eligibility,
        required_skills: editableForm.required_skills,
        deadline: editableForm.deadline,
        event_date: editableForm.event_date,
        location: editableForm.location,
        registration_url: editableForm.registration_url,
        source_type: "WhatsApp forward",
        verification_status: "User submitted",
        required_documents: editableForm.required_documents,
        important_instructions: editableForm.important_instructions,
      };

      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to publish opportunity");
      }

      setSavedSuccessId(json.data.id);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#3b82f6", "#8b5cf6", "#06b6d4"],
        });
      } catch {
        // ignore confetti failure
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not save opportunity";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Add skill tag
  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !editableForm) return;
    if (!editableForm.required_skills.includes(newSkillInput.trim())) {
      setEditableForm({
        ...editableForm,
        required_skills: [...editableForm.required_skills, newSkillInput.trim()],
      });
    }
    setNewSkillInput("");
  };

  // Remove skill tag
  const handleRemoveSkill = (skillToRemove: string) => {
    if (!editableForm) return;
    setEditableForm({
      ...editableForm,
      required_skills: editableForm.required_skills.filter((s) => s !== skillToRemove),
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              FEATURE 1: AI NOTICE INTELLIGENCE
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Prompt-Injection Boundary Guard
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Convert Scattered Campus Notices into Structured Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Upload circular PDFs, poster flyers, or paste raw WhatsApp forwards. 
            Gemini Multimodal AI isolates instructions and outputs verified, typed schema fields.
          </p>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success notification banner */}
        {savedSuccessId && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-semibold text-white">
                  Saved to Smart Opportunity Radar.
                </div>
                <div className="text-[11px] text-emerald-300">
                  This opportunity is stored in your connected database.
                </div>
              </div>
            </div>
            <Link
              href="/radar"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-colors"
            >
              <span>View on Radar</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* TWO COLUMN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Ingestion Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
              {/* Tab Selector */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("text")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === "text"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    Paste Text / WhatsApp
                  </button>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeTab === "upload"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    Upload Poster / PDF
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">Gemini 3.8 Flash</span>
              </div>


              {/* Tab 1: Text Area */}
              {activeTab === "text" && (
                <div className="space-y-3">
                  <div className="relative">
                    <textarea
                      rows={11}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste raw WhatsApp circular, departmental forward, or notice board announcement text here..."
                      className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
                    />
                    <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 font-mono">
                      {inputText.length} characters
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Upload Image / PDF */}
              {activeTab === "upload" && (
                <div className="space-y-4">
                  <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-blue-500/60 transition-colors bg-slate-950/40">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-8 h-8 text-cyan-400 mb-2" />
                      <div className="text-xs font-semibold text-white">Click to upload poster or drag & drop</div>
                      <div className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP, or PDF (up to 8MB)</div>
                    </div>
                  </div>

                  {uploadedImageBase64 && (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-slate-300 font-mono truncate max-w-[200px]">
                          {uploadedFileName || "Uploaded document"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedImageBase64(null);
                          setUploadedFileName(null);
                        }}
                        className="text-slate-500 hover:text-red-400 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Also show text area if supplementary text needed */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Optional caption or context:</label>
                    <textarea
                      rows={3}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="e.g. Received on 3rd year CSE WhatsApp group..."
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* Security Prompt Guard Badge */}
              <div className="mt-4 p-2.5 rounded-lg bg-slate-950/80 border border-blue-500/20 text-[10px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Payload is strictly encapsulated in <code>&lt;UNTRUSTED_CAMPUS_DOCUMENT_PAYLOAD&gt;</code> to prevent prompt injection or instruction hijacking.
                </span>
              </div>

              {/* Primary Extract Action Button */}
              <button
                onClick={handleExtract}
                disabled={isExtracting || (!inputText && !uploadedImageBase64)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini Multimodal OCR Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Extract Structured Intelligence</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Review & Edit Form (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl min-h-[500px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-cyan-400" />
                      Structured Opportunity Review
                    </h2>
                    {editableForm?.is_live_ai ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Live Gemini Output
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-slate-400">Human-In-The-Loop Validation</span>
                </div>

                {!editableForm ? (
                  /* Empty state before extraction */
                  <div className="h-80 flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <FileText className="w-12 h-12 mb-3 text-slate-700 animate-pulse" />
                    <p className="text-xs text-slate-400 max-w-sm mb-2">
                      No notice extracted yet. Paste a WhatsApp forward on the left or upload a circular.
                    </p>
                  </div>
                ) : (
                  /* Form fields */
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Opportunity Title:
                      </label>
                      <input
                        type="text"
                        value={editableForm.title}
                        onChange={(e) => setEditableForm({ ...editableForm, title: e.target.value })}
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Row: Category + Organization */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">Category:</label>
                        <select
                          value={editableForm.category}
                          onChange={(e) =>
                            setEditableForm({
                              ...editableForm,
                              category: e.target.value as OpportunityCategory,
                            })
                          }
                          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Organization:
                        </label>
                        <input
                          type="text"
                          value={editableForm.organization}
                          onChange={(e) =>
                            setEditableForm({ ...editableForm, organization: e.target.value })
                          }
                          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Eligibility Criteria */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Eligibility Criteria:
                      </label>
                      <input
                        type="text"
                        value={editableForm.eligibility}
                        onChange={(e) =>
                          setEditableForm({ ...editableForm, eligibility: e.target.value })
                        }
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Row: Deadline + Registration Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Registration Deadline:
                        </label>
                        <input
                          type="text"
                          value={editableForm.deadline}
                          onChange={(e) =>
                            setEditableForm({ ...editableForm, deadline: e.target.value })
                          }
                          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Registration URL:
                        </label>
                        <input
                          type="url"
                          value={editableForm.registration_url}
                          onChange={(e) =>
                            setEditableForm({ ...editableForm, registration_url: e.target.value })
                          }
                          className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Skills Tag Editor */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Required Skills / Tech Stack:
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {editableForm.required_skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/70 text-cyan-300 border border-blue-500/30 text-xs"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-slate-400 hover:text-red-400"
                            >
                              Ã—
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add skill tag (e.g. Next.js, Python)..."
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                          className="flex-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Description / Synopsis:
                      </label>
                      <textarea
                        rows={3}
                        value={editableForm.description}
                        onChange={(e) =>
                          setEditableForm({ ...editableForm, description: e.target.value })
                        }
                        className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Bottom Save Action */}
              {editableForm && (
                <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    Model: <span className="text-cyan-400 font-mono">{editableForm.model_used}</span>
                  </div>

                  <button
                    onClick={handleSaveToRadar}
                    disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Radar...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save to Opportunity Radar</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NoticeIntelligencePage() { return <NoticeIntelligenceForm />; }


