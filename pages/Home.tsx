import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, PlayCircle, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto flex flex-1 flex-col-reverse items-center justify-center px-4 py-12 md:flex-row md:py-24">
        
        {/* Text Content */}
        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-yellow-500">Codista LMS</span>
          </h1>
          <p className="mb-8 max-w-lg text-xl text-gray-600 dark:text-gray-300">
            Learn, Build, and Grow! Master the skills of tomorrow with our instructor-led courses and interactive community.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              to="/courses"
              className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:bg-brand-700 hover:shadow-brand-500/30 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Explore Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Create Account
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center space-x-2 rounded-md bg-purple-50 p-3 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
              <Brain className="h-5 w-5" />
              <span className="font-medium">Interactive Quizzes</span>
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-red-50 p-3 text-red-800 dark:bg-red-900/30 dark:text-red-200">
              <PlayCircle className="h-5 w-5" />
              <span className="font-medium">Video Lessons</span>
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-blue-50 p-3 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              <Users className="h-5 w-5" />
              <span className="font-medium">Community Learning</span>
            </div>
          </div>
        </div>

        {/* Hero Image / Illustration */}
        <div className="mb-12 flex flex-1 justify-center md:mb-0 md:justify-end">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-brand-400 to-yellow-300 opacity-30 blur-2xl dark:opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
              alt="Coding on a bright desk"
              className="relative rounded-2xl shadow-2xl transition-transform hover:scale-[1.02] max-h-[400px] w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Footer Credit */}
      <div className="py-8 text-center">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Made by <span className="text-brand-600 dark:text-brand-400">Mayur Tayade</span>
        </p>
      </div>
    </div>
  );
};

export default Home;