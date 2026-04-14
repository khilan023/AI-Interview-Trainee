// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

// Interview types
export interface InterviewRole {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: string[];
}

export interface Interview {
  id: string;
  userId: string;
  role: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  duration?: number; // in seconds
  overallRating?: number;
  report?: InterviewReport;
}

export interface InterviewQuestion {
  id: string;
  interviewId: string;
  question: string;
  type: 'technical' | 'behavioral' | 'scenario' | 'hr' | 'followup';
  order: number;
}

export interface InterviewResponse {
  id: string;
  interviewId: string;
  questionId: string;
  userResponse: string;
  aiAnalysis?: string;
  score?: number;
  timestamp: string;
}

export interface InterviewReport {
  id: string;
  interviewId: string;
  overallRating: number; // 0-10
  skillBreakdown: SkillBreakdown;
  strengths: string[];
  weaknesses: string[];
  mistakes: string[];
  improvements: string[];
  learningRecommendations: LearningRecommendation[];
  generatedAt: string;
}

export interface SkillBreakdown {
  communication: number; // 0-100
  technicalKnowledge: number;
  confidence: number;
  problemSolving: number;
}

export interface LearningRecommendation {
  topic: string;
  description: string;
  resources?: string[];
  priority: 'high' | 'medium' | 'low';
}

// AI Avatar types
export interface AvatarState {
  isSpeaking: boolean;
  expression: 'neutral' | 'thinking' | 'happy' | 'concerned';
  message?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Speech types
export interface SpeechConfig {
  language: string;
  voice?: string;
  rate?: number;
  pitch?: number;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}
