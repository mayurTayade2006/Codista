import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Course, Question, UserRole } from '../types';
import { getCourses, markVideoComplete, saveQuizScore, getQuestions, askQuestion, postReply } from '../services/storageService';
import { useAuth } from '../contexts/AuthContext';
import { Play, CheckCircle, Brain, AlertTriangle, ExternalLink, MessageCircle, Send } from 'lucide-react';

const getYouTubeVideoId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// --- PREFILLED QUIZ DATA ---
const QUIZ_DATA: Record<string, any[]> = {
  "Python": [
    { id: 1, question: "What is the correct file extension for Python files?", options: [".py", ".pt", ".yt", ".pn"], answer: ".py" },
    { id: 2, question: "How do you create a variable in Python?", options: ["x = 5", "var x = 5", "int x = 5", "variable x = 5"], answer: "x = 5" },
    { id: 3, question: "Which function is used to output text to the screen?", options: ["print()", "echo()", "console.log()", "write()"], answer: "print()" },
    { id: 4, question: "How do you start a comment in Python?", options: ["#", "//", "/*", "--"], answer: "#" },
    { id: 5, question: "Which collection is ordered, changeable, and allows duplicate members?", options: ["List", "Tuple", "Set", "Dictionary"], answer: "List" }
  ],
  "JavaScript": [
    { id: 1, question: "Which symbol is used for comments in JavaScript?", options: ["//", "#", "<!--", "**"], answer: "//" },
    { id: 2, question: "Which keyword declares a variable that cannot be reassigned?", options: ["const", "var", "let", "static"], answer: "const" },
    { id: 3, question: "What is the correct way to write a function in JavaScript?", options: ["function myFunction()", "def myFunction()", "func myFunction()", "void myFunction()"], answer: "function myFunction()" },
    { id: 4, question: "How do you find the length of a string 'str'?", options: ["str.length", "str.len", "str.size", "length(str)"], answer: "str.length" },
    { id: 5, question: "Which event occurs when the user clicks on an HTML element?", options: ["onclick", "onchange", "onmouseover", "onmouseclick"], answer: "onclick" }
  ],
  "Java": [
    { id: 1, question: "Which method is the entry point for a Java application?", options: ["public static void main(String[] args)", "public void main()", "static void start()", "init()"], answer: "public static void main(String[] args)" },
    { id: 2, question: "Which data type is used to create a variable that should store text?", options: ["String", "char", "Txt", "string"], answer: "String" },
    { id: 3, question: "How do you create an object in Java?", options: ["new ClassName()", "ClassName()", "create ClassName()", "make ClassName()"], answer: "new ClassName()" },
    { id: 4, question: "Which keyword is used to inherit a class?", options: ["extends", "implements", "inherits", "uses"], answer: "extends" },
    { id: 5, question: "Which statement is used to stop a loop?", options: ["break", "stop", "return", "exit"], answer: "break" }
  ],
  "C++": [
    { id: 1, question: "Which header file is required for input/output operations?", options: ["<iostream>", "<stdio.h>", "<conio.h>", "<input>"], answer: "<iostream>" },
    { id: 2, question: "How do you insert comments in C++?", options: ["//", "#", "<!--", "**"], answer: "//" },
    { id: 3, question: "Which operator is used to access members of a structure or class pointer?", options: ["->", ".", ":", "::"], answer: "->" },
    { id: 4, question: "What is the size of an 'int' on most modern 64-bit systems?", options: ["4 bytes", "2 bytes", "8 bytes", "1 byte"], answer: "4 bytes" },
    { id: 5, question: "Which keyword is used to define a class?", options: ["class", "struct", "object", "type"], answer: "class" }
  ],
  "Go": [
    { id: 1, question: "Which keyword is used to define a package?", options: ["package", "module", "import", "pkg"], answer: "package" },
    { id: 2, question: "How do you declare a variable in Go?", options: ["var x int", "int x", "x := int", "declare x int"], answer: "var x int" },
    { id: 3, question: "What is the entry point function in a Go program?", options: ["main", "start", "init", "run"], answer: "main" },
    { id: 4, question: "Which loop is the only loop available in Go?", options: ["for", "while", "do-while", "repeat"], answer: "for" },
    { id: 5, question: "How do you create a goroutine?", options: ["go functionName()", "start functionName()", "async functionName()", "run functionName()"], answer: "go functionName()" }
  ],
  "Swift": [
    { id: 1, question: "Which keyword is used to define a constant?", options: ["let", "var", "const", "fixed"], answer: "let" },
    { id: 2, question: "What is used to handle optional values safely?", options: ["if let / guard let", "try / catch", "check / unwrap", "exists"], answer: "if let / guard let" },
    { id: 3, question: "Which framework is primarily used for iOS UI?", options: ["SwiftUI / UIKit", "React Native", "Flutter", "Cocoa"], answer: "SwiftUI / UIKit" },
    { id: 4, question: "How do you define a function in Swift?", options: ["func name()", "function name()", "def name()", "void name()"], answer: "func name()" },
    { id: 5, question: "Which type represents a collection of key-value pairs?", options: ["Dictionary", "Array", "Set", "Map"], answer: "Dictionary" }
  ],
  "PHP": [
    { id: 1, question: "How do you start a PHP script?", options: ["<?php", "<script>", "<php>", "<? "], answer: "<?php" },
    { id: 2, question: "Which symbol starts all variables in PHP?", options: ["$", "@", "%", "#"], answer: "$" },
    { id: 3, question: "Which function outputs text?", options: ["echo", "print_line", "write", "display"], answer: "echo" },
    { id: 4, question: "How do you access a query string parameter?", options: ["$_GET['name']", "$_POST['name']", "$_REQUEST['name']", "$_QUERY['name']"], answer: "$_GET['name']" },
    { id: 5, question: "Which symbol is used to concatenate strings?", options: [".", "+", "&", ","], answer: "." }
  ],
  "C#": [
    { id: 1, question: "Which namespace is commonly used for basic system functions?", options: ["System", "Std", "Core", "Basic"], answer: "System" },
    { id: 2, question: "How do you print to the console?", options: ["Console.WriteLine()", "print()", "System.out.println()", "echo"], answer: "Console.WriteLine()" },
    { id: 3, question: "Which keyword creates a new object instance?", options: ["new", "create", "make", "alloc"], answer: "new" },
    { id: 4, question: "What is the base class for all classes in .NET?", options: ["Object", "Base", "Root", "System"], answer: "Object" },
    { id: 5, question: "Which symbol denotes a nullable type?", options: ["?", "!", "*", "&"], answer: "?" }
  ],
  "TypeScript": [
    { id: 1, question: "What is TypeScript?", options: ["A superset of JavaScript", "A completely new language", "A database", "A CSS framework"], answer: "A superset of JavaScript" },
    { id: 2, question: "How do you specify a type for a variable?", options: ["let x: number", "let x = number", "int x", "var x as number"], answer: "let x: number" },
    { id: 3, question: "Which keyword defines an interface?", options: ["interface", "type", "struct", "class"], answer: "interface" },
    { id: 4, question: "Does TypeScript run directly in the browser?", options: ["No, it must be compiled to JS", "Yes", "Only in Chrome", "Only with React"], answer: "No, it must be compiled to JS" },
    { id: 5, question: "What is 'any' type?", options: ["Disables type checking", "A number type", "A string type", "An array"], answer: "Disables type checking" }
  ],
  "SQL": [
    { id: 1, question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "System Query Logic", "Standard Question List"], answer: "Structured Query Language" },
    { id: 2, question: "Which statement retrieves data from a database?", options: ["SELECT", "GET", "EXTRACT", "OPEN"], answer: "SELECT" },
    { id: 3, question: "Which clause is used to filter records?", options: ["WHERE", "FILTER", "WHEN", "IF"], answer: "WHERE" },
    { id: 4, question: "How do you sort results?", options: ["ORDER BY", "SORT BY", "GROUP BY", "ALIGN"], answer: "ORDER BY" },
    { id: 5, question: "Which command inserts new data?", options: ["INSERT INTO", "ADD NEW", "UPDATE", "CREATE"], answer: "INSERT INTO" }
  ],
  "Default": [
     { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"], answer: "Hyper Text Markup Language" },
     { id: 2, question: "Which language is used for styling web pages?", options: ["CSS", "HTML", "JavaScript", "PHP"], answer: "CSS" },
     { id: 3, question: "Which is not a JavaScript Framework?", options: ["Django", "React", "Vue", "Angular"], answer: "Django" },
     { id: 4, question: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "Structured Question Language", "Simple Query Language"], answer: "Structured Query Language" },
     { id: 5, question: "What is Git?", options: ["Version Control System", "Code Editor", "Programming Language", "Operating System"], answer: "Version Control System" }
  ]
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'quiz' | 'qa'>('details');
  
  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizResult, setQuizResult] = useState<number | null>(null);

  // Q&A State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const courses = await getCourses();
        const found = courses.find(c => c.id === id);
        setCourse(found || null);

        if (found) {
            // Load Questions
            const fetchedQuestions = await getQuestions(found.id);
            setQuestions(fetchedQuestions);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load course details. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const getQuiz = () => {
    if (!course) return [];
    // Match by category or title keyword, fallback to Default
    const category = course.category;
    if (QUIZ_DATA[category]) return QUIZ_DATA[category];
    
    const title = course.title.toLowerCase();
    if (title.includes('python')) return QUIZ_DATA['Python'];
    if (title.includes('react')) return QUIZ_DATA['React']; 
    if (title.includes('java') && !title.includes('script')) return QUIZ_DATA['Java'];
    if (title.includes('javascript')) return QUIZ_DATA['JavaScript'];
    if (title.includes('c++')) return QUIZ_DATA['C++'];
    if (title.includes('c#')) return QUIZ_DATA['C#'];
    if (title.includes('go')) return QUIZ_DATA['Go'];
    if (title.includes('swift')) return QUIZ_DATA['Swift'];
    if (title.includes('php')) return QUIZ_DATA['PHP'];
    if (title.includes('typescript')) return QUIZ_DATA['TypeScript'];
    if (title.includes('sql')) return QUIZ_DATA['SQL'];

    if (title.includes('design') || title.includes('ui') || title.includes('ux')) return QUIZ_DATA['Design'];
    
    return QUIZ_DATA['Default'];
  };

  const handleStartQuiz = () => {
    const questions = getQuiz();
    setQuizQuestions(questions);
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    let score = 0;
    quizQuestions.forEach((q: any) => {
      if (formData.get(`q-${q.id}`) === q.answer) {
        score++;
      }
    });
    setQuizResult(score);
    
    // Save Progress
    if (isAuthenticated && course) {
        // Pass title and category for offline fallback
        await saveQuizScore(course.id, score, quizQuestions.length, course.title, course.category);
    }
  };

  const handleVideoClick = () => {
      if (isAuthenticated && course) {
          // Pass title and category for offline fallback
          markVideoComplete(course.id, course.title, course.category);
      }
  };

  // Q&A Handlers
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !user || !newQuestionText.trim()) return;
    
    try {
        const newQ = await askQuestion(course.id, newQuestionText, user);
        setQuestions([newQ, ...questions]);
        setNewQuestionText('');
    } catch (err) {
        console.error(err);
        alert('Failed to post question');
    }
  };

  const handleReply = async (questionId: string) => {
    const text = replyText[questionId];
    if (!text?.trim() || !user) return;

    try {
        const newReply = await postReply(questionId, text, user);
        
        setQuestions(prev => prev.map(q => {
            if (q.id === questionId) {
                return { ...q, replies: [...q.replies, newReply] };
            }
            return q;
        }));

        setReplyText(prev => ({ ...prev, [questionId]: '' }));
    } catch (err) {
        console.error(err);
        alert('Failed to post reply');
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center dark:bg-gray-900 text-gray-500">Loading...</div>;

  if (error || !course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
        <AlertTriangle className="mb-4 h-16 w-16 text-red-500" />
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Course Not Found</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">{error || "This course does not exist or has been removed."}</p>
        <Link to="/courses" className="rounded-lg bg-brand-600 px-6 py-3 text-white hover:bg-brand-700">Back to Courses</Link>
      </div>
    );
  }

  // Extract Video ID and create Thumbnail URL
  const videoId = getYouTubeVideoId(course.videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : `https://picsum.photos/seed/${course.id}/800/450`;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <Link to="/courses" className="mb-4 inline-block text-sm text-gray-400 hover:text-white">&larr; Back to Courses</Link>
          <h1 className="mb-2 text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-300">{course.description}</p>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <span className="rounded-full bg-brand-600 px-3 py-1">{course.category}</span>
            <span className="text-gray-400">Instructor: {course.instructorName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 grid gap-8 px-4 lg:grid-cols-3">
        {/* Main Content (Video Thumbnail + Link) */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl bg-black shadow-lg relative group">
             {/* Thumbnail Image */}
             <div className="aspect-video w-full relative">
               <img 
                 src={thumbnailUrl} 
                 alt={course.title} 
                 className="h-full w-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-75"
               />
               
               {/* Overlay Button */}
               <div className="absolute inset-0 flex items-center justify-center">
                 <a 
                   href={course.videoUrl} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   onClick={handleVideoClick}
                   className="flex flex-col items-center justify-center transform transition-transform hover:scale-110 focus:outline-none"
                 >
                    <div className="rounded-full bg-red-600 p-5 shadow-lg mb-3">
                        <Play className="h-8 w-8 text-white fill-current ml-1" />
                    </div>
                    <span className="inline-flex items-center rounded-lg bg-black/70 px-4 py-2 text-white font-bold backdrop-blur-sm space-x-2">
                        <span>Watch on YouTube</span>
                        <ExternalLink className="h-4 w-4" />
                    </span>
                 </a>
               </div>
             </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`border-b-2 pb-4 text-sm font-medium ${
                    activeTab === 'details'
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`border-b-2 pb-4 text-sm font-medium ${
                    activeTab === 'quiz'
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                   Quiz
                </button>
                <button
                  onClick={() => setActiveTab('qa')}
                  className={`border-b-2 pb-4 text-sm font-medium ${
                    activeTab === 'qa'
                      ? 'border-brand-500 text-brand-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                   Q & A
                </button>
              </nav>
            </div>

            <div className="mt-6">
              {activeTab === 'details' && (
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Course Description</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{course.description}</p>
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white">What you'll learn</h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600 dark:text-gray-300">
                        <li>Core concepts of {course.category}</li>
                        <li>Practical implementation examples</li>
                        <li>Best practices and tips</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    {quizQuestions.length === 0 ? (
                         <div className="text-center py-8">
                            <Brain className="mx-auto h-12 w-12 text-brand-500 opacity-50" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Ready to test your knowledge?</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Take a 5-question quiz to test what you've learned.</p>
                            <button 
                                onClick={handleStartQuiz} 
                                className="mt-6 inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                            >
                                Start Quiz
                            </button>
                         </div>
                    ) : (
                        <div>
                             {quizResult !== null ? (
                                 <div className="text-center py-8">
                                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                         You scored {quizResult} / {quizQuestions.length}
                                     </h3>
                                     <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        {quizResult >= 4 ? "Great job! You've mastered this section." : "Keep learning and try again!"}
                                     </p>
                                     <button onClick={() => {setQuizQuestions([]); setQuizResult(null)}} className="mt-4 text-brand-600 underline">
                                        Retake Quiz
                                     </button>
                                 </div>
                             ) : (
                                <form onSubmit={handleQuizSubmit} className="space-y-6">
                                    {quizQuestions.map((q: any) => (
                                        <div key={q.id} className="space-y-3">
                                            <p className="font-medium text-gray-900 dark:text-white">{q.id}. {q.question}</p>
                                            <div className="space-y-2">
                                                {q.options.map((opt: string) => (
                                                    <label key={opt} className="flex items-center space-x-3 rounded border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer">
                                                        <input type="radio" name={`q-${q.id}`} value={opt} className="text-brand-600 focus:ring-brand-500" required />
                                                        <span className="text-gray-700 dark:text-gray-300">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <button type="submit" className="w-full rounded-md bg-brand-600 py-2 text-white hover:bg-brand-700">Submit Answers</button>
                                </form>
                             )}
                        </div>
                    )}
                </div>
              )}

              {activeTab === 'qa' && (
                  <div className="space-y-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                      {/* Ask Question Form */}
                      <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Ask a Doubt</h3>
                          {!isAuthenticated ? (
                              <p className="text-gray-500">Please login to ask questions.</p>
                          ) : (
                              <form onSubmit={handleAskQuestion}>
                                  <textarea
                                    value={newQuestionText}
                                    onChange={(e) => setNewQuestionText(e.target.value)}
                                    placeholder="What's your question?"
                                    className="w-full rounded-md border border-gray-300 p-3 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    rows={3}
                                  />
                                  <div className="mt-2 flex justify-end">
                                    <button 
                                        type="submit"
                                        className="inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                                    >
                                        <Send className="mr-2 h-4 w-4" /> Post Question
                                    </button>
                                  </div>
                              </form>
                          )}
                      </div>

                      {/* Questions List */}
                      <div className="space-y-6">
                          {questions.length === 0 ? (
                              <div className="text-center text-gray-500 py-8">
                                  No questions yet. Be the first to ask!
                              </div>
                          ) : (
                              questions.map((q) => (
                                  <div key={q.id} className="border-b border-gray-100 pb-6 last:border-0 dark:border-gray-700">
                                      <div className="flex items-start space-x-3">
                                          <div className="flex-shrink-0">
                                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                  {q.userName.charAt(0).toUpperCase()}
                                              </div>
                                          </div>
                                          <div className="flex-1">
                                              <div className="flex items-center justify-between">
                                                  <h4 className="font-bold text-gray-900 dark:text-white">{q.userName}</h4>
                                                  <span className="text-xs text-gray-500">
                                                    {new Date(q.createdAt).toLocaleDateString()}
                                                  </span>
                                              </div>
                                              <p className="mt-1 text-gray-700 dark:text-gray-300">{q.text}</p>
                                              
                                              {/* Replies */}
                                              {q.replies.length > 0 && (
                                                  <div className="mt-4 space-y-4 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                                                      {q.replies.map((reply) => (
                                                          <div key={reply.id} className="bg-gray-50 p-3 rounded-md dark:bg-gray-700/30">
                                                              <div className="flex items-center justify-between">
                                                                  <span className={`text-sm font-bold ${reply.userRole === UserRole.INSTRUCTOR ? 'text-brand-600' : 'text-gray-900 dark:text-white'}`}>
                                                                      {reply.userName} {reply.userRole === UserRole.INSTRUCTOR && '(Instructor)'}
                                                                  </span>
                                                                  <span className="text-xs text-gray-400">
                                                                    {new Date(reply.createdAt).toLocaleDateString()}
                                                                  </span>
                                                              </div>
                                                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{reply.text}</p>
                                                          </div>
                                                      ))}
                                                  </div>
                                              )}

                                              {/* Reply Input (Instructors Only) */}
                                              {user?.role === UserRole.INSTRUCTOR && (
                                                  <div className="mt-4">
                                                      <div className="flex gap-2">
                                                          <input
                                                              type="text"
                                                              placeholder="Write a reply..."
                                                              value={replyText[q.id] || ''}
                                                              onChange={(e) => setReplyText(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                                          />
                                                          <button
                                                              onClick={() => handleReply(q.id)}
                                                              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                          >
                                                              Reply
                                                          </button>
                                                      </div>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Features</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center"><Play className="mr-2 h-4 w-4 text-brand-500" /> Video Lessons</li>
                <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-brand-500" /> Interactive Quizzes</li>
                <li className="flex items-center"><MessageCircle className="mr-2 h-4 w-4 text-brand-500" /> Q&A Support</li>
                <li className="flex items-center"><Brain className="mr-2 h-4 w-4 text-brand-500" /> Self-paced Learning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;