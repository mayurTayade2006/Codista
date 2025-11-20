export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube URL
  category: string;
  instructorId: string;
  instructorName: string;
  thumbnail?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface Progress {
  id: string;
  courseId: string;
  courseTitle: string;
  courseCategory: string;
  videoViewed: boolean;
  quizScore: number | null;
  totalQuestions: number | null;
  lastAccessed: string;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Question {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  text: string;
  replies: Reply[];
  createdAt: string;
}