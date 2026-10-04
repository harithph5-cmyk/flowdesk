import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  CheckSquare,
  Calendar,
  FolderGit2,
  Flame,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useApp, NavTab } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    meetings,
    projects,
    setActiveTab,
    startFocusOnTask,
    setSelectedTaskForEdit,
    setIsTaskModalOpen,
    setSelectedMeetingForEdit,
    setIsMeetingModalOpen,
    setIsSmartPlanOpen,
    setIsDailyReviewOpen,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results
  const matchedTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(q))
  ).slice(0, 5);

  const matchedMeetings = meetings.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.client?.toLowerCase().includes(q) ||
      m.notes?.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  ).slice(0, 3);

  const handleSelectTask = (taskId: string) => {
    const t = tasks.find((item) => item.id === taskId);
    if (t) {
      setSelectedTaskForEdit(t);
      setIsTaskModalOpen(true);
    }
    setIsCommandPaletteOpen(false);
  };

  const handleSelectMeeting = (mId: string) => {
    const m = meetings.find((item) => item.id === mId);
    if (m) {
      setSelectedMeetingForEdit(m);
      setIsMeetingModalOpen(true);
    }
    setIsCommandPaletteOpen(false);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search anything..."
            className="flex-1 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
          />
          <kbd className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            ESC
          </kbd>
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions (Always visible or filtered) */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick Actions
            </span>
            <div className="space-y-0.5 pt-1">
              <button
                onClick={() => handleAction(() => setIsSmartPlanOpen(true))}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="font-semibold">✨ Plan My Day with AI</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  const active = tasks.find((t) => t.status !== 'completed');
                  if (active) handleAction(() => startFocusOnTask(active.id));
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold">Start Distraction-Free Focus</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => handleAction(() => setIsDailyReviewOpen(true))}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Open Daily Review</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Matched Tasks */}
          {matchedTasks.length > 0 && (
            <div className="space-y-1">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tasks ({matchedTasks.length})
              </span>
              <div className="space-y-0.5 pt-1">
                {matchedTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTask(t.id)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckSquare className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="truncate font-semibold">{t.title}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
                      {t.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Meetings */}
          {matchedMeetings.length > 0 && (
            <div className="space-y-1">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Meetings ({matchedMeetings.length})
              </span>
              <div className="space-y-0.5 pt-1">
                {matchedMeetings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMeeting(m.id)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="truncate font-semibold">{m.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {m.client || m.startTime}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Projects */}
          {matchedProjects.length > 0 && (
            <div className="space-y-1">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Projects ({matchedProjects.length})
              </span>
              <div className="space-y-0.5 pt-1">
                {matchedProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveTab('projects');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderGit2 className="w-4 h-4 text-purple-500 shrink-0" />
                      <span className="truncate font-semibold">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {p.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
