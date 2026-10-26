import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Calendar,
  Filter,
  Trash2,
  Edit3,
  Loader2,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Smile,
} from 'lucide-react';
import { moodService } from '../services/moodService';

const MOOD_META = {
  very_sad: { label: 'Very Sad', emoji: '😢', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
  sad: { label: 'Sad', emoji: '😔', badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300' },
  neutral: { label: 'Neutral', emoji: '😐', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  happy: { label: 'Happy', emoji: '🙂', badge: 'bg-bloom-100 text-bloom-800 dark:bg-bloom-950 dark:text-bloom-300' },
  very_happy: { label: 'Very Happy', emoji: '✨', badge: 'bg-lavender-100 text-lavender-800 dark:bg-lavender-950 dark:text-lavender-300' },
};

const MoodHistoryPage = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [moodFilter, setMoodFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalRecords: 0 });

  const fetchMoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 10,
      };
      if (moodFilter) params.mood = moodFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await moodService.getMoods(params);
      setMoods(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load mood history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, [page, moodFilter, startDate, endDate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mood check-in?')) return;
    try {
      await moodService.deleteMood(id);
      setMoods((prev) => prev.filter((m) => m._id !== id));
      setPagination((prev) => ({ ...prev, totalRecords: Math.max(0, prev.totalRecords - 1) }));
    } catch (err) {
      alert(err.message || 'Could not delete entry.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-bloom-600 dark:text-bloom-400" />
            <span>Mood History</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A chronological timeline of your emotional check-ins and reflections.
          </p>
        </div>

        <Link to="/check-in" className="btn-primary text-sm whitespace-nowrap self-start sm:self-auto">
          <Sparkles className="w-4 h-4" />
          <span>New Check-In</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl glass-card flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          <span>Filter:</span>
        </div>

        {/* Mood dropdown */}
        <select
          value={moodFilter}
          onChange={(e) => {
            setMoodFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
        >
          <option value="">All Moods</option>
          <option value="very_happy">✨ Very Happy</option>
          <option value="happy">🙂 Happy</option>
          <option value="neutral">😐 Neutral</option>
          <option value="sad">😔 Sad</option>
          <option value="very_sad">😢 Very Sad</option>
        </select>

        {/* Date Filters */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            placeholder="From"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            placeholder="To"
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
          />
        </div>

        {(moodFilter || startDate || endDate) && (
          <button
            onClick={() => {
              setMoodFilter('');
              setStartDate('');
              setEndDate('');
              setPage(1);
            }}
            className="text-xs font-semibold text-rose-500 hover:underline ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Mood Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-white/50 dark:bg-slate-900/50 animate-pulse" />
          ))}
        </div>
      ) : moods.length > 0 ? (
        <div className="space-y-4">
          {moods.map((item) => {
            const meta = MOOD_META[item.mood] || { label: 'Mood', emoji: '✨', badge: 'bg-slate-100' };
            return (
              <div
                key={item._id}
                className="p-5 rounded-3xl glass-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-cream-50 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {meta.emoji}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${meta.badge}`}>
                        {meta.label} ({item.score}/5)
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </span>
                    </div>

                    {item.notes && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                        "{item.notes}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {item.emotions?.map((e, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-bloom-100/60 dark:bg-bloom-950/60 text-bloom-800 dark:text-bloom-300"
                        >
                          {e}
                        </span>
                      ))}
                      {item.factors?.map((f, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-lavender-100/60 dark:bg-lavender-950/60 text-lavender-800 dark:text-lavender-300"
                        >
                          • {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    to="/check-in"
                    title="Edit record"
                    className="p-2 rounded-xl text-slate-400 hover:text-bloom-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    title="Delete record"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 rounded-2xl glass-card text-xs">
              <span className="text-slate-400">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} total entries)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-3xl glass-card text-center space-y-3">
          <Smile className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            No mood records match your filters
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {moodFilter || startDate || endDate
              ? 'Try widening your date range or removing filters to view more records.'
              : 'You haven’t recorded any mood check-ins yet. Take a moment to log your first one!'}
          </p>
          <Link to="/check-in" className="btn-primary text-xs mt-2">
            <span>Log Check-In</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MoodHistoryPage;
