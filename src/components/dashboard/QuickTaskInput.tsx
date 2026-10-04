import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  FolderGit2,
  Tag,
  AlignLeft,
  ChevronDown,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayDateString } from '../../utils/date';
import { Priority } from '../../types';
import { parseNaturalLanguageInput } from '../../utils/aiParser';

export const QuickTaskInput: React.FC = () => {
  const { addTask, projects } = useApp();

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [projectId, setProjectId] = useState<string>(projects[0]?.id || 'proj-codelytix');
  const [dueDate, setDueDate] = useState<string>(getTodayDateString());
  const [dueTime, setDueTime] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [detectedAiPrompt, setDetectedAiPrompt] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);

    // Live AI Natural Language detection hint
    if (val.length > 5) {
      const parsed = parseNaturalLanguageInput(val, projects);
      if (parsed.type === 'task' && parsed.taskData) {
        if (parsed.taskData.priority && parsed.taskData.priority !== priority) {
          setDetectedAiPrompt(`Auto-detected: ${parsed.taskData.priority.toUpperCase()} priority`);
        } else if (parsed.taskData.dueDate && parsed.taskData.dueDate !== dueDate) {
          setDetectedAiPrompt(`Auto-detected date: ${parsed.taskData.dueDate}`);
        } else {
          setDetectedAiPrompt(null);
        }
      } else {
        setDetectedAiPrompt(null);
      }
    } else {
      setDetectedAiPrompt(null);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    // Run natural language parser in case user typed "Tomorrow I need to..."
    const parsed = parseNaturalLanguageInput(title, projects);
    let finalTitle = title.trim();
    let finalDate = dueDate;
    let finalPriority = priority;
    let finalProjectId = projectId;
    let finalTime = dueTime || undefined;

    if (parsed.type === 'task' && parsed.taskData) {
      if (parsed.taskData.title) finalTitle = parsed.taskData.title;
      if (parsed.taskData.dueDate) finalDate = parsed.taskData.dueDate;
      if (parsed.taskData.priority) finalPriority = parsed.taskData.priority;
      if (parsed.taskData.projectId) finalProjectId = parsed.taskData.projectId;
      if (parsed.taskData.dueTime) finalTime = parsed.taskData.dueTime;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addTask({
      title: finalTitle,
      description: notes.trim() || undefined,
      status: 'todo',
      priority: finalPriority,
      projectId: finalProjectId,
      tags: tags.length > 0 ? tags : [finalPriority],
      dueDate: finalDate,
      dueTime: finalTime,
      estimatedDuration: 45,
    });

    // Reset form
    setTitle('');
    setNotes('');
    setTagsInput('');
    setDueTime('');
    setDetectedAiPrompt(null);
    setIsExpanded(false);
  };

  const priorityOptions: { value: Priority; label: string; icon: string; color: string }[] = [
    { value: 'urgent', label: 'Urgent', icon: '🔴', color: 'hover:bg-rose-50 text-rose-700' },
    { value: 'high', label: 'High', icon: '🟠', color: 'hover:bg-orange-50 text-orange-700' },
    { value: 'medium', label: 'Medium', icon: '🟡', color: 'hover:bg-amber-50 text-amber-700' },
    { value: 'low', label: 'Low', icon: '🟢', color: 'hover:bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-3.5 sm:p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Large Input Box */}
        <div className="flex items-center gap-3">
          <div className="p-2 text-indigo-600 bg-indigo-50 rounded-xl">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <input
            type="text"
            value={title}
            onChange={handleInputChange}
            onFocus={() => setIsExpanded(true)}
            placeholder="What are you working on? (e.g., Tomorrow I need to finish Beyond Books website)"
            className="flex-1 text-base sm:text-lg font-medium text-slate-800 placeholder:text-slate-400 bg-transparent border-none outline-none focus:ring-0"
          />

          <button
            type="submit"
            disabled={!title.trim()}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-indigo-200"
          >
            <span>Add Task</span>
            <kbd className="text-[10px] bg-indigo-500/50 px-1 rounded">↵</kbd>
          </button>
        </div>

        {/* AI Helper Banner */}
        {detectedAiPrompt && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50/70 px-3 py-1.5 rounded-lg border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{detectedAiPrompt}</span>
          </div>
        )}

        {/* Expandable Quick Selectors */}
        {(isExpanded || title.length > 0) && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            <div className="flex flex-wrap items-center gap-2">
              {/* Priority Picker */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {priorityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                      priority === opt.value
                        ? 'bg-white shadow-xs text-slate-900 border border-slate-200'
                        : opt.color
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span className="hidden xs:inline">{opt.label}</span>
                  </button>
                ))}
              </div>

              {/* Project Picker */}
              <div className="relative">
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium py-1.5 pl-7 pr-7 rounded-xl text-xs outline-none cursor-pointer"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
                <FolderGit2 className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              {/* Due Date */}
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium py-1.5 pl-7 pr-2 rounded-xl text-xs outline-none cursor-pointer"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
              </div>

              {/* Due Time */}
              <div className="relative">
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="Due Time"
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium py-1.5 pl-7 pr-2 rounded-xl text-xs outline-none cursor-pointer"
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Tags and Notes toggle */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tags (comma separated)..."
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl text-xs outline-none w-36 sm:w-44"
              />

              <button
                type="button"
                onClick={() => setNotes((prev) => (prev ? '' : 'Notes: '))}
                className={`p-1.5 rounded-lg border text-slate-500 hover:text-slate-800 transition-colors ${
                  notes ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200'
                }`}
                title="Add notes"
              >
                <AlignLeft className="w-4 h-4" />
              </button>

              <button
                type="submit"
                disabled={!title.trim()}
                className="sm:hidden px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs"
              >
                Add
              </button>
            </div>

            {/* Expanded Notes field */}
            {notes !== '' && (
              <div className="w-full pt-1">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any extra notes or requirements..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-indigo-400"
                />
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
