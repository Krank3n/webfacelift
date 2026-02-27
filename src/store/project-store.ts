import { create } from "zustand";
import type { BlueprintState, ChatMessage } from "@/types/blueprint";

const DEMO_STORAGE_KEY = "webfacelift:demo";

interface DemoSessionData {
  blueprint: BlueprintState;
  chatMessages: ChatMessage[];
  uploadedImages: string[];
  originalUrl: string | null;
}

export function syncDemoToSession(state: {
  blueprint: BlueprintState | null;
  chatMessages: ChatMessage[];
  uploadedImages: string[];
  originalUrl: string | null;
}) {
  if (!state.blueprint) return;
  try {
    const data: DemoSessionData = {
      blueprint: state.blueprint,
      chatMessages: state.chatMessages,
      uploadedImages: state.uploadedImages,
      originalUrl: state.originalUrl,
    };
    sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function loadDemoFromSession(): DemoSessionData | null {
  try {
    const raw = sessionStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSessionData;
  } catch {
    return null;
  }
}

export function clearDemoSession() {
  try {
    sessionStorage.removeItem(DEMO_STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface ProjectStore {
  projectId: string | null;
  originalUrl: string | null;
  blueprint: BlueprintState | null;
  chatMessages: ChatMessage[];
  isGenerating: boolean;
  isChatLoading: boolean;
  generationStatus: string;
  viewportMode: "desktop" | "tablet" | "mobile";
  hoveredBlockIndex: number | null;
  uploadedImages: string[];

  setProjectId: (id: string) => void;
  setOriginalUrl: (url: string) => void;
  setBlueprint: (state: BlueprintState) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  setIsGenerating: (loading: boolean) => void;
  setIsChatLoading: (loading: boolean) => void;
  setGenerationStatus: (status: string) => void;
  setViewportMode: (mode: "desktop" | "tablet" | "mobile") => void;
  setHoveredBlockIndex: (index: number | null) => void;
  addUploadedImage: (url: string) => void;
  reset: () => void;
}

const initialState = {
  projectId: null,
  originalUrl: null,
  blueprint: null,
  chatMessages: [],
  isGenerating: false,
  isChatLoading: false,
  generationStatus: "",
  viewportMode: "desktop" as const,
  hoveredBlockIndex: null,
  uploadedImages: [],
};

export const useProjectStore = create<ProjectStore>((set) => ({
  ...initialState,

  setProjectId: (id) => set({ projectId: id }),
  setOriginalUrl: (url) => set({ originalUrl: url }),
  setBlueprint: (state) => set({ blueprint: state }),
  setChatMessages: (messages) => set({ chatMessages: messages }),
  addChatMessage: (message) =>
    set((s) => ({ chatMessages: [...s.chatMessages, message] })),
  setIsGenerating: (loading) => set({ isGenerating: loading }),
  setIsChatLoading: (loading) => set({ isChatLoading: loading }),
  setGenerationStatus: (status) => set({ generationStatus: status }),
  setViewportMode: (mode) => set({ viewportMode: mode }),
  setHoveredBlockIndex: (index) => set({ hoveredBlockIndex: index }),
  addUploadedImage: (url) =>
    set((s) => ({ uploadedImages: [...s.uploadedImages, url] })),
  reset: () => set(initialState),
}));
