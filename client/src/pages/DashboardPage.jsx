import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Smile,
  BookOpen,
  Droplets,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Calendar,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Heart,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from '../context/AuthContext';

const MOOD_EMOJIS = {
  very_sad: '😢',
  sad: '😔',
  neutral: '😐',
  happy: '🙂',
  very_happy: '✨',
};

const MOOD_NAMES = {
  very_sad: 'Very Sad',
  sad: 'Sad',
  neutral: 'Neutral',
  happy: 'Happy',
  very_happy: 'Very Happy',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-cream-200 dark:border-slate-800 text-xs space-y-1">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{data.date}</p>
        <p className="flex items-center gap-1.5 text-bloom-600 dark:text-bloom-400 font-bold">
          <span>{data.emoji}</span>
          <span>{data.label} (Score: {data.score}/5)</span>
        </p>
        {data.emotions && data.emotions.length > 0 && (
          <p className="text-[11px] text-slate-400">
            {data.emotions.slice(0, 3).join(', ')}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [sum, trends] = await Promise.all([
          analyticsService.getSummary(timeframe),
          analyticsService.getMoodTrends(timeframe),
        ]);
        setSummary(sum);
        setTrendData(trends);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-3xl bg-white/50 dark:bg-slate-900/50" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-32 rounded-2xl bg-white/50 dark:bg-slate-900/50" />
          <div className="h-32 rounded-2xl bg-white/50 dark:bg-slate-900/50" />
          <div className="h-32 rounded-2xl bg-white/50 dark:bg-slate-900/50" />
          <div className="h-32 rounded-2xl bg-white/50 dark:bg-slate-900/50" />
        </div>
        <div className="h-80 rounded-3xl bg-white/50 dark:bg-slate-900/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error notification if any */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setTimeframe(timeframe)}
            className="text-xs font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Daily Check-In Prompt / Status Banner */}
      {!summary?.checkedInToday ? (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-bloom-500/15 via-emerald-500/10 to-lavender-500/15 border border-bloom-200/80 dark:border-bloom-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-bloom-500 to-emerald-400 flex items-center justify-center text-white text-2xl shadow-md shadow-bloom-500/20 shrink-0">
              🌱
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                How is your spirit feeling today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                You haven't completed your daily mood check-in yet. Take a mindful pause.
              </p>
            </div>
          </div>
          <Link to="/check-in" className="btn-primary text-sm whitespace-nowrap w-full sm:w-auto">
            <Sparkles className="w-4 h-4" />
            <span>Check In Today</span>
          </Link>
        </div>
      ) : (
        <div className="p-5 rounded-3xl glass-card flex items-center justify-between border-bloom-200/60 dark:border-bloom-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bloom-100 dark:bg-bloom-950 flex items-center justify-center text-xl">
              {MOOD_EMOJIS[summary.todayMood?.mood] || '✨'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300">
                  Checked in today
                </span>
                <span className="text-xs text-slate-400">
                  {MOOD_NAMES[summary.todayMood?.mood]} (Score: {summary.todayMood?.score}/5)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {summary.todayMood?.notes || 'No extra notes recorded.'}
              </p>
            </div>
          </div>
          <Link
            to="/check-in"
            className="text-xs font-semibold text-bloom-600 dark:text-bloom-400 hover:underline"
          >
            Update check-in
          </Link>
        </div>
      )}

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="p-5 rounded-2xl glass-card relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Current Streak
            </span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/60 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary?.streakDays || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">days in a row</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {summary?.streakDays > 0
              ? 'Awesome commitment to your well-being!'
              : 'Log today to ignite your streak!'}
          </p>
        </div>

        {/* Average Mood Score */}
        <div className="p-5 rounded-2xl glass-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg Mood Score
            </span>
            <div className="w-8 h-8 rounded-xl bg-bloom-100 dark:bg-bloom-950/60 flex items-center justify-center text-bloom-600 dark:text-bloom-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary?.averageMoodScore > 0 ? summary.averageMoodScore : '—'}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Based on {summary?.timeframeEntries || 0} check-ins ({timeframe})
          </p>
        </div>

        {/* Journal Entries */}
        <div className="p-5 rounded-2xl glass-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Journal Entries
            </span>
            <div className="w-8 h-8 rounded-xl bg-lavender-100 dark:bg-lavender-950/60 flex items-center justify-center text-lavender-600 dark:text-lavender-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary?.totalJournals || 0}
            </span>
            <span className="text-xs text-slate-400 font-medium">written</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Reflections & gratitude recorded</p>
        </div>

        {/* Habit Completion */}
        <div className="p-5 rounded-2xl glass-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Habits Progress
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary?.habitCompletionRate || 0}%
            </span>
            <span className="text-xs text-slate-400 font-medium">completed today</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-bloom-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, summary?.habitCompletionRate || 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mood Flow Chart */}
      <div className="p-6 rounded-3xl glass-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-bloom-600 dark:text-bloom-400" />
              <span>Emotional Rhythm & Flow</span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing your mood scores across time from database records
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            {['7d', '30d', 'all'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-700 text-bloom-700 dark:text-bloom-300 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {trendData.length > 0 ? (
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#moodGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-56 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Sparkles className="w-8 h-8 text-bloom-400 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No mood check-ins recorded yet for this timeframe
            </p>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Complete your first check-in to see your personal emotional curve take shape.
            </p>
            <Link to="/check-in" className="btn-primary text-xs mt-4">
              <span>Log First Check-In</span>
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Grid: Rule-based Reflection & Recent Journals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reflection Prompts & Rule-based Insights */}
        <div className="p-6 rounded-3xl glass-card space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Mindful Reflection
            </h3>
          </div>

          {summary?.reflections && summary.reflections.length > 0 ? (
            <div className="space-y-3">
              {summary.reflections.map((ref, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-cream-50/90 dark:bg-slate-800/60 border border-cream-200/80 dark:border-slate-750 space-y-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-bloom-100 dark:bg-bloom-950 text-bloom-800 dark:text-bloom-300">
                    {ref.badge}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {ref.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {ref.message}
                  </p>
                  {ref.suggestion && (
                    <p className="text-[11px] font-medium text-bloom-700 dark:text-bloom-400 pt-1 border-t border-cream-200/50 dark:border-slate-700">
                      💡 {ref.suggestion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              As you log your daily check-ins, mindful patterns and insights will appear here.
            </p>
          )}

          <Link
            to="/journal"
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-lavender-50 dark:bg-lavender-950/40 text-lavender-700 dark:text-lavender-300 border border-lavender-200 dark:border-lavender-900 flex items-center justify-center gap-1.5 hover:bg-lavender-100 transition-colors"
          >
            <span>Write in Journal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Recent Journal Entries */}
        <div className="p-6 rounded-3xl glass-card space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-bloom-600 dark:text-bloom-400" />
              <span>Recent Journal Reflections</span>
            </h3>
            <Link
              to="/journal"
              className="text-xs font-semibold text-bloom-600 dark:text-bloom-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {summary?.recentJournals && summary.recentJournals.length > 0 ? (
            <div className="space-y-3">
              {summary.recentJournals.map((entry) => (
                <Link
                  key={entry._id}
                  to={`/journal/${entry._id}`}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-cream-200/80 dark:border-slate-800 hover:border-bloom-300 dark:hover:border-bloom-700/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 group block"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-bloom-600 dark:group-hover:text-bloom-400 transition-colors">
                        {entry.title}
                      </span>
                      {entry.tags && entry.tags[0] && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-cream-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {entry.tags[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {entry.content}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{entry.entryDate}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-400">
                No journal entries yet. Your thoughts deserve a safe place to bloom.
              </p>
              <Link to="/journal" className="btn-secondary text-xs mt-3">
                <span>Write First Entry</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
