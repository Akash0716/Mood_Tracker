import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Heart,
  BookOpen,
  Droplets,
  BarChart3,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Smile,
  Calendar,
  Lock,
  Compass,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-bloom-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-cream-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-cream-200/70 dark:border-slate-850 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-bloom-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-bloom-500/20">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">
              Mind<span className="text-bloom-600 dark:text-bloom-400">Bloom</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary text-sm">
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                <span>Begin Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-16 sm:pt-24 pb-20 overflow-hidden">
        {/* Soft background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-bloom-200/40 via-lavender-200/40 to-cream-200/0 dark:from-bloom-900/15 dark:via-lavender-900/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bloom-100/80 dark:bg-bloom-950/60 border border-bloom-200 dark:border-bloom-800 text-bloom-800 dark:text-bloom-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-bloom-600 dark:text-bloom-400" />
            <span>Nurture Your Mind, One Day at a Time</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            A Calming Space to <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloom-600 to-emerald-500">Track Moods</span> and Nurture <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-500 to-purple-600">Wellness</span>.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            MindBloom helps you understand emotional rhythms, cultivate daily gratitude, and sustain healthy habits through mindful check-ins and private reflections.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register" className="btn-primary text-base px-6 py-3 w-full sm:w-auto shadow-lg shadow-bloom-500/20">
              <Sprout className="w-5 h-5" />
              <span>Start Free Wellness Journal</span>
            </Link>
            <Link to="/login" className="btn-secondary text-base px-6 py-3 w-full sm:w-auto">
              <span>Explore Demo Space</span>
            </Link>
          </div>

          {/* Interactive Hero Preview Badges */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Daily Moods</p>
                <p className="text-[11px] text-slate-400">5-point scale & tags</p>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Private Journal</p>
                <p className="text-[11px] text-slate-400">Gratitude & prompts</p>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
              <span className="text-2xl">💧</span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Habit Tracker</p>
                <p className="text-[11px] text-slate-400">Sleep, water, exercise</p>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl glass-card flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Visual Insights</p>
                <p className="text-[11px] text-slate-400">Weekly & monthly trends</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-4 sm:px-8 py-20 bg-white/60 dark:bg-slate-900/60 border-y border-cream-200/60 dark:border-slate-850">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-bloom-600 dark:text-bloom-400">
              Thoughtful Features
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Everything You Need to Flourish
            </p>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Designed with soothing aesthetics and clinical mindfulness principles to make wellness feel natural and joyful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-bloom-100 dark:bg-bloom-950/80 flex items-center justify-center text-bloom-600 dark:text-bloom-400">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Daily Emotional Check-Ins
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Log your primary mood, select contributing factors (sleep, work, relationships), and pick emotion tags to capture nuanced feelings.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-lavender-100 dark:bg-lavender-950/80 flex items-center justify-center text-lavender-600 dark:text-lavender-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Sanctuary Journal & Prompts
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Express thoughts in a distraction-free editor. Choose inspiring guided reflection prompts and record positive moments and gratitude bullets.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Daily Wellness Habits
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Set and monitor your personalized targets for sleep hours, glasses of water, exercise minutes, and daily meditation sessions.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Mood Calendar Grid
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Glance over your monthly tapestry. Click any date to review logged emotions and jump directly to your corresponding journal entry.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Analytics & Streak Tracking
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Interactive charts powered by MongoDB reveal your weekday mood patterns, emotional distribution, and habit consistency over time.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Privacy-First Architecture
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Your reflections are strictly confidential. Encrypted passwords, JWT authentication, and strict user-isolated database records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-4 sm:px-8 py-20 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-bloom-600 dark:text-bloom-400">
            How MindBloom Works
          </h2>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            Three Simple Daily Steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-6 rounded-3xl glass-card text-center space-y-3 relative">
            <div className="w-12 h-12 mx-auto rounded-full bg-bloom-500 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-bloom-500/20">
              1
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Check In Daily</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Take 60 seconds to pick your mood emoji, tag primary emotions, and log contributing factors.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card text-center space-y-3 relative">
            <div className="w-12 h-12 mx-auto rounded-full bg-lavender-500 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-lavender-500/20">
              2
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Reflect & Unwind</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Write a gentle entry, answer an inspiring reflection prompt, or simply list three things you are grateful for.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card text-center space-y-3 relative">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
              3
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Bloom with Clarity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review weekly trends and non-judgmental wellness insights that celebrate your growth and progress.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy and Security Assurance */}
      <section className="px-4 sm:px-8 py-16 bg-cream-100/80 dark:bg-slate-900/40 border-t border-cream-200/60 dark:border-slate-850">
        <div className="max-w-4xl mx-auto p-8 rounded-3xl glass-card flex flex-col md:flex-row items-center gap-6 border-bloom-200/60 dark:border-bloom-900/40">
          <div className="w-16 h-16 rounded-2xl bg-bloom-100 dark:bg-bloom-950/80 flex items-center justify-center text-bloom-600 dark:text-bloom-400 shrink-0">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Your Peace of Mind is Our Priority
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your journals and moods belong only to you. MindBloom stores zero advertising cookies, never sells personal data, and enforces strict server-side authorization on every single database query.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-8 py-20 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Ready to Begin Your Wellness Practice?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Join MindBloom today and discover the calming clarity of daily emotional awareness.
        </p>
        <div>
          <Link to="/register" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-bloom-500/25">
            <Sparkles className="w-5 h-5" />
            <span>Create Free Account</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-4 sm:px-8 py-8 border-t border-cream-200/70 dark:border-slate-850 text-xs text-slate-400 dark:text-slate-500 text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Sprout className="w-4 h-4 text-bloom-600 dark:text-bloom-400" />
          <span className="font-semibold text-slate-600 dark:text-slate-300">MindBloom</span>
          <span>• Mood Tracker & Wellness Journal (MERN Stack)</span>
        </div>
        <p className="max-w-2xl mx-auto text-[11px] leading-relaxed text-slate-400/90">
          Disclaimer: MindBloom is designed for personal self-reflection, journaling, and wellness habit tracking. It does not provide medical diagnoses or professional psychiatric advice. If you are experiencing a mental health emergency, please contact professional healthcare resources.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
