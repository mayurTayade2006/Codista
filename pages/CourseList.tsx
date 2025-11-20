import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { getCourses } from '../services/storageService';
import { PlayCircle, Search, RefreshCw } from 'lucide-react';

const getYouTubeThumbnail = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err: any) {
      console.error(err);
      // Service handles fallback, so we just log
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(filter.toLowerCase()) || 
    c.category.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-screen items-center justify-center dark:bg-gray-900"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Courses</h1>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses or categories..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
            <div className="mt-20 text-center">
                <p className="text-xl text-gray-500 dark:text-gray-400">No courses found.</p>
                <button 
                  onClick={fetchCourses}
                  className="mt-4 flex items-center justify-center gap-2 mx-auto text-brand-600 hover:text-brand-700"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>
        ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
                const thumbnailUrl = getYouTubeThumbnail(course.videoUrl) || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.category)}&background=f97316&color=fff&size=400`;
                
                return (
                  <div key={course.id} className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl dark:bg-gray-800">
                  <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                      <img 
                          src={thumbnailUrl} 
                          alt={course.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-gray-900 dark:bg-gray-900/90 dark:text-white">
                      {course.category}
                      </div>
                  </div>
                  
                  <div className="p-6">
                      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
                      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{course.description}</p>
                      
                      <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">By {course.instructorName}</span>
                      <Link 
                          to={`/courses/${course.id}`}
                          className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                      >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Start Learning
                      </Link>
                      </div>
                  </div>
                  </div>
                );
            })}
            </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;