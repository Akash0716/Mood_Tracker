import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  Smile,
} from 'lucide-react';
import { journalService } from '../services/journalService';

const TAG_OPTIONS = [
  'All',
  'Personal',
  'Gratitude',
  'Mindfulness',
  'College',
  'Work',
  'Health',
  'Family',
  'Goals',
  'Reflection',
];

const JournalListPage = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalRecords: 0 });

  const fetchJournals = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 9,
        sort: sortOrder,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedTag !== 'All') params.tag = selectedTag;

      const res = await journalService.getJournals(params);
      setJournals(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load journal entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJournals();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedTag, sortOrder, page]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    try {
      await journalService.deleteJournal(id);
      setJournals((prev) => prev.filter((j) => j._id !== id));
      setPagination((prev) => ({ ...prev, totalRecords: Math.max(0, prev.totalRecords - 1) }));
    } catch (err) {
      alert(err.message || 'Failed to delete journal entry.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & New Entry CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-bloom-600 dark:text-bloom-400" />
            <span>Wellness Journal</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A quiet sanctuary for your daily thoughts, reflections, and gratitude.
          </p>
        </div>

        <Link to="/journal/new" className="btn-primary text-sm whitespace-nowrap self-start sm:self-auto shadow-md shadow-bloom-500/20">
          <Plus className="w-4 h-4" />
          <span>Write New Entry</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl glass-card space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search reflections by title or content..."
              className="input-field pl-10 text-xs sm:text-sm"
            />
          </div>

          {/* Sort order */}
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Tag filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Tags:</span>
          {TAG_OPTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-bloom-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Journal Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-white/50 dark:bg-slate-900/50 animate-pulse" />
          ))}
        </div>
      ) : journals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {journals.map((entry) => (
            <Link
              key={entry._id}
              to={`/journal/${entry._id}`}
              className="p-6 rounded-3xl glass-card flex flex-col justify-between hover:shadow-lg hover:border-bloom-300 dark:hover:border-bloom-700/60 transition-all duration-200 group relative block"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{entry.entryDate}</span>
                  </div>
                  {entry.tags && entry.tags[0] && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-bloom-100/70 dark:bg-bloom-950/70 text-bloom-800 dark:text-bloom-300">
                      {entry.tags[0]}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-bloom-600 dark:group-hover:text-bloom-400 transition-colors line-clamp-1">
                  {entry.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {entry.content}
                </p>

                {/* Gratitude highlight if available */}
                {entry.gratitudeNotes && entry.gratitudeNotes.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-cream-50 dark:bg-slate-850/80 border border-cream-200/60 dark:border-slate-800 flex items-start gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-1">
                      Gratitude: {entry.gratitudeNotes[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-cream-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-bloom-600 dark:text-bloom-400 group-hover:underline">
                  Read reflection →
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/journal/edit/${entry._id}`;
                    }}
                    title="Edit entry"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(entry._id, e)}
                    title="Delete entry"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-16 rounded-3xl glass-card text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            No journal reflections found
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            {searchTerm || selectedTag !== 'All'
              ? 'Try modifying your search keywords or tag selection.'
              : 'Writing down your reflections brings clarity and calm. Start your first entry today!'}
          </p>
          <Link to="/journal/new" className="btn-primary text-xs inline-flex mt-2">
            <Plus className="w-4 h-4" />
            <span>Create First Entry</span>
          </Link>
        </div>
      )}

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
  );
};

export default JournalListPage;
