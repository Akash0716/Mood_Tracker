import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { moodService } from '../services/moodService';

const PRIMARY_MOODS = [
  { key: 'very_sad', score: 1, label: 'Very Sad', emoji: '😢', desc: 'Low energy, heavy heart', color: 'from-rose-500/20 to-rose-600/10 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300' },
  { key: 'sad', score: 2, label: 'Sad', emoji: '😔', desc: 'Somber or feeling down', color: 'from-orange-500/20 to-orange-600/10 border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-300' },
  { key: 'neutral', score: 3, label: 'Neutral', emoji: '😐', desc: 'Balanced, steady, ordinary', color: 'from-amber-500/20 to-amber-600/10 border-amber-200 dark:border-amber-900 text-amber-700 dark:text-amber-300' },
  { key: 'happy', score: 4, label: 'Happy', emoji: '🙂', desc: 'Light, contented, smiling', color: 'from-bloom-500/20 to-bloom-600/10 border-bloom-200 dark:border-bloom-900 text-bloom-700 dark:text-bloom-300' },
  { key: 'very_happy', score: 5, label: 'Very Happy', emoji: '✨', desc: 'Radiant, energized, joyful', color: 'from-lavender-500/20 to-lavender-600/10 border-lavender-200 dark:border-lavender-900 text-lavender-700 dark:text-lavender-300' },
];

const EMOTION_CHIPS = [
  'Calm',
  'Grateful',
  'Excited',
  'Stressed',
  'Anxious',
  'Tired',
  'Lonely',
  'Motivated',
  'Proud',
  'Overwhelmed',
  'Hopeful',
  'Content',
  'Frustrated',
  'Peaceful',
  'Restless',
  'Inspired',
];

const CONTRIBUTING_FACTORS = [
  'Sleep',
  'Work',
  'Studies',
  'Relationships',
  'Exercise',
  'Health',
  'Family',
  'Hobbies',
  'Weather',
  'Finances',
  'Social',
  'Nutrition',
];

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const MoodCheckInPage = () => {
  const today = getTodayString();
  const [date, setDate] = useState(today);
  const [selectedMood, setSelectedMood] = useState('happy');
  const [score, setScore] = useState(4);
  const [selectedEmotions, setSelectedEmotions] = useState(['Calm']);
  const [selectedFactors, setSelectedFactors] = useState(['Sleep']);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [existingId, setExistingId] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(false);

  const navigate = useNavigate();

  // Load existing mood entry if one exists for the selected date
  useEffect(() => {
    const fetchExistingForDate = async () => {
      try {
        setLoadingExisting(true);
        setErrorMessage('');
        const res = await moodService.getMoods({ startDate: date, endDate: date });
        if (res.data && res.data.length > 0) {
          const entry = res.data[0];
          setExistingId(entry._id);
          setSelectedMood(entry.mood);
          setScore(entry.score);
          setSelectedEmotions(entry.emotions || []);
          setSelectedFactors(entry.factors || []);
          setNotes(entry.notes || '');
        } else {
          setExistingId(null);
          // Set defaults if no record exists for that date
          if (date === today) {
            setSelectedMood('happy');
            setScore(4);
          }
        }
      } catch (err) {
        // Silently proceed
      } finally {
        setLoadingExisting(false);
      }
    };

    fetchExistingForDate();
  }, [date, today]);

  const handleMoodSelect = (moodItem) => {
    setSelectedMood(moodItem.key);
    setScore(moodItem.score);
  };

  const toggleEmotion = (emotion) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
    );
  };

  const toggleFactor = (factor) => {
    setSelectedFactors((prev) =>
      prev.includes(factor) ? prev.filter((f) => f !== factor) : [...prev, factor]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedMood) {
      setErrorMessage('Please select your primary mood.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        date,
        mood: selectedMood,
        score,
        emotions: selectedEmotions,
        factors: selectedFactors,
        notes,
      };

      if (existingId) {
        await moodService.updateMood(existingId, payload);
        setSuccessMessage('Your check-in has been updated successfully! ✨');
      } else {
        await moodService.createMood(payload);
        setSuccessMessage('Daily check-in saved beautifully! 🌱 Thank you for pausing with yourself.');
      }

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Could not save mood check-in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-bloom-600 dark:text-bloom-400" />
            <span>Daily Mood Check-In</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Pause, breathe, and honor how you are feeling in this moment.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            max={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-bloom-50 dark:bg-bloom-950/40 border border-bloom-300 dark:border-bloom-800 text-bloom-800 dark:text-bloom-200 text-sm flex items-center gap-2.5 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-bloom-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2.5 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {existingId && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>You have already checked in for {date}. Updating this form will adjust your record.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Primary Mood */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              1. Choose Your Primary Mood
            </h3>
            <span className="text-xs font-semibold text-bloom-600 dark:text-bloom-400">
              Score: {score} / 5
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {PRIMARY_MOODS.map((item) => {
              const isSelected = selectedMood === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleMoodSelect(item)}
                  className={`p-4 rounded-2xl border transition-all duration-200 text-center flex flex-col items-center gap-2 relative ${
                    isSelected
                      ? `bg-gradient-to-b ${item.color} shadow-md scale-[1.03] ring-2 ring-bloom-500/50`
                      : 'bg-white/70 dark:bg-slate-850/60 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow-sm transition-transform hover:scale-110">
                    {item.emoji}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight hidden sm:block">
                    {item.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Specific Emotions */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            2. What feelings are present right now?
          </h3>
          <p className="text-xs text-slate-400">
            Select any emotion tags that resonate with your day:
          </p>
          <div className="flex flex-wrap gap-2">
            {EMOTION_CHIPS.map((emotion) => {
              const active = selectedEmotions.includes(emotion);
              return (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => toggleEmotion(emotion)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-bloom-600 text-white shadow-sm shadow-bloom-500/30 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  {emotion}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Contributing Factors */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            3. Contributing Factors
          </h3>
          <p className="text-xs text-slate-400">
            What had the strongest influence on your headspace today?
          </p>
          <div className="flex flex-wrap gap-2">
            {CONTRIBUTING_FACTORS.map((factor) => {
              const active = selectedFactors.includes(factor);
              return (
                <button
                  key={factor}
                  type="button"
                  onClick={() => toggleFactor(factor)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-lavender-600 text-white shadow-sm shadow-lavender-500/30 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  {factor}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Private Notes */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              4. Daily Reflection Notes (Optional)
            </h3>
            <span className="text-[11px] text-slate-400">{notes.length} / 1000</span>
          </div>
          <textarea
            rows={4}
            maxLength={1000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Jot down a few words about what went well, what felt heavy, or what you learned today..."
            className="input-field text-sm leading-relaxed resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || loadingExisting}
            className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-bloom-500/20"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving check-in...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{existingId ? 'Update Check-In' : 'Save Daily Check-In'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MoodCheckInPage;
