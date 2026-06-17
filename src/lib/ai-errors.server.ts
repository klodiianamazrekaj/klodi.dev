export function formatAiError(err: unknown): string {
  const responseBody =
    err && typeof err === "object" && "responseBody" in err
      ? String((err as { responseBody?: string }).responseBody)
      : "";

  if (responseBody.includes("free tier is not available in your country")) {
    return "Gemini free tier is not available in your region. Enable billing in Google AI Studio, or use LOVABLE_API_KEY instead.";
  }

  if (
    responseBody.includes("Too Many Requests") ||
    (err instanceof Error && err.message.includes("Too Many Requests"))
  ) {
    return "Gemini rate limit reached. Wait a minute and try again.";
  }

  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }

  return "AI request failed. Check your API key and try again.";
}
