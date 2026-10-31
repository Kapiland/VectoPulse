// AI Configuration and Model Identifier Registry

export const AI_CONFIG = {
  // Default verified Gemini model for multimodal visual and document intelligence
  defaultGeminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  
  // Default verified Gemma open-weights model on Google AI Studio
  // (e.g. gemma-2-9b-it, gemma-2-27b-it, or gemma-4-31b-it if enabled on your quota)
  defaultGemmaModel: process.env.GEMMA_MODEL || "gemma-2-9b-it",

  apiKey: process.env.GEMINI_API_KEY || "",

  isLiveKeyConfigured: Boolean(
    process.env.GEMINI_API_KEY && 
    !process.env.GEMINI_API_KEY.includes("your_gemini_api_key") &&
    process.env.GEMINI_API_KEY.length > 10
  ),
};

export function getAIModelInfo() {
  return {
    gemini_model: AI_CONFIG.defaultGeminiModel,
    gemma_model: AI_CONFIG.defaultGemmaModel,
    is_live_configured: AI_CONFIG.isLiveKeyConfigured,
    provider: AI_CONFIG.isLiveKeyConfigured ? "Google AI Studio API" : "Heuristic Demo Fallback",
  };
}
