// services/api.tsx
import type { ResumeData } from "@/context/resume-context";
import { auth } from "@/lib/firebase";
import { getIdToken } from "firebase/auth";

// Ensure backend URL is defined
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined in .env.local");
}
const API_URL = `${BACKEND_URL}/api`;

/**
 * Get a fresh Firebase ID token.
 * Forces refresh to avoid using expired or uninitialized token.
 */
const getAuthToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No Firebase user found");
    return null;
  }
  try {
    // Force refresh to ensure token is valid
    const token = await getIdToken(user, true);
    return token;
  } catch (error) {
    console.error("Failed to get ID token:", error);
    return null;
  }
};

// Get authenticated user's resume
export async function getUserResume(): Promise<ResumeData | null> {
  const token = await getAuthToken();
  if (!token) {
    console.warn("Skipping getUserResume: no auth token");
    return null;
  }

  const response = await fetch(`${API_URL}/resume`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("getUserResume failed:", response.status, errorText);
    throw new Error("Failed to fetch user resume");
  }

  const data = await response.json();
  return data.resumes?.[0] || {};
}

// Save or update resume
export async function saveResume(data: ResumeData): Promise<ResumeData> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/resume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Failed to save resume data";
    console.error("saveResume failed:", message);
    throw new Error(message);
  }

  const result = await response.json();
  return result.resume || data;
}

// Update specific resume by ID
export async function updateResumeById(id: string, data: ResumeData): Promise<ResumeData> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/resume/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update resume");
  }

  const result = await response.json();
  return result.resume;
}

// Delete resume by ID
export async function deleteResumeById(id: string): Promise<void> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/resume/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete resume");
  }
}

// Public functions (no auth needed)

export async function getResume(): Promise<ResumeData | null> {
  const response = await fetch(`${API_URL}/resume`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch resume data");
  }

  return response.json();
}

export async function analyzeResume(
  resumeData: ResumeData,
  jobDescription: string
): Promise<{
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string[];
}> {
  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume: resumeData,
      jobDescription,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to analyze resume");
  }

  return response.json();
}

export async function downloadResume(resumeData: ResumeData): Promise<void> {
  const response = await fetch(`${API_URL}/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resumeData),
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${resumeData.personalInfo?.fullName || "resume"}.pdf`
    .replace(/\s+/g, "_")
    .toLowerCase();
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

export async function chatWithAI(message: string): Promise<{ response: string; timestamp: string }> {
  const token = await getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/ai/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to get AI response");
  }

  return response.json();
}

// =========================================================
// MODE-BASED AI COUNSELLOR API FUNCTIONS
// =========================================================

export type AIMode =
  | "resume_analysis"
  | "gap_analysis"
  | "mock_interview"
  | "tech_quiz"
  | "resume_building"
  | "general_chat"
  | "welcome";

export async function chatWithAIMode(
  message: string,
  mode: AIMode,
  sessionContext?: any
): Promise<{ response: string; mode: string; timestamp: string }> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/ai-counsellor/chat-with-mode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, mode, sessionContext }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to get AI response");
  }

  return response.json();
}

export async function getModeWelcomeMessage(
  mode: AIMode
): Promise<{ welcomeMessage: string }> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/ai-counsellor/get-welcome-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mode }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to get welcome message");
  }

  return response.json();
}


// =========================================================
// CONVERSATION API FUNCTIONS
// =========================================================

export interface ConversationMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  _id: string;
  firebaseUid: string;
  title: string;
  messages: ConversationMessage[];
  lastMessageAt: Date;
  createdAt: Date;
  messageCount?: number;
  lastMessage?: string;
}

// Get all conversations for the current user
export async function getConversations(): Promise<Conversation[]> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/conversations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch conversations");
  }

  const data = await response.json();
  return data.conversations || [];
}

// Get a specific conversation by ID
export async function getConversation(id: string): Promise<Conversation> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/conversations/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch conversation");
  }

  const data = await response.json();
  return data.conversation;
}

// Create a new conversation
export async function createConversation(
  title?: string,
  messages?: ConversationMessage[]
): Promise<Conversation> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, messages }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create conversation");
  }

  const data = await response.json();
  return data.conversation;
}

// Update a conversation (add messages)
export async function updateConversation(
  id: string,
  messages: ConversationMessage[],
  title?: string
): Promise<Conversation> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/conversations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ messages, title }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update conversation");
  }

  const data = await response.json();
  return data.conversation;
}

// Delete a conversation
export async function deleteConversation(id: string): Promise<void> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/conversations/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to delete conversation");
  }
}
