import { GoogleGenAI } from "@google/genai";
import { AI_CONFIG } from "./config";
import { Student } from "@/types";

export interface GemmaExplanationResult {
  english: string;
  hindi_simple?: string;
  key_strengths: string[];
  suggested_synergy: string;
  model_used: string;
  is_live_ai: boolean;
  status_message?: string;
}

export interface GemmaRelevanceResult {
  summary_en: string;
  summary_hi?: string;
  recommended_for: string;
  urgency_level: "High" | "Medium" | "Low";
  model_used: string;
  is_live_ai: boolean;
}

/**
 * Gemma Model Adapter for Team Match Justifications
 */
export async function generateMatchExplanationWithGemma(params: {
  requesterNeed: string;
  candidate: Student;
  compatibilityScore: number;
  matchingSkills: string[];
  missingSkills: string[];
}): Promise<GemmaExplanationResult> {
  const { requesterNeed, candidate, compatibilityScore, matchingSkills, missingSkills } = params;

  if (AI_CONFIG.isLiveKeyConfigured) {
    try {
      const ai = new GoogleGenAI({ apiKey: AI_CONFIG.apiKey });
      const modelName = AI_CONFIG.defaultGemmaModel;

      const prompt = `You are Gemma, an AI mentor specialized in college student project collaborations and hackathon team formation.
Task: Explain why student candidate "${candidate.display_name}" is a strong teammate match for the requirement: "${requesterNeed}".

Candidate Details:
- College & Course: ${candidate.college}, ${candidate.course}
- Experience Level: ${candidate.experience_level}
- Primary Skills: ${candidate.skills.join(", ")}
- Preferred Roles: ${candidate.preferred_roles.join(", ")}
- Shared Overlap Skills: ${matchingSkills.join(", ") || "General problem solving"}
- Complementary Growth Skills: ${missingSkills.join(", ") || "Full spectrum support"}
- Calculated Compatibility Score: ${compatibilityScore}%

INSTRUCTIONS:
Provide a strictly valid JSON response without markdown fences:
{
  "english": "2-3 crisp sentences highlighting exact project synergy and complementary technical strengths.",
  "hindi_simple": "1-2 sentences in simple conversational Hinglish/Hindi explaining why they are a great match.",
  "key_strengths": ["string", "string", "string"],
  "suggested_synergy": "1 sentence proposing what feature or component they should own together."
}`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [prompt],
      });

      const raw = response.text || "";
      const cleaned = raw.replace(/^```json/g, "").replace(/^```/g, "").replace(/```$/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return {
        english: parsed.english || `${candidate.display_name} offers strong ${matchingSkills.slice(0, 3).join(", ")} expertise matching your project goals.`,
        hindi_simple: parsed.hindi_simple || `${candidate.display_name} ke paas relevant skills hain aur ye hackathon project me tezi se build kar sakte hain.`,
        key_strengths: Array.isArray(parsed.key_strengths) ? parsed.key_strengths : matchingSkills,
        suggested_synergy: parsed.suggested_synergy || `Collaborate on core product features utilizing ${matchingSkills[0] || "modern stacks"}.`,
        model_used: modelName,
        is_live_ai: true,
      };
    } catch (error: unknown) {
      console.error("Gemma match explanation failed:", error);
      throw new Error("Gemma request failed. Check the API key, selected model, and quota.");
    }
  }

  throw new Error("GEMINI_API_KEY is required for teammate explanations.");
}

/**
 * Gemma Model Adapter for Opportunity Relevance & Vernacular Simplification
 */
export async function explainOpportunityRelevanceWithGemma(params: {
  title: string;
  category: string;
  organization: string;
  eligibility: string;
  skills: string[];
}): Promise<GemmaRelevanceResult> {
  const { title, category, organization, eligibility, skills } = params;

  if (AI_CONFIG.isLiveKeyConfigured) {
    try {
      const ai = new GoogleGenAI({ apiKey: AI_CONFIG.apiKey });
      const modelName = AI_CONFIG.defaultGemmaModel;

      const prompt = `You are Gemma, an AI advisor for Indian college students.
Analyze this opportunity:
Title: ${title} (${category})
Organization: ${organization}
Eligibility: ${eligibility}
Skills: ${skills.join(", ")}

Respond with strictly valid JSON only:
{
  "summary_en": "2 sentences explaining the practical career value of this opportunity for engineering and tech students.",
  "summary_hi": "1 sentence in simple conversational Hindi/Hinglish summarizing who should definitely apply.",
  "recommended_for": "Target persona (e.g. 3rd-year full-stack builders, aspiring AI researchers)",
  "urgency_level": "High" | "Medium" | "Low"
}`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [prompt],
      });

      const raw = response.text || "";
      const cleaned = raw.replace(/^```json/g, "").replace(/^```/g, "").replace(/```$/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return {
        summary_en: parsed.summary_en,
        summary_hi: parsed.summary_hi,
        recommended_for: parsed.recommended_for || "Students with matching technical interest",
        urgency_level: parsed.urgency_level || "Medium",
        model_used: modelName,
        is_live_ai: true,
      };
    } catch (error: unknown) {
      console.error("Gemma opportunity relevance failed:", error);
      throw new Error("Gemma request failed. Check the API key, selected model, and quota.");
    }
  }

  throw new Error("GEMINI_API_KEY is required for opportunity analysis.");
}

