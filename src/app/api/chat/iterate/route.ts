import { anthropic } from "@/lib/anthropic";
import { CODE_CHAT_ITERATE_SYSTEM_PROMPT } from "@/lib/anthropic";
import type { BlueprintState, ChatMessage } from "@/types/blueprint";
import { isCodeMode } from "@/lib/blueprint-utils";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userPrompt,
      currentState,
      chatHistory,
      uploadedImages,
    } = body as {
      userPrompt: string;
      currentState: BlueprintState;
      chatHistory: ChatMessage[];
      uploadedImages?: string[];
    };

    if (!userPrompt || !currentState || !isCodeMode(currentState)) {
      return Response.json(
        { error: "Invalid request: requires code mode blueprint and prompt" },
        { status: 400 }
      );
    }

    // Build conversation context
    const historyMessages = chatHistory
      .filter((m) => m.role !== "system")
      .slice(-10)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    let systemAddendum = "";
    if (uploadedImages && uploadedImages.length > 0) {
      systemAddendum = `\n\nThe user has uploaded the following images that are available for use:\n${uploadedImages.map((url) => `- ${url}`).join("\n")}`;
    }

    // Build media catalog context
    let mediaContext = "";
    if (currentState.mediaCatalog && currentState.mediaCatalog.length > 0) {
      const images = currentState.mediaCatalog.filter((m) => m.type === "image");
      const videos = currentState.mediaCatalog.filter((m) => m.type === "video");
      mediaContext = "\n\nAVAILABLE MEDIA FROM ORIGINAL WEBSITE:";
      if (images.length > 0) {
        mediaContext += `\n\nImages (${images.length}):`;
        for (const img of images) {
          mediaContext += `\n- ${img.url}${img.description ? ` (${img.description})` : ""}${img.recommendedPlacement ? ` [${img.recommendedPlacement}]` : ""}`;
        }
      }
      if (videos.length > 0) {
        mediaContext += `\n\nVideos (${videos.length}):`;
        for (const vid of videos) {
          mediaContext += `\n- ${vid.url}${vid.description ? ` (${vid.description})` : ""}${vid.recommendedPlacement ? ` [${vid.recommendedPlacement}]` : ""}`;
        }
      }
    }

    // Build the full user message content (cached — stays stable across edits)
    const userContent = `CURRENT WEBSITE CODE:
\`\`\`tsx
${currentState.code}
\`\`\`
${mediaContext}

USER REQUEST: ${userPrompt}

Apply the requested changes and return the response as JSON with "message" and "code" keys. Return ONLY the JSON object.`;

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };

        try {
          send("status", { text: "Understanding your changes..." });

          // Use prompt caching: the system prompt is stable across all iterations,
          // and the code context in the last user message is mostly stable between edits.
          // cache_control on system + the code block = 90% input token discount on cache hits.
          const stream = anthropic.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 16384,
            system: [
              {
                type: "text",
                text: CODE_CHAT_ITERATE_SYSTEM_PROMPT + systemAddendum,
                cache_control: { type: "ephemeral" },
              },
            ],
            messages: [
              ...historyMessages,
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: userContent,
                    cache_control: { type: "ephemeral" },
                  },
                ],
              },
            ],
          });

          let fullText = "";
          let tokenCount = 0;
          let sentWriting = false;
          let sentFinalizing = false;

          stream.on("text", (text) => {
            fullText += text;
            tokenCount += 1;

            if (!sentWriting && tokenCount > 20) {
              send("status", { text: "Rewriting components..." });
              sentWriting = true;
            }

            if (!sentFinalizing && tokenCount > 500) {
              send("status", { text: "Polishing the code..." });
              sentFinalizing = true;
            }
          });

          const finalMessage = await stream.finalMessage();
          const stopReason = finalMessage.stop_reason;

          send("status", { text: "Applying changes..." });

          // Parse the result
          let jsonStr = fullText.trim();
          if (jsonStr.startsWith("```")) {
            jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
          }

          const parsed = JSON.parse(jsonStr);

          if (!parsed.code || typeof parsed.code !== "string") {
            send("error", { error: "Invalid response: missing code." });
            controller.close();
            return;
          }

          send("done", {
            message: parsed.message || "Changes applied.",
            code: parsed.code,
            stopReason,
          });

          controller.close();
        } catch (err) {
          send("error", {
            error: `Chat iteration failed: ${err instanceof Error ? err.message : "Unknown error"}`,
          });
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
