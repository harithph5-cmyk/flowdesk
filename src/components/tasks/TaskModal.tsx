import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, FolderGit2, Tag, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, Priority, TaskStatus } from '../../types';
import { getTodayDateString } from '../../utils/date';

export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    setIsTaskModalOpen,
    selectedTaskForEdit,
    setSelectedTaskForEdit,
    addTask,
    updateTask,
    projects,
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [projectId, setProjectId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(getTodayDateString());
  const [dueTime, setDueTime] = useState<string>('');
  const [estimatedDuration, setEstimatedDuration] = useState<number>(45);
  const [tagsInput, setTagsInput] = useState<string>('');

  useEffect(() => {
    if (selectedTaskForEdit) {
      setTitle(selectedTaskForEdit.title);
      setDescription(selectedTaskForEdit.description || '');
      setPriority(selectedTaskForEdit.priority);
      setStatus(selectedTaskForEdit.status);
      setProjectId(selectedTaskForEdit.projectId);
      setDueDate(selectedTaskForEdit.dueDate);
      setDueTime(selectedTaskForEdit.dueTime || '');
      setEstimatedDuration(selectedTaskForEdit.estimatedDuration || 45);
      setTagsInput(selectedTaskForEdit.tags?.join(', ') || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
      setProjectId(projects[0]?.id || 'proj-codelytix');
      setDueDate(getTodayDateString());
      setDueTime('');
      setEstimatedDuration(45);
      setTagsInput('');
    }
  }, [selectedTaskForEdit, projects, isTaskModalOpen]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (selectedTaskForEdit) {
      updateTask(selectedTaskForEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        projectId,
        dueDate,
        dueTime: dueTime || undefined,
        estimatedDuration,
        tags: tags.length > 0 ? tags : [priority],
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        projectId,
        dueDate,
        dueTime: dueTime || undefined,
        estimatedDuration,
        tags: tags.length > 0 ? tags : [priority],
      });
    }

    setIsTaskModalOpen(false);
    setSelectedTaskForEdit(null);
  };

  const handleClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskForEdit(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {selectedTaskForEdit ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finish Google Ads Training PPT"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-semibold outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key objectives, links, or notes..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-xs text-slate-700 outline-none transition-all resize-none"
            />
          </div>

          {/* Priority & Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
              >
                <option value="urgent">🔴 Urgent</option>
                <option value="high">🟠 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Project & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
              />
            </div>
          </div>

          {/* Due Time & Estimated Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Due Time (Optional)
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Est. Duration (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={480}
                step={5}
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none bg-white"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. SEO, Client, Slides"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-200"
            >
              {selectedTaskForEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
