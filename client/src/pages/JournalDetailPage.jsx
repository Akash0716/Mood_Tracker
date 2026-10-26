import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  Edit3,
  Trash2,
  Heart,
  Sparkles,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { journalService } from '../services/journalService';

const MOOD_EMOJIS = {
  very_sad: '😢',
  sad: '😔',
  neutral: '😐',
  happy: '🙂',
  very_happy: '✨',
};

const JournalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        const data = await journalService.getJournalById(id);
        setEntry(data);
      } catch (err) {
        setError(err.message || 'Journal entry not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    try {
      await journalService.deleteJournal(id);
      navigate('/journal');
    } catch (err) {
      alert(err.message || 'Failed to delete entry.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-bloom-600 animate-spin" />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Journal Entry Not Found
        </h2>
        <p className="text-xs text-slate-400">{error || 'This reflection does not exist.'}</p>
        <Link to="/journal" className="btn-primary text-xs inline-flex">
          <span>Return to Journal</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/journal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/journal/edit/${entry._id}`}
            className="btn-secondary text-xs px-3.5 py-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Journal Card */}
      <article className="p-8 sm:p-10 rounded-3xl glass-card space-y-8 shadow-sm">
        {/* Header Metadata */}
        <div className="space-y-4 border-b border-cream-200/60 dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-bloom-600" />
              <span>{entry.entryDate}</span>
            </span>

            {/* Matching mood on that day */}
            {entry.mood && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium">
                <span>{MOOD_EMOJIS[entry.mood.mood] || '✨'}</span>
                <span className="capitalize">{entry.mood.mood.replace('_', ' ')} (Score: {entry.mood.score}/5)</span>
              </span>
            )}

            {entry.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full bg-bloom-100/70 dark:bg-bloom-950/70 text-bloom-800 dark:text-bloom-300 font-semibold text-[11px]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {entry.title}
          </h1>

          {entry.prompt && (
            <div className="p-3.5 rounded-2xl bg-lavender-50/70 dark:bg-lavender-950/30 border border-lavender-200/70 dark:border-lavender-900 text-xs text-lavender-800 dark:text-lavender-300 italic">
              Prompt: "{entry.prompt}"
            </div>
          )}
        </div>

        {/* Safe text content body */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {entry.content}
        </div>

        {/* Gratitude & Positivity Callouts */}
        {(entry.gratitudeNotes?.length > 0 || entry.positiveMoments?.length > 0) && (
          <div className="pt-6 border-t border-cream-200/60 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {entry.gratitudeNotes?.length > 0 && (
              <div className="p-4 rounded-2xl bg-cream-50 dark:bg-slate-850 border border-cream-200/70 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Gratitude Notes</span>
                </h3>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {entry.gratitudeNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-bloom-500 font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {entry.positiveMoments?.length > 0 && (
              <div className="p-4 rounded-2xl bg-cream-50 dark:bg-slate-850 border border-cream-200/70 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Positive Moment</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{entry.positiveMoments[0]}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer timestamp */}
        <div className="pt-4 text-right text-[11px] text-slate-400">
          Last updated on {new Date(entry.updatedAt || entry.createdAt).toLocaleDateString()}
        </div>
      </article>
    </div>
  );
};

export default JournalDetailPage;
