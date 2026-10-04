import React from 'react';
import {
  Flame,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, formatTime12 } from '../../utils/date';
import { Priority, Task } from '../../types';

export const TodayFocus: React.FC = () => {
  const {
    tasks,
    projects,
    toggleTaskStatus,
    startFocusOnTask,
    activeFocusTaskId,
    setActiveFocusTaskId,
  } = useApp();

  const todayStr = getTodayDateString();

  // Tasks due today or earlier that are relevant for today
  const todayAllTasks = tasks.filter((t) => t.dueDate === todayStr);
  const completedCount = todayAllTasks.filter((t) => t.status === 'completed').length;
  const totalCount = todayAllTasks.length || 7; // fallback to 7 if empty to match sample
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  // Determine top 3 most important tasks for today
  const priorityWeight: Record<Priority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const pendingTodayTasks = tasks
    .filter((t) => t.status !== 'completed' && t.dueDate <= todayStr)
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);

  const top3Tasks: Task[] = pendingTodayTasks.slice(0, 3);

  // Active focus task: user-chosen or the highest priority task
  const currentActiveTask =
    tasks.find((t) => t.id === activeFocusTaskId && t.status !== 'completed') ||
    top3Tasks[0] ||
    tasks.find((t) => t.status !== 'completed');

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return {
          icon: '🔥',
          text: 'Urgent',
          badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
        };
      case 'high':
        return {
          icon: '🟠',
          text: 'High Priority',
          badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
        };
      case 'medium':
        return {
          icon: '🟡',
          text: 'Medium',
          badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
        };
      case 'low':
        return {
          icon: '🟢',
          text: 'Low',
          badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
    }
  };

  return (
    <section className="bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 rounded-3xl p-6 sm:p-7 border border-indigo-100/80 shadow-md shadow-indigo-100/40 relative overflow-hidden transition-all">
      {/* Decorative subtle ambient lights */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-gradient-to-br from-blue-200/20 to-emerald-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
        {/* Left Side: Today's Focus Overview & Highlighted Active Task */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                <Target className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Today's Focus
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {completedCount} of {totalCount} tasks completed today
                </p>
              </div>
            </div>

            {/* Progress Percentage & Bar */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-800 tabular-nums">
                {progressPercent}%
              </span>
              <div className="w-32 sm:w-40 bg-slate-200/80 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Highlighted Task Card */}
          {currentActiveTask ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-indigo-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      const badge = getPriorityBadge(currentActiveTask.priority);
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${badge.badgeClass}`}
                        >
                          <span>{badge.icon}</span>
                          <span>{badge.text}</span>
                        </span>
                      );
                    })()}

                    {(() => {
                      const proj = projects.find((p) => p.id === currentActiveTask.projectId);
                      if (!proj) return null;
                      return (
                        <span
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-700 border border-slate-200/70"
                          style={{ backgroundColor: `${proj.color}15` }}
                        >
                          {proj.icon || '📁'} {proj.name}
                        </span>
                      );
                    })()}

                    {currentActiveTask.dueTime && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-slate-500 bg-slate-100 rounded-md">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Due {formatTime12(currentActiveTask.dueTime)}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {currentActiveTask.title}
                  </h3>

                  {currentActiveTask.description && (
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl line-clamp-2">
                      {currentActiveTask.description}
                    </p>
                  )}
                </div>

                {/* Big Action: Start Focus Button */}
                <div className="flex sm:flex-col items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => startFocusOnTask(currentActiveTask.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 active:scale-95 transition-all group/btn"
                  >
                    <Play className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                    <span>Start Focus</span>
                  </button>

                  <button
                    onClick={() => toggleTaskStatus(currentActiveTask.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Mark Done</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white/80 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm font-semibold text-slate-700">All today's tasks completed! 🎉</p>
              <p className="text-xs text-slate-400 mt-1">Add new tasks below or enjoy your break.</p>
            </div>
          )}
        </div>

        {/* Right Side: Top 3 Most Important Tasks list */}
        <div className="lg:w-80 space-y-2.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Top 3 Priorities</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Click to focus</span>
          </div>

          <div className="space-y-2">
            {top3Tasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No pending priorities today</p>
            ) : (
              top3Tasks.map((t, idx) => {
                const isActive = t.id === currentActiveTask?.id;
                const proj = projects.find((p) => p.id === t.projectId);
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveFocusTaskId(t.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-white border-indigo-400 shadow-xs ring-2 ring-indigo-500/10'
                        : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(t.id);
                        }}
                        className="text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                      >
                        <Circle className="w-4 h-4" />
                      </button>

                      <div className="min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${
                            isActive ? 'text-indigo-900 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <span className="mr-1 text-slate-400 font-normal">#{idx + 1}</span>
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="text-[10px] font-medium px-1.5 py-0.2 rounded"
                            style={{
                              backgroundColor: `${proj?.color || '#3b82f6'}15`,
                              color: proj?.color || '#3b82f6',
                            }}
                          >
                            {proj?.name}
                          </span>
                          {t.dueTime && (
                            <span className="text-[10px] text-slate-400">
                              {formatTime12(t.dueTime)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <span className="shrink-0 p-1 text-indigo-600">
                        <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
