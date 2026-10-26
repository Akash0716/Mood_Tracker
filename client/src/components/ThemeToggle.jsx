import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:text-bloom-600 dark:hover:text-bloom-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-500 transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
