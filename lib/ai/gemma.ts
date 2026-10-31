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
      const errMsg = error instanceof Error ? error.message : String(error);
      console.warn(`Gemma API call (${AI_CONFIG.defaultGemmaModel}) encountered an issue:`, errMsg);
      // Transparent reporting as required by Section 4
      return generateHeuristicMatchExplanation(candidate, requesterNeed, matchingSkills, compatibilityScore, `Gemma model "${AI_CONFIG.defaultGemmaModel}" unreachable via quota: ${errMsg.slice(0, 80)}. Using heuristic adapter.`);
    }
  }

  return generateHeuristicMatchExplanation(
    candidate,
    requesterNeed,
    matchingSkills,
    compatibilityScore,
    "Development mode: Configure GEMINI_API_KEY & GEMMA_MODEL in .env for live Gemma inference."
  );
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
    } catch {
      // fallback
    }
  }

  return {
    summary_en: `This ${category.toLowerCase().slice(0, -1) || "opportunity"} from ${organization} offers practical hands-on exposure in ${skills.slice(0, 3).join(", ") || "technology"} and strengthens your profile for placement season.`,
    summary_hi: `Ye ${organization} ki taraf se ek valuable opportunity hai, jo students ${skills[0] || "development"} me interested hain unhe jarur apply karna chahiye.`,
    recommended_for: `Students skilled in ${skills.slice(0, 2).join(", ") || "core technical areas"}`,
    urgency_level: "High",
    model_used: "Gemma Heuristic Fallback Adapter",
    is_live_ai: false,
  };
}

function generateHeuristicMatchExplanation(
  candidate: Student,
  requesterNeed: string,
  matchingSkills: string[],
  score: number,
  statusNote?: string
): GemmaExplanationResult {
  const topSkills = matchingSkills.length > 0 ? matchingSkills.slice(0, 3).join(", ") : candidate.skills.slice(0, 2).join(", ");
  const roles = candidate.preferred_roles.join(" & ");

  return {
    english: `${candidate.display_name} is an exceptional ${candidate.experience_level} match (${score}%) with demonstrated strengths in ${topSkills}. Their role preference as a ${roles} directly fills the core technical requirements of "${requesterNeed.slice(0, 60)}".`,
    hindi_simple: `${candidate.display_name} ka background aur ${topSkills} me experience aapki hackathon team ke liye kaafi strong fit hai.`,
    key_strengths: candidate.skills.slice(0, 4),
    suggested_synergy: `Have ${candidate.display_name} lead the ${candidate.preferred_roles[0] || "technical"} architecture while collaborating on rapid MVP deployment.`,
    model_used: AI_CONFIG.defaultGemmaModel + " (Fallback Adapter)",
    is_live_ai: false,
    status_message: statusNote,
  };
}
