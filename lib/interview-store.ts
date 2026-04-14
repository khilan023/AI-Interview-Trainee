"use client";

// Store interview session data for passing between pages
// This will be replaced by actual API calls to your FastAPI backend

export interface InterviewMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: string;
  questionIndex?: number;
}

export interface InterviewSessionData {
  id: string;
  role: string;
  startedAt: string;
  completedAt?: string;
  messages: InterviewMessage[];
  questionsAsked: string[];
  userResponses: { question: string; answer: string }[];
  isPartial: boolean;
}

const STORAGE_KEY = "ai-interview-session";

export const interviewStore = {
  // Save interview session
  saveSession: (data: InterviewSessionData) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  },

  // Get interview session
  getSession: (): InterviewSessionData | null => {
    if (typeof window === "undefined") return null;
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  // Clear interview session
  clearSession: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  },

  // Create new session
  createSession: (role: string): InterviewSessionData => {
    const session: InterviewSessionData = {
      id: `interview-${Date.now()}`,
      role,
      startedAt: new Date().toISOString(),
      messages: [],
      questionsAsked: [],
      userResponses: [],
      isPartial: false,
    };
    interviewStore.saveSession(session);
    return session;
  },

  // Add message to session
  addMessage: (message: Omit<InterviewMessage, "id" | "timestamp">) => {
    const session = interviewStore.getSession();
    if (!session) return;

    session.messages.push({
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date().toISOString(),
    });

    interviewStore.saveSession(session);
  },

  // Add Q&A pair
  addQAPair: (question: string, answer: string) => {
    const session = interviewStore.getSession();
    if (!session) return;

    if (!session.questionsAsked.includes(question)) {
      session.questionsAsked.push(question);
    }
    session.userResponses.push({ question, answer });

    interviewStore.saveSession(session);
  },

  // Mark session as complete
  completeSession: (isPartial: boolean = false) => {
    const session = interviewStore.getSession();
    if (!session) return;

    session.completedAt = new Date().toISOString();
    session.isPartial = isPartial;

    interviewStore.saveSession(session);
  },
};
