import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Sparkles,
  Droplets,
  Heart,
  Loader2,
  AlertCircle,
  Activity,
  Smile,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { analyticsService } from '../services/analyticsService';

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 shadow-md border border-slate-200 dark:border-slate-800 text-xs space-y-1">
        <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
          <span>{data.emoji}</span>
          <span>{data.name}</span>
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          {data.count} check-ins ({payload[0].value}%)
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [trends, setTrends] = useState([]);
  const [distribution, setDistribution] = useState(null);
  const [weekdayAverages, setWeekdayAverages] = useState([]);
  const [habitProgress, setHabitProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const [trendsData, distData, weekdayData, habitsData] = await Promise.all([
          analyticsService.getMoodTrends(timeframe),
          analyticsService.getMoodDistribution(timeframe),
          analyticsService.getWeekdayAverages(),
          analyticsService.getHabitProgress(timeframe),
        ]);

        setTrends(trendsData || []);
        setDistribution(distData || null);
        setWeekdayAverages(weekdayData || []);
        setHabitProgress(habitsData || null);
      } catch (err) {
        setError(err.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    loadAllAnalytics();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 rounded-3xl bg-white/50 dark:bg-slate-900/50" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-3xl bg-white/50 dark:bg-slate-900/50" />
          <div className="h-80 rounded-3xl bg-white/50 dark:bg-slate-900/50" />
        </div>
      </div>
    );
  }

  // Calculate percentages for distribution pie chart
  const totalDistribution = distribution?.totalCount || 0;
  const pieData = (distribution?.distribution || [])
    .filter((d) => d.count > 0)
    .map((d) => ({
      ...d,
      value: totalDistribution > 0 ? Math.round((d.count / totalDistribution) * 100) : 0,
    }));

  return (
    <div className="space-y-8">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-bloom-600 dark:text-bloom-400" />
            <span>Emotional Insights & Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Uncovering meaningful wellness patterns from your MongoDB database records.
          </p>
        </div>

        {/* Timeframe pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-card self-start sm:self-auto text-xs font-semibold shadow-sm">
          {[
            { key: '7d', label: 'Last 7 Days' },
            { key: '30d', label: 'Last 30 Days' },
            { key: '90d', label: 'Last 90 Days' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTimeframe(item.key)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                timeframe === item.key
                  ? 'bg-bloom-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of 4 Core Recharts Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Mood Score Trajectory Over Time */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-bloom-600" />
                <span>1. Mood Scores Over Time</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Tracking changes on the 1-5 scale across {timeframe}
              </p>
            </div>
          </div>

          {trends.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsMoodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val) => [`${val}/5 Score`, 'Mood Score']}
                    labelFormatter={(label, item) => (item[0] ? item[0].payload.date : label)}
                  />
                  <Area type="monotone" dataKey="score" stroke="#059669" strokeWidth={2.5} fill="url(#analyticsMoodGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 italic">
              No entries logged in this timeframe.
            </div>
          )}
        </div>

        {/* Chart 2: Average Mood by Day of Week */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                <span>2. Average Mood by Weekday</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Identify which days you tend to feel most vibrant or drained
              </p>
            </div>
          </div>

          {weekdayAverages.some((w) => w.count > 0) ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekdayAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value, name, item) => [
                      `${value} / 5 (${item.payload.count} records)`,
                      'Average Mood',
                    ]}
                  />
                  <Bar dataKey="average" fill="#818cf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 italic">
              Record a few more check-ins to generate weekday patterns.
            </div>
          )}
        </div>

        {/* Chart 3: Mood Category Distribution */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-purple-500" />
                <span>3. Mood Category Distribution</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Breakdown of {totalDistribution} total recorded check-ins
              </p>
            </div>
          </div>

          {pieData.length > 0 ? (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-slate-600 dark:text-slate-300">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 italic">
              No mood check-ins recorded yet.
            </div>
          )}
        </div>

        {/* Chart 4: Wellness Habit Progress Over Time */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-500" />
                <span>4. Habit Compliance Trends</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Daily recorded sleep hours and water glasses
              </p>
            </div>
          </div>

          {habitProgress?.data?.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={habitProgress.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="displayDate" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="bottom" iconType="circle" />
                  <Bar dataKey="sleepHours" name="Sleep (hrs)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="waterGlasses" name="Water (glasses)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 italic">
              Log habits on the Habits Tracker tab to see compliance graphs.
            </div>
          )}
        </div>
      </div>

      {/* Top Emotions & Contributing Factors Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Emotions */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Heart className="w-4 h-4 text-bloom-600" />
            <span>Most Frequently Logged Emotions</span>
          </h3>

          {distribution?.topEmotions && distribution.topEmotions.length > 0 ? (
            <div className="space-y-2.5">
              {distribution.topEmotions.map((e) => {
                const percent = Math.round((e.count / totalDistribution) * 100);
                return (
                  <div key={e.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{e.name}</span>
                      <span className="text-slate-400">{e.count} times ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-bloom-500 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No emotion tags logged yet.</p>
          )}
        </div>

        {/* Top Contributing Factors */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-lavender-600" />
            <span>Primary Influencing Factors</span>
          </h3>

          {distribution?.topFactors && distribution.topFactors.length > 0 ? (
            <div className="space-y-2.5">
              {distribution.topFactors.map((f) => {
                const percent = Math.round((f.count / totalDistribution) * 100);
                return (
                  <div key={f.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{f.name}</span>
                      <span className="text-slate-400">{f.count} times ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-lavender-500 h-full rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No factors tagged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
