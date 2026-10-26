import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Lock,
  Moon,
  Sun,
  Shield,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Droplets,
  Heart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import { moodService } from '../services/moodService';
import { journalService } from '../services/journalService';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();

  // Profile states
  const [name, setName] = useState(user?.name || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Wellness Targets
  const [sleepTarget, setSleepTarget] = useState(user?.preferences?.wellnessGoals?.sleepHours || 8);
  const [waterTarget, setWaterTarget] = useState(user?.preferences?.wellnessGoals?.waterGlasses || 8);
  const [exerciseTarget, setExerciseTarget] = useState(user?.preferences?.wellnessGoals?.exerciseMinutes || 30);
  const [meditationTarget, setMeditationTarget] = useState(user?.preferences?.wellnessGoals?.meditationMinutes || 15);
  const [goalsSaving, setGoalsSaving] = useState(false);
  const [goalsSuccess, setGoalsSuccess] = useState('');

  // Export state
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      if (user.preferences?.wellnessGoals) {
        setSleepTarget(user.preferences.wellnessGoals.sleepHours || 8);
        setWaterTarget(user.preferences.wellnessGoals.waterGlasses || 8);
        setExerciseTarget(user.preferences.wellnessGoals.exerciseMinutes || 30);
        setMeditationTarget(user.preferences.wellnessGoals.meditationMinutes || 15);
      }
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    try {
      setProfileSaving(true);
      const res = await authService.updateProfile({ name });
      updateUser(res.user);
      setProfileSuccess('Profile name updated successfully! ✨');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setPasswordSaving(true);
      await authService.changePassword({ currentPassword, newPassword, confirmNewPassword });
      setPasswordSuccess('Password changed successfully! 🔒');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleSaveGoals = async (e) => {
    e.preventDefault();
    setGoalsSuccess('');

    try {
      setGoalsSaving(true);
      const res = await authService.updatePreferences({
        wellnessGoals: {
          sleepHours: Number(sleepTarget),
          waterGlasses: Number(waterTarget),
          exerciseMinutes: Number(exerciseTarget),
          meditationMinutes: Number(meditationTarget),
        },
      });
      updateUser(res.user);
      setGoalsSuccess('Daily wellness targets updated! 🎯');
      setTimeout(() => setGoalsSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update goals.');
    } finally {
      setGoalsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      const [moodsRes, journalsRes] = await Promise.all([
        moodService.getMoods({ limit: 1000 }),
        journalService.getJournals({ limit: 1000 }),
      ]);

      const backup = {
        exportDate: new Date().toISOString(),
        user: { name: user?.name, email: user?.email },
        moods: moodsRes.data || [],
        journals: journalsRes.data || [],
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `mindbloom-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      alert('Failed to export data: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-bloom-600 dark:text-bloom-400" />
          <span>Profile & Wellness Settings</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your account preferences, wellness targets, and security.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <User className="w-4 h-4 text-bloom-600" />
            <span>Personal Profile</span>
          </h3>

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-bloom-50 dark:bg-bloom-950/40 border border-bloom-300 text-bloom-800 dark:text-bloom-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-bloom-600" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="input-field text-sm opacity-60 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Email is used for account authentication and cannot be edited.
              </span>
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="btn-primary text-xs w-full py-2.5"
            >
              {profileSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-lavender-600" />
            <span>Security & Password</span>
          </h3>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-bloom-50 dark:bg-bloom-950/40 border border-bloom-300 text-bloom-800 dark:text-bloom-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-bloom-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field text-sm py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                New Password (min 6 chars)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field text-sm py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field text-sm py-2"
              />
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="btn-secondary text-xs w-full py-2.5 mt-2"
            >
              {passwordSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Change Password</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Wellness Targets Configuration */}
      <div className="p-6 rounded-3xl glass-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-500" />
            <span>Configurable Daily Wellness Targets</span>
          </h3>
          {goalsSuccess && (
            <span className="text-xs font-semibold text-bloom-600 dark:text-bloom-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{goalsSuccess}</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveGoals} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Sleep (hours)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                step="0.5"
                value={sleepTarget}
                onChange={(e) => setSleepTarget(e.target.value)}
                className="input-field text-sm text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Water (glasses)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={waterTarget}
                onChange={(e) => setWaterTarget(e.target.value)}
                className="input-field text-sm text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Exercise (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="360"
                step="5"
                value={exerciseTarget}
                onChange={(e) => setExerciseTarget(e.target.value)}
                className="input-field text-sm text-center font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Meditation (minutes)
              </label>
              <input
                type="number"
                min="0"
                max="240"
                step="5"
                value={meditationTarget}
                onChange={(e) => setMeditationTarget(e.target.value)}
                className="input-field text-sm text-center font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={goalsSaving}
              className="btn-primary text-xs px-6 py-2"
            >
              {goalsSaving ? 'Saving Targets...' : 'Update Wellness Targets'}
            </button>
          </div>
        </form>
      </div>

      {/* Theme and Data Privacy Card */}
      <div className="p-6 rounded-3xl glass-card space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Appearance & Data Ownership</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-cream-50 dark:bg-slate-850 border border-cream-200/60 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Display Theme</p>
            <p className="text-xs text-slate-400">Choose between light sanctuary and night rest mode.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
                theme === 'light'
                  ? 'bg-white border-bloom-500 text-bloom-700 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border ${
                theme === 'dark'
                  ? 'bg-slate-800 border-bloom-500 text-bloom-400 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-cream-50 dark:bg-slate-850 border border-cream-200/60 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Export Sanctuary Data</p>
            <p className="text-xs text-slate-400">Download a complete JSON export of all your moods and journals.</p>
          </div>

          <button
            onClick={handleExportData}
            disabled={exporting}
            className="btn-secondary text-xs px-4 py-2 shrink-0"
          >
            {exporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Export JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
