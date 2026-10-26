import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Moon,
  Activity,
  Heart,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Save,
  Loader2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { habitService } from '../services/habitService';
import { useAuth } from '../context/AuthContext';

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const HabitsPage = () => {
  const { user } = useAuth();
  const today = getTodayString();
  const [date, setDate] = useState(today);

  // Daily habit stats
  const [sleepHours, setSleepHours] = useState(8);
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [exerciseMinutes, setExerciseMinutes] = useState(30);
  const [meditationMinutes, setMeditationMinutes] = useState(15);
  const [notes, setNotes] = useState('');
  const [customGoals, setCustomGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  // User configured targets
  const [targets, setTargets] = useState({
    sleepHours: 8,
    waterGlasses: 8,
    exerciseMinutes: 30,
    meditationMinutes: 15,
  });

  const [habitsHistory, setHabitsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch today's habit and targets + recent history
  useEffect(() => {
    const loadHabitData = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const [todayData, historyData] = await Promise.all([
          habitService.getTodayHabit(),
          habitService.getHabits({ limit: 14 }),
        ]);

        if (todayData.targets) {
          setTargets(todayData.targets);
        }

        if (todayData.data) {
          setSleepHours(todayData.data.sleepHours || 0);
          setWaterGlasses(todayData.data.waterGlasses || 0);
          setExerciseMinutes(todayData.data.exerciseMinutes || 0);
          setMeditationMinutes(todayData.data.meditationMinutes || 0);
          setNotes(todayData.data.notes || '');
          setCustomGoals(todayData.data.customGoals || []);
        }

        setHabitsHistory(historyData.data || []);
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load habit data.');
      } finally {
        setLoading(false);
      }
    };

    loadHabitData();
  }, [today]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      setSaving(true);
      const payload = {
        date,
        sleepHours: parseFloat(sleepHours) || 0,
        waterGlasses: parseInt(waterGlasses, 10) || 0,
        exerciseMinutes: parseInt(exerciseMinutes, 10) || 0,
        meditationMinutes: parseInt(meditationMinutes, 10) || 0,
        customGoals,
        notes,
      };

      await habitService.saveHabit(payload);
      setSuccessMessage('Wellness habits updated successfully! 💧');

      // Refresh history
      const historyData = await habitService.getHabits({ limit: 14 });
      setHabitsHistory(historyData.data || []);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save habits.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomGoal = () => {
    if (newGoalTitle.trim()) {
      setCustomGoals([...customGoals, { title: newGoalTitle.trim(), completed: false }]);
      setNewGoalTitle('');
    }
  };

  const toggleCustomGoal = (idx) => {
    const updated = [...customGoals];
    updated[idx].completed = !updated[idx].completed;
    setCustomGoals(updated);
  };

  const removeCustomGoal = (idx) => {
    setCustomGoals(customGoals.filter((_, i) => i !== idx));
  };

  // Completion calculation
  const sleepPercent = Math.min(100, Math.round((sleepHours / (targets.sleepHours || 8)) * 100));
  const waterPercent = Math.min(100, Math.round((waterGlasses / (targets.waterGlasses || 8)) * 100));
  const exercisePercent = Math.min(100, Math.round((exerciseMinutes / (targets.exerciseMinutes || 30)) * 100));
  const meditationPercent = Math.min(100, Math.round((meditationMinutes / (targets.meditationMinutes || 15)) * 100));

  const overallAvg = Math.round((sleepPercent + waterPercent + exercisePercent + meditationPercent) / 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Droplets className="w-6 h-6 text-bloom-600 dark:text-bloom-400" />
            <span>Wellness Habit Tracker</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Nurture daily physical and mental rhythms with balance, not pressure.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            max={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-bloom-50 dark:bg-bloom-950/40 border border-bloom-300 dark:border-bloom-800 text-bloom-800 dark:text-bloom-200 text-sm flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-bloom-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2.5 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Habits Progress Summary Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-bloom-500/10 via-emerald-500/10 to-lavender-500/10 border border-bloom-200/80 dark:border-bloom-800/40 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-bloom-700 dark:text-bloom-400">
            Today's Overall Fulfillment
          </span>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {overallAvg}% Goal Target
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {overallAvg >= 80
              ? 'Outstanding balance today! You are taking mindful care of yourself.'
              : overallAvg >= 50
              ? 'Solid steady progress. Keep hydrating and resting well!'
              : 'Remember: small gentle steps matter more than perfection.'}
          </p>
        </div>

        <div className="w-24 h-24 rounded-full border-4 border-bloom-500/30 dark:border-bloom-700/30 flex items-center justify-center relative bg-white/60 dark:bg-slate-900/60 shadow-sm shrink-0">
          <div className="text-center">
            <span className="text-2xl font-black text-bloom-600 dark:text-bloom-400">{overallAvg}%</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Habit Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sleep Hours */}
          <div className="p-5 rounded-3xl glass-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>Sleep Duration</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">Goal: {targets.sleepHours}h</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="input-field text-xl font-bold py-2 text-center"
              />
              <span className="text-xs font-semibold text-slate-400">hours</span>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${sleepPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium block text-right">
                {sleepPercent}% achieved
              </span>
            </div>
          </div>

          {/* Water Intake */}
          <div className="p-5 rounded-3xl glass-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-500" />
                <span>Water Intake</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">Goal: {targets.waterGlasses} gl</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="40"
                value={waterGlasses}
                onChange={(e) => setWaterGlasses(e.target.value)}
                className="input-field text-xl font-bold py-2 text-center"
              />
              <span className="text-xs font-semibold text-slate-400">glasses</span>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium block text-right">
                {waterPercent}% achieved
              </span>
            </div>
          </div>

          {/* Exercise Minutes */}
          <div className="p-5 rounded-3xl glass-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Physical Movement</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">Goal: {targets.exerciseMinutes}m</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="600"
                step="5"
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(e.target.value)}
                className="input-field text-xl font-bold py-2 text-center"
              />
              <span className="text-xs font-semibold text-slate-400">min</span>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${exercisePercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium block text-right">
                {exercisePercent}% achieved
              </span>
            </div>
          </div>

          {/* Meditation Minutes */}
          <div className="p-5 rounded-3xl glass-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-lavender-500" />
                <span>Mindfulness / Rest</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">Goal: {targets.meditationMinutes}m</span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="360"
                step="5"
                value={meditationMinutes}
                onChange={(e) => setMeditationMinutes(e.target.value)}
                className="input-field text-xl font-bold py-2 text-center"
              />
              <span className="text-xs font-semibold text-slate-400">min</span>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-lavender-500 h-full rounded-full transition-all"
                  style={{ width: `${meditationPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 font-medium block text-right">
                {meditationPercent}% achieved
              </span>
            </div>
          </div>
        </div>

        {/* Custom Daily Goals & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Checkbox Goals */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Custom Daily Wellness Intentions
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="e.g. 10 minute walk outside, screen curfew..."
                className="input-field text-xs py-2 flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomGoal();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomGoal}
                className="btn-secondary text-xs px-3 py-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2">
              {customGoals.map((goal, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={goal.completed}
                      onChange={() => toggleCustomGoal(idx)}
                      className="rounded text-bloom-600 focus:ring-bloom-500 w-4 h-4 cursor-pointer"
                    />
                    <span className={goal.completed ? 'line-through text-slate-400' : ''}>
                      {goal.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeCustomGoal(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {customGoals.length === 0 && (
                <p className="text-xs text-slate-400 italic">No custom intentions added yet.</p>
              )}
            </div>
          </div>

          {/* Wellness Notes */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Wellness Notes
            </h3>
            <textarea
              rows={4}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any physical sensations, energy levels, or notes regarding your health today..."
              className="input-field text-xs leading-relaxed resize-none"
            />
            <p className="text-[11px] text-slate-400 leading-normal">
              Notice without judging. The goal is self-awareness and gentle nourishment.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-sm px-8 py-3 shadow-md shadow-bloom-500/20"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving habits...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Habit Progress</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Historical Habits Table */}
      <div className="p-6 rounded-3xl glass-card space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-bloom-600" />
          <span>Recent Wellness Habits History</span>
        </h3>

        {habitsHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="border-b border-cream-200/80 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Sleep</th>
                  <th className="py-2.5 px-3">Water</th>
                  <th className="py-2.5 px-3">Exercise</th>
                  <th className="py-2.5 px-3">Meditation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200/50 dark:divide-slate-800">
                {habitsHistory.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100">
                      {item.date}
                    </td>
                    <td className="py-2.5 px-3">{item.sleepHours} hrs</td>
                    <td className="py-2.5 px-3">{item.waterGlasses} glasses</td>
                    <td className="py-2.5 px-3">{item.exerciseMinutes} min</td>
                    <td className="py-2.5 px-3">{item.meditationMinutes} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No habit records saved yet.</p>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center">
        MindBloom metrics are tracked for personal well-being awareness and are not intended as medical diagnosis or medical guidance.
      </p>
    </div>
  );
};

export default HabitsPage;
