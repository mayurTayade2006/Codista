import { Course, User, UserRole, Progress, Question, Reply } from '../types';

// Use 127.0.0.1 instead of localhost to avoid node/vite resolution issues
const API_URL = 'http://127.0.0.1:5000/api';
const AUTH_KEY = 'codista_auth_token';
const MOCK_PROGRESS_KEY = 'codista_mock_progress';
const MOCK_CUSTOM_COURSES_KEY = 'codista_mock_custom_courses';
const MOCK_QUESTIONS_KEY = 'codista_mock_questions';

// --- MOCK DATA (Fallback if Backend is offline or empty) ---
const MOCK_COURSES: Course[] = [
  {
    id: 'mock-py',
    title: 'Complete Python Bootcamp',
    description: 'Learn Python from scratch to advanced concepts. Includes Django and Flask.',
    videoUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    category: 'Python',
    instructorId: 'inst-1',
    instructorName: 'Sarah Smith'
  },
  {
    id: 'mock-js',
    title: 'The Complete JavaScript Course 2024',
    description: 'Master modern JavaScript (ES6+) from the beginning to advanced topics like closures and promises.',
    videoUrl: 'https://www.youtube.com/watch?v=uDwSnnhl1Ng',
    category: 'JavaScript',
    instructorId: 'inst-1',
    instructorName: 'John Doe'
  },
  {
    id: 'mock-java',
    title: 'Java Programming Masterclass',
    description: 'Learn Java In-Depth: Data Structures, Algorithms, and OOP principles.',
    videoUrl: 'https://www.youtube.com/watch?v=eIrMbAQSU34',
    category: 'Java',
    instructorId: 'inst-2',
    instructorName: 'James Gosling Fan'
  },
  {
    id: 'mock-cpp',
    title: 'Beginning C++ Programming',
    description: 'Modern C++ features, STL, and game development fundamentals.',
    videoUrl: 'https://www.youtube.com/watch?v=18c3MTX0PK0',
    category: 'C++',
    instructorId: 'inst-3',
    instructorName: 'Bjarne S.'
  },
  {
    id: 'mock-go',
    title: 'Go: The Complete Developer\'s Guide',
    description: 'Master the fundamentals and advanced features of the Go (Golang) programming language.',
    videoUrl: 'https://www.youtube.com/watch?v=YS4e4q9oBaU',
    category: 'Go',
    instructorId: 'inst-2',
    instructorName: 'Alice Wonder'
  },
  {
    id: 'mock-swift',
    title: 'iOS & Swift - The Complete iOS App Development Bootcamp',
    description: 'From beginner to iOS App Developer with just one course.',
    videoUrl: 'https://www.youtube.com/watch?v=comQ1-x2a1Q',
    category: 'Swift',
    instructorId: 'inst-1',
    instructorName: 'Angela Yu Fan'
  },
  {
    id: 'mock-php',
    title: 'PHP for Beginners - Become a PHP Master',
    description: 'Learn everything you need to become a professional PHP developer.',
    videoUrl: 'https://www.youtube.com/watch?v=OK_JCtrrv-c',
    category: 'PHP',
    instructorId: 'inst-4',
    instructorName: 'Elephant Dev'
  },
  {
    id: 'mock-csharp',
    title: 'C# Basics for Beginners: Learn C# Fundamentals by Coding',
    description: 'Master C# fundamentals for Unity game development and .NET applications.',
    videoUrl: 'https://www.youtube.com/watch?v=GhQdlIFylQ8',
    category: 'C#',
    instructorId: 'inst-2',
    instructorName: 'Microsoft MVP'
  },
  {
    id: 'mock-ts',
    title: 'Understanding TypeScript',
    description: 'Don\'t limit the Usage of TypeScript to Angular! Learn the basics, its features, workflows and how to use it.',
    videoUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    category: 'TypeScript',
    instructorId: 'inst-1',
    instructorName: 'John Doe'
  },
  {
    id: 'mock-sql',
    title: 'The Complete SQL Bootcamp',
    description: 'Learn to read and write complex queries to a database using PostgreSQL.',
    videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
    category: 'SQL',
    instructorId: 'inst-5',
    instructorName: 'Data Wizard'
  }
];

