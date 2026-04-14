import type {
  User,
  Interview,
  InterviewRole,
  InterviewReport,
  SkillBreakdown,
} from './types';

// Mock user for demo
export const mockUser: User = {
  id: '1',
  email: 'demo@example.com',
  name: 'John Doe',
  avatar: undefined,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-02-01T15:30:00Z',
};

// Available interview roles
export const mockRoles: InterviewRole[] = [
  {
    id: 'software-developer',
    name: 'Software Developer',
    description: 'Full-stack, backend, or frontend development roles',
    icon: 'Code',
    categories: ['Technical', 'Problem Solving', 'System Design'],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description: 'Data analysis, visualization, and insights',
    icon: 'BarChart',
    categories: ['Analytical', 'SQL', 'Statistics'],
  },
  {
    id: 'web-developer',
    name: 'Web Developer',
    description: 'Frontend and web application development',
    icon: 'Globe',
    categories: ['HTML/CSS', 'JavaScript', 'Frameworks'],
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security Analyst',
    description: 'Security analysis and threat management',
    icon: 'Shield',
    categories: ['Security', 'Networking', 'Risk Assessment'],
  },
  {
    id: 'ai-engineer',
    name: 'AI Engineer',
    description: 'Machine learning and AI development',
    icon: 'Brain',
    categories: ['ML', 'Deep Learning', 'Python'],
  },
  {
    id: 'hr-practice',
    name: 'HR Interview Practice',
    description: 'Common HR and behavioral questions',
    icon: 'Users',
    categories: ['Behavioral', 'Cultural Fit', 'Communication'],
  },
];

// Mock interview history
export const mockInterviews: Interview[] = [
  {
    id: '1',
    userId: '1',
    role: 'Software Developer',
    status: 'completed',
    startedAt: '2024-02-01T10:00:00Z',
    completedAt: '2024-02-01T10:45:00Z',
    duration: 2700,
    overallRating: 7.5,
  },
  {
    id: '2',
    userId: '1',
    role: 'Data Analyst',
    status: 'completed',
    startedAt: '2024-01-28T14:00:00Z',
    completedAt: '2024-01-28T14:30:00Z',
    duration: 1800,
    overallRating: 8.2,
  },
  {
    id: '3',
    userId: '1',
    role: 'HR Interview Practice',
    status: 'completed',
    startedAt: '2024-01-25T09:00:00Z',
    completedAt: '2024-01-25T09:35:00Z',
    duration: 2100,
    overallRating: 6.8,
  },
];

// Mock skill breakdown
export const mockSkillBreakdown: SkillBreakdown = {
  communication: 78,
  technicalKnowledge: 82,
  confidence: 70,
  problemSolving: 85,
};

// Mock interview report
export const mockReport: InterviewReport = {
  id: '1',
  interviewId: '1',
  overallRating: 7.5,
  skillBreakdown: mockSkillBreakdown,
  strengths: [
    'Strong problem-solving approach with clear logical thinking',
    'Good understanding of data structures and algorithms',
    'Effective communication of technical concepts',
    'Demonstrates awareness of best practices',
  ],
  weaknesses: [
    'Could improve on time complexity analysis',
    'System design answers could be more detailed',
    'Sometimes rushes through explanations',
  ],
  mistakes: [
    'Forgot to handle edge cases in coding question',
    'Incorrect assumption about database indexing',
    'Did not ask clarifying questions initially',
  ],
  improvements: [
    'Practice more system design scenarios',
    'Work on structured problem decomposition',
    'Improve time management during technical questions',
    'Ask more clarifying questions before jumping into solutions',
  ],
  learningRecommendations: [
    {
      topic: 'System Design',
      description: 'Study distributed systems and scalability patterns',
      resources: [
        'System Design Primer (GitHub)',
        'Designing Data-Intensive Applications book',
      ],
      priority: 'high',
    },
    {
      topic: 'Algorithm Complexity',
      description: 'Practice Big O notation and optimization techniques',
      resources: ['LeetCode', 'Cracking the Coding Interview'],
      priority: 'medium',
    },
    {
      topic: 'Communication Skills',
      description: 'Practice explaining technical concepts clearly',
      resources: ['Mock interviews', 'Technical presentation practice'],
      priority: 'low',
    },
  ],
  generatedAt: '2024-02-01T10:50:00Z',
};

// Interview questions by role
export const mockQuestions: Record<string, string[]> = {
  'software-developer': [
    "Tell me about yourself and your experience in software development.",
    "Can you explain the difference between REST and GraphQL APIs?",
    "How would you design a URL shortening service like bit.ly?",
    "What's your approach to debugging a complex issue in production?",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "How do you ensure code quality in your projects?",
    "What are the SOLID principles and why are they important?",
    "How would you handle a disagreement with a team member about a technical decision?",
  ],
  'data-analyst': [
    "Tell me about your experience with data analysis tools and techniques.",
    "How would you explain a complex data finding to a non-technical stakeholder?",
    "Describe a time when your analysis led to a significant business decision.",
    "What's your approach to cleaning and validating data?",
    "How do you handle missing or incomplete data in your analysis?",
    "Can you explain the difference between correlation and causation?",
    "What visualization tools have you used, and when would you use each?",
    "How do you ensure the accuracy of your analytical conclusions?",
  ],
  'hr-practice': [
    "Tell me about yourself.",
    "Why are you interested in this position?",
    "What are your greatest strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Describe a time when you faced a conflict at work and how you resolved it.",
    "Why should we hire you?",
    "Tell me about a time you failed and what you learned from it.",
    "How do you handle pressure and tight deadlines?",
  ],
};
