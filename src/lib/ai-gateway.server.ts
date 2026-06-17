import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";

/**
 * Lovable AI Gateway provider for the AI SDK.
 * Server-only: never import this from client/browser code.
 */
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
    },
  });
}

function createGoogleGeminiProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "google-gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey,
  });
}

export const GEMINI_MODEL_IDS = ["models/gemini-3.1-flash-lite"] as const;

export type ChatProvider =
  | { kind: "lovable"; model: LanguageModel }
  | { kind: "gemini"; provider: ReturnType<typeof createGoogleGeminiProvider>; modelIds: string[] };

export function resolveChatProvider(): ChatProvider | null {
  const lovableKey = process.env.LOVABLE_API_KEY?.trim();
  if (lovableKey) {
    const gateway = createLovableAiGatewayProvider(lovableKey);
    return { kind: "lovable", model: gateway("google/gemini-3-flash-preview") };
  }

  const geminiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ?? process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    return {
      kind: "gemini",
      provider: createGoogleGeminiProvider(geminiKey),
      modelIds: [...GEMINI_MODEL_IDS],
    };
  }

  return null;
}
