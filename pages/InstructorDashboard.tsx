import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addCourse } from '../services/storageService';
import { UserRole } from '../types';
import { PlusCircle, Video, Type, FolderOpen } from 'lucide-react';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.role !== UserRole.INSTRUCTOR) {
    return (
      <div className="flex min-h-[500px] items-center justify-center text-lg text-gray-600 dark:text-gray-300">
        Access Denied. Instructor privileges required.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await addCourse({
        title,
        description,
        videoUrl,
        category,
      }, user);
      navigate('/courses');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Add a new course to Codista LMS</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Course Title</label>
              <div className="relative">
                <Type className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                  placeholder="e.g. Advanced React Patterns"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-md border-0 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                placeholder="What will students learn?"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">YouTube URL</label>
              <div className="relative">
                <Video className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600"
                >
                  <option value="" disabled>Select a category</option>
                  <option value="React">React</option>
                  <option value="Python">Python</option>
                  <option value="Design">Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-md bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {loading ? 'Publishing...' : 'Publish Course'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