const MOCK_USER: User = {
  id: 'mock-user-1',
  name: 'Demo Instructor',
  email: 'demo@codista.com',
  role: UserRole.INSTRUCTOR
};

// Helper to get auth headers
const getHeaders = () => {
  const stored = localStorage.getItem(AUTH_KEY);
  const parsed = stored ? JSON.parse(stored) : null;
  return {
    'Content-Type': 'application/json',
    ...(parsed?.token ? { 'Authorization': `Bearer ${parsed.token}` } : {})
  };
};

// Helper to mock progress locally
const getLocalProgress = (): Progress[] => {
    const stored = localStorage.getItem(MOCK_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveLocalProgress = (progress: Progress[]) => {
    localStorage.setItem(MOCK_PROGRESS_KEY, JSON.stringify(progress));
};

// Helper to mock custom courses locally
const getLocalCustomCourses = (): Course[] => {
    const stored = localStorage.getItem(MOCK_CUSTOM_COURSES_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveLocalCustomCourse = (course: Course) => {
    const courses = getLocalCustomCourses();
    courses.push(course);
    localStorage.setItem(MOCK_CUSTOM_COURSES_KEY, JSON.stringify(courses));
};

// Helper for Mock Questions
const getLocalQuestions = (): Question[] => {
  const stored = localStorage.getItem(MOCK_QUESTIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalQuestions = (questions: Question[]) => {
  localStorage.setItem(MOCK_QUESTIONS_KEY, JSON.stringify(questions));
};

// --- AUTH SERVICE ---

export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user: data.user, token: data.token }));
    return data;
  } catch (error: any) {
    console.warn('Backend Login Failed (using Mock):', error);
    // Fallback for demo purposes if backend is down
    if (error.message.includes('Failed to fetch')) {
        const mockResponse = { user: MOCK_USER, token: 'mock-jwt-token' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(mockResponse));
        return mockResponse;
    }
    throw error;
  }
};

export const registerUser = async (name: string, email: string, password: string, role: UserRole): Promise<{ user: User, token: string }> => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Signup failed');
    }

    const data = await response.json();
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user: data.user, token: data.token }));
    return data;
  } catch (error: any) {
    console.warn('Backend Signup Failed (using Mock):', error);
    if (error.message.includes('Failed to fetch')) {
        const mockResponse = { 
            user: { id: 'new-user', name, email, role }, 
            token: 'mock-jwt-token' 
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(mockResponse));
        return mockResponse;
    }
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getStoredAuth = (): { user: User, token: string } | null => {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
};

// --- COURSE SERVICE ---

export const getCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetch(`${API_URL}/courses`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data = await response.json();
    const mappedData = data.map((course: any) => ({
      ...course,
      id: course._id
    }));

    // If Backend is connected but DB is empty, return MOCK_COURSES for demo experience
    // Also append any local custom courses to ensure user doesn't lose data if they switch modes
    if (mappedData.length === 0) {
        return [...MOCK_COURSES, ...getLocalCustomCourses()];
    }
    return mappedData;

  } catch (error) {
    console.warn("Fetch Courses Error (switching to mock data):", error);
    // Return mock courses + any locally created courses
    return [...MOCK_COURSES, ...getLocalCustomCourses()];
  }
};

export const addCourse = async (course: Omit<Course, 'id' | 'instructorId' | 'instructorName'>, user: User): Promise<Course> => {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(course),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add course');

    return {
      ...data,
      id: data._id
    };
  } catch (error: any) {
    console.warn('Add Course Error (saving locally):', error);
    // Simulate adding course locally if backend fails
    if (error.message.includes('Failed to fetch')) {
        const newCourse: Course = {
            ...course,
            id: Math.random().toString(36).substr(2, 9),
            instructorId: user.id,
            instructorName: user.name
        };
        saveLocalCustomCourse(newCourse);
        return newCourse;
    }
    throw error;
  }
};

