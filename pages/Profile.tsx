import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProgress } from '../services/storageService';
import { Link } from 'react-router-dom';
import { UserRole, Progress } from '../types';
import { UserCircle, Shield, Mail, BookOpen, CheckCircle, PlayCircle, BarChart3 } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
        if (isAuthenticated) {
            setLoading(true);
            const data = await getUserProgress();
            setProgress(data);
            setLoading(false);
        }
    };
    fetchProgress();
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Please login first</h2>
        <Link to="/login" className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - User Stats */}
            <div className="lg:col-span-1 space-y-6">
                <div className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800">
                    <div className="bg-gradient-to-br from-brand-600 to-brand-400 px-6 py-8 text-center text-white">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold text-white backdrop-blur-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
                        <p className="text-brand-100 text-sm opacity-90">{user.email}</p>
                        <div className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                            {user.role}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Account Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Shield className="h-5 w-5 text-gray-400" />
                                <span className="text-sm capitalize text-gray-600 dark:text-gray-300">{user.role} Account</span>
                            </div>
                        </div>

                        {user.role === UserRole.INSTRUCTOR && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <Link
                                to="/instructor"
                                className="flex w-full items-center justify-center rounded-md bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-300"
                                >
                                Go to Dashboard
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column - Learning Progress */}
            <div className="lg:col-span-2">
                <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 min-h-[400px]">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <BookOpen className="mr-2 h-6 w-6 text-brand-500" />
                            My Learning
                        </h2>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {progress.length} Course{progress.length !== 1 && 's'} Started
                        </span>
                    </div>

                    {loading ? (
                         <div className="flex h-32 items-center justify-center text-gray-500">Loading progress...</div>
                    ) : progress.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-700">
                                <BookOpen className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No courses started yet</h3>
                            <p className="mt-2 text-gray-500 dark:text-gray-400">Start watching videos or taking quizzes to track your progress.</p>
                            <Link to="/courses" className="mt-6 rounded-md bg-brand-600 px-6 py-2 text-white hover:bg-brand-700">
                                Explore Courses
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {progress.map((item) => (
                                <div key={item.id} className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-5 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-700/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                                            {item.courseCategory}
                                        </span>
                                        {item.videoViewed && (
                                            <span className="flex items-center text-xs font-medium text-green-600 dark:text-green-400">
                                                <CheckCircle className="mr-1 h-3 w-3" /> Viewed
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-3">
                                        {item.courseTitle}
                                    </h3>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <PlayCircle className={`mr-2 h-4 w-4 ${item.videoViewed ? 'text-green-500' : 'text-gray-400'}`} />
                                            <span>Video Status: {item.videoViewed ? 'Completed' : 'Not Started'}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <BarChart3 className={`mr-2 h-4 w-4 ${item.quizScore !== null ? 'text-brand-500' : 'text-gray-400'}`} />
                                            <span>
                                                Quiz Score: {item.quizScore !== null ? (
                                                    <span className="font-bold">{item.quizScore}/{item.totalQuestions}</span>
                                                ) : 'Not taken'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <Link 
                                        to={`/courses/${item.courseId}`}
                                        className="absolute inset-0 z-10 focus:outline-none"
                                    >
                                        <span className="sr-only">View Course</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;