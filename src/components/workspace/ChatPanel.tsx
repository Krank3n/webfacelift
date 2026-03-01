"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useProjectStore } from "@/store/project-store";
import { syncDemoToSession } from "@/store/project-store";
import { getBlueprintPages } from "@/lib/blueprint-utils";
import { chatIterate } from "@/actions/chatIterate";
import { updateProjectState } from "@/actions/projects";
import type { ChatMessage } from "@/types/blueprint";
import { Send, Loader2, Bot, User, Sparkles, FileText, Eye } from "lucide-react";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const projectId = useProjectStore((s) => s.projectId);
  const blueprint = useProjectStore((s) => s.blueprint);
  const chatMessages = useProjectStore((s) => s.chatMessages);
  const addChatMessage = useProjectStore((s) => s.addChatMessage);
  const setBlueprint = useProjectStore((s) => s.setBlueprint);
  const isChatLoading = useProjectStore((s) => s.isChatLoading);
  const setIsChatLoading = useProjectStore((s) => s.setIsChatLoading);
  const uploadedImages = useProjectStore((s) => s.uploadedImages);
  const activePageId = useProjectStore((s) => s.activePageId);
  const permission = useProjectStore((s) => s.permission);
  const isViewer = permission === "viewer";

  const activePageName = useMemo(() => {
    if (!blueprint) return "Home";
    const pages = getBlueprintPages(blueprint);
    const page = (activePageId ? pages.find((p) => p.id === activePageId) : null) ?? pages[0];
    return page?.name ?? "Home";
  }, [blueprint, activePageId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatMessages]);

  async function handleSend() {
    if (!input.trim() || !blueprint || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    addChatMessage(userMsg);
    setInput("");
    setIsChatLoading(true);

    const result = await chatIterate(
      userMsg.content,
      blueprint,
      [...chatMessages, userMsg],
      uploadedImages.length > 0 ? uploadedImages : undefined
    );

    if (result.success && result.blueprint) {
      setBlueprint(result.blueprint);

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.message || "Changes applied.",
        timestamp: Date.now(),
      };
      addChatMessage(assistantMsg);

      // Sync to DB or sessionStorage
      if (projectId === "demo") {
        const state = useProjectStore.getState();
        syncDemoToSession({
          blueprint: result.blueprint,
          chatMessages: [...chatMessages, userMsg, assistantMsg],
          uploadedImages: state.uploadedImages,
          originalUrl: state.originalUrl,
        });
      } else if (projectId) {
        updateProjectState(projectId, result.blueprint);
      }
    } else {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Something went wrong: ${result.error || "Unknown error"}. Please try again.`,
        timestamp: Date.now(),
      };
      addChatMessage(errorMsg);
    }

    setIsChatLoading(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-400" />
          Chat
        </h2>
        <p className="text-[11px] text-white/30 mt-0.5">
          Tell the AI what to change
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
              <Bot size={18} className="text-indigo-400" />
            </div>
            <p className="text-xs text-white/30 max-w-[200px] mx-auto leading-relaxed">
              Describe the changes you want. Try: &quot;Make the color scheme
              warmer&quot; or &quot;Add a testimonials section&quot;
            </p>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={12} className="text-indigo-400" />
              </div>
            )}
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600/20 text-white border border-indigo-500/20"
                  : "bg-white/[0.04] text-white/70 border border-white/[0.06]"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                <User size={12} className="text-white/40" />
              </div>
            )}
          </div>
        ))}

        {isChatLoading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-md bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Bot size={12} className="text-indigo-400" />
            </div>
            <div className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Loader2 size={12} className="animate-spin text-indigo-400" />
                Applying changes...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/[0.06]">
        {isViewer ? (
          <div className="flex items-center justify-center gap-2 py-2 text-white/30 text-xs">
            <Eye size={12} />
            View-only — you cannot make changes
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 px-1 mb-1.5">
              <FileText size={10} className="text-white/20" />
              <span className="text-[11px] text-white/30">
                Editing: <span className="text-white/50">{activePageName}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-lg bg-zinc-900 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
              <input
                type="text"
                placeholder="Describe your changes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={isChatLoading || !blueprint}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none px-2 py-1.5 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isChatLoading || !input.trim() || !blueprint}
                className="p-2 rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 text-white disabled:opacity-30 hover:from-indigo-500 hover:to-violet-500 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
