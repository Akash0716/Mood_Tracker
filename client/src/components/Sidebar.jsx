import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Heart,
  Calendar,
  BookOpen,
  Droplets,
  BarChart3,
  Settings,
  LogOut,
  X,
  Sprout,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Daily Check-In', path: '/check-in', icon: Sparkles },
  { name: 'Mood History', path: '/moods', icon: Heart },
  { name: 'Mood Calendar', path: '/calendar', icon: Calendar },
  { name: 'Wellness Journal', path: '/journal', icon: BookOpen },
  { name: 'Habits Tracker', path: '/habits', icon: Droplets },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-cream-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-cream-200/60 dark:border-slate-800">
          <NavLink to="/dashboard" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-bloom-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-bloom-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-800 dark:text-white">
                Mind<span className="text-bloom-600 dark:text-bloom-400">Bloom</span>
              </span>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Wellness Sanctuary
              </p>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-bloom-500/15 to-emerald-500/10 text-bloom-700 dark:text-bloom-400 font-semibold shadow-sm border border-bloom-200/50 dark:border-bloom-800/40'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-transform ${
                        isActive
                          ? 'text-bloom-600 dark:text-bloom-400 scale-110'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-cream-200/60 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-cream-50/80 dark:bg-slate-800/50 flex items-center justify-between border border-cream-200/60 dark:border-slate-750">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lavender-400 to-bloom-400 flex items-center justify-center text-white font-semibold text-sm shadow-inner shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {user?.name || 'MindBloom User'}
                </p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Log out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
