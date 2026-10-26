import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Droplets,
  X,
  Clock,
  Heart,
} from 'lucide-react';
import { moodService } from '../services/moodService';
import { journalService } from '../services/journalService';

const MOOD_COLORS = {
  very_sad: { bg: 'bg-rose-100 dark:bg-rose-950/80', text: 'text-rose-700 dark:text-rose-300', emoji: '😢', border: 'border-rose-300 dark:border-rose-800' },
  sad: { bg: 'bg-orange-100 dark:bg-orange-950/80', text: 'text-orange-700 dark:text-orange-300', emoji: '😔', border: 'border-orange-300 dark:border-orange-800' },
  neutral: { bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-700 dark:text-amber-300', emoji: '😐', border: 'border-amber-300 dark:border-amber-800' },
  happy: { bg: 'bg-bloom-100 dark:bg-bloom-950/80', text: 'text-bloom-700 dark:text-bloom-300', emoji: '🙂', border: 'border-bloom-300 dark:border-bloom-800' },
  very_happy: { bg: 'bg-lavender-100 dark:bg-lavender-950/80', text: 'text-lavender-700 dark:text-lavender-300', emoji: '✨', border: 'border-lavender-300 dark:border-lavender-800' },
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthDetails(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function formatDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

const MoodCalendarPage = () => {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [moodMap, setMoodMap] = useState({});
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);
  const [dayJournals, setDayJournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(false);
  const [loading, setLoading] = useState(true);

  const { firstDay, daysInMonth } = getMonthDetails(currentYear, currentMonth);

  // Month date range for API fetch
  const monthStart = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
  const monthEnd = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

  useEffect(() => {
    const fetchMonthMoods = async () => {
      try {
        setLoading(true);
        const res = await moodService.getMoods({
          startDate: monthStart,
          endDate: monthEnd,
          limit: 31,
        });

        const map = {};
        if (res.data) {
          res.data.forEach((m) => {
            map[m.date] = m;
          });
        }
        setMoodMap(map);
      } catch (err) {
        console.error('Failed to load month moods', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthMoods();
  }, [currentYear, currentMonth, monthStart, monthEnd]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDateClick = async (dateStr, moodRecord) => {
    setSelectedDayInfo({
      date: dateStr,
      mood: moodRecord || null,
    });

    try {
      setLoadingJournals(true);
      const entries = await journalService.getJournalByDate(dateStr);
      setDayJournals(entries || []);
    } catch (err) {
      setDayJournals([]);
    } finally {
      setLoadingJournals(false);
    }
  };

  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Month Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-bloom-600 dark:text-bloom-400" />
            <span>Mood Calendar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A monthly visual tapestry of your emotional wellness.
          </p>
        </div>

        {/* Navigator Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-card self-start sm:self-auto shadow-sm">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold px-3 text-slate-800 dark:text-slate-100 min-w-36 text-center">
            {monthLabel}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="p-6 rounded-3xl glass-card space-y-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-cream-200/60 dark:border-slate-800">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Empty cells before month starts */}
          {Array.from({ length: firstDay }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="h-20 sm:h-28 rounded-2xl bg-slate-50/40 dark:bg-slate-900/30 opacity-40 border border-transparent"
            />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const dayNum = index + 1;
            const dateStr = formatDateKey(currentYear, currentMonth, dayNum);
            const mood = moodMap[dateStr];
            const meta = mood ? MOOD_COLORS[mood.mood] : null;

            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(dateStr, mood)}
                className={`h-20 sm:h-28 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 hover:scale-[1.02] hover:shadow-md cursor-pointer ${
                  meta
                    ? `${meta.bg} ${meta.border} shadow-sm`
                    : 'bg-white/60 dark:bg-slate-850/60 border-slate-200/60 dark:border-slate-800 hover:border-bloom-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {dayNum}
                  </span>
                  {meta && <span className="text-sm sm:text-lg">{meta.emoji}</span>}
                </div>

                {mood ? (
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold block truncate capitalize">
                      {mood.mood.replace('_', ' ')}
                    </span>
                    {mood.emotions && mood.emotions.length > 0 && (
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 truncate hidden sm:block">
                        {mood.emotions[0]}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-light italic hidden sm:block">
                    No entry
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-cream-200/60 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-600 dark:text-slate-300">Mood Legend:</span>
          {Object.entries(MOOD_COLORS).map(([key, item]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span>{item.emoji}</span>
              <span className="capitalize">{key.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Date Detail Modal */}
      {selectedDayInfo && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-cream-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setSelectedDayInfo(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cream-50 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner">
                {selectedDayInfo.mood ? MOOD_COLORS[selectedDayInfo.mood.mood]?.emoji : '🌱'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedDayInfo.date}
                </h3>
                <p className="text-xs text-slate-400">Day Details & Reflections</p>
              </div>
            </div>

            {selectedDayInfo.mood ? (
              <div className="p-4 rounded-2xl bg-cream-50/80 dark:bg-slate-850 border border-cream-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Primary Mood: {selectedDayInfo.mood.mood.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-semibold text-bloom-600 dark:text-bloom-400">
                    Score: {selectedDayInfo.mood.score} / 5
                  </span>
                </div>

                {selectedDayInfo.mood.notes && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
                    "{selectedDayInfo.mood.notes}"
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedDayInfo.mood.emotions?.map((e, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-bloom-100 text-bloom-800 dark:bg-bloom-950 dark:text-bloom-300"
                    >
                      {e}
                    </span>
                  ))}
                  {selectedDayInfo.mood.factors?.map((f, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-lavender-100 text-lavender-800 dark:bg-lavender-950 dark:text-lavender-300"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                <p className="text-xs text-slate-400">No mood check-in was logged on this date.</p>
                <Link
                  to="/check-in"
                  className="btn-primary text-xs inline-flex"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Log check-in for this day</span>
                </Link>
              </div>
            )}

            {/* Linked Journal Entries for this day */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-bloom-600" />
                <span>Journal Entries on this Day</span>
              </h4>

              {loadingJournals ? (
                <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ) : dayJournals.length > 0 ? (
                dayJournals.map((entry) => (
                  <Link
                    key={entry._id}
                    to={`/journal/${entry._id}`}
                    className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-bloom-400 transition-colors group block"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-bloom-600">
                        {entry.title}
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{entry.content}</p>
                    </div>
                    <span className="text-xs font-semibold text-bloom-600 shrink-0">Read →</span>
                  </Link>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] text-slate-400 text-center">
                  No journal entry written for this date.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodCalendarPage;
