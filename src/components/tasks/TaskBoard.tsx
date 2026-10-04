import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
  SlidersHorizontal,
  FolderGit2,
} from 'lucide-react';
import { Task, Priority } from '../../types';
import { useApp } from '../../context/AppContext';
import { TaskCard } from './TaskCard';
import { getTodayDateString } from '../../utils/date';

export type TaskTab = 'today' | 'upcoming' | 'overdue' | 'completed';

export const TaskBoard: React.FC = () => {
  const {
    tasks,
    projects,
    reorderTasks,
    setSelectedTaskForEdit,
    setIsTaskModalOpen,
    selectedProjectId,
    setSelectedProjectId,
    selectedPriority,
    setSelectedPriority,
    searchQuery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TaskTab>('today');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const todayStr = getTodayDateString();

  // Categorize tasks for tabs
  const filterByCommon = (taskList: Task[]) => {
    return taskList.filter((t) => {
      // Filter by project
      if (selectedProjectId && t.projectId !== selectedProjectId) return false;
      // Filter by priority
      if (selectedPriority && t.priority !== selectedPriority) return false;
      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = t.description?.toLowerCase().includes(q) || false;
        const matchTag = t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTag) return false;
      }
      return true;
    });
  };

  const todayTasks = filterByCommon(
    tasks.filter((t) => t.status !== 'completed' && t.dueDate === todayStr)
  );

  const upcomingTasks = filterByCommon(
    tasks.filter((t) => t.status !== 'completed' && t.dueDate > todayStr)
  );

  const overdueTasks = filterByCommon(
    tasks.filter((t) => t.status !== 'completed' && t.dueDate < todayStr)
  );

  const completedTasks = filterByCommon(
    tasks.filter((t) => t.status === 'completed')
  );

  // Tab definitions
  const tabs: { id: TaskTab; label: string; count: number; icon: React.ReactNode; color: string }[] = [
    {
      id: 'today',
      label: 'Today',
      count: todayTasks.length,
      icon: <CheckSquare className="w-4 h-4" />,
      color: 'text-indigo-600',
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: upcomingTasks.length,
      icon: <Clock className="w-4 h-4" />,
      color: 'text-blue-600',
    },
    {
      id: 'overdue',
      label: 'Overdue',
      count: overdueTasks.length,
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      color: 'text-rose-600',
    },
    {
      id: 'completed',
      label: 'Completed',
      count: completedTasks.length,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      color: 'text-emerald-600',
    },
  ];

  // Current tab items
  const getCurrentList = () => {
    switch (activeTab) {
      case 'today':
        return todayTasks;
      case 'upcoming':
        return upcomingTasks;
      case 'overdue':
        return overdueTasks;
      case 'completed':
        return completedTasks;
    }
  };

  const currentList = getCurrentList();

  // Drag and drop ordering
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const currentTaskIndex = tasks.findIndex((t) => t.id === draggedTaskId);
    const targetTaskIndex = tasks.findIndex((t) => t.id === targetId);

    if (currentTaskIndex === -1 || targetTaskIndex === -1) return;

    const newTasks = [...tasks];
    const [moved] = newTasks.splice(currentTaskIndex, 1);
    newTasks.splice(targetTaskIndex, 0, moved);

    reorderTasks(newTasks);
    setDraggedTaskId(null);
  };

  const handleEdit = (task: Task) => {
    setSelectedTaskForEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTaskForEdit(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header with Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : tab.id === 'overdue' && tab.count > 0
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter controls & Add Task */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Project Filter */}
          <div className="relative">
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value ? e.target.value : null)}
              className="bg-white border border-slate-200 text-slate-700 font-medium py-1.5 pl-7 pr-6 rounded-xl outline-none hover:border-slate-300"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <FolderGit2 className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={selectedPriority || ''}
              onChange={(e) => setSelectedPriority(e.target.value ? (e.target.value as Priority) : null)}
              className="bg-white border border-slate-200 text-slate-700 font-medium py-1.5 pl-7 pr-6 rounded-xl outline-none hover:border-slate-300"
            >
              <option value="">All Priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>

          {(selectedProjectId || selectedPriority) && (
            <button
              onClick={() => {
                setSelectedProjectId(null);
                setSelectedPriority(null);
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1"
            >
              Clear
            </button>
          )}

          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-semibold rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Task List / Empty State */}
      {currentList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            {activeTab === 'completed' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : (
              <CheckSquare className="w-6 h-6" />
            )}
          </div>
          <div>
            <h5 className="font-semibold text-slate-800">No tasks in {activeTab}</h5>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {activeTab === 'completed'
                ? 'Tasks you check off will appear here for review and daily reflection.'
                : 'All clear! Add a task using the quick input above or relax.'}
            </p>
          </div>
          {activeTab !== 'completed' && (
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {currentList.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
};
