import type {
  User,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  Interview,
  InterviewRole,
  InterviewReport,
  ApiResponse,
} from './types';

// API base URL - will be replaced with actual FastAPI backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const getAccessToken = (): string | null => {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
};

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.detail || data.message || 'An error occurred' };
    }

    return { data };
  } catch (error) {
    console.error('API Error:', error);
    return { error: 'Network error. Please try again.' };
  }
}

// Auth API
export const authApi = {
  login: (credentials: LoginCredentials) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (credentials: SignupCredentials) =>
    fetchApi<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    fetchApi<void>('/auth/logout', {
      method: 'POST',
    }),

  refreshToken: (refreshToken: string) =>
    fetchApi<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  getProfile: () => fetchApi<User>('/auth/profile'),

  updateProfile: (data: Partial<User>) =>
    fetchApi<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  googleAuth: (token: string) =>
    fetchApi<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};

// Interview API
export const interviewApi = {
  getRoles: () => fetchApi<InterviewRole[]>('/interviews/roles'),

  getHistory: () => fetchApi<Interview[]>('/interviews/history'),

  getInterview: (id: string) => fetchApi<Interview>(`/interviews/${id}`),

  startInterview: (roleId: string, customRole?: string) =>
    fetchApi<Interview>('/interviews/start', {
      method: 'POST',
      body: JSON.stringify({ roleId, customRole }),
    }),

  endInterview: (id: string) =>
    fetchApi<Interview>(`/interviews/${id}/end`, {
      method: 'POST',
    }),

  submitResponse: (interviewId: string, questionId: string, response: string) =>
    fetchApi<{ nextQuestion?: string; analysis?: string }>('/interviews/response', {
      method: 'POST',
      body: JSON.stringify({ interviewId, questionId, response }),
    }),

  getReport: (interviewId: string) =>
    fetchApi<InterviewReport>(`/interviews/${interviewId}/report`),
};

// AI API (for external AI services)
export const aiApi = {
  textToSpeech: (text: string, voice?: string) =>
    fetchApi<{ audioUrl: string }>('/ai/tts', {
      method: 'POST',
      body: JSON.stringify({ text, voice }),
    }),

  speechToText: (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    return fetchApi<{ text: string; confidence: number }>('/ai/stt', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });
  },

  generateQuestion: (role: string, context: string[]) =>
    fetchApi<{ question: string; type: string }>('/ai/generate-question', {
      method: 'POST',
      body: JSON.stringify({ role, context }),
    }),

  analyzeResponse: (question: string, response: string, role: string) =>
    fetchApi<{ analysis: string; score: number; feedback: string }>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ question, response, role }),
    }),

  getAvatarVideo: (text: string, expression?: string) =>
    fetchApi<{ videoUrl: string }>('/ai/avatar', {
      method: 'POST',
      body: JSON.stringify({ text, expression }),
    }),
};
