import { createFileRoute } from "@tanstack/react-router";
import { generateText, type LanguageModel } from "ai";
import { formatAiError } from "@/lib/ai-errors.server";
import { resolveChatProvider } from "@/lib/ai-gateway.server";
import { buildPortfolioAssistantContext } from "@/lib/assistant-context";

const PORTFOLIO_CONTEXT = buildPortfolioAssistantContext();

const SYSTEM_PROMPT = `You are the interactive assistant embedded in Klodiana Mazrekaj's portfolio (klodi.dev),
styled as a code editor terminal. You speak as Klodiana's representative — confident, warm, and concise.

VOICE & STYLE:
- Refer to Klodiana in third person ("Klodiana has…", "She built…").
- Keep answers short: 1–4 sentences or a tight bullet list. This is a terminal, not an essay.
- Sound like a sharp engineer, not a marketing bot. No emojis. No fluff.

GROUNDING RULES (critical):
- Answer ONLY using the portfolio context below.
- Do not invent employers, dates, metrics, technologies, or projects.
- If the answer is not in the context, say it is not in the portfolio and point to contact.md (info@klodi.dev).
- If asked "are you a bot / AI", be honest: you are an AI assistant grounded in Klodiana's portfolio files.

PORTFOLIO CONTEXT:
${PORTFOLIO_CONTEXT}`;

type ChatRequestBody = { question?: unknown };

async function generatePortfolioAnswer(model: LanguageModel, question: string) {
  return generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt: question,
    temperature: 0.2,
  });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: ChatRequestBody;
        try {
          body = (await request.json()) as ChatRequestBody;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const question = typeof body.question === "string" ? body.question.trim() : "";
        if (!question) {
          return new Response("Question is required", { status: 400 });
        }
        if (question.length > 500) {
          return new Response("Question too long", { status: 413 });
        }

        const chatProvider = resolveChatProvider();
        if (!chatProvider) {
          return new Response("AI is not configured", { status: 500 });
        }

        try {
          if (chatProvider.kind === "lovable") {
            const result = await generatePortfolioAnswer(chatProvider.model, question);
            const text = result.text.trim();
            if (!text) return new Response("AI returned an empty response", { status: 502 });
            return new Response(text, {
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            });
          }

          let lastError: unknown;
          for (const modelId of chatProvider.modelIds) {
            try {
              const result = await generatePortfolioAnswer(
                chatProvider.provider(modelId),
                question,
              );
              const text = result.text.trim();
              if (text) {
                return new Response(text, {
                  headers: { "Content-Type": "text/plain; charset=utf-8" },
                });
              }
            } catch (err) {
              lastError = err;
            }
          }

          return new Response(formatAiError(lastError), { status: 502 });
        } catch (err) {
          console.error("chat route error", err);
          return new Response(formatAiError(err), { status: 502 });
        }
      },
    },
  },
});
