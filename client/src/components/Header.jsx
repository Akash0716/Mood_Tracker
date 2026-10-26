import React from 'react';
import { Menu, Sunrise, Sun, Sunset, Moon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

function getTimeOfDayGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { text: 'Good morning', icon: Sunrise, color: 'text-amber-500' };
  } else if (hour >= 12 && hour < 17) {
    return { text: 'Good afternoon', icon: Sun, color: 'text-amber-500' };
  } else if (hour >= 17 && hour < 21) {
    return { text: 'Good evening', icon: Sunset, color: 'text-orange-400' };
  } else {
    return { text: 'Restful night', icon: Moon, color: 'text-indigo-400' };
  }
}

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();
  const greeting = getTimeOfDayGreeting();
  const GreetingIcon = greeting.icon;

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const firstName = user?.name ? user.name.split(' ')[0] : 'friend';

  return (
    <header className="sticky top-0 z-30 h-20 bg-cream-100/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-cream-200/60 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <GreetingIcon className={`w-4 h-4 ${greeting.color}`} />
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
              {greeting.text}, <span className="text-bloom-600 dark:text-bloom-400">{firstName}</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {todayFormatted} • Welcome to your daily bloom
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        <Link
          to="/check-in"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-bloom-100 dark:bg-bloom-950/60 text-bloom-800 dark:text-bloom-300 border border-bloom-200 dark:border-bloom-800 hover:bg-bloom-200 transition-colors shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-bloom-600 dark:text-bloom-400" />
          <span>Today's Check-In</span>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