// --- PROGRESS SERVICE ---

export const getUserProgress = async (): Promise<Progress[]> => {
    try {
        const response = await fetch(`${API_URL}/progress`, {
            headers: getHeaders(),
        });
        
        if (!response.ok) throw new Error('Failed to fetch progress');
        return await response.json();
    } catch (error) {
        console.warn('Fetch Progress Error (using local fallback):', error);
        // Return local progress if backend is down
        return getLocalProgress();
    }
};

export const markVideoComplete = async (courseId: string, title?: string, category?: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/progress/video`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ courseId }),
        });
        if (!response.ok) throw new Error('API Error');
    } catch (error) {
        console.warn('Backend unavailable, saving video progress locally.');
        
        let progress = getLocalProgress();
        const existing = progress.find(p => p.courseId === courseId);
        
        if (existing) {
            existing.videoViewed = true;
            existing.lastAccessed = new Date().toISOString();
        } else if (title && category) {
            progress.push({
                id: Math.random().toString(),
                courseId,
                courseTitle: title,
                courseCategory: category,
                videoViewed: true,
                quizScore: null,
                totalQuestions: null,
                lastAccessed: new Date().toISOString()
            });
        }
        saveLocalProgress(progress);
    }
};

export const saveQuizScore = async (courseId: string, score: number, total: number, title?: string, category?: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/progress/quiz`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ courseId, score, total }),
        });
        if (!response.ok) throw new Error('API Error');
    } catch (error) {
        console.warn('Backend unavailable, saving quiz score locally.');
        
        let progress = getLocalProgress();
        const existing = progress.find(p => p.courseId === courseId);

        if (existing) {
            existing.quizScore = score;
            existing.totalQuestions = total;
            existing.lastAccessed = new Date().toISOString();
        } else if (title && category) {
            progress.push({
                id: Math.random().toString(),
                courseId,
                courseTitle: title,
                courseCategory: category,
                videoViewed: false,
                quizScore: score,
                totalQuestions: total,
                lastAccessed: new Date().toISOString()
            });
        }
        saveLocalProgress(progress);
    }
};

// --- Q&A SERVICE ---

export const getQuestions = async (courseId: string): Promise<Question[]> => {
  try {
    const response = await fetch(`${API_URL}/questions/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return await response.json();
  } catch (error) {
    console.warn('Fetch Questions Error (using local fallback):', error);
    const allQuestions = getLocalQuestions();
    return allQuestions.filter(q => q.courseId === courseId);
  }
};

export const askQuestion = async (courseId: string, text: string, user: User): Promise<Question> => {
  try {
    const response = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ courseId, text }),
    });
    if (!response.ok) throw new Error('Failed to ask question');
    return await response.json();
  } catch (error: any) {
    console.warn('Ask Question Error (using local fallback):', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('Failed to ask question')) {
      const newQuestion: Question = {
        id: Math.random().toString(36).substr(2, 9),
        courseId,
        userId: user.id,
        userName: user.name,
        text,
        replies: [],
        createdAt: new Date().toISOString()
      };
      const allQuestions = getLocalQuestions();
      allQuestions.push(newQuestion);
      saveLocalQuestions(allQuestions);
      return newQuestion;
    }
    throw error;
  }
};

export const postReply = async (questionId: string, text: string, user: User): Promise<Reply> => {
  try {
    const response = await fetch(`${API_URL}/questions/${questionId}/reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Failed to post reply');
    return await response.json();
  } catch (error: any) {
    console.warn('Post Reply Error (using local fallback):', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('Failed to post reply')) {
       const newReply: Reply = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        text,
        createdAt: new Date().toISOString()
       };

       const allQuestions = getLocalQuestions();
       const questionIndex = allQuestions.findIndex(q => q.id === questionId);
       if (questionIndex !== -1) {
         allQuestions[questionIndex].replies.push(newReply);
         saveLocalQuestions(allQuestions);
         return newReply;
       }
    }
    throw error;
  }
};