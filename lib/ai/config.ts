const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
const hasPlaceholderKey =
  !apiKey ||
  /your[_ -]|placeholder|example|^x+$|^\*+$/i.test(apiKey);

export const AI_CONFIG = {
  defaultGeminiModel: process.env.GEMINI_MODEL || "gemini-3.8-flash",
  defaultGemmaModel: process.env.GEMMA_MODEL || "gemma-4-31b-it",

  apiKey,
  isLiveKeyConfigured: !hasPlaceholderKey && apiKey.length >= 20,
};

export function getAIModelInfo() {
  return {
    gemini_model: AI_CONFIG.defaultGeminiModel,
    gemma_model: AI_CONFIG.defaultGemmaModel,
    is_live_configured: AI_CONFIG.isLiveKeyConfigured,
    provider: AI_CONFIG.isLiveKeyConfigured ? "Google AI Studio API" : "Not configured",
  };
}
