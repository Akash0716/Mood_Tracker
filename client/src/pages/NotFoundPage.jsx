import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-bloom-100 dark:bg-bloom-950/80 flex items-center justify-center text-3xl mb-4 shadow-inner">
        🌱
      </div>
      <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
        404
      </h1>
      <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
        A Peaceful Little Detour
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        The page you are looking for has wandered gently off the path. Take a deep breath and return home.
      </p>
      <Link to="/dashboard" className="btn-primary text-xs px-6 py-2.5">
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
