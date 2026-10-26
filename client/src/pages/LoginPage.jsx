import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('maya@mindbloom.app');
    setPassword('Password123!');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-bloom-200">
      {/* Top right ThemeToggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-bloom-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-bloom-500/20">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-white">
            Mind<span className="text-bloom-600 dark:text-bloom-400">Bloom</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white pt-2">
          Welcome back
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter your wellness space and reflect on your day.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="p-6 sm:p-8 rounded-3xl glass-card shadow-lg border border-cream-200/90 dark:border-slate-800 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-2.5 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-11 text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11 text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 mt-2 shadow-md shadow-bloom-500/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to MindBloom</span>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="pt-2 border-t border-cream-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-medium bg-lavender-50 dark:bg-lavender-950/40 border border-lavender-200 dark:border-lavender-900 text-lavender-700 dark:text-lavender-300 hover:bg-lavender-100 dark:hover:bg-lavender-900/50 flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-lavender-500" />
              <span>Fill Demo Credentials (maya@mindbloom.app)</span>
            </button>
          </div>

          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-semibold text-bloom-600 dark:text-bloom-400 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
