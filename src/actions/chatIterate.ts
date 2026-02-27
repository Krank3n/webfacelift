"use server";

import { anthropic, CHAT_ITERATE_SYSTEM_PROMPT } from "@/lib/anthropic";
import type { BlueprintState, ChatMessage } from "@/types/blueprint";

interface ChatIterateResult {
  success: boolean;
  message?: string;
  blueprint?: BlueprintState;
  error?: string;
}

export async function chatIterate(
  userPrompt: string,
  currentState: BlueprintState,
  chatHistory: ChatMessage[],
  uploadedImages?: string[]
): Promise<ChatIterateResult> {
  try {
    // Build conversation context
    const historyMessages = chatHistory
      .filter((m) => m.role !== "system")
      .slice(-10) // Keep last 10 messages for context
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    let systemAddendum = "";
    if (uploadedImages && uploadedImages.length > 0) {
      systemAddendum = `\n\nThe user has uploaded the following images that are available for use in the blueprint:\n${uploadedImages.map((url) => `- ${url}`).join("\n")}`;
    }

    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8192,
      system: CHAT_ITERATE_SYSTEM_PROMPT + systemAddendum,
      messages: [
        ...historyMessages,
        {
          role: "user",
          content: `CURRENT BLUEPRINT STATE:
${JSON.stringify(currentState, null, 2)}

USER REQUEST: ${userPrompt}

Apply the requested changes to the blueprint state and return the response as JSON with "message" and "state" keys. Return ONLY the JSON object.`,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      return { success: false, error: "No text response from AI." };
    }

    let jsonStr = textContent.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);

    if (!parsed.state) {
      return { success: false, error: "Invalid response: missing state." };
    }

    // Accept either niche path (nicheTemplate + nicheData) or block path (layout array)
    const isNichePath = parsed.state.nicheTemplate && parsed.state.nicheData;
    const isBlockPath = parsed.state.layout && Array.isArray(parsed.state.layout) && parsed.state.layout.length > 0;

    if (!isNichePath && !isBlockPath) {
      return { success: false, error: "Invalid response: state must have nicheTemplate+nicheData or non-empty layout." };
    }

    // Ensure layout is at least an empty array
    if (!parsed.state.layout) {
      parsed.state.layout = [];
    }

    return {
      success: true,
      message: parsed.message || "Changes applied.",
      blueprint: parsed.state as BlueprintState,
    };
  } catch (err) {
    return {
      success: false,
      error: `Chat iteration failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}
