import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Heart,
  Plus,
  Trash2,
  Calendar,
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { journalService } from '../services/journalService';
import { analyticsService } from '../services/analyticsService';

const AVAILABLE_TAGS = [
  'Personal',
  'Gratitude',
  'Mindfulness',
  'College',
  'Work',
  'Health',
  'Family',
  'Goals',
  'Reflection',
  'Relationships',
];

function getTodayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const JournalEditorPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryDate, setEntryDate] = useState(getTodayString());
  const [tags, setTags] = useState(['Personal']);
  const [gratitudeNotes, setGratitudeNotes] = useState(['', '', '']);
  const [positiveMoments, setPositiveMoments] = useState(['']);
  const [prompt, setPrompt] = useState('');
  const [promptsList, setPromptsList] = useState([]);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await analyticsService.getPrompts();
        setPromptsList(data || []);
      } catch (err) {
        // fallback prompts
        setPromptsList([
          { id: '1', prompt: 'What made you smile or pause with appreciation today?' },
          { id: '2', prompt: 'What are three things you feel genuinely grateful for right now?' },
          { id: '3', prompt: 'What was the most challenging part of your day, and how did you navigate it?' },
          { id: '4', prompt: 'What would help you feel more relaxed this evening?' },
        ]);
      }
    };
    fetchPrompts();
  }, []);

  // Fetch existing entry if editing
  useEffect(() => {
    if (isEditing) {
      const fetchEntry = async () => {
        try {
          setLoading(true);
          const data = await journalService.getJournalById(id);
          setTitle(data.title || '');
          setContent(data.content || '');
          setEntryDate(data.entryDate || getTodayString());
          setTags(data.tags && data.tags.length > 0 ? data.tags : ['Personal']);
          setGratitudeNotes(
            data.gratitudeNotes && data.gratitudeNotes.length > 0
              ? data.gratitudeNotes
              : ['', '', '']
          );
          setPositiveMoments(
            data.positiveMoments && data.positiveMoments.length > 0
              ? data.positiveMoments
              : ['']
          );
          setPrompt(data.prompt || '');
        } catch (err) {
          setErrorMessage(err.message || 'Failed to load journal entry.');
        } finally {
          setLoading(false);
        }
      };
      fetchEntry();
    }
  }, [id, isEditing]);

  const toggleTag = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? (prev.length > 1 ? prev.filter((t) => t !== tag) : prev) : [...prev, tag]
    );
  };

  const handleGratitudeChange = (index, value) => {
    const updated = [...gratitudeNotes];
    updated[index] = value;
    setGratitudeNotes(updated);
  };

  const addGratitudeField = () => {
    if (gratitudeNotes.length < 5) {
      setGratitudeNotes([...gratitudeNotes, '']);
    }
  };

  const removeGratitudeField = (index) => {
    if (gratitudeNotes.length > 1) {
      setGratitudeNotes(gratitudeNotes.filter((_, i) => i !== index));
    }
  };

  const handlePositiveMomentChange = (index, value) => {
    const updated = [...positiveMoments];
    updated[index] = value;
    setPositiveMoments(updated);
  };

  const applyPrompt = (selectedPromptText) => {
    setPrompt(selectedPromptText);
    if (!title) {
      setTitle(selectedPromptText);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please provide an entry title.');
      return;
    }

    if (!content.trim()) {
      setErrorMessage('Journal entry content cannot be blank.');
      return;
    }

    try {
      setSaving(true);
      const cleanGratitude = gratitudeNotes.filter((g) => g.trim().length > 0);
      const cleanMoments = positiveMoments.filter((m) => m.trim().length > 0);

      const payload = {
        title: title.trim(),
        content: content.trim(),
        entryDate,
        tags,
        gratitudeNotes: cleanGratitude,
        positiveMoments: cleanMoments,
        prompt: prompt.trim(),
      };

      if (isEditing) {
        await journalService.updateJournal(id, payload);
      } else {
        await journalService.createJournal(payload);
      }

      navigate('/journal');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save entry.');
    } finally {
      setSaving(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-bloom-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Back link */}
      <div className="flex items-center justify-between">
        <Link
          to="/journal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </Link>

        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Reflection Prompts Accordion / Selector */}
      <div className="p-4 rounded-2xl bg-lavender-50/70 dark:bg-slate-900/60 border border-lavender-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-lavender-600 dark:text-lavender-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Need Inspiration? Select a Reflection Prompt
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {promptsList.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => applyPrompt(item.prompt)}
              className="text-left text-xs px-3 py-1.5 rounded-xl bg-white dark:bg-slate-850 border border-lavender-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:border-lavender-400 hover:bg-lavender-50/50 transition-colors"
            >
              "{item.prompt}"
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Entry Title & Prompt info */}
        <div className="p-6 rounded-3xl glass-card space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Entry Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quiet morning reflections, stepping into clarity..."
              className="input-field text-base font-bold"
            />
          </div>

          {prompt && (
            <div className="p-3 rounded-xl bg-bloom-50 dark:bg-bloom-950/40 border border-bloom-200 dark:border-bloom-850 flex items-center justify-between text-xs text-bloom-800 dark:text-bloom-300">
              <span className="italic">Guided Prompt: "{prompt}"</span>
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="text-slate-400 hover:text-rose-500 font-bold ml-2"
              >
                ×
              </button>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-bloom-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 rounded-3xl glass-card space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Your Reflection
            </label>
            <span className="text-xs text-slate-400 font-medium">{wordCount} words</span>
          </div>

          <textarea
            rows={10}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write freely. This space is entirely yours to express feelings, celebrate small wins, or unpack what made today memorable..."
            className="input-field text-sm leading-relaxed"
          />
        </div>

        {/* Gratitude & Positive Moments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gratitude List */}
          <div className="p-6 rounded-3xl glass-card space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Things I am Grateful For</span>
              </label>
              {gratitudeNotes.length < 5 && (
                <button
                  type="button"
                  onClick={addGratitudeField}
                  className="text-xs font-semibold text-bloom-600 dark:text-bloom-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add bullet</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {gratitudeNotes.map((note, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{idx + 1}.</span>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => handleGratitudeChange(idx, e.target.value)}
                    placeholder={`Gratitude #${idx + 1}`}
                    className="input-field text-xs py-2 flex-1"
                  />
                  {gratitudeNotes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGratitudeField(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Positive Moments */}
          <div className="p-6 rounded-3xl glass-card space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Positive Moment Highlight</span>
            </label>

            <div className="space-y-2">
              <input
                type="text"
                value={positiveMoments[0] || ''}
                onChange={(e) => handlePositiveMomentChange(0, e.target.value)}
                placeholder="A small moment that brought light today..."
                className="input-field text-xs py-2"
              />
              <p className="text-[11px] text-slate-400 leading-normal">
                Anchoring even one uplifting memory trains our mind toward resilience and warmth.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/journal" className="btn-secondary text-sm px-6 py-2.5">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-sm px-8 py-2.5 shadow-md shadow-bloom-500/20"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving entry...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Update Entry' : 'Save Reflection'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JournalEditorPage;
